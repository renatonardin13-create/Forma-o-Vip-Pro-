import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Crown, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { MemberArea, LoginCustomization } from '../types';
import { INITIAL_LOGIN_CUSTOMIZATION } from '../data/mockData';

interface AreaLoginScreenProps {
  area: MemberArea;
  onLogin: (email: string, pass?: string) => { success: boolean; message?: string };
  onSwitchDemo: (role: 'student' | 'admin') => void;
  onGoToGeneralStudentArea?: () => void;
}

export const AreaLoginScreen: React.FC<AreaLoginScreenProps> = ({
  area,
  onLogin,
  onSwitchDemo,
  onGoToGeneralStudentArea
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginConfig: LoginCustomization = area.loginCustomization || {
    ...INITIAL_LOGIN_CUSTOMIZATION,
    brandTitle: area.name.toUpperCase(),
    brandSubtitle: area.description?.toUpperCase() || 'ÁREA DE MEMBROS EXCLUSIVA',
    formTitle: `Portal ${area.name}`
  };

  const primaryColor = area.primaryColor || '#D4AF37';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = onLogin(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      }
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#08090C]">
      {/* Background Container */}
      <div className="absolute inset-0 z-0">
        {loginConfig.backgroundType === 'image' && (
          <img
            src={loginConfig.backgroundUrl || area.bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80'}
            alt={area.name}
            className="w-full h-full object-cover object-center"
          />
        )}

        {loginConfig.backgroundType === 'mp4' && loginConfig.backgroundUrl && (
          <video
            src={loginConfig.backgroundUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {loginConfig.backgroundType === 'youtube' && (
          <div className="w-full h-full pointer-events-none overflow-hidden scale-125">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${loginConfig.backgroundUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${loginConfig.backgroundUrl}&showinfo=0&modestbranding=1&disablekb=1`}
              title="Background"
              className="w-full h-full border-0 object-cover"
            />
          </div>
        )}

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-[#08090C]/80 backdrop-blur-[6px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-transparent to-[#08090C]/60" />
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0D0F12]/95 border border-[#1D2230] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-in zoom-in-95">
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <div 
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-xl border"
            style={{ 
              backgroundColor: `${primaryColor}15`, 
              borderColor: `${primaryColor}40`,
              color: primaryColor
            }}
          >
            {area.logoUrl ? (
              <img src={area.logoUrl} alt={area.name} className="w-10 h-10 object-contain rounded-lg" />
            ) : (
              <Crown className="w-8 h-8" />
            )}
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {loginConfig.brandTitle || area.name}
            </h1>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-1">
              {loginConfig.brandSubtitle || 'Área de Membros'}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              E-mail de Acesso
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#151922] border border-[#222738] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none"
                style={{ borderColor: email ? `${primaryColor}60` : undefined }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#151922] border border-[#222738] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none"
                style={{ borderColor: password ? `${primaryColor}60` : undefined }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-95 disabled:opacity-50 mt-2"
            style={{ 
              background: `linear-gradient(to right, ${primaryColor}, #F5D76E)` 
            }}
          >
            {isLoading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>ENTRAR NA ÁREA DE MEMBROS</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Logins */}
        <div className="mt-8 pt-6 border-t border-[#1D2230] space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 text-center">
            Acesso Rápido para Demonstração
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onSwitchDemo('student')}
              className="py-2 px-3 rounded-lg bg-[#151922] hover:bg-[#1D2230] text-gray-300 hover:text-white text-xs font-semibold border border-[#222738] transition-colors text-center"
            >
              Entrar como Aluno
            </button>
            <button
              onClick={() => onSwitchDemo('admin')}
              className="py-2 px-3 rounded-lg bg-[#151922] hover:bg-[#1D2230] text-[#D4AF37] hover:text-[#F5D76E] text-xs font-semibold border border-[#D4AF37]/30 transition-colors text-center"
            >
              Entrar como Admin
            </button>
          </div>
        </div>

        {/* General Portal Link */}
        {onGoToGeneralStudentArea && (
          <div className="mt-4 text-center">
            <button
              onClick={onGoToGeneralStudentArea}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Ir para o Portal Geral do Aluno
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
