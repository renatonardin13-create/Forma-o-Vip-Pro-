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
  Layers
} from 'lucide-react';
import { useStore } from '../services/store';

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
  const { courses, getCourseProgress, isFavorite, toggleFavorite } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'in_progress' | 'not_started' | 'completed'>('all');

  // Extract unique categories
  const categories = ['Todos', ...Array.from(new Set(courses.map(c => c.category)))];

  // Filter courses based on mode and filters
  const filteredCourses = courses.filter(course => {
    const prog = getCourseProgress(course.id);
    const isFav = isFavorite(course.id);

    // Mode constraints
    if (mode === 'favorites' && !isFav) return false;
    if (mode === 'continue-watching' && prog.completedLessonIds.length === 0 && !prog.lastLessonId) return false;
    if (mode === 'my-courses' && !course.isPublished) return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchDesc = course.description.toLowerCase().includes(q);
      const matchCat = course.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    // Category filter
    if (selectedCategory !== 'Todos' && course.category !== selectedCategory) {
      return false;
    }

    // Status filter
    if (selectedStatus === 'in_progress') {
      return prog.percentage > 0 && prog.percentage < 100;
    }
    if (selectedStatus === 'completed') {
      return prog.percentage === 100;
    }
    if (selectedStatus === 'not_started') {
      return prog.percentage === 0;
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
            {filteredCourses.length} {filteredCourses.length === 1 ? 'Curso disponível' : 'Cursos disponíveis'}
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

      {/* Courses Grid (16:9 / 3:2 cards) */}
      {filteredCourses.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#0D0F12] border border-[#1D2230] p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-[#A7AFBF]/40 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhum curso encontrado</h3>
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
          {filteredCourses.map((course) => {
            const prog = getCourseProgress(course.id);
            const isFav = isFavorite(course.id);
            let totalLessons = 0;
            course.modules.forEach(m => totalLessons += m.lessons.length);

            return (
              <div
                key={course.id}
                onClick={() => onOpenCourse(course.id)}
                className="group relative rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/60 overflow-hidden shadow-card-dark transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1.5 hover:shadow-gold-glow"
              >
                {/* 16:9 Aspect ratio cover */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151922] via-[#151922]/20 to-black/40" />

                  {/* Badges on Thumbnail */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-[#D4AF37]/30 text-[10px] font-extrabold text-[#F5D76E] uppercase tracking-wider">
                      {course.level}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(course.id);
                      }}
                      className={`p-2 rounded-xl bg-black/70 backdrop-blur-md border transition ${
                        isFav ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-[#1D2230] text-[#A7AFBF] hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Play Action Hover Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-gold-glow-lg transform scale-95 group-hover:scale-100 transition-transform">
                      <Play className="w-4 h-4 fill-current" />
                      <span>{prog.percentage > 0 ? 'CONTINUAR' : 'ACESSAR CURSO'}</span>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider font-mono">
                        {course.category}
                      </span>
                      {prog.percentage === 100 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          Concluído
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#F5D76E] transition line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-[#A7AFBF] line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Instructor & Progress */}
                  <div className="pt-3 border-t border-[#1D2230] space-y-3">
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

                    {/* Progress indicator */}
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
