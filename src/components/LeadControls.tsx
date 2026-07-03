import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, FileText, MessageCircle, ExternalLink } from 'lucide-react';

interface LeadControlsProps {
  onInquiryClick: () => void;
}

export default function LeadControls({ onInquiryClick }: LeadControlsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const contact1 = '9600060393';
  const contact2 = '9600060349';
  const whatsappCommunity = 'https://chat.whatsapp.com/JaLf2Lf9uMiB1ZKzhrCnGp';

  useEffect(() => {
    const handleScroll = () => {
      // Show only when the user has scrolled down at least 120px
      if (window.scrollY > 120) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Initial check in case page is loaded already scrolled
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. Desktop Side Sticky Utility (Visible from md: upwards) */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="hidden md:flex flex-col gap-2 fixed right-0 top-1/2 -translate-y-1/2 z-40"
          >
            {/* Sticky Call Card */}
            <motion.div
              whileHover={{ x: -12 }}
              className="bg-transparent border border-transparent border-r-0 rounded-l-xl p-1.5 flex items-center group hover:bg-white hover:border-[#0D2C54]/10 hover:shadow-lg transition-all duration-300"
            >
              <a
                href={`tel:${contact1}`}
                className="w-10 h-10 rounded-lg bg-[#0D2C54] text-white flex items-center justify-center hover:bg-[#D31218] transition-colors shrink-0 shadow-md"
                title="Call D'code IAS"
              >
                <Phone className="w-4 h-4" />
              </a>
              <div className="text-[10px] max-w-0 opacity-0 overflow-hidden group-hover:max-w-[140px] group-hover:opacity-100 group-hover:ml-3 group-hover:mr-2 transition-all duration-300 ease-in-out whitespace-nowrap flex flex-col justify-center">
                <p className="font-space font-bold uppercase tracking-wider text-[#0D2C54] leading-tight">Call Academy</p>
                <p className="font-sans font-semibold text-gray-500 mt-0.5 leading-none">{contact1}</p>
              </div>
            </motion.div>

            {/* Sticky Inquiry Card */}
            <motion.div
              whileHover={{ x: -12 }}
              onClick={onInquiryClick}
              className="bg-transparent border border-transparent border-r-0 rounded-l-xl p-1.5 flex items-center group hover:bg-white hover:border-[#0D2C54]/10 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-[#D31218] text-white flex items-center justify-center hover:bg-[#A30D12] transition-colors shrink-0 shadow-md">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-[10px] max-w-0 opacity-0 overflow-hidden group-hover:max-w-[140px] group-hover:opacity-100 group-hover:ml-3 group-hover:mr-2 transition-all duration-300 ease-in-out whitespace-nowrap flex flex-col justify-center">
                <p className="font-space font-bold uppercase tracking-wider text-[#D31218] leading-tight">Inquire Now</p>
                <p className="font-sans font-semibold text-gray-500 mt-0.5 leading-none">Instant Callback</p>
              </div>
            </motion.div>

            {/* Sticky WhatsApp Community Card */}
            <motion.div
              whileHover={{ x: -12 }}
              className="bg-transparent border border-transparent border-r-0 rounded-l-xl p-1.5 flex items-center group hover:bg-white hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300"
            >
              <a
                href={whatsappCommunity}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-500 transition-colors shrink-0 shadow-md"
                title="Join WhatsApp Community"
              >
                <MessageCircle className="w-5 h-5 fill-white stroke-none" />
              </a>
              <div className="text-[10px] max-w-0 opacity-0 overflow-hidden group-hover:max-w-[140px] group-hover:opacity-100 group-hover:ml-3 group-hover:mr-2 transition-all duration-300 ease-in-out whitespace-nowrap flex flex-col justify-center">
                <p className="font-space font-bold uppercase tracking-wider text-emerald-600 leading-tight">WhatsApp</p>
                <p className="font-sans font-semibold text-gray-500 mt-0.5 leading-none">Join Community</p>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Mobile Bottom Sticky Navigation (Visible ONLY on sm: and below) */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden fixed bottom-5 left-4 right-4 z-40 bg-white/95 backdrop-blur-lg border border-gray-150 py-1.5 px-2.5 rounded-full flex items-center justify-between gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-w-[245px] mx-auto"
          >
            {/* Call Academy Option */}
            <a
              href={`tel:${contact1}`}
              className="w-8 h-8 rounded-full bg-[#0D2C54] hover:bg-[#112F5A] text-white flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-transform"
              title="Call Center"
            >
              <Phone className="w-3 h-3" />
            </a>

            {/* Quick Inquiry Option */}
            <button
              onClick={onInquiryClick}
              className="flex-1 inline-flex items-center justify-center gap-1 bg-[#D31218] hover:bg-[#A30D12] text-white py-1.5 px-3 rounded-full font-space text-[9px] font-extrabold uppercase tracking-wider shadow-sm active:scale-95 transition-transform"
            >
              <FileText className="w-3 h-3" />
              <span>Inquire</span>
            </button>

            {/* Mobile WhatsApp Shortcut */}
            <a
              href={whatsappCommunity}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-transform"
              aria-label="WhatsApp Community Chat"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white stroke-none" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
