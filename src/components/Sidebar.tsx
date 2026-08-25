import React from 'react';
import { 
  LayoutGrid,
  Users, 
  Layers, 
  PlusSquare, 
  BadgePercent, 
  Palette, 
  Crown, 
  Settings, 
  BarChart3, 
  HelpCircle, 
  User, 
  LogOut, 
  BookOpen, 
  Compass, 
  PlayCircle, 
  Milestone, 
  Bookmark, 
  FileText, 
  Award, 
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Webhook,
  Mail,
  Copy,
  Target,
  Video,
  CreditCard
} from 'lucide-react';
import { useStore } from '../services/store';

export type ActiveTab = 
  | 'dashboard'
  | 'my-courses'
  | 'all-courses'
  | 'continue-watching'
  | 'tracks'
  | 'favorites'
  | 'materials'
  | 'certificates'
  | 'community'
  | 'support'
  | 'admin';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onOpenProfile: () => void;
  onOpenCourse?: (courseId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  onOpenProfile,
}) => {
  const { currentUser, logout, branding, adminTab, setAdminTab } = useStore();

  const isAdminRole = currentUser?.role === 'admin';
  const isInAdminMode = activeTab === 'admin';

  // Handle standard navigation
  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  // Handle admin sub-navigation directly from sidebar
  const handleSelectAdminSubTab = (subTabKey: string) => {
    setActiveTab('admin');
    setAdminTab(subTabKey);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          id="sidebar-backdrop"
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        id="main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B0F19] border-r border-[#1D2230] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-[#1D2230] bg-[#0B0F19]">
          <div className="flex items-center gap-3 w-full">
            {branding.logoUrl ? (
              <img 
                src={branding.logoUrl} 
                alt={branding.brandName || 'Logo'} 
                className="max-h-10 max-w-[160px] object-contain rounded-lg"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E5A83B] via-[#D4AF37] to-[#8C6D1F] p-0.5 flex items-center justify-center shadow-lg shadow-[#E5A83B]/20 flex-shrink-0">
                <div className="w-full h-full bg-[#08090C] rounded-[14px] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-[#E5A83B]" />
                </div>
              </div>
            )}
            
            {branding.logoType !== 'image' && (
              <div className="min-w-0 flex-1 truncate">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-extrabold text-sm tracking-wider text-white truncate">
                    {branding.brandName || 'FORMAÇÃO'}
                  </span>
                  {branding.brandBadge && (
                    <span className="font-black text-[10px] px-1.5 py-0.5 rounded bg-[#E5A83B] text-black tracking-widest font-mono font-bold whitespace-nowrap">
                      {branding.brandBadge}
                    </span>
                  )}
                </div>
                <p className="text-[9px] text-[#8E9BB0] tracking-widest font-mono mt-0.5 truncate">
                  {branding.brandSubtext || 'EXCLUSIVE MEMBERSHIP'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 custom-scrollbar">

          {/* Mode Switcher Banner if Admin */}
          {isAdminRole && (
            <div className="p-1 bg-[#121724] rounded-2xl border border-[#1D2230] flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (isInAdminMode) {
                    handleSelectTab('dashboard');
                  }
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                  !isInAdminMode 
                    ? 'bg-[#E5A83B] text-black shadow-sm' 
                    : 'text-[#8E9BB0] hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Área Aluno</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isInAdminMode) {
                    handleSelectTab('admin');
                  }
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
                  isInAdminMode 
                    ? 'bg-[#E5A83B] text-black shadow-sm' 
                    : 'text-[#8E9BB0] hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Central Admin</span>
              </button>
            </div>
          )}

          {/* MENU VIEW 1: ADMIN CENTRAL (Matches reference image pixel-perfect) */}
          {isInAdminMode ? (
            <div className="space-y-4">
              {/* SECTION: VISÃO GERAL */}
              <div className="space-y-1">
                <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-[#607290] uppercase font-mono">
                  VISÃO GERAL
                </div>

                <button
                  id="admin-nav-dashboard"
                  onClick={() => handleSelectAdminSubTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'dashboard'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <LayoutGrid className={`w-4 h-4 flex-shrink-0 ${adminTab === 'dashboard' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Dashboard</span>
                </button>

                <button
                  id="admin-nav-users"
                  onClick={() => handleSelectAdminSubTab('users')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'users'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <Users className={`w-4 h-4 flex-shrink-0 ${adminTab === 'users' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Usuários</span>
                </button>

                <button
                  id="admin-nav-sales"
                  onClick={() => handleSelectAdminSubTab('sales')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'sales'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <CreditCard className={`w-4 h-4 flex-shrink-0 ${adminTab === 'sales' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Vendas</span>
                </button>

                <button
                  id="admin-nav-access"
                  onClick={() => handleSelectAdminSubTab('user_access')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'user_access'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 flex-shrink-0 ${adminTab === 'user_access' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Acessos</span>
                </button>
              </div>

              {/* SECTION: CONTEÚDO */}
              <div className="space-y-1">
                <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-[#607290] uppercase font-mono">
                  CONTEÚDO
                </div>

                <button
                  id="admin-nav-member-areas"
                  onClick={() => handleSelectAdminSubTab('courses')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'courses'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <Layers className={`w-4 h-4 flex-shrink-0 ${adminTab === 'courses' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Áreas de membros</span>
                </button>

                <button
                  id="admin-nav-new-product"
                  onClick={() => handleSelectAdminSubTab('modules_lessons')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'modules_lessons'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <PlusSquare className={`w-4 h-4 flex-shrink-0 ${adminTab === 'modules_lessons' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Cadastrar produto</span>
                </button>

                <button
                  id="admin-nav-offers"
                  onClick={() => handleSelectAdminSubTab('materials')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'materials'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <BadgePercent className={`w-4 h-4 flex-shrink-0 ${adminTab === 'materials' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Oferta</span>
                </button>
              </div>

              {/* SECTION: CONFIGURAÇÕES */}
              <div className="space-y-1">
                <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-[#607290] uppercase font-mono">
                  CONFIGURAÇÕES
                </div>

                <button
                  id="admin-nav-login-customizer"
                  onClick={() => handleSelectAdminSubTab('login_customizer')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'login_customizer'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <LayoutGrid className={`w-4 h-4 flex-shrink-0 ${adminTab === 'login_customizer' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Tela de Login</span>
                </button>

                <button
                  id="admin-nav-webhooks"
                  onClick={() => handleSelectAdminSubTab('webhooks')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'webhooks'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <Webhook className={`w-4 h-4 flex-shrink-0 ${adminTab === 'webhooks' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Webhooks</span>
                </button>

                <button
                  id="admin-nav-templates"
                  onClick={() => handleSelectAdminSubTab('templates')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'templates'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <Mail className={`w-4 h-4 flex-shrink-0 ${adminTab === 'templates' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Templates</span>
                </button>

                <button
                  id="admin-nav-branding"
                  onClick={() => handleSelectAdminSubTab('branding')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'branding'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <Crown className={`w-4 h-4 flex-shrink-0 ${adminTab === 'branding' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Logo & Favicon</span>
                </button>
              </div>

              {/* SECTION: FERRAMENTAS */}
              <div className="space-y-1">
                <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-[#607290] uppercase font-mono">
                  FERRAMENTAS
                </div>

                <button
                  id="admin-nav-quiz"
                  onClick={() => handleSelectAdminSubTab('quiz_builder')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'quiz_builder'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <HelpCircle className={`w-4 h-4 flex-shrink-0 ${adminTab === 'quiz_builder' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Criar Quiz</span>
                </button>

                <button
                  id="admin-nav-clone-sites"
                  onClick={() => handleSelectAdminSubTab('clone_sites')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'clone_sites'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <Copy className={`w-4 h-4 flex-shrink-0 ${adminTab === 'clone_sites' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Criar e Clonar Sites</span>
                </button>

                <button
                  id="admin-nav-spy-offers"
                  onClick={() => handleSelectAdminSubTab('spy_offers')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'spy_offers'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <Target className={`w-4 h-4 flex-shrink-0 ${adminTab === 'spy_offers' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Espionar Ofertas</span>
                </button>

                <button
                  id="admin-nav-video-hosting"
                  onClick={() => handleSelectAdminSubTab('video_hosting')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'video_hosting'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <Video className={`w-4 h-4 flex-shrink-0 ${adminTab === 'video_hosting' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Hospedar Vídeos</span>
                </button>

                <button
                  id="admin-nav-perfect-pay"
                  onClick={() => handleSelectAdminSubTab('perfect_pay')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    adminTab === 'perfect_pay'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <CreditCard className={`w-4 h-4 flex-shrink-0 ${adminTab === 'perfect_pay' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Cadastrar na Perfect Pay</span>
                </button>

                <button
                  id="admin-nav-support"
                  onClick={() => handleSelectTab('support')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70 transition-all"
                >
                  <HelpCircle className="w-4 h-4 flex-shrink-0 text-[#8E9BB0]" />
                  <span>Suporte & Ajuda</span>
                </button>
              </div>
            </div>
          ) : (
            /* MENU VIEW 2: ALUNO / MEMBRO VIP (Same gorgeous golden pill style) */
            <div className="space-y-4">
              {/* SECTION: VISÃO GERAL */}
              <div className="space-y-1">
                <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-[#607290] uppercase font-mono">
                  VISÃO GERAL
                </div>

                <button
                  id="nav-dashboard"
                  onClick={() => handleSelectTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'dashboard'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <LayoutGrid className={`w-4 h-4 flex-shrink-0 ${activeTab === 'dashboard' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Dashboard</span>
                </button>

                <button
                  id="nav-my-courses"
                  onClick={() => handleSelectTab('my-courses')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'my-courses'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <BookOpen className={`w-4 h-4 flex-shrink-0 ${activeTab === 'my-courses' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Meus Cursos</span>
                </button>

                <button
                  id="nav-all-courses"
                  onClick={() => handleSelectTab('all-courses')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'all-courses'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <Compass className={`w-4 h-4 flex-shrink-0 ${activeTab === 'all-courses' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Todos os Cursos</span>
                </button>
              </div>

              {/* SECTION: CONTEÚDO */}
              <div className="space-y-1">
                <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-[#607290] uppercase font-mono">
                  CONTEÚDO
                </div>

                <button
                  id="nav-continue-watching"
                  onClick={() => handleSelectTab('continue-watching')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'continue-watching'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <PlayCircle className={`w-4 h-4 flex-shrink-0 ${activeTab === 'continue-watching' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Continuar Assistindo</span>
                </button>

                <button
                  id="nav-tracks"
                  onClick={() => handleSelectTab('tracks')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'tracks'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <Milestone className={`w-4 h-4 flex-shrink-0 ${activeTab === 'tracks' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Trilhas de Aprendizado</span>
                </button>

                <button
                  id="nav-favorites"
                  onClick={() => handleSelectTab('favorites')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'favorites'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 flex-shrink-0 ${activeTab === 'favorites' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Favoritos</span>
                </button>

                <button
                  id="nav-materials"
                  onClick={() => handleSelectTab('materials')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'materials'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <FileText className={`w-4 h-4 flex-shrink-0 ${activeTab === 'materials' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Materiais & Arquivos</span>
                </button>
              </div>

              {/* SECTION: COMUNIDADE & CERTIFICADOS */}
              <div className="space-y-1">
                <div className="px-3 pb-1 text-[11px] font-bold tracking-wider text-[#607290] uppercase font-mono">
                  COMUNIDADE & RECURSOS
                </div>

                <button
                  id="nav-community"
                  onClick={() => handleSelectTab('community')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'community'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <Users className={`w-4 h-4 flex-shrink-0 ${activeTab === 'community' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Comunidade VIP</span>
                </button>

                <button
                  id="nav-certificates"
                  onClick={() => handleSelectTab('certificates')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'certificates'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <Award className={`w-4 h-4 flex-shrink-0 ${activeTab === 'certificates' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Certificados</span>
                </button>

                <button
                  id="nav-support"
                  onClick={() => handleSelectTab('support')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'support'
                      ? 'bg-[#E5A83B] text-black shadow-md shadow-[#E5A83B]/20'
                      : 'text-[#8E9BB0] hover:text-white hover:bg-[#151922]/70'
                  }`}
                >
                  <HelpCircle className={`w-4 h-4 flex-shrink-0 ${activeTab === 'support' ? 'text-black' : 'text-[#8E9BB0]'}`} />
                  <span>Suporte</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Account Footer */}
        <div className="p-4 border-t border-[#1D2230] bg-[#08090C]/80">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-[#151922]/70 border border-[#1D2230]">
            <img 
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
              alt={currentUser?.name || 'User'} 
              className="w-9 h-9 rounded-xl object-cover border border-[#E5A83B]/40"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Membro VIP'}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Sparkles className="w-2.5 h-2.5 text-[#E5A83B]" />
                <span className="text-[10px] text-[#E5A83B] font-semibold tracking-wide truncate">
                  {currentUser?.role === 'admin' ? 'ADMINISTRADOR' : 'MEMBRO VIP'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2.5">
            <button
              id="sidebar-btn-profile"
              onClick={onOpenProfile}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-[#8E9BB0] bg-[#151922] hover:text-white hover:bg-[#1D2230] border border-[#1D2230] transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>Perfil</span>
            </button>
            <button
              id="sidebar-btn-logout"
              onClick={logout}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
