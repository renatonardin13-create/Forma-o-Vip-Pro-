import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Bookmark, 
  Play, 
  CheckCircle2, 
  Clock, 
  Crown,
  ChevronRight,
  Sparkles,
  Layers,
  Lock
} from 'lucide-react';
import { useStore } from '../services/store';
import { DigitalProduct } from '../types';
import { ProductSalesModal } from './ProductSalesModal';

interface CourseCatalogProps {
  mode: 'my-courses' | 'all-courses' | 'favorites' | 'continue-watching';
  onOpenCourse: (courseId: string) => void;
  onOpenLesson: (courseId: string, lessonId: string) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  mode,
  onOpenCourse,
  onOpenLesson,
}) => {
  const { 
    currentUser, 
    courses, 
    digitalProducts, 
    hasProductAccess, 
    getCourseProgress, 
    isFavorite, 
    toggleFavorite 
  } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'in_progress' | 'not_started' | 'completed'>('all');
  const [selectedProductForSale, setSelectedProductForSale] = useState<DigitalProduct | null>(null);

  const handleLockedProductClick = (product: DigitalProduct) => {
    if (product.salesStrategy === 'sales_page' && product.salesPageUrl) {
      window.open(product.salesPageUrl, '_blank');
    } else if (product.salesStrategy === 'presell' && product.presellUrl) {
      window.open(product.presellUrl, '_blank');
    } else {
      setSelectedProductForSale(product);
    }
  };

  // Extract unique categories
  const categories = ['Todos', ...Array.from(new Set(digitalProducts.map(p => p.type === 'curso' ? (courses.find(c => c.id === p.courseId)?.category || 'Formação') : 'Recurso')))];

  // Filter products/courses based on mode and filters
  const filteredItems = (mode === 'all-courses' ? digitalProducts : digitalProducts.filter(p => currentUser && hasProductAccess(currentUser.id, p.id))).filter(product => {
    if (product.status !== 'published') return false;
    
    const course = product.courseId ? courses.find(c => c.id === product.courseId) : null;
    const prog = course ? getCourseProgress(course.id) : { percentage: 0, completedLessonIds: [], totalLessons: 0, lastLessonId: undefined };
    const isFav = course ? isFavorite(course.id) : false;
    const hasAccess = currentUser ? hasProductAccess(currentUser.id, product.id) : false;

    // Mode constraints
    if (mode === 'favorites' && !isFav) return false;
    if (mode === 'continue-watching' && prog.completedLessonIds.length === 0 && !prog.lastLessonId) return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchDesc = product.shortDescription.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    // Category filter
    const category = product.type === 'curso' ? (course?.category || 'Formação') : 'Recurso';
    if (selectedCategory !== 'Todos' && category !== selectedCategory) {
      return false;
    }

    // Status filter (only applies to owned products)
    if (hasAccess && course) {
      if (selectedStatus === 'in_progress') {
        return prog.percentage > 0 && prog.percentage < 100;
      }
      if (selectedStatus === 'completed') {
        return prog.percentage === 100;
      }
      if (selectedStatus === 'not_started') {
        return prog.percentage === 0;
      }
    } else if (selectedStatus !== 'all') {
      // Non-owned products are only shown if filter is 'all' or if we want to show them as 'not_started'
      if (selectedStatus !== 'not_started') return false;
    }

    return true;
  });

  const getPageTitle = () => {
    switch (mode) {
      case 'my-courses':
        return {
          title: 'Meus Cursos VIP',
          subtitle: 'Acompanhe seu avanço e continue de onde parou em cada formação'
        };
      case 'all-courses':
        return {
          title: 'Catálogo de Formações VIP Pro',
          subtitle: 'Acesso irrestrito a todos os cursos, mentorias e masterclasses'
        };
      case 'favorites':
        return {
          title: 'Meus Cursos Favoritos',
          subtitle: 'Sua lista personalizada de conteúdos marcados para consulta rápida'
        };
      case 'continue-watching':
        return {
          title: 'Continuar Assistindo',
          subtitle: 'Histórico de aulas recentes em andamento'
        };
    }
  };

  const pageInfo = getPageTitle();

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header with Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1D2230] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest font-mono">FORMAÇÃO VIP PRO</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {pageInfo.title}
          </h1>
          <p className="text-xs lg:text-sm text-[#A7AFBF] mt-1">
            {pageInfo.subtitle}
          </p>
        </div>

        {/* Total Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151922] border border-[#1D2230]">
          <BookOpen className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-bold text-white">
            {filteredItems.length} {filteredItems.length === 1 ? 'Item disponível' : 'Items disponíveis'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-[#0D0F12] p-4 lg:p-6 rounded-2xl border border-[#1D2230]">
        <div className="flex flex-col lg:flex-row items-center gap-3 justify-between">
          {/* Search */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7AFBF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por nome ou conteúdo..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white placeholder-[#A7AFBF]/60 focus:outline-none focus:border-[#D4AF37] transition"
            />
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                selectedStatus === 'all'
                  ? 'bg-[#D4AF37] text-black shadow-sm'
                  : 'bg-[#151922] text-[#A7AFBF] hover:text-white border border-[#1D2230]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedStatus('in_progress')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                selectedStatus === 'in_progress'
                  ? 'bg-[#D4AF37] text-black shadow-sm'
                  : 'bg-[#151922] text-[#A7AFBF] hover:text-white border border-[#1D2230]'
              }`}
            >
              Em andamento
            </button>
            <button
              onClick={() => setSelectedStatus('not_started')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                selectedStatus === 'not_started'
                  ? 'bg-[#D4AF37] text-black shadow-sm'
                  : 'bg-[#151922] text-[#A7AFBF] hover:text-white border border-[#1D2230]'
              }`}
            >
              Não iniciados
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                selectedStatus === 'completed'
                  ? 'bg-[#D4AF37] text-black shadow-sm'
                  : 'bg-[#151922] text-[#A7AFBF] hover:text-white border border-[#1D2230]'
              }`}
            >
              Concluídos
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 custom-scrollbar pb-1">
          <span className="text-[11px] font-bold text-[#A7AFBF] flex items-center gap-1 flex-shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
            Categorias:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#151922] text-[#F5D76E] border border-[#D4AF37]/50 shadow-sm'
                  : 'bg-[#151922]/50 text-[#A7AFBF] hover:text-white border border-[#1D2230]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses/Products Grid (16:9 / 3:2 cards) */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#0D0F12] border border-[#1D2230] p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-[#A7AFBF]/40 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhum item encontrado</h3>
          <p className="text-xs text-[#A7AFBF] max-w-sm mx-auto">
            Tente ajustar seus termos de pesquisa ou remover os filtros aplicados.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Todos');
              setSelectedStatus('all');
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-[#151922] border border-[#1D2230] text-xs font-bold text-[#D4AF37] hover:border-[#D4AF37]/40"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((product) => {
            const hasAccess = currentUser ? hasProductAccess(currentUser.id, product.id) : false;
            const course = product.courseId ? courses.find(c => c.id === product.courseId) : null;
            const prog = course ? getCourseProgress(course.id) : { percentage: 0 };
            const isFav = course ? isFavorite(course.id) : false;
            
            let totalLessons = 0;
            if (course) {
              course.modules.forEach(m => totalLessons += m.lessons.length);
            }

            return (
              <div
                key={product.id}
                onClick={() => {
                  if (hasAccess) {
                    if (product.courseId) onOpenCourse(product.courseId);
                  } else {
                    handleLockedProductClick(product);
                  }
                }}
                className={`group relative rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/60 overflow-hidden shadow-card-dark transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1.5 ${hasAccess ? 'hover:shadow-gold-glow' : 'hover:shadow-black/40'}`}
              >
                {/* 16:9 Aspect ratio cover */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={product.thumbnailUrl} 
                    alt={product.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${hasAccess ? 'group-hover:scale-105' : 'brightness-50 group-hover:scale-110'}`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151922] via-[#151922]/20 to-black/40" />

                  {/* Lock Overlay for non-purchased */}
                  {!hasAccess && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all group-hover:bg-black/60">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#F5C84C] mb-2 shadow-gold-glow-sm">
                        <Lock className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black text-[#F5C84C] uppercase tracking-[0.2em] drop-shadow-md">
                        CONTEÚDO PREMIUM
                      </span>
                    </div>
                  )}

                  {/* Badges on Thumbnail */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-[#D4AF37]/30 text-[10px] font-extrabold text-[#F5D76E] uppercase tracking-wider">
                        {product.type === 'curso' ? (course?.level || 'Premium') : 'Ebook'}
                      </span>
                      {!hasAccess && (
                        <span className="px-2 py-0.5 rounded-md bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-wider shadow-sm">
                          BLOQUEADO
                        </span>
                      )}
                    </div>
                    {hasAccess && product.courseId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.courseId!);
                        }}
                        className={`p-2 rounded-xl bg-black/70 backdrop-blur-md border transition ${
                          isFav ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-[#1D2230] text-[#A7AFBF] hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Play Action Hover Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-gold-glow-lg transform scale-95 group-hover:scale-100 transition-transform">
                      {hasAccess ? (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>{prog.percentage > 0 ? 'CONTINUAR' : 'ACESSAR AGORA'}</span>
                        </>
                      ) : (
                        <span>VER OFERTA EXCLUSIVA</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider font-mono">
                        {product.type === 'curso' ? (course?.category || 'Formação') : 'Recurso'}
                      </span>
                      {hasAccess && (
                        <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          ACESSO LIBERADO
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#F5D76E] transition line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-[#A7AFBF] line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Instructor & Progress */}
                  <div className="pt-3 border-t border-[#1D2230] space-y-3">
                    {hasAccess && course ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img 
                              src={course.instructor.avatar} 
                              alt={course.instructor.name}
                              className="w-7 h-7 rounded-full object-cover border border-[#1D2230]"
                            />
                            <span className="text-xs font-semibold text-white">{course.instructor.name}</span>
                          </div>
                          <span className="text-[11px] text-[#A7AFBF] font-mono">
                            {course.modules.length} Módulos • {totalLessons} Aulas
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-[#A7AFBF]">Progresso do aluno</span>
                            <span className="text-[#D4AF37] font-bold">{prog.percentage}%</span>
                          </div>
                          <div className="w-full bg-[#0D0F12] h-2 rounded-full overflow-hidden border border-[#1D2230]">
                            <div 
                              className="h-full bg-gradient-to-r from-[#AA820A] to-[#D4AF37] rounded-full transition-all duration-500"
                              style={{ width: `${prog.percentage}%` }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[10px] font-bold text-[#A7AFBF] uppercase tracking-tighter">CLIQUE PARA VER DETALHES</span>
                        <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sales Modal for Locked Products */}
      {selectedProductForSale && (
        <ProductSalesModal 
          product={selectedProductForSale}
          onClose={() => setSelectedProductForSale(null)}
        />
      )}
    </div>
  );
};
