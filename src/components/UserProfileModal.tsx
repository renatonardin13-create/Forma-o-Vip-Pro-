import React, { useState } from 'react';
import { X, User, Crown, Save, Check, Mail, ShieldCheck, Sparkles, BookOpen, Clock, Award } from 'lucide-react';
import { useStore } from '../services/store';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { currentUser, updateProfile } = useStore();
  const [name, setName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, avatar });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#0D0F12] border border-[#1D2230] hover:border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl transition">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#151922] text-[#A7AFBF] hover:text-white border border-[#1D2230]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-[#1D2230]">
          <div className="w-10 h-10 rounded-xl bg-[#151922] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Meu Perfil VIP</h3>
            <p className="text-xs text-[#A7AFBF]">{currentUser?.plan || 'MEMBRO PREMIUM'}</p>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#151922] border border-[#1D2230] text-center">
          <div>
            <p className="text-[10px] text-[#A7AFBF] uppercase font-mono">Cursos</p>
            <p className="text-sm font-extrabold text-white">{currentUser?.stats.activeCourses || 4}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#A7AFBF] uppercase font-mono">Aulas</p>
            <p className="text-sm font-extrabold text-white">{currentUser?.stats.completedLessons || 48}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#A7AFBF] uppercase font-mono">Certificados</p>
            <p className="text-sm font-extrabold text-[#D4AF37]">{currentUser?.stats.certificatesCount || 5}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#A7AFBF]">Foto de Perfil</label>
            <div className="flex items-center gap-3">
              <img src={avatar} alt="Avatar" className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37]" />
              <div className="flex-1 space-y-1">
                <p className="text-[11px] text-[#A7AFBF]">Escolha um avatar executivo ou insira uma URL:</p>
                <div className="flex items-center gap-2">
                  {sampleAvatars.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Avatar option"
                      onClick={() => setAvatar(url)}
                      className={`w-8 h-8 rounded-lg object-cover cursor-pointer border transition ${
                        avatar === url ? 'border-[#D4AF37] scale-110' : 'border-[#1D2230] opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full h-9 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white placeholder-[#A7AFBF]/40 focus:outline-none focus:border-[#D4AF37] mt-1"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A7AFBF]">Nome Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#151922] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#A7AFBF]">E-mail Registrado</label>
            <input
              type="email"
              disabled
              value={currentUser?.email || ''}
              className="w-full h-10 px-3 rounded-xl bg-[#151922]/50 border border-[#1D2230] text-xs text-[#A7AFBF] cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#151922] text-xs text-[#A7AFBF] hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#F5D76E] text-black font-bold text-xs flex items-center gap-1.5 shadow-gold-glow transition"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Salvo!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
