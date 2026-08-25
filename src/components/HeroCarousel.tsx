import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { useStore } from '../services/store';
import { HeroBanner } from '../types';

interface HeroCarouselProps {
  memberAreaId?: string;
  onOpenCourse?: (courseId: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  memberAreaId = 'all',
  onOpenCourse
}) => {
  const { 
    digitalProducts, 
    courses, 
    heroBanners = [], 
    recordBannerImpression, 
    recordBannerClick 
  } = useStore();

  // Filter banners active and matching area
  const activeBanners = (heroBanners as HeroBanner[]).filter(b => {
    if (b.status !== 'active') return false;
    if (b.memberAreaId === 'all' || !b.memberAreaId) return true;
    if (memberAreaId && memberAreaId !== 'all' && b.memberAreaId !== memberAreaId) return false;
    return true;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  // Track impression once per banner switch
  useEffect(() => {
    if (currentBanner) {
      recordBannerImpression(currentBanner.id);
    }
  }, [currentIndex, currentBanner?.id]);

  // Autoplay handler
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const durationSeconds = currentBanner?.customization?.slideDurationSeconds ?? 8;
    if (durationSeconds <= 0) return; // disabled

    timerRef.current = setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, durationSeconds * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, activeBanners.length, currentBanner]);

  if (!activeBanners || activeBanners.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeBanners.length);
  };

  const handleCtaClick = (banner: HeroBanner) => {
    recordBannerClick(banner.id);

    if (banner.targetType === 'curso' && banner.targetId && onOpenCourse) {
      onOpenCourse(banner.targetId);
      return;
    }

    if (banner.targetType === 'produto_interno' && banner.targetId && onOpenCourse) {
      const prod = digitalProducts.find(p => p.id === banner.targetId);
      if (prod?.courseId && onOpenCourse) {
        onOpenCourse(prod.courseId);
      } else {
        window.location.href = banner.ctaLink || '#';
      }
      return;
    }

    if (banner.ctaLink) {
      if (banner.openInNewTab) {
        window.open(banner.ctaLink, '_blank');
      } else {
        window.location.href = banner.ctaLink;
      }
    }
  };

  const overlayOpacity = currentBanner.customization?.overlayOpacity ?? 75;

  return (
    <div 
      className="relative w-full overflow-hidden rounded-3xl bg-[#08090C] border border-[#1D2230] shadow-card-dark transition-all duration-500 group my-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={currentBanner.desktopImage} 
          alt={currentBanner.title}
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out hidden sm:block"
        />
        <img 
          src={currentBanner.mobileImage || currentBanner.desktopImage} 
          alt={currentBanner.title}
          className="w-full h-full object-cover object-center block sm:hidden"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#08090C] via-[#08090C]/90 to-transparent z-10"
          style={{ opacity: overlayOpacity / 100 }}
        />
        {/* Subtle Gold / Metal Ambient Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none z-10" />
      </div>

      {/* Carousel Content Container */}
      <div className="relative z-20 px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16 min-h-[380px] lg:min-h-[420px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          
          {/* Left Side: Category, Title, Description, CTA */}
          <div className="lg:col-span-7 space-y-4 max-w-2xl">
            {/* Small Category Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151922]/90 border border-[#D4AF37]/40 shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] font-extrabold text-[#F5D76E] tracking-wider uppercase font-mono">
                {currentBanner.subtitle || currentBanner.category}
              </span>
            </div>

            {/* Large Title */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-display">
              {currentBanner.title}
            </h2>

            {/* Short Description */}
            <p className="text-sm sm:text-base text-[#A7AFBF] leading-relaxed max-w-xl font-sans">
              {currentBanner.description}
            </p>

            {/* CTA Button */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleCtaClick(currentBanner)}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] hover:from-[#F5D76E] hover:to-[#D4AF37] text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2.5 shadow-gold-glow-lg transition-all transform hover:scale-[1.02] active:scale-95"
              >
                <span>{currentBanner.ctaText || 'ACESSAR AGORA'}</span>
                {currentBanner.openInNewTab ? (
                  <ExternalLink className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>

              <span className="text-xs text-[#A7AFBF] font-mono hidden sm:inline-block">
                {currentIndex + 1} de {activeBanners.length} destaques
              </span>
            </div>
          </div>

          {/* Right Side: Product Mockup / Visual Composition with Gradient Mask */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-card-dark group/img">
              <img 
                src={currentBanner.productImage || currentBanner.desktopImage} 
                alt={currentBanner.title}
                className="w-full h-full object-cover object-center transform group-hover/img:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-transparent to-transparent opacity-80" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-[#1D2230] flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider truncate">
                  {currentBanner.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono font-bold">
                  VIP EXCLUSIVE
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Carousel Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#D4AF37] text-white hover:text-black border border-[#1D2230] hover:border-[#D4AF37] flex items-center justify-center backdrop-blur-md transition-all z-30 opacity-70 group-hover:opacity-100 shadow-lg"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#D4AF37] text-white hover:text-black border border-[#1D2230] hover:border-[#D4AF37] flex items-center justify-center backdrop-blur-md transition-all z-30 opacity-70 group-hover:opacity-100 shadow-lg"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Bottom Indicator Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 right-6 z-30 flex items-center gap-2">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all rounded-full ${
                currentIndex === idx
                  ? 'w-6 h-2 bg-[#D4AF37]'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
