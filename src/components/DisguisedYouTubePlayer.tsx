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
  Check, 
  CheckCircle2, 
  Gauge, 
  Clock, 
  Lock, 
  Tv, 
  Sliders,
  Award
} from 'lucide-react';
import { extractYouTubeId, formatVideoTime, loadYouTubeIframeAPI } from '../utils/videoHelpers';
import { useStore } from '../services/store';

export interface DisguisedYouTubePlayerProps {
  youtube_video_id?: string;
  videoUrl?: string;
  lessonId?: string;
  courseId?: string;
  title?: string;
  posterUrl?: string;
  watermarkText?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  onCompleted?: () => void;
  onProgressUpdate?: (percent: number, currentSec: number, totalDuration: number) => void;
}

export const DisguisedYouTubePlayer: React.FC<DisguisedYouTubePlayerProps> = ({
  youtube_video_id,
  videoUrl = '',
  lessonId = 'aula-demo',
  courseId = 'curso-demo',
  title = 'Aula Exclusiva',
  posterUrl,
  watermarkText,
  autoPlay = false,
  onEnded,
  onCompleted,
  onProgressUpdate
}) => {
  const { currentUser, saveAulaProgress, getAulaProgress, markLessonCompleted } = useStore();

  // Container refs
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const iframeHolderRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const uniqueIdRef = useRef<string>(`yt-vip-${Math.random().toString(36).substring(2, 9)}`);
  
  // Timers
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);
  const progressPollingInterval = useRef<NodeJS.Timeout | null>(null);
  const lastSavedTime = useRef<number>(0);
  const lastClickTime = useRef<number>(0);

  // States
  const [isApiReady, setIsApiReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedFraction, setBufferedFraction] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [flashFeedback, setFlashFeedback] = useState<{ type: 'play' | 'pause' | 'fwd' | 'rwd' | 'speed'; text?: string } | null>(null);
  const [completedCelebration, setCompletedCelebration] = useState(false);

  // Extract clean 11-char ID
  const cleanVideoId = extractYouTubeId(youtube_video_id || videoUrl) || 'dQw4w9WgXcQ';

  // Load existing progress
  const existingProg = getAulaProgress(lessonId);
  const isLessonAlreadyCompleted = existingProg?.concluido || false;

  // Trigger brief visual icon feedback
  const triggerFlash = (type: 'play' | 'pause' | 'fwd' | 'rwd' | 'speed', text?: string) => {
    setFlashFeedback({ type, text });
    setTimeout(() => setFlashFeedback(null), 600);
  };

  // 1. Load YouTube IFrame API
  useEffect(() => {
    let isMounted = true;

    loadYouTubeIframeAPI().then(() => {
      if (isMounted) {
        setIsApiReady(true);
      }
    }).catch(err => {
      console.error('Failed to load YouTube IFrame API:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Initialize YouTube Player
  useEffect(() => {
    if (!isApiReady || !cleanVideoId) return;

    let isSubscribed = true;

    // Clean previous instance if any
    if (playerInstanceRef.current && typeof playerInstanceRef.current.destroy === 'function') {
      try {
        playerInstanceRef.current.destroy();
      } catch (e) {
        // ignore
      }
      playerInstanceRef.current = null;
    }

    const containerId = uniqueIdRef.current;
    const targetElement = document.getElementById(containerId);
    if (!targetElement) return;

    try {
      playerInstanceRef.current = new window.YT.Player(containerId, {
        host: 'https://www.youtube-nocookie.com',
        videoId: cleanVideoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: autoPlay ? 1 : 0,
          controls: 0,           // Hide native controls
          disablekb: 1,          // Disable native keyboard controls in iframe
          enablejsapi: 1,        // Enable JS API
          fs: 0,                 // Hide native fullscreen button
          iv_load_policy: 3,     // Hide annotations
          modestbranding: 1,     // Minimal YT branding
          rel: 0,                // Do not show related videos
          showinfo: 0,           // Hide video title/uploader
          playsinline: 1,        // iOS inline playback
          origin: window.location.origin,
          widget_referrer: window.location.origin,
          autohide: 1,
          cc_load_policy: 0
        },
        events: {
          onReady: (event: any) => {
            if (!isSubscribed) return;
            setIsPlayerReady(true);
            const totalSecs = event.target.getDuration();
            setDuration(totalSecs || 0);
            
            // Set initial volume
            try {
              event.target.setVolume(volume);
              if (isMuted) event.target.mute();
            } catch (e) {
              // ignore
            }

            // Restore last played position if student watched before
            if (existingProg?.segundos_assistidos && existingProg.segundos_assistidos > 5 && !existingProg.concluido) {
              try {
                event.target.seekTo(existingProg.segundos_assistidos, false);
                setCurrentTime(existingProg.segundos_assistidos);
              } catch (e) {
                // ignore
              }
            }
          },
          onStateChange: (event: any) => {
            if (!isSubscribed) return;
            const state = event.data;

            // YT.PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
            if (state === 1) { // PLAYING
              setIsPlaying(true);
              setIsBuffering(false);
            } else if (state === 2) { // PAUSED
              setIsPlaying(false);
              setIsBuffering(false);
            } else if (state === 3) { // BUFFERING
              setIsBuffering(true);
            } else if (state === 0) { // ENDED
              setIsPlaying(false);
              setIsBuffering(false);
              handleVideoEnded();
            }
          },
          onError: (event: any) => {
            console.warn('YouTube Player Event Error:', event.data);
            setIsBuffering(false);
          }
        }
      });
    } catch (err) {
      console.error('Error creating YT.Player:', err);
    }

    return () => {
      isSubscribed = false;
      if (playerInstanceRef.current && typeof playerInstanceRef.current.destroy === 'function') {
        try {
          playerInstanceRef.current.destroy();
        } catch (e) {
          // ignore
        }
        playerInstanceRef.current = null;
      }
    };
  }, [isApiReady, cleanVideoId]);

  // 3. Progress Tracking & Supabase Polling Engine
  useEffect(() => {
    if (!isPlaying) {
      if (progressPollingInterval.current) {
        clearInterval(progressPollingInterval.current);
        progressPollingInterval.current = null;
      }
      return;
    }

    progressPollingInterval.current = setInterval(() => {
      if (!playerInstanceRef.current || typeof playerInstanceRef.current.getCurrentTime !== 'function') return;

      try {
        const current = playerInstanceRef.current.getCurrentTime() || 0;
        const total = playerInstanceRef.current.getDuration() || duration || 0;
        const loaded = playerInstanceRef.current.getVideoLoadedFraction() || 0;

        setCurrentTime(current);
        if (total > 0) {
          setDuration(total);
        }
        setBufferedFraction(loaded);

        const percent = total > 0 ? (current / total) * 100 : 0;
        onProgressUpdate?.(percent, current, total);

        // Save progress every 10 seconds of active playback
        const now = Date.now();
        if (now - lastSavedTime.current >= 10000 && total > 0) {
          lastSavedTime.current = now;
          const isDone = percent >= 90;
          saveAulaProgress(lessonId, courseId, percent, current, total, isDone);

          if (isDone && !isLessonAlreadyCompleted && !completedCelebration) {
            setCompletedCelebration(true);
            onCompleted?.();
          }
        }
      } catch (err) {
        // ignore polling error
      }
    }, 300);

    return () => {
      if (progressPollingInterval.current) {
        clearInterval(progressPollingInterval.current);
        progressPollingInterval.current = null;
      }
    };
  }, [isPlaying, duration, lessonId, courseId, isLessonAlreadyCompleted, completedCelebration]);

  // When video reaches the end
  const handleVideoEnded = () => {
    saveAulaProgress(lessonId, courseId, 100, duration, duration, true);
    markLessonCompleted(courseId, lessonId);
    setCompletedCelebration(true);
    triggerFlash('play', 'Aula Concluída!');
    onEnded?.();
    onCompleted?.();
  };

  // Play / Pause Toggle
  const togglePlay = useCallback(() => {
    if (!playerInstanceRef.current) return;
    try {
      if (isPlaying) {
        playerInstanceRef.current.pauseVideo();
        setIsPlaying(false);
        triggerFlash('pause');
      } else {
        playerInstanceRef.current.playVideo();
        setIsPlaying(true);
        triggerFlash('play');
      }
    } catch (e) {
      console.warn('Playback toggle error:', e);
    }
  }, [isPlaying]);

  // Skip time (seconds)
  const skipTime = (seconds: number) => {
    if (!playerInstanceRef.current || typeof playerInstanceRef.current.getCurrentTime !== 'function') return;
    try {
      const current = playerInstanceRef.current.getCurrentTime() || 0;
      const target = Math.max(0, Math.min(duration, current + seconds));
      playerInstanceRef.current.seekTo(target, true);
      setCurrentTime(target);
      triggerFlash(seconds > 0 ? 'fwd' : 'rwd', seconds > 0 ? '+10s' : '-10s');
    } catch (e) {
      // ignore
    }
  };

  // Volume handler
  const handleVolumeChange = (newVolume: number) => {
    if (!playerInstanceRef.current) return;
    const clamped = Math.max(0, Math.min(100, Math.round(newVolume)));
    setVolume(clamped);
    try {
      playerInstanceRef.current.setVolume(clamped);
      if (clamped === 0) {
        setIsMuted(true);
        playerInstanceRef.current.mute();
      } else if (isMuted) {
        setIsMuted(false);
        playerInstanceRef.current.unMute();
      }
    } catch (e) {
      // ignore
    }
  };

  // Mute toggle
  const toggleMute = () => {
    if (!playerInstanceRef.current) return;
    try {
      if (isMuted) {
        playerInstanceRef.current.unMute();
        setIsMuted(false);
        playerInstanceRef.current.setVolume(volume || 50);
      } else {
        playerInstanceRef.current.mute();
        setIsMuted(true);
      }
    } catch (e) {
      // ignore
    }
  };

  // Speed handler
  const changeSpeed = (rate: number) => {
    if (!playerInstanceRef.current) return;
    try {
      playerInstanceRef.current.setPlaybackRate(rate);
      setPlaybackRate(rate);
      setShowSpeedMenu(false);
      triggerFlash('speed', `${rate}x`);
    } catch (e) {
      // ignore
    }
  };

  // Seek on click/drag
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !playerInstanceRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSecs = fraction * duration;
    
    try {
      playerInstanceRef.current.seekTo(targetSecs, true);
      setCurrentTime(targetSecs);
      // If was paused, can optionally resume
    } catch (err) {
      // ignore
    }
  };

  // Hover timestamp tooltip
  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, hoverX / rect.width));
    setHoverPosition(hoverX);
    setHoverTime(fraction * duration);
  };

  // Fullscreen toggle using HTML5 Fullscreen API on the wrapper
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls during playback
  const resetHideControlsTimer = () => {
    setShowControls(true);
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
      }, 3000);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only react if player is focused or active
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

      if (e.code === 'Space' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft' || e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        skipTime(-10);
      } else if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        skipTime(10);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleVolumeChange(volume + 10);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleVolumeChange(volume - 10);
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
  }, [togglePlay, volume, isMuted]);

  // Handle double-tap/double-click on left/right areas
  const handleSurfaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeftSide = clickX < rect.width * 0.35;
    const isRightSide = clickX > rect.width * 0.65;

    if (now - lastClickTime.current < 300) {
      // Double click detected!
      if (isLeftSide) {
        skipTime(-10);
      } else if (isRightSide) {
        skipTime(10);
      } else {
        toggleFullscreen();
      }
      lastClickTime.current = 0;
    } else {
      lastClickTime.current = now;
      togglePlay();
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isCompleted = isLessonAlreadyCompleted || progressPercent >= 90;

  return (
    <div
      ref={playerContainerRef}
      id="disguised-yt-player-wrapper"
      onContextMenu={(e) => e.preventDefault()} // Block right-click context menu
      onMouseMove={resetHideControlsTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video bg-[#0A0C10] rounded-2xl overflow-hidden shadow-2xl border border-[#1D2230] select-none group focus:outline-none"
      tabIndex={0}
    >
      {/* 1. Underlying YouTube Iframe Container */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden scale-[1.01]">
        <div 
          id={uniqueIdRef.current} 
          ref={iframeHolderRef}
          className="w-full h-full border-0 pointer-events-none"
        />
      </div>

      {/* 2. ANTI-YOUTUBE PROTECTION SHIELDS (Disguise System) */}
      
      {/* Top-Right Shield: Blocks clicks on the residual YouTube share/title/avatar icon */}
      <div 
        id="anti-yt-top-right-shield"
        className="absolute top-0 right-0 w-64 h-24 z-20 pointer-events-auto bg-transparent cursor-pointer"
        title=""
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
      />

      {/* Top-Left Header Shield */}
      <div 
        id="anti-yt-top-left-shield"
        className="absolute top-0 left-0 w-64 h-20 z-20 pointer-events-auto bg-transparent cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
      />

      {/* Main Transparent Click Shield covering the entire video */}
      <div 
        id="yt-main-surface-shield"
        onClick={handleSurfaceClick}
        className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center"
      >
        {/* Central Big Play/Pause & Buffering Feedback */}
        {isBuffering ? (
          <div className="w-16 h-16 rounded-full bg-[#0D0F12]/80 backdrop-blur-md border border-[#D4AF37]/50 flex items-center justify-center shadow-2xl shadow-[#D4AF37]/10 animate-pulse">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !isPlaying ? (
          <div className="group/btn relative flex items-center justify-center">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] rounded-full blur-md opacity-30 group-hover/btn:opacity-60 transition duration-500" />
            <button
              type="button"
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-[#1E2330] to-[#0D0F12] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-2xl transform transition duration-300 group-hover/btn:scale-110 hover:shadow-[#D4AF37]/20"
            >
              <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-[#D4AF37] ml-1 transition duration-300" />
            </button>
          </div>
        ) : null}

        {/* Action Flash Feedback Animation */}
        {flashFeedback && (
          <div className="absolute z-30 pointer-events-none flex flex-col items-center justify-center gap-2 bg-[#0D0F12]/85 px-5 py-4 rounded-2xl border border-[#D4AF37]/40 backdrop-blur-md shadow-2xl animate-fade-in">
            {flashFeedback.type === 'play' && <Play className="w-8 h-8 text-[#D4AF37] fill-[#D4AF37]" />}
            {flashFeedback.type === 'pause' && <Pause className="w-8 h-8 text-[#D4AF37] fill-[#D4AF37]" />}
            {flashFeedback.type === 'fwd' && <RotateCw className="w-8 h-8 text-[#D4AF37]" />}
            {flashFeedback.type === 'rwd' && <RotateCcw className="w-8 h-8 text-[#D4AF37]" />}
            {flashFeedback.type === 'speed' && <Gauge className="w-8 h-8 text-[#D4AF37]" />}
            {flashFeedback.text && (
              <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                {flashFeedback.text}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 3. DISCREET FLOATING WATERMARK */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none opacity-40 hover:opacity-80 transition duration-300">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D0F12]/60 backdrop-blur-md border border-[#1D2230]/60 text-[11px] font-mono text-[#A7AFBF]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{watermarkText || `${currentUser?.name || 'ALUNO VIP'} • ÁREA DE MEMBROS`}</span>
        </div>
      </div>

      {/* 4. TOP BAR OVERLAY (Title & Completion Badge) */}
      <div 
        className={`absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-black/85 via-black/40 to-transparent z-20 flex items-center justify-between gap-4 transition-all duration-300 pointer-events-none ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight drop-shadow truncate max-w-[280px] sm:max-w-md">
            {title}
          </h2>
        </div>

        {isCompleted && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold font-mono tracking-wide shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AULA CONCLUÍDA</span>
            <span className="sm:hidden">CONCLUÍDO</span>
          </div>
        )}
      </div>

      {/* 5. CUSTOM LUXURY CONTROLS BAR (Bottom) */}
      <div 
        className={`absolute bottom-0 inset-x-0 z-30 pt-10 pb-3 sm:pb-4 px-4 sm:px-6 bg-gradient-to-t from-black/95 via-black/75 to-transparent transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar Container */}
        <div 
          ref={progressBarRef}
          onClick={handleSeek}
          onMouseMove={handleProgressMouseMove}
          onMouseEnter={() => setIsSeeking(true)}
          onMouseLeave={() => {
            setIsSeeking(false);
            setHoverTime(null);
          }}
          className="relative group/track w-full h-2 hover:h-3.5 bg-[#1E2330]/80 rounded-full cursor-pointer transition-all duration-200 mb-3"
        >
          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div 
              className="absolute -top-8 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#0D0F12] border border-[#D4AF37]/60 text-[11px] font-mono font-bold text-white shadow-xl pointer-events-none"
              style={{ left: `${hoverPosition}px` }}
            >
              {formatVideoTime(hoverTime)}
            </div>
          )}

          {/* Buffered Track */}
          <div 
            className="absolute top-0 left-0 bottom-0 bg-[#2A3245] rounded-full transition-all duration-200"
            style={{ width: `${bufferedFraction * 100}%` }}
          />

          {/* Played Track */}
          <div 
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#F3E5AB] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)] transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Scrubber Handle */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white border-2 border-[#D4AF37] shadow-[0_0_8px_#D4AF37] scale-0 group-hover/track:scale-100 transition-transform duration-200"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-3 text-white">
          {/* Left: Play/Pause, Skips, Volume, Time */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Play/Pause */}
            <button
              type="button"
              onClick={togglePlay}
              className="p-2 rounded-xl text-[#A7AFBF] hover:text-[#D4AF37] hover:bg-[#151922] transition"
              title={isPlaying ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Skip Backward 10s */}
            <button
              type="button"
              onClick={() => skipTime(-10)}
              className="p-1.5 rounded-xl text-[#A7AFBF] hover:text-white hover:bg-[#151922] transition"
              title="Voltar 10s (←)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Skip Forward 10s */}
            <button
              type="button"
              onClick={() => skipTime(10)}
              className="p-1.5 rounded-xl text-[#A7AFBF] hover:text-white hover:bg-[#151922] transition"
              title="Avançar 10s (→)"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-xl text-[#A7AFBF] hover:text-white hover:bg-[#151922] transition"
                title={isMuted ? 'Ativar som (M)' : 'Mudo (M)'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : volume < 50 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input 
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-14 sm:w-20 h-1 bg-[#1E2330] rounded-lg appearance-none cursor-pointer accent-[#D4AF37] transition-all duration-200 opacity-70 group-hover/vol:opacity-100"
              />
            </div>

            {/* Time Stamp */}
            <div className="text-[11px] sm:text-xs font-mono text-[#A7AFBF]">
              <span className="text-white font-semibold">{formatVideoTime(currentTime)}</span>
              <span className="mx-1 text-[#4A5568]">/</span>
              <span>{formatVideoTime(duration)}</span>
            </div>
          </div>

          {/* Right: Speed Menu & Fullscreen */}
          <div className="flex items-center gap-2 relative">
            {/* Speed Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSpeedMenu(prev => !prev)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold font-mono border transition flex items-center gap-1 ${
                  playbackRate !== 1 
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' 
                    : 'bg-[#151922]/80 border-[#1D2230] text-[#A7AFBF] hover:text-white'
                }`}
                title="Velocidade de Reprodução"
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>{playbackRate}x</span>
              </button>

              {/* Speed Popover Menu */}
              {showSpeedMenu && (
                <div className="absolute bottom-10 right-0 w-32 bg-[#0D0F12] border border-[#1D2230] rounded-xl shadow-2xl p-1.5 z-40 space-y-0.5">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#A7AFBF] tracking-wider border-b border-[#1D2230]/60 mb-1">
                    Velocidade
                  </div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => changeSpeed(rate)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition ${
                        playbackRate === rate 
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-bold' 
                          : 'text-[#A7AFBF] hover:text-white hover:bg-[#151922]'
                      }`}
                    >
                      <span>{rate}x</span>
                      {playbackRate === rate && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-xl text-[#A7AFBF] hover:text-[#D4AF37] hover:bg-[#151922] transition"
              title={isFullscreen ? 'Sair da tela cheia (F)' : 'Tela cheia (F)'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
