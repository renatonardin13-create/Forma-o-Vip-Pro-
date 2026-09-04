import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  ShieldAlert, 
  Loader2,
  FileText,
  Bookmark,
  Check,
  Maximize2,
  Minimize2,
  List,
  ExternalLink,
  Sparkles,
  Type,
  AlertCircle,
} from 'lucide-react';
import { DigitalProduct } from '../types';
import { useStore } from '../services/store';
import { getEbookStructuredContent, EbookContentRecord } from '../data/ebookContent';

interface EbookReaderModalProps {
  product: DigitalProduct;
  onClose: () => void;
}

export const EbookReaderModal: React.FC<EbookReaderModalProps> = ({ product, onClose }) => {
  const { currentUser, hasProductAccess, accessesLoaded, getEbookSignedUrl, isSupabaseEnabled } = useStore();
  
  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [viewMode, setViewMode] = useState<'reader' | 'pdf'>('reader');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [showToc, setShowToc] = useState(false);
  const [bookmarkedPage, setBookmarkedPage] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // Structured Content
  const structuredData: EbookContentRecord = getEbookStructuredContent(product);
  const totalPages = Math.max(structuredData.chapters.length, product.ebook?.pageCount || 5);
  const currentChapter = structuredData.chapters[Math.min(currentPage - 1, structuredData.chapters.length - 1)] || structuredData.chapters[0];

  // Authorization check (Defense in Depth)
  const canAccess = currentUser ? (currentUser.role === 'admin' || hasProductAccess(currentUser.id, product.id)) : false;

  // Safeguard: Ensure modal never hangs waiting for accessesLoaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const isReady = accessesLoaded || timedOut;

  // Carrega a Signed URL ou ativa o Leitor Digital Seguro
  useEffect(() => {
    let isMounted = true;

    async function loadSecureContent() {
      if (!isReady) return;
      
      if (!currentUser || !canAccess) {
        if (isMounted) {
          setSignedUrl(null);
          setFetchingUrl(false);
        }
        return;
      }

      setFetchingUrl(true);

      // 0. Se o arquivo foi subido em modo Local/Memória (URL começa com blob:)
      if (product.storagePath?.startsWith('blob:')) {
        if (isMounted) {
          setSignedUrl(product.storagePath);
          setViewMode('pdf');
          setFetchingUrl(false);
        }
        return;
      }

      // 1. Se houver storagePath e Supabase configurado, busca Signed URL
      if (product.storagePath && isSupabaseEnabled) {
        try {
          const url = await getEbookSignedUrl(product.id);
          if (url && isMounted) {
            setSignedUrl(url);
            setViewMode('pdf');
            setFetchingUrl(false);
            return;
          }
        } catch (err) {
          console.warn('[EbookReader] Assinatura remota não disponível no momento. Utilizando leitor digital estruturado:', err);
        }
      }

      // REGRA FASE 3.5: Para o produto real, o fluxo oficial DEVE ser Storage privado.
      // Se não houver storage_path, não podemos aceitar o link externo como substituto.
      if (product.id === 'prod-depois-dos-60-real' && !product.storagePath) {
        if (isMounted) {
          // Mantemos em null para forçar o fallback de segurança / leitor vazio
          setSignedUrl(null);
          setViewMode('reader');
          setFetchingUrl(false);
        }
        return;
      }

      // 2. Se houver pdfUrl direta configurada (Apenas para legado/demo de outros produtos)
      if (product.ebook?.pdfUrl && isMounted) {
        setSignedUrl(product.ebook.pdfUrl);
        setViewMode('pdf');
        setFetchingUrl(false);
        return;
      }

      // 3. Leitor Digital VIP Nativo (Default para leitura de alta qualidade)
      if (isMounted) {
        setSignedUrl(null);
        setViewMode('reader');
        setFetchingUrl(false);
      }
    }

    loadSecureContent();

    return () => {
      isMounted = false;
    };
  }, [product.id, product.storagePath, product.ebook?.pdfUrl, canAccess, isReady, currentUser, isSupabaseEnabled]);

  // Keyboard navigation
  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(p => p + 1);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      } else if (e.key === 'Escape') {
        if (showToc) setShowToc(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage, showToc, onClose]);

  // Toggle bookmark
  const toggleBookmark = () => {
    if (bookmarkedPage === currentPage) {
      setBookmarkedPage(null);
    } else {
      setBookmarkedPage(currentPage);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // 1. TELA DE CARREGAMENTO / AUTORIZAÇÃO (COM TIMEOUT SEGURO)
  if (!isReady || fetchingUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-[#08090C]/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in p-6">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-[#D4AF37] animate-pulse" />
          </div>
          <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin absolute -bottom-2 -right-2" />
        </div>
        <h3 className="text-base font-bold text-white mb-2">Preparando Ambiente de Leitura VIP</h3>
        <p className="text-xs text-gray-400 text-center max-w-sm">
          Sincronizando chave de acesso e carregando conteúdo de <span className="text-[#D4AF37] font-medium">{product.title}</span>...
        </p>
      </div>
    );
  }

  // 2. BLOQUEIO DE ACESSO (DEFENSE IN DEPTH)
  if (!canAccess) {
    return (
      <div className="fixed inset-0 z-50 bg-[#08090C]/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
        <div className="max-w-md w-full bg-[#0D0F12] border border-[#1D2230] rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500/20 via-rose-500 to-rose-500/20" />
          
          <div className="w-20 h-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20 shadow-inner">
            <Lock className="w-10 h-10 text-rose-500" />
          </div>
          
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold tracking-widest uppercase">
              Conteúdo Exclusivo
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Acesso Não Liberado</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Você ainda não possui a licença ativa para o e-book <strong className="text-white">"{product.title}"</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#131722] border border-[#1D2230] text-left text-xs space-y-2">
            <div className="text-gray-300 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> O que está incluído na sua área:
            </div>
            <ul className="text-gray-400 text-[11px] space-y-1 list-disc list-inside">
              <li>Leitura completa sem restrição de páginas</li>
              <li>Acesso ao material de apoio e protocolos práticos</li>
              <li>Visualização no leitor interativo noturno ou PDF</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-xl bg-[#151922] text-white font-bold hover:bg-[#1D2230] transition border border-[#1D2230] text-xs"
            >
              Voltar para a Área de Membros
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#586376] uppercase tracking-widest font-bold">
              <ShieldAlert className="w-3 h-3 text-gray-500" />
              SISTEMA DE SEGURANÇA HOMOLOGADO
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. LEITOR COMPLETO
  return (
    <div className="fixed inset-0 z-50 bg-[#060709] flex flex-col animate-in fade-in select-none">
      
      {/* HEADER SUPERIOR */}
      <header className="h-16 px-4 sm:px-6 bg-[#0B0D12] border-b border-[#1A1F2C] flex items-center justify-between z-30 shrink-0">
        
        {/* Lado Esquerdo: Identificação do Livro */}
        <div className="flex items-center gap-3 min-w-0 pr-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 shadow-sm">
            <BookOpen className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] font-bold text-[9px] uppercase tracking-wider">
                {product.category || 'E-book Oficial'}
              </span>
              <span className="text-[10px] text-gray-400 hidden sm:inline">• {structuredData.edition}</span>
            </div>
            <h1 className="text-white font-bold text-xs sm:text-sm truncate max-w-[260px] sm:max-w-md md:max-w-xl">
              {product.title}
            </h1>
          </div>
        </div>

        {/* Centro / Direita: Ferramentas de Leitura & Controles */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Alternador de Modo (se houver PDF carregado) */}
          {signedUrl && (
            <div className="hidden md:flex items-center bg-[#121620] border border-[#202738] rounded-xl p-1">
              <button
                onClick={() => setViewMode('reader')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'reader'
                    ? 'bg-[#D4AF37] text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Leitor VIP
              </button>
              <button
                onClick={() => setViewMode('pdf')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'pdf'
                    ? 'bg-[#D4AF37] text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                PDF Original
              </button>
            </div>
          )}

          {/* Sumário Button */}
          <button
            onClick={() => setShowToc(prev => !prev)}
            title="Índice de Capítulos"
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition ${
              showToc 
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' 
                : 'bg-[#121620] border-[#202738] text-gray-300 hover:text-white hover:bg-[#1A202E]'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden lg:inline font-medium">Capítulos</span>
          </button>

          {/* Ajuste de Fonte (Modo Leitor) */}
          {viewMode === 'reader' && (
            <button
              onClick={() => {
                if (fontSize === 'normal') setFontSize('large');
                else if (fontSize === 'large') setFontSize('xl');
                else setFontSize('normal');
              }}
              title="Ajustar Tamanho da Fonte"
              className="p-2 rounded-xl bg-[#121620] border border-[#202738] text-gray-300 hover:text-white hover:bg-[#1A202E] transition flex items-center gap-1"
            >
              <Type className="w-4 h-4" />
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase">
                {fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}
              </span>
            </button>
          )}

          {/* Marca-página */}
          <button
            onClick={toggleBookmark}
            title={bookmarkedPage === currentPage ? 'Remover marcador' : 'Marcar esta página'}
            className={`p-2 rounded-xl border text-xs transition ${
              bookmarkedPage === currentPage
                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                : 'bg-[#121620] border-[#202738] text-gray-400 hover:text-white hover:bg-[#1A202E]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title="Modo Tela Cheia"
            className="hidden sm:flex p-2 rounded-xl bg-[#121620] border border-[#202738] text-gray-400 hover:text-white hover:bg-[#1A202E] transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className="w-px h-6 bg-[#1A202E] mx-1" />

          {/* Fechar Modal */}
          <button
            onClick={onClose}
            title="Fechar Visualizador"
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ÁREA CENTRAL PRINCIPAL */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* SIDEBAR DO ÍNDICE / SUMÁRIO (SLIDE OVER) */}
        {showToc && (
          <aside className="absolute md:relative z-20 inset-y-0 left-0 w-80 max-w-full bg-[#0D0F16] border-r border-[#1C2232] shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-[#1C2232] flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <List className="w-4 h-4 text-[#D4AF37]" /> Sumário da Obra
              </div>
              <button 
                onClick={() => setShowToc(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
              {structuredData.chapters.map((cap, index) => {
                const isActive = currentPage === index + 1;
                return (
                  <button
                    key={cap.id}
                    onClick={() => {
                      setCurrentPage(index + 1);
                      setViewMode('reader');
                      setShowToc(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition flex flex-col gap-1 border ${
                      isActive 
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-white shadow-sm' 
                        : 'bg-[#121622]/50 border-transparent hover:border-[#222A3E] hover:bg-[#151A28] text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`font-bold ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                        CAPÍTULO {cap.chapterNumber}
                      </span>
                      <span className="text-gray-400">Pág. {index + 1}</span>
                    </div>
                    <div className="text-xs font-semibold line-clamp-1 text-white">
                      {cap.title}
                    </div>
                    {cap.subtitle && (
                      <div className="text-[10px] text-gray-400 line-clamp-1">
                        {cap.subtitle}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-[#1C2232] bg-[#0A0C11] text-[10px] text-gray-400 text-center">
              {structuredData.chapters.length} Capítulos Homologados
            </div>
          </aside>
        )}

        {/* CONTAINER DO LEITOR */}
        <main className="flex-1 overflow-y-auto bg-[#060709] flex flex-col items-center justify-start p-3 sm:p-6 lg:p-8 custom-scrollbar">
          
          {/* MODO 1: VISUALIZADOR DE PDF NATIVO OU ASSINADO */}
          {viewMode === 'pdf' && signedUrl ? (
            <div className="w-full max-w-5xl h-full flex flex-col bg-[#0D0F14] rounded-2xl border border-[#1C2230] overflow-hidden shadow-2xl relative">
              
              {/* Barra de controle interna do PDF */}
              <div className="px-4 py-2 bg-[#121620] border-b border-[#1C2230] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-[11px] text-gray-200">Documento PDF Conectado</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('reader')}
                    className="px-2.5 py-1 rounded bg-[#1A2130] hover:bg-[#222B3E] text-gray-300 hover:text-white text-[11px] font-medium transition"
                  >
                    Alternar para Leitor Noturno
                  </button>
                  <a
                    href={signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] text-[11px] font-medium transition flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Nova Janela
                  </a>
                </div>
              </div>

              {/* Iframe com fallback amigável */}
              <div className="flex-1 relative bg-[#1E232E]">
                {iframeError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#0D0F14] space-y-4">
                    <AlertCircle className="w-12 h-12 text-[#D4AF37]" />
                    <h3 className="text-base font-bold text-white">Visualização Direta Bloqueada pelo Navegador</h3>
                    <p className="text-xs text-gray-400 max-w-md">
                      O seu navegador restringiu a exibição interna deste arquivo PDF. Você pode ler o material completo agora mesmo pelo nosso Leitor VIP Integrado.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setIframeError(false);
                          setViewMode('reader');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs hover:bg-[#E5C158] transition"
                      >
                        Abrir no Leitor VIP
                      </button>
                      <a
                        href={signedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-[#1A2130] text-white font-bold text-xs hover:bg-[#222B3E] transition flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Abrir PDF Externo
                      </a>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={`${signedUrl}#toolbar=0&navpanes=0`}
                    title={product.title}
                    onError={() => setIframeError(true)}
                    className="w-full h-full min-h-[600px] border-0"
                  />
                )}
              </div>
            </div>
          ) : (
            
            /* MODO 2: LEITOR DIGITAL VIP DE ALTA DEFINIÇÃO (RESPONSIVO E FORMATADO) */
            <div className="w-full max-w-3xl flex flex-col animate-in fade-in pb-16">
              
              {/* Notificação discreta se for produto em sincronização */}
              {product.id === 'prod-depois-dos-60-real' && !signedUrl && (
                <div className="mb-4 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-gray-300">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>
                      <strong className="text-white">Atenção:</strong> Este e-book ainda não foi enviado para o armazenamento privado.
                    </span>
                  </div>
                </div>
              )}

              {/* Notificação de Modo Local */}
              {signedUrl?.startsWith('blob:') && (
                <div className="mb-4 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-gray-300">
                    <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>
                      <strong className="text-white">Modo Demo Local:</strong> O PDF está rodando diretamente da memória do navegador. (O e-book sumirá se a página for atualizada).
                    </span>
                  </div>
                </div>
              )}

              {/* CARD PRINCIPAL DO LIVRO / PÁGINA */}
              <article 
                className={`bg-[#0D1017] border border-[#1E2436] rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl relative text-gray-200 transition-all duration-200 ${
                  fontSize === 'xl' ? 'text-lg sm:text-xl' : fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                }`}
              >
                
                {/* Cabeçalho da Página */}
                <div className="flex items-center justify-between border-b border-[#1A2030] pb-4 mb-8 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="text-[#D4AF37] font-bold uppercase tracking-wider text-[11px]">
                      {product.category || 'E-book Exclusivo'}
                    </span>
                    <span>•</span>
                    <span className="text-gray-400">Capítulo {currentChapter.chapterNumber}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {bookmarkedPage === currentPage && (
                      <span className="flex items-center gap-1 text-amber-400 text-[10px] font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <Bookmark className="w-3 h-3" /> Marcado
                      </span>
                    )}
                    <span className="font-mono text-gray-400 text-[11px]">
                      Pág. {currentPage} de {totalPages}
                    </span>
                  </div>
                </div>

                {/* Conteúdo do Capítulo */}
                <div className="space-y-6">
                  
                  {/* Título & Subtítulo */}
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                      {currentChapter.title}
                    </h2>
                    {currentChapter.subtitle && (
                      <p className="text-xs sm:text-sm text-[#D4AF37] font-medium">
                        {currentChapter.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Resumo executivo / Box de Síntese */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#131826] border border-[#232C42] text-xs sm:text-sm text-gray-300 leading-relaxed">
                    <div className="font-bold text-white mb-1.5 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Síntese do Módulo:
                    </div>
                    {currentChapter.summary}
                  </div>

                  {/* Pontos de Destaque / Checklist */}
                  {currentChapter.highlights && currentChapter.highlights.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Recomendações Práticas:
                      </div>
                      <div className="space-y-2">
                        {currentChapter.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                            <div className="w-4 h-4 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#D4AF37]">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                            <span className="leading-relaxed">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Parágrafos de desenvolvimento */}
                  <div className="space-y-4 pt-2 text-gray-300 leading-relaxed font-serif">
                    {currentChapter.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  {/* Protocolo de Ouro ou Destaque Estratégico */}
                  {currentChapter.protocolOrTip && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent border border-[#D4AF37]/30 my-6 text-xs sm:text-sm text-gray-200">
                      <div className="font-bold text-[#D4AF37] mb-1 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                        ⚡ {currentChapter.protocolOrTip.label}
                      </div>
                      <div className="text-gray-300 leading-relaxed">
                        {currentChapter.protocolOrTip.description}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rodapé Interno com Autor e Ficha */}
                <div className="mt-12 pt-6 border-t border-[#1A2030] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A2130] border border-[#263044] flex items-center justify-center font-bold text-[#D4AF37]">
                      {structuredData.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{structuredData.author}</div>
                      <div className="text-[10px] text-gray-400">{structuredData.authorRole}</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-400">
                    Material Homologado • Todos os Direitos Reservados
                  </div>
                </div>
              </article>

              {/* NAVEGADOR DE PÁGINAS INFERIOR (FIXO/RESPONSIVO) */}
              <div className="mt-6 flex items-center justify-between px-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#121622] hover:bg-[#1A2030] text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold border border-[#202738] transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Página Anterior
                </button>

                {/* Indicador de progresso */}
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xs font-mono text-gray-300 font-bold">
                    {currentPage} / {totalPages}
                  </div>
                  <div className="w-32 h-1 bg-[#1A202E] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#D4AF37] transition-all duration-300"
                      style={{ width: `${(currentPage / totalPages) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-black disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition shadow"
                >
                  Próxima Página
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
