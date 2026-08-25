import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Bookmark, 
  Share2, 
  Crown,
  FileText,
  Sparkles,
  Layers
} from 'lucide-react';
import { useStore } from '../services/store';
import { Course } from '../types';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
  onOpenLesson: (courseId: string, lessonId: string) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({
  courseId,
  onBack,
  onOpenLesson,
}) => {
  const { getCourse, getCourseProgress, isFavorite, toggleFavorite, markLessonCompleted, unmarkLessonCompleted } = useStore();
  const course = getCourse(courseId);

  // Expanded module tracking state
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [course?.modules[0]?.id || '']: true
  });

  if (!course) {
    return (
      <div className="p-8 text-center text-white space-y-4">
        <p>Curso não encontrado.</p>
        <button onClick={onBack} className="px-4 py-2 bg-[#151922] text-[#D4AF37] rounded-xl border border-[#1D2230]">
          Voltar para Catálogo
        </button>
      </div>
    );
  }

  const prog = getCourseProgress(course.id);
  const isFav = isFavorite(course.id);

  let totalLessons = 0;
  course.modules.forEach(m => totalLessons += m.lessons.length);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    course.modules.forEach(m => all[m.id] = true);
    setExpandedModules(all);
  };

  const collapseAll = () => {
    setExpandedModules({});
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151922] border border-[#1D2230] text-xs font-semibold text-[#A7AFBF] hover:text-white hover:border-[#D4AF37]/40 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Cursos</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(course.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#151922] border text-xs font-semibold transition ${
              isFav ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-[#1D2230] text-[#A7AFBF] hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{isFav ? 'Favoritado' : 'Favoritar'}</span>
          </button>
        </div>
      </div>

      {/* Cinematic Hero Header */}
      <div className="relative rounded-3xl bg-[#151922] border border-[#1D2230] overflow-hidden shadow-2xl">
        <div className="relative h-72 lg:h-96 w-full overflow-hidden">
          <img 
            src={course.bannerUrl || course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-full object-cover object-center" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151922] via-[#151922]/70 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#151922] via-[#151922]/80 to-transparent" />
        </div>

        {/* Content on Hero */}
        <div className="p-6 lg:p-10 -mt-40 lg:-mt-52 relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-md bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-wider font-mono">
              {course.category}
            </span>
            <span className="px-3 py-1 rounded-md bg-black/60 backdrop-blur-md border border-[#1D2230] text-[10px] font-bold text-white uppercase tracking-wider">
              {course.level}
            </span>
            <span className="px-3 py-1 rounded-md bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 text-[10px] font-bold text-[#F5D76E] uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-3 h-3 text-[#D4AF37]" />
              ÁREA VIP
            </span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-xs lg:text-sm text-[#A7AFBF] leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Instructor & Meta Stats */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#1D2230]/80">
            <div className="flex items-center gap-3">
              <img 
                src={course.instructor.avatar} 
                alt={course.instructor.name}
                className="w-10 h-10 rounded-xl object-cover border border-[#D4AF37]/40" 
              />
              <div>
                <p className="text-xs font-bold text-white">{course.instructor.name}</p>
                <p className="text-[10px] text-[#A7AFBF]">{course.instructor.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-[#A7AFBF] font-mono">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                {course.modules.length} Módulos
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                {totalLessons} Videoaulas
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                Certificado Incluso
              </span>
            </div>
          </div>

          {/* Progress and Big CTA */}
          <div className="p-4 rounded-2xl bg-[#0D0F12]/90 border border-[#1D2230] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1 max-w-md">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#A7AFBF]">SEU PROGRESSO</span>
                <span className="text-[#D4AF37] font-bold">{prog.percentage}% Concluído</span>
              </div>
              <div className="h-2 rounded-full bg-[#151922] border border-[#1D2230] overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#AA820A] to-[#D4AF37] rounded-full"
                  style={{ width: `${prog.percentage}%` }}
                />
              </div>
            </div>

            <button
              id="btn-course-play-hero"
              onClick={() => {
                const targetLessonId = prog.lastLessonId || course.modules[0]?.lessons[0]?.id;
                if (targetLessonId) {
                  onOpenLesson(course.id, targetLessonId);
                }
              }}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:from-[#F5D76E] hover:to-[#D4AF37] text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{prog.percentage > 0 ? 'CONTINUAR ASSISTINDO' : 'INICIAR CURSO AGORA'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modules & Lessons Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#D4AF37]" />
              Conteúdo Programático & Módulos
            </h2>
            <p className="text-xs text-[#A7AFBF]">Todas as aulas gravadas em alta definição com materiais de apoio</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 rounded-lg bg-[#151922] border border-[#1D2230] text-[11px] font-semibold text-[#A7AFBF] hover:text-white transition"
            >
              Expandir todos
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-lg bg-[#151922] border border-[#1D2230] text-[11px] font-semibold text-[#A7AFBF] hover:text-white transition"
            >
              Recolher todos
            </button>
          </div>
        </div>

        {/* Modules Accordion List */}
        <div className="space-y-3">
          {course.modules.map((module, modIndex) => {
            const isExpanded = !!expandedModules[module.id];
            const completedInModule = module.lessons.filter(l => prog.completedLessonIds.includes(l.id)).length;
            const isModuleComplete = completedInModule === module.lessons.length && module.lessons.length > 0;

            return (
              <div 
                key={module.id}
                className="rounded-2xl bg-[#151922] border border-[#1D2230] overflow-hidden transition-all duration-200"
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-4 lg:p-5 flex items-center justify-between gap-4 text-left hover:bg-[#1D2230]/40 transition"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                      isModuleComplete 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#0D0F12] text-[#D4AF37] border border-[#1D2230]'
                    }`}>
                      {isModuleComplete ? <CheckCircle2 className="w-5 h-5" /> : `0${modIndex + 1}`}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider font-mono">
                          MÓDULO {modIndex + 1}
                        </span>
                        <span className="text-[10px] text-[#A7AFBF]">
                          • {completedInModule}/{module.lessons.length} Aulas Concluídas
                        </span>
                      </div>
                      <h3 className="text-sm lg:text-base font-bold text-white truncate">
                        {module.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#A7AFBF] hidden sm:block">
                      {module.lessons.length} aulas
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#0D0F12] border border-[#1D2230] flex items-center justify-center text-[#A7AFBF]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {/* Lessons inside Module */}
                {isExpanded && (
                  <div className="divide-y divide-[#1D2230] border-t border-[#1D2230] bg-[#0D0F12]/60">
                    {module.lessons.map((lesson, lesIndex) => {
                      const isCompleted = prog.completedLessonIds.includes(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          className="p-3.5 lg:p-4 flex items-center justify-between gap-4 hover:bg-[#151922] transition group"
                        >
                          <div 
                            onClick={() => onOpenLesson(course.id, lesson.id)}
                            className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                          >
                            <div className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-[#1D2230]">
                              <img 
                                src={lesson.thumbnailUrl || course.thumbnailUrl} 
                                alt={lesson.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Play className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
                              </div>
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-[#D4AF37] font-semibold">
                                  AULA {lesIndex + 1}
                                </span>
                                {lesson.materials && lesson.materials.length > 0 && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex items-center gap-0.5">
                                    <FileText className="w-2.5 h-2.5" />
                                    {lesson.materials.length} materiais
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs lg:text-sm font-semibold text-white group-hover:text-[#F5D76E] transition truncate">
                                {lesson.title}
                              </h4>
                            </div>
                          </div>

                          {/* Right Controls: Duration & Status Toggle */}
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-[#A7AFBF] flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#A7AFBF]" />
                              {lesson.duration}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isCompleted) {
                                  unmarkLessonCompleted(course.id, lesson.id);
                                } else {
                                  markLessonCompleted(course.id, lesson.id);
                                }
                              }}
                              className={`p-2 rounded-xl transition ${
                                isCompleted 
                                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30' 
                                  : 'text-[#A7AFBF] hover:text-white bg-[#151922] border border-[#1D2230]'
                              }`}
                              title={isCompleted ? 'Marcar como não concluída' : 'Marcar como concluída'}
                            >
                              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
