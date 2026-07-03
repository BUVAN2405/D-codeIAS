import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Download, ChevronLeft, ChevronRight } from 'lucide-react';

import ceoPhoto from '../Ceo.jpeg';
import academyLogo from '../LOGO.jpeg';
import img1 from '../1.jpeg';
import img2 from '../2.jpeg';
import img3 from '../3.jpeg';
import img4 from '../4.jpeg';
import img5 from '../5.jpeg';

const BACKGROUND_IMAGES = [
  img1,
  img2,
  img3,
  academyLogo,
  img4,
  img5,
  ceoPhoto
];

interface HeroProps {
  onExploreClick: () => void;
  onBrochureClick: () => void;
}

export default function Hero({ onExploreClick, onBrochureClick }: HeroProps) {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative pt-16 overflow-hidden">
      {/* Background Image Slider with Rich Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentBgIndex}
            src={BACKGROUND_IMAGES[currentBgIndex]}
            alt="D'code Campus Atmosphere"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.9, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/75" />
      </div>

      {/* Slide Navigation Controls */}
      <button
        onClick={() => setCurrentBgIndex((prev) => (prev - 1 + BACKGROUND_IMAGES.length) % BACKGROUND_IMAGES.length)}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/45 hover:bg-[#D31218] active:scale-95 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 hover:text-white transition-all duration-300 cursor-pointer shadow-lg outline-none"
        aria-label="Previous background"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      <button
        onClick={() => setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length)}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/45 hover:bg-[#D31218] active:scale-95 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 hover:text-white transition-all duration-300 cursor-pointer shadow-lg outline-none"
        aria-label="Next background"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Slide Index Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 select-none">
        <span className="font-mono text-xs text-white/90 font-bold tracking-wider">
          {currentBgIndex + 1} / {BACKGROUND_IMAGES.length}
        </span>
      </div>

      {/* Main Interactive Container */}
      <div className="relative z-10 max-w-(--size-container-max) mx-auto px-4 md:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24 flex items-center justify-center min-h-[500px] lg:min-h-[580px]">
        
        {/* Editorial Text Content with Premium Liquid Morphic Glass Card */}
        <div className="max-w-3xl mx-auto text-center p-6 sm:p-10 md:p-12 rounded-3xl bg-black/35 backdrop-blur-md border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] space-y-6 flex flex-col items-center relative overflow-hidden">
          {/* Subtle liquid organic background glows inside card */}
          <div className="absolute -top-20 -left-20 w-44 h-44 bg-[#D31218]/15 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-[#0D2C54]/30 rounded-full filter blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#D31218]/25 border border-[#D31218]/35 rounded-full text-[#ffc6c6] font-space text-[11px] uppercase tracking-wider font-semibold z-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D31218] animate-pulse" />
            Admission Open for 2026-27
          </motion.div>

          {/* Main Title of Academy */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight z-10"
          >
            We Simplify Your <span className="text-[#fd565a]">IAS Journey.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-100 font-sans font-medium leading-relaxed max-w-2xl z-10"
          >
            Clarity, systematic course mapping, and intensive answer development under the personal guidance of elite mentors led by Sudhagaran Sir (Former Mission Director, Naan Mudhalvan).
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-row justify-center gap-2.5 sm:gap-4 w-full sm:w-auto pt-2 z-10"
          >
            <button
              onClick={onExploreClick}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#D31218] hover:bg-[#A30D12] text-white font-space text-[10px] sm:text-xs font-bold uppercase tracking-wider py-3.5 px-6 sm:px-8 rounded transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-[#D31218]/30 border-none flex-1 sm:flex-none"
            >
              Explore Courses
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            </button>

            <button
              onClick={onBrochureClick}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-transparent hover:bg-white/5 text-white border border-white/30 font-space text-[10px] sm:text-xs font-bold uppercase tracking-wider py-3.5 px-6 sm:px-8 rounded transition-all active:scale-[0.98] cursor-pointer backdrop-blur-xs flex-1 sm:flex-none"
            >
              Brochure
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
            </button>
          </motion.div>
        </div>

      </div>

    </section>
  );
}
