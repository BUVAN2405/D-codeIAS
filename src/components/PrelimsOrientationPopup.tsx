import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  ExternalLink, 
  Phone, 
  Globe, 
  Send, 
  Sparkles, 
  Target, 
  BookOpen, 
  BrainCircuit, 
  Newspaper, 
  FileText, 
  RotateCcw, 
  Award
} from 'lucide-react';

export const ORIENTATION_HASHTAGS = [
  "#UPSC2027",
  "#UPSCPrelims2027",
  "#UPSCPrelims",
  "#UPSCPreparation",
  "#UPSCStrategy",
  "#PrelimsStrategy",
  "#UPSC2027Preparation",
  "#UPSCPreparation2027",
  "#UPSCJourney",
  "#UPSCGuidance",
  "#UPSCMentorship",
  "#UPSCaspirants",
  "#IASAspirants",
  "#IASPreparation",
  "#CivilServicesExamination",
  "#UPSCStrategy2027",
  "#CSAT",
  "#UPSCCurrentAffairs",
  "#UPSCPreviousYearQuestions",
  "#UPSCRevision",
  "#PrelimsConquer",
  "#DcodeIAS",
  "#DcodeIASAcademy",
  "#SudhagaranSir",
  "#ChennaiUPSC",
  "#UPSCChennai",
  "#UPSCOrientation",
  "#UPSCClasses",
  "#IASCoaching"
];

export const REGISTRATION_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc_gdib-e9G5tat-QSpEw99xK6pRqccBrUtYaGZ9uWrW1GytA/viewform?usp=publish-editor";

interface PrelimsOrientationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrelimsOrientationPopup({ isOpen, onClose }: PrelimsOrientationPopupProps) {
  // Close with Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while modal is active on mobile devices
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const strategyDimensions = [
    {
      title: "GS Strategy",
      desc: "What to study & how to prioritise",
      icon: BookOpen,
      accent: "border-amber-200 bg-amber-50/80 text-amber-900"
    },
    {
      title: "CSAT Strategy",
      desc: "Approach, practice & time management",
      icon: BrainCircuit,
      accent: "border-blue-200 bg-blue-50/80 text-blue-900"
    },
    {
      title: "Current Affairs",
      desc: "How to manage the vast information flow",
      icon: Newspaper,
      accent: "border-emerald-200 bg-emerald-50/80 text-emerald-900"
    },
    {
      title: "PYQs",
      desc: "How to decode and solve UPSC questions",
      icon: FileText,
      accent: "border-purple-200 bg-purple-50/80 text-purple-900"
    },
    {
      title: "Revision Strategy",
      desc: "Retention, recall & repeated revision",
      icon: RotateCcw,
      accent: "border-rose-200 bg-rose-50/80 text-rose-900"
    },
    {
      title: "Test Strategy",
      desc: "How to analyse mistakes and improve",
      icon: Target,
      accent: "border-indigo-200 bg-indigo-50/80 text-indigo-900"
    },
    {
      title: "Prelims Planning",
      desc: "A roadmap from preparation to examination",
      icon: Award,
      accent: "border-teal-200 bg-teal-50/80 text-teal-900"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="orientation-title"
        >
          {/* Overlay backdrop click */}
          <div 
            className="fixed inset-0 cursor-pointer" 
            onClick={onClose} 
            aria-hidden="true" 
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-2 border-brand-gold/30 overflow-hidden z-10 max-h-[92vh] flex flex-col my-auto"
          >
            {/* Close button in right top corner */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-slate-900/85 hover:bg-[#D31218] text-white transition-all duration-200 shadow-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 group cursor-pointer"
              aria-label="Close orientation card"
              title="Close (Esc)"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-[#0D2C54] via-[#123663] to-[#0A2242] text-white p-5 sm:p-6 pb-4 border-b-4 border-[#D31218] flex-shrink-0">
              {/* Background Ambient Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D31218]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-10 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 pr-9">
                {/* Urgent Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D31218] text-white text-[11px] font-bold uppercase tracking-wider mb-2.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  🚨 UPSC PRELIMS 2027
                </div>

                <h2 
                  id="orientation-title"
                  className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug font-serif"
                >
                  ARE YOU READY TO CONQUER?
                </h2>

                <p className="text-white/90 text-xs sm:text-sm font-sans mt-2 leading-relaxed">
                  Prelims is not just about studying more. It is about having the <span className="text-amber-300 font-semibold underline decoration-amber-400 decoration-2 underline-offset-2">right strategy, smart revision, and effective execution</span>.
                </p>
              </div>

              {/* Event Badge Details */}
              <div className="mt-4 pt-3.5 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-xs px-3 py-2 rounded-lg border border-white/10">
                  <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
                  <div>
                    <span className="text-white/70 block text-[10px] uppercase font-space">Date & Venue</span>
                    <strong className="text-white font-semibold text-xs">October 15 | Periyar Hall</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-xs px-3 py-2 rounded-lg border border-white/10">
                  <Users className="w-4 h-4 text-amber-300 shrink-0" />
                  <div>
                    <span className="text-white/70 block text-[10px] uppercase font-space">Orientation Mentors</span>
                    <strong className="text-white font-semibold text-xs">Sudhagaran Sir & D’code Team</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-grow text-slate-800 text-sm">
              
              {/* Introduction Callout */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 sm:p-4 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Join D’code Prelims Conquer Orientation
                    </h3>
                    <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                      Get a <strong className="text-[#0D2C54]">complete, practical Prelims strategy</strong> covering every crucial dimension:
                    </p>
                  </div>
                </div>
              </div>

              {/* 7 Strategy Dimensions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-space">
                    Crucial Dimensions Covered
                  </span>
                  <span className="text-[10px] text-[#D31218] font-bold">
                    7 Essential Pillars
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {strategyDimensions.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div 
                        key={idx}
                        className={`p-2.5 rounded-lg border flex items-start gap-2.5 transition-all hover:shadow-xs ${item.accent} ${idx === 6 ? 'sm:col-span-2' : ''}`}
                      >
                        <div className="p-1 rounded bg-white/90 shadow-xs shrink-0 text-slate-700">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <strong className="block text-slate-900 text-xs font-semibold">
                            📌 {item.title}
                          </strong>
                          <span className="text-slate-600 text-[11px] leading-tight block mt-0.5">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Motivational Banner */}
              <div className="bg-gradient-to-r from-[#0D2C54]/5 via-[#0D2C54]/10 to-[#D31218]/10 rounded-xl p-3.5 border border-[#0D2C54]/15 text-center">
                <p className="text-xs sm:text-sm font-bold text-[#0D2C54] font-serif">
                  🎯 One orientation. One strategy. A complete roadmap to Prelims.
                </p>
                <div className="mt-1 text-xs text-slate-600">
                  <span>Don’t just prepare for Prelims. </span>
                  <strong className="text-[#D31218] font-extrabold uppercase tracking-wide">
                    Prepare to conquer it.
                  </strong>
                </div>
              </div>

              {/* REGISTRATION MUST (Primary Action) */}
              <div className="bg-[#0D2C54] text-white rounded-xl p-4 sm:p-5 text-center shadow-lg relative overflow-hidden border-2 border-[#D31218]">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-[#D31218]/30 rounded-full blur-xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D31218] text-[11px] font-extrabold rounded-full uppercase tracking-wider mb-2 text-white shadow-sm">
                    <span>👉 REGISTRATION MUST</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white mb-1.5 font-serif">
                    Take The First Step Towards Prelims 2027
                  </h4>
                  <p className="text-slate-200 text-xs mb-3.5 max-w-md mx-auto leading-relaxed">
                    Entry to Periyar Hall orientation requires prior registration. Click below to submit your details on the official Google Form:
                  </p>

                  <a
                    href={REGISTRATION_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#D31218] to-red-600 text-white font-extrabold text-sm shadow-xl hover:from-red-600 hover:to-rose-700 active:scale-[0.98] transition-all transform hover:-translate-y-0.5 border border-white/20"
                  >
                    <span>Click Here to Register via Google Form</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Academy Identity & Contact details */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-slate-200 pb-2.5 mb-2.5">
                  <div>
                    <div className="font-bold text-[#0D2C54] flex items-center gap-1 text-xs">
                      🎓 D’code IAS Academy
                    </div>
                    <span className="text-[10px] text-[#D31218] font-bold tracking-wider uppercase font-space">
                      WE SIMPLIFY IAS JOURNEY
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href="https://t.me/dcodesudh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100 font-medium text-[11px] border border-sky-200 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      Telegram: @dcodesudh
                    </a>

                    <a
                      href="https://www.decodeias.com"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-[11px] border border-slate-300 transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                      www.decodeias.com
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#D31218]" /> For Enquiry:
                  </span>
                  <div className="flex items-center gap-2 font-mono font-semibold">
                    <a href="tel:9600060349" className="text-[#0D2C54] hover:text-[#D31218] underline decoration-dotted">
                      9600060349
                    </a>
                    <span>/</span>
                    <a href="tel:9600060393" className="text-[#0D2C54] hover:text-[#D31218] underline decoration-dotted">
                      9600060393
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions Bar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-1.5 transition-colors cursor-pointer"
              >
                Close Card
              </button>

              <a
                href={REGISTRATION_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D31218] hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <span>Register on Google Form</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
