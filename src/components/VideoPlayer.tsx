import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Download, 
  FileText, 
  MessageSquare, 
  Edit3, 
  Share2, 
  Clock, 
  Sparkles, 
  Search, 
  Play, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Lock,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { useStore } from '../services/store';
import { Course, Lesson, Material } from '../types';
import { CleanCustomPlayer } from './CleanCustomPlayer';
import { DisguisedYouTubePlayer } from './DisguisedYouTubePlayer';

interface VideoPlayerProps {
  courseId: string;
  lessonId: string;
  onBack: () => void;
  onSelectLesson: (courseId: string, lessonId: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  courseId,
  lessonId,
  onBack,
  onSelectLesson,
}) => {
  const { 
    getCourse, 
    getCourseProgress, 
    markLessonCompleted, 
    unmarkLessonCompleted, 
    recordLastAccessedLesson,
    saveLessonNote,
    getLessonNote,
    isFavorite,
    toggleFavorite,
    currentUser,
    hasProductAccess,
    accessesLoaded,
    digitalProducts,
    matriculas
  } = useStore();

  const course = getCourse(courseId);
  
  // Authorization check (Defense in Depth)
  // 1. Identify associated product if exists
  const associatedProduct = digitalProducts.find(p => p.courseId === courseId);
  
  // 2. Determine access
  const canAccess = currentUser ? (
    currentUser.role === 'admin' || 
    (associatedProduct ? hasProductAccess(currentUser.id, associatedProduct.id) : false) ||
    matriculas.some(m => m.user_id === currentUser.id && m.curso_id === courseId && m.status === 'ativo')
  ) : false;

  const [activeTab, setActiveTab] = useState<'desc' | 'materials' | 'notes' | 'comments'>('desc');
  const [playlistSearch, setPlaylistSearch] = useState('');
  const [studentNote, setStudentNote] = useState('');
  const [noteSavedToast, setNoteSavedToast] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Flatten all lessons
  const allLessons: { moduleTitle: string; moduleId: string; lesson: Lesson; index: number }[] = [];
  if (course) {
    let counter = 1;
    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        allLessons.push({
          moduleTitle: m.title,
          moduleId: m.id,
          lesson: l,
          index: counter++
        });
      });
    });
  }

  // Find current lesson
  const currentItem = allLessons.find(item => item.lesson.id === lessonId) || allLessons[0];
  const currentLesson = currentItem?.lesson;
  const currentModuleTitle = currentItem?.moduleTitle;
  const currentIndex = allLessons.findIndex(item => item.lesson.id === lessonId);

  const prevItem = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextItem = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Record history and load student note
  useEffect(() => {
    if (course && currentLesson) {
      recordLastAccessedLesson(course.id, currentLesson.id);
      const note = getLessonNote(course.id, currentLesson.id);
      setStudentNote(note);

      // Auto-expand module containing current lesson
      setExpandedModules(prev => ({
        ...prev,
        [currentLesson.moduleId]: true
      }));
    }
  }, [courseId, lessonId]);

  if (!accessesLoaded) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
        <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin mb-4" />
        <p className="text-gray-400 font-medium">Validando suas credenciais de acesso...</p>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-8 animate-in fade-in">
        <div className="max-w-xl w-full bg-[#0D0F12] border border-[#1D2230] rounded-3xl p-8 sm:p-12 text-center space-y-8 shadow-2xl">
          <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
            <Lock className="w-12 h-12 text-rose-500" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white tracking-tight">Conteúdo Restrito</h2>
            <p className="text-base text-[#8E9BB0] leading-relaxed">
              Você não possui uma matrícula ativa ou autorização para visualizar as aulas deste curso. 
              O acesso é exclusivo para membros com licença válida.
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button
              onClick={onBack}
              className="w-full py-4 px-8 rounded-2xl bg-[#D4AF37] text-black font-extrabold hover:bg-[#F5D76E] transition shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              VOLTAR PARA O CATÁLOGO
            </button>
            
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#586376] uppercase tracking-[0.2em] font-black">
              <ShieldAlert className="w-4 h-4" />
              PROTEÇÃO DE PROPRIEDADE VIP
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="p-8 text-center text-white space-y-4">
        <p>Aula não encontrada.</p>
        <button onClick={onBack} className="px-4 py-2 bg-[#151922] text-[#D4AF37] rounded-xl border border-[#1D2230]">
          Voltar para o Curso
        </button>
      </div>
    );
  }

  const prog = getCourseProgress(course.id);
  const isCompleted = prog.completedLessonIds.includes(currentLesson.id);

  const handleSaveNote = () => {
    saveLessonNote(course.id, currentLesson.id, studentNote);
    setNoteSavedToast(true);
    setTimeout(() => setNoteSavedToast(false), 2500);
  };

  const handleDownloadMaterial = (mat: Material) => {
    // Generate sample downloadable blob
    const content = `FORMAÇÃO VIP PRO\nMaterial Exclusivo: ${mat.title}\nCurso: ${course.title}\nAula: ${currentLesson.title}\n\nEste material é protegido por direitos autorais para uso exclusivo de membros VIP.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = mat.title.endsWith('.txt') ? mat.title : `${mat.title}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to extract YouTube embed URL
  const getEmbedUrl = (url: string, type: string) => {
    if (type === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = 'dQw4w9WgXcQ';
      if (url.includes('v=')) {
        videoId = url.split('v=')[1]?.split('&')[0] || videoId;
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || videoId;
      }
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (type === 'vimeo' || url.includes('vimeo.com')) {
      const vimeoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
    }
    return url;
  };

  const toggleModuleAccordion = (modId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* 1. Breadcrumbs & Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2230] pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#A7AFBF] flex-wrap">
          <button onClick={onBack} className="hover:text-white transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Início
          </button>
          <span>&gt;</span>
          <button onClick={onBack} className="hover:text-white transition truncate max-w-[200px]">
            {course.title}
          </button>
          <span>&gt;</span>
          <span className="text-[#D4AF37] font-bold truncate max-w-[250px]">
            {currentLesson.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleFavorite(course.id)}
            className={`p-2 rounded-xl bg-[#151922] border text-xs transition ${
              isFavorite(course.id) ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-[#1D2230] text-[#A7AFBF] hover:text-white'
            }`}
            title="Favoritar Curso"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main 2-Column Grid: Left Video Player (8 Cols), Right Playlist (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player + Controls + Tabs */}
        <div className="lg:col-span-8 space-y-5">
          {/* Responsive Video Container - Disguised YouTube VIP Player & Clean MP4 */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-[#1D2230] shadow-2xl aspect-video flex items-center justify-center">
            {currentLesson.videoType === 'youtube' || currentLesson.youtube_video_id || currentLesson.videoUrl.includes('youtube.com') || currentLesson.videoUrl.includes('youtu.be') ? (
              <DisguisedYouTubePlayer
                key={currentLesson.id}
                youtube_video_id={currentLesson.youtube_video_id}
                videoUrl={currentLesson.videoUrl}
                lessonId={currentLesson.id}
                courseId={course.id}
                title={currentLesson.title}
                posterUrl={currentLesson.thumbnailUrl}
                onEnded={() => {
                  markLessonCompleted(course.id, currentLesson.id);
                  if (nextItem) {
                    onSelectLesson(course.id, nextItem.lesson.id);
                  }
                }}
                onCompleted={() => {
                  markLessonCompleted(course.id, currentLesson.id);
                }}
              />
            ) : currentLesson.videoType === 'mp4' || (!currentLesson.videoUrl.includes('vimeo.com') && currentLesson.videoUrl.endsWith('.mp4')) ? (
              <CleanCustomPlayer
                key={currentLesson.id}
                videoUrl={currentLesson.videoUrl}
                posterUrl={currentLesson.thumbnailUrl}
                title={currentLesson.title}
                onEnded={() => {
                  markLessonCompleted(course.id, currentLesson.id);
                  if (nextItem) {
                    onSelectLesson(course.id, nextItem.lesson.id);
                  }
                }}
              />
            ) : (
              <iframe
                key={currentLesson.id}
                src={getEmbedUrl(currentLesson.videoUrl, currentLesson.videoType)}
                title={currentLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            )}
          </div>

          {/* Player Action Buttons & Completion Toggle */}
          <div className="p-4 lg:p-5 rounded-2xl bg-[#151922] border border-[#1D2230] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider font-mono">
                    {currentModuleTitle} • AULA 0{currentIndex + 1}
                  </span>
                  <span className="text-[10px] text-[#A7AFBF] flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    {currentLesson.duration}
                  </span>
                </div>
                <h1 className="text-lg lg:text-xl font-bold text-white leading-snug">
                  {currentLesson.title}
                </h1>
              </div>

              {/* Mark Completed Primary Action */}
              <button
                id="btn-mark-completed"
                onClick={() => {
                  if (isCompleted) {
                    unmarkLessonCompleted(course.id, currentLesson.id);
                  } else {
                    markLessonCompleted(course.id, currentLesson.id);
                  }
                }}
                className={`px-5 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30'
                    : 'bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:from-[#F5D76E] hover:to-[#D4AF37] text-black shadow-gold-glow hover:scale-[1.02]'
                }`}
              >
                {isCompleted ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    <span>AULA CONCLUÍDA</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 fill-black/20" />
                    <span>MARCAR COMO CONCLUÍDA</span>
                  </>
                )}
              </button>
            </div>

            {/* Navigation Bottom Controls: Previous Lesson / Next Lesson */}
            <div className="flex items-center justify-between pt-3 border-t border-[#1D2230]">
              <button
                id="btn-prev-lesson"
                disabled={!prevItem}
                onClick={() => prevItem && onSelectLesson(course.id, prevItem.lesson.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  prevItem 
                    ? 'bg-[#0D0F12] text-white hover:bg-[#1D2230] border border-[#1D2230]' 
                    : 'bg-[#0D0F12]/40 text-[#A7AFBF]/40 border border-transparent cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>AULA ANTERIOR</span>
              </button>

              <span className="text-[11px] text-[#A7AFBF] font-mono hidden sm:block">
                Aula {currentIndex + 1} de {allLessons.length}
              </span>

              <button
                id="btn-next-lesson"
                disabled={!nextItem}
                onClick={() => nextItem && onSelectLesson(course.id, nextItem.lesson.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  nextItem 
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37]/25 border border-[#D4AF37]/30' 
                    : 'bg-[#0D0F12]/40 text-[#A7AFBF]/40 border border-transparent cursor-not-allowed'
                }`}
              >
                <span>PRÓXIMA AULA</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs: Description, Materials, Notes, Community Comments */}
          <div className="rounded-2xl bg-[#151922] border border-[#1D2230] overflow-hidden">
            <div className="flex items-center border-b border-[#1D2230] bg-[#0D0F12]/70 px-4 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('desc')}
                className={`py-3.5 px-4 text-xs font-bold tracking-wider uppercase border-b-2 transition whitespace-nowrap ${
                  activeTab === 'desc'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-[#A7AFBF] hover:text-white'
                }`}
              >
                Descrição da Aula
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className={`py-3.5 px-4 text-xs font-bold tracking-wider uppercase border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'materials'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-[#A7AFBF] hover:text-white'
                }`}
              >
                <span>Materiais de Apoio</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#D4AF37]/20 text-[10px] text-[#D4AF37]">
                  {currentLesson.materials.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`py-3.5 px-4 text-xs font-bold tracking-wider uppercase border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'notes'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-[#A7AFBF] hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Minhas Anotações</span>
              </button>
            </div>

            <div className="p-6">
              {/* Tab 1: Description */}
              {activeTab === 'desc' && (
                <div className="space-y-4">
                  <div className="text-xs lg:text-sm text-[#A7AFBF] leading-relaxed space-y-3">
                    <p>{currentLesson.description}</p>
                    <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#1D2230] space-y-2 mt-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Pontos-Chave Desta Aula
                      </h4>
                      <ul className="list-disc list-inside text-xs text-[#A7AFBF] space-y-1">
                        <li>Fundamentos conceituais aplicáveis no dia a dia da operação.</li>
                        <li>Checklist prático de validação e otimização de métricas.</li>
                        <li>Material de apoio complementar disponível na aba acima.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Materials */}
              {activeTab === 'materials' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    MATERIAIS DA AULA ({currentLesson.materials.length})
                  </h3>

                  {currentLesson.materials.length === 0 ? (
                    <div className="py-8 text-center text-[#A7AFBF] text-xs">
                      Esta aula não possui materiais para download adicionais.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentLesson.materials.map((mat) => (
                        <div
                          key={mat.id}
                          className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] hover:border-[#D4AF37]/40 flex items-center justify-between gap-3 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-[#151922] border border-[#1D2230] flex items-center justify-center text-[#D4AF37] font-bold text-[10px] font-mono flex-shrink-0">
                              {mat.type}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{mat.title}</p>
                              <p className="text-[10px] text-[#A7AFBF]">{mat.size || 'Arquivo'} • {mat.description || 'Download VIP'}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDownloadMaterial(mat)}
                            className="px-3 py-2 rounded-lg bg-[#151922] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#1D2230] hover:border-transparent text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>BAIXAR</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Student Notes */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        BLOCO DE ANOTAÇÕES PESSOAL
                      </h3>
                      <p className="text-[11px] text-[#A7AFBF]">
                        Suas anotações são privadas e salvas automaticamente para este módulo.
                      </p>
                    </div>

                    {noteSavedToast && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Salvo com sucesso!
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={6}
                    value={studentNote}
                    onChange={(e) => setStudentNote(e.target.value)}
                    placeholder="Digite aqui seus insights, planos de ação e aprendizados desta aula..."
                    className="w-full p-4 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white placeholder-[#A7AFBF]/50 focus:outline-none focus:border-[#D4AF37] transition leading-relaxed"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNote}
                      className="px-5 py-2 rounded-xl bg-[#D4AF37] text-black font-bold text-xs hover:bg-[#F5D76E] transition shadow-sm shadow-[#D4AF37]/20"
                    >
                      Salvar Anotação
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Course Playlist Accordion (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-[#151922] border border-[#1D2230] overflow-hidden flex flex-col max-h-[880px]">
            {/* Playlist Header */}
            <div className="p-4 border-b border-[#1D2230] bg-[#0D0F12] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Conteúdo do Curso
                </h3>
                <span className="text-[10px] text-[#D4AF37] font-bold font-mono">
                  {prog.completedLessonIds.length}/{allLessons.length} Aulas
                </span>
              </div>

              {/* Course Mini Progress */}
              <div className="space-y-1">
                <div className="w-full bg-[#151922] h-1.5 rounded-full overflow-hidden border border-[#1D2230]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#AA820A] to-[#D4AF37] rounded-full"
                    style={{ width: `${prog.percentage}%` }}
                  />
                </div>
              </div>

              {/* Playlist Filter Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A7AFBF]" />
                <input 
                  type="text"
                  value={playlistSearch}
                  onChange={(e) => setPlaylistSearch(e.target.value)}
                  placeholder="Buscar aula no curso..."
                  className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#151922] border border-[#1D2230] text-[11px] text-white placeholder-[#A7AFBF]/50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Modules and Lessons Scrollable List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#1D2230] custom-scrollbar">
              {course.modules.map((mod, modIdx) => {
                const isModExpanded = expandedModules[mod.id] ?? true;
                const completedInThisMod = mod.lessons.filter(l => prog.completedLessonIds.includes(l.id)).length;
                const filteredLessons = mod.lessons.filter(l => 
                  !playlistSearch.trim() || l.title.toLowerCase().includes(playlistSearch.toLowerCase())
                );

                if (playlistSearch.trim() && filteredLessons.length === 0) {
                  return null;
                }

                return (
                  <div key={mod.id} className="bg-[#151922]">
                    {/* Module Title Bar */}
                    <button
                      onClick={() => toggleModuleAccordion(mod.id)}
                      className="w-full p-3 px-4 flex items-center justify-between text-left bg-[#0D0F12]/60 hover:bg-[#0D0F12] transition"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[9px] font-bold text-[#D4AF37] uppercase font-mono block">
                          MÓDULO {modIdx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">
                          {mod.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-[#A7AFBF] font-mono">
                          {completedInThisMod}/{mod.lessons.length}
                        </span>
                        {isModExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#A7AFBF]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#A7AFBF]" />}
                      </div>
                    </button>

                    {/* Lessons list */}
                    {isModExpanded && (
                      <div className="divide-y divide-[#1D2230]/40">
                        {filteredLessons.map((les) => {
                          const isCurrent = les.id === currentLesson.id;
                          const isLesCompleted = prog.completedLessonIds.includes(les.id);

                          return (
                            <div
                              key={les.id}
                              onClick={() => onSelectLesson(course.id, les.id)}
                              className={`p-3 px-4 flex items-center justify-between gap-3 cursor-pointer transition ${
                                isCurrent 
                                  ? 'bg-[#1D2230] border-l-2 border-[#D4AF37]' 
                                  : 'hover:bg-[#1D2230]/40'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                                  isCurrent 
                                    ? 'bg-[#D4AF37] text-black' 
                                    : 'bg-[#0D0F12] text-[#A7AFBF]'
                                }`}>
                                  {isCurrent ? (
                                    <Play className="w-3 h-3 fill-current ml-0.5" />
                                  ) : (
                                    <span className="text-[10px] font-mono font-bold">
                                      {les.order}
                                    </span>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className={`text-xs truncate ${isCurrent ? 'text-[#F5D76E] font-bold' : 'text-[#A7AFBF]'}`}>
                                    {les.title}
                                  </p>
                                  <span className="text-[10px] text-[#A7AFBF]/70 font-mono">
                                    {les.duration}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isLesCompleted) {
                                    unmarkLessonCompleted(course.id, les.id);
                                  } else {
                                    markLessonCompleted(course.id, les.id);
                                  }
                                }}
                                className="text-[#A7AFBF] hover:text-white"
                              >
                                {isLesCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Circle className="w-4 h-4 text-[#A7AFBF]/40" />
                                )}
                              </button>
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
      </div>
    </div>
  );
};
