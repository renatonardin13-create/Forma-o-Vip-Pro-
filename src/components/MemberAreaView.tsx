import React, { useState } from 'react';
import { 
  Crown, 
  BookOpen, 
  Smartphone, 
  Wrench, 
  FileText, 
  PlaySquare, 
  ExternalLink, 
  Download, 
  Search, 
  Filter, 
  Star, 
  Layers, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  Compass
} from 'lucide-react';
import { useStore } from '../services/store';
import { MemberArea, DigitalProduct, DigitalProductType } from '../types';
import { EbookReaderModal } from './EbookReaderModal';
import { AppDetailsModal } from './AppDetailsModal';
import { HeroCarousel } from './HeroCarousel';

interface MemberAreaViewProps {
  area: MemberArea;
  onSelectCourse: (courseId: string) => void;
  onSwitchArea: (slug: string) => void;
  onGoToAdmin: () => void;
  onGoToGeneralStudentArea: () => void;
  onLogout: () => void;
}

export const MemberAreaView: React.FC<MemberAreaViewProps> = ({
  area,
  onSelectCourse,
  onSwitchArea,
  onGoToAdmin,
  onGoToGeneralStudentArea,
  onLogout
}) => {
  const { 
    currentUser, 
    digitalProducts, 
    memberAreas, 
    courses 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeEbook, setActiveEbook] = useState<DigitalProduct | null>(null);
  const [activeApp, setActiveApp] = useState<DigitalProduct | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryColor = area.primaryColor || '#D4AF37';

  // Products belonging to this area
  const areaProducts = digitalProducts.filter(p => p.areaId === area.id && p.status === 'published');

  // Categories in this area
  const categories = Array.from(new Set(areaProducts.map(p => p.category))).filter(Boolean);

  // Filtered list
  const filteredProducts = areaProducts.filter(prod => {
    const matchesSearch = 
      prod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || prod.type === selectedType;
    const matchesCat = selectedCategory === 'all' || prod.category === selectedCategory;
    return matchesSearch && matchesType && matchesCat;
  });

  const handleProductAction = (product: DigitalProduct) => {
    if (product.type === 'curso') {
      if (product.courseId) {
        onSelectCourse(product.courseId);
      } else if (courses[0]) {
        onSelectCourse(courses[0].id);
      }
    } else if (product.type === 'ebook') {
      setActiveEbook(product);
    } else if (product.type === 'aplicativo') {
      setActiveApp(product);
    } else if (product.type === 'arquivo' && product.file?.downloadUrl) {
      window.open(product.file.downloadUrl, '_blank');
    } else if (product.type === 'link' && product.link?.targetUrl) {
      window.open(product.link.targetUrl, '_blank');
    } else {
      setActiveApp(product);
    }
  };

  const getTypeBadge = (type: DigitalProductType) => {
    switch (type) {
      case 'curso': 
        return { label: 'Curso & Videoaulas', icon: PlaySquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
      case 'ebook': 
        return { label: 'E-book Interativo', icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
      case 'aplicativo': 
        return { label: 'Software / App', icon: Smartphone, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' };
      case 'ferramenta': 
        return { label: 'Ferramenta VIP', icon: Wrench, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' };
      case 'arquivo': 
        return { label: 'Download Direto', icon: Download, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' };
      case 'link': 
        return { label: 'Link Exclusivo', icon: ExternalLink, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' };
      default: 
        return { label: 'Conteúdo Digital', icon: Sparkles, color: 'text-gray-400', bg: 'bg-gray-800' };
    }
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-white flex flex-col selection:bg-[#D4AF37] selection:text-black">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#0D0F12]/95 backdrop-blur-xl border-b border-[#1D2230]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Area Info */}
          <div className="flex items-center gap-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg"
              style={{
                backgroundColor: `${primaryColor}15`,
                borderColor: `${primaryColor}40`,
                color: primaryColor
              }}
            >
              {area.logoUrl ? (
                <img src={area.logoUrl} alt={area.name} className="w-7 h-7 object-contain rounded-lg" />
              ) : (
                <Crown className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">{area.name}</span>
                <span 
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${primaryColor}20`,
                    color: primaryColor
                  }}
                >
                  ÁREA DE MEMBROS
                </span>
              </div>
              <div className="text-[11px] text-gray-400 font-mono">
                /{area.slug}
              </div>
            </div>
          </div>

          {/* Center: Ecosystem Area Switcher */}
          <div className="hidden lg:flex items-center gap-2 bg-[#151922] p-1.5 rounded-xl border border-[#222738]">
            <span className="text-xs font-semibold text-gray-400 px-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
              Ecossistema:
            </span>
            {memberAreas.filter(a => a.status === 'active').map(a => (
              <button
                key={a.id}
                onClick={() => onSwitchArea(a.slug)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  a.id === area.id
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-[#1D2230]'
                }`}
              >
                {a.name}
              </button>
            ))}
          </div>

          {/* Right User Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser?.role === 'admin' && (
              <button
                onClick={onGoToAdmin}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/30 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                Painel Admin
              </button>
            )}

            <button
              onClick={onGoToGeneralStudentArea}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-gray-300 hover:text-white text-xs font-semibold border border-[#222738] transition-colors"
            >
              <Compass className="w-4 h-4" />
              Área Geral do Aluno
            </button>

            {/* Profile Avatar / Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#1D2230]">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]/40"
              />
              <button
                onClick={onLogout}
                title="Sair"
                className="p-2 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-[#151922] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden p-4 bg-[#0D0F12] border-b border-[#1D2230] space-y-3 animate-in slide-in-from-top-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alternar Área de Membros:</div>
            <div className="flex flex-col gap-1.5">
              {memberAreas.filter(a => a.status === 'active').map(a => (
                <button
                  key={a.id}
                  onClick={() => { onSwitchArea(a.slug); setMobileMenuOpen(false); }}
                  className={`px-3 py-2 rounded-lg text-left text-xs font-bold ${
                    a.id === area.id ? 'bg-[#D4AF37] text-black' : 'bg-[#151922] text-gray-300'
                  }`}
                >
                  {a.name} (/{a.slug})
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1D2230] flex flex-col gap-2">
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => { onGoToAdmin(); setMobileMenuOpen(false); }}
                  className="py-2.5 px-3 rounded-lg bg-[#151922] text-[#D4AF37] text-xs font-bold text-center border border-[#D4AF37]/30"
                >
                  Painel Administrativo
                </button>
              )}
              <button
                onClick={() => { onGoToGeneralStudentArea(); setMobileMenuOpen(false); }}
                className="py-2.5 px-3 rounded-lg bg-[#151922] text-gray-300 text-xs font-bold text-center"
              >
                Área Geral do Aluno
              </button>
              <button
                onClick={onLogout}
                className="py-2.5 px-3 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-bold text-center"
              >
                Sair da Conta
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO BANNER DA ÁREA */}
      <section className="relative overflow-hidden bg-[#0D0F12] border-b border-[#1D2230]">
        {/* Background Image with Ambient Glow */}
        <div className="absolute inset-0 z-0">
          <img
            src={area.bannerUrl || area.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80'}
            alt={area.name}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#0D0F12]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#151922]/80 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              <span className="text-gray-300">Área de Membros Exclusiva</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {area.heroTitle || area.name}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
              {area.welcomeText || area.heroSubtitle || area.description || 'Explore seus materiais, masterclasses e ferramentas liberadas na sua assinatura.'}
            </p>

            {/* Metrics Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#151922]/90 border border-[#222738] text-gray-300 font-semibold flex items-center gap-2">
                <span className="font-bold text-white">{areaProducts.length}</span>
                <span>Produtos & Entregáveis</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-[#151922]/90 border border-[#222738] text-gray-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Acesso Liberado para {currentUser?.name || 'Você'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATALOG & FILTER SECTION */}
      <main id="conteudos" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Hero Carousel Premium for this area */}
        <HeroCarousel memberAreaId={area.id} onOpenCourse={onSelectCourse} />

        {/* Filters and Search Bar */}
        <div className="bg-[#0D0F12] border border-[#1D2230] rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por título ou tema..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#151922] border border-[#222738] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/60"
            />
          </div>

          {/* Type Tabs */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'Todos os Conteúdos' },
              { id: 'curso', label: 'Cursos' },
              { id: 'ebook', label: 'E-books' },
              { id: 'aplicativo', label: 'Aplicativos' },
              { id: 'ferramenta', label: 'Ferramentas' },
              { id: 'arquivo', label: 'Downloads' },
              { id: 'link', label: 'Links' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedType === tab.id
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-[#151922] text-gray-400 hover:text-white border border-[#222738]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills if exists */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mr-1">Categorias:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                selectedCategory === 'all' ? 'bg-[#1D2230] text-[#D4AF37]' : 'text-gray-400 hover:text-white'
              }`}
            >
              Todas
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-[#1D2230] text-[#D4AF37]' : 'text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* 4. PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const badge = getTypeBadge(product.type);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className="bg-[#0D0F12] border border-[#1D2230] rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col group shadow-xl"
              >
                {/* Product Cover */}
                <div className="relative h-48 w-full bg-[#151922] overflow-hidden">
                  <img
                    src={product.coverUrl || 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F12] via-transparent to-black/60" />

                  {/* Type Badge Top Left */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-black/80 backdrop-blur-md border border-white/10 text-white">
                    <BadgeIcon className={`w-3.5 h-3.5 ${badge.color}`} />
                    <span>{badge.label}</span>
                  </div>

                  {/* Featured Badge Top Right */}
                  {product.featured && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#D4AF37] text-black shadow-md">
                      <Star className="w-3 h-3 fill-black" />
                      Destaque
                    </div>
                  )}

                  {/* Category Pill Bottom */}
                  <div className="absolute bottom-3 left-3 text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm">
                    {product.category}
                  </div>
                </div>

                {/* Product Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {product.shortDescription || product.fullDescription || 'Conteúdo exclusivo preparado para sua evolução.'}
                    </p>
                  </div>

                  {/* Metas / Specs */}
                  {product.type === 'ebook' && product.ebook && (
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-[#1D2230]">
                      <span>{product.ebook.pageCount || 48} páginas</span>
                      <span className="text-amber-400 font-semibold">{product.ebook.fileFormat?.toUpperCase() || 'PDF'}</span>
                    </div>
                  )}

                  {product.type === 'aplicativo' && product.app && (
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-[#1D2230]">
                      <span>Versão: {product.app.version || '1.0'}</span>
                      <span className="text-blue-400 font-semibold">{product.app.platform || 'Online'}</span>
                    </div>
                  )}

                  {/* Action CTA Button */}
                  <button
                    onClick={() => handleProductAction(product)}
                    className="w-full py-3 px-4 rounded-xl bg-[#151922] group-hover:bg-gradient-to-r group-hover:from-[#D4AF37] group-hover:to-[#F5D76E] text-white group-hover:text-black font-bold text-xs flex items-center justify-center gap-2 border border-[#222738] group-hover:border-[#D4AF37] transition-all shadow-md"
                  >
                    <span>
                      {product.type === 'curso' && 'ACESSAR CURSO'}
                      {product.type === 'ebook' && 'LER E-BOOK ONLINE'}
                      {product.type === 'aplicativo' && 'ABRIR APLICATIVO'}
                      {product.type === 'ferramenta' && 'UTILIZAR FERRAMENTA'}
                      {product.type === 'arquivo' && 'BAIXAR ARQUIVO'}
                      {product.type === 'link' && 'ACESSAR LINK'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-[#0D0F12] border border-[#1D2230] rounded-2xl p-16 text-center space-y-3">
            <Compass className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Nenhum conteúdo encontrado nesta área</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Tente redefinir os filtros de busca ou volte para a visualização de todos os conteúdos.
            </p>
          </div>
        )}
      </main>

      {/* 5. MODALS */}
      {activeEbook && (
        <EbookReaderModal
          product={activeEbook}
          onClose={() => setActiveEbook(null)}
        />
      )}

      {activeApp && (
        <AppDetailsModal
          product={activeApp}
          onClose={() => setActiveApp(null)}
        />
      )}
    </div>
  );
};
