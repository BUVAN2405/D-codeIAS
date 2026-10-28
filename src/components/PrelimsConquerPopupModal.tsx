import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import prelimsConquerPopupImg from '../prelims-conquer-2027-popup-new.jpg';

interface PrelimsConquerPopupModalProps {
  onNavigateToCourse: () => void;
  onNavigateToPcmCourse?: () => void;
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
}

const STORAGE_KEY = 'dcode_popup_poster_v3';

export const IS_PRELIMS_POPUP_ENABLED = true;

interface CampaignAd {
  id: string;
  name: string;
  tag: string;
  image: string;
  alt: string;
  ctaText: string;
  badge: string;
  targetYear: string;
}

export default function PrelimsConquerPopupModal({
  onNavigateToCourse,
  onNavigateToPcmCourse,
  isOpenOverride,
  onCloseOverride
}: PrelimsConquerPopupModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const ADS: CampaignAd[] = [
    {
      id: 'prelims_conquer_2027',
      name: 'Prelims Conquer 2027',
      tag: 'Test Series + Course',
      image: prelimsConquerPopupImg,
      alt: 'UPSC Prelims Conquer 2027 - Sudhagaran Sir',
      ctaText: 'View Prelims Conquer 2027 Details',
      badge: '43 UPSC Tests & Mentorship',
      targetYear: 'Target 2027'
    },
    {
      id: 'pcm_batch_2028',
      name: 'PCM UPSC Batch 2028',
      tag: 'Prelims-Cum-Mains 1.5 Years',
      image: '/pcm-upsc-batch-2028-popup.jpg',
      alt: 'PCM UPSC Batch 2028 - Target UPSC 2028',
      ctaText: 'View PCM Batch 2028 Foundation Details',
      badge: 'Full Foundation • 20% Early Bird',
      targetYear: 'Target 2028'
    }
  ];

  useEffect(() => {
    if (!IS_PRELIMS_POPUP_ENABLED && isOpenOverride === undefined) {
      const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const isForcePreview = searchParams && (searchParams.get('popup') === 'true' || searchParams.get('preview-popup') === 'true');
      if (!isForcePreview) {
        setIsOpen(false);
        return;
      }
    }

    if (isOpenOverride !== undefined) {
      setIsOpen(isOpenOverride);
      return;
    }

    try {
      const isDismissed = sessionStorage.getItem(STORAGE_KEY);
      if (!isDismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsOpen(true);
    }
  }, [isOpenOverride]);

  // Optional subtle auto-cycle every 7 seconds when open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ADS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isOpen, ADS.length]);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore storage errors
    }
    if (onCloseOverride) {
      onCloseOverride();
    }
  };

  const handleAction = () => {
    handleClose();
    if (currentIndex === 1) {
      if (onNavigateToPcmCourse) {
        onNavigateToPcmCourse();
      } else {
        window.location.href = '/pcm-batch-2028';
      }
    } else {
      onNavigateToCourse();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + ADS.length) % ADS.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % ADS.length);
  };

  if (!IS_PRELIMS_POPUP_ENABLED && isOpenOverride === undefined && !isOpen) {
    return null;
  }

  const currentAd = ADS[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => handleClose(e)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative w-auto max-w-[94vw] sm:max-w-md md:max-w-lg max-h-[92vh] bg-transparent rounded-2xl shadow-2xl z-10 my-auto flex flex-col items-center justify-center"
          >
            {/* Top Close Button */}
            <button
              onClick={(e) => handleClose(e)}
              aria-label="Close Announcement"
              className="absolute -top-3.5 -right-3.5 sm:-top-4 sm:-right-4 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/90 hover:bg-black text-white flex items-center justify-center transition-all duration-200 shadow-xl border-2 border-white/50 group cursor-pointer"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Top Switcher Tabs (Conquer 2027 vs PCM Batch 2028) */}
            <div className="mb-2.5 z-20 flex items-center gap-1.5 p-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 shadow-lg">
              {ADS.map((ad, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={ad.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-space font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{idx + 1}. {ad.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Poster Carousel Container */}
            <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl border-2 border-amber-300/40 hover:border-amber-300 transition-all duration-300 group">
              {/* Left Arrow Button */}
              <button
                onClick={handlePrev}
                aria-label="Previous announcement"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all shadow-lg border border-white/30 cursor-pointer backdrop-blur-xs opacity-80 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Right Arrow Button */}
              <button
                onClick={handleNext}
                aria-label="Next announcement"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all shadow-lg border border-white/30 cursor-pointer backdrop-blur-xs opacity-80 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Clickable Advertisement Image with smooth animated transition */}
              <div
                onClick={handleAction}
                className="cursor-pointer overflow-hidden rounded-2xl flex items-center justify-center bg-black"
                title={`Click to view ${currentAd.name} details`}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentAd.id}
                    src={currentAd.image}
                    alt={currentAd.alt}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-auto max-h-[72vh] sm:max-h-[76vh] object-contain transition-transform duration-300 group-hover:scale-[1.015]"
                  />
                </AnimatePresence>
              </div>

              {/* Bottom Quick CTA Bar Overlay */}
              <div
                onClick={handleAction}
                className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/85 to-transparent pt-6 pb-2.5 px-4 text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-all group-hover:from-black group-hover:via-black/95"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider font-space">
                    {currentAd.targetYear}
                  </span>
                  <span className="text-white text-xs font-bold uppercase tracking-wider font-space">
                    {currentAd.name}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white text-xs font-bold font-space uppercase tracking-wider transition-colors">
                  <span>{currentAd.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="mt-2.5 flex items-center justify-center gap-2">
              {ADS.map((ad, idx) => (
                <button
                  key={ad.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-amber-400'
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
