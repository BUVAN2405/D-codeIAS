import React from 'react';
import { Calendar, MapPin, Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { ORIENTATION_EVENT_DETAILS } from '../utils/orientationConfig';
import OrientationIllustration from '../prelims-orientation-illustration.jpg';

interface PrelimsBannerCardProps {
  onOrientationClick?: () => void;
}

export default function PrelimsBannerCard({ onOrientationClick }: PrelimsBannerCardProps) {
  const handleAction = () => {
    if (onOrientationClick) {
      onOrientationClick();
    } else {
      window.location.href = ORIENTATION_EVENT_DETAILS.route;
    }
  };

  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] relative overflow-hidden">
      <div className="max-w-(--size-container-max) mx-auto">
        <div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#172554] via-[#2E286E] to-[#581C87] text-white p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(46,40,110,0.35)] border-2 border-white/20 transition-all duration-300"
        >
          {/* Ambient Lighting Gradients tailored to illustration's celestial blue & purple tones */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-400/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 right-10 w-96 h-96 bg-purple-500/35 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Grid Layout: Left Content (60%) + Right Illustration (40%) */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              
              {/* Event Live Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-amber-200 text-xs font-bold tracking-wide uppercase shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Special Orientation • UPSC Prelims 2027</span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-serif font-black tracking-tight text-white leading-[1.15]">
                  Ready to Conquer <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white">
                    UPSC Prelims 2027?
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-white/90 font-sans leading-relaxed max-w-xl">
                  Prelims is about the <strong className="text-white underline decoration-amber-300 decoration-2 underline-offset-2">right strategy & smart revision</strong>. Join <strong>Sudhagaran Sir & D’code Team</strong> for the complete 7-Dimension Strategy Session.
                </p>
              </div>

              {/* Event Pills */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-medium text-white/95">
                <div className="flex items-center gap-1.5 bg-black/35 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                  <Calendar className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>October 15, 2026</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/35 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                  <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>Periyar Hall, Chennai</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/35 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                  <Award className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>7-Dimension Strategy</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/35 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span>Free • Registration Mandatory</span>
                </div>
              </div>

              {/* CTA Action Area */}
              <div className="pt-2 sm:pt-3">
                <div className="aura aura-gold inline-flex">
                  <div
                    className="card bg-base-100 cursor-pointer select-none"
                    onClick={handleAction}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleAction();
                      }
                    }}
                    aria-label="Register for UPSC Prelims 2027 Orientation"
                  >
                    <div className="card-body px-6 sm:px-7 py-3 sm:py-3.5">
                      <p className="flex items-center gap-2 text-xs sm:text-sm font-black tracking-wider uppercase text-[#1E1B4B]">
                        <span>Register for Prelims</span>
                        <ArrowRight className="w-4 h-4 text-[#D31218]" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: User's Uploaded Education Vector Illustration */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="w-full max-w-[480px] lg:max-w-none relative group">
                <div className="relative overflow-hidden rounded-2xl border-2 border-white/30 shadow-[0_16px_40px_rgba(15,23,42,0.45)] bg-white/10 backdrop-blur-xs transition-transform duration-300 hover:scale-[1.02]">
                  <img
                    src={OrientationIllustration}
                    alt="UPSC Prelims 2027 Conquer Orientation - D'code IAS Academy"
                    className="w-full h-auto object-cover rounded-2xl block"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/10 pointer-events-none rounded-2xl" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
