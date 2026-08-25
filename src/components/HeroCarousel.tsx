import React, { useState, useEffect, useRef } from 'react';
import { HeroBanner } from '../types';
import { ChevronLeft, ChevronRight, Play, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';

interface HeroCarouselProps {
  banners: HeroBanner[];
  onBannerClick?: (banner: HeroBanner) => void;
  onTrackImpression?: (bannerId: string) => void;
  onTrackClick?: (bannerId: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  banners,
  onBannerClick,
  onTrackImpression,
  onTrackClick
}) => {
  const activeBanners = banners.filter(b => b.status === 'active');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Track impression when slide changes or mounts
  useEffect(() => {
    if (activeBanners.length > 0 && activeBanners[currentIndex]) {
      onTrackImpression?.(activeBanners[currentIndex].id);
    }
  }, [currentIndex, activeBanners.length]);

  // Autoplay timer
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const intervalTime = 6000; 
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeBanners.length, isPaused]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    touchStartX.current = null;
  };

  const handleCtaClick = () => {
    onTrackClick?.(currentBanner.id);
    onBannerClick?.(currentBanner);
    if (currentBanner.buttonLink) {
      if (currentBanner.openInNewTab) {
        window.open(currentBanner.buttonLink, '_blank');
      } else {
        window.location.href = currentBanner.buttonLink;
      }
    }
  };

  return (
    <div 
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#08090C] border border-[#1D2230] shadow-2xl shadow-black/80 group">
        
        {/* Background image & cinematic overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            src={currentBanner.backgroundImageUrl || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1920&q=80'} 
            alt={currentBanner.title}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#08090C] via-[#08090C]/90 to-[#08090C]/40 md:w-3/4"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-transparent to-black/60"></div>
          
          {/* Subtle gold accent lighting */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Content grid */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between min-h-[380px] sm:min-h-[420px] p-6 sm:p-10 lg:p-12 gap-8">
          
          {/* Left Column: Text & CTA */}
          <div className="w-full md:w-3/5 space-y-4 sm:space-y-6 text-left">
            
            {/* Subtitle / Category Badge */}
            {currentBanner.subtitle && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151922]/90 border border-[#D4AF37]/30 text-[#F5D76E] text-xs font-bold tracking-wider uppercase shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{currentBanner.subtitle}</span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              {currentBanner.title}
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed font-normal line-clamp-3">
              {currentBanner.description}
            </p>

            {/* CTA Button */}
            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <button
                onClick={handleCtaClick}
                className="group/btn relative inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] text-black font-bold text-sm sm:text-base shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 active:scale-95 transition-all duration-200"
              >
                <span>{currentBanner.buttonText || 'ACESSAR AGORA'}</span>
                {currentBanner.openInNewTab ? (
                  <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                ) : (
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                )}
              </button>

              <span className="text-xs text-gray-400 font-medium hidden sm:inline-block">
                Acesso imediato inclusivo na assinatura VIP
              </span>
            </div>
          </div>

          {/* Right Column: Product Mockup / Image */}
          {currentBanner.productImageUrl && (
            <div className="w-full md:w-2/5 flex justify-center items-center">
              <div className="relative group/img">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] rounded-2xl blur opacity-30 group-hover/img:opacity-60 transition duration-500"></div>
                <img 
                  src={currentBanner.productImageUrl} 
                  alt="Produto em Destaque"
                  className="relative rounded-xl w-full max-w-xs sm:max-w-sm h-48 sm:h-64 object-cover shadow-2xl border border-[#222738] transform group-hover/img:scale-102 transition-transform duration-300"
                />
              </div>
            </div>
          )}

        </div>

        {/* Carousel Navigation Arrows */}
        {activeBanners.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 border border-white/10 text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 border border-white/10 text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
              aria-label="Próximo slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicators */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex 
                    ? 'w-8 h-2 bg-[#D4AF37] shadow-sm shadow-[#D4AF37]' 
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Ir para slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
