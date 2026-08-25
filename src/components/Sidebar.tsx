import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Compass, 
  PlayCircle, 
  Milestone, 
  Bookmark, 
  FileText, 
  Award, 
  Users, 
  HelpCircle, 
  User, 
  Settings, 
  LogOut, 
  Crown, 
  ShieldCheck,
  ChevronRight,
  Sparkles
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
  const { currentUser, logout, branding } = useStore();

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'my-courses' as ActiveTab, label: 'MEUS CURSOS', icon: BookOpen },
    { id: 'all-courses' as ActiveTab, label: 'TODOS OS CURSOS', icon: Compass },
    { id: 'continue-watching' as ActiveTab, label: 'CONTINUAR ASSISTINDO', icon: PlayCircle },
    { id: 'tracks' as ActiveTab, label: 'TRILHAS DE APRENDIZADO', icon: Milestone },
    { id: 'favorites' as ActiveTab, label: 'FAVORITOS', icon: Bookmark },
    { id: 'materials' as ActiveTab, label: 'MATERIAIS', icon: FileText },
    { id: 'certificates' as ActiveTab, label: 'CERTIFICADOS', icon: Award },
    { id: 'community' as ActiveTab, label: 'COMUNIDADE', icon: Users },
    { id: 'support' as ActiveTab, label: 'SUPORTE', icon: HelpCircle },
  ];

  const handleSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0D0F12] border-r border-[#1D2230] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-[#1D2230] bg-gradient-to-b from-[#151922]/40 to-transparent">
          <div className="flex items-center gap-3 w-full">
            {branding.logoUrl ? (
              <img 
                src={branding.logoUrl} 
                alt={branding.brandName || 'Logo'} 
                className="max-h-10 max-w-[160px] object-contain rounded-lg"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#AA820A] to-[#6A5005] p-0.5 flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 flex-shrink-0">
                <div className="w-full h-full bg-[#08090C] rounded-[10px] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-[#D4AF37]" />
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
                    <span className="font-black text-[10px] px-1.5 py-0.5 rounded bg-[#D4AF37] text-black tracking-widest font-mono font-bold whitespace-nowrap">
                      {branding.brandBadge}
                    </span>
                  )}
                </div>
                <p className="text-[9px] text-[#A7AFBF] tracking-widest font-mono mt-0.5 truncate">
                  {branding.brandSubtext || 'EXCLUSIVE MEMBERSHIP'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-widest text-[#A7AFBF]/60 font-mono">
            MENU PRINCIPAL
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#151922] text-white border border-[#D4AF37]/40 shadow-sm shadow-[#D4AF37]/10'
                    : 'text-[#A7AFBF] hover:text-white hover:bg-[#151922]/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#D4AF37]' : 'text-[#A7AFBF] group-hover:text-white'
                    }`} 
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-sm shadow-[#D4AF37]" />
                )}
              </button>
            );
          })}

          {/* Admin Section (Prominent if Admin or Quick Switch) */}
          <div className="pt-4 pb-1">
            <div className="px-3 pb-2 text-[10px] font-bold tracking-widest text-[#D4AF37]/80 font-mono flex items-center justify-between">
              <span>ADMINISTRAÇÃO</span>
              {currentUser?.role === 'admin' && (
                <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded border border-[#D4AF37]/40">VIP ROOT</span>
              )}
            </div>
            
            <button
              id="nav-admin-panel"
              onClick={() => handleSelect('admin')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-[#151922] to-[#1D2230] text-white border border-[#D4AF37] shadow-md shadow-[#D4AF37]/15'
                  : 'text-[#D4AF37] bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 border border-[#D4AF37]/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>PAINEL ADMIN</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]/70" />
            </button>
          </div>
        </div>

        {/* User Account Footer */}
        <div className="p-4 border-t border-[#1D2230] bg-[#08090C]/60">
          <div className="px-1 pb-2 text-[10px] font-bold tracking-widest text-[#A7AFBF]/60 font-mono">
            MINHA CONTA
          </div>
          
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#151922]/70 border border-[#1D2230] hover:border-[#D4AF37]/30 transition-all">
            <img 
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
              alt={currentUser?.name || 'User'} 
              className="w-9 h-9 rounded-lg object-cover border border-[#D4AF37]/40"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Membro VIP'}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                <span className="text-[10px] text-[#D4AF37] font-medium tracking-wide truncate">
                  {currentUser?.role === 'admin' ? 'ADMINISTRADOR' : 'MEMBRO VIP'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 mt-2">
            <button
              id="sidebar-btn-profile"
              onClick={onOpenProfile}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium text-[#A7AFBF] bg-[#151922] hover:text-white hover:bg-[#1D2230] border border-[#1D2230] transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>Perfil</span>
            </button>
            <button
              id="sidebar-btn-logout"
              onClick={logout}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition"
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
