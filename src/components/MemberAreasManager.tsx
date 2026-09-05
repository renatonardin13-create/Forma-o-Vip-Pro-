import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  ExternalLink, 
  Edit, 
  Copy, 
  Trash2, 
  Power, 
  Crown, 
  BookOpen, 
  Smartphone, 
  Wrench, 
  Package, 
  Sparkles, 
  Check, 
  X, 
  Image as ImageIcon, 
  Palette, 
  Sliders, 
  Users, 
  ShieldCheck,
  Video,
  Monitor,
  Eye,
  ArrowRight,
  RefreshCw,
  FolderKanban,
  Upload,
  Star,
  User
} from 'lucide-react';
import { useStore } from '../services/store';
import { MemberArea, MemberAreaType, LoginCustomization } from '../types';
import { INITIAL_LOGIN_CUSTOMIZATION } from '../data/mockData';
import { optimizeImageFile } from '../utils/imageOptimizer';

interface MemberAreasManagerProps {
  onOpenArea?: (slug: string) => void;
  onManageProducts?: (areaId: string) => void;
}

export const MemberAreasManager: React.FC<MemberAreasManagerProps> = ({ 
  onOpenArea,
  onManageProducts
}) => {
  const { 
    memberAreas, 
    saveMemberArea, 
    deleteMemberArea, 
    duplicateMemberArea, 
    toggleMemberAreaStatus,
    digitalProducts
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<'info' | 'branding' | 'login'>('info');
  const [editingArea, setEditingArea] = useState<Partial<MemberArea> | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAssetUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: 'logoUrl' | 'faviconUrl' | 'bannerUrl' | 'coverUrl',
    maxWidth: number,
    maxHeight: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingField(fieldKey);
      const isPngOrSvg = file.type === 'image/png' || file.type === 'image/svg+xml';
      const res = await optimizeImageFile(file, {
        maxWidth,
        maxHeight,
        quality: 0.90,
        mimeType: isPngOrSvg ? 'image/png' : 'image/jpeg'
      });
      setEditingArea(prev => prev ? ({ ...prev, [fieldKey]: res.dataUrl }) : null);
      showToast(`Imagem atualizada com sucesso!`);
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      showToast('Erro ao processar imagem. Tente outro arquivo.');
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  const handleCreateNew = () => {
    setEditingArea({
      name: '',
      slug: '',
      type: 'vip',
      description: '',
      logoUrl: '/areas/ebooks/logo.png',
      faviconUrl: '/areas/ebooks/favicon.png',
      coverUrl: '/areas/ebooks/capa.png',
      bannerUrl: '/areas/ebooks/banner.png',
      primaryColor: '#D4AF37',
      secondaryColor: '#1A1612',
      status: 'inactive',
      welcomeText: '',
      heroTitle: '',
      heroSubtitle: '',
      heroCtaText: 'Explorar Conteúdos',
      heroCtaLink: '#conteudos',
      order: memberAreas.length + 1,
      loginCustomization: { ...INITIAL_LOGIN_CUSTOMIZATION }
    });
    setModalTab('info');
    setShowModal(true);
  };

  const handleEdit = (area: MemberArea) => {
    setEditingArea({
      ...area,
      loginCustomization: area.loginCustomization ? { ...area.loginCustomization } : { ...INITIAL_LOGIN_CUSTOMIZATION }
    });
    setModalTab('info');
    setShowModal(true);
  };

  const handleDuplicate = (id: string) => {
    const duplicated = duplicateMemberArea(id);
    if (duplicated) {
      showToast(`Área "${duplicated.name}" duplicada com sucesso!`);
    }
  };

  const handleDelete = (id: string) => {
    deleteMemberArea(id);
    setConfirmDeleteId(null);
    showToast('Área de membros excluída com sucesso.');
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArea?.name || !editingArea?.slug) {
      alert('Preencha o Nome e o Slug da Área.');
      return;
    }

    saveMemberArea(editingArea as any);
    setShowModal(false);
    setEditingArea(null);
    showToast('Área de membros salva com sucesso!');
  };

  const handleNameChange = (name: string) => {
    if (!editingArea) return;
    const isNew = !editingArea.id;
    const autoSlug = isNew 
      ? name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      : editingArea.slug;

    setEditingArea(prev => ({
      ...prev!,
      name,
      slug: autoSlug || prev?.slug || ''
    }));
  };

  const getTypeIcon = (type: MemberAreaType) => {
    switch (type) {
      case 'cursos': return <BookOpen className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ebooks': return <BookOpen className="w-3.5 h-3.5 text-amber-400" />;
      case 'aplicativos': return <Smartphone className="w-3.5 h-3.5 text-blue-400" />;
      case 'ferramentas': return <Wrench className="w-3.5 h-3.5 text-green-400" />;
      case 'produtos_digitais': return <Package className="w-3.5 h-3.5 text-purple-400" />;
      case 'vip': return <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  const filteredAreas = memberAreas.filter(area => {
    const matchesSearch = 
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || area.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div id="member-areas-manager" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D0F12] border border-[#D4AF37]/50 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-[#0D0F12] border border-[#1D2230] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-[11px] font-bold tracking-widest text-[#D4AF37] uppercase mb-1">
              FASE 2
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              Áreas de membros
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl">
              Crie quantas áreas independentes quiser, cada uma com seu próprio catálogo, branding e regras de acesso.
            </p>
          </div>

          <button
            id="btn-new-member-area"
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold rounded-xl hover:opacity-95 shadow-lg shadow-[#D4AF37]/20 transition-all text-sm shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            Nova área
          </button>
        </div>

        {/* Counter & Search Bar */}
        <div className="mt-8 pt-6 border-t border-[#1D2230] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>{memberAreas.length} áreas criadas</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-500">Sem limite — crie quantas precisar.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar área..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[#151922] border border-[#222738] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/60"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Areas Grid matching screenshots */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAreas.map((area, index) => {
          const areaProducts = digitalProducts.filter(p => p.areaId === area.id);
          const isPublished = area.status === 'active';
          const isPrincipal = index === 0;

          return (
            <div 
              key={area.id}
              id={`card-area-${area.slug}`}
              className={`bg-[#0D0F12] border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group shadow-xl ${
                isPrincipal ? 'border-[#D4AF37]/60 shadow-[#D4AF37]/5' : 'border-[#1D2230] hover:border-gray-700'
              }`}
            >
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Header of Card */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#151922] border border-[#222738] flex items-center justify-center text-[#D4AF37]">
                        {getTypeIcon(area.type)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                          {area.name}
                          {isPrincipal && <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />}
                        </h3>
                        <p className="text-[11px] text-gray-400 font-mono">app.{area.slug}.com</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setConfirmDeleteId(area.id)}
                    className="text-gray-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="Excluir Área"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Description or preview content */}
                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                  {area.description || 'Área de membros configurada com módulos, videoaulas e comunidade interativa.'}
                </p>

                {/* Badges */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isPublished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {isPublished ? 'Ativa' : 'Rascunho'}
                  </span>

                  {isPrincipal && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#D4AF37]" /> Principal
                    </span>
                  )}

                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#151922] text-gray-300 border border-[#222738]">
                    Misto
                  </span>

                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#151922] text-gray-300 border border-[#222738]">
                    PT-BR
                  </span>
                </div>

                {/* URL Footer Info */}
                <div className="text-[11px] font-mono text-gray-500 pt-2 border-t border-[#1D2230]">
                  URL: app.{area.slug}.[seu-dominio].com
                </div>

                {/* Main Action Buttons */}
                <div className="space-y-2 pt-2">
                  <div className="text-[10px] text-gray-400 font-medium">
                    {isPrincipal ? 'Variação ativa no painel' : 'Tornar ativa'}
                  </div>

                  <button
                    onClick={() => handleEdit(area)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-md shadow-[#D4AF37]/10 transition-all"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Personalizar área
                  </button>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onOpenArea ? onOpenArea(area.slug) : window.history.pushState({}, '', `/${area.slug}`)}
                      className="py-2 px-3 rounded-xl bg-[#151922] hover:bg-[#1D2230] border border-[#222738] text-gray-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Ver como admin
                    </button>
                    <button
                      onClick={() => onOpenArea ? onOpenArea(area.slug) : window.history.pushState({}, '', `/${area.slug}`)}
                      className="py-2 px-3 rounded-xl bg-[#151922] hover:bg-[#1D2230] border border-[#222738] text-gray-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      Ver como aluno
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAreas.length === 0 && (
        <div className="bg-[#0D0F12] border border-[#1D2230] rounded-2xl p-12 text-center">
          <Layers className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Nenhuma área encontrada</h3>
          <p className="text-gray-400 text-sm mt-1">Ajuste os filtros de busca ou crie uma nova área de membros.</p>
        </div>
      )}

      {/* MODAL CRIAR / EDITAR ÁREA MATCHING SCREENSHOTS EXACTLY */}
      {showModal && editingArea && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D0F12] border border-[#222738] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#1D2230] flex items-center justify-between bg-[#08090C] rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingArea.id ? `Editar área: ${editingArea.name}` : 'Nova área de membros'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Cada área tem seu próprio catálogo, branding, login e regras de acesso.</p>
              </div>

              <button
                onClick={() => { setShowModal(false); setEditingArea(null); }}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#151922]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form matching screenshots 2 & 3 */}
            <form onSubmit={handleSaveSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Seção 1: Identidade da Área */}
              <div className="space-y-4">
                <div className="border-b border-[#1D2230] pb-2">
                  <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Identidade da Área</h4>
                  <p className="text-[11px] text-gray-400">Como essa área vai se apresentar para os usuários.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Título *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: Reino das Cores Kids"
                    value={editingArea.name || ''}
                    onChange={e => handleNameChange(e.target.value)}
                    className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Rótulo curto
                  </label>
                  <input
                    type="text"
                    placeholder="Ex.: Kids"
                    value={editingArea.shortLabel || ''}
                    onChange={e => setEditingArea(prev => ({ ...prev!, shortLabel: e.target.value }))}
                    className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Versão compacta usada em badges, chips e cards menores.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Descreva para quem é essa área e o que ela entrega"
                    value={editingArea.description || ''}
                    onChange={e => setEditingArea(prev => ({ ...prev!, description: e.target.value }))}
                    className="w-full bg-[#151922] border border-[#222738] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Seção 2: Endereço da Área */}
              <div className="space-y-4 pt-4 border-t border-[#1D2230]">
                <div className="border-b border-[#1D2230] pb-2">
                  <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Endereço da Área</h4>
                  <p className="text-[11px] text-gray-400">Cada área pode ter seu próprio subdomínio e será preparada para uso em domínio real no deploy final.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Identificador do subdomínio *
                    </label>
                    <div className="flex items-center bg-[#151922] border border-[#222738] rounded-xl px-3 focus-within:border-[#D4AF37]">
                      <input
                        type="text"
                        required
                        placeholder="Ex.: desafio24dias"
                        value={editingArea.slug || ''}
                        onChange={e => setEditingArea(prev => ({ ...prev!, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') }))}
                        className="w-full bg-transparent border-0 py-2.5 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">Use apenas letras e números. Esse identificador será usado para montar a URL da área.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Domínio raiz (opcional agora)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex.: seudominio.com"
                      value={editingArea.rootDomain || ''}
                      onChange={e => setEditingArea(prev => ({ ...prev!, rootDomain: e.target.value }))}
                      className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Esse domínio poderá ser conectado depois no deploy final pela Vercel.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    URL final (preview)
                  </label>
                  <div className="p-3 bg-[#12151D] border border-dashed border-[#2A324A] rounded-xl font-mono text-xs text-[#D4AF37]">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mr-2 font-sans font-bold">Preview</span>
                    https://{editingArea.slug || '[subdominio]'}.[seu-dominio].com
                  </div>
                </div>
              </div>

              {/* Seção 3: Configurações da Área */}
              <div className="space-y-4 pt-4 border-t border-[#1D2230]">
                <div className="border-b border-[#1D2230] pb-2">
                  <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Configurações da Área</h4>
                  <p className="text-[11px] text-gray-400">Comportamento básico e idioma padrão dessa área.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Status
                    </label>
                    <select
                      value={editingArea.status || 'inactive'}
                      onChange={e => setEditingArea(prev => ({ ...prev!, status: e.target.value as any }))}
                      className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="inactive">Rascunho</option>
                      <option value="active">Ativa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Idioma padrão
                    </label>
                    <select
                      value={editingArea.language || 'Português (Brasil)'}
                      onChange={e => setEditingArea(prev => ({ ...prev!, language: e.target.value }))}
                      className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Português (Brasil)">Português (Brasil)</option>
                      <option value="English">English</option>
                      <option value="Español">Español</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Seção 4: Identidade Visual Rápida */}
              <div className="space-y-4 pt-4 border-t border-[#1D2230]">
                <div className="border-b border-[#1D2230] pb-2">
                  <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Identidade Visual Rápida</h4>
                  <p className="text-[11px] text-gray-400">Branding completo é configurado depois nas telas de Branding e Login.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Cor de destaque
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={editingArea.primaryColor || '#D4AF37'}
                      onChange={e => setEditingArea(prev => ({ ...prev!, primaryColor: e.target.value }))}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={editingArea.primaryColor || '#D4AF37'}
                      onChange={e => setEditingArea(prev => ({ ...prev!, primaryColor: e.target.value }))}
                      className="flex-1 bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-[#1D2230] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingArea(null); }}
                  className="px-5 py-2.5 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-gray-300 text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold text-xs hover:opacity-95 shadow-lg shadow-[#D4AF37]/20 transition-all"
                >
                  Criar área
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0F12] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Confirmar Exclusão</h3>
            <p className="text-sm text-gray-400">
              Tem certeza que deseja excluir esta área de membros? Os produtos associados a ela perderão o vínculo.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-[#151922] text-gray-300 text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg"
              >
                Excluir Área
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
