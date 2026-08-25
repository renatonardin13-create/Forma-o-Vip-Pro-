import React, { useState } from 'react';
import { 
  Copy, 
  Download, 
  Globe, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  RefreshCw,
  Code,
  Smartphone,
  Monitor,
  Zap,
  Play
} from 'lucide-react';

interface ClonedSite {
  id: string;
  name: string;
  originalUrl: string;
  subdomain: string;
  checkoutUrl: string;
  pixelId: string;
  views: number;
  conversions: number;
  status: 'published' | 'draft';
}

export const SiteClonerBuilder: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState('');
  const [siteName, setSiteName] = useState('');
  const [newCheckoutUrl, setNewCheckoutUrl] = useState('https://chk.perfectpay.com.br/pay/PPA129380');
  const [facebookPixel, setFacebookPixel] = useState('89234891238491');
  const [whatsappNumber, setWhatsappNumber] = useState('5511999998888');
  const [isCloning, setIsCloning] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [successToast, setSuccessToast] = useState(false);

  const [clonedSites, setClonedSites] = useState<ClonedSite[]>([
    {
      id: 'site_1',
      name: 'Página de Vendas VSL Principal (Black Edition)',
      originalUrl: 'https://metodovip.com.br/vsl-oficial',
      subdomain: 'oferta.formacaovip.pro',
      checkoutUrl: 'https://chk.perfectpay.com.br/pay/PPA129380',
      pixelId: '89234891238491',
      views: 14820,
      conversions: 492,
      status: 'published'
    },
    {
      id: 'site_2',
      name: 'Página de Captura - Minicurso Gratuito',
      originalUrl: 'https://lp-amostra.com/captura',
      subdomain: 'aula-gratis.formacaovip.pro',
      checkoutUrl: '',
      pixelId: '89234891238491',
      views: 8940,
      conversions: 3210,
      status: 'published'
    }
  ]);

  const handleStartClone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;

    setIsCloning(true);
    setTimeout(() => {
      const newSite: ClonedSite = {
        id: 'site_' + Date.now(),
        name: siteName || 'Página Clonada de ' + new URL(targetUrl.startsWith('http') ? targetUrl : 'https://' + targetUrl).hostname,
        originalUrl: targetUrl,
        subdomain: `vsl-${Math.floor(Math.random() * 899 + 100)}.formacaovip.pro`,
        checkoutUrl: newCheckoutUrl,
        pixelId: facebookPixel,
        views: 0,
        conversions: 0,
        status: 'published'
      };

      setClonedSites(prev => [newSite, ...prev]);
      setIsCloning(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
      setTargetUrl('');
      setSiteName('');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E5A83B]/10 border border-[#E5A83B]/30 flex items-center justify-center">
            <Copy className="w-6 h-6 text-[#E5A83B]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Criador & Clonador de Páginas de Alta Conversão</h2>
            <p className="text-xs text-[#8E9BB0]">
              Clone qualquer página de vendas ou VSL em segundos, troque o checkout da Perfect Pay, Pixel e publique em seu domínio.
            </p>
          </div>
        </div>
      </div>

      {successToast && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Página clonada com sucesso e publicada! Todos os botões foram redirecionados para seu checkout da Perfect Pay.</span>
        </div>
      )}

      {/* Main Cloning Form & Live Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E5A83B]" />
            <span>Clonar Nova Página</span>
          </h3>

          <form onSubmit={handleStartClone} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">
                URL da Página de Destino (Ex: VSL ou Landing Page)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="https://exemplo.com/pagina-de-vendas"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white placeholder-[#8E9BB0]/50 focus:border-[#E5A83B] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">
                Nome de Identificação Interna
              </label>
              <input
                type="text"
                placeholder="Ex: Oferta Black Friday - VSL 01"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white placeholder-[#8E9BB0]/50 focus:border-[#E5A83B] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">
                Seu Link de Checkout (Perfect Pay)
              </label>
              <input
                type="url"
                required
                value={newCheckoutUrl}
                onChange={(e) => setNewCheckoutUrl(e.target.value)}
                placeholder="https://chk.perfectpay.com.br/pay/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-[#E5A83B] font-mono focus:border-[#E5A83B] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8E9BB0] uppercase font-mono">Pixel do Facebook</label>
                <input
                  type="text"
                  value={facebookPixel}
                  onChange={(e) => setFacebookPixel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#8E9BB0] uppercase font-mono">WhatsApp Flutuante</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCloning || !targetUrl}
              className="w-full py-3 rounded-xl bg-[#E5A83B] hover:bg-[#D4AF37] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E5A83B]/20 transition disabled:opacity-50"
            >
              {isCloning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Baixando assets, imagens e substituindo checkout...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Clonar & Publicar Página Agora</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Cloned Pages & Live Preview Tab */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#E5A83B]" />
                <span>Páginas Ativas & Clonadas ({clonedSites.length})</span>
              </h3>

              <div className="flex items-center gap-1 bg-[#151922] p-1 rounded-xl border border-[#1D2230]">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition ${previewDevice === 'desktop' ? 'bg-[#E5A83B] text-black' : 'text-[#8E9BB0]'}`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs transition ${previewDevice === 'mobile' ? 'bg-[#E5A83B] text-black' : 'text-[#8E9BB0]'}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {clonedSites.map((site) => (
                <div
                  key={site.id}
                  className="p-4 rounded-2xl bg-[#08090C] border border-[#1D2230] hover:border-[#E5A83B]/40 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{site.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                          ONLINE
                        </span>
                      </div>
                      <p className="text-xs text-[#E5A83B] font-mono mt-0.5 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" />
                        <span>https://{site.subdomain}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right px-3 py-1 bg-[#151922] rounded-xl border border-[#1D2230]">
                        <span className="text-[9px] text-[#8E9BB0] uppercase block">Visitas</span>
                        <span className="text-xs font-bold text-white">{site.views.toLocaleString()}</span>
                      </div>
                      <div className="text-right px-3 py-1 bg-[#151922] rounded-xl border border-[#1D2230]">
                        <span className="text-[9px] text-[#8E9BB0] uppercase block">Vendas</span>
                        <span className="text-xs font-bold text-emerald-400">{site.conversions.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1D2230] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[10px] text-[#8E9BB0] truncate max-w-xs font-mono">
                      Checkout: {site.checkoutUrl || 'Formulário de captura direto'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://${site.subdomain}`);
                          setSuccessToast(true);
                          setTimeout(() => setSuccessToast(false), 2000);
                        }}
                        className="px-3 py-1 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-[#8E9BB0] hover:text-white font-bold text-xs flex items-center gap-1 border border-[#1D2230]"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Link</span>
                      </button>
                      <a
                        href={`https://${site.subdomain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-xl bg-[#E5A83B] text-black font-bold text-xs flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir Página</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
