import React from 'react';
import { Menu, Bell, ShieldCheck, Home, ExternalLink } from 'lucide-react';
import { useStore } from '../services/store';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  onGoToStudentArea: () => void;
  activeTab: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleMobileMenu,
  onGoToStudentArea,
  activeTab
}) => {
  const { currentUser } = useStore();

  const tabTitles: Record<string, string> = {
    dashboard: 'Dashboard Administrativo',
    member_areas: 'Áreas de Membros',
    digital_products: 'Produtos Digitais',
    courses: 'Formações & Cursos',
    modules_lessons: 'Aulas & Conteúdos',
    materials: 'Oferta & Arquivos',
    banners: 'Banners & Hero Carousel',
    banner_stats: 'Estatísticas de Banners',
    users: 'Usuários & Alunos',
    user_access: 'Controle de Acessos',
    login_customizer: 'Tela de Login Global',
    branding: 'Logo & Favicon',
    templates: 'Templates de E-mail',
    webhooks: 'Webhooks & Integrações',
    quiz_builder: 'Criar Quiz',
    clone_sites: 'Criar e Clonar Sites',
    spy_offers: 'Espionar Ofertas',
    video_hosting: 'Hospedagem de Vídeos',
    perfect_pay: 'Integração Perfect Pay'
  };

  const currentTitle = tabTitles[activeTab] || 'Central Administrativa';

  return (
    <header className="h-20 bg-[#0D0F12] border-b border-[#1D2230] px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* Left: Mobile Toggle & Breadcrumb / Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-[#151922] border border-[#1D2230] text-[#A7AFBF] hover:text-white"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#A7AFBF] uppercase tracking-wider">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#D4AF37] font-bold">{currentTitle}</span>
          </div>
          <h1 className="text-lg lg:text-xl font-extrabold text-white tracking-tight">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Right: Actions & Admin Profile */}
      <div className="flex items-center gap-4">
        <button
          onClick={onGoToStudentArea}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151922] hover:bg-[#1C2230] border border-[#1D2230] text-xs font-bold text-[#D4AF37] transition"
        >
          <Home className="w-4 h-4" />
          <span>Área do Aluno</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </button>

        <div className="relative">
          <button 
            className="w-10 h-10 rounded-xl bg-[#151922] border border-[#1D2230] flex items-center justify-center text-[#A7AFBF] hover:text-white transition relative"
            title="Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D4AF37]" />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-[#1D2230]">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#D4AF37]/40 bg-[#151922]">
            <img 
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} 
              alt={currentUser?.name || "Admin"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-white block truncate max-w-[120px]">
              {currentUser?.name || 'Administrador'}
            </span>
            <span className="text-[10px] text-[#D4AF37] font-mono uppercase tracking-widest block">
              Master Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
