import React, { useState } from 'react';
import { X, Lock, CheckCircle2, ExternalLink, Sparkles, ShieldCheck, AlertCircle, ShoppingCart } from 'lucide-react';
import { DigitalProduct } from '../types';

interface ProductSalesModalProps {
  product: DigitalProduct;
  onClose: () => void;
}

export const ProductSalesModal: React.FC<ProductSalesModalProps> = ({ product, onClose }) => {
  const [showCheckoutWarning, setShowCheckoutWarning] = useState(false);

  const isValidUrl = (url?: string): boolean => {
    if (!url) return false;
    const trimmed = url.trim();
    if (trimmed.length === 0 || trimmed === '#' || trimmed === 'PENDENTE' || trimmed.includes('example.com')) {
      return false;
    }
    return trimmed.startsWith('http://') || trimmed.startsWith('https://');
  };

  const hasCheckoutUrl = isValidUrl(product.checkoutUrl);
  const hasSalesPageUrl = isValidUrl(product.salesPageUrl);

  const handleCheckoutClick = () => {
    if (hasCheckoutUrl && product.checkoutUrl) {
      window.open(product.checkoutUrl, '_blank', 'noopener,noreferrer');
    } else {
      setShowCheckoutWarning(true);
    }
  };

  const handleSalesPageClick = () => {
    if (hasSalesPageUrl && product.salesPageUrl) {
      window.open(product.salesPageUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0D0F12] border border-[#D4AF37]/30 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-gray-400 hover:text-white transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Cover / Banner */}
        <div className="relative h-56 w-full bg-[#151922] overflow-hidden">
          <img
            src={product.coverUrl || product.bannerUrl || 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80'}
            alt={product.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F12] via-[#0D0F12]/40 to-transparent" />
          
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37] text-black font-extrabold text-xs shadow-lg">
            <Lock className="w-3.5 h-3.5" />
            <span>CONTEÚDO PREMIUM</span>
          </div>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider block mb-1">
              {product.category || 'Formação VIP'}
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {product.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Sobre o Conteúdo</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {product.fullDescription || product.shortDescription || 'Este conteúdo exclusivo faz parte do ecossistema avançado Formação VIP PRO. Adquira seu acesso para desbloquear aulas, materiais e ferramentas.'}
            </p>
          </div>

          {/* Benefits checklist */}
          <div className="space-y-3 bg-[#151922] p-4 rounded-2xl border border-[#222738]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              O que você vai receber:
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Acesso imediato e vitalício à área de membros</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Videoaulas em alta definição e materiais de apoio (PDFs)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Atualizações garantidas e suporte especializado</span>
              </li>
            </ul>
          </div>

          {/* Warning Banner when checkout is not yet configured */}
          {(!hasCheckoutUrl || showCheckoutWarning) && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1 text-amber-200">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Checkout ainda não configurado.</span>
              </div>
              <p className="text-[11px] text-amber-300/80 pl-6 leading-relaxed">
                Integração de checkout em preparação para este produto.
                {hasSalesPageUrl && ' Você pode acessar a página de vendas oficial para conhecer todos os detalhes.'}
              </p>
            </div>
          )}

          {/* Price & CTA Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1D2230]">
            <div>
              <span className="text-xs text-gray-400 block">Investimento Único</span>
              <div className="text-2xl font-black text-[#D4AF37] font-mono">
                {product.price ? `R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Consulte Condições'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {hasSalesPageUrl && (
                <button
                  onClick={handleSalesPageClick}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#E5A83B]/10 hover:bg-[#E5A83B]/20 border border-[#E5A83B]/40 text-[#E5A83B] font-extrabold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>ACESSAR PÁGINA DE VENDAS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}

              {hasCheckoutUrl ? (
                <button
                  onClick={handleCheckoutClick}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] hover:from-[#e5bc3b] hover:to-[#ffd556] text-black font-black text-sm tracking-wide shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>IR PARA O CHECKOUT OFICIAL</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleCheckoutClick}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gray-800/80 hover:bg-gray-800 text-gray-300 font-bold text-xs tracking-wide border border-gray-700/50 flex items-center justify-center gap-2 transition-all"
                  title="Checkout direto ainda não configurado para este produto"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Checkout em preparação</span>
                </button>
              )}
            </div>
          </div>

          <div className="text-center">
            <span className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Ambiente 100% seguro com garantia de 7 dias.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
