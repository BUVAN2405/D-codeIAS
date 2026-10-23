import React, { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowLeft, 
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
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Globe, 
  ChevronRight, 
  ShieldCheck,
  Clock
} from 'lucide-react';
import { submitInquiryApi } from '../services/api';
import LogoImage from '../LOGO.jpeg';
import { isOrientationExpired } from '../utils/orientationConfig';

interface PrelimsOrientationPageProps {
  onGoHome: () => void;
  onSubmitSuccess?: () => void;
}

export default function PrelimsOrientationPage({ onGoHome, onSubmitSuccess }: PrelimsOrientationPageProps) {
  const isExpired = isOrientationExpired();
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

  // Ensure page is immediately positioned at the top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        message: `[UPSC PRELIMS 2027 ORIENTATION - OCT 15 @ PERIYAR HALL] Target: ${formData.prepStatus}. Queries / Notes: ${formData.notes.trim() || 'Direct seat registration from dedicated page'}`
      });

      setLoading(false);

      if (response && response.success) {
        setIsSuccess(true);
        if (onSubmitSuccess) onSubmitSuccess();
      } else {
        setErrorMessage(response.error || 'Failed to submit registration. Please call 9600060349 directly.');
      }
    } catch (err: any) {
      console.error('[ORIENTATION FORM SUBMISSION ERROR]', err);
      setLoading(false);
      setErrorMessage('Network or server error. Please call 9600060349 / 9600060393 directly.');
    }
  };

  const strategyDimensions = [
    {
      title: "GS Strategy",
      subtitle: "What to study & how to prioritise",
      desc: "Comprehensive breakdown of High-Yield static modules (Polity, Economy, Geography, Environment, History) and systematic time-allocation frameworks.",
      icon: BookOpen,
      badge: "Dimension 01",
      accent: "from-amber-500/10 to-amber-500/5 border-amber-300 text-amber-900"
    },
    {
      title: "CSAT Strategy",
      subtitle: "Approach, practice & time management",
      desc: "Demystifying CSAT paper II: proven methodologies to cross 66.67 marks safely without panic, handling comprehension traps and quantitative shortcuts.",
      icon: BrainCircuit,
      badge: "Dimension 02",
      accent: "from-blue-500/10 to-blue-500/5 border-blue-300 text-blue-900"
    },
    {
      title: "Current Affairs",
      subtitle: "How to manage the vast information flow",
      desc: "Cutting through the information explosion: how to curate daily news, map current topics to static syllabus, and avoid resource hoarder traps.",
      icon: Newspaper,
      badge: "Dimension 03",
      accent: "from-emerald-500/10 to-emerald-500/5 border-emerald-300 text-emerald-900"
    },
    {
      title: "PYQs Decode",
      subtitle: "How to decode & solve UPSC questions",
      desc: "Reverse-engineering 10+ years of UPSC Prelims question papers to identify recurring themes, examiner mindset, and option elimination mechanics.",
      icon: FileText,
      badge: "Dimension 04",
      accent: "from-purple-500/10 to-purple-500/5 border-purple-300 text-purple-900"
    },
    {
      title: "Revision Strategy",
      subtitle: "Retention, recall & repeated revision",
      desc: "Implementing spaced repetition cycles, active recall notebooks, and micro-notes architecture to ensure peak memory retention on exam day.",
      icon: RotateCcw,
      badge: "Dimension 05",
      accent: "from-rose-500/10 to-rose-500/5 border-rose-300 text-rose-900"
    },
    {
      title: "Test Strategy",
      subtitle: "How to analyse mistakes & improve scores",
      desc: "Moving beyond passive test-taking: rigorous 3-category error diagnosis (knowledge gap, silly mistake, or wild guess) to steadily boost mock scores.",
      icon: Target,
      badge: "Dimension 06",
      accent: "from-indigo-500/10 to-indigo-500/5 border-indigo-300 text-indigo-900"
    },
    {
      title: "Prelims Planning",
      subtitle: "A roadmap from preparation to examination",
      desc: "Week-by-week and month-by-month strategic schedule spanning October 2026 to exam morning, syncing test series, revision, and mental stamina.",
      icon: Award,
      badge: "Dimension 07",
      accent: "from-teal-500/10 to-teal-500/5 border-teal-300 text-teal-900"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#fff2e0] selection:text-[#D31218]">
      <Helmet>
        <title>UPSC Prelims 2027 Conquer Orientation | Sudhagaran Sir | D'code IAS Academy</title>
        <meta 
          name="description" 
          content="Join D’code Prelims Conquer Orientation with Sudhagaran Sir & Team on October 15 at Periyar Hall, Chennai. Get a practical 7-dimension strategy for GS, CSAT, PYQs, and Revision. Register your seat now." 
        />
        <meta 
          name="keywords" 
          content="UPSC Prelims 2027, Prelims Conquer Orientation, Sudhagaran Sir, Periyar Hall Chennai, Dcode IAS Academy, UPSC Strategy 2027, CSAT Strategy, Prelims Mentorship" 
        />
        <link rel="canonical" href="https://decodeias.com/prelims-orientation-2027" />
      </Helmet>

      {/* Top Floating Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#0D2C54]/95 backdrop-blur-md border-b border-white/10 text-white shadow-md">
        <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#D31218] transition-colors">
              <ArrowLeft className="w-4 h-4 text-white" />
            </div>
            <span>Back to Academy Home</span>
          </button>

          <div className="flex items-center gap-3">
            <img 
              src={LogoImage} 
              alt="D'code IAS Academy Logo" 
              className="w-8 h-8 rounded-full object-cover border border-white/20" 
            />
            <div className="hidden sm:block text-right">
              <span className="block text-xs font-bold text-white leading-tight font-serif">D’code IAS Academy</span>
              <span className="block text-[9px] text-[#D31218] font-space font-semibold uppercase tracking-wider">WE SIMPLIFY IAS JOURNEY</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0D2C54] via-[#10325D] to-[#0A2242] text-white pt-12 pb-16 md:pt-16 md:pb-24 px-4 overflow-hidden border-b-4 border-[#D31218]">
        {/* Ambient Lights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D31218]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-5">
          {/* Live Notification Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#D31218] text-white text-xs font-extrabold uppercase tracking-widest shadow-lg animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            🚨 EXCLUSIVE LIVE ORIENTATION • OCTOBER 15
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-serif max-w-3xl mx-auto">
            UPSC PRELIMS 2027 — ARE YOU READY TO CONQUER?
          </h1>

          <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Prelims is not just about studying more. It is about having the <span className="text-amber-300 font-bold underline decoration-amber-400 decoration-2 underline-offset-4">right strategy, smart revision, and effective execution</span>.
          </p>

          {/* Quick Highlight Cards */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left text-xs">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/15 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-amber-300 shrink-0" />
              <div>
                <span className="text-[10px] text-white/70 uppercase font-space block">Date & Schedule</span>
                <strong className="text-white text-xs sm:text-sm">October 15, 2026</strong>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/15 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-amber-300 shrink-0" />
              <div>
                <span className="text-[10px] text-white/70 uppercase font-space block">Orientation Venue</span>
                <strong className="text-white text-xs sm:text-sm">Periyar Hall, Chennai</strong>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/15 flex items-center gap-3">
              <Users className="w-6 h-6 text-amber-300 shrink-0" />
              <div>
                <span className="text-[10px] text-white/70 uppercase font-space block">Chief Mentors</span>
                <strong className="text-white text-xs sm:text-sm">Sudhagaran Sir & Team</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: 7 Dimensions Breakdown & Strategy Detail */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider font-space mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Comprehensive Blueprint
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D2C54] font-serif tracking-tight">
                Get a Complete, Practical Prelims Strategy
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Covering every crucial dimension needed to master the changing dynamics of the Civil Services Preliminary Examination:
              </p>
            </div>

            {/* 7 Dimensions List Cards */}
            <div className="space-y-3.5">
              {strategyDimensions.map((dim, idx) => {
                const IconComponent = dim.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className={`p-4 rounded-xl border bg-gradient-to-r ${dim.accent} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-xs flex items-center justify-center shrink-0 text-[#0D2C54]">
                        <IconComponent className="w-5 h-5 text-[#0D2C54]" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif">
                            📌 {dim.title}
                          </h3>
                          <span className="text-[10px] font-space font-bold uppercase tracking-wider px-2 py-0.5 bg-white/80 rounded border text-slate-600">
                            {dim.badge}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#D31218]">
                          {dim.subtitle}
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                          {dim.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Core Philosophy Punchline */}
            <div className="bg-gradient-to-r from-[#0D2C54] to-[#123663] text-white p-6 rounded-2xl shadow-lg border-l-4 border-[#D31218] space-y-2">
              <p className="text-base sm:text-lg font-bold font-serif text-amber-300">
                🎯 One orientation. One strategy. A complete roadmap to Prelims.
              </p>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Don’t just prepare for Prelims. <strong className="text-white uppercase font-extrabold">Prepare to conquer it.</strong> Join Sudhagaran Sir & Team at Periyar Hall on October 15.
              </p>
            </div>

            {/* Direct Contact & Socials Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-[#0D2C54] text-sm">
                    🎓 D’code IAS Academy
                  </h4>
                  <span className="text-[10px] font-space font-bold text-[#D31218] tracking-wider uppercase">
                    WE SIMPLIFY IAS JOURNEY
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://t.me/dcodesudh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold border border-sky-200 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram Channel</span>
                  </a>
                  <a
                    href="https://www.decodeias.com"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-semibold border border-slate-200 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>www.decodeias.com</span>
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#D31218]" /> For Direct Enquiry:
                </span>
                <div className="flex items-center gap-3 font-mono font-bold text-sm">
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

          {/* Right Column: Native Registration Form Card */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-gradient-to-br from-[#0D2C54] via-[#10325D] to-[#0A2242] text-white rounded-2xl p-6 sm:p-7 shadow-2xl border-2 border-[#D31218] relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-[#D31218]/25 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                {/* Card Title */}
                <div className="border-b border-white/15 pb-4 mb-4">
                  <span className="inline-block px-3 py-1 bg-[#D31218] text-[10px] font-extrabold rounded-full uppercase tracking-widest mb-2 text-white shadow-md">
                    👉 REGISTRATION MUST
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
                    Reserve Your Seat
                  </h3>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                    October 15 @ Periyar Hall, Chennai. Limited seating capacity on a confirmed registration basis.
                  </p>
                </div>

                {isExpired ? (
                  /* Event Concluded / Expired Notice */
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-amber-400/40 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto border border-amber-400/40 shadow-inner">
                      <Clock className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white font-serif">
                        Orientation Event Concluded
                      </h4>
                      <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                        The UPSC Prelims 2027 Conquer Orientation on October 15 has ended. Online registrations for this event are now closed.
                      </p>
                    </div>
                    <div className="bg-black/25 rounded-lg p-3 text-xs text-slate-300 border border-white/10 text-left space-y-1.5 font-sans">
                      <p>🎓 <strong>Direct Admissions:</strong> PCM Foundation & Mains Momentum 2027</p>
                      <p>📞 <strong>Admissions Helpline:</strong> 9600060349 / 9600060393</p>
                    </div>
                    <button
                      type="button"
                      onClick={onGoHome}
                      className="w-full py-2.5 px-4 bg-[#D31218] hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                    >
                      Back to Academy Home
                    </button>
                  </div>
                ) : isSuccess ? (
                  /* Success Confirmation Slip */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-emerald-400/40 space-y-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-400/40 shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white font-serif">
                        Registration Confirmed!
                      </h4>
                      <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                        Thank you, <strong className="text-white">{formData.fullName}</strong>. Your seat for the <strong className="text-amber-300">UPSC Prelims 2027 Conquer Orientation</strong> has been reserved.
                      </p>
                    </div>

                    <div className="bg-black/25 rounded-lg p-3 text-xs text-slate-300 border border-white/10 text-left space-y-1.5 font-sans">
                      <p>📍 <strong>Venue:</strong> Periyar Hall, Chennai</p>
                      <p>🗓️ <strong>Date:</strong> October 15, 2026</p>
                      <p>📞 <strong>Phone:</strong> +91 {formData.phone}</p>
                      <p>🎓 <strong>Chief Mentor:</strong> Sudhagaran Sir & Team</p>
                    </div>

                    <p className="text-[11px] text-emerald-300 italic">
                      Our academic coordinators will contact you via WhatsApp / Phone with timing details and your entry pass.
                    </p>

                    <button
                      type="button"
                      onClick={onGoHome}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-md transition-colors cursor-pointer"
                    >
                      Return to Academy Home
                    </button>
                  </motion.div>
                ) : (
                  /* Native Lead Registration Form */
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {errorMessage && (
                      <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Candidate Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1 font-space">
                        Full Name <span className="text-[#D31218]">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Your complete name"
                          className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all"
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1 font-space">
                        Mobile / WhatsApp Number <span className="text-[#D31218]">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="10-digit mobile number"
                          className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1 font-space">
                        Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="aspirant@gmail.com"
                          className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all"
                        />
                      </div>
                    </div>

                    {/* Preparation Status */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1 font-space">
                        Preparation Target
                      </label>
                      <select
                        value={formData.prepStatus}
                        onChange={(e) => setFormData({ ...formData, prepStatus: e.target.value })}
                        className="w-full bg-[#0D2C54] border border-white/20 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all cursor-pointer"
                      >
                        <option value="Beginner (2027 Target)" className="bg-[#0D2C54] text-white">Beginner (UPSC 2027 Target)</option>
                        <option value="1st Attempt Aspirant" className="bg-[#0D2C54] text-white">1st Attempt Aspirant (2026/2027)</option>
                        <option value="Repeat / Revision Aspirant" className="bg-[#0D2C54] text-white">Repeat / Strategy Revision Aspirant</option>
                        <option value="College Student (Foundation)" className="bg-[#0D2C54] text-white">College Student (Foundation Prep)</option>
                      </select>
                    </div>

                    {/* Optional Notes */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1 font-space">
                        Any Specific Query for Sudhagaran Sir? <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="E.g., CSAT balance, GS subject prioritization, or time management..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all resize-none"
                      />
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D31218] via-red-600 to-[#D31218] hover:from-red-600 hover:to-rose-700 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase shadow-xl transition-all flex items-center justify-center gap-2 border border-white/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Reserving Your Seat...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Confirm Seat for October 15 Orientation</span>
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-slate-300 text-center mt-1">
                      🔒 Official registration. Details are transmitted securely to academy coordinators via email.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0D2C54] text-white border-t border-white/10 py-8 text-center text-xs">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <p className="font-serif font-bold text-sm">D’code IAS Academy • Chennai</p>
          <p className="text-slate-400 text-[11px]">
            Block Z, 5th Ave, Z Block, Anna Nagar, Chennai, Tamil Nadu - 600040 | Helpline: +91 96000 60349 / +91 96000 60393
          </p>
          <p className="text-slate-500 text-[10px]">
            © {new Date().getFullYear()} D’code IAS Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
