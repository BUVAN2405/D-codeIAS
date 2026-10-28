import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Landmark, GraduationCap, ChevronRight, ShieldCheck } from 'lucide-react';
import LogoImage from '../LOGO.jpeg';
import { isOrientationExpired } from '../utils/orientationConfig';

interface NavbarProps {
  onEnrollClick: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onAdminClick?: () => void;
  onOrientationClick?: () => void;
  onPrelimsConquerClick?: () => void;
  onPcmClick?: () => void;
  onMenuToggle?: (isOpen: boolean) => void;
}

export default function Navbar({
  onEnrollClick,
  onNavigate,
  activeSection,
  onAdminClick,
  onOrientationClick,
  onPrelimsConquerClick,
  onPcmClick,
  onMenuToggle
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isExpired = isOrientationExpired();

  useEffect(() => {
    onMenuToggle?.(isMobileMenuOpen);
  }, [isMobileMenuOpen, onMenuToggle]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Home', id: 'home' },
    { label: 'Courses', id: 'courses' },
    { label: "Enquiry '27", id: 'enquiry-27' },
    { label: "PCM '28", id: 'pcm-2028' },
    { label: 'Faculty', id: 'faculty' },
    { label: 'Blog', id: 'blog' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleItemClick = (id: string) => {
    if (id === 'enquiry-27') {
      if (onPrelimsConquerClick) {
        onPrelimsConquerClick();
      } else {
        window.location.href = '/prelims-conquer-2027';
      }
      setIsMobileMenuOpen(false);
      return;
    }
    if (id === 'pcm-2028') {
      if (onPcmClick) {
        onPcmClick();
      } else {
        window.location.href = '/pcm-batch-2028';
      }
      setIsMobileMenuOpen(false);
      return;
    }
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      >
        {/* Dynamic Moving Ticker of Current Programs */}
        <div className="bg-[#8A0004] text-white border-b border-red-900/60 py-1.5 px-3 sm:px-6 relative overflow-hidden flex items-center justify-between gap-3 text-xs shadow-md">
          {/* Tag Badge */}
          <div className="flex items-center gap-1.5 shrink-0 z-10 bg-[#8A0004] pr-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/35 border border-white/20 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-300 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              Current Programs
            </span>
          </div>

          {/* Dynamic Moving Ticker Track (Continuous Marquee) */}
          <div className="relative overflow-hidden flex-1 h-5 flex items-center">
            <div className="whitespace-nowrap animate-marquee flex items-center gap-10 text-[11px] sm:text-xs text-white font-medium select-none">
              {/* Program 1 */}
              <button
                type="button"
                onClick={() => {
                  if (onPrelimsConquerClick) onPrelimsConquerClick();
                  else window.location.href = '/prelims-conquer-2027';
                }}
                className="inline-flex items-center gap-2 hover:text-amber-200 transition-colors cursor-pointer text-left"
              >
                <span className="font-bold text-amber-300">1. Prelims Conquer Test Series - 2027:</span>
                <span>43 UPSC-Standard Tests & Mentorship under Sudhagaran Sir</span>
                <span className="px-1.5 py-0.2 rounded bg-red-700/80 text-[9px] uppercase font-bold text-white border border-red-400/40">Admission Open</span>
              </button>

              <span className="text-amber-300/80 font-bold">•</span>

              {/* Program 2 */}
              <button
                type="button"
                onClick={() => {
                  if (onPcmClick) onPcmClick();
                  else onEnrollClick();
                }}
                className="inline-flex items-center gap-2 hover:text-amber-200 transition-colors cursor-pointer text-left"
              >
                <span className="font-bold text-amber-300">2. PCM UPSC Batch 2028:</span>
                <span>1.5-Year Prelims-Cum-Mains Foundation Course</span>
                <span className="px-1.5 py-0.2 rounded bg-red-700/80 text-[9px] uppercase font-bold text-white border border-red-400/40">Admission Open</span>
              </button>

              <span className="text-amber-300/80 font-bold">•</span>

              {/* Program 1 Duplicate for smooth loop */}
              <button
                type="button"
                onClick={() => {
                  if (onPrelimsConquerClick) onPrelimsConquerClick();
                  else window.location.href = '/prelims-conquer-2027';
                }}
                className="inline-flex items-center gap-2 hover:text-amber-200 transition-colors cursor-pointer text-left"
              >
                <span className="font-bold text-amber-300">1. Prelims Conquer Test Series - 2027:</span>
                <span>43 UPSC-Standard Tests & Mentorship under Sudhagaran Sir</span>
                <span className="px-1.5 py-0.2 rounded bg-red-700/80 text-[9px] uppercase font-bold text-white border border-red-400/40">Admission Open</span>
              </button>

              <span className="text-amber-300/80 font-bold">•</span>

              {/* Program 2 Duplicate for smooth loop */}
              <button
                type="button"
                onClick={() => {
                  if (onPcmClick) onPcmClick();
                  else onEnrollClick();
                }}
                className="inline-flex items-center gap-2 hover:text-amber-200 transition-colors cursor-pointer text-left"
              >
                <span className="font-bold text-amber-300">2. PCM UPSC Batch 2028:</span>
                <span>1.5-Year Prelims-Cum-Mains Foundation Course</span>
                <span className="px-1.5 py-0.2 rounded bg-red-700/80 text-[9px] uppercase font-bold text-white border border-red-400/40">Admission Open</span>
              </button>
            </div>
          </div>

          {/* Right Action Button */}
          <button
            onClick={onEnrollClick}
            className="shrink-0 z-10 px-3 py-1 rounded-full bg-white hover:bg-amber-100 text-[#8A0004] text-[10px] font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer select-none"
          >
            Apply Now
          </button>
        </div>

        {/* Main Navbar */}
        <div className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0D2C54]/95 text-white shadow-lg py-2.5 backdrop-blur-md border-b border-[#D31218]/20'
            : 'bg-[#0D2C54] text-white py-3 md:py-4 border-b border-white/5'
        }`}>
          <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8 flex items-center justify-between">
            {/* Logo Brand Title */}
            <button
              onClick={() => handleItemClick('home')}
              className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            >
              <img 
                src={LogoImage} 
                alt="D'code IAS Academy Logo" 
                className="w-10 h-10 shrink-0 rounded-full object-cover border border-white/15 group-hover:scale-105 transition-transform duration-200 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 
                  className="font-serif text-base sm:text-lg font-bold tracking-wide leading-4"
                  style={{ color: '#fafbff', borderColor: '#ffffff' }}
                >
                  D'code IAS
                </h1>
                <p className="font-space text-[9px] uppercase tracking-widest text-gray-300 mt-0.5">
                  Academy • ESTD 2026
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-5 lg:gap-7">
              {menuItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer relative py-1.5 focus:outline-none font-space flex items-center gap-1.5 ${
                      isActive ? 'text-white font-bold' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.id === 'enquiry-27' && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-tight">
                        2027
                      </span>
                    )}
                    {item.id === 'pcm-2028' && (
                      <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-tight">
                        2028
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D31218]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Action CTA & Burger Menu Toggle */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  if (onPrelimsConquerClick) onPrelimsConquerClick();
                  else window.location.href = '/prelims-conquer-2027';
                }}
                className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-amber-700 text-white font-space text-[11px] font-bold uppercase tracking-wider py-2 px-3 rounded shadow-xs transition-all duration-200 cursor-pointer active:scale-95 border border-white/20"
                title="Explore UPSC Prelims Conquer 2027 Course & 43 Tests"
              >
                <span className="hidden xs:inline">Prelims Conquer 2027</span>
                <span className="xs:hidden">Conquer '27</span>
              </button>

              <button
                onClick={onEnrollClick}
                className="hidden lg:inline-flex bg-[#D31218] hover:bg-[#A30D12] text-white font-space text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded transition-all active:scale-95 shadow-md shadow-black/10 duration-200 cursor-pointer border-none"
              >
                Inquire Now
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-white/10 text-white focus:outline-none transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
                title="Menu & Admin Options"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div id="mobile-menu-drawer" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs">
            {/* Backdrop click close */}
            <div className="absolute inset-0" onClick={() => setIsMobileMenuOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-20 right-4 w-[300px] sm:w-[340px] bg-white text-black p-5 sm:p-6 rounded-3xl border-2 border-black shadow-[0_24px_60px_rgba(0,0,0,0.4)] flex flex-col justify-between overflow-hidden z-50 max-h-[88vh] overflow-y-auto"
            >
              <div>
                <span className="font-space text-[10px] text-black font-extrabold uppercase tracking-widest block mb-3 border-b border-black/15 pb-2">
                  Navigational Directory
                </span>
                
                <div className="space-y-1.5">
                  {menuItems.map((item, index) => {
                    const isActive = activeSection === item.id;
                    const paddedIndex = String(index + 1).padStart(2, '0');
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full text-left py-2 px-3 rounded-xl font-space text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-between group bg-black text-white hover:bg-neutral-800 border ${
                          isActive
                            ? 'border-amber-400 ring-1 ring-amber-400 shadow-sm'
                            : 'border-neutral-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`font-mono text-[10px] ${isActive ? 'text-amber-400 font-bold' : 'text-gray-400'}`}>
                            {paddedIndex}
                          </span>
                          <span className="text-white group-hover:text-amber-100 flex items-center gap-1.5">
                            {item.label}
                            {item.id === 'enquiry-27' && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-400 text-black text-[8px] font-black">
                                2027
                              </span>
                            )}
                            {item.id === 'pcm-2028' && (
                              <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[8px] font-black">
                                2028
                              </span>
                            )}
                          </span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? 'rotate-90 text-amber-400' : 'text-gray-400 group-hover:text-white group-hover:translate-x-0.5'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-black/15 mt-4 pt-3.5 pb-1 space-y-2">
                {/* Special Button (Prelims Conquer 2027) with Golden background and white text */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onPrelimsConquerClick) onPrelimsConquerClick();
                    else window.location.href = '/prelims-conquer-2027';
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-amber-700 text-white font-space text-[11px] font-extrabold uppercase tracking-wider py-2.5 px-4 rounded-xl text-center transition-all cursor-pointer block border border-amber-400/60 shadow-md flex items-center justify-center active:scale-95"
                >
                  <span>Prelims Conquer 2027</span>
                </button>

                {/* Special Button (PCM UPSC Batch 2028) with Crimson Red background and white text */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onPcmClick) onPcmClick();
                    else window.location.href = '/pcm-batch-2028';
                  }}
                  className="w-full bg-gradient-to-r from-red-700 via-[#8A0004] to-red-800 hover:from-red-800 hover:to-[#700003] text-white font-space text-[11px] font-extrabold uppercase tracking-wider py-2.5 px-4 rounded-xl text-center transition-all cursor-pointer block border border-red-500/50 shadow-md flex items-center justify-center active:scale-95"
                >
                  <span>PCM UPSC Batch 2028</span>
                </button>

                {/* Enroll Now button with Green background and white text */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onEnrollClick();
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-space text-[11px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl text-center transition-all cursor-pointer block border border-emerald-700 shadow-sm flex items-center justify-center active:scale-95"
                >
                  Enroll Now
                </button>

                {/* Admin Access Button in Blue Color */}
                <a
                  href="/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onAdminClick) onAdminClick();
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-space text-[11px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl text-center transition-all cursor-pointer border border-blue-700 shadow-sm flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  Admin Access
                </a>

                <div className="flex flex-col items-center mt-2.5 gap-0.5">
                  <p className="text-[9px] text-gray-700 font-sans">
                    Admissions: <span className="font-mono text-black font-bold">+91 96000 60393</span>
                  </p>
                  <p className="text-[8px] text-gray-500 font-sans font-medium">
                    D'code IAS Academy
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
