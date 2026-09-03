import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Lock,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { DigitalProduct } from '../types';
import { useStore } from '../services/store';

interface EbookReaderModalProps {
  product: DigitalProduct;
  onClose: () => void;
}

export const EbookReaderModal: React.FC<EbookReaderModalProps> = ({ product, onClose }) => {
  const { currentUser, hasProductAccess, accessesLoaded } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = product.ebook?.pageCount || 48;
  const pdfUrl = product.ebook?.pdfUrl;

  // Authorization check (Defense in Depth)
  const canAccess = currentUser ? hasProductAccess(currentUser.id, product.id) : false;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  if (!accessesLoaded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mb-4" />
        <p className="text-gray-400 text-sm animate-pulse">Verificando autorização segura...</p>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
        <div className="max-w-md w-full bg-[#0D0F12] border border-[#1D2230] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
            <Lock className="w-10 h-10 text-rose-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Acesso Negado</h2>
            <p className="text-sm text-[#8E9BB0] leading-relaxed">
              Detectamos que você não possui uma licença ativa para visualizar este conteúdo protegido. Se você adquiriu este produto recentemente, aguarde alguns minutos pela sincronização.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#151922] text-white font-bold hover:bg-[#1D2230] transition border border-[#1D2230]"
            >
              Fechar Visualizador
            </button>
            <div className="pt-4 flex items-center justify-center gap-2 text-[10px] text-[#586376] uppercase tracking-widest font-bold">
              <ShieldAlert className="w-3 h-3" />
              SISTEMA DE PROTEÇÃO VIP
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col animate-in fade-in">
      {/* Top Navigation Bar */}
      <div className="h-16 px-6 bg-[#08090C] border-b border-[#1D2230] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm sm:text-base line-clamp-1">{product.title}</h3>
            <div className="text-xs text-gray-400">
              {product.author?.name || 'Autor VIP'} • {totalPages} páginas • PDF Interativo
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pdfUrl && canAccess && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[#151922] hover:bg-[#1D2230] text-gray-200 hover:text-white rounded-lg text-xs font-semibold border border-[#222738] transition-colors"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline">Baixar PDF</span>
            </a>
          )}

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#151922] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Reader Body / Content */}
      <div className="flex-1 overflow-y-auto bg-[#040507] p-4 sm:p-8 flex justify-center items-center">
        {pdfUrl ? (
          <div className="w-full max-w-4xl h-full bg-[#0D0F12] rounded-xl border border-[#1D2230] overflow-hidden shadow-2xl flex flex-col">
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              title={product.title}
              className="w-full h-full min-h-[500px] border-0"
            />
          </div>
        ) : (
          /* Reader Simulator / High-End Book Layout */
          <div className="w-full max-w-3xl bg-[#0D0F12] border border-[#222738] rounded-2xl p-8 sm:p-12 shadow-2xl relative text-gray-200 font-serif leading-relaxed">
            <div className="flex items-center justify-between border-b border-[#1D2230] pb-4 mb-6 text-xs text-gray-400 font-sans">
              <span className="text-[#D4AF37] font-bold uppercase">{product.category}</span>
              <span>Página {currentPage} de {totalPages}</span>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-gray-300 font-sans">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                {currentPage === 1 ? product.title : `Capítulo ${currentPage - 1}: Estratégias Avançadas`}
              </h2>

              <p className="text-gray-300 leading-relaxed">
                {product.fullDescription || product.shortDescription || 'Acesso exclusivo para membros. Este material consolida metodologias comprovadas de escala e alta performance no mercado digital.'}
              </p>

              <div className="p-4 rounded-xl bg-[#151922] border border-[#222738] my-6 font-sans text-xs sm:text-sm text-gray-300">
                <div className="font-bold text-[#D4AF37] mb-1">⚡ Destaque Estratégico:</div>
                Execute com consistência. O diferencial competitivo na escala não está no volume isolado, mas na previsibilidade dos processos de conversão e retenção.
              </div>

              <p className="text-gray-400 text-sm">
                Acompanhe os próximos módulos e aplique as planilhas anexas disponíveis na sua área de membros.
              </p>
            </div>

            {/* Bottom Page Nav */}
            <div className="mt-10 pt-6 border-t border-[#1D2230] flex items-center justify-between font-sans">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                Página Anterior
              </button>

              <span className="text-xs text-gray-400 font-mono">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold"
              >
                Próxima Página
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
