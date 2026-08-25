import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Play, 
  X,
  UserCheck
} from 'lucide-react';
import { useStore } from '../services/store';
import { getYouTubeBackgroundEmbedUrl } from '../utils/videoHelpers';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { login, loginConfig, branding, switchDemoAccount } = useStore();
  const [email, setEmail] = useState('renatonardin13@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      try {
        const success = login(email, password);
        if (success) {
          onLoginSuccess();
        } else {
          setErrorMsg('Credenciais inválidas. Verifique seu e-mail e senha.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Erro ao efetuar login.');
      } finally {
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickDemo = (type: 'student' | 'admin') => {
    switchDemoAccount(type);
    onLoginSuccess();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setShowForgotModal(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#08090C] text-white">
      {/* LEFT CINEMATIC HERO SECTION (65% on Desktop) */}
      <div className="relative w-full lg:w-[65%] min-h-[420px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-12 overflow-hidden">
        {/* Dynamic Background based on Admin Customization */}
        {loginConfig.backgroundType === 'image' && (
          <img 
            src={loginConfig.backgroundUrl} 
            alt="Cinematic background" 
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}

        {loginConfig.backgroundType === 'mp4' && (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            src={loginConfig.backgroundUrl}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {loginConfig.backgroundType === 'youtube' && (
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <iframe
              src={getYouTubeBackgroundEmbedUrl(loginConfig.backgroundUrl)}
              className="absolute top-1/2 left-1/2 w-[160%] h-[160%] -translate-x-1/2 -translate-y-1/2 object-cover border-0 pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title="Cinematic BG"
            />
          </div>
        )}

        {loginConfig.backgroundType === 'gradient' && (
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ 
              background: `linear-gradient(135deg, ${loginConfig.gradientFrom || '#08090C'}, ${loginConfig.gradientTo || '#151922'})` 
            }}
          />
        )}

        {loginConfig.backgroundType === 'solid' && (
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ backgroundColor: loginConfig.solidColor || '#08090C' }}
          />
        )}

        {/* Dark Customizable Overlay */}
        <div 
          className="absolute inset-0 transition-opacity"
          style={{
            backgroundColor: '#08090C',
            opacity: loginConfig.overlayOpacity / 100,
            backdropFilter: `blur(${loginConfig.overlayBlur}px)`
          }}
        />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          {branding.logoUrl ? (
            <img 
              src={branding.logoUrl} 
              alt={branding.brandName || 'Logo'} 
              className="max-h-12 max-w-[200px] object-contain rounded-xl shadow-lg"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#AA820A] to-[#6A5005] p-0.5 flex items-center justify-center shadow-gold-glow">
              <div className="w-full h-full bg-[#08090C] rounded-[14px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
          )}

          {branding.logoType !== 'image' && (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-white">
                  {branding.brandName || 'FORMAÇÃO'}
                </span>
                {branding.brandBadge && (
                  <span className="font-black text-xs px-2 py-0.5 rounded bg-[#D4AF37] text-black tracking-widest font-mono font-bold">
                    {branding.brandBadge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#A7AFBF] tracking-widest font-mono mt-0.5">
                {branding.brandSubtext || 'EXCLUSIVE MEMBERSHIP AREA'}
              </p>
            </div>
          )}
        </div>

        {/* Center Cinematic Headlines */}
        <div className="relative z-10 my-auto py-12 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 text-[#F5D76E] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            EXPERIÊNCIA EXCLUSIVA PARA MEMBROS
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {loginConfig.brandSubtitle || 'Sua jornada para o próximo nível começa aqui.'}
          </h1>

          <p className="text-sm sm:text-base text-[#A7AFBF] leading-relaxed">
            Conteúdo executivo de alta densidade, frameworks práticos, ferramentas e comunidade com os maiores operadores do mercado.
          </p>

          {/* Key Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            {loginConfig.brandHighlights.map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-[#1D2230]/80">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-white leading-snug">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-[#A7AFBF]/70 font-mono pt-4 border-t border-[#1D2230]/40">
          <span>© {new Date().getFullYear()} FORMAÇÃO VIP PRO. TODOS OS DIREITOS RESERVADOS.</span>
          <span className="hidden sm:inline">PLATAFORMA PRIVADA & SEGURA</span>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN PANEL (35% on Desktop) */}
      <div className="w-full lg:w-[35%] flex flex-col justify-center p-6 sm:p-10 lg:p-12 bg-[#0D0F12] border-t lg:border-t-0 lg:border-l border-[#1D2230] z-20">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-bold font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              ACESSO RESTRITO
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {loginConfig.formTitle || 'Entrar na Área VIP'}
            </h2>
            <p className="text-xs text-[#A7AFBF]">
              {loginConfig.formSubtitle || 'Utilize sua conta para continuar.'}
            </p>
          </div>

          {/* Quick Demo Login Presets */}
          <div className="p-3.5 rounded-2xl bg-[#151922] border border-[#1D2230] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold font-mono text-[#D4AF37]">
              <span>ACESSO RÁPIDO PARA AVALIAÇÃO:</span>
              <Sparkles className="w-3 h-3" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="py-2 px-2.5 rounded-xl bg-[#0D0F12] hover:bg-[#D4AF37] text-white hover:text-black border border-[#1D2230] hover:border-transparent text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Aluno VIP</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-2 px-2.5 rounded-xl bg-[#0D0F12] hover:bg-[#D4AF37] text-white hover:text-black border border-[#1D2230] hover:border-transparent text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Admin Master</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A7AFBF]">E-mail de Acesso</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7AFBF]" />
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white placeholder-[#A7AFBF]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#A7AFBF]">Senha</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-[#D4AF37] hover:underline font-medium"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7AFBF]" />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white placeholder-[#A7AFBF]/40 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7AFBF] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              id="btn-submit-login"
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:from-[#F5D76E] hover:to-[#D4AF37] text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-gold-glow transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <span>AUTENTICANDO...</span>
              ) : (
                <>
                  <span>{loginConfig.buttonText || 'ENTRAR NA ÁREA VIP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0D0F12] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#151922] text-[#A7AFBF] hover:text-white border border-[#1D2230]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Recuperação de Acesso</h3>
              <p className="text-xs text-[#A7AFBF]">
                Informe o seu e-mail cadastrado para enviarmos as instruções de redefinição de senha.
              </p>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Link de redefinição enviado com sucesso! Verifique sua caixa de entrada.
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full h-11 px-4 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black font-bold text-xs"
                >
                  Enviar Instruções
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
