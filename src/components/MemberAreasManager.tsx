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
  Upload
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
      primaryColor: '#E6A23C',
      secondaryColor: '#1A1612',
      status: 'active',
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
      case 'cursos': return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'ebooks': return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'aplicativos': return <Smartphone className="w-4 h-4 text-blue-400" />;
      case 'ferramentas': return <Wrench className="w-4 h-4 text-green-400" />;
      case 'produtos_digitais': return <Package className="w-4 h-4 text-purple-400" />;
      case 'vip': return <Crown className="w-4 h-4 text-[#D4AF37]" />;
      default: return <Sparkles className="w-4 h-4 text-gray-400" />;
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
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37]">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Gestão de Múltiplas Áreas de Membros
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-2xl">
              Crie e gerencie ecossistemas independentes de membros com URLs dedicadas, catálogos flexíveis, identidades visuais exclusivas e telas de login sob medida.
            </p>
          </div>

          <button
            id="btn-new-member-area"
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold rounded-xl hover:opacity-95 shadow-lg shadow-[#D4AF37]/20 transition-all text-sm shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            + NOVA ÁREA DE MEMBROS
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-8 pt-6 border-t border-[#1D2230] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nome ou slug..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#151922] border border-[#222738] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/60"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Todas as Áreas' },
              { id: 'vip', label: 'VIP' },
              { id: 'cursos', label: 'Cursos' },
              { id: 'ebooks', label: 'E-books' },
              { id: 'aplicativos', label: 'Aplicativos' },
              { id: 'ferramentas', label: 'Ferramentas' },
              { id: 'produtos_digitais', label: 'Produtos Digitais' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === tab.id
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-[#151922] text-gray-400 hover:text-white border border-[#222738]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAreas.map(area => {
          const areaProducts = digitalProducts.filter(p => p.areaId === area.id);
          const isPublished = area.status === 'active';

          return (
            <div 
              key={area.id}
              id={`card-area-${area.slug}`}
              className="bg-[#0D0F12] border border-[#1D2230] rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col group shadow-lg"
            >
              {/* Cover Banner Header */}
              <div className="relative h-36 w-full bg-[#151922] overflow-hidden">
                <img 
                  src={area.bannerUrl || area.coverUrl || '/areas/ebooks/banner.png'} 
                  alt={area.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F12] via-[#0D0F12]/40 to-transparent" />

                {/* Badges Top */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#0D0F12]/90 backdrop-blur-md border border-[#222738] text-white">
                    {getTypeIcon(area.type)}
                    <span className="capitalize">{area.type.replace('_', ' ')}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase border ${
                    isPublished 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}>
                    {isPublished ? 'Ativa' : 'Inativa'}
                  </span>
                </div>

                {/* Slug Badge */}
                <div className="absolute bottom-3 left-4 flex items-center gap-1 text-xs text-[#D4AF37] font-mono bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-sm border border-[#D4AF37]/20">
                  <span>/{area.slug}</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {area.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {area.description || 'Sem descrição cadastrada.'}
                  </p>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#1D2230] text-xs">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-white font-bold">{area.productCount ?? areaProducts.length}</div>
                      <div className="text-gray-400 text-[11px]">Produtos</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-white font-bold">{area.studentCount ?? 0}</div>
                      <div className="text-gray-400 text-[11px]">Alunos com Acesso</div>
                    </div>
                  </div>
                </div>

                {/* Actions Bottom Bar */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1">
                    {/* Open Area in New/Current Route */}
                    <button
                      onClick={() => onOpenArea ? onOpenArea(area.slug) : window.history.pushState({}, '', `/${area.slug}`)}
                      title={`Abrir área /${area.slug}`}
                      className="p-2 rounded-lg bg-[#151922] hover:bg-[#1D2230] text-gray-300 hover:text-[#D4AF37] border border-[#222738] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    {/* Manage Products of Area */}
                    {onManageProducts && (
                      <button
                        onClick={() => onManageProducts(area.id)}
                        title="Gerenciar Produtos desta Área"
                        className="p-2 rounded-lg bg-[#151922] hover:bg-[#1D2230] text-gray-300 hover:text-emerald-400 border border-[#222738] transition-colors"
                      >
                        <FolderKanban className="w-4 h-4" />
                      </button>
                    )}

                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicate(area.id)}
                      title="Duplicar Área"
                      className="p-2 rounded-lg bg-[#151922] hover:bg-[#1D2230] text-gray-300 hover:text-white border border-[#222738] transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Toggle Status */}
                    <button
                      onClick={() => toggleMemberAreaStatus(area.id)}
                      title={isPublished ? 'Desativar Área' : 'Ativar Área'}
                      className={`p-2 rounded-lg border transition-colors ${
                        isPublished 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                          : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Delete */}
                    <button
                      onClick={() => setConfirmDeleteId(area.id)}
                      title="Excluir Área"
                      className="p-2 rounded-lg bg-[#151922] hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-[#222738] hover:border-rose-500/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(area)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-semibold text-xs border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Editar
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

      {/* MODAL CRIAR / EDITAR ÁREA */}
      {showModal && editingArea && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D0F12] border border-[#222738] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#1D2230] flex items-center justify-between bg-[#08090C] rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingArea.id ? `Editar Área: ${editingArea.name}` : 'Criar Nova Área de Membros'}
                  </h3>
                  <p className="text-xs text-gray-400">Configure os parâmetros, identidade visual e login da área.</p>
                </div>
              </div>

              <button
                onClick={() => { setShowModal(false); setEditingArea(null); }}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#151922]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#1D2230] px-6 bg-[#0B0F19] gap-4">
              {[
                { id: 'info', label: '1. Informações Principais', icon: Sliders },
                { id: 'branding', label: '2. Identidade Visual & Cores', icon: Palette },
                { id: 'login', label: '3. Tela de Login Exclusiva', icon: Monitor }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalTab(tab.id as any)}
                    className={`py-3.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                      modalTab === tab.id
                        ? 'border-[#D4AF37] text-[#D4AF37]'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: INFO */}
              {modalTab === 'info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Nome da Área de Membros *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Formação VIP PRO, E-books de Elite"
                        value={editingArea.name || ''}
                        onChange={e => handleNameChange(e.target.value)}
                        className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Slug da URL * (sem barras)
                      </label>
                      <div className="flex items-center bg-[#151922] border border-[#222738] rounded-xl px-3 focus-within:border-[#D4AF37]">
                        <span className="text-gray-500 text-xs font-mono">/</span>
                        <input
                          type="text"
                          required
                          placeholder="formacao-vip"
                          value={editingArea.slug || ''}
                          onChange={e => setEditingArea(prev => ({ ...prev!, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') }))}
                          className="w-full bg-transparent border-0 px-2 py-2.5 text-sm text-white font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Tipo de Conteúdo Predominante
                      </label>
                      <select
                        value={editingArea.type || 'vip'}
                        onChange={e => setEditingArea(prev => ({ ...prev!, type: e.target.value as MemberAreaType }))}
                        className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="vip">VIP (Ecossistema Completo)</option>
                        <option value="cursos">Cursos & Videoaulas</option>
                        <option value="ebooks">E-books & Playbooks</option>
                        <option value="aplicativos">Aplicativos & SaaS</option>
                        <option value="ferramentas">Ferramentas & Scripts</option>
                        <option value="produtos_digitais">Produtos Digitais & PLRs</option>
                        <option value="personalizada">Personalizada</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Status de Publicação
                      </label>
                      <select
                        value={editingArea.status || 'active'}
                        onChange={e => setEditingArea(prev => ({ ...prev!, status: e.target.value as any }))}
                        className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="active">Ativa (Acessível pelos alunos com permissão)</option>
                        <option value="inactive">Inativa / Oculta (Rascunho)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Descrição da Área
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Breve resumo sobre os conteúdos, propostas de valor e o que o aluno encontrará aqui."
                      value={editingArea.description || ''}
                      onChange={e => setEditingArea(prev => ({ ...prev!, description: e.target.value }))}
                      className="w-full bg-[#151922] border border-[#222738] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Texto de Boas-vindas (Exibido no Topo da Área)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Bem-vindo à Formação VIP PRO. Acesse suas masterclasses e acelere sua operação."
                      value={editingArea.welcomeText || ''}
                      onChange={e => setEditingArea(prev => ({ ...prev!, welcomeText: e.target.value }))}
                      className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: BRANDING */}
              {modalTab === 'branding' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-gray-300">
                          Logo da Área (URL da Imagem)
                        </label>
                        <span className="text-[10px] text-gray-400 font-medium">800 × 200 px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="/areas/ebooks/logo.png ou https://..."
                          value={editingArea.logoUrl || ''}
                          onChange={e => setEditingArea(prev => ({ ...prev!, logoUrl: e.target.value }))}
                          className="flex-1 bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                        <label 
                          title="Fazer upload do Logo (800x200 px)"
                          className={`p-2.5 bg-[#1C2230] hover:bg-[#D4AF37]/20 border border-[#2E364A] hover:border-[#D4AF37]/50 rounded-xl cursor-pointer text-gray-300 hover:text-[#D4AF37] transition-all flex items-center justify-center shrink-0 ${uploadingField === 'logoUrl' ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          <Upload className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            className="hidden"
                            onChange={e => handleAssetUpload(e, 'logoUrl', 800, 200)}
                          />
                        </label>
                      </div>
                      {editingArea.logoUrl && (
                        <div className="mt-2 p-2 bg-[#0E1015] border border-[#222738] rounded-lg flex items-center gap-3">
                          <img 
                            src={editingArea.logoUrl} 
                            alt="Preview Logo" 
                            className="h-6 max-w-[120px] object-contain" 
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[10px] text-gray-400 font-mono truncate flex-1">
                            {editingArea.logoUrl.startsWith('data:') ? 'Asset personalizado (carregado)' : editingArea.logoUrl}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-gray-300">
                          Favicon da Área (URL do Ícone)
                        </label>
                        <span className="text-[10px] text-gray-400 font-medium">512 × 512 px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="/areas/ebooks/favicon.png ou https://..."
                          value={editingArea.faviconUrl || ''}
                          onChange={e => setEditingArea(prev => ({ ...prev!, faviconUrl: e.target.value }))}
                          className="flex-1 bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                        <label 
                          title="Fazer upload do Favicon (512x512 px)"
                          className={`p-2.5 bg-[#1C2230] hover:bg-[#D4AF37]/20 border border-[#2E364A] hover:border-[#D4AF37]/50 rounded-xl cursor-pointer text-gray-300 hover:text-[#D4AF37] transition-all flex items-center justify-center shrink-0 ${uploadingField === 'faviconUrl' ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          <Upload className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            className="hidden"
                            onChange={e => handleAssetUpload(e, 'faviconUrl', 512, 512)}
                          />
                        </label>
                      </div>
                      {editingArea.faviconUrl && (
                        <div className="mt-2 p-2 bg-[#0E1015] border border-[#222738] rounded-lg flex items-center gap-3">
                          <img 
                            src={editingArea.faviconUrl} 
                            alt="Preview Favicon" 
                            className="w-6 h-6 object-contain rounded" 
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[10px] text-gray-400 font-mono truncate flex-1">
                            {editingArea.faviconUrl.startsWith('data:') ? 'Asset personalizado (carregado)' : editingArea.faviconUrl}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-gray-300">
                          Banner Horizontal Principal (Desktop)
                        </label>
                        <span className="text-[10px] text-gray-400 font-medium">1920 × 600 px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="/areas/ebooks/banner.png ou https://..."
                          value={editingArea.bannerUrl || ''}
                          onChange={e => setEditingArea(prev => ({ ...prev!, bannerUrl: e.target.value }))}
                          className="flex-1 bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                        <label 
                          title="Fazer upload do Banner (1920x600 px)"
                          className={`p-2.5 bg-[#1C2230] hover:bg-[#D4AF37]/20 border border-[#2E364A] hover:border-[#D4AF37]/50 rounded-xl cursor-pointer text-gray-300 hover:text-[#D4AF37] transition-all flex items-center justify-center shrink-0 ${uploadingField === 'bannerUrl' ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          <Upload className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            className="hidden"
                            onChange={e => handleAssetUpload(e, 'bannerUrl', 1920, 600)}
                          />
                        </label>
                      </div>
                      {editingArea.bannerUrl && (
                        <div className="mt-2 p-2 bg-[#0E1015] border border-[#222738] rounded-lg flex items-center gap-3">
                          <img 
                            src={editingArea.bannerUrl} 
                            alt="Preview Banner" 
                            className="h-8 w-24 object-cover rounded" 
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[10px] text-gray-400 font-mono truncate flex-1">
                            {editingArea.bannerUrl.startsWith('data:') ? 'Asset personalizado (carregado)' : editingArea.bannerUrl}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-gray-300">
                          Imagem de Capa (Card / Thumbnail)
                        </label>
                        <span className="text-[10px] text-gray-400 font-medium">1000 × 1250 px (4:5)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="/areas/ebooks/capa.png ou https://..."
                          value={editingArea.coverUrl || ''}
                          onChange={e => setEditingArea(prev => ({ ...prev!, coverUrl: e.target.value }))}
                          className="flex-1 bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                        <label 
                          title="Fazer upload da Capa (1000x1250 px)"
                          className={`p-2.5 bg-[#1C2230] hover:bg-[#D4AF37]/20 border border-[#2E364A] hover:border-[#D4AF37]/50 rounded-xl cursor-pointer text-gray-300 hover:text-[#D4AF37] transition-all flex items-center justify-center shrink-0 ${uploadingField === 'coverUrl' ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          <Upload className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            className="hidden"
                            onChange={e => handleAssetUpload(e, 'coverUrl', 1000, 1250)}
                          />
                        </label>
                      </div>
                      {editingArea.coverUrl && (
                        <div className="mt-2 p-2 bg-[#0E1015] border border-[#222738] rounded-lg flex items-center gap-3">
                          <img 
                            src={editingArea.coverUrl} 
                            alt="Preview Capa" 
                            className="h-10 w-8 object-cover rounded" 
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[10px] text-gray-400 font-mono truncate flex-1">
                            {editingArea.coverUrl.startsWith('data:') ? 'Asset personalizado (carregado)' : editingArea.coverUrl}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Cor Primária / Destaque
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
                          className="flex-1 bg-[#151922] border border-[#222738] rounded-xl px-4 py-2 text-sm text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Cor Secundária / Fundo de Cards
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={editingArea.secondaryColor || '#151922'}
                          onChange={e => setEditingArea(prev => ({ ...prev!, secondaryColor: e.target.value }))}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={editingArea.secondaryColor || '#151922'}
                          onChange={e => setEditingArea(prev => ({ ...prev!, secondaryColor: e.target.value }))}
                          className="flex-1 bg-[#151922] border border-[#222738] rounded-xl px-4 py-2 text-sm text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LOGIN SCREEN */}
              {modalTab === 'login' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#151922] rounded-xl border border-[#222738]">
                    <h4 className="text-sm font-bold text-white mb-1">Personalização do Login de /{editingArea.slug || 'slug'}</h4>
                    <p className="text-xs text-gray-400">
                      Quando um usuário não autenticado acessar a URL desta área, ele visualizará esta tela de login com sua própria identidade.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Tipo de Fundo do Login
                      </label>
                      <select
                        value={editingArea.loginCustomization?.backgroundType || 'image'}
                        onChange={e => setEditingArea(prev => ({
                          ...prev!,
                          loginCustomization: {
                            ...prev!.loginCustomization!,
                            backgroundType: e.target.value as any
                          }
                        }))}
                        className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="image">Imagem Estática (URL)</option>
                        <option value="mp4">Vídeo MP4 Cinematográfico</option>
                        <option value="youtube">Vídeo do YouTube em Loop Disfarçado</option>
                        <option value="gradient">Gradiente Luxo</option>
                        <option value="solid">Cor Sólida Escura</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        URL do Fundo (Imagem, MP4 ou YouTube)
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={editingArea.loginCustomization?.backgroundUrl || ''}
                        onChange={e => setEditingArea(prev => ({
                          ...prev!,
                          loginCustomization: {
                            ...prev!.loginCustomization!,
                            backgroundUrl: e.target.value
                          }
                        }))}
                        className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Título de Destaque no Login
                      </label>
                      <input
                        type="text"
                        value={editingArea.loginCustomization?.brandTitle || ''}
                        onChange={e => setEditingArea(prev => ({
                          ...prev!,
                          loginCustomization: {
                            ...prev!.loginCustomization!,
                            brandTitle: e.target.value
                          }
                        }))}
                        placeholder={editingArea.name?.toUpperCase()}
                        className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Subtítulo no Login
                      </label>
                      <input
                        type="text"
                        value={editingArea.loginCustomization?.brandSubtitle || ''}
                        onChange={e => setEditingArea(prev => ({
                          ...prev!,
                          loginCustomization: {
                            ...prev!.loginCustomization!,
                            brandSubtitle: e.target.value
                          }
                        }))}
                        placeholder="ÁREA DE MEMBROS EXCLUSIVA"
                        className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-[#1D2230] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingArea(null); }}
                  className="px-5 py-2.5 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-gray-300 text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold text-sm hover:opacity-95 shadow-lg shadow-[#D4AF37]/20 transition-all"
                >
                  Salvar Área de Membros
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
