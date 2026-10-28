import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import prelimsConquerPopupImg from '../prelims-conquer-2027-popup-new.jpg';

interface PrelimsConquerPopupModalProps {
  onNavigateToCourse: () => void;
  onNavigateToPcmCourse?: () => void;
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
}

const STORAGE_KEY = 'dcode_sequential_popups_v2';
export const IS_PRELIMS_POPUP_ENABLED = true;

type PopupStage = 'none' | 'prelims' | 'pcm';

export default function PrelimsConquerPopupModal({
  onNavigateToCourse,
  onNavigateToPcmCourse,
  isOpenOverride,
  onCloseOverride
}: PrelimsConquerPopupModalProps) {
  const [activePopup, setActivePopup] = useState<PopupStage>('none');
  const pcmTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check manual preview query parameters
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    if (searchParams) {
      const popupParam = searchParams.get('popup') || searchParams.get('preview-popup');
      if (popupParam === 'pcm') {
        setActivePopup('pcm');
        return;
      }
      if (popupParam === 'prelims' || popupParam === 'true') {
        setActivePopup('prelims');
        return;
      }
    }

    if (!IS_PRELIMS_POPUP_ENABLED && isOpenOverride === undefined) {
      setActivePopup('none');
      return;
    }

    if (isOpenOverride !== undefined) {
      setActivePopup(isOpenOverride ? 'prelims' : 'none');
      return;
    }

    try {
      const isCompleted = sessionStorage.getItem(STORAGE_KEY);
      if (!isCompleted) {
        // Initial delay before showing 1st popup (Prelims Conquer 2027)
        const initialTimer = setTimeout(() => {
          setActivePopup('prelims');
        }, 500);
        return () => clearTimeout(initialTimer);
      }
    } catch {
      setActivePopup('prelims');
    }

    return () => {
      if (pcmTimerRef.current) {
        clearTimeout(pcmTimerRef.current);
      }
    };
  }, [isOpenOverride]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (pcmTimerRef.current) {
        clearTimeout(pcmTimerRef.current);
      }
    };
  }, []);

  // When closing 1st popup (Prelims Conquer 2027):
  // Close it immediately and launch PCM popup after exactly 3 seconds interval!
  const handleClosePrelims = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActivePopup('none');

    // 3-second (3000ms) interval before opening 2nd popup (PCM UPSC Batch 2028)
    if (pcmTimerRef.current) {
      clearTimeout(pcmTimerRef.current);
    }
    pcmTimerRef.current = setTimeout(() => {
      setActivePopup('pcm');
    }, 3000);
  };

  // When closing 2nd popup (PCM UPSC Batch 2028):
  const handleClosePcm = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActivePopup('none');
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    if (onCloseOverride) {
      onCloseOverride();
    }
  };

  const handleActionPrelims = () => {
    if (pcmTimerRef.current) {
      clearTimeout(pcmTimerRef.current);
    }
    setActivePopup('none');
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
    onNavigateToCourse();
  };

  const handleActionPcm = () => {
    if (pcmTimerRef.current) {
      clearTimeout(pcmTimerRef.current);
    }
    setActivePopup('none');
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
    if (onNavigateToPcmCourse) {
      onNavigateToPcmCourse();
    } else {
      window.location.href = '/pcm-batch-2028';
    }
  };

  if (activePopup === 'none') {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {/* POPUP 1: PRELIMS CONQUER 2027 */}
      {activePopup === 'prelims' && (
        <div
          key="popup-prelims"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => handleClosePrelims(e)}
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
              onClick={(e) => handleClosePrelims(e)}
              aria-label="Close Announcement"
              className="absolute -top-3.5 -right-3.5 sm:-top-4 sm:-right-4 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/90 hover:bg-black text-white flex items-center justify-center transition-all duration-200 shadow-xl border-2 border-white/50 group cursor-pointer"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Poster Card Container */}
            <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl border-2 border-amber-300/40 hover:border-amber-300 transition-all duration-300 group">
              <div
                onClick={handleActionPrelims}
                className="cursor-pointer overflow-hidden rounded-2xl flex items-center justify-center bg-black"
                title="Click to view Prelims Conquer 2027 details"
              >
                <img
                  src={prelimsConquerPopupImg}
                  alt="UPSC Prelims Conquer 2027 - Sudhagaran Sir"
                  className="w-full h-auto max-h-[72vh] sm:max-h-[76vh] object-contain transition-transform duration-300 group-hover:scale-[1.015]"
                />
              </div>

              {/* Bottom Quick CTA Bar Overlay */}
              <div
                onClick={handleActionPrelims}
                className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/85 to-transparent pt-6 pb-2.5 px-4 text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-all group-hover:from-black group-hover:via-black/95"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider font-space">
                    Target 2027
                  </span>
                  <span className="text-white text-xs font-bold uppercase tracking-wider font-space">
                    Prelims Conquer 2027
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white text-xs font-bold font-space uppercase tracking-wider transition-colors">
                  <span>View Prelims Conquer 2027 Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* POPUP 2: PCM UPSC BATCH 2028 (Appears 3 seconds after closing Popup 1) */}
      {activePopup === 'pcm' && (
        <div
          key="popup-pcm"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => handleClosePcm(e)}
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
              onClick={(e) => handleClosePcm(e)}
              aria-label="Close PCM Announcement"
              className="absolute -top-3.5 -right-3.5 sm:-top-4 sm:-right-4 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/90 hover:bg-black text-white flex items-center justify-center transition-all duration-200 shadow-xl border-2 border-white/50 group cursor-pointer"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Poster Card Container */}
            <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl border-2 border-amber-300/40 hover:border-amber-300 transition-all duration-300 group">
              <div
                onClick={handleActionPcm}
                className="cursor-pointer overflow-hidden rounded-2xl flex items-center justify-center bg-black"
                title="Click to view PCM UPSC Batch 2028 Foundation details"
              >
                <img
                  src="/pcm-upsc-batch-2028-popup.jpg"
                  alt="PCM UPSC Batch 2028 - Admissions Open"
                  className="w-full h-auto max-h-[72vh] sm:max-h-[76vh] object-contain transition-transform duration-300 group-hover:scale-[1.015]"
                />
              </div>

              {/* Bottom Quick CTA Bar Overlay */}
              <div
                onClick={handleActionPcm}
                className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/85 to-transparent pt-6 pb-2.5 px-4 text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-all group-hover:from-black group-hover:via-black/95"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider font-space">
                    Target UPSC 2028
                  </span>
                  <span className="text-white text-xs font-bold uppercase tracking-wider font-space">
                    PCM UPSC Batch 2028
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-amber-300 hover:text-white text-xs font-bold font-space uppercase tracking-wider transition-colors">
                  <span>View PCM Batch 2028 Foundation Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
