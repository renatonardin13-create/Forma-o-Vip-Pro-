import React, { useState } from 'react';
import { HeroBanner, MemberArea, Course, DigitalProduct } from '../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  BarChart2, 
  Sparkles, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Layers, 
  Image as ImageIcon,
  Link,
  Calendar,
  ArrowUpRight,
  Filter
} from 'lucide-react';

interface AdminBannersManagerProps {
  banners: HeroBanner[];
  memberAreas: MemberArea[];
  courses: Course[];
  digitalProducts: DigitalProduct[];
  onSaveBanner: (banner: any) => void;
  onDeleteBanner: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const AdminBannersManager: React.FC<AdminBannersManagerProps> = ({
  banners,
  memberAreas,
  courses,
  digitalProducts,
  onSaveBanner,
  onDeleteBanner,
  onToggleStatus
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'banners' | 'stats'>('banners');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState('all');
  
  // Modal state for create / edit
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<HeroBanner> | null>(null);

  const filteredBanners = banners.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = selectedAreaFilter === 'all' || b.areaId === selectedAreaFilter || b.areaId === 'global';
    return matchesSearch && matchesArea;
  });

  const handleOpenNew = () => {
    setEditingBanner({
      title: '',
      subtitle: '🔥 NOVO LANÇAMENTO',
      description: '',
      buttonText: 'ACESSAR AGORA',
      buttonLink: '',
      targetType: 'course',
      targetId: courses[0]?.id || '',
      openInNewTab: false,
      backgroundImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1920&q=80',
      mobileBackgroundImageUrl: '',
      productImageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
      areaId: 'global',
      category: 'treinamento',
      order: banners.length + 1,
      status: 'active',
      overlayIntensity: 'cinematic',
      accentColor: '#D4AF37'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (banner: HeroBanner) => {
    setEditingBanner({ ...banner });
    setShowModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner || !editingBanner.title) return;
    onSaveBanner(editingBanner);
    setShowModal(false);
    setEditingBanner(null);
  };

  // Calculate total stats
  const totalImpressions = banners.reduce((acc, b) => acc + (b.impressions || 0), 0);
  const totalClicks = banners.reduce((acc, b) => acc + (b.clicks || 0), 0);
  const overallCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151922] border border-[#1D2230] p-6 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <Sparkles className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">Gerenciador de Banners & Vitrine Hero</h2>
              <p className="text-xs text-gray-400">Configure banners de destaque premium para a Área do Aluno e monitore conversões.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#0D0F12] border border-[#1D2230] p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('banners')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'banners' ? 'bg-[#D4AF37] text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Banners Ativos
            </button>
            <button
              onClick={() => setActiveSubTab('stats')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'stats' ? 'bg-[#D4AF37] text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Estatísticas & CTR
            </button>
          </div>

          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold text-xs shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ NOVO BANNER</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: BANNERS LIST */}
      {activeSubTab === 'banners' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-[#11141D] p-4 rounded-xl border border-[#1D2230]">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar banners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#151922] border border-[#1D2230] rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Área:</span>
              </div>
              <select
                value={selectedAreaFilter}
                onChange={(e) => setSelectedAreaFilter(e.target.value)}
                className="bg-[#151922] border border-[#1D2230] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Todas as Áreas (Global)</option>
                {memberAreas.map((area) => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Banners Grid / Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanners.map((banner) => {
              const ctr = banner.impressions > 0 ? ((banner.clicks / banner.impressions) * 100).toFixed(1) : '0.0';
              const matchedArea = memberAreas.find(a => a.id === banner.areaId);

              return (
                <div 
                  key={banner.id}
                  className="bg-[#151922] border border-[#1D2230] rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-[#D4AF37]/50 transition duration-300"
                >
                  <div className="relative h-40 bg-black">
                    <img 
                      src={banner.backgroundImageUrl} 
                      alt={banner.title} 
                      className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151922] via-transparent to-black/40"></div>
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 border border-[#D4AF37]/30 text-[#F5D76E] text-[10px] font-bold uppercase">
                        {banner.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        banner.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {banner.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] text-gray-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        {matchedArea ? matchedArea.name : '🌐 Global'}
                      </span>
                      <span className="text-[11px] text-[#D4AF37] font-mono font-bold">
                        Ordem: #{banner.order}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-white line-clamp-1">{banner.title}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2">{banner.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#1D2230] flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-3">
                        <span title="Impressões">👁️ {banner.impressions}</span>
                        <span title="Cliques">🖱️ {banner.clicks}</span>
                        <span title="CTR" className="text-[#D4AF37] font-bold">CTR: {ctr}%</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onToggleStatus(banner.id)}
                          className={`p-1.5 rounded-lg transition ${
                            banner.status === 'active' ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-gray-500 hover:bg-gray-800'
                          }`}
                          title="Alternar Status"
                        >
                          {banner.status === 'active' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(banner)}
                          className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition"
                          title="Editar Banner"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteBanner(banner.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                          title="Excluir Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: STATISTICS & CONVERSION */}
      {activeSubTab === 'stats' && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-[#151922] border border-[#1D2230]">
              <span className="text-xs text-gray-400 uppercase font-mono">Total de Impressões</span>
              <div className="text-3xl font-black text-white mt-2">{totalImpressions.toLocaleString()}</div>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">↑ Exibições na Área do Aluno</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#151922] border border-[#1D2230]">
              <span className="text-xs text-gray-400 uppercase font-mono">Total de Cliques</span>
              <div className="text-3xl font-black text-[#D4AF37] mt-2">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-gray-400 mt-1">Interações nos CTAs dos Banners</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#151922] border border-[#1D2230]">
              <span className="text-xs text-gray-400 uppercase font-mono">CTR Médio (Taxa de Cliques)</span>
              <div className="text-3xl font-black text-white mt-2">{overallCtr}%</div>
              <p className="text-xs text-emerald-400 mt-1">Performance Excelente</p>
            </div>
          </div>

          {/* Detailed Statistics Table */}
          <div className="bg-[#151922] border border-[#1D2230] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-[#1D2230]">
              <h3 className="text-sm font-bold text-white">Relatório de Desempenho por Banner</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0D0F12] text-gray-400 font-mono uppercase">
                  <tr>
                    <th className="p-4">Banner / Título</th>
                    <th className="p-4">Área de Membros</th>
                    <th className="p-4">Categoria</th>
                    <th className="p-4 text-center">Impressões</th>
                    <th className="p-4 text-center">Cliques</th>
                    <th className="p-4 text-center">CTR</th>
                    <th className="p-4 text-right">Atualização</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D2230] text-gray-300">
                  {banners.map((b) => {
                    const ctr = b.impressions > 0 ? ((b.clicks / b.impressions) * 100).toFixed(2) : '0.00';
                    const area = memberAreas.find(a => a.id === b.areaId);
                    return (
                      <tr key={b.id} className="hover:bg-[#1C212E] transition">
                        <td className="p-4 font-bold text-white max-w-xs truncate">{b.title}</td>
                        <td className="p-4">{area ? area.name : '🌐 Global'}</td>
                        <td className="p-4 capitalize">
                          <span className="px-2 py-0.5 rounded bg-black/40 text-[#D4AF37] border border-[#D4AF37]/20">
                            {b.category}
                          </span>
                        </td>
                        <td className="p-4 text-center font-mono">{b.impressions}</td>
                        <td className="p-4 text-center font-mono text-[#D4AF37] font-bold">{b.clicks}</td>
                        <td className="p-4 text-center font-mono font-bold text-emerald-400">{ctr}%</td>
                        <td className="p-4 text-right text-gray-500">{b.updatedAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT BANNER MODAL */}
      {showModal && editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#151922] border border-[#1D2230] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            
            <div className="p-6 border-b border-[#1D2230] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-white">
                  {editingBanner.id ? 'Editar Banner Hero' : 'Criar Novo Banner Hero'}
                </h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-[#1D2230]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-300">Título Principal *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: ESTRATÉGIAS AVANÇADAS PARA VENDER MAIS"
                    value={editingBanner.title || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                    className="w-full bg-[#0D0F12] border border-[#1D2230] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Subtítulo / Tag de Categoria</label>
                  <input
                    type="text"
                    placeholder="Ex: 🔥 NOVO TREINAMENTO"
                    value={editingBanner.subtitle || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                    className="w-full bg-[#0D0F12] border border-[#1D2230] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Categoria do Banner</label>
                  <select
                    value={editingBanner.category || 'treinamento'}
                    onChange={(e) => setEditingBanner({ ...editingBanner, category: e.target.value as any })}
                    className="w-full bg-[#0D0F12] border border-[#1D2230] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="treinamento">Treinamento</option>
                    <option value="ebook">E-book</option>
                    <option value="aplicativo">Aplicativo</option>
                    <option value="ferramenta">Ferramenta</option>
                    <option value="oferta">Oferta</option>
                    <option value="lancamento">Lançamento</option>
                    <option value="bonus">Bônus</option>
                    <option value="evento">Evento</option>
                    <option value="aula_nova">Aula Nova</option>
                    <option value="gratuito">Conteúdo Gratuito</option>
                    <option value="externo">Produto Externo</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-300">Descrição Curta</label>
                  <textarea
                    rows={2}
                    placeholder="Resumo atraente para instigar o clique..."
                    value={editingBanner.description || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                    className="w-full bg-[#0D0F12] border border-[#1D2230] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Texto do Botão CTA</label>
                  <input
                    type="text"
                    placeholder="Ex: ACESSAR AGORA"
                    value={editingBanner.buttonText || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, buttonText: e.target.value })}
                    className="w-full bg-[#0D0F12] border border-[#1D2230] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Tipo de Destino</label>
                  <select
                    value={editingBanner.targetType || 'course'}
                    onChange={(e) => setEditingBanner({ ...editingBanner, targetType: e.target.value as any })}
                    className="w-full bg-[#0D0F12] border border-[#1D2230] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="course">Curso Interno</option>
                    <option value="lesson">Aula Específica</option>
                    <option value="app">Aplicativo</option>
                    <option value="ebook">E-book</option>
                    <option value="offer">Oferta Exclusiva</option>
                    <option value="external_link">Link Externo (URL)</option>
                  </select>
                </div>

                {editingBanner.targetType === 'course' && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-300">Selecionar Curso Relacionado</label>
                    <select
                      value={editingBanner.targetId || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, targetId: e.target.value })}
                      className="w-full bg-[#0D0F12] border border-[#1D2230] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                {editingBanner.targetType === 'external_link' && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-300">Link Externo URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editingBanner.buttonLink || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, buttonLink: e.target.value })}
                      className="w-full bg-[#0D0F12] border border-[#1D2230] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Área de Membros Destino</label>
                  <select
                    value={editingBanner.areaId || 'global'}
                    onChange={(e) => setEditingBanner({ ...editingBanner, areaId: e.target.value })}
                    className="w-full bg-[#0D0F12] border border-[#1D2230] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="global">🌐 Todas as Áreas (Global)</option>
                    {memberAreas.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.slug})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Ordem de Exibição</label>
                  <input
                    type="number"
                    value={editingBanner.order || 1}
                    onChange={(e) => setEditingBanner({ ...editingBanner, order: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#0D0F12] border border-[#1D2230] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-300">URL da Imagem de Fundo (Desktop)</label>
                  <input
                    type="url"
                    value={editingBanner.backgroundImageUrl || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, backgroundImageUrl: e.target.value })}
                    className="w-full bg-[#0D0F12] border border-[#1D2230] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-300">URL da Imagem do Produto / Mockup (Lado Direito)</label>
                  <input
                    type="url"
                    value={editingBanner.productImageUrl || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, productImageUrl: e.target.value })}
                    className="w-full bg-[#0D0F12] border border-[#1D2230] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#1D2230] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#1D2230] text-gray-300 hover:text-white text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold text-xs shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 transition"
                >
                  Salvar Banner
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
