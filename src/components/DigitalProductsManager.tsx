import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Layers, 
  BookOpen, 
  Smartphone, 
  Wrench, 
  FileText, 
  ExternalLink, 
  Check, 
  X, 
  Download, 
  Star, 
  Sliders, 
  Power,
  PlaySquare,
  Sparkles,
  Link as LinkIcon,
  FileUp,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Activity,
  Webhook,
  CheckCheck,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useStore } from '../services/store';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { DigitalProduct, DigitalProductType, MemberArea } from '../types';
import { EbookUploadControl } from './admin/EbookUploadControl';

interface DigitalProductsManagerProps {
  initialAreaId?: string;
  onPreviewProduct?: (product: DigitalProduct) => void;
  onSelectCourse?: (courseId: string) => void;
}

export const DigitalProductsManager: React.FC<DigitalProductsManagerProps> = ({
  initialAreaId,
  onPreviewProduct,
  onSelectCourse
}) => {
  const { 
    currentUser,
    digitalProducts, 
    memberAreas, 
    courses, 
    produtosCursos,
    saveDigitalProduct, 
    deleteDigitalProduct, 
    toggleDigitalProductStatus 
  } = useStore();

  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>(initialAreaId || 'all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<DigitalProduct> | null>(null);
  const [verifyingProduct, setVerifyingProduct] = useState<DigitalProduct | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getCommercialBadge = (status?: string, extId?: string) => {
    const current = status || (extId === 'PENDENTE' || !extId ? 'PENDENTE' : 'CONFIGURADO');
    switch (current) {
      case 'ATIVO':
        return { label: 'ATIVO', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
      case 'CONFIGURADO':
        return { label: 'CONFIGURADO', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' };
      case 'TESTE':
        return { label: 'TESTE', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' };
      case 'PAUSADO':
        return { label: 'PAUSADO', color: 'bg-gray-500/20 text-gray-400 border-gray-500/40' };
      case 'ERRO':
        return { label: 'ERRO', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' };
      case 'PENDENTE':
      default:
        return { label: 'PENDENTE', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
    }
  };

  const getIntegrationAudit = (prod?: Partial<DigitalProduct> | null) => {
    if (!prod) return null;
    const extId = prod.externalProductId?.trim() || '';
    const extIdIsPendente = extId.toUpperCase() === 'PENDENTE' || extId.length === 0;
    const externalIdValid = !extIdIsPendente;
    const externalIdNote = extIdIsPendente 
      ? 'Configuração comercial externa pendente. Código do gateway ainda não fornecido.' 
      : `ID externo configurado: "${extId}"`;

    const checkout = prod.checkoutUrl?.trim() || '';
    const checkoutValid = Boolean(
      checkout.length > 0 &&
      checkout !== '#' &&
      !checkout.includes('example.com') &&
      (checkout.startsWith('http://') || checkout.startsWith('https://'))
    );
    const checkoutNote = checkoutValid
      ? `Link direto de checkout válido (${checkout.substring(0, 35)}...)`
      : 'Checkout direto ainda não configurado (em preparação)';

    // Mapeamento em produtos_cursos
    const matchingMappings = produtosCursos.filter(m => 
      m.ativo !== false && (
        (m.digital_product_id && m.digital_product_id === prod.id) ||
        (m.produto_id && extId && !extIdIsPendente && m.produto_id === extId)
      )
    );
    const mappingConflict = matchingMappings.length > 1;
    const mappingValid = matchingMappings.length === 1;
    let mappingNote = '';
    if (mappingConflict) {
      mappingNote = `ATENÇÃO: Múltiplos mapeamentos (${matchingMappings.length}) encontrados para este produto! O Webhook bloqueará por segurança.`;
    } else if (mappingValid) {
      mappingNote = `Mapeamento único ativo encontrado em produtos_cursos (ID: ${matchingMappings[0].id}, Destino: ${matchingMappings[0].produto_nome}).`;
    } else {
      mappingNote = 'Nenhum mapeamento ativo encontrado em produtos_cursos para este produto.';
    }

    // Entrega / Storage
    let deliveryValid = false;
    let deliveryNote = '';
    const isEbookType = prod.type?.toLowerCase() === 'ebook' || prod.id === 'prod-depois-dos-60-real';
    if (isEbookType) {
      deliveryValid = Boolean(prod.storagePath && prod.storagePath.trim().length > 0);
      deliveryNote = deliveryValid 
        ? `Arquivo protegido no bucket Supabase: "${prod.storagePath}"`
        : 'Caminho no storage ainda não informado.';
    } else if (prod.type === 'curso') {
      deliveryValid = Boolean(prod.courseId && prod.courseId.trim().length > 0);
      deliveryNote = deliveryValid ? 'Curso estruturado vinculado com sucesso.' : 'Nenhum curso estruturado vinculado.';
    } else {
      deliveryValid = true;
      deliveryNote = 'Entregável digital pronto para entrega.';
    }

    const commStatus = (prod.commercialStatus || (extIdIsPendente ? 'PENDENTE' : 'CONFIGURADO')) as any;
    const isReadyForSales = externalIdValid && checkoutValid && mappingValid && !mappingConflict && (commStatus === 'ATIVO' || commStatus === 'CONFIGURADO');

    return {
      product: prod as DigitalProduct,
      commercialStatus: commStatus,
      externalIdValid,
      externalIdNote,
      checkoutValid,
      checkoutNote,
      mappingValid,
      mappingConflict,
      mappingNote,
      matchedMapping: matchingMappings[0],
      deliveryValid,
      deliveryNote,
      isReadyForSales
    };
  };

  const handleCreateNew = () => {
    const defaultAreaId = memberAreas[0]?.id || 'area-formacao-vip';
    setEditingProduct({
      title: '',
      shortDescription: '',
      fullDescription: '',
      areaId: selectedAreaFilter !== 'all' ? selectedAreaFilter : defaultAreaId,
      type: 'curso',
      category: 'Masterclasses',
      coverUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80',
      status: 'published',
      featured: false,
      accessLevel: 'vip',
      order: digitalProducts.length + 1,
      author: {
        name: 'Renato Nardin',
        role: 'Especialista VIP',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      }
    });
    setShowModal(true);
  };

  const handleEdit = (product: DigitalProduct) => {
    setEditingProduct({
      ...product,
      type: (product.type?.toLowerCase() as DigitalProductType) || 'curso'
    });
    setShowModal(true);
  };

  const handleManagePdf = (product: DigitalProduct) => {
    const isDepoisDos60 = product.id === 'prod-depois-dos-60-real';
    const normalizedProduct: DigitalProduct = {
      ...product,
      type: 'ebook',
      storagePath: product.storagePath || (isDepoisDos60 ? 'prod-depois-dos-60-real/depois-dos-60-50-cuidados.pdf' : product.storagePath)
    };
    setEditingProduct(normalizedProduct);
    setShowModal(true);
    setTimeout(() => {
      const el = document.getElementById('admin-ebook-config-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  };

  const handleDuplicate = (product: DigitalProduct) => {
    const duplicated: DigitalProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      title: `${product.title} (Cópia)`,
      order: digitalProducts.length + 1
    };
    saveDigitalProduct(duplicated as any);
    showToast(`Produto "${duplicated.title}" duplicado com sucesso!`);
  };

  const handleDelete = (id: string) => {
    deleteDigitalProduct(id);
    setConfirmDeleteId(null);
    showToast('Produto excluído com sucesso.');
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.areaId || !editingProduct?.type) {
      alert('Preencha os campos obrigatórios: Título, Área de Membros e Tipo.');
      return;
    }

    const payload = {
      ...editingProduct,
      type: (editingProduct.type?.toLowerCase() as DigitalProductType) || 'curso'
    };

    saveDigitalProduct(payload as any);
    setShowModal(false);
    setEditingProduct(null);
    showToast('Produto salvo com sucesso no catálogo!');
  };

  const getTypeIcon = (type: DigitalProductType) => {
    switch (type?.toLowerCase()) {
      case 'curso': return <PlaySquare className="w-4 h-4 text-emerald-400" />;
      case 'ebook': return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'aplicativo': return <Smartphone className="w-4 h-4 text-blue-400" />;
      case 'ferramenta': return <Wrench className="w-4 h-4 text-purple-400" />;
      case 'arquivo': return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'link': return <LinkIcon className="w-4 h-4 text-pink-400" />;
      default: return <Package className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredProducts = digitalProducts.filter(prod => {
    const matchesArea = selectedAreaFilter === 'all' || prod.areaId === selectedAreaFilter;
    const matchesType = selectedTypeFilter === 'all' || prod.type?.toLowerCase() === selectedTypeFilter.toLowerCase();
    const matchesSearch = 
      prod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesArea && matchesType && matchesSearch;
  });

  return (
    <div id="digital-products-manager" className="space-y-6">
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
                <Package className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Catálogo de Produtos Digitais & Entregáveis
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-2xl">
              Gerencie todos os cursos, e-books, softwares, aplicativos e downloads vinculados a cada área de membros com total controle de acesso.
            </p>
          </div>

          <button
            id="btn-new-digital-product"
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold rounded-xl hover:opacity-95 shadow-lg shadow-[#D4AF37]/20 transition-all text-sm shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            + NOVO PRODUTO DIGITAL
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-8 pt-6 border-t border-[#1D2230] flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar produtos ou categorias..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#151922] border border-[#222738] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/60"
            />
          </div>

          {/* Area & Type Selects */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Area Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Área:</span>
              <select
                value={selectedAreaFilter}
                onChange={e => setSelectedAreaFilter(e.target.value)}
                className="bg-[#151922] border border-[#222738] text-white text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Todas as Áreas ({digitalProducts.length})</option>
                {memberAreas.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.name} (/{area.slug})
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Tipo:</span>
              <select
                value={selectedTypeFilter}
                onChange={e => setSelectedTypeFilter(e.target.value)}
                className="bg-[#151922] border border-[#222738] text-white text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Todos os Tipos</option>
                <option value="curso">Cursos</option>
                <option value="ebook">E-books</option>
                <option value="aplicativo">Aplicativos</option>
                <option value="ferramenta">Ferramentas</option>
                <option value="arquivo">Arquivos</option>
                <option value="link">Links Externos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map(prod => {
          const area = memberAreas.find(a => a.id === prod.areaId);
          const isPublished = prod.status === 'published';

          return (
            <div 
              key={prod.id}
              id={`card-product-${prod.id}`}
              className="bg-[#0D0F12] border border-[#1D2230] rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col group shadow-lg"
            >
              {/* Product Cover Thumbnail */}
              <div className="relative h-44 w-full bg-[#151922] overflow-hidden">
                <img 
                  src={prod.coverUrl || 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80'} 
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F12] via-transparent to-black/60" />

                {/* Badges Top */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-black/80 backdrop-blur-md border border-[#222738] text-white">
                    {getTypeIcon(prod.type)}
                    <span className="capitalize">{prod.type}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {prod.featured && (
                      <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-[#D4AF37] text-black flex items-center gap-1">
                        <Star className="w-3 h-3 fill-black" />
                        Destaque
                      </span>
                    )}

                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase border ${
                      isPublished 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}>
                      {isPublished ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                </div>

                {/* Area Tag */}
                {area && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white bg-black/75 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
                    <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="font-medium truncate max-w-[200px]">{area.name}</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
                    {prod.category}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {prod.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {prod.shortDescription || 'Sem descrição cadastrada.'}
                  </p>
                </div>

                {/* Type Details Meta */}
                <div className="p-3 bg-[#151922] rounded-xl border border-[#222738] text-xs text-gray-300">
                  {prod.type === 'curso' && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Curso Vinculado:</span>
                      <span className="font-semibold text-white">
                        {courses.find(c => c.id === prod.courseId)?.title || 'Curso Interno'}
                      </span>
                    </div>
                  )}

                  {(prod.type?.toLowerCase() === 'ebook' || prod.id === 'prod-depois-dos-60-real') && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Páginas: {prod.ebook?.pageCount || 50}</span>
                        <span className="font-semibold text-amber-400">{prod.ebook?.fileFormat?.toUpperCase() || 'PDF'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#222738]/60">
                        <span className="text-gray-400">Storage Privado:</span>
                        {prod.storagePath ? (
                          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded truncate max-w-[150px]" title={prod.storagePath}>
                            {prod.storagePath.split('/').pop()}
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                            PDF NÃO ENVIADO
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {prod.type === 'aplicativo' && prod.app && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Versão: {prod.app.version || '1.0.0'}</span>
                      <span className="font-semibold text-blue-400">{prod.app.platform || 'Web App'}</span>
                    </div>
                  )}

                  {prod.type === 'ferramenta' && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Ferramenta:</span>
                      <span className="font-semibold text-purple-400">{prod.tool?.techStack || 'Online'}</span>
                    </div>
                  )}

                  {prod.type === 'arquivo' && prod.file && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Tamanho: {prod.file.fileSize || '—'}</span>
                      <span className="font-semibold text-cyan-400">{prod.file.fileFormat?.toUpperCase() || 'ZIP'}</span>
                    </div>
                  )}

                  {prod.type === 'link' && prod.link && (
                    <div className="flex items-center justify-between truncate">
                      <span className="text-gray-400">Destino:</span>
                      <span className="font-semibold text-pink-400 truncate max-w-[160px]">{prod.link.targetUrl}</span>
                    </div>
                  )}
                </div>

                {/* Commercial Status & Integration Pill */}
                <div className="pt-2 border-t border-[#1D2230] space-y-2">
                  {prod.id === 'prod-depois-dos-60-real' ? (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-[11px]">PRODUTO: CONFIGURAÇÃO COMERCIAL PENDENTE</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-extrabold">
                        PENDENTE
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Webhook className="w-3 h-3 text-[#D4AF37]" />
                        <span>Status Comercial:</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        getCommercialBadge(prod.commercialStatus, prod.externalProductId).color
                      }`}>
                        {getCommercialBadge(prod.commercialStatus, prod.externalProductId).label}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="truncate max-w-[170px]">
                      ID Ext: <span className="text-gray-300 font-mono">{prod.externalProductId || 'Pendente'}</span>
                    </span>
                    <button
                      onClick={() => setVerifyingProduct(prod)}
                      className="text-[#D4AF37] hover:underline font-bold text-[11px] flex items-center gap-1 transition-colors"
                      title="Auditar integração e regras de liberação"
                    >
                      <Activity className="w-3 h-3" />
                      Verificar Integração
                    </button>
                  </div>
                </div>

                {/* AÇÃO DESTACADA: GERENCIAR PDF (Fase 3.10 - Exclusivo Administrador) */}
                {currentUser?.role === 'admin' && (prod.type?.toLowerCase() === 'ebook' || prod.id === 'prod-depois-dos-60-real') && (
                  <div className="pt-2 border-t border-[#1D2230]">
                    <button
                      id={`btn-manage-pdf-${prod.id}`}
                      type="button"
                      onClick={() => handleManagePdf(prod)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/20 hover:from-amber-500/35 hover:to-amber-600/35 text-amber-300 hover:text-amber-100 border border-amber-500/50 hover:border-amber-400 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/10 group/pdf active:scale-[0.98]"
                      title="Abrir configurações e gerenciar upload seguro do PDF no Storage"
                    >
                      <FileUp className="w-4 h-4 text-amber-400 group-hover/pdf:scale-110 transition-transform" />
                      <span>📄 GERENCIAR PDF</span>
                      {prod.storagePath ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                          VINCULADO
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/40 font-mono animate-pulse">
                          ENVIAR
                        </span>
                      )}
                    </button>
                  </div>
                )}

                {/* Actions Bottom Bar */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#1D2230]">
                  <div className="flex items-center gap-1">
                    {/* Preview / Action */}
                    {onPreviewProduct && (
                      <button
                        onClick={() => onPreviewProduct(prod)}
                        title="Pré-visualizar Entrega"
                        className="p-2 rounded-lg bg-[#151922] hover:bg-[#1D2230] text-gray-300 hover:text-[#D4AF37] border border-[#222738] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicate(prod)}
                      title="Duplicar Produto"
                      className="p-2 rounded-lg bg-[#151922] hover:bg-[#1D2230] text-gray-300 hover:text-white border border-[#222738] transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Toggle Status */}
                    <button
                      onClick={() => toggleDigitalProductStatus(prod.id)}
                      title={isPublished ? 'Mudar para Rascunho' : 'Publicar'}
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
                      onClick={() => setConfirmDeleteId(prod.id)}
                      title="Excluir Produto"
                      className="p-2 rounded-lg bg-[#151922] hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-[#222738] hover:border-rose-500/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(prod)}
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

      {filteredProducts.length === 0 && (
        <div className="bg-[#0D0F12] border border-[#1D2230] rounded-2xl p-12 text-center">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Nenhum produto digital encontrado</h3>
          <p className="text-gray-400 text-sm mt-1">Crie um novo produto ou altere os filtros de área e tipo.</p>
        </div>
      )}

      {/* MODAL EDITAR / CRIAR PRODUTO */}
      {showModal && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D0F12] border border-[#222738] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#1D2230] flex items-center justify-between bg-[#08090C] rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37]">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingProduct.id ? `Editar Produto: ${editingProduct.title}` : 'Novo Produto Digital'}
                  </h3>
                  <p className="text-xs text-gray-400">Configure os dados de entrega, área de membros e metadados.</p>
                </div>
              </div>

              <button
                onClick={() => { setShowModal(false); setEditingProduct(null); }}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#151922]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Row 1: Title and Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Título do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Masterclass Tráfego Pago 2026, E-book Funis de Conversão"
                    value={editingProduct.title || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev!, title: e.target.value }))}
                    className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Área de Membros Pertencente *
                  </label>
                  <select
                    required
                    value={editingProduct.areaId || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev!, areaId: e.target.value }))}
                    className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {memberAreas.map(area => (
                      <option key={area.id} value={area.id}>
                        {area.name} (/{area.slug})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Type and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Tipo do Entregável *
                  </label>
                  <select
                    value={editingProduct.type || 'curso'}
                    onChange={e => setEditingProduct(prev => ({ ...prev!, type: e.target.value as DigitalProductType }))}
                    className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="curso">Curso / Videoaulas</option>
                    <option value="ebook">E-book / Livro Digital</option>
                    <option value="aplicativo">Aplicativo / Software</option>
                    <option value="ferramenta">Ferramenta / Calculadora</option>
                    <option value="arquivo">Arquivo / Download (ZIP, PSD)</option>
                    <option value="link">Link / Comunidade Externa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Categoria
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Masterclasses, Gestão, Tráfego"
                    value={editingProduct.category || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev!, category: e.target.value }))}
                    className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Status
                  </label>
                  <select
                    value={editingProduct.status || 'published'}
                    onChange={e => setEditingProduct(prev => ({ ...prev!, status: e.target.value as any }))}
                    className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="published">Publicado</option>
                    <option value="draft">Rascunho</option>
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Descrição Curta
                </label>
                <input
                  type="text"
                  placeholder="Resumo em 1 frase para o card do catálogo..."
                  value={editingProduct.shortDescription || ''}
                  onChange={e => setEditingProduct(prev => ({ ...prev!, shortDescription: e.target.value }))}
                  className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Descrição Completa
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalhamento do conteúdo, tópicos abordados, diferenciais..."
                  value={editingProduct.fullDescription || ''}
                  onChange={e => setEditingProduct(prev => ({ ...prev!, fullDescription: e.target.value }))}
                  className="w-full bg-[#151922] border border-[#222738] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Media URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Imagem de Capa (URL da Thumbnail)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={editingProduct.coverUrl || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev!, coverUrl: e.target.value }))}
                    className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Banner de Destaque (URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={editingProduct.bannerUrl || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev!, bannerUrl: e.target.value }))}
                    className="w-full bg-[#151922] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* COMMERCIAL & GATEWAY INTEGRATION CONFIG */}
              <div className="p-4 bg-[#151922] rounded-xl border border-[#222738] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#222738]">
                  <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                    <Webhook className="w-4 h-4 text-[#D4AF37]" />
                    Integração Comercial & Gateway de Pagamentos (Kiwify / PerfectPay)
                  </h4>

                  <button
                    type="button"
                    onClick={() => {
                      if (editingProduct) {
                        setVerifyingProduct(editingProduct as DigitalProduct);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    VERIFICAR INTEGRAÇÃO
                  </button>
                </div>

                {/* Commercial Status & Platform */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Status Comercial do Produto *
                    </label>
                    <select
                      value={editingProduct.commercialStatus || (editingProduct.externalProductId === 'PENDENTE' || !editingProduct.externalProductId ? 'PENDENTE' : 'CONFIGURADO')}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, commercialStatus: e.target.value as any }))}
                      className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="PENDENTE">PENDENTE (Aguardando Gateway)</option>
                      <option value="CONFIGURADO">CONFIGURADO (Dados preenchidos)</option>
                      <option value="TESTE">TESTE (Em homologação)</option>
                      <option value="ATIVO">ATIVO (Pronto para Vendas)</option>
                      <option value="PAUSADO">PAUSADO (Vendas suspensas)</option>
                      <option value="ERRO">ERRO (Inconsistência cadastral)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      ID Externo do Produto no Gateway
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: PPA882194, KW-PROD-991 ou PENDENTE"
                      value={editingProduct.externalProductId || ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, externalProductId: e.target.value }))}
                      className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37] font-mono"
                    />
                    <span className="text-[10px] text-gray-400 block mt-1">Mantenha "PENDENTE" até emitir o ID real no gateway.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Plataforma de Checkout
                    </label>
                    <select
                      value={editingProduct.platform || 'todas'}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, platform: e.target.value as any }))}
                      className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="kiwify">Kiwify</option>
                      <option value="perfectpay">PerfectPay</option>
                      <option value="todas">Todas / Multiplataforma</option>
                    </select>
                  </div>
                </div>

                {/* Webhook active toggle & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-[#0D0F12] rounded-xl border border-[#222738]">
                    <input
                      type="checkbox"
                      id="webhookActiveToggle"
                      checked={editingProduct.webhookActive ?? (editingProduct.externalProductId !== 'PENDENTE' && Boolean(editingProduct.externalProductId))}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, webhookActive: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-600 text-[#D4AF37] focus:ring-[#D4AF37] bg-gray-900 cursor-pointer"
                    />
                    <label htmlFor="webhookActiveToggle" className="text-xs text-gray-300 font-semibold cursor-pointer">
                      Habilitar processamento automático de Webhook para este produto
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Preço de Referência (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="97.00"
                      value={editingProduct.price || ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, price: Number(e.target.value) }))}
                      className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Strategy, Sales Page & Checkout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Estratégia de Oferta
                    </label>
                    <select
                      value={editingProduct.salesStrategy || 'modal'}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, salesStrategy: e.target.value as any }))}
                      className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="modal">Modal de Oferta (Padrão Formação VIP)</option>
                      <option value="sales_page">Página de Vendas Externa</option>
                      <option value="presell">Página de Pré-Sell / VSL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Sales Page URL (Página de Vendas)
                    </label>
                    <input
                      type="url"
                      placeholder="https://depois-dos-60.vercel.app/"
                      value={editingProduct.salesPageUrl || ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, salesPageUrl: e.target.value }))}
                      className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Checkout URL (Link Direto de Compra)
                    </label>
                    <input
                      type="url"
                      placeholder="https://pay.gateway.com/checkout..."
                      value={editingProduct.checkoutUrl || ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, checkoutUrl: e.target.value }))}
                      className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                    <span className="text-[10px] text-gray-400 block mt-1">Deixe em branco para exibir aviso de checkout em preparação.</span>
                  </div>
                </div>

                {/* Real-time mapping badge */}
                {(() => {
                  const audit = getIntegrationAudit(editingProduct);
                  if (!audit) return null;
                  return (
                    <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      audit.mappingValid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
                      audit.mappingConflict ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' :
                      'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        {audit.mappingValid ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                        <span>{audit.mappingNote}</span>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/40 font-bold uppercase">
                        {audit.mappingValid ? 'Mapeamento OK' : audit.mappingConflict ? 'Conflito' : 'Não Mapeado'}
                      </span>
                    </div>
                  );
                })()}
              </div>
              {/* 1. CURSO */}
              {editingProduct.type === 'curso' && (
                <div className="p-4 bg-[#151922] rounded-xl border border-[#222738] space-y-4">
                  <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                    <PlaySquare className="w-4 h-4" />
                    Vínculo com Curso da Plataforma
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Selecione o Curso Estruturado
                    </label>
                    <select
                      value={editingProduct.courseId || ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev!, courseId: e.target.value }))}
                      className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="">-- Selecione ou deixe em branco para criar depois --</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title} ({c.modules?.length || 0} módulos)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* 2. E-BOOK */}
              {(editingProduct.type?.toLowerCase() === 'ebook' || editingProduct.id === 'prod-depois-dos-60-real') && (
                <div 
                  id="admin-ebook-config-section" 
                  className="p-5 bg-[#151922] rounded-2xl border-2 border-amber-500/40 shadow-xl shadow-amber-500/5 space-y-5 scroll-mt-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222738]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          Configuração do E-book & Arquivo Protegido
                          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Fase 3.10
                          </span>
                        </h4>
                        <p className="text-xs text-gray-400">
                          Gerencie a entrega protegida via Supabase Storage Privado.
                        </p>
                      </div>
                    </div>

                    <div>
                      {editingProduct.storagePath ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <Check className="w-3.5 h-3.5" /> PDF VINCULADO COM SUCESSO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" /> PDF AINDA NÃO ENVIADO
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arquitetura de Segurança Aviso */}
                  <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-3 text-xs text-amber-200/90">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-amber-300">Arquitetura de Segurança Ativa:</span>
                      <p className="leading-relaxed">
                        O PDF comercial é mantido no bucket privado <code className="font-mono bg-[#0D0F12] px-1.5 py-0.5 rounded text-amber-300 border border-amber-500/30">ebooks</code> do Supabase. O leitor gera URLs assinadas temporárias exclusivamente para alunos com acesso liberado.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Caminho no Storage (Privado Supabase)
                      </label>
                      <input
                        type="text"
                        placeholder="prod-depois-dos-60-real/depois-dos-60-50-cuidados.pdf"
                        value={editingProduct.storagePath || ''}
                        onChange={e => setEditingProduct(prev => ({
                          ...prev!,
                          storagePath: e.target.value
                        }))}
                        className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm font-mono text-amber-300 focus:outline-none focus:border-[#D4AF37]"
                      />
                      <p className="text-[11px] text-gray-500 mt-1">
                        * Padrão oficial: <code className="text-gray-400 font-mono">prod-depois-dos-60-real/depois-dos-60-50-cuidados.pdf</code>
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Qtd. de Páginas
                      </label>
                      <input
                        type="number"
                        placeholder="50"
                        value={editingProduct.ebook?.pageCount || (editingProduct.id === 'prod-depois-dos-60-real' ? 50 : '')}
                        onChange={e => setEditingProduct(prev => ({
                          ...prev!,
                          ebook: { ...(prev!.ebook || {}), pageCount: Number(e.target.value) }
                        }))}
                        className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  {/* Controle de Upload Físico ao Storage */}
                  <div className="pt-3 border-t border-[#222738]">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                        <FileUp className="w-3.5 h-3.5 text-amber-400" />
                        Gerenciador de Upload do PDF Físico
                      </label>
                      <span className="text-[10px] text-gray-400 font-mono">
                        Bucket: ebooks (Privado)
                      </span>
                    </div>
                    
                    <EbookUploadControl 
                      productId={editingProduct.id || 'prod-depois-dos-60-real'}
                      productTitle={editingProduct.title || 'Depois dos 60: 50 cuidados que todo idoso e sua família precisam conhecer'}
                      currentStoragePath={editingProduct.storagePath}
                      currentUserRole={currentUser?.role}
                      onStoragePathUpdated={(newStoragePath, pageCount) => {
                        const updatedProduct = {
                          ...editingProduct,
                          storagePath: newStoragePath,
                          ebook: {
                            ...(editingProduct.ebook || {}),
                            pageCount: pageCount || editingProduct.ebook?.pageCount || 50
                          }
                        };
                        setEditingProduct(updatedProduct);
                        if (editingProduct.title && editingProduct.areaId && editingProduct.type) {
                          saveDigitalProduct(updatedProduct as any);
                        }
                        showToast('Caminho no Storage atualizado com sucesso!');
                      }}
                    />
                  </div>
                </div>
              )}

              {/* 3. APLICATIVO */}
              {editingProduct.type === 'aplicativo' && (
                <div className="p-4 bg-[#151922] rounded-xl border border-[#222738] space-y-4">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Configuração do Aplicativo / SaaS
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        URL de Acesso ao Web App / Plataforma
                      </label>
                      <input
                        type="url"
                        placeholder="https://app.minhaempresa.com"
                        value={editingProduct.app?.accessUrl || ''}
                        onChange={e => setEditingProduct(prev => ({
                          ...prev!,
                          app: { ...(prev!.app || {}), accessUrl: e.target.value }
                        }))}
                        className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Versão / Release
                      </label>
                      <input
                        type="text"
                        placeholder="v2.4.0 Pro"
                        value={editingProduct.app?.version || ''}
                        onChange={e => setEditingProduct(prev => ({
                          ...prev!,
                          app: { ...(prev!.app || {}), version: e.target.value }
                        }))}
                        className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. ARQUIVO / DOWNLOAD */}
              {editingProduct.type === 'arquivo' && (
                <div className="p-4 bg-[#151922] rounded-xl border border-[#222738] space-y-4">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Arquivo de Download
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Link de Download Direto
                      </label>
                      <input
                        type="url"
                        placeholder="https://storage.../pacote-assets.zip"
                        value={editingProduct.file?.downloadUrl || ''}
                        onChange={e => setEditingProduct(prev => ({
                          ...prev!,
                          file: { ...(prev!.file || {}), downloadUrl: e.target.value }
                        }))}
                        className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Tamanho do Arquivo
                      </label>
                      <input
                        type="text"
                        placeholder="245 MB"
                        value={editingProduct.file?.fileSize || ''}
                        onChange={e => setEditingProduct(prev => ({
                          ...prev!,
                          file: { ...(prev!.file || {}), fileSize: e.target.value }
                        }))}
                        className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. LINK EXTERNO */}
              {editingProduct.type === 'link' && (
                <div className="p-4 bg-[#151922] rounded-xl border border-[#222738] space-y-4">
                  <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Link / Comunidade Externa
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      URL de Destino
                    </label>
                    <input
                      type="url"
                      placeholder="https://discord.gg/... ou https://chat.whatsapp.com/..."
                      value={editingProduct.link?.targetUrl || ''}
                      onChange={e => setEditingProduct(prev => ({
                        ...prev!,
                        link: { ...(prev!.link || {}), targetUrl: e.target.value }
                      }))}
                      className="w-full bg-[#0D0F12] border border-[#222738] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#1D2230] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingProduct(null); }}
                  className="px-5 py-2.5 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-gray-300 text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold text-sm hover:opacity-95 shadow-lg shadow-[#D4AF37]/20 transition-all"
                >
                  Salvar Produto Digital
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
              Tem certeza que deseja excluir este produto digital do catálogo?
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
                Excluir Produto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT & VERIFICATION DIAGNOSTIC MODAL */}
      {verifyingProduct && (() => {
        const audit = getIntegrationAudit(verifyingProduct);
        if (!audit) return null;
        const isDepoisDos60 = verifyingProduct.id === 'prod-depois-dos-60-real';

        return (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#0D0F12] border border-[#D4AF37]/40 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1D2230]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      Auditoria de Integração Comercial & Webhook
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">
                      Produto: <span className="text-gray-200">{verifyingProduct.title}</span> ({verifyingProduct.id})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setVerifyingProduct(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Banner */}
              {isDepoisDos60 ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>PRODUTO: CONFIGURAÇÃO COMERCIAL PENDENTE</span>
                  </div>
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    Este é o produto real. Por determinação operacional, o ID de gateway externo e o checkout oficial ainda não foram fornecidos e não devem ser inventados. O sistema está 100% pronto para ativação imediata assim que forem fornecidos.
                  </p>
                </div>
              ) : (
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  audit.isReadyForSales ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {audit.isReadyForSales ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-amber-400" />}
                    <div>
                      <div className="text-sm font-bold">
                        {audit.isReadyForSales ? 'Pronto para Vendas e Liberação Automática' : 'Integração Comercial Pendente'}
                      </div>
                      <div className="text-xs text-gray-400">
                        Status Comercial: <span className="font-mono font-bold text-white">{audit.commercialStatus}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase border ${
                    getCommercialBadge(audit.commercialStatus, verifyingProduct.externalProductId).color
                  }`}>
                    {getCommercialBadge(audit.commercialStatus, verifyingProduct.externalProductId).label}
                  </span>
                </div>
              )}

              {/* Checklist Items */}
              <div className="space-y-3 text-xs">
                {/* 1. ID Externo */}
                <div className="p-3 bg-[#151922] rounded-xl border border-[#222738] flex items-start gap-3">
                  <div className="mt-0.5">
                    {audit.externalIdValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>1. ID Externo do Produto no Gateway</span>
                      <span className="font-mono text-gray-400">
                        {audit.externalIdValid ? `"${verifyingProduct.externalProductId}"` : 'Pendente'}
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">{audit.externalIdNote}</p>
                  </div>
                </div>

                {/* 2. Link de Checkout */}
                <div className="p-3 bg-[#151922] rounded-xl border border-[#222738] flex items-start gap-3">
                  <div className="mt-0.5">
                    {audit.checkoutValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>2. URL de Checkout do Gateway</span>
                      <span className="font-mono text-gray-400">
                        {audit.checkoutValid ? 'Válido' : 'Não configurado'}
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      {audit.checkoutValid 
                        ? audit.checkoutNote 
                        : 'Se um aluno sem acesso tentar comprar, o modal exibirá "Checkout em preparação" e o direcionará com segurança para a página de vendas real.'
                      }
                    </p>
                  </div>
                </div>

                {/* 3. Mapeamento Estrito em produtos_cursos */}
                <div className="p-3 bg-[#151922] rounded-xl border border-[#222738] flex items-start gap-3">
                  <div className="mt-0.5">
                    {audit.mappingValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : audit.mappingConflict ? (
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>3. Resolução Estrita em produtos_cursos</span>
                      <span className="font-mono text-gray-400">
                        {audit.mappingValid ? '1 Mapeamento Ativo' : audit.mappingConflict ? 'Conflito Detectado' : 'Sem Mapeamento'}
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">{audit.mappingNote}</p>
                    <div className="mt-1 p-2 bg-[#0D0F12] rounded-lg border border-[#222738] text-[11px] font-mono text-gray-300">
                      Regra do Sistema: produto_id EXTERNO &rarr; produtos_cursos.produto_id &rarr; digital_product_id &rarr; user_area_accesses.product_id
                    </div>
                  </div>
                </div>

                {/* 4. Entrega / Storage Privado */}
                <div className="p-3 bg-[#151922] rounded-xl border border-[#222738] flex items-start gap-3">
                  <div className="mt-0.5">
                    {audit.deliveryValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>4. Entregável e Proteção de Conteúdo</span>
                      <span className="font-mono text-gray-400">
                        {audit.deliveryValid ? 'Configurado' : 'Pendente'}
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed">{audit.deliveryNote}</p>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-[#1D2230] flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Sistema de liberação seguro contra injeção e acessos indevidos.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const prodToEdit = verifyingProduct;
                      setVerifyingProduct(null);
                      handleEdit(prodToEdit);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] font-bold text-xs transition-colors"
                  >
                    Editar Configurações
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerifyingProduct(null)}
                    className="px-4 py-2 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-gray-300 font-semibold text-xs transition-colors"
                  >
                    Fechar Auditoria
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
