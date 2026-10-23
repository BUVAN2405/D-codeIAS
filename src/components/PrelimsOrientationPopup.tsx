import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Users, 
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
  Award,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { submitInquiryApi } from '../services/api';

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

interface PrelimsOrientationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function PrelimsOrientationPopup({ isOpen, onClose, onSubmitSuccess }: PrelimsOrientationPopupProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    prepStatus: 'Beginner (2027 Target)',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for entry verification.');
      return;
    }

    setLoading(true);

    try {
      const response = await submitInquiryApi({
        fullName: formData.fullName.trim(),
        phone: cleanPhone,
        email: formData.email.trim() || undefined,
        course: 'prelims_conquer_2027',
        formType: 'registration',
        message: `[UPSC PRELIMS 2027 ORIENTATION - OCT 15 @ PERIYAR HALL] Target: ${formData.prepStatus}. Queries / Notes: ${formData.notes.trim() || 'Direct seat registration'}`
      });

      setLoading(false);

      if (response && response.success) {
        setIsSuccess(true);
        if (onSubmitSuccess) onSubmitSuccess();
      } else {
        setErrorMessage(response.error || 'Failed to submit registration. Please call 9600060349.');
      }
    } catch (err: any) {
      console.error('[ORIENTATION FORM SUBMISSION ERROR]', err);
      setLoading(false);
      setErrorMessage('Network or server error. Please call 9600060349 / 9600060393 directly.');
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      prepStatus: 'Beginner (2027 Target)',
      notes: ''
    });
    onClose();
  };

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
            <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-grow text-slate-800 text-sm">
              
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
              <div className="bg-gradient-to-r from-[#0D2C54]/5 via-[#0D2C54]/10 to-[#D31218]/10 rounded-xl p-3 border border-[#0D2C54]/15 text-center">
                <p className="text-xs sm:text-sm font-bold text-[#0D2C54] font-serif">
                  🎯 One orientation. One strategy. A complete roadmap to Prelims.
                </p>
                <div className="mt-0.5 text-xs text-slate-600">
                  <span>Don’t just prepare for Prelims. </span>
                  <strong className="text-[#D31218] font-extrabold uppercase tracking-wide">
                    Prepare to conquer it.
                  </strong>
                </div>
              </div>

              {/* REGISTRATION FORM (Integrated Native Submission & Email Dispatch) */}
              <div className="bg-gradient-to-br from-[#0D2C54] via-[#10325D] to-[#0A2242] text-white rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden border-2 border-[#D31218]">
                <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6 w-32 h-32 bg-[#D31218]/25 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  {/* Form Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-2.5 mb-3.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-[#D31218] text-[10px] font-extrabold rounded-full uppercase tracking-wider text-white shadow-sm">
                        👉 REGISTRATION MUST
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white font-serif">
                        Reserve Your Seat
                      </h4>
                    </div>
                    <span className="text-[10px] text-amber-300 font-semibold font-space">
                      October 15 | Periyar Hall
                    </span>
                  </div>

                  {isSuccess ? (
                    /* Success Confirmation State */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-5 text-center border border-emerald-400/40 space-y-3"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-400/40 shadow-inner">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div>
                        <h5 className="text-lg font-bold text-white font-serif">
                          Registration Confirmed!
                        </h5>
                        <p className="text-xs text-slate-200 mt-1 max-w-sm mx-auto leading-relaxed">
                          Thank you, <strong className="text-white">{formData.fullName}</strong>. Your seat reservation for the <strong className="text-amber-300">UPSC Prelims 2027 Conquer Orientation</strong> has been received and dispatched to our mentorship team.
                        </p>
                      </div>

                      <div className="bg-black/20 rounded-lg p-2.5 text-[11px] text-slate-300 border border-white/10 text-left max-w-sm mx-auto space-y-1">
                        <p>📍 <strong>Venue:</strong> Periyar Hall, Chennai</p>
                        <p>🗓️ <strong>Date:</strong> October 15, 2026</p>
                        <p>📞 <strong>Coordination Phone:</strong> +91 {formData.phone}</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetAndClose}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-md transition-colors cursor-pointer"
                      >
                        Done & Close
                      </button>
                    </motion.div>
                  ) : (
                    /* Native Registration Form */
                    <form onSubmit={handleSubmit} className="space-y-3">
                      {errorMessage && (
                        <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Candidate Full Name */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-200 mb-1 font-space">
                            Full Name <span className="text-[#D31218]">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              required
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              placeholder="Enter your name"
                              className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all"
                            />
                          </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-200 mb-1 font-space">
                            Mobile / WhatsApp <span className="text-[#D31218]">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="10-digit mobile number"
                              className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Email Address */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-200 mb-1 font-space">
                            Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                          </label>
                          <div className="relative">
                            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="aspirant@gmail.com"
                              className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all"
                            />
                          </div>
                        </div>

                        {/* Target Stage */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-200 mb-1 font-space">
                            Preparation Stage
                          </label>
                          <select
                            value={formData.prepStatus}
                            onChange={(e) => setFormData({ ...formData, prepStatus: e.target.value })}
                            className="w-full bg-[#0D2C54] border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all cursor-pointer"
                          >
                            <option value="Beginner (2027 Target)" className="bg-[#0D2C54] text-white">Beginner (UPSC 2027 Target)</option>
                            <option value="1st Attempt Aspirant" className="bg-[#0D2C54] text-white">1st Attempt Aspirant</option>
                            <option value="Repeat / Revision Aspirant" className="bg-[#0D2C54] text-white">Repeat / Revision Aspirant</option>
                            <option value="College Student (Foundation)" className="bg-[#0D2C54] text-white">College Student (Foundation)</option>
                          </select>
                        </div>
                      </div>

                      {/* Optional Notes / Questions */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-200 mb-1 font-space">
                          Any Specific Query for Sudhagaran Sir? <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="E.g., CSAT balance, GS subject prioritization, or time management..."
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all"
                        />
                      </div>

                      {/* Submit CTA */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D31218] via-red-600 to-[#D31218] hover:from-red-600 hover:to-rose-700 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase shadow-xl transition-all flex items-center justify-center gap-2 border border-white/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Confirming Your Seat & Sending Mail...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Reserve Seat for October 15 Orientation</span>
                          </>
                        )}
                      </button>

                      <p className="text-[10px] text-slate-300 text-center mt-1">
                        🔒 Direct academy registration. Details are transmitted via email & stored securely for admission coordinators.
                      </p>
                    </form>
                  )}
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
                    <Phone className="w-3 h-3 text-[#D31218]" /> For Direct Enquiry:
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

              <span className="text-[11px] text-slate-500 font-medium">
                Periyar Hall • Limited Seats
              </span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
