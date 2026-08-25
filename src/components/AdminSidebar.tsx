import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Layers, 
  PlaySquare, 
  BookOpen, 
  Video, 
  FileText, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  LayoutGrid, 
  Crown, 
  Mail, 
  Webhook, 
  HelpCircle, 
  Copy, 
  Target, 
  CreditCard, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  Menu, 
  X, 
  LogOut, 
  ExternalLink, 
  Settings, 
  HelpCircle as HelpIcon,
  Home
} from 'lucide-react';
import { useStore } from '../services/store';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onGoToStudentArea: () => void;
  onLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  onGoToStudentArea,
  onLogout,
  isCollapsed,
  setIsCollapsed
}) => {
  const { branding } = useStore();
  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    conteudo: true,
    usuarios: true,
    personalizacao: false,
    ferramentas: false,
  });

  const toggleSection = (section: string) => {
    if (isCollapsed) return;
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const navItemClass = (id: string, isSub: boolean = false) => {
    const isActive = activeTab === id;
    return `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
      isActive
        ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 font-black'
        : 'text-[#A7AFBF] hover:text-white hover:bg-[#1C2230]/70'
    } ${isSub ? 'pl-9 text-[11px]' : ''}`;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 bg-[#08090C] border-r border-[#1D2230] flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Logo */}
        <div className="p-5 border-b border-[#1D2230] flex items-center justify-between">
          {!isCollapsed ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                {branding.logoUrl ? (
                  <img 
                    src={branding.logoUrl} 
                    alt={branding.brandName || 'Logo'} 
                    className="max-h-10 max-w-[140px] object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D76E] flex items-center justify-center text-black font-black text-sm shadow-md flex-shrink-0">
                    VIP
                  </div>
                )}
                {branding.logoType !== 'image' && (
                  <div>
                    <h2 className="text-sm font-extrabold text-white tracking-tight leading-none truncate max-w-[130px]">
                      {branding.brandName || 'FORMAÇÃO VIP PRO'}
                    </h2>
                    <span className="text-[10px] text-[#D4AF37] font-mono uppercase tracking-widest block mt-0.5">
                      Central Admin
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F5D76E] flex items-center justify-center text-black font-black text-base mx-auto overflow-hidden">
              {branding.logoUrl ? (
                <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                'VIP'
              )}
            </div>
          )}

          {/* Collapse button for desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg bg-[#151922] border border-[#1D2230] text-[#A7AFBF] hover:text-white transition"
            title={isCollapsed ? 'Expandir Sidebar' : 'Recolher Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Close for mobile */}
          <button
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden p-1.5 rounded-lg bg-[#151922] border border-[#1D2230] text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcut to Student Area */}
        <div className="p-3 border-b border-[#1D2230]">
          <button
            onClick={onGoToStudentArea}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#151922] hover:bg-[#1C2230] border border-[#1D2230] text-[#D4AF37] text-xs font-bold transition group ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
            title="Ir para a Área do Aluno"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="uppercase tracking-wider">Área do Aluno</span>}
            </div>
            {!isCollapsed && <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />}
          </button>
        </div>

        {/* Navigation Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          
          {/* VISÃO GERAL */}
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="px-3 text-[10px] font-black text-[#A7AFBF]/70 uppercase tracking-widest font-mono block mb-2">
                Visão Geral
              </span>
            )}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={navItemClass('dashboard')}
              title="Dashboard"
            >
              <BarChart3 className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">Dashboard</span>}
            </button>
          </div>

          {/* CONTEÚDO */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div 
                onClick={() => toggleSection('conteudo')}
                className="flex items-center justify-between px-3 mb-2 cursor-pointer group"
              >
                <span className="text-[10px] font-black text-[#A7AFBF]/70 uppercase tracking-widest font-mono">
                  Conteúdo
                </span>
                {openSections.conteudo ? <ChevronDown className="w-3.5 h-3.5 text-[#A7AFBF]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#A7AFBF]" />}
              </div>
            )}

            {(isCollapsed || openSections.conteudo) && (
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('member_areas')}
                  className={navItemClass('member_areas')}
                  title="Áreas de Membros"
                >
                  <Layers className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Áreas de Membros</span>}
                </button>

                <button
                  onClick={() => setActiveTab('digital_products')}
                  className={navItemClass('digital_products')}
                  title="Produtos Digitais"
                >
                  <PlaySquare className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Produtos Digitais</span>}
                </button>

                <button
                  onClick={() => setActiveTab('courses')}
                  className={navItemClass('courses')}
                  title="Formações & Cursos"
                >
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Formações & Cursos</span>}
                </button>

                <button
                  onClick={() => setActiveTab('modules_lessons')}
                  className={navItemClass('modules_lessons')}
                  title="Aulas & Conteúdos"
                >
                  <Video className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Aulas & Conteúdos</span>}
                </button>

                <button
                  onClick={() => setActiveTab('materials')}
                  className={navItemClass('materials')}
                  title="Oferta & Arquivos"
                >
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Oferta & Arquivos</span>}
                </button>

                <button
                  onClick={() => setActiveTab('banners')}
                  className={navItemClass('banners')}
                  title="Hero Carousel & Banners"
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0 text-[#D4AF37]" />
                  {!isCollapsed && <span className="truncate">Banners & Hero Carousel</span>}
                </button>

                <button
                  onClick={() => setActiveTab('banner_stats')}
                  className={navItemClass('banner_stats')}
                  title="Estatísticas de Banners"
                >
                  <BarChart3 className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Estatísticas Banners</span>}
                </button>
              </div>
            )}
          </div>

          {/* USUÁRIOS */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div 
                onClick={() => toggleSection('usuarios')}
                className="flex items-center justify-between px-3 mb-2 cursor-pointer group"
              >
                <span className="text-[10px] font-black text-[#A7AFBF]/70 uppercase tracking-widest font-mono">
                  Usuários
                </span>
                {openSections.usuarios ? <ChevronDown className="w-3.5 h-3.5 text-[#A7AFBF]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#A7AFBF]" />}
              </div>
            )}

            {(isCollapsed || openSections.usuarios) && (
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('users')}
                  className={navItemClass('users')}
                  title="Usuários & Alunos"
                >
                  <Users className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Usuários & Alunos</span>}
                </button>

                <button
                  onClick={() => setActiveTab('user_access')}
                  className={navItemClass('user_access')}
                  title="Controle de Acessos"
                >
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Controle de Acessos</span>}
                </button>
              </div>
            )}
          </div>

          {/* PERSONALIZAÇÃO */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div 
                onClick={() => toggleSection('personalizacao')}
                className="flex items-center justify-between px-3 mb-2 cursor-pointer group"
              >
                <span className="text-[10px] font-black text-[#A7AFBF]/70 uppercase tracking-widest font-mono">
                  Personalização
                </span>
                {openSections.personalizacao ? <ChevronDown className="w-3.5 h-3.5 text-[#A7AFBF]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#A7AFBF]" />}
              </div>
            )}

            {(isCollapsed || openSections.personalizacao) && (
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('login_customizer')}
                  className={navItemClass('login_customizer')}
                  title="Tela de Login Global"
                >
                  <LayoutGrid className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Tela de Login Global</span>}
                </button>

                <button
                  onClick={() => setActiveTab('branding')}
                  className={navItemClass('branding')}
                  title="Logo & Favicon"
                >
                  <Crown className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Logo & Favicon</span>}
                </button>

                <button
                  onClick={() => setActiveTab('templates')}
                  className={navItemClass('templates')}
                  title="Templates"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Templates</span>}
                </button>
              </div>
            )}
          </div>

          {/* INTEGRAÇÕES */}
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="px-3 text-[10px] font-black text-[#A7AFBF]/70 uppercase tracking-widest font-mono block mb-2">
                Integrações
              </span>
            )}
            <button
              onClick={() => setActiveTab('webhooks')}
              className={navItemClass('webhooks')}
              title="Webhooks"
            >
              <Webhook className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">Webhooks</span>}
            </button>
          </div>

          {/* FERRAMENTAS */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div 
                onClick={() => toggleSection('ferramentas')}
                className="flex items-center justify-between px-3 mb-2 cursor-pointer group"
              >
                <span className="text-[10px] font-black text-[#A7AFBF]/70 uppercase tracking-widest font-mono">
                  Ferramentas
                </span>
                {openSections.ferramentas ? <ChevronDown className="w-3.5 h-3.5 text-[#A7AFBF]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#A7AFBF]" />}
              </div>
            )}

            {(isCollapsed || openSections.ferramentas) && (
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('quiz_builder')}
                  className={navItemClass('quiz_builder')}
                  title="Criar Quiz"
                >
                  <HelpCircle className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Criar Quiz</span>}
                </button>

                <button
                  onClick={() => setActiveTab('clone_sites')}
                  className={navItemClass('clone_sites')}
                  title="Criar e Clonar Sites"
                >
                  <Copy className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Criar e Clonar Sites</span>}
                </button>

                <button
                  onClick={() => setActiveTab('spy_offers')}
                  className={navItemClass('spy_offers')}
                  title="Espionar Ofertas"
                >
                  <Target className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Espionar Ofertas</span>}
                </button>

                <button
                  onClick={() => setActiveTab('video_hosting')}
                  className={navItemClass('video_hosting')}
                  title="Hospedar Vídeos"
                >
                  <Video className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Hospedar Vídeos</span>}
                </button>

                <button
                  onClick={() => setActiveTab('perfect_pay')}
                  className={navItemClass('perfect_pay')}
                  title="Cadastrar na Perfect Pay"
                >
                  <CreditCard className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Perfect Pay</span>}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#1D2230] space-y-2 bg-[#0D0F12]">
          {!isCollapsed && (
            <div className="px-2 pb-2">
              <span className="text-[11px] font-bold text-white block">Formação VIP PRO</span>
              <span className="text-[10px] text-[#A7AFBF] font-mono">Painel Administrativo v2.5</span>
            </div>
          )}

          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Sair do Sistema"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Sair do Painel</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
