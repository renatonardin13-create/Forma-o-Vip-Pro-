import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  ExternalLink, 
  Layers, 
  Calendar, 
  BarChart3, 
  MousePointer, 
  Percent,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../services/store';
import { HeroBanner, BannerCategory } from '../types';
import { BannerImageUploader } from './BannerImageUploader';

export const AdminBannersManager: React.FC = () => {
  const { 
    heroBanners = [], 
    saveHeroBanner, 
    deleteHeroBanner, 
    toggleHeroBannerStatus, 
    memberAreas = [], 
    courses = [], 
    digitalProducts = [] 
  } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<HeroBanner> | null>(null);
  const [successToast, setSuccessToast] = useState('');

  const categories: BannerCategory[] = [
    'CURSOS',
    'E-BOOKS',
    'APLICATIVOS',
    'FERRAMENTAS',
    'OFERTAS',
    'LANÇAMENTOS',
    'BÔNUS',
    'EVENTOS',
    'AULAS NOVAS',
    'PRODUTOS EXTERNOS',
    'CONTEÚDOS GRATUITOS'
  ];

  const handleOpenCreate = () => {
    setEditingBanner({
      title: '',
      subtitle: '🔥 NOVO TREINAMENTO',
      description: '',
      ctaText: 'ACESSAR AGORA →',
      ctaLink: '/course-detail',
      desktopImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80',
      mobileImage: '',
      productImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      targetType: 'curso',
      memberAreaId: 'all',
      category: 'LANÇAMENTOS',
      order: heroBanners.length + 1,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      openInNewTab: false,
      customization: {
        textPosition: 'left',
        overlayOpacity: 75,
        imagePosition: 'right',
        bannerHeight: 'normal',
        slideDurationSeconds: 8,
        showIndicators: true,
        showArrows: true,
        autoplay: true,
        ctaColor: '#D4AF37'
      }
    });
    setShowModal(true);
  };

  const handleOpenEdit = (banner: HeroBanner) => {
    setEditingBanner({ ...banner });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner?.title) return;

    saveHeroBanner(editingBanner as any);
    setShowModal(false);
    setEditingBanner(null);
    setSuccessToast('Banner salvo com sucesso!');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header & New Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            Gerenciador de Banners — Hero Carousel Premium
          </h2>
          <p className="text-xs text-[#A7AFBF]">
            Crie e gerencie vitrines dinâmicas para cursos, ebooks, aplicativos, ofertas e lançamentos.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-black font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-gold-glow transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>+ NOVO BANNER</span>
        </button>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {successToast}
        </div>
      )}

      {/* Banners Table / Grid */}
      <div className="grid grid-cols-1 gap-4">
        {(heroBanners as HeroBanner[]).map((banner) => {
          const ctr = banner.stats?.impressions > 0 
            ? ((banner.stats.clicks / banner.stats.impressions) * 100).toFixed(1) 
            : '0.0';

          return (
            <div 
              key={banner.id}
              className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-28 h-16 rounded-xl overflow-hidden border border-[#1D2230] flex-shrink-0">
                  <img src={banner.desktopImage} alt={banner.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold font-mono uppercase">
                      {banner.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      banner.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {banner.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className="text-[10px] text-[#A7AFBF] font-mono">
                      Área: {banner.memberAreaId === 'all' ? 'Todas (Geral)' : memberAreas.find(a => a.id === banner.memberAreaId)?.name || banner.memberAreaId}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {banner.title}
                  </h3>
                  <p className="text-xs text-[#A7AFBF] line-clamp-1">
                    {banner.description}
                  </p>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-0 border-[#1D2230]">
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-center">
                    <span className="text-[10px] text-[#A7AFBF] block">Imp.</span>
                    <span className="font-bold text-white">{banner.stats?.impressions || 0}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-[#A7AFBF] block">Cliques</span>
                    <span className="font-bold text-[#D4AF37]">{banner.stats?.clicks || 0}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-[#A7AFBF] block">CTR</span>
                    <span className="font-bold text-emerald-400">{ctr}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleHeroBannerStatus(banner.id)}
                    className={`p-2 rounded-xl border transition ${
                      banner.status === 'active' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                    }`}
                    title={banner.status === 'active' ? 'Desativar banner' : 'Ativar banner'}
                  >
                    {banner.status === 'active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(banner)}
                    className="p-2 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-[#A7AFBF] hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition"
                    title="Editar Banner"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteHeroBanner(banner.id)}
                    className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition"
                    title="Excluir Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Create / Edit Banner */}
      {showModal && editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#151922] border border-[#1D2230] p-6 lg:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#1D2230] pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                {editingBanner.id && heroBanners.some(b => b.id === editingBanner.id) ? 'Editar Banner' : 'Novo Banner Premium'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#A7AFBF] uppercase mb-1">Título Grande *</label>
                  <input
                    type="text"
                    required
                    value={editingBanner.title || ''}
                    onChange={e => setEditingBanner({ ...editingBanner, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                    placeholder="Ex: ESTRATÉGIAS AVANÇADAS PARA VENDER MAIS"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A7AFBF] uppercase mb-1">Subtítulo / Eyebrow</label>
                  <input
                    type="text"
                    value={editingBanner.subtitle || ''}
                    onChange={e => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                    placeholder="Ex: 🔥 NOVO TREINAMENTO"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A7AFBF] uppercase mb-1">Descrição Curta</label>
                <textarea
                  rows={2}
                  value={editingBanner.description || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  placeholder="Aprenda estratégias práticas para aumentar suas vendas..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#A7AFBF] uppercase mb-1">Categoria</label>
                  <select
                    value={editingBanner.category || 'CURSOS'}
                    onChange={e => setEditingBanner({ ...editingBanner, category: e.target.value as BannerCategory })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A7AFBF] uppercase mb-1">Área de Membros</label>
                  <select
                    value={editingBanner.memberAreaId || 'all'}
                    onChange={e => setEditingBanner({ ...editingBanner, memberAreaId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="all">Todas as Áreas (Geral)</option>
                    {memberAreas.map(area => (
                      <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A7AFBF] uppercase mb-1">Tipo de Destino</label>
                  <select
                    value={editingBanner.targetType || 'curso'}
                    onChange={e => setEditingBanner({ ...editingBanner, targetType: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="curso">Curso Interno</option>
                    <option value="produto_interno">Produto Digital</option>
                    <option value="link_externo">Link Externo</option>
                    <option value="oferta">Oferta Exclusiva</option>
                  </select>
                </div>
              </div>

              {/* Internal Product / Course Selector */}
              {(editingBanner.targetType === 'curso' || editingBanner.targetType === 'produto_interno') && (
                <div>
                  <label className="block text-xs font-bold text-[#A7AFBF] uppercase mb-1">Vincular Produto Interno / Curso (Sem digitar URL)</label>
                  <select
                    value={editingBanner.targetId || ''}
                    onChange={e => {
                      const id = e.target.value;
                      const course = courses.find(c => c.id === id);
                      setEditingBanner({ 
                        ...editingBanner, 
                        targetId: id,
                        title: course ? course.title.toUpperCase() : editingBanner.title,
                        desktopImage: course?.bannerUrl || editingBanner.desktopImage
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="">Selecione um curso ou produto...</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>Curso: {c.title}</option>
                    ))}
                    {digitalProducts.map(p => (
                      <option key={p.id} value={p.id}>Produto: {p.title} ({p.type})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#A7AFBF] uppercase mb-1">Texto do Botão (CTA)</label>
                  <input
                    type="text"
                    value={editingBanner.ctaText || ''}
                    onChange={e => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                    placeholder="ACESSAR AGORA →"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A7AFBF] uppercase mb-1">Link do Botão (URL)</label>
                  <input
                    type="text"
                    value={editingBanner.ctaLink || ''}
                    onChange={e => setEditingBanner({ ...editingBanner, ctaLink: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                    placeholder="/course-detail ou https://..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <BannerImageUploader
                  label="Imagem Principal do Banner (Desktop)"
                  value={editingBanner.desktopImage || ''}
                  onChange={(url) => setEditingBanner({ ...editingBanner, desktopImage: url })}
                  recommendedSize="1920 × 700 px"
                  maxSizeMB={10}
                />

                <BannerImageUploader
                  label="Imagem do Produto / Mockup (Opcional - Lado Direito)"
                  value={editingBanner.productImage || ''}
                  onChange={(url) => setEditingBanner({ ...editingBanner, productImage: url })}
                  recommendedSize="800 × 800 px (Fundo Transparente)"
                  maxSizeMB={10}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1D2230]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-gray-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-extrabold uppercase shadow-gold-glow"
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
