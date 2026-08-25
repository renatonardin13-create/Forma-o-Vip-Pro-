import React from 'react';
import { Milestone, Crown, ArrowRight, BookOpen, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useStore } from '../services/store';

interface LearningTracksViewProps {
  onOpenCourse: (courseId: string) => void;
}

export const LearningTracksView: React.FC<LearningTracksViewProps> = ({ onOpenCourse }) => {
  const { learningTracks, courses, getCourseProgress } = useStore();

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#1D2230] pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest font-mono">FORMAÇÃO VIP PRO</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Trilhas Estratégicas de Aprendizado
        </h1>
        <p className="text-xs lg:text-sm text-[#A7AFBF]">
          Jornadas estruturadas passo a passo para acelerar resultados práticos e consolidar competências de alta performance.
        </p>
      </div>

      {/* Tracks List */}
      <div className="space-y-6">
        {learningTracks.map((track, trackIdx) => {
          const trackCourses = track.courseIds
            .map(id => courses.find(c => c.id === id))
            .filter(Boolean);

          let totalTrackLessons = 0;
          let completedTrackLessons = 0;

          trackCourses.forEach(c => {
            if (c) {
              const prog = getCourseProgress(c.id);
              c.modules.forEach(m => totalTrackLessons += m.lessons.length);
              completedTrackLessons += prog.completedLessonIds.length;
            }
          });

          const trackPercentage = totalTrackLessons > 0 
            ? Math.round((completedTrackLessons / totalTrackLessons) * 100) 
            : 0;

          return (
            <div
              key={track.id}
              className="rounded-3xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/50 overflow-hidden shadow-card-dark p-6 lg:p-8 space-y-6 transition duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1D2230] pb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0D0F12] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold text-lg font-mono flex-shrink-0">
                    0{trackIdx + 1}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider font-mono">
                        TRILHA OFICIAL VIP
                      </span>
                      <span className="text-[10px] text-[#A7AFBF]">
                        • {trackCourses.length} Formações integradas
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">{track.title}</h2>
                    <p className="text-xs text-[#A7AFBF]">{track.description}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="min-w-[200px] space-y-1.5 bg-[#0D0F12] p-3 rounded-xl border border-[#1D2230]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#A7AFBF]">PROGRESSO DA TRILHA</span>
                    <span className="text-[#D4AF37] font-bold">{trackPercentage}%</span>
                  </div>
                  <div className="w-full bg-[#151922] h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#AA820A] to-[#D4AF37] rounded-full"
                      style={{ width: `${trackPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Courses in this track */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trackCourses.map((c, idx) => {
                  if (!c) return null;
                  const prog = getCourseProgress(c.id);

                  return (
                    <div
                      key={c.id}
                      onClick={() => onOpenCourse(c.id)}
                      className="p-4 rounded-2xl bg-[#0D0F12] border border-[#1D2230] hover:border-[#D4AF37]/40 cursor-pointer transition flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[#D4AF37] font-bold">ETAPA 0{idx + 1}</span>
                          <span className="text-[#A7AFBF]">{prog.percentage}%</span>
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#F5D76E] transition line-clamp-1">
                          {c.title}
                        </h4>
                        <p className="text-[11px] text-[#A7AFBF] line-clamp-2">
                          {c.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#1D2230] text-[10px] text-[#A7AFBF]">
                        <span>{c.modules.length} Módulos</span>
                        <span className="text-[#D4AF37] font-semibold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                          Acessar <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
