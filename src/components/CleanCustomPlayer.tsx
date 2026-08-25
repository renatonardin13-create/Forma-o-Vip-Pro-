import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  Volume1, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Sparkles, 
  ShieldCheck, 
  Tv, 
  Settings,
  Check
} from 'lucide-react';

interface CleanCustomPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  title: string;
  onEnded?: () => void;
}

export const CleanCustomPlayer: React.FC<CleanCustomPlayerProps> = ({
  videoUrl,
  posterUrl,
  title,
  onEnded
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [flashAction, setFlashAction] = useState<'play' | 'pause' | 'fwd' | 'rwd' | null>(null);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        triggerFlash('play');
      }).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      triggerFlash('pause');
    }
  }, []);

  const triggerFlash = (type: 'play' | 'pause' | 'fwd' | 'rwd') => {
    setFlashAction(type);
    setTimeout(() => setFlashAction(null), 500);
  };

  // Skip forward / backward
  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
    triggerFlash(seconds > 0 ? 'fwd' : 'rwd');
  };

  // Volume Change
  const handleVolumeChange = (newVol: number) => {
    if (!videoRef.current) return;
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    videoRef.current.volume = clamped;
    if (clamped === 0) {
      setIsMuted(true);
      videoRef.current.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume || 0.5;
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Playback Rate
  const handleRateChange = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  // Fullscreen
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Fullscreen request error', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Exit fullscreen error', err);
      }
    }
  };

  // Picture in Picture
  const togglePip = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error('PiP error', err);
    }
  };

  // Seeking on progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * duration);
  };

  const handleProgressMouseLeave = () => {
    setHoverTime(null);
  };

  // Mouse move inside player to show controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        if (!showSettings) setShowControls(false);
      }, 3000);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skip(5);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skip(-5);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, duration, isMuted, volume]);

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full h-full bg-[#050608] select-none group flex items-center justify-center overflow-hidden"
    >
      {/* Native Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        playsInline
        onClick={togglePlay}
        onTimeUpdate={() => {
          if (videoRef.current && !isSeeking) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onDurationChange={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
        onProgress={() => {
          if (videoRef.current && videoRef.current.buffered.length > 0) {
            const bufEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
            setBuffered(duration ? (bufEnd / duration) * 100 : 0);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setShowControls(true);
          onEnded?.();
        }}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Center Big Play Button when paused / start */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute z-20 w-20 h-20 rounded-full bg-black/60 hover:bg-[#D4AF37] text-white hover:text-black border-2 border-[#D4AF37] flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl backdrop-blur-md group-hover:opacity-100"
          title="Iniciar Aula"
        >
          <Play className="w-8 h-8 ml-1 fill-current" />
        </button>
      )}

      {/* Visual Flash Icon on Actions */}
      {flashAction && (
        <div className="absolute z-30 w-16 h-16 rounded-full bg-black/75 backdrop-blur-md border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] pointer-events-none animate-ping duration-300">
          {flashAction === 'play' && <Play className="w-7 h-7 fill-current" />}
          {flashAction === 'pause' && <Pause className="w-7 h-7" />}
          {flashAction === 'fwd' && <RotateCw className="w-7 h-7" />}
          {flashAction === 'rwd' && <RotateCcw className="w-7 h-7" />}
        </div>
      )}

      {/* Top Bar: Clean VIP Branding Badge (Zero YouTube Branding) */}
      <div 
        className={`absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono font-bold tracking-wider backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PLAYER 100% LIMPO VIP</span>
          </div>
          <span className="text-xs font-semibold text-white/90 truncate max-w-[300px] sm:max-w-md">
            {title}
          </span>
        </div>

        <div className="text-[10px] font-mono text-[#A7AFBF] hidden sm:flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md border border-white/10">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>ALTA DEFINIÇÃO 1080P</span>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-20 px-4 py-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-2 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar Container */}
        <div 
          ref={progressRef}
          onClick={handleProgressClick}
          onMouseMove={handleProgressMouseMove}
          onMouseLeave={handleProgressMouseLeave}
          className="relative h-2 hover:h-3 w-full bg-white/20 rounded-full cursor-pointer transition-all duration-150 group/bar flex items-center"
        >
          {/* Buffer Progress */}
          <div 
            className="absolute top-0 bottom-0 left-0 bg-white/30 rounded-full transition-all"
            style={{ width: `${buffered}%` }}
          />

          {/* Played Progress */}
          <div 
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] rounded-full shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />

          {/* Scrubber Knob */}
          <div 
            className="absolute w-3.5 h-3.5 bg-white border-2 border-[#D4AF37] rounded-full shadow-lg -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />

          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div 
              className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 text-white text-[10px] font-mono border border-[#D4AF37]/40 pointer-events-none whitespace-nowrap shadow-md"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between gap-2 text-white">
          {/* Left Controls: Play/Pause, Skips, Time, Volume */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white hover:text-[#D4AF37] transition"
              title={isPlaying ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Skip -10s */}
            <button
              onClick={() => skip(-10)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#A7AFBF] hover:text-white transition flex items-center gap-0.5 text-xs font-mono"
              title="Voltar 10s (Seta Esquerda)"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-[10px] hidden sm:inline">10s</span>
            </button>

            {/* Skip +10s */}
            <button
              onClick={() => skip(10)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#A7AFBF] hover:text-white transition flex items-center gap-0.5 text-xs font-mono"
              title="Avançar 10s (Seta Direita)"
            >
              <RotateCw className="w-4 h-4" />
              <span className="text-[10px] hidden sm:inline">10s</span>
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/10 text-[#A7AFBF] hover:text-white transition"
                title={isMuted ? 'Desmutar (M)' : 'Mutar (M)'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 sm:w-20 h-1 bg-white/20 accent-[#D4AF37] rounded-lg cursor-pointer transition-all"
                title="Ajustar Volume"
              />
            </div>

            {/* Time Display */}
            <div className="text-xs font-mono text-[#A7AFBF] pl-1">
              <span className="text-white font-bold">{formatTime(currentTime)}</span>
              <span className="mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Speed, PiP, Fullscreen */}
          <div className="flex items-center gap-2 relative">
            {/* Speed / Rate Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(prev => !prev)}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-[#D4AF37] border border-white/10 flex items-center gap-1 transition"
                title="Velocidade de Reprodução"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{playbackRate}x</span>
              </button>

              {/* Speed Menu Popup */}
              {showSettings && (
                <div className="absolute bottom-9 right-0 bg-[#0D0F12] border border-[#1D2230] rounded-xl p-1.5 shadow-2xl space-y-0.5 z-30 min-w-[120px] backdrop-blur-md">
                  <div className="px-2 py-1 text-[10px] font-bold text-[#A7AFBF] font-mono border-b border-[#1D2230] mb-1">
                    VELOCIDADE
                  </div>
                  {[0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={`w-full px-2 py-1 text-xs text-left rounded-lg flex items-center justify-between transition ${
                        playbackRate === rate ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#A7AFBF] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{rate}x {rate === 1 ? '(Normal)' : ''}</span>
                      {playbackRate === rate && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Picture in Picture */}
            <button
              onClick={togglePip}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#A7AFBF] hover:text-white transition hidden sm:block"
              title="Picture-in-Picture"
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#A7AFBF] hover:text-white transition"
              title={isFullscreen ? 'Sair da Tela Cheia (F)' : 'Tela Cheia (F)'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
