import React from 'react';
import { 
  Lock, 
  ArrowLeft, 
  ExternalLink, 
  Crown, 
  ShieldAlert, 
  Sparkles,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { MemberArea, User } from '../types';

interface AccessDeniedScreenProps {
  area: MemberArea;
  currentUser: User | null;
  onGoBack: () => void;
  onLogout: () => void;
}

export const AccessDeniedScreen: React.FC<AccessDeniedScreenProps> = ({
  area,
  currentUser,
  onGoBack,
  onLogout
}) => {
  return (
    <div className="min-h-screen bg-[#08090C] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-lg bg-[#0D0F12] border border-[#222738] rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative z-10 space-y-6">
        {/* Lock Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl">
          <Lock className="w-10 h-10" />
        </div>

        {/* Title and Message */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            Acesso Restrito
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Você não possui acesso a esta Área de Membros
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            A área <span className="text-[#D4AF37] font-semibold">{area.name}</span> é exclusiva para membros com matrículas ativas ou plano específico.
          </p>
        </div>

        {/* User Info Bar */}
        <div className="p-4 bg-[#151922] rounded-2xl border border-[#222738] text-left flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400">Logado como:</div>
            <div className="text-sm font-bold text-white">{currentUser?.name || 'Aluno'}</div>
            <div className="text-xs text-gray-500 font-mono">{currentUser?.email}</div>
          </div>
          <button
            onClick={onLogout}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 p-2 rounded-lg hover:bg-[#0D0F12] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Trocar conta
          </button>
        </div>

        {/* Upgrade / Acquire Area CTA */}
        <div className="p-6 bg-gradient-to-br from-[#151922] to-[#0D0F12] rounded-2xl border border-[#D4AF37]/30 space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#D4AF37]">
            <Crown className="w-4 h-4" />
            Deseja liberar o acesso imediato?
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Faça upgrade da sua assinatura ou adquira este produto separadamente para desbloquear todos os conteúdos instantaneamente.
          </p>
          <a
            href="https://wa.me/5511999999999?text=Gostaria%20de%20adquirir%20o%20acesso%20a%20área%20de%20membros"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold rounded-xl hover:opacity-95 shadow-lg shadow-[#D4AF37]/20 transition-all text-sm"
          >
            <Sparkles className="w-4 h-4" />
            SOLICITAR ACESSO / FAZER UPGRADE
          </a>
        </div>

        {/* Back Button */}
        <button
          onClick={onGoBack}
          className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Minhas Áreas Liberadas
        </button>
      </div>
    </div>
  );
};
