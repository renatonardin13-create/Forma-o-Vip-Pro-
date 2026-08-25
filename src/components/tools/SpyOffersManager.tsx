import React, { useState } from 'react';
import { 
  Target, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Flame, 
  ExternalLink, 
  Eye, 
  Filter, 
  Play, 
  BarChart2,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface OfferItem {
  id: string;
  title: string;
  niche: 'Marketing Digital' | 'Finanças & Cripto' | 'Saúde & Estética' | 'Desenvolvimento Pessoal' | 'Tecnologia & IA';
  averageTicket: string;
  estimatedRevenue: string;
  vslDuration: string;
  conversionRate: string;
  topGeos: string[];
  vslHeadline: string;
  adAngle: string;
  checkoutPlatform: 'Perfect Pay' | 'Hotmart' | 'Kiwify';
  previewImageUrl: string;
}

export const SpyOffersManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [selectedOffer, setSelectedOffer] = useState<OfferItem | null>(null);

  const offers: OfferItem[] = [
    {
      id: 'off_01',
      title: 'Método Escala Automática com IA & VSLs Virais',
      niche: 'Marketing Digital',
      averageTicket: 'R$ 497,00',
      estimatedRevenue: 'R$ 840.000 / mês',
      vslDuration: '14 min 30 seg (Pitch no min 09:40)',
      conversionRate: '3.8% na página de vendas',
      topGeos: ['Brasil 🇧🇷', 'Portugal 🇵🇹', 'EUA 🇺🇸'],
      vslHeadline: 'Como faturar de R$ 5.000 a R$ 30.000 por mês criando produtos automáticos sem precisar aparecer.',
      adAngle: 'Ângulo de Oportunidade Nova + Tecnologia Desconhecida.',
      checkoutPlatform: 'Perfect Pay',
      previewImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'off_02',
      title: 'Protocolo Zero Gordura & Metabolismo Acelerado',
      niche: 'Saúde & Estética',
      averageTicket: 'R$ 197,00',
      estimatedRevenue: 'R$ 1.250.000 / mês',
      vslDuration: '22 min 10 seg (Pitch no min 16:20)',
      conversionRate: '4.2% no tráfego frio',
      topGeos: ['Brasil 🇧🇷', 'Angola 🇦🇴'],
      vslHeadline: 'O truque matinal de 3 segundos que desbloqueia a queima calórica profunda enquanto você dorme.',
      adAngle: 'Curiosidade Extrema + Vilão Invisível.',
      checkoutPlatform: 'Perfect Pay',
      previewImageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'off_03',
      title: 'Robô Lucrativo de Cripto & Operações Flash',
      niche: 'Finanças & Cripto',
      averageTicket: 'R$ 997,00',
      estimatedRevenue: 'R$ 620.000 / mês',
      vslDuration: '11 min 45 seg (Pitch no min 07:15)',
      conversionRate: '2.9% no tráfego direto',
      topGeos: ['Brasil 🇧🇷', 'Moçambique 🇲🇿'],
      vslHeadline: 'A inteligência financeira que identifica assimetrias de mercado antes dos grandes bancos.',
      adAngle: 'Mecanismo de Arbitragem + Escassez Imediata.',
      checkoutPlatform: 'Perfect Pay',
      previewImageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'off_04',
      title: 'Formação Desenvolvedor Full-Stack IA',
      niche: 'Tecnologia & IA',
      averageTicket: 'R$ 1.497,00',
      estimatedRevenue: 'R$ 490.000 / mês',
      vslDuration: '18 min 00 seg (Pitch no min 12:00)',
      conversionRate: '3.1% em leads qualificados',
      topGeos: ['Brasil 🇧🇷', 'Portugal 🇵🇹'],
      vslHeadline: 'Domine a stack moderna de React, Node e Gemini para criar aplicativos completos do zero.',
      adAngle: 'Transformação de Carreira + Salários em Dólar.',
      checkoutPlatform: 'Perfect Pay',
      previewImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const filteredOffers = offers.filter(off => {
    const matchSearch = off.title.toLowerCase().includes(searchTerm.toLowerCase()) || off.vslHeadline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchNiche = selectedNiche === 'all' || off.niche === selectedNiche;
    return matchSearch && matchNiche;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E5A83B]/10 border border-[#E5A83B]/30 flex items-center justify-center">
            <Target className="w-6 h-6 text-[#E5A83B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">Espionagem de Ofertas & VSLs</h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-mono text-[10px] font-bold border border-rose-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-400" />
                RADAR EM ALTA
              </span>
            </div>
            <p className="text-xs text-[#8E9BB0]">
              Monitore as ofertas mais vendidas do mercado digital, pontos exatos de pitch da VSL, gatilhos de conversão e criativos.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0D0F12] border border-[#1D2230] flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#8E9BB0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por título, promessa ou palavra-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white placeholder-[#8E9BB0]/50 focus:border-[#E5A83B] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
          {['all', 'Marketing Digital', 'Saúde & Estética', 'Finanças & Cripto', 'Tecnologia & IA'].map(niche => (
            <button
              key={niche}
              onClick={() => setSelectedNiche(niche)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedNiche === niche
                  ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                  : 'bg-[#151922] text-[#8E9BB0] hover:text-white border border-[#1D2230]'
              }`}
            >
              {niche === 'all' ? 'Todos os Nichos' : niche}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] hover:border-[#E5A83B]/50 transition-all duration-300 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-[#151922] text-[#E5A83B] text-[10px] font-mono font-bold border border-[#1D2230]">
                  {offer.niche}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                  {offer.estimatedRevenue}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-white leading-snug">{offer.title}</h3>

              <div className="p-3.5 rounded-2xl bg-[#08090C] border border-[#1D2230] space-y-2 text-xs">
                <p className="text-[#8E9BB0] font-medium leading-relaxed italic">
                  "{offer.vslHeadline}"
                </p>
                <div className="pt-2 border-t border-[#1D2230] grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#8E9BB0] block">Ticket Médio:</span>
                    <strong className="text-white font-bold">{offer.averageTicket}</strong>
                  </div>
                  <div>
                    <span className="text-[#8E9BB0] block">Conversão Média:</span>
                    <strong className="text-emerald-400 font-bold">{offer.conversionRate}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#8E9BB0]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#E5A83B]" />
                  <span>{offer.vslDuration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#8E9BB0] font-mono">Checkout:</span>
                  <span className="text-white font-bold">{offer.checkoutPlatform}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1D2230] flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedOffer(offer)}
                className="w-full py-2.5 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-xs font-bold text-white border border-[#1D2230] flex items-center justify-center gap-1.5 transition"
              >
                <Eye className="w-3.5 h-3.5 text-[#E5A83B]" />
                <span>Desvendar Funil Completo</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Offer Detail Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0D0F12] border border-[#1D2230] rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1D2230] pb-3">
              <div>
                <span className="text-[10px] text-[#E5A83B] font-mono font-bold uppercase tracking-wider block">
                  ANÁLISE PROFUNDA DO RADAR VIP
                </span>
                <h4 className="text-base font-extrabold text-white mt-0.5">{selectedOffer.title}</h4>
              </div>
              <button
                onClick={() => setSelectedOffer(null)}
                className="text-[#8E9BB0] hover:text-white text-xs font-bold font-mono"
              >
                FECHAR ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#08090C] border border-[#1D2230] space-y-1.5">
                <span className="text-[10px] font-bold text-[#E5A83B] uppercase font-mono block">Ângulo de Tráfego Vencedor</span>
                <p className="text-white">{selectedOffer.adAngle}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#08090C] border border-[#1D2230] space-y-1.5">
                <span className="text-[10px] font-bold text-[#E5A83B] uppercase font-mono block">Métricas de VSL</span>
                <p className="text-[#8E9BB0]">
                  • Duração total: <strong className="text-white">{selectedOffer.vslDuration}</strong><br/>
                  • Plataforma de Pagamento: <strong className="text-[#E5A83B]">{selectedOffer.checkoutPlatform}</strong><br/>
                  • Faturamento Estimado: <strong className="text-emerald-400">{selectedOffer.estimatedRevenue}</strong>
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedOffer(null)}
                className="px-4 py-2.5 rounded-xl bg-[#E5A83B] text-black font-bold text-xs"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
