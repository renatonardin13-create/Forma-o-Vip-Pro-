import React from 'react';
import { 
  X, 
  Smartphone, 
  ExternalLink, 
  Play, 
  ShieldCheck, 
  CheckCircle, 
  Layers, 
  Cpu, 
  Terminal,
  Download
} from 'lucide-react';
import { DigitalProduct } from '../types';

interface AppDetailsModalProps {
  product: DigitalProduct;
  onClose: () => void;
}

export const AppDetailsModal: React.FC<AppDetailsModalProps> = ({ product, onClose }) => {
  const appData = product.app;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in zoom-in-95">
      <div className="bg-[#0D0F12] border border-[#222738] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header with App Banner */}
        <div className="relative h-48 sm:h-60 w-full bg-[#151922] overflow-hidden">
          <img 
            src={product.bannerUrl || product.coverUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'} 
            alt={product.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F12] via-[#0D0F12]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-gray-300 hover:text-white backdrop-blur-sm border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and Icon in Banner */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0D0F12] border border-[#D4AF37]/40 p-2 shadow-xl shrink-0 flex items-center justify-center">
                {product.logoUrl ? (
                  <img src={product.logoUrl} alt={product.title} className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <Smartphone className="w-8 h-8 text-[#D4AF37]" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 uppercase">
                    {appData?.platform || 'Web App'}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {appData?.version || 'v2.4.0'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">{product.title}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sobre a Ferramenta</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {product.fullDescription || product.shortDescription || 'Ferramenta desenvolvida exclusivamente para automatizar processos de prospecção, análise e geração de resultados.'}
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#151922] rounded-xl border border-[#222738]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] mb-1">
                <ShieldCheck className="w-4 h-4" />
                Acesso Seguro & Ilimitado
              </div>
              <p className="text-xs text-gray-400">
                Sua conta VIP possui licença liberada sem cobranças adicionais de mensalidade.
              </p>
            </div>

            <div className="p-4 bg-[#151922] rounded-xl border border-[#222738]">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-1">
                <Cpu className="w-4 h-4" />
                Atualizações Automáticas na Nuvem
              </div>
              <p className="text-xs text-gray-400">
                Novos recursos e melhorias de inteligência artificial são liberados constantemente.
              </p>
            </div>
          </div>

          {/* Direct Launch CTA */}
          <div className="p-6 bg-gradient-to-br from-[#151922] to-[#08090C] rounded-2xl border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-bold text-white text-base">Pronto para utilizar?</div>
              <div className="text-xs text-gray-400">Clique para abrir o painel da aplicação em uma nova aba.</div>
            </div>

            {appData?.accessUrl ? (
              <a
                href={appData.accessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold rounded-xl hover:opacity-95 shadow-lg shadow-[#D4AF37]/20 transition-all text-sm w-full sm:w-auto shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                ACESSAR APLICATIVO AGORA
              </a>
            ) : (
              <button
                onClick={() => alert('Aplicativo em fase final de homologação. O acesso será liberado em breve!')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold rounded-xl hover:opacity-95 shadow-lg shadow-[#D4AF37]/20 transition-all text-sm w-full sm:w-auto shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                ACESSAR APLICATIVO AGORA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
