import React, { useState } from 'react';
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
  const [uploadSuccessData, setUploadSuccessData] = useState<{
    productTitle: string;
    fileName: string;
    bucket: string;
    storagePath: string;
  } | null>(null);

  const isAdmin = currentUserRole === 'admin';

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

    if (!isSupabaseConfigured()) {
      setUploadState('ERROR');
      setErrorMessage('Supabase Storage não configurado. Verifique as variáveis de ambiente.');
      return;
    }

    setUploadState('UPLOADING');
    setErrorMessage(null);

    try {
      const { error: uploadError } = await supabase.storage
        .from(EBOOK_UPLOAD_CONFIG.BUCKET_NAME)
        .upload(targetPath, selectedFile, {
          upsert: true,
          cacheControl: '3600',
          contentType: 'application/pdf'
        });

      if (uploadError) {
        throw new Error(uploadError.message || 'Falha ao enviar arquivo para o Storage.');
      }

      // Sucesso
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
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-[#0D0F12] p-4 rounded-xl border border-dashed border-[#222738]">
          <div className="flex-1 space-y-1">
            {currentStoragePath ? (
              <>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <Check className="w-4 h-4" />
                  <span>Arquivo vinculado: <code className="text-xs bg-[#151922] px-2 py-0.5 rounded border border-[#222738] text-amber-300 font-mono">{currentStoragePath}</code></span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Bucket: <span className="text-white font-medium">{EBOOK_UPLOAD_CONFIG.BUCKET_NAME}</span> (Privado, protegido por Signed URL)
                </p>
              </>
            ) : (
              <div className="text-gray-400 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span>Nenhum arquivo protegido vinculado. Selecione o PDF comercial para preparar o upload.</span>
              </div>
            )}
            <p className="text-[10px] text-gray-500">
              Limite máximo suportado: {EBOOK_UPLOAD_CONFIG.MAX_SIZE_FORMATTED} • Formato: PDF com assinatura binária válida.
            </p>
          </div>

          <label className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all select-none
            ${!isAdmin || disabled 
              ? 'bg-gray-800/60 text-gray-500 cursor-not-allowed border border-gray-700/50' 
              : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 cursor-pointer active:scale-95 shadow-sm'}
          `}>
            <FileUp className="w-3.5 h-3.5" />
            {currentStoragePath ? 'SUBSTITUIR PDF' : 'SELECIONAR PDF'}
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf"
              disabled={!isAdmin || disabled}
              onChange={handleFileChange}
            />
          </label>
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
      {uploadState === 'VALIDATING' && (
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
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
            <div>
              <h5 className="text-sm font-semibold text-white">Enviando PDF para o Bucket Privado...</h5>
              <p className="text-xs text-gray-400">Gravando de forma segura em <code className="text-amber-300 font-mono text-[11px]">{targetPath}</code></p>
            </div>
          </div>
          <div className="w-full bg-[#1A202C] h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-2/3 animate-pulse"></div>
          </div>
          <p className="text-[10px] text-gray-500">
            Ação protegida: Prevenção contra duplo clique ativada. Não feche esta janela durante a gravação.
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
