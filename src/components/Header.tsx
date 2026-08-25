import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Bookmark, 
  Crown, 
  Menu, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert,
  Play,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../services/store';
import { Course } from '../types';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onOpenProfile: () => void;
  onSelectCourse: (courseId: string) => void;
  onSelectLesson?: (courseId: string, lessonId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  onOpenProfile,
  onSelectCourse,
  onSelectLesson,
  onNavigateTab
}) => {
  const { currentUser, courses, logout, switchDemoAccount } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results across courses and lessons
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { courses: [], lessons: [] };
    const q = searchQuery.toLowerCase();
    
    const matchedCourses = courses.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.instructor.name.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedLessons: { course: Course; lesson: any }[] = [];
    courses.forEach(c => {
      c.modules.forEach(m => {
        m.lessons.forEach(l => {
          if (l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)) {
            if (matchedLessons.length < 5) {
              matchedLessons.push({ course: c, lesson: l });
            }
          }
        });
      });
    });

    return { courses: matchedCourses, lessons: matchedLessons };
  }, [searchQuery, courses]);

  const notifications = [
    {
      id: 'n1',
      title: 'Nova Aula Disponível',
      desc: 'Módulo 3 do curso de Estratégias de Negócios foi atualizado.',
      time: 'Há 15 min',
      unread: true
    },
    {
      id: 'n2',
      title: 'Certificado Emitido com Sucesso',
      desc: 'Seu certificado de Copywriting Magnético está pronto para download.',
      time: 'Ontem',
      unread: true
    },
    {
      id: 'n3',
      title: 'Mentoria Semanal ao Vivo',
      desc: 'Quinta-feira às 20h com Renato Nardin & Gabriel Arcuri.',
      time: 'Há 2 dias',
      unread: false
    }
  ];

  return (
    <header 
      id="main-header"
      className="sticky top-0 z-30 h-20 bg-[#08090C]/90 backdrop-blur-md border-b border-[#1D2230] px-4 lg:px-8 flex items-center justify-between gap-4"
    >
      {/* Left: Mobile Hamburger & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          id="btn-mobile-menu"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-[#151922] border border-[#1D2230] text-[#A7AFBF] hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div ref={searchRef} className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7AFBF]" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Buscar cursos, aulas, materiais e conteúdos..."
              className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white placeholder-[#A7AFBF]/60 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7AFBF] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Panel */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-13 mt-1 bg-[#0D0F12] border border-[#1D2230] rounded-2xl shadow-2xl p-4 z-50 max-h-[480px] overflow-y-auto">
              {searchResults.courses.length === 0 && searchResults.lessons.length === 0 ? (
                <div className="py-6 text-center text-[#A7AFBF] text-xs">
                  Nenhum conteúdo encontrado para "<span className="text-white font-medium">{searchQuery}</span>"
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.courses.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-[#D4AF37] tracking-wider uppercase mb-2 px-1">
                        Cursos Encontrados
                      </div>
                      <div className="space-y-1.5">
                        {searchResults.courses.map((course) => (
                          <div
                            key={course.id}
                            onClick={() => {
                              onSelectCourse(course.id);
                              setShowSearchDropdown(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl bg-[#151922] hover:bg-[#1D2230] border border-[#1D2230] hover:border-[#D4AF37]/40 cursor-pointer transition"
                          >
                            <img 
                              src={course.thumbnailUrl} 
                              alt={course.title} 
                              className="w-12 h-8 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white truncate">{course.title}</p>
                              <p className="text-[10px] text-[#A7AFBF] truncate">{course.category} • {course.instructor.name}</p>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.lessons.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-[#D4AF37] tracking-wider uppercase mb-2 px-1">
                        Aulas Específicas
                      </div>
                      <div className="space-y-1.5">
                        {searchResults.lessons.map(({ course, lesson }) => (
                          <div
                            key={lesson.id}
                            onClick={() => {
                              if (onSelectLesson) {
                                onSelectLesson(course.id, lesson.id);
                              } else {
                                onSelectCourse(course.id);
                              }
                              setShowSearchDropdown(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl bg-[#151922] hover:bg-[#1D2230] border border-[#1D2230] hover:border-[#D4AF37]/40 cursor-pointer transition"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white truncate">{lesson.title}</p>
                              <p className="text-[10px] text-[#A7AFBF] truncate">{course.title} • {lesson.duration}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: VIP Badge, Favorites, Notifications, User Dropdown */}
      <div className="flex items-center gap-2.5">
        {/* VIP Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#151922] border border-[#D4AF37]/50 shadow-sm shadow-[#D4AF37]/10">
          <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[11px] font-black tracking-wider text-[#F5D76E]">MEMBRO PREMIUM</span>
        </div>

        {/* Quick Demo Role Switcher button */}
        <div className="hidden md:flex items-center bg-[#151922] p-1 rounded-xl border border-[#1D2230]">
          <button
            onClick={() => switchDemoAccount('student')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
              currentUser?.role === 'student'
                ? 'bg-[#D4AF37] text-black shadow-sm'
                : 'text-[#A7AFBF] hover:text-white'
            }`}
            title="Alternar para Aluno Demo"
          >
            Aluno VIP
          </button>
          <button
            onClick={() => switchDemoAccount('admin')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
              currentUser?.role === 'admin'
                ? 'bg-[#D4AF37] text-black shadow-sm'
                : 'text-[#A7AFBF] hover:text-white'
            }`}
            title="Alternar para Administrador Master"
          >
            Admin VIP
          </button>
        </div>

        {/* Favorites Quick Button */}
        <button
          id="btn-header-favorites"
          onClick={() => onNavigateTab('favorites')}
          className="p-2.5 rounded-xl bg-[#151922] border border-[#1D2230] text-[#A7AFBF] hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition"
          title="Meus Favoritos"
        >
          <Bookmark className="w-4 h-4" />
        </button>

        {/* Notifications Bell */}
        <div ref={notifRef} className="relative">
          <button
            id="btn-header-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-[#151922] border border-[#1D2230] text-[#A7AFBF] hover:text-white hover:border-[#D4AF37]/40 transition"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4AF37] shadow-sm shadow-[#D4AF37]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 mt-2 w-80 bg-[#0D0F12] border border-[#1D2230] rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D2230]">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Notificações VIP
                </h4>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">2 novas</span>
              </div>

              <div className="divide-y divide-[#1D2230] mt-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 hover:bg-[#151922]/50 rounded-lg px-2 transition">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-white">{n.title}</p>
                      <span className="text-[9px] text-[#A7AFBF] whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#A7AFBF] mt-0.5 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div ref={accountRef} className="relative">
          <button
            id="btn-header-avatar"
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/40 transition group"
          >
            <img 
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
              alt={currentUser?.name || 'Avatar'}
              className="w-8 h-8 rounded-lg object-cover border border-[#D4AF37]/40"
            />
            <ChevronDown className="w-3.5 h-3.5 text-[#A7AFBF] group-hover:text-white mr-1 hidden sm:block" />
          </button>

          {showAccountDropdown && (
            <div className="absolute right-0 top-12 mt-2 w-64 bg-[#0D0F12] border border-[#1D2230] rounded-2xl shadow-2xl p-3 z-50">
              <div className="p-2 border-b border-[#1D2230] mb-2">
                <p className="text-xs font-bold text-white">{currentUser?.name}</p>
                <p className="text-[11px] text-[#A7AFBF] truncate">{currentUser?.email}</p>
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[10px] text-[#D4AF37] font-bold">
                  <Crown className="w-3 h-3" />
                  {currentUser?.plan || 'VIP PRO'}
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    onOpenProfile();
                    setShowAccountDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-[#A7AFBF] hover:text-white hover:bg-[#151922] rounded-xl transition"
                >
                  Meu Perfil & Configurações
                </button>
                <button
                  onClick={() => {
                    onNavigateTab('certificates');
                    setShowAccountDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-[#A7AFBF] hover:text-white hover:bg-[#151922] rounded-xl transition"
                >
                  Meus Certificados
                </button>
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      onNavigateTab('admin');
                      setShowAccountDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-[#D4AF37] hover:bg-[#151922] rounded-xl transition flex items-center justify-between"
                  >
                    <span>Painel Administrativo</span>
                    <Crown className="w-3 h-3" />
                  </button>
                )}
                <div className="border-t border-[#1D2230] my-1" />
                <button
                  onClick={() => {
                    logout();
                    setShowAccountDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                >
                  Encerrar Sessão
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
