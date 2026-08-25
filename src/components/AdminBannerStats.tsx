import React from 'react';
import { BarChart3, MousePointer, Percent, Eye, Sparkles, TrendingUp } from 'lucide-react';
import { useStore } from '../services/store';
import { HeroBanner } from '../types';

export const AdminBannerStats: React.FC = () => {
  const { heroBanners = [], memberAreas = [] } = useStore();

  const totalImpressions = (heroBanners as HeroBanner[]).reduce((acc, b) => acc + (b.stats?.impressions || 0), 0);
  const totalClicks = (heroBanners as HeroBanner[]).reduce((acc, b) => acc + (b.stats?.clicks || 0), 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0';

  const mostClicked = [...(heroBanners as HeroBanner[])].sort((a, b) => (b.stats?.clicks || 0) - (a.stats?.clicks || 0))[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
          Estatísticas & Desempenho do Hero Carousel
        </h2>
        <p className="text-xs text-[#A7AFBF]">
          Acompanhe impressões, cliques e taxa de conversão (CTR) de cada banner em tempo real.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-[#151922] border border-[#1D2230] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#A7AFBF] uppercase font-mono">Total de Impressões</span>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-display">{totalImpressions.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Eye className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>+18.4% este mês</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#151922] border border-[#1D2230] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#A7AFBF] uppercase font-mono">Total de Cliques no CTA</span>
              <h3 className="text-3xl font-extrabold text-[#D4AF37] mt-1 font-display">{totalClicks.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MousePointer className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>+24.1% conversões</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#151922] border border-[#1D2230] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#A7AFBF] uppercase font-mono">CTR Médio (Taxa de Clique)</span>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1 font-display">{avgCtr}%</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Percent className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Alta performance</span>
          </div>
        </div>
      </div>

      {/* Detailed Banner Performance Table */}
      <div className="p-6 rounded-2xl bg-[#151922] border border-[#1D2230] space-y-4">
        <h3 className="text-base font-bold text-white">Desempenho Detalhado por Banner</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1D2230] text-[#A7AFBF] font-mono">
                <th className="py-3 px-4">BANNER</th>
                <th className="py-3 px-4">CATEGORIA</th>
                <th className="py-3 px-4">ÁREA</th>
                <th className="py-3 px-4 text-center">IMPRESSÕES</th>
                <th className="py-3 px-4 text-center">CLIQUES</th>
                <th className="py-3 px-4 text-center">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2230]/50">
              {(heroBanners as HeroBanner[]).map(banner => {
                const imp = banner.stats?.impressions || 0;
                const clk = banner.stats?.clicks || 0;
                const bannerCtr = imp > 0 ? ((clk / imp) * 100).toFixed(1) : '0.0';

                return (
                  <tr key={banner.id} className="hover:bg-[#1D2230]/30 transition">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={banner.desktopImage} alt="" className="w-10 h-6 object-cover rounded" />
                      <div>
                        <span className="font-bold text-white block">{banner.title}</span>
                        <span className="text-[10px] text-[#A7AFBF]">{banner.subtitle}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] font-mono text-[10px] font-bold">
                        {banner.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#A7AFBF] font-mono">
                      {banner.memberAreaId === 'all' ? 'Geral' : memberAreas.find(a => a.id === banner.memberAreaId)?.name || banner.memberAreaId}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">{imp}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#D4AF37]">{clk}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">{bannerCtr}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
