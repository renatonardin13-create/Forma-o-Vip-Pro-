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
  MAX_SIZE_BYTES: 100 * 1024 * 1024, // 100 MB (limite robusto para e-books ilustrados de alta qualidade)
  MAX_SIZE_FORMATTED: '100 MB',
  ALLOWED_MIME: 'application/pdf',
  ALLOWED_EXT: '.pdf',
  BUCKET_NAME: 'ebooks'
};

/**
 * Assinaturas binárias perigosas conhecidas (executáveis, scripts, archives renomeados)
 */
const FORBIDDEN_MAGIC_SIGNATURES = [
  { name: 'Windows Executable / DLL (MZ)', bytes: [0x4d, 0x5a] },
  { name: 'Linux Executable (ELF)', bytes: [0x7f, 0x45, 0x4c, 0x46] },
  { name: 'macOS Mach-O (32-bit)', bytes: [0xfe, 0xed, 0xfa, 0xce] },
  { name: 'macOS Mach-O (64-bit)', bytes: [0xfe, 0xed, 0xfa, 0xcf] },
  { name: 'macOS Mach-O / Java Class (Fat)', bytes: [0xca, 0xfe, 0xba, 0xbe] },
  { name: 'Shell Script / Shebang', bytes: [0x23, 0x21] }, // #!
  { name: 'ZIP / APK / Executable Archive', bytes: [0x50, 0x4b, 0x03, 0x04] }, // PK..
  { name: 'RAR Archive', bytes: [0x52, 0x61, 0x72, 0x21] }, // Rar!
  { name: '7-Zip Archive', bytes: [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c] }
];

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

  // Extrai estritamente o nome base do arquivo, descartando qualquer árvore de diretório
  const baseFileName = originalFileName.split(/[/\\]/).filter(Boolean).pop() || 'ebook-document.pdf';

  // Sanitização determinística do nome do arquivo para futuros produtos
  const nameWithoutExt = baseFileName
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

  // 5. Validação profunda de integridade: Anti-Malware e Magic Bytes (%PDF-)
  try {
    // Ler primeiros 8 KB para análise abrangente de cabeçalho e estrutura
    const sampleSize = Math.min(file.size, 8192);
    const slice = file.slice(0, sampleSize);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // 5.1 Verificar se coincide com assinaturas binárias de arquivos maliciosos ou executáveis
    for (const sig of FORBIDDEN_MAGIC_SIGNATURES) {
      let matches = true;
      for (let i = 0; i < sig.bytes.length; i++) {
        if (bytes[i] !== sig.bytes[i]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        return {
          valid: false,
          error: `Binário malicioso ou não permitido detectado: ${sig.name}. O upload para o bucket 'ebooks' foi abortado por segurança.`
        };
      }
    }

    // 5.2 Validação estrita do cabeçalho PDF (%PDF-)
    // %PDF- corresponde aos bytes hexadecimais 0x25, 0x50, 0x44, 0x46, 0x2D
    const headerPrefix = String.fromCharCode(...bytes.slice(0, 5));
    if (headerPrefix !== '%PDF-') {
      return {
        valid: false,
        error: `Estrutura de arquivo inválida. O arquivo não inicia com a assinatura binária obrigatória de PDF (%PDF-). Arquivos disfarçados ou adulterados são rejeitados.`
      };
    }

    // 5.3 Validação de especificação de versão do PDF (%PDF-1.[0-7])
    const headerText = String.fromCharCode(...bytes.slice(0, 16));
    const versionMatch = headerText.match(/%PDF-([0-9]+\.[0-9]+)/);
    if (!versionMatch) {
      return {
        valid: false,
        error: `Versão do formato PDF não identificada no cabeçalho do arquivo.`
      };
    }

    // 5.4 Varredura anti-payload malicioso em PDF (ex: chamadas diretas /Launch para execução de código no OS)
    const textContent = String.fromCharCode(...bytes);
    if (textContent.includes('/Launch') && (textContent.includes('/Action') || textContent.includes('/Win'))) {
      return {
        valid: false,
        error: `Risco de segurança detectado: o arquivo PDF contém diretivas de execução de binários externos (/Launch /Action). Upload bloqueado.`
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
