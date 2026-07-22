import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Landmark, GraduationCap, ChevronRight, ShieldCheck } from 'lucide-react';
import LogoImage from '../LOGO.jpeg';

interface NavbarProps {
  onEnrollClick: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onAdminClick?: () => void;
}

export default function Navbar({ onEnrollClick, onNavigate, activeSection, onAdminClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { label: 'Faculty', id: 'faculty' },
    { label: 'Blog', id: 'blog' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0D2C54]/95 text-white shadow-lg py-3 backdrop-blur-md border-b border-[#D31218]/20'
            : 'bg-[#0D2C54] text-white py-4 md:py-5 border-b border-white/5'
        }`}
      >
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
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer relative py-1.5 focus:outline-none font-space text-white/90 hover:text-[#D31218]`}
                >
                  {item.label}
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
          <div className="flex items-center gap-3">
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
      </motion.header>

      {/* Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div id="mobile-menu-drawer" className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs">
            {/* Backdrop click close */}
            <div className="absolute inset-0" onClick={() => setIsMobileMenuOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-20 right-4 w-[280px] sm:w-[320px] bg-[#0D2C54]/95 backdrop-blur-xl text-white p-6 rounded-3xl border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden"
            >
              <div>
                <span className="font-space text-[10px] text-gray-300 uppercase tracking-widest block mb-4 border-b border-white/10 pb-2">
                  Navigational Directory
                </span>
                
                <div className="space-y-1">
                  {menuItems.map((item, index) => {
                    const isActive = activeSection === item.id;
                    const paddedIndex = String(index + 1).padStart(2, '0');
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full text-left py-2.5 px-3.5 rounded-xl font-space text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-between group ${
                          isActive
                            ? 'bg-[#D31218]/12 text-red-200 border border-[#D31218]/25 shadow-xs'
                            : 'text-white/80 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-[10px] ${isActive ? 'text-red-300' : 'text-[#D31218]/60'}`}>
                            {paddedIndex}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? 'rotate-90 text-red-300' : 'text-white/30 group-hover:translate-x-0.5'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
 
              <div className="border-t border-white/10 mt-6 pt-5 pb-1 space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onEnrollClick();
                  }}
                  className="w-full bg-[#D31218] hover:bg-[#A30D12] text-white font-space text-[11px] font-bold uppercase tracking-wider py-3 px-4 rounded-xl text-center transition-all cursor-pointer block border-none shadow-md shadow-[#D31218]/20"
                >
                  Enroll Now
                </button>

                {onAdminClick && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onAdminClick();
                    }}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-space text-[11px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl text-center transition-all cursor-pointer border border-white/15 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Admin Dashboard
                  </button>
                )}

                <div className="flex flex-col items-center mt-3.5 gap-0.5">
                  <p className="text-[9px] text-gray-300 font-sans">
                    Admissions: <span className="font-mono text-white font-semibold">+91 96000 60393</span>
                  </p>
                  <p className="text-[8px] text-gray-400 font-sans">
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
