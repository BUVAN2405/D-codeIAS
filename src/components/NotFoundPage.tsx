import React from 'react';
import { Home, Search, Compass, BookOpen, PhoneCall, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export default function NotFoundPage({ onGoHome, onNavigateSection }: NotFoundPageProps) {
  const handleSectionClick = (id: string) => {
    onGoHome();
    if (onNavigateSection) {
      setTimeout(() => onNavigateSection(id), 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D2C54] text-white flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background Decorative Accent Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full filter blur-3xl pointer-events-none -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/20 rounded-full filter blur-3xl pointer-events-none -ml-32 -mb-32"></div>

      <div className="max-w-2xl w-full text-center relative z-10 bg-white/5 backdrop-blur-xl border border-white/15 p-8 md:p-12 rounded-2xl shadow-2xl">
        {/* Large 404 Header Badge */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-gold/20 text-brand-gold font-serif text-4xl font-extrabold mb-6 border border-brand-gold/30 shadow-inner">
          404
        </div>

        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">
          Route Not Found
        </h1>

        <p className="text-slate-300 text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
          Lost in your UPSC & Civil Services preparation map? The page or document you are looking for has been moved or does not exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-gold text-brand-navy font-semibold px-6 py-3.5 rounded-lg text-sm hover:bg-yellow-400 transition-all shadow-lg hover:shadow-yellow-500/20 active:scale-95"
          >
            <Home className="w-4 h-4" />
            Back to Academy Homepage
          </button>
          <button
            onClick={() => handleSectionClick('courses')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/10 text-white font-medium px-6 py-3.5 rounded-lg text-sm hover:bg-white/20 transition-all border border-white/10"
          >
            <BookOpen className="w-4 h-4 text-brand-gold" />
            Explore Courses Offered
          </button>
        </div>

        {/* Quick Nav Directory */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <button
            onClick={() => handleSectionClick('courses')}
            className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 flex items-center gap-2 text-xs text-slate-300 font-medium"
          >
            <Compass className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
            <span>Programs</span>
          </button>
          <button
            onClick={() => handleSectionClick('faculty')}
            className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 flex items-center gap-2 text-xs text-slate-300 font-medium"
          >
            <Search className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
            <span>Faculty</span>
          </button>
          <button
            onClick={() => handleSectionClick('contact')}
            className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 flex items-center gap-2 text-xs text-slate-300 font-medium"
          >
            <PhoneCall className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
            <span>Contact Us</span>
          </button>
          <button
            onClick={onGoHome}
            className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 flex items-center gap-2 text-xs text-slate-300 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
