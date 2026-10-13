import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  onExploreClick?: () => void;
  onBrochureClick?: () => void;
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
    <section id="home" className="relative pt-16 overflow-hidden min-h-[420px] sm:min-h-[520px] md:min-h-[600px] lg:min-h-[680px] flex items-center justify-center">
      {/* Background Image Slider with Rich Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentBgIndex}
            src={BACKGROUND_IMAGES[currentBgIndex]}
            alt={currentBgIndex === 6 ? "Sudhagaran Sir, Founder & Chief Mentor of D'code IAS Academy Best IAS Coaching Anna Nagar Chennai" : "D'code IAS Academy - Best IAS & UPSC Coaching Center in Anna Nagar Chennai"}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.9, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover object-center"
            fetchPriority={currentBgIndex === 0 ? 'high' : 'auto'}
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/75" />
      </div>

      {/* Slide Navigation Controls */}
      <button
        onClick={() => setCurrentBgIndex((prev) => (prev - 1 + BACKGROUND_IMAGES.length) % BACKGROUND_IMAGES.length)}
        className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-[#D31218] active:scale-95 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 hover:text-white transition-all duration-300 cursor-pointer shadow-lg outline-none"
        aria-label="Previous background"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </button>

      <button
        onClick={() => setCurrentBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length)}
        className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-[#D31218] active:scale-95 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 hover:text-white transition-all duration-300 cursor-pointer shadow-lg outline-none"
        aria-label="Next background"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </button>

      {/* Slide Index Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 select-none">
        <span className="font-mono text-xs text-white/90 font-bold tracking-wider">
          {currentBgIndex + 1} / {BACKGROUND_IMAGES.length}
        </span>
      </div>

      {/* Accessible SEO Heading */}
      <h1 className="sr-only">Best IAS Academy in Chennai - D'code IAS Academy</h1>
    </section>
  );
}
