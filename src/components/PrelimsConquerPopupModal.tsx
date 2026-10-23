import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface PrelimsConquerPopupModalProps {
  onNavigateToCourse: () => void;
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
}

const STORAGE_KEY = 'dcode_popup_poster_v2';

/**
 * Temporary toggle: Client requested to pause/hide the prelims popup advertisement for a while.
 * Set to true when client approves pushing this feature live.
 */
export const IS_PRELIMS_POPUP_ENABLED = true;

export default function PrelimsConquerPopupModal({
  onNavigateToCourse,
  isOpenOverride,
  onCloseOverride
}: PrelimsConquerPopupModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // If popup is disabled globally and no override is given, do not show
    if (!IS_PRELIMS_POPUP_ENABLED && isOpenOverride === undefined) {
      // Allow optional testing/preview via ?popup=true
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
    onNavigateToCourse();
  };

  if (!IS_PRELIMS_POPUP_ENABLED && isOpenOverride === undefined && !isOpen) {
    return null;
  }

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container: Just the pure advertisement image without text overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative w-auto max-w-[92vw] sm:max-w-md md:max-w-lg max-h-[90vh] bg-transparent rounded-2xl shadow-2xl z-10 my-auto flex flex-col items-center justify-center"
          >
            {/* Top Close Button */}
            <button
              onClick={(e) => handleClose(e)}
              aria-label="Close Announcement"
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/85 hover:bg-black text-white flex items-center justify-center transition-all duration-200 shadow-xl border-2 border-white/40 group cursor-pointer"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Clickable Advertisement Image */}
            <div
              onClick={handleAction}
              className="cursor-pointer overflow-hidden rounded-2xl shadow-2xl border-2 border-amber-300/40 hover:border-amber-300 transition-all duration-300 group"
              title="Click to view course details and schedule"
            >
              <img
                src="/prelims-conquer-2027-popup.jpg"
                alt="UPSC Prelims Conquer 2027 - Sudhagaran Sir"
                className="w-full h-auto max-h-[82vh] object-contain rounded-2xl transition-transform duration-300 group-hover:scale-[1.015]"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
