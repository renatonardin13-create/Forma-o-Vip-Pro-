import { supabase, isSupabaseConfigured } from './supabase';

export type EbookUploadState = 
  | 'IDLE' 
  | 'SELECTED' 
  | 'VALIDATING' 
  | 'UPLOADING' 
  | 'SUCCESS' 
  | 'ERROR' 
  | 'CANCELLED';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  details?: {
    name: string;
    size: number;
    mimeType: string;
    formattedSize: string;
  };
}

export const EBOOK_UPLOAD_CONFIG = {
  MIN_SIZE_BYTES: 1024, // 1 KB mínimo para evitar arquivos corrompidos ou placeholders
  MAX_SIZE_BYTES: 50 * 1024 * 1024, // 50 MB (limite seguro padrão do Supabase Storage)
  MAX_SIZE_FORMATTED: '50 MB',
  ALLOWED_MIME: 'application/pdf',
  ALLOWED_EXT: '.pdf',
  BUCKET_NAME: 'ebooks'
};

/**
 * Gera um storage_path determinístico e sanitizado contra path traversal (../).
 * Para o produto oficial 'prod-depois-dos-60-real', o destino é cravado em:
 * 'prod-depois-dos-60-real/depois-dos-60-50-cuidados.pdf'.
 * Para futuros produtos, gera '<sanitized_product_id>/<sanitized_filename>.pdf'.
 */
export function generateEbookStoragePath(productId: string, originalFileName: string): string {
  // Prevenção de Path Traversal: Proíbe estritamente '..', barras e caracteres de escape
  const cleanId = (productId || 'ebook')
    .replace(/\.\./g, '')
    .replace(/[/\\]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .toLowerCase();

  const isDepoisDos60 = cleanId === 'prod-depois-dos-60-real' ||
    originalFileName.toLowerCase().includes('depois') ||
    originalFileName.toLowerCase().includes('cuidado') ||
    originalFileName.toLowerCase().includes('idoso') ||
    originalFileName.toLowerCase().includes('terceira idade');

  if (isDepoisDos60) {
    return 'prod-depois-dos-60-real/depois-dos-60-50-cuidados.pdf';
  }

  // Sanitização determinística do nome do arquivo para futuros produtos
  const nameWithoutExt = originalFileName
    .replace(/\.[^/.]+$/, '')
    .replace(/\.\./g, '')
    .replace(/[/\\]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .toLowerCase();

  const finalName = nameWithoutExt.length > 0 ? nameWithoutExt : 'ebook-document';
  return `${cleanId}/${finalName}.pdf`;
}

/**
 * Validação rigorosa do arquivo selecionado:
 * - Extensão .pdf
 * - MIME type application/pdf
 * - Tamanho mínimo (>= 1KB)
 * - Tamanho máximo (<= 50MB)
 * - Assinatura binária / Magic Bytes (%PDF-)
 */
export async function validateEbookFile(file: File): Promise<FileValidationResult> {
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo fornecido.' };
  }

  // 1. Validação de extensão
  const lowerName = file.name.toLowerCase();
  if (!lowerName.endsWith('.pdf')) {
    return { 
      valid: false, 
      error: `Extensão inválida. O arquivo deve terminar com .pdf. Formatos como executáveis, scripts ou imagens disfarçadas não são aceitos.` 
    };
  }

  // 2. Validação de MIME type
  if (file.type && file.type !== 'application/pdf') {
    return { 
      valid: false, 
      error: `MIME type inválido: "${file.type}". Esperado estritamente: "application/pdf".` 
    };
  }

  // 3. Validação de tamanho mínimo (evita arquivos vazios ou placeholders de bytes vazios)
  if (file.size < EBOOK_UPLOAD_CONFIG.MIN_SIZE_BYTES) {
    return { 
      valid: false, 
      error: `Arquivo vazio ou corrompido (${file.size} bytes). O tamanho mínimo para um e-book é de 1 KB.` 
    };
  }

  // 4. Validação de tamanho máximo
  if (file.size > EBOOK_UPLOAD_CONFIG.MAX_SIZE_BYTES) {
    return { 
      valid: false, 
      error: `Arquivo excede o limite máximo suportado de ${EBOOK_UPLOAD_CONFIG.MAX_SIZE_FORMATTED} (${(file.size / (1024 * 1024)).toFixed(1)} MB).` 
    };
  }

  // 5. Validação profunda de integridade: Magic Bytes (%PDF-)
  try {
    const slice = file.slice(0, 5);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    // %PDF- corresponde aos bytes hexadecimais 0x25, 0x50, 0x44, 0x46, 0x2D
    const header = String.fromCharCode(...bytes);
    if (!header.startsWith('%PDF-')) {
      return {
        valid: false,
        error: `Estrutura de arquivo inválida. O arquivo não inicia com a assinatura binária obrigatória de PDF (%PDF-). Arquivos disfarçados ou adulterados não são permitidos.`
      };
    }
  } catch (err: any) {
    return {
      valid: false,
      error: `Falha ao validar os dados binários do arquivo: ${err?.message || 'Erro de leitura'}`
    };
  }

  return {
    valid: true,
    details: {
      name: file.name,
      size: file.size,
      mimeType: file.type || 'application/pdf',
      formattedSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    }
  };
}

/**
 * Verifica se já existe um arquivo gravado no mesmo caminho do Storage
 */
export async function checkStorageFileExists(bucket: string, storagePath: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const parts = storagePath.split('/');
    const fileName = parts.pop();
    const folder = parts.join('/');
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, { search: fileName });

    if (error || !data) return false;
    return data.some(item => item.name === fileName);
  } catch {
    return false;
  }
}
