import React, { useState, useEffect } from 'react';
import { 
  FileUp, 
  Check, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  FileText, 
  XCircle, 
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { 
  EbookUploadState, 
  validateEbookFile, 
  generateEbookStoragePath, 
  checkStorageFileExists,
  EBOOK_UPLOAD_CONFIG,
  FileValidationResult 
} from '../../services/ebookUploadService';

interface EbookUploadControlProps {
  productId: string;
  productTitle: string;
  currentStoragePath?: string;
  currentUserRole?: string;
  onStoragePathUpdated: (newStoragePath: string, pageCount?: number) => void;
  disabled?: boolean;
}

export const EbookUploadControl: React.FC<EbookUploadControlProps> = ({
  productId,
  productTitle,
  currentStoragePath,
  currentUserRole,
  onStoragePathUpdated,
  disabled = false
}) => {
  const [uploadState, setUploadState] = useState<EbookUploadState>('IDLE');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<FileValidationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetPath, setTargetPath] = useState<string>('');
  const [fileExistsInStorage, setFileExistsInStorage] = useState(false);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [checkingExisting, setCheckingExisting] = useState(false);
  const [physicalFileConfirmed, setPhysicalFileConfirmed] = useState<boolean | null>(null);
  const [uploadSuccessData, setUploadSuccessData] = useState<{
    productTitle: string;
    fileName: string;
    bucket: string;
    storagePath: string;
  } | null>(null);

  const isAdmin = currentUserRole === 'admin';

  // Verifica se o currentStoragePath existe fisicamente no bucket do Supabase
  useEffect(() => {
    let isMounted = true;
    if (currentStoragePath && isSupabaseConfigured()) {
      setCheckingExisting(true);
      checkStorageFileExists(EBOOK_UPLOAD_CONFIG.BUCKET_NAME, currentStoragePath)
        .then(exists => {
          if (isMounted) {
            setPhysicalFileConfirmed(exists);
            setCheckingExisting(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setPhysicalFileConfirmed(false);
            setCheckingExisting(false);
          }
        });
    } else {
      setPhysicalFileConfirmed(null);
      setCheckingExisting(false);
    }
    return () => { isMounted = false; };
  }, [currentStoragePath]);

  // 1. Seleção inicial do arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset de estados prévios
    setErrorMessage(null);
    setValidationResult(null);
    setShowOverwriteConfirm(false);
    setFileExistsInStorage(false);

    if (!isAdmin) {
      setUploadState('ERROR');
      setErrorMessage('Apenas administradores autenticados têm permissão para enviar e-books para o Storage.');
      return;
    }

    // Calcula o path determinístico seguro
    const deterministicPath = generateEbookStoragePath(productId, file.name);
    setTargetPath(deterministicPath);
    setSelectedFile(file);
    setUploadState('SELECTED');
  };

  // 2. Validação profunda do arquivo e verificação de integridade
  const handleValidateAndPrepare = async () => {
    if (!selectedFile) return;

    setUploadState('VALIDATING');
    setErrorMessage(null);

    try {
      const res = await validateEbookFile(selectedFile);
      setValidationResult(res);

      if (!res.valid) {
        setUploadState('ERROR');
        setErrorMessage(res.error || 'Arquivo não atende aos requisitos de validação.');
        return;
      }

      // Verifica se o objeto já existe no Storage
      if (isSupabaseConfigured()) {
        const exists = await checkStorageFileExists(EBOOK_UPLOAD_CONFIG.BUCKET_NAME, targetPath);
        setFileExistsInStorage(exists);
        if (exists) {
          setShowOverwriteConfirm(true);
        }
      }
    } catch (err: any) {
      setUploadState('ERROR');
      setErrorMessage(`Erro ao validar arquivo: ${err?.message || 'Falha de leitura'}`);
    }
  };

  // 3. Execução do upload futuro quando o administrador confirmar
  const handleExecuteUpload = async () => {
    if (!selectedFile || !targetPath) return;

    if (!isAdmin) {
      setUploadState('ERROR');
      setErrorMessage('Operação não permitida: Usuário sem privilégios de administrador.');
      return;
    }

    setUploadState('UPLOADING');
    setErrorMessage(null);
    setUploadProgress(0);

    try {
      // Diagnóstico Forense: Validar sessão antes do upload
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!isSupabaseConfigured()) {
        throw new Error('O Supabase não está configurado. Verifique as variáveis de ambiente.');
      }

      if (!session) {
        console.warn('Aviso: Nenhuma sessão Supabase Auth detectada. A tentativa de upload usará o acesso e dependerá exclusivamente das políticas (RLS) do bucket.');
      }
      
      // Fluxo Oficial: Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(EBOOK_UPLOAD_CONFIG.BUCKET_NAME)
        .upload(targetPath, selectedFile, {
          upsert: true,
          cacheControl: '3600',
          contentType: 'application/pdf',
          // @ts-ignore - utilizando o callback onUploadProgress suportado por algumas versões do SDK
          onUploadProgress: (progress: any) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          }
        });

      if (uploadError) {
        // Diagnóstico Forense
        const forensicErrorMsg = `[Supabase Storage Diagnostic] Ocorreu uma falha física de upload no Supabase Storage.\nStatus/Type: ${uploadError.name}\nMensagem Técnica Original do Supabase: "${uploadError.message}"\nOperação: UPLOAD_INSERT (upsert: true)\nBucket: ${EBOOK_UPLOAD_CONFIG.BUCKET_NAME}\nPath: ${targetPath}\nIsso normalmente ocorre quando o arquivo é grande demais (ex: > limite do bucket) ou, MAIS PROVÁVEL, quando as Políticas de Segurança (RLS) rejeitam a gravação (ex: "new row violates row-level security policy for table objects"). Verifique se seu usuário tem privilégio real de 'admin' na tabela public.perfis no Supabase.`;
        console.error(forensicErrorMsg);
        throw new Error(`Erro do Supabase: ${uploadError.message}. Consulte o console para diagnóstico completo.`);
      }

      // 10. APÓS UPLOAD - Verificar se o objeto existe fisicamente
      const exists = await checkStorageFileExists(EBOOK_UPLOAD_CONFIG.BUCKET_NAME, targetPath);
      if (!exists) {
        throw new Error('Falha grave: Upload foi relatado como concluído, mas o arquivo físico não foi encontrado no bucket.');
      }

      // Sucesso
      setUploadProgress(100);
      setPhysicalFileConfirmed(true);
      const fileName = targetPath.split('/').pop() || 'documento.pdf';
      const pageCount = productId === 'prod-depois-dos-60-real' ? 50 : undefined;

      setUploadSuccessData({
        productTitle,
        fileName,
        bucket: EBOOK_UPLOAD_CONFIG.BUCKET_NAME,
        storagePath: targetPath
      });

      setUploadState('SUCCESS');
      onStoragePathUpdated(targetPath, pageCount);
    } catch (err: any) {
      console.error('[EbookUpload] Falha:', err);
      setUploadState('ERROR');
      setErrorMessage(err?.message || 'Não foi possível concluir o upload. Verifique sua conexão e tente novamente.');
    }
  };

  // 4. Cancelamento e limpeza
  const handleCancel = () => {
    setUploadState('CANCELLED');
    setSelectedFile(null);
    setValidationResult(null);
    setErrorMessage(null);
    setShowOverwriteConfirm(false);
    setFileExistsInStorage(false);
    setTimeout(() => {
      setUploadState('IDLE');
    }, 1500);
  };

  const handleReset = () => {
    setUploadState('IDLE');
    setSelectedFile(null);
    setValidationResult(null);
    setErrorMessage(null);
    setShowOverwriteConfirm(false);
    setFileExistsInStorage(false);
  };

  return (
    <div className="space-y-4">
      {/* Informação sobre permissão administrativa */}
      {!isAdmin && (
        <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center gap-3 text-red-400 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Controle de upload bloqueado: apenas administradores do sistema podem enviar ou substituir arquivos de e-book.</span>
        </div>
      )}

      {/* ESTADO: IDLE */}
      {uploadState === 'IDLE' && (
        <div className="flex flex-col gap-3 bg-[#0D0F12] p-4 rounded-xl border border-dashed border-[#222738]">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-gray-300">Status do PDF no Storage:</span>
                {checkingExisting ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    <Loader2 className="w-3 h-3 animate-spin" /> Verificando presença física no bucket...
                  </span>
                ) : currentStoragePath && physicalFileConfirmed === true ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PDF VALIDADO E CONFIRMADO NO STORAGE
                  </span>
                ) : currentStoragePath && physicalFileConfirmed === false ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> PDF AINDA NÃO ENVIADO AO STORAGE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-gray-400 bg-gray-800 border border-gray-700 px-2.5 py-0.5 rounded-full">
                    <FileText className="w-3.5 h-3.5 text-gray-500" /> NENHUM PDF VINCULADO
                  </span>
                )}
              </div>

              {currentStoragePath ? (
                <div className="space-y-1 pt-1">
                  <div className="text-xs text-gray-300 flex flex-wrap items-center gap-1.5">
                    <span className="text-gray-400">Caminho Determinado:</span>
                    <code className="text-xs bg-[#151922] px-2 py-0.5 rounded border border-[#222738] text-amber-300 font-mono">
                      {EBOOK_UPLOAD_CONFIG.BUCKET_NAME}/{currentStoragePath}
                    </code>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {physicalFileConfirmed === true
                      ? 'O arquivo está fisicamente gravado no bucket privado e protegido contra downloads não autorizados.'
                      : 'O caminho do arquivo está mapeado no catálogo, mas o PDF físico ainda não existe no bucket. Faça o upload para ativá-lo.'}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 pt-1">
                  Nenhum arquivo PDF protegido foi enviado ou vinculado a este produto. Selecione o arquivo PDF comercial para preparar o upload.
                </p>
              )}

              <p className="text-[10px] text-gray-500 pt-1">
                Bucket: <span className="text-gray-300 font-medium">{EBOOK_UPLOAD_CONFIG.BUCKET_NAME}</span> (Privado, protegido por Signed URL) • Limite: {EBOOK_UPLOAD_CONFIG.MAX_SIZE_FORMATTED} • Formato obrigatório: PDF com assinatura binária válida.
              </p>
            </div>

            <label className={`
              flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all select-none whitespace-nowrap shrink-0
              ${!isAdmin || disabled 
                ? 'bg-gray-800/60 text-gray-500 cursor-not-allowed border border-gray-700/50' 
                : currentStoragePath && physicalFileConfirmed === false
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black border border-amber-400 shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 animate-pulse'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 hover:border-amber-400 cursor-pointer active:scale-95 shadow-sm'}
            `}>
              <FileUp className="w-4 h-4" />
              {currentStoragePath && physicalFileConfirmed === true 
                ? 'SUBSTITUIR PDF EXISTENTE' 
                : currentStoragePath && physicalFileConfirmed === false 
                  ? 'ENVIAR ARQUIVO PDF (UPLOAD)' 
                  : 'SELECIONAR ARQUIVO PDF'}
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf"
                disabled={!isAdmin || disabled}
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      )}

      {/* ESTADO: SELECTED */}
      {uploadState === 'SELECTED' && selectedFile && (
        <div className="bg-[#0D0F12] p-5 rounded-xl border border-amber-500/30 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                Arquivo Selecionado
              </span>
              <h5 className="text-sm font-semibold text-white break-all flex items-center gap-2 mt-1">
                <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                {selectedFile.name}
              </h5>
              <p className="text-xs text-gray-400">
                Tamanho: <span className="text-gray-200 font-medium">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span> • MIME: <span className="text-gray-200 font-medium">{selectedFile.type || 'application/pdf'}</span>
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#151922] rounded-lg border border-[#222738] text-xs space-y-1">
            <div className="text-gray-400 font-medium">Destino Determinístico Planejado:</div>
            <div className="text-amber-300 font-mono text-[11px] break-all">
              {EBOOK_UPLOAD_CONFIG.BUCKET_NAME}/{targetPath}
            </div>
            <div className="text-[10px] text-gray-500">
              * O caminho foi sanitizado contra path traversal e segue o padrão estrito do produto.
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleValidateAndPrepare}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold rounded-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              VALIDAR ARQUIVO
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-2 bg-[#1A202C] hover:bg-[#222A3B] text-gray-400 hover:text-white text-xs font-medium rounded-lg transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ESTADO: VALIDATING */}
      {uploadState === 'VALIDATING' && !validationResult?.valid && (
        <div className="bg-[#0D0F12] p-5 rounded-xl border border-blue-500/30 flex items-center gap-4">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin shrink-0" />
          <div className="space-y-0.5">
            <h5 className="text-sm font-semibold text-white">Validando estrutura do PDF...</h5>
            <p className="text-xs text-gray-400">
              Inspecionando assinatura binária (%PDF-), cabeçalhos de segurança, MIME type e limites de tamanho.
            </p>
          </div>
        </div>
      )}

      {/* ESTADO: VALIDATED / PRONTO PARA CONFIRMAR ENVIO */}
      {uploadState === 'VALIDATING' && validationResult?.valid && (
        <div className="bg-[#0D0F12] p-5 rounded-xl border border-emerald-500/40 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <Check className="w-4 h-4" />
            <span>Arquivo Validado com Sucesso</span>
          </div>

          <ul className="text-xs space-y-1 text-gray-300">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Assinatura binária (%PDF-) confirmada</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>MIME type: application/pdf</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tamanho ({validationResult.details?.formattedSize}) dentro do limite seguro</span>
            </li>
          </ul>

          {fileExistsInStorage && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2.5 text-amber-300 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Arquivo já existente no Storage</p>
                <p className="text-amber-200/80 text-[11px] mt-0.5">
                  Já existe um arquivo em <code className="font-mono">{targetPath}</code>. O novo arquivo substituirá com segurança o conteúdo anterior sem perda de vínculos.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleExecuteUpload}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              <FileUp className="w-3.5 h-3.5" />
              {fileExistsInStorage ? 'CONFIRMAR SUBSTITUIÇÃO NO STORAGE' : 'CONFIRMAR E ENVIAR PARA O STORAGE'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-2 bg-[#1A202C] hover:bg-[#222A3B] text-gray-400 hover:text-white text-xs font-medium rounded-lg transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ESTADO: UPLOADING */}
      {uploadState === 'UPLOADING' && (
        <div className="bg-[#0D0F12] p-5 rounded-xl border border-amber-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
              <div>
                <h5 className="text-sm font-semibold text-white">Enviando PDF para o Bucket Privado...</h5>
                <p className="text-xs text-gray-400">Gravando de forma segura em <code className="text-amber-300 font-mono text-[11px]">{targetPath}</code></p>
              </div>
            </div>
            <span className="text-amber-400 font-mono text-sm font-bold">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-[#1A202C] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-gray-500">
            Ação protegida: Prevenção contra duplo clique ativada. Não feche esta janela durante a gravação. Arquivos grandes podem levar alguns minutos.
          </p>
        </div>
      )}

      {/* ESTADO: SUCCESS (Feedback Administrativo Obrigatório - Seção 11) */}
      {uploadState === 'SUCCESS' && uploadSuccessData && (
        <div className="bg-[#0D0F12] p-5 rounded-xl border border-emerald-500/50 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Upload concluído com sucesso</span>
          </div>

          <div className="bg-[#151922] p-4 rounded-lg border border-[#222738] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Produto:</span>
              <span className="text-white font-medium text-right">{uploadSuccessData.productTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Arquivo:</span>
              <span className="text-amber-300 font-mono">{uploadSuccessData.fileName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Storage:</span>
              <span className="text-white font-medium">{uploadSuccessData.bucket}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-emerald-400 font-semibold">Arquivo protegido armazenado com sucesso.</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-[#1A202C] hover:bg-[#222A3B] text-gray-200 text-xs font-medium rounded-lg transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Concluir / Fechar Painel de Upload
          </button>
        </div>
      )}

      {/* ESTADO: ERROR */}
      {uploadState === 'ERROR' && (
        <div className="bg-[#0D0F12] p-5 rounded-xl border border-red-500/40 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-sm font-semibold text-red-300">Não foi possível preparar o upload</h5>
              <p className="text-xs text-red-200/90 leading-relaxed">
                {errorMessage || 'Ocorreu um erro ao validar o arquivo. Certifique-se de que é um documento PDF autêntico.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/60 border border-red-800 text-red-200 text-xs font-medium rounded-lg transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Tentar Novamente
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 bg-[#1A202C] text-gray-400 hover:text-white text-xs rounded-lg transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ESTADO: CANCELLED */}
      {uploadState === 'CANCELLED' && (
        <div className="p-3 bg-gray-900/60 border border-gray-800 rounded-xl flex items-center gap-2 text-gray-400 text-xs">
          <XCircle className="w-4 h-4 text-gray-500" />
          <span>Operação de upload cancelada pelo administrador.</span>
        </div>
      )}
    </div>
  );
};
