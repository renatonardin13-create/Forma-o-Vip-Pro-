import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Save, 
  RefreshCw, 
  Check, 
  Image as ImageIcon, 
  Globe, 
  Layout, 
  ShieldCheck, 
  CheckCircle2,
  ExternalLink,
  Eye,
  Type,
  Layers,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useStore } from '../services/store';
import { BrandingConfig } from '../types';

export const BrandingCustomizer: React.FC = () => {
  const { branding, updateBranding, resetBranding } = useStore();

  const [form, setForm] = useState<BrandingConfig>({ ...branding });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activePreview, setActivePreview] = useState<'sidebar' | 'login' | 'browser'>('sidebar');

  // Presets for quick selection
  const LOGO_PRESETS = [
    {
      name: 'Coroa Dourada VIP (Padrão)',
      logoUrl: '',
      logoType: 'combined' as const,
      brandName: 'FORMAÇÃO',
      brandBadge: 'VIP PRO',
      brandSubtext: 'EXCLUSIVE MEMBERSHIP',
      faviconUrl: 'https://cdn-icons-png.flaticon.com/512/2618/2618488.png',
      pageTitle: 'Formação VIP PRO | Área de Membros Premium'
    },
    {
      name: 'Black & Gold Elite',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      logoType: 'image' as const,
      brandName: 'ELITE ACADEMY',
      brandBadge: 'BLACK',
      brandSubtext: 'HIGH PERFORMANCE',
      faviconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
      pageTitle: 'Elite Academy | Black Membership'
    },
    {
      name: 'Mentoria High-Ticket',
      logoUrl: '',
      logoType: 'text' as const,
      brandName: 'MENTORIA',
      brandBadge: 'MASTER',
      brandSubtext: 'BUSINESS & TECH',
      faviconUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      pageTitle: 'Mentoria Master | Conteúdo Executivo'
    },
    {
      name: 'Diamond Club Pro',
      logoUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=200&q=80',
      logoType: 'combined' as const,
      brandName: 'DIAMOND',
      brandBadge: 'CLUB',
      brandSubtext: 'VIP NETWORK & MENTORSHIP',
      faviconUrl: 'https://cdn-icons-png.flaticon.com/512/2040/2040504.png',
      pageTitle: 'Diamond Club | Portal de Aulas'
    }
  ];

  const FAVICON_PRESETS = [
    { name: 'Coroa Real Ouro', url: 'https://cdn-icons-png.flaticon.com/512/2618/2618488.png' },
    { name: 'Estrela Dourada VIP', url: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' },
    { name: 'Diamante Luxo', url: 'https://cdn-icons-png.flaticon.com/512/2040/2040504.png' },
    { name: 'Troféu Ouro', url: 'https://cdn-icons-png.flaticon.com/512/3112/3112946.png' },
    { name: 'Escudo Segurança VIP', url: 'https://cdn-icons-png.flaticon.com/512/1063/1063376.png' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Deseja restaurar as configurações padrão de Logo e Favicon da Formação VIP PRO?')) {
      resetBranding();
      setForm({ ...branding });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const applyPreset = (preset: typeof LOGO_PRESETS[0]) => {
    setForm(prev => ({
      ...prev,
      logoUrl: preset.logoUrl,
      logoType: preset.logoType,
      brandName: preset.brandName,
      brandBadge: preset.brandBadge,
      brandSubtext: preset.brandSubtext,
      faviconUrl: preset.faviconUrl,
      pageTitle: preset.pageTitle
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#151922] via-[#151922]/90 to-[#0D0F12] border border-[#D4AF37]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Crown className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-white tracking-wide">
              PERSONALIZAÇÃO DE LOGO & FAVICON
            </h2>
          </div>
          <p className="text-xs text-[#A7AFBF]">
            Defina a identidade visual, logotipo customizado, favicon do navegador e título da sua plataforma com aplicação instantânea.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-[#08090C] hover:bg-[#151922] text-[#A7AFBF] hover:text-white border border-[#1D2230] text-xs font-bold transition flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:from-[#F5D76E] hover:to-[#D4AF37] text-black text-xs font-black tracking-wider uppercase transition flex items-center gap-2 shadow-gold-glow"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Configurações de Logo, Favicon e Título aplicadas com sucesso em todo o sistema!</span>
        </div>
      )}

      {/* Quick Presets Carousel */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-[#A7AFBF] uppercase font-mono tracking-wider">
          PRESETS PRONTOS PARA USO
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {LOGO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="p-3.5 rounded-2xl bg-[#151922] border border-[#1D2230] hover:border-[#D4AF37]/60 text-left transition space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition">
                  {preset.name}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#A7AFBF] font-mono">
                <span>{preset.brandName}</span>
                <span className="px-1 py-0.2 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold">
                  {preset.brandBadge}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Main Config + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Settings (7 Cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          {/* Box 1: Logo Settings */}
          <div className="p-6 rounded-3xl bg-[#151922] border border-[#1D2230] space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1D2230]">
              <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <h3 className="text-sm font-bold text-white">Configurações do Logotipo</h3>
                <p className="text-[11px] text-[#A7AFBF]">Escolha como a logo será exibida no sidebar e na tela de login</p>
              </div>
            </div>

            {/* Logo Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#A7AFBF] font-mono uppercase">Tipo de Exibição da Logo</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'combined', label: 'Ícone + Texto + Badge', icon: Layers },
                  { id: 'image', label: 'Imagem Exclusiva (URL)', icon: ImageIcon },
                  { id: 'text', label: 'Somente Texto & Badge', icon: Type }
                ].map(t => {
                  const Icon = t.icon;
                  const isSelected = form.logoType === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, logoType: t.id as any }))}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-[#08090C] border-[#D4AF37] text-[#D4AF37] shadow-sm' 
                          : 'bg-[#0D0F12] border-[#1D2230] text-[#A7AFBF] hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] font-bold leading-tight">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logo Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A7AFBF] flex items-center justify-between">
                <span>URL da Imagem da Logo (PNG, SVG ou WebP transparente)</span>
                <span className="text-[10px] font-mono text-[#D4AF37]">Opcional</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://exemplo.com/minha-logo.png"
                  value={form.logoUrl || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                  className="flex-1 h-11 px-3.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white placeholder:text-[#A7AFBF]/40 focus:outline-none focus:border-[#D4AF37]"
                />
                {form.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, logoUrl: '' }))}
                    className="px-3 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-[#A7AFBF] hover:text-rose-400 text-xs font-bold"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {/* Brand Typography Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A7AFBF]">Nome Principal da Marca</label>
                <input
                  type="text"
                  placeholder="FORMAÇÃO"
                  value={form.brandName}
                  onChange={(e) => setForm(prev => ({ ...prev, brandName: e.target.value }))}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A7AFBF]">Badge Dourada (Destaque)</label>
                <input
                  type="text"
                  placeholder="VIP PRO"
                  value={form.brandBadge}
                  onChange={(e) => setForm(prev => ({ ...prev, brandBadge: e.target.value }))}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A7AFBF]">Subtexto / Slogan da Marca</label>
              <input
                type="text"
                placeholder="EXCLUSIVE MEMBERSHIP"
                value={form.brandSubtext}
                onChange={(e) => setForm(prev => ({ ...prev, brandSubtext: e.target.value }))}
                className="w-full h-11 px-3.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Box 2: Favicon & Browser Title */}
          <div className="p-6 rounded-3xl bg-[#151922] border border-[#1D2230] space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1D2230]">
              <Globe className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <h3 className="text-sm font-bold text-white">Favicon & Título da Aba</h3>
                <p className="text-[11px] text-[#A7AFBF]">Configure o ícone e o nome que aparecem na aba do navegador do aluno</p>
              </div>
            </div>

            {/* Favicon URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A7AFBF]">URL do Favicon (.png, .ico, .svg)</label>
              <div className="flex gap-2">
                <div className="w-11 h-11 rounded-xl bg-[#08090C] border border-[#1D2230] flex items-center justify-center flex-shrink-0 p-1.5">
                  {form.faviconUrl ? (
                    <img src={form.faviconUrl} alt="Favicon" className="w-full h-full object-contain" />
                  ) : (
                    <Crown className="w-5 h-5 text-[#D4AF37]" />
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://exemplo.com/favicon.png"
                  value={form.faviconUrl || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, faviconUrl: e.target.value }))}
                  className="flex-1 h-11 px-3.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white placeholder:text-[#A7AFBF]/40 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Favicon Preset selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-[#A7AFBF]">Galeria de Ícones para Favicon</label>
              <div className="flex flex-wrap gap-2">
                {FAVICON_PRESETS.map((fav, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, faviconUrl: fav.url }))}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition ${
                      form.faviconUrl === fav.url
                        ? 'bg-[#08090C] border-[#D4AF37] text-[#D4AF37]'
                        : 'bg-[#0D0F12] border-[#1D2230] text-[#A7AFBF] hover:text-white'
                    }`}
                  >
                    <img src={fav.url} alt={fav.name} className="w-4 h-4 object-contain" />
                    <span className="text-[11px] font-medium">{fav.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Browser Page Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A7AFBF]">Título da Página (&lt;title&gt; no Navegador)</label>
              <input
                type="text"
                placeholder="Formação VIP PRO | Área de Membros Premium"
                value={form.pageTitle}
                onChange={(e) => setForm(prev => ({ ...prev, pageTitle: e.target.value }))}
                className="w-full h-11 px-3.5 rounded-xl bg-[#0D0F12] border border-[#1D2230] text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </form>

        {/* Right Column: Live Interactive Previews (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A7AFBF] uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              PRÉ-VISUALIZAÇÃO EM TEMPO REAL
            </span>

            <div className="flex items-center gap-1 bg-[#151922] p-1 rounded-xl border border-[#1D2230]">
              <button
                type="button"
                onClick={() => setActivePreview('sidebar')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                  activePreview === 'sidebar' ? 'bg-[#D4AF37] text-black' : 'text-[#A7AFBF] hover:text-white'
                }`}
              >
                Sidebar
              </button>
              <button
                type="button"
                onClick={() => setActivePreview('login')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                  activePreview === 'login' ? 'bg-[#D4AF37] text-black' : 'text-[#A7AFBF] hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setActivePreview('browser')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                  activePreview === 'browser' ? 'bg-[#D4AF37] text-black' : 'text-[#A7AFBF] hover:text-white'
                }`}
              >
                Aba Web
              </button>
            </div>
          </div>

          {/* PREVIEW 1: SIDEBAR SIMULATION */}
          {activePreview === 'sidebar' && (
            <div className="p-4 rounded-3xl bg-[#0D0F12] border border-[#D4AF37]/40 space-y-4 shadow-xl">
              <div className="text-[10px] font-mono text-[#A7AFBF] pb-1 border-b border-[#1D2230] flex items-center justify-between">
                <span>SIMULAÇÃO: CABEÇALHO DO MENU LATERAL</span>
                <span className="text-[#D4AF37] font-bold">100% RESPONSIVO</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#08090C] border border-[#1D2230] flex items-center gap-3">
                {form.logoUrl ? (
                  <img
                    src={form.logoUrl}
                    alt={form.brandName}
                    className="max-h-11 max-w-[150px] object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#AA820A] to-[#6A5005] p-0.5 flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 flex-shrink-0">
                    <div className="w-full h-full bg-[#08090C] rounded-[10px] flex items-center justify-center">
                      <Crown className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                  </div>
                )}

                {form.logoType !== 'image' && (
                  <div className="min-w-0 flex-1 truncate">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-sm tracking-wider text-white truncate">
                        {form.brandName || 'FORMAÇÃO'}
                      </span>
                      {form.brandBadge && (
                        <span className="font-black text-[10px] px-1.5 py-0.5 rounded bg-[#D4AF37] text-black tracking-widest font-mono font-bold whitespace-nowrap">
                          {form.brandBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-[#A7AFBF] tracking-widest font-mono mt-0.5 truncate">
                      {form.brandSubtext || 'EXCLUSIVE MEMBERSHIP'}
                    </p>
                  </div>
                )}
              </div>

              {/* Sample Nav items */}
              <div className="space-y-1 opacity-60">
                <div className="p-2.5 rounded-xl bg-[#151922] text-xs font-bold text-[#D4AF37] flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  <span>DASHBOARD PRINCIPAL</span>
                </div>
                <div className="p-2.5 rounded-xl text-xs font-medium text-[#A7AFBF] flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  <span>MEUS CURSOS & AULAS</span>
                </div>
              </div>
            </div>
          )}

          {/* PREVIEW 2: LOGIN SCREEN SIMULATION */}
          {activePreview === 'login' && (
            <div className="p-4 rounded-3xl bg-[#0D0F12] border border-[#D4AF37]/40 space-y-4 shadow-xl">
              <div className="text-[10px] font-mono text-[#A7AFBF] pb-1 border-b border-[#1D2230] flex items-center justify-between">
                <span>SIMULAÇÃO: TELA DE LOGIN</span>
                <span className="text-[#D4AF37] font-bold">HERO SECTION</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#08090C] border border-[#1D2230] space-y-4">
                <div className="flex items-center gap-3">
                  {form.logoUrl ? (
                    <img
                      src={form.logoUrl}
                      alt={form.brandName}
                      className="max-h-12 max-w-[180px] object-contain rounded-xl shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#AA820A] to-[#6A5005] p-0.5 flex items-center justify-center shadow-gold-glow">
                      <div className="w-full h-full bg-[#08090C] rounded-[14px] flex items-center justify-center">
                        <Crown className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                    </div>
                  )}

                  {form.logoType !== 'image' && (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base tracking-wider text-white">
                          {form.brandName || 'FORMAÇÃO'}
                        </span>
                        {form.brandBadge && (
                          <span className="font-black text-xs px-2 py-0.5 rounded bg-[#D4AF37] text-black tracking-widest font-mono font-bold">
                            {form.brandBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#A7AFBF] tracking-widest font-mono mt-0.5">
                        {form.brandSubtext || 'EXCLUSIVE MEMBERSHIP AREA'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#151922] text-xs text-white border border-[#1D2230]">
                  <p className="text-[11px] text-[#D4AF37] font-bold mb-1">Área Restrita para Membros</p>
                  <p className="text-[10px] text-[#A7AFBF]">Acesse suas aulas exclusivas, materiais e comunidade VIP.</p>
                </div>
              </div>
            </div>
          )}

          {/* PREVIEW 3: BROWSER TAB SIMULATION */}
          {activePreview === 'browser' && (
            <div className="p-4 rounded-3xl bg-[#0D0F12] border border-[#D4AF37]/40 space-y-4 shadow-xl">
              <div className="text-[10px] font-mono text-[#A7AFBF] pb-1 border-b border-[#1D2230] flex items-center justify-between">
                <span>SIMULAÇÃO: ABA DO NAVEGADOR (CHROME / SAFARI)</span>
                <span className="text-[#D4AF37] font-bold">FAVICON + TITLE</span>
              </div>

              {/* Fake Browser Window Top Bar */}
              <div className="rounded-2xl bg-[#151922] border border-[#1D2230] overflow-hidden">
                {/* Browser controls bar */}
                <div className="px-3 py-2 bg-[#08090C] flex items-center gap-2 border-b border-[#1D2230]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>

                  {/* Browser Tab */}
                  <div className="flex-1 max-w-[280px] bg-[#151922] px-3 py-1.5 rounded-t-xl border-t border-x border-[#1D2230] flex items-center gap-2">
                    <img
                      src={form.faviconUrl || 'https://cdn-icons-png.flaticon.com/512/2618/2618488.png'}
                      alt="Favicon"
                      className="w-4 h-4 object-contain flex-shrink-0"
                    />
                    <span className="text-xs font-semibold text-white truncate">
                      {form.pageTitle || 'Formação VIP PRO | Área de Membros'}
                    </span>
                  </div>
                </div>

                {/* URL bar */}
                <div className="p-2.5 bg-[#0D0F12] flex items-center gap-2 text-[11px] text-[#A7AFBF] font-mono">
                  <div className="flex-1 bg-[#151922] px-3 py-1 rounded-lg border border-[#1D2230] flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-white font-sans">https://</span>
                    <span className="text-[#D4AF37]">membros.{form.brandName.toLowerCase().replace(/\s+/g, '')}.com.br</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Tip Box */}
          <div className="p-4 rounded-2xl bg-[#151922] border border-[#1D2230] space-y-2 text-xs text-[#A7AFBF]">
            <div className="flex items-center gap-2 text-white font-bold">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Dica de Especialista VIP</span>
            </div>
            <p>
              Ao salvar, a Logo é aplicada automaticamente em todos os componentes da plataforma (Sidebar, Header Mobile, Login e Dashboard), e o Favicon é injetado diretamente na aba do navegador do usuário.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
