import React, { useState } from 'react';
import { 
  Video, 
  Upload, 
  Play, 
  ShieldCheck, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Settings, 
  Film,
  HardDrive,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface HostedVideo {
  id: string;
  title: string;
  duration: string;
  resolution: string;
  size: string;
  provider: 'PandaVideo' | 'BunnyCDN' | 'YouTube Privado' | 'Vimeo' | 'HLS Seguro';
  embedUrl: string;
  hasWatermark: boolean;
  views: number;
  thumbnailUrl: string;
}

export const VideoHostingManager: React.FC = () => {
  const [hostedVideos, setHostedVideos] = useState<HostedVideo[]>([
    {
      id: 'vid_01',
      title: 'Aula Magna: Os 5 Pilares da Escala no Digital 2026',
      duration: '42:15',
      resolution: '4K Ultra HD (60fps)',
      size: '1.2 GB',
      provider: 'PandaVideo',
      embedUrl: 'https://player-panda.com/embed/v82910398',
      hasWatermark: true,
      views: 3820,
      thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'vid_02',
      title: 'Módulo 02 - Aula 01: Estrutura de Tráfego Direto & Métricas',
      duration: '28:40',
      resolution: '1080p Full HD',
      size: '720 MB',
      provider: 'BunnyCDN',
      embedUrl: 'https://iframe.mediadelivery.net/embed/192381/vid_882190',
      hasWatermark: true,
      views: 2410,
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'vid_03',
      title: 'Workshop Ao Vivo: Gravação de VSL de Alto Impacto',
      duration: '1:15:30',
      resolution: '1080p Full HD',
      size: '2.4 GB',
      provider: 'HLS Seguro',
      embedUrl: 'https://stream.formacaovip.pro/hls/live_ws_01/index.m3u8',
      hasWatermark: true,
      views: 1290,
      thumbnailUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'PandaVideo' | 'BunnyCDN' | 'YouTube Privado' | 'Vimeo' | 'HLS Seguro'>('PandaVideo');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<HostedVideo | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle) return;

    setIsUploading(true);
    setTimeout(() => {
      const newVid: HostedVideo = {
        id: 'vid_' + Date.now(),
        title: newVideoTitle,
        duration: '18:45',
        resolution: '1080p Full HD',
        size: '480 MB',
        provider: selectedProvider,
        embedUrl: newVideoUrl || 'https://player-panda.com/embed/demo_' + Date.now(),
        hasWatermark: true,
        views: 0,
        thumbnailUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=600&q=80'
      };

      setHostedVideos(prev => [newVid, ...prev]);
      setIsUploading(false);
      setNewVideoTitle('');
      setNewVideoUrl('');
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E5A83B]/10 border border-[#E5A83B]/30 flex items-center justify-center">
            <Video className="w-6 h-6 text-[#E5A83B]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Central de Hospedagem Segura de Vídeos</h2>
            <p className="text-xs text-[#8E9BB0]">
              Hospede suas aulas com proteção contra pirataria, marca d'água dinâmica com CPF do aluno e carregamento ultrarrápido.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#151922] border border-[#1D2230] text-center">
            <span className="text-[10px] text-[#8E9BB0] font-mono block">Vídeos Ativos</span>
            <span className="text-xs font-black text-white">{hostedVideos.length}</span>
          </div>
        </div>
      </div>

      {successToast && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Vídeo processado e hospedado com sucesso com proteção DRM anti-pirataria ativa!</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#E5A83B]" />
            <span>Hospedar Novo Vídeo</span>
          </h3>

          <form onSubmit={handleAddVideo} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">Título da Videoaula</label>
              <input
                type="text"
                required
                placeholder="Ex: Aula 03 - Configuração de Domínio e DNS"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white placeholder-[#8E9BB0]/50 focus:border-[#E5A83B] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">Provedor de Streaming</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white focus:border-[#E5A83B] focus:outline-none"
              >
                <option value="PandaVideo">PandaVideo (Anti-Pirataria + DRM)</option>
                <option value="BunnyCDN">BunnyCDN Stream</option>
                <option value="HLS Seguro">HLS Próprio (Cloudflare)</option>
                <option value="YouTube Privado">YouTube (Não Listado)</option>
                <option value="Vimeo">Vimeo PRO</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#8E9BB0] uppercase font-mono">URL do Vídeo / Iframe Embed</label>
              <input
                type="text"
                placeholder="https://player.pandavideo.com.br/embed/..."
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-[#1D2230] text-xs text-white placeholder-[#8E9BB0]/50 focus:border-[#E5A83B] focus:outline-none font-mono"
              />
            </div>

            <div className="p-3 rounded-2xl bg-[#08090C] border border-[#1D2230] space-y-2">
              <span className="text-[10px] font-bold text-[#E5A83B] uppercase font-mono block">Segurança Automática:</span>
              <div className="space-y-1 text-[11px] text-[#8E9BB0]">
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Marca d'água flutuante com CPF do aluno na tela</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Bloqueio contra gravação de tela e downloads</span>
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-3 rounded-xl bg-[#E5A83B] hover:bg-[#D4AF37] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E5A83B]/20 transition disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Codificando e gerando HLS...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Adicionar à Grade de Aulas</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Video List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-[#0D0F12] border border-[#1D2230] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Film className="w-4 h-4 text-[#E5A83B]" />
              <span>Vídeos Hospedados & Otimizados</span>
            </h3>

            <div className="space-y-3">
              {hostedVideos.map((video) => (
                <div
                  key={video.id}
                  className="p-4 rounded-2xl bg-[#08090C] border border-[#1D2230] hover:border-[#E5A83B]/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-[#151922] border border-[#1D2230] overflow-hidden flex-shrink-0 relative group">
                      <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{video.title}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-[#151922] text-[#E5A83B] text-[9px] font-mono font-bold">
                          {video.provider}
                        </span>
                        <span className="text-[10px] text-[#8E9BB0] font-mono">{video.duration}</span>
                        <span className="text-[10px] text-[#8E9BB0] font-mono">{video.resolution}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">🛡️ DRM Ativo</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(video.embedUrl);
                        setCopiedId(video.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#151922] hover:bg-[#1D2230] text-xs font-bold text-white border border-[#1D2230] flex items-center gap-1.5 transition"
                    >
                      {copiedId === video.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === video.id ? 'Copiado!' : 'Copiar Embed'}</span>
                    </button>
                    <button
                      onClick={() => setPreviewVideo(video)}
                      className="px-3 py-1.5 rounded-xl bg-[#E5A83B] text-black font-bold text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Testar Player</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0D0F12] border border-[#1D2230] rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1D2230] pb-3">
              <h4 className="text-sm font-bold text-white truncate">{previewVideo.title}</h4>
              <button
                onClick={() => setPreviewVideo(null)}
                className="text-[#8E9BB0] hover:text-white text-xs font-bold font-mono"
              >
                FECHAR ✕
              </button>
            </div>

            {/* Video Container with Watermark simulation */}
            <div className="relative aspect-video rounded-2xl bg-black overflow-hidden border border-[#1D2230] flex items-center justify-center">
              <img src={previewVideo.thumbnailUrl} alt="" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#E5A83B] flex items-center justify-center shadow-xl shadow-[#E5A83B]/30 cursor-pointer">
                  <Play className="w-7 h-7 text-black fill-black ml-1" />
                </div>
              </div>

              {/* Dynamic Watermark Stamp */}
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-white/50 font-mono pointer-events-none">
                aluno.vip@exemplo.com.br • CPF: 092.***.***-11
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#8E9BB0] pt-2">
              <span>Provedor: <strong className="text-white">{previewVideo.provider}</strong></span>
              <button
                onClick={() => setPreviewVideo(null)}
                className="px-4 py-2 rounded-xl bg-[#E5A83B] text-black font-bold text-xs"
              >
                Concluir Teste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
