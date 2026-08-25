import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../services/store';

export const FirstLoginPasswordModal: React.FC = () => {
  const { currentUser, completeFirstAccessPasswordChange } = useStore();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser?.precisa_trocar_senha) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 8) {
      setErrorMsg('A nova senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      completeFirstAccessPasswordChange(newPassword);
      setSuccess(true);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D0F12] border border-[#E5A83B]/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E5A83B]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#E5A83B]/10 border border-[#E5A83B]/30 text-[#E5A83B] flex items-center justify-center mx-auto shadow-lg shadow-[#E5A83B]/10">
            <KeyRound className="w-7 h-7" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-[#E5A83B]/10 border border-[#E5A83B]/30 text-[#E5A83B] text-[10px] font-extrabold uppercase tracking-wider font-mono">
            Primeiro Acesso Seguro
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Defina sua Senha Definitiva
          </h2>
          <p className="text-xs text-[#8E9BB0] leading-relaxed">
            Olá, <strong className="text-white">{currentUser.name}</strong>! Como você acabou de entrar com uma senha provisória, crie sua senha pessoal definitiva para proteger o seu acesso à área VIP.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {success ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
            <p className="text-sm font-bold text-white">Senha alterada com sucesso!</p>
            <p className="text-[11px] text-[#8E9BB0]">Liberando o seu dashboard agora...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-[#8E9BB0] font-mono">
                Nova Senha (Mínimo 8 caracteres)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#08090C] border border-[#1D2230] text-sm text-white focus:outline-none focus:border-[#E5A83B] pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E9BB0] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-[#8E9BB0] font-mono">
                Confirme a Nova Senha
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#08090C] border border-[#1D2230] text-sm text-white focus:outline-none focus:border-[#E5A83B] font-mono"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#151922] border border-[#1D2230] text-[11px] text-[#8E9BB0] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E5A83B] flex-shrink-0 mt-0.5" />
              <span>Sua nova senha será criptografada e sincronizada instantaneamente com o Supabase Auth.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#E5A83B] hover:bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#E5A83B]/20 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Salvando e liberando...</span>
              ) : (
                <>
                  <span>Definir Senha e Entrar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
