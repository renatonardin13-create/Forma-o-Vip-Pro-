import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Award, 
  Play, 
  ArrowRight, 
  Sparkles, 
  Crown, 
  ChevronRight,
  TrendingUp,
  Bookmark,
  Layers,
  Flame,
  Lock
} from 'lucide-react';
import { useStore } from '../services/store';
import { Course, DigitalProduct } from '../types';
import { HeroCarousel } from './HeroCarousel';
import { ProductSalesModal } from './ProductSalesModal';
import { EbookReaderModal } from './EbookReaderModal';

interface StudentDashboardProps {
  onOpenCourse: (courseId: string) => void;
  onOpenLesson: (courseId: string, lessonId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenCourse,
  onOpenLesson,
  onNavigateTab,
}) => {
  const { 
    currentUser, 
    courses, 
    digitalProducts,
    hasProductAccess,
    certificates, 
    getCourseProgress, 
    isFavorite, 
    toggleFavorite 
  } = useStore();

  const [selectedProductForSale, setSelectedProductForSale] = React.useState<DigitalProduct | null>(null);
  const [activeEbook, setActiveEbook] = React.useState<DigitalProduct | null>(null);

  const handleLockedProductClick = (product: DigitalProduct) => {
    if (product.salesPageUrl) {
      window.open(product.salesPageUrl, '_blank', 'noopener,noreferrer');
    } else if (product.salesStrategy === 'presell' && product.presellUrl) {
      window.open(product.presellUrl, '_blank', 'noopener,noreferrer');
    } else if (product.checkoutUrl) {
      window.open(product.checkoutUrl, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedProductForSale(product);
    }
  };

  // Find most relevant in-progress course
  const inProgressCourses = courses.map(course => {
    const progress = getCourseProgress(course.id);
    return { course, progress };
  }).filter(item => item.progress.completedLessonIds.length > 0 || item.course.featured);

  const heroCourseItem = inProgressCourses[0] || {
    course: courses[0],
    progress: getCourseProgress(courses[0]?.id || '')
  };

  // Find recent lessons to watch
  const recentLessons: { course: Course; lesson: any; percent: number }[] = [];
  courses.forEach(course => {
    const progress = getCourseProgress(course.id);
    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        const isCompleted = progress.completedLessonIds.includes(l.id);
        if (recentLessons.length < 4) {
          recentLessons.push({
            course,
            lesson: l,
            percent: isCompleted ? 100 : (progress.lastLessonId === l.id ? 65 : 20)
          });
        }
      });
    });
  });

  // Calculate study time display
  const totalMinutes = currentUser?.stats.studyTimeMinutes || 2205;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedStudyTime = `${hours}h ${minutes}m`;

  return (
    <div id="student-dashboard" className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome & Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#151922] via-[#0D0F12] to-[#151922] border border-[#1D2230] p-6 lg:p-8 shadow-card-dark">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#A7AFBF] tracking-wider uppercase font-mono">BEM-VINDO DE VOLTA</span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[10px] font-extrabold text-[#F5D76E] shadow-sm">
                <Crown className="w-3 h-3 text-[#D4AF37]" />
                MEMBRO PREMIUM
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {currentUser?.name || 'Renato Nardin'}
            </h1>
            <p className="text-sm text-[#A7AFBF] leading-relaxed">
              Continue sua jornada e alcance o próximo nível de conhecimento e alta performance.
            </p>
          </div>

          {/* Quick Action in Banner */}
          <div className="flex items-center gap-3">
            <button
              id="btn-banner-continue"
              onClick={() => {
                if (heroCourseItem?.course) {
                  onOpenLesson(heroCourseItem.course.id, heroCourseItem.progress.lastLessonId || heroCourseItem.course.modules[0]?.lessons[0]?.id);
                }
              }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:from-[#F5D76E] hover:to-[#D4AF37] text-black font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-gold-glow transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>CONTINUAR ESTUDOS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Carousel Premium */}
      <HeroCarousel onOpenCourse={onOpenCourse} />

      {/* 2. Key Indicator Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Cursos Ativos */}
        <div className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A7AFBF] uppercase tracking-wider font-mono">CURSOS ATIVOS</span>
            <div className="w-10 h-10 rounded-xl bg-[#0D0F12] border border-[#1D2230] group-hover:border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] transition">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white tracking-tight">
              {courses.length}
            </span>
            <p className="text-[11px] text-[#A7AFBF] mt-1 flex items-center gap-1">
              <span className="text-[#D4AF37] font-bold">100%</span> liberados para acesso VIP
            </p>
          </div>
        </div>

        {/* Card 2: Aulas Concluídas */}
        <div className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A7AFBF] uppercase tracking-wider font-mono">AULAS CONCLUÍDAS</span>
            <div className="w-10 h-10 rounded-xl bg-[#0D0F12] border border-[#1D2230] group-hover:border-[#D4AF37]/30 flex items-center justify-center text-emerald-400 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white tracking-tight">
              {currentUser?.stats.completedLessons || 48}
            </span>
            <p className="text-[11px] text-[#A7AFBF] mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>+6 aulas finalizadas este mês</span>
            </p>
          </div>
        </div>

        {/* Card 3: Tempo de Estudo */}
        <div className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A7AFBF] uppercase tracking-wider font-mono">TEMPO DE ESTUDO</span>
            <div className="w-10 h-10 rounded-xl bg-[#0D0F12] border border-[#1D2230] group-hover:border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white tracking-tight">
              {formattedStudyTime}
            </span>
            <p className="text-[11px] text-[#A7AFBF] mt-1 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>Constância diária ativa</span>
            </p>
          </div>
        </div>

        {/* Card 4: Certificados */}
        <div className="p-5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A7AFBF] uppercase tracking-wider font-mono">CERTIFICADOS</span>
            <div className="w-10 h-10 rounded-xl bg-[#0D0F12] border border-[#1D2230] group-hover:border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] transition">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white tracking-tight">
              {certificates.length || 5}
            </span>
            <p className="text-[11px] text-[#A7AFBF] mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Diplomas com verificação</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Continue Aprendendo & Continue Assistindo Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Big Hero Card: "Continue Aprendendo" (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Continue Aprendendo
            </h2>
            <button 
              onClick={() => onNavigateTab('my-courses')}
              className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              Ver todos os cursos
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {heroCourseItem?.course && (
            <div className="relative rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/50 overflow-hidden shadow-card-dark transition-all duration-300">
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <img 
                  src={heroCourseItem.course.bannerUrl || heroCourseItem.course.thumbnailUrl} 
                  alt={heroCourseItem.course.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151922] via-[#151922]/60 to-transparent" />
                
                {/* Badges on Top */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/50 text-[10px] font-bold text-[#F5D76E] uppercase tracking-wider">
                    {heroCourseItem.course.category}
                  </span>
                  <button
                    onClick={() => toggleFavorite(heroCourseItem.course.id)}
                    className={`p-2 rounded-xl bg-black/60 backdrop-blur-md border transition ${
                      isFavorite(heroCourseItem.course.id)
                        ? 'border-[#D4AF37] text-[#D4AF37]'
                        : 'border-[#1D2230] text-white hover:text-[#D4AF37]'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 -mt-12 relative z-10">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider font-mono">
                    EM ANDAMENTO • MÓDULO 3 DE 8 • AULA 12 DE 45
                  </span>
                  <h3 className="text-xl font-bold text-white leading-snug">
                    {heroCourseItem.course.title}
                  </h3>
                  <p className="text-xs text-[#A7AFBF] line-clamp-2 leading-relaxed">
                    {heroCourseItem.course.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold font-mono">
                    <span className="text-[#A7AFBF]">PROGRESSO GERAL DO CURSO</span>
                    <span className="text-[#D4AF37]">
                      {heroCourseItem.progress.percentage > 0 ? `${heroCourseItem.progress.percentage}%` : '65%'}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#0D0F12] border border-[#1D2230] overflow-hidden p-0.5">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#AA820A] to-[#D4AF37] shadow-sm shadow-[#D4AF37]"
                      style={{ width: `${heroCourseItem.progress.percentage > 0 ? heroCourseItem.progress.percentage : 65}%` }}
                    />
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={heroCourseItem.course.instructor.avatar} 
                      alt={heroCourseItem.course.instructor.name}
                      className="w-8 h-8 rounded-full border border-[#D4AF37]/40 object-cover" 
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{heroCourseItem.course.instructor.name}</p>
                      <p className="text-[10px] text-[#A7AFBF]">{heroCourseItem.course.instructor.role}</p>
                    </div>
                  </div>

                  <button
                    id="btn-hero-continue"
                    onClick={() => {
                      onOpenLesson(
                        heroCourseItem.course.id, 
                        heroCourseItem.progress.lastLessonId || heroCourseItem.course.modules[0]?.lessons[0]?.id
                      );
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:from-[#F5D76E] hover:to-[#D4AF37] text-black font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-gold-glow transition-all hover:scale-[1.02]"
                  >
                    <span>CONTINUAR ASSISTINDO</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Column: "Continue Assistindo" (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Play className="w-4 h-4 text-[#D4AF37] fill-current" />
              Continue Assistindo
            </h2>
            <button 
              onClick={() => onNavigateTab('continue-watching')}
              className="text-xs font-semibold text-[#D4AF37] hover:underline"
            >
              Histórico
            </button>
          </div>

          <div className="space-y-3">
            {recentLessons.map(({ course, lesson, percent }, idx) => (
              <div
                key={`${lesson.id}-${idx}`}
                onClick={() => onOpenLesson(course.id, lesson.id)}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/40 hover:bg-[#1D2230] cursor-pointer transition-all duration-200 group"
              >
                <div className="relative w-28 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-[#1D2230]">
                  <img 
                    src={lesson.thumbnailUrl || course.thumbnailUrl} 
                    alt={lesson.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  {/* Mini bottom progress bar on thumbnail */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
                    <div 
                      className="h-full bg-[#D4AF37]" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider font-mono">
                    {course.title.split(' ')[0]} • AULA 0{idx + 1} • {percent}%
                  </span>
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-[#F5D76E] transition">
                    {lesson.title}
                  </h4>
                  <p className="text-[10px] text-[#A7AFBF] truncate">
                    Duração: {lesson.duration}
                  </p>

                  <div className="w-full bg-[#0D0F12] h-1.5 rounded-full overflow-hidden border border-[#1D2230] mt-1">
                    <div 
                      className="h-full bg-gradient-to-r from-[#AA820A] to-[#D4AF37] rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Meus Cursos & Catálogo Rápido */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#D4AF37]" />
              Formações & Cursos Exclusivos
            </h2>
            <p className="text-xs text-[#A7AFBF]">Acesso total a todas as esteiras e mentorias da área VIP</p>
          </div>

          <button
            onClick={() => onNavigateTab('all-courses')}
            className="px-4 py-2 rounded-xl bg-[#151922] hover:bg-[#1D2230] border border-[#1D2230] text-xs font-bold text-white hover:border-[#D4AF37]/40 transition flex items-center gap-1.5"
          >
            <span>Ver Catálogo Completo</span>
            <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>

        {/* 4-Card Product Grid (Vitrine) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {digitalProducts.filter(p => p.status === 'published').slice(0, 8).map((product) => {
            const hasAccess = currentUser ? hasProductAccess(currentUser.id, product.id) : false;
            const course = product.courseId ? courses.find(c => c.id === product.courseId) : null;
            const prog = course ? getCourseProgress(course.id) : { percentage: 0, completedLessonIds: [], totalLessons: 0 };
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
                    if (product.type === 'ebook') {
                      setActiveEbook(product);
                    } else if (product.courseId) {
                      onOpenCourse(product.courseId);
                    }
                  } else {
                    handleLockedProductClick(product);
                  }
                }}
                className={`group relative rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/60 overflow-hidden shadow-card-dark transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1 ${hasAccess ? 'hover:shadow-gold-glow' : 'hover:shadow-black/40'}`}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={product.thumbnailUrl || product.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'} 
                    alt={product.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${hasAccess ? 'group-hover:scale-105' : 'brightness-50 group-hover:scale-110'}`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151922] via-transparent to-black/40" />
                  
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

                  {/* Top Level & Favorite */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-[#1D2230] text-[9px] font-bold text-white uppercase tracking-wider">
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
                        className={`p-1.5 rounded-lg bg-black/60 backdrop-blur-md border transition ${
                          isFav ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-[#1D2230] text-[#A7AFBF] hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-auto px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-extrabold text-[10px] tracking-widest uppercase flex items-center gap-2 shadow-gold-glow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      {hasAccess ? (
                        <>
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                          <span>ACESSAR AGORA</span>
                        </>
                      ) : (
                        <span>VER OFERTA EXCLUSIVA</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                        {product.type === 'curso' ? (course?.category || 'Formação') : 'Recurso'}
                      </span>
                      {hasAccess && (
                        <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          ACESSO LIBERADO
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-[#F5D76E] transition">
                      {product.title}
                    </h4>
                    <p className="text-[11px] text-[#A7AFBF] line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1D2230] space-y-2">
                    {hasAccess && course ? (
                      <>
                        <div className="flex items-center justify-between text-[10px] text-[#A7AFBF] font-mono">
                          <span>{course.modules.length} Módulos • {totalLessons} Aulas</span>
                          <span className="text-[#D4AF37] font-bold">{prog.percentage}%</span>
                        </div>

                        <div className="w-full bg-[#0D0F12] h-1.5 rounded-full overflow-hidden border border-[#1D2230]">
                          <div 
                            className="h-full bg-gradient-to-r from-[#AA820A] to-[#D4AF37] rounded-full"
                            style={{ width: `${prog.percentage}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[10px] font-bold text-[#A7AFBF] uppercase tracking-tighter">CLIQUE PARA VER DETALHES</span>
                        <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sales Modal for Locked Products */}
      {selectedProductForSale && (
        <ProductSalesModal 
          product={selectedProductForSale}
          onClose={() => setSelectedProductForSale(null)}
        />
      )}

      {/* Ebook Reader Modal */}
      {activeEbook && (
        <EbookReaderModal
          product={activeEbook}
          onClose={() => setActiveEbook(null)}
        />
      )}
    </div>
  );
};
