import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, AlertCircle, Trash2, RefreshCw, Link as LinkIcon } from 'lucide-react';

interface BannerImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  recommendedSize?: string;
  maxSizeMB?: number;
}

export const BannerImageUploader: React.FC<BannerImageUploaderProps> = ({
  label,
  value,
  onChange,
  recommendedSize = '1920 × 700 px',
  maxSizeMB = 10
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>(value && value.startsWith('http') ? 'url' : 'upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<{ originalSize: string; optimizedSize: string; format: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setError('Formato inválido. Aceito apenas JPG, PNG ou WEBP.');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Arquivo muito grande. O limite máximo é ${maxSizeMB} MB.`);
      return;
    }

    const originalSizeKb = (file.size / 1024).toFixed(1);
    const originalSizeFormatted = Number(originalSizeKb) > 1024 
      ? `${(Number(originalSizeKb) / 1024).toFixed(1)} MB` 
      : `${originalSizeKb} KB`;

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimension clamp for high performance
        const maxDim = 1920;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          setError('Erro ao processar imagem no navegador.');
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP or JPEG with optimization quality 0.82
        const outputFormat = 'image/webp';
        canvas.toBlob((blob) => {
          if (!blob) {
            setIsProcessing(false);
            setError('Falha na compressão da imagem.');
            return;
          }

          const optimizedSizeKb = (blob.size / 1024).toFixed(1);
          const optimizedSizeFormatted = Number(optimizedSizeKb) > 1024
            ? `${(Number(optimizedSizeKb) / 1024).toFixed(1)} MB`
            : `${optimizedSizeKb} KB`;

          // Create object URL (Supabase storage mock URL or Object URL)
          const optimizedUrl = URL.createObjectURL(blob);

          setStats({
            originalSize: originalSizeFormatted,
            optimizedSize: optimizedSizeFormatted,
            format: 'WEBP'
          });

          onChange(optimizedUrl);
          setIsProcessing(false);
        }, outputFormat, 0.82);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-[#0D0F12] border border-[#1D2230]">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
          {label}
        </label>
        
        <div className="flex items-center bg-[#151922] p-1 rounded-xl border border-[#1D2230]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
              mode === 'upload' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Fazer Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
              mode === 'url' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            Usar URL
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <div className="space-y-2">
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://exemplo.com/banner.jpg"
            className="w-full px-4 py-2.5 rounded-xl bg-[#151922] border border-[#1D2230] text-white text-xs focus:border-[#D4AF37] focus:outline-none font-mono"
          />
          <span className="text-[10px] text-[#A7AFBF] block">
            Recomendado: {recommendedSize}
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragging 
                ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                : 'border-[#1D2230] hover:border-[#D4AF37]/50 bg-[#151922]/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  processFile(e.target.files[0]);
                }
              }}
            />

            {isProcessing ? (
              <div className="py-4 space-y-2">
                <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
                <span className="text-xs font-bold text-white block">Otimizando imagem para WebP...</span>
              </div>
            ) : value ? (
              <div className="space-y-3">
                <div className="relative h-32 w-full rounded-xl overflow-hidden border border-[#1D2230] bg-black">
                  <img src={value} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-bold shadow">
                      Substituir Imagem
                    </span>
                  </div>
                </div>
                {stats && (
                  <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-[#A7AFBF] bg-[#08090C] py-2 px-3 rounded-xl border border-[#1D2230]">
                    <span>Original: <strong className="text-white">{stats.originalSize}</strong></span>
                    <span>•</span>
                    <span>Otimizado: <strong className="text-emerald-400">{stats.optimizedSize}</strong></span>
                    <span>•</span>
                    <span className="text-[#D4AF37] font-bold">{stats.format}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 space-y-2">
                <Upload className="w-8 h-8 text-[#D4AF37] mx-auto opacity-80" />
                <div>
                  <span className="text-xs font-bold text-white block">Arraste uma imagem ou clique para selecionar</span>
                  <span className="text-[10px] text-[#A7AFBF] block mt-0.5">JPG, PNG, WEBP • Até {maxSizeMB} MB • Recomendado: {recommendedSize}</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
