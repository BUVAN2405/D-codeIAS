import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Download,
  ArrowRight,
  Award,
  Phone,
  ChevronRight,
  X,
  FileDown,
  Calendar,
  Clock,
  BookOpen,
  Target,
  Sparkles,
  Users,
  Compass,
  MessageCircle,
  HelpCircle,
  FileText,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { submitInquiryApi } from '../services/api';
import topperRajeshwari from '../assets/toppers/Rajeshwari Suve M.jpeg';
import topperNeya from '../assets/toppers/Neya flower.jpeg';
import topperArunPandian from '../assets/toppers/Arun Pandian.jpeg';
import topperKirubakaran from '../assets/toppers/Kirubakaran.jpeg';
import topperSubramania from '../assets/toppers/Subranabia Bharathi.jpeg';
import topperNishanth from '../assets/toppers/Dr. NISHANTH T..jpeg';
import topperSanjay from '../assets/toppers/Sanjay.jpeg';
import topperPraveen from '../assets/toppers/PRAVEEN AROCKIARAJ.jpeg';
import topperArunVadivarasan from '../assets/toppers/ARUN VADIVARASAN.jpeg';

interface PcmBatch2028CoursePageProps {
  onBackToHome: () => void;
  onEnrollClick?: (packageName?: string) => void;
  onNavigateToPrelimsConquer?: () => void;
}

export default function PcmBatch2028CoursePage({
  onBackToHome,
  onEnrollClick,
  onNavigateToPrelimsConquer
}: PcmBatch2028CoursePageProps) {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'highlights' | 'csat' | 'why2028' | 'toppers' | 'faq'>('roadmap');
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [brochureLead, setBrochureLead] = useState({ name: '', phone: '' });
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isInfographicModalOpen, setIsInfographicModalOpen] = useState(false);

  const courseTitle = 'PCM UPSC Batch 2028 (Prelims-cum-Mains Full Foundation)';
  const brochureUrl = '/D_code_IAS_PCM_UPSC_Batch_2028_Brochure.pdf';

  const handleEnrollAction = () => {
    if (onEnrollClick) {
      onEnrollClick(courseTitle);
    } else {
      window.location.href = `/#enroll?course=${encodeURIComponent(courseTitle)}`;
    }
  };

  const triggerDirectDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBrochureClick = () => {
    setDownloadSuccess(false);
    setIsBrochureModalOpen(true);
  };

  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brochureLead.name.trim() || !brochureLead.phone.trim()) {
      alert('Please provide your Name and 10-digit Mobile Number.');
      return;
    }

    setIsDownloading(true);
    try {
      await submitInquiryApi({
        fullName: brochureLead.name.trim(),
        phone: brochureLead.phone.trim(),
        course: courseTitle,
        formType: 'inquiry',
        message: 'Brochure & Syllabus Request for PCM UPSC Batch 2028'
      });

      const filename = 'D_code_IAS_PCM_UPSC_Batch_2028_Brochure.pdf';
      triggerDirectDownload(brochureUrl, filename);

      setDownloadSuccess(true);
      setTimeout(() => {
        setIsBrochureModalOpen(false);
        setIsDownloading(false);
        setBrochureLead({ name: '', phone: '' });
      }, 1800);
    } catch (err) {
      console.error(err);
      triggerDirectDownload(brochureUrl, 'D_code_IAS_PCM_UPSC_Batch_2028_Brochure.pdf');
      setIsBrochureModalOpen(false);
      setIsDownloading(false);
    }
  };

  // The 8 Sequential Pillars requested explicitly by the user
  const ROADMAP_STEPS = [
    {
      step: '01',
      title: 'Prelims Foundation Classes',
      timeline: 'Starts & Runs Till June 2027',
      badge: 'Step 01 • Core Foundation',
      color: 'from-amber-500 to-amber-600',
      tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Comprehensive coverage of static GS subjects (Polity, Economy, Geography, Environment, History, S&T) from NCERT basics to advanced level. Includes daily 3-hour classes that leave ample time for self-study and concept building.',
      points: [
        'Complete conceptual clarity with zero rote-learning traps',
        'Full syllabus coverage for both GS Paper I and CSAT Paper II',
        'Expert faculty sessions led by mentors with proven UPSC track record',
        'Daily 3 hours classroom structure designed to prevent student burnout'
      ]
    },
    {
      step: '02',
      title: 'Weekly Assessments',
      timeline: 'Continuous Throughout Foundation',
      badge: 'Step 02 • Continuous Evaluation',
      color: 'from-blue-600 to-indigo-700',
      tagColor: 'bg-blue-100 text-blue-900 border-blue-300',
      description: 'Regular testing to track what you learned, build exam temperament, and keep revision regular through topic-wise tests with in-depth performance analysis.',
      points: [
        'Topic-wise weekly tests matching current UPSC question patterns',
        'Granular performance analytics identifying conceptual blind spots early',
        'Detailed live explanations and post-test review sessions',
        'Personalized feedback from subject mentors to refine preparation strategy'
      ]
    },
    {
      step: '03',
      title: 'Mains Mentoring & Optional Mentoring',
      timeline: 'June 2027 – November 2027 (Parallel)',
      badge: 'Step 03 • Mains Mastery',
      color: 'from-rose-600 to-red-700',
      tagColor: 'bg-rose-100 text-rose-900 border-rose-300',
      description: 'Intensive answer-writing practice, GS Papers I–IV coverage, Essay specialization, and dedicated Optional Subject mentoring running parallelly.',
      points: [
        'Daily answer writing practice with 1-on-1 evaluation and model frameworks',
        'GS Papers I–IV structured notes, value addition, diagrams, and case studies',
        'Dedicated Essay writing methodology and high-scoring templates',
        'Optional subject mentoring (PSIR, Sociology, Public Admin, etc.) with specialists'
      ]
    },
    {
      step: '04',
      title: 'Prelims Test Series (PTS)',
      timeline: 'November 2027 – May 2028',
      badge: 'Step 04 • Prelims Simulation',
      color: 'from-purple-600 to-indigo-800',
      tagColor: 'bg-purple-100 text-purple-900 border-purple-300',
      description: 'Rigorous UPSC-pattern test series with sectional drills, revision tests, and full-length mock papers simulated under authentic exam conditions.',
      points: [
        'UPSC-standard questions crafted to match real difficulty and surprises',
        'Real offline OMR classroom simulation at Anna Nagar + online portal',
        'Detailed discussions and post-test explanation PDFs for every question',
        'Techniques for smart elimination, speed optimization, and accuracy control'
      ]
    },
    {
      step: '05',
      title: 'UPSC CSE Prelims Ready',
      timeline: 'May 2028 (Exam Milestone)',
      badge: 'Step 05 • Milestone 1',
      color: 'from-emerald-600 to-teal-700',
      tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: 'Final polishing phase ensuring you enter the examination hall with calm composure, zero fear of CSAT Paper II, and razor-sharp option elimination skills.',
      points: [
        'Full-length simulation papers mirroring actual UPSC exam day conditions',
        'Complete 10+ years thematic PYQ decoding and examiner mindset mastery',
        'CSAT safety buffer targeting 90+ marks comfortably against the 66.67 cutoff',
        '1-on-1 strategy auditing with Sudhagaran Sir to lock negative marks control'
      ]
    },
    {
      step: '06',
      title: 'UPSC CSE Mains Ready',
      timeline: 'June 2028 – September 2028',
      badge: 'Step 06 • Milestone 2',
      color: 'from-cyan-600 to-blue-700',
      tagColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
      description: 'Intensive 3-hour Mains simulation tests, rapid revision micro-notes, spaced repetition cycles, and current affairs integration to maximize Mains score.',
      points: [
        'Structured Mains answer writing simulations under strict 3-hour time constraints',
        'Continuous evaluation with personalized scoring benchmarks and feedback',
        'Integrated current affairs enrichment tying contemporary debates to static syllabus',
        'High-impact introduction-body-conclusion structures and visual diagram aids'
      ]
    },
    {
      step: '07',
      title: 'Interview Guidance Program',
      timeline: 'Post-Mains Results – Final Stage',
      badge: 'Step 07 • Personality Test',
      color: 'from-orange-600 to-amber-700',
      tagColor: 'bg-orange-100 text-orange-900 border-orange-300',
      description: 'Expert-led personality test coaching, DAF (Detailed Application Form) scrutiny, and mock interviews conducted by panels of retired bureaucrats and eminent academicians.',
      points: [
        'Meticulous DAF line-by-line analysis and anticipated question generation',
        'Realistic mock interview boards with retired IAS, IPS, and IFS officers',
        'Body language, voice modulation, ethical dilemma handling, and composure coaching',
        'Comprehensive video recording review and personalized corrective sessions'
      ]
    },
    {
      step: '08',
      title: 'Your Way to LBSNAA',
      timeline: 'Final Merit List & Convocation',
      badge: 'Step 08 • The Dream Realized',
      color: 'from-red-600 to-rose-700',
      tagColor: 'bg-red-100 text-red-900 border-red-300',
      description: 'Transforming potential into a top civil service rank. Joining the prestigious Lal Bahadur Shastri National Academy of Administration (LBSNAA), Mussoorie.',
      points: [
        'Top rank attainment with consistent, stress-free 1.5-year preparation',
        'Mentorship legacy: joining the distinguished alumni serving across India',
        'From aspirant to officer: your dedication backed by D’code IAS excellence',
        'Lifelong association with D’code IAS Academy leadership network'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0D2C54] font-sans selection:bg-red-100 selection:text-[#D31218]">
      {/* Top Navbar */}
      <Navbar
        onEnrollClick={handleEnrollAction}
        onNavigate={(sectionId) => {
          onBackToHome();
          setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        activeSection="courses"
        onPrelimsConquerClick={() => {
          if (onNavigateToPrelimsConquer) {
            onNavigateToPrelimsConquer();
          } else {
            window.location.href = '/prelims-conquer-2027';
          }
        }}
      />

      {/* Main Content Wrapper */}
      <div className="pt-24 sm:pt-28 md:pt-30">
        {/* Breadcrumbs Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <button
                onClick={onBackToHome}
                className="hover:text-[#D31218] transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <button
                onClick={onBackToHome}
                className="hover:text-[#D31218] transition-colors cursor-pointer"
              >
                Courses
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[#0D2C54] font-bold truncate">
                PCM UPSC Batch 2028 (1.5 Years Full Foundation)
              </span>
            </div>
          </div>
        </div>

        {/* Main Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ======================================================== */}
            {/* LEFT COLUMN: Main Course Details (8 Cols)                */}
            {/* ======================================================== */}
            <div className="lg:col-span-8 space-y-6">

              {/* Course Header Banner Card */}
              <div className="bg-gradient-to-br from-[#0D2C54] via-[#123668] to-[#081B34] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 relative overflow-hidden">
                {/* Decorative Background Lighting */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D31218]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  {/* Pill Badges */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3.5 py-1 rounded-full bg-[#D31218] text-white text-xs font-bold uppercase tracking-wider shadow-sm font-space flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      Target: UPSC CSE 2028
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-300/30 uppercase tracking-wider">
                      Admissions Open
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-gray-200 text-xs font-semibold border border-white/20">
                      Online &amp; Offline (Anna Nagar, Chennai)
                    </span>
                  </div>

                  {/* Main Headline */}
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-extrabold tracking-tight leading-tight text-white">
                      PCM UPSC Batch <span className="font-space text-amber-300">2028</span>
                    </h1>
                    <p className="text-base sm:text-lg font-space font-bold text-amber-200 mt-1">
                      Prelims-Cum-Mains 1.5 Years Full Foundation Course
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed max-w-2xl">
                    Guided directly by <strong>Sudhagaran Sir</strong> (Former Mission Director of Naan Mudhalvan). A structured, sustainable, and student-centric preparation program with daily 3 hours classes, integrated test series, and end-to-end 1-on-1 mentorship.
                  </p>

                  {/* Quick Highlight Pillars */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                    <div className="bg-black/25 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                      <p className="text-amber-300 text-[10px] uppercase font-bold tracking-wider">Daily Classes</p>
                      <p className="text-white font-bold text-sm mt-0.5 font-space">3 Hours / Day</p>
                      <p className="text-gray-300 text-[10px]">Quality over quantity</p>
                    </div>
                    <div className="bg-black/25 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                      <p className="text-amber-300 text-[10px] uppercase font-bold tracking-wider">Course Duration</p>
                      <p className="text-white font-bold text-sm mt-0.5 font-space">1.5 Years</p>
                      <p className="text-gray-300 text-[10px]">Full syllabus &amp; mocks</p>
                    </div>
                    <div className="bg-black/25 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                      <p className="text-amber-300 text-[10px] uppercase font-bold tracking-wider">Coverage</p>
                      <p className="text-white font-bold text-sm mt-0.5 font-space">GS + CSAT</p>
                      <p className="text-gray-300 text-[10px]">Prelims, Mains, Interview</p>
                    </div>
                    <div className="bg-black/25 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                      <p className="text-amber-300 text-[10px] uppercase font-bold tracking-wider">Mentorship</p>
                      <p className="text-white font-bold text-sm mt-0.5 font-space">1-on-1 Direct</p>
                      <p className="text-gray-300 text-[10px]">Personal guidance</p>
                    </div>
                  </div>

                  {/* Unleash Your Potential Callout (Page 1 in PDF) */}
                  <div className="pt-2">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-400 text-black font-extrabold flex items-center justify-center shrink-0 shadow-md">
                          <Sparkles className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                            Unleash Your Potential
                          </p>
                          <p className="text-xs text-gray-200">
                            "Are you ready to join the Indian Civil Services?"
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-[10px] font-bold uppercase tracking-wider border border-amber-300/30">
                        We Simplify IAS
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Sub-Tabs Navigation */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none sticky top-28 sm:top-32 z-20">
                {[
                  { id: 'roadmap', label: '8-Step Roadmap (2028)', icon: Compass },
                  { id: 'highlights', label: 'Program Highlights', icon: Award },
                  { id: 'csat', label: 'CSAT Classes', icon: BookOpen },
                  { id: 'why2028', label: 'Why Target 2028?', icon: Target },
                  { id: 'toppers', label: 'Toppers Testimonials', icon: Users },
                  { id: 'faq', label: 'FAQs', icon: HelpCircle }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#0D2C54] text-white shadow-sm'
                          : 'text-gray-600 hover:text-[#0D2C54] hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-gray-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* DYNAMIC TAB CONTENT */}
              <AnimatePresence mode="wait">

                {/* TAB 1: 8-Step Preparation Roadmap (User Specific Request) */}
                {activeTab === 'roadmap' && (
                  <motion.div
                    key="tab-roadmap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D31218]">
                          <Compass className="w-4 h-4" />
                          <span>Structured Preparation Journey</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0D2C54] mt-1">
                          Your Journey to UPSC CSE 2028: Learn | Practice | Achieve
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                          From Prelims Foundation to your final destination at LBSNAA.
                        </p>
                      </div>

                      {/* Button to view high-res Infographic from PDF */}
                      <button
                        onClick={() => setIsInfographicModalOpen(true)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#0D2C54] text-xs font-bold border border-amber-300/80 transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-[#D31218]" />
                        <span>View Official Roadmap Infographic</span>
                      </button>
                    </div>

                    {/* Step-by-Step 8 Sequential Cards */}
                    <div className="space-y-4">
                      {ROADMAP_STEPS.map((step, idx) => (
                        <div
                          key={step.step}
                          className="p-5 rounded-2xl bg-[#F8FAFC] border border-gray-200 hover:border-[#0D2C54]/30 hover:shadow-md transition-all relative overflow-hidden"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 rounded-xl bg-[#0D2C54] text-amber-300 font-space font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                                {step.step}
                              </span>
                              <div>
                                <h3 className="font-serif text-base sm:text-lg font-bold text-[#0D2C54] leading-snug">
                                  {step.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-0.5">
                                  <Calendar className="w-3.5 h-3.5 text-[#D31218]" />
                                  <span>{step.timeline}</span>
                                </div>
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border self-start sm:self-auto ${step.tagColor}`}>
                              {step.badge}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3">
                            {step.description}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-200/60">
                            {step.points.map((pt, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-2 text-xs text-gray-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Infographic Preview Card Banner */}
                    <div
                      onClick={() => setIsInfographicModalOpen(true)}
                      className="cursor-pointer group relative overflow-hidden rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/50 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all hover:bg-amber-100/60"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-[#0D2C54] text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Compass className="w-6 h-6 text-amber-300 group-hover:rotate-45 transition-transform duration-300" />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-sm sm:text-base text-[#0D2C54]">
                            View Complete Graphical Roadmap Infographic
                          </p>
                          <p className="text-xs text-gray-600">
                            Click to expand the full official visual roadmap chart for UPSC CSE 2028.
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-xl bg-[#0D2C54] text-white text-xs font-bold uppercase tracking-wider shrink-0 hidden sm:inline-flex items-center gap-1 group-hover:bg-[#D31218] transition-colors">
                        <span>Expand</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                  </motion.div>
                )}

                {/* TAB 2: Program Highlights (From PDF Page 2) */}
                {activeTab === 'highlights' && (
                  <motion.div
                    key="tab-highlights"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6"
                  >
                    <div className="border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D31218]">
                        <span>Key Pillars of Excellence</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0D2C54] mt-1">
                        Program Highlights: Your Journey to Civil Service Starts Here
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        A structured, comprehensive, and mentorship-driven UPSC preparation programme.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Highlight 1 */}
                      <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-gray-100 space-y-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-red-100 text-[#D31218] flex items-center justify-center font-bold text-xs">
                            1
                          </div>
                          <h3 className="font-serif font-bold text-sm text-[#0D2C54]">
                            Comprehensive Course Coverage
                          </h3>
                        </div>
                        <ul className="space-y-1.5 text-xs text-gray-700 pl-2">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D31218]" />
                            <strong>Prelims:</strong> General Studies (GS) and CSAT
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D31218]" />
                            <strong>Mains:</strong> General Studies Papers I–IV and Essay
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D31218]" />
                            <strong>Interview:</strong> Expert-led Personality Test guidance
                          </li>
                        </ul>
                      </div>

                      {/* Highlight 2 */}
                      <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-gray-100 space-y-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                            2
                          </div>
                          <h3 className="font-serif font-bold text-sm text-[#0D2C54]">
                            Structured Learning Approach
                          </h3>
                        </div>
                        <ul className="space-y-1.5 text-xs text-gray-700 pl-2">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                            <strong>Limited to 3 hours</strong> of classroom sessions per day
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                            Comprehensive handwritten study notes
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                            Guidance on standard reference books &amp; PYQs
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                            Dedicated time for self-study, revision, and consolidation
                          </li>
                        </ul>
                      </div>

                      {/* Highlight 3 */}
                      <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-gray-100 space-y-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                            3
                          </div>
                          <h3 className="font-serif font-bold text-sm text-[#0D2C54]">
                            Practice, Testing &amp; Evaluation
                          </h3>
                        </div>
                        <ul className="space-y-1.5 text-xs text-gray-700 pl-2">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                            Integrated Prelims and Mains Test Series
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                            Daily answer writing practice from day one
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                            Regular performance assessments
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                            Continuous evaluation with constructive feedback
                          </li>
                        </ul>
                      </div>

                      {/* Highlight 4 */}
                      <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-gray-100 space-y-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                            4
                          </div>
                          <h3 className="font-serif font-bold text-sm text-[#0D2C54]">
                            Personalised Mentorship &amp; Guidance
                          </h3>
                        </div>
                        <ul className="space-y-1.5 text-xs text-gray-700 pl-2">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                            End-to-end mentorship throughout the UPSC preparation journey
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                            Personalised one-to-one mentoring with Sudhagaran Sir
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                            Expert guidance for interview preparation
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                            Individual performance tracking and improvement strategies
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Highlight 5 Full Width */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-amber-50/50 border border-amber-200">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                          5
                        </div>
                        <h3 className="font-serif font-bold text-sm text-[#0D2C54]">
                          Flexible &amp; Student-Centric Learning
                        </h3>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Flexible online and offline classroom learning modes at Anna Nagar, Chennai. Balanced classroom learning with a structured preparation schedule designed to support consistent learning, effective revision, and sustainable progress.
                      </p>
                    </div>

                  </motion.div>
                )}

                {/* TAB 3: CSAT Classes (From PDF Page 3) */}
                {activeTab === 'csat' && (
                  <motion.div
                    key="tab-csat"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6"
                  >
                    <div className="border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D31218]">
                        <span>Zero CSAT Anxiety</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0D2C54] mt-1">
                        Integrated CSAT Classes: Conquer Paper II Comfortably
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        Designed specifically for aspirants from non-math and humanities backgrounds.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {[
                        'Comprehensive coverage of the full UPSC CSAT syllabus',
                        'Logical Reasoning and Analytical Ability concept drills',
                        'Reading Comprehension & Verbal Ability elimination tactics',
                        'Basic Numeracy and Quantitative Aptitude shortcuts',
                        'Data Interpretation and Problem-Solving techniques',
                        'Regular practice sessions with Previous Year Questions (PYQs)',
                        'Mock tests with granular performance analysis',
                        '5,000+ MCQs practice bank with step-by-step video solutions'
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-100 text-xs text-gray-800"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0D2C54] text-white flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <p className="font-serif font-bold text-sm">
                          From Foundation to Final Interview
                        </p>
                        <p className="text-xs text-gray-300">
                          Comprehensive guidance at every single stage of UPSC CSE.
                        </p>
                      </div>
                      <button
                        onClick={handleEnrollAction}
                        className="px-4 py-2 rounded-xl bg-[#D31218] hover:bg-[#A30D12] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer"
                      >
                        Enroll in Foundation
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* TAB 4: Why We Target UPSC CSE 2028 (From PDF Page 1) */}
                {activeTab === 'why2028' && (
                  <motion.div
                    key="tab-why2028"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6"
                  >
                    <div className="border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D31218]">
                        <span>Philosophy &amp; Strategy</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0D2C54] mt-1">
                        Why We Target UPSC CSE 2028
                      </h2>
                    </div>

                    <div className="prose prose-sm max-w-none text-gray-700 space-y-4 text-xs sm:text-sm leading-relaxed">
                      <p>
                        We believe that effective UPSC preparation is <strong>not about rushing through the syllabus</strong> or overwhelming students with 6–8 hours of exhausting daily classes. It is about building a strong conceptual foundation, ensuring meaningful classroom learning, and providing aspirants with sufficient time to revise, practice answer writing, take tests, and develop analytical skills.
                      </p>

                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                        <p className="font-serif font-bold text-[#0D2C54] text-sm">
                          Our Motto: “We Simplify IAS”
                        </p>
                        <p className="text-xs text-gray-700 mt-1">
                          Reflects our commitment to making the UPSC journey more organized, manageable, and effective. Through a well-planned curriculum, a balanced class schedule, integrated preparation for Prelims and Mains, and dedicated time for self-study and revision, we aim to ensure that students can absorb what they learn in class and apply it confidently in the examination.
                        </p>
                      </div>

                      <p>
                        Our objective is not merely to complete the syllabus, but to ensure that every student gets the time, guidance, and preparation structure needed to master it.
                      </p>

                      <p className="font-semibold text-[#0D2C54]">
                        At D’CODE IAS ACADEMY, we believe that quality learning matters more than the quantity of classes. Our approach is centered on preparing aspirants for UPSC CSE 2028 with a structured, sustainable, and student-centric learning strategy.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* TAB 5: Toppers Testimonials (From PDF Page 5) */}
                {activeTab === 'toppers' && (
                  <motion.div
                    key="tab-toppers"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6"
                  >
                    <div>
                      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#D31218]">
                        Testimonials
                      </span>
                      <h3 className="mb-2 font-serif text-2xl font-bold tracking-tight text-[#0D2C54]">
                        Testimonials of Toppers
                      </h3>
                      <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">
                        Under the mentorship of Sudhagaran Sir, who has aided them in their UPSC journey and Forest Services exams.
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[#D31218]">
                        <Award className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Guaranteed Results &amp; Dedication
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
                      {[
                        {
                          name: 'Rajeshwari Suve M',
                          rank: 'AIR 2',
                          exam: 'UPSC IAS',
                          image: topperRajeshwari,
                          imageClass: 'scale-[1.6] origin-[50%_18%]'
                        },
                        {
                          name: 'Arun Pandian N',
                          rank: 'AIR 213',
                          exam: 'UPSC IAS',
                          image: topperArunPandian,
                          imageClass: 'object-top'
                        },
                        {
                          name: 'Kirubakaran N',
                          rank: 'AIR 439',
                          exam: 'UPSC IAS',
                          image: topperKirubakaran,
                          imageClass: 'object-top'
                        },
                        {
                          name: 'Neya Flower S',
                          rank: 'AIR 515',
                          exam: 'UPSC IAS',
                          image: topperNeya,
                          imageClass: 'object-top'
                        },
                        {
                          name: 'Subramania Bharathi',
                          rank: 'AIR 778',
                          exam: 'UPSC IAS',
                          image: topperSubramania,
                          imageClass: 'object-top'
                        },
                        {
                          name: 'Dr. Nishanth T',
                          rank: 'AIR 821',
                          exam: 'UPSC IAS',
                          image: topperNishanth,
                          imageClass: 'object-top'
                        },
                        {
                          name: 'Sanjay S',
                          rank: 'AIR 953',
                          exam: 'UPSC IAS',
                          image: topperSanjay,
                          imageClass: 'object-top'
                        },
                        {
                          name: 'Praveen Arockiaraj J',
                          rank: 'AIR 102',
                          exam: 'UPSC IFoS',
                          image: topperPraveen,
                          imageClass: 'object-top'
                        },
                        {
                          name: 'Arun Vadivarasan E',
                          rank: 'AIR 128',
                          exam: 'UPSC IFoS',
                          image: topperArunVadivarasan,
                          imageClass: 'object-top'
                        }
                      ].map((top) => (
                        <div
                          key={top.name}
                          className="flex flex-col justify-between rounded-xl border border-gray-200/70 bg-slate-50/50 p-2.5 shadow-xs hover:border-[#D31218]/30 hover:bg-white transition-all"
                        >
                          <div>
                            <div className="relative mb-2 aspect-[3/4] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                              <img
                                src={top.image}
                                alt={top.name}
                                loading="lazy"
                                className={`h-full w-full object-cover ${top.imageClass}`}
                              />
                              <span className="absolute left-1.5 top-1.5 rounded bg-white/95 px-1.5 py-0.5 font-space text-[9px] font-extrabold uppercase tracking-wider text-[#D31218] shadow-sm">
                                {top.rank}
                              </span>
                            </div>
                            <h4 className="line-clamp-2 font-serif text-xs font-bold text-[#0D2C54]">
                              {top.name}
                            </h4>
                          </div>
                          <p className="mt-0.5 font-sans text-[10px] text-gray-500 font-semibold">{top.exam}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* TAB 6: FAQs */}
                {activeTab === 'faq' && (
                  <motion.div
                    key="tab-faq"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-4"
                  >
                    <h3 className="text-xl font-serif font-bold text-[#0D2C54]">
                      Frequently Asked Questions (PCM Batch 2028)
                    </h3>
                    <div className="space-y-3 text-xs sm:text-sm">
                      <details className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100 cursor-pointer" open>
                        <summary className="font-bold text-[#0D2C54]">Who should join the PCM UPSC Batch 2028?</summary>
                        <p className="mt-2 text-gray-600 leading-relaxed">
                          This 1.5-year foundation course is tailored for beginners, college students, working professionals, and early aspirants who want to appear in UPSC CSE 2028 with thorough conceptual mastery without rushing through the syllabus.
                        </p>
                      </details>
                      <details className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100 cursor-pointer">
                        <summary className="font-bold text-[#0D2C54]">Why are daily classes limited to 3 hours?</summary>
                        <p className="mt-2 text-gray-600 leading-relaxed">
                          UPSC is an exam of analytical retention, not passive listening. 3 hours of focused daily classroom learning leaves 4–5 hours for self-study, NCERT reading, answer writing, and test revision—preventing fatigue and burnout.
                        </p>
                      </details>
                      <details className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100 cursor-pointer">
                        <summary className="font-bold text-[#0D2C54]">Are both Online and Offline options available?</summary>
                        <p className="mt-2 text-gray-600 leading-relaxed">
                          Yes! Offline classes are conducted at our Anna Nagar center (Chennai) with air-conditioned classrooms, library facility, and offline OMR test series. Online students receive high-definition live interactive sessions and recorded access.
                        </p>
                      </details>
                      <details className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100 cursor-pointer">
                        <summary className="font-bold text-[#0D2C54]">Are fee installment / EMI options available?</summary>
                        <p className="mt-2 text-gray-600 leading-relaxed">
                          Yes, students can avail easy installment payment options and early-bird scholarship deductions. Contact our admissions team at 9600060349 / 9600060393 for flexible fee schedules.
                        </p>
                      </details>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: Sticky Package Card & Fee (4 Cols)         */}
            {/* ======================================================== */}
            <div className="lg:col-span-4 sticky top-28 sm:top-32 space-y-5">
              
              <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-[#0D2C54]/10 relative overflow-hidden">
                {/* Early bird discount badge */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-space">
                      Early Bird 20% OFF
                    </span>
                    <h3 className="text-base font-bold font-serif text-[#0D2C54] mt-1.5">
                      PCM Full Foundation
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-gray-500 font-space">
                    Batch 2028
                  </span>
                </div>

                {/* Pricing Box (From PDF Page 1) */}
                <div className="py-4 border-b border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Total Standard Fee:</span>
                    <span className="line-through font-mono text-gray-400">₹1,45,000</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-emerald-600 font-bold">
                    <span>Early Bird Discount (20%):</span>
                    <span>- ₹29,000</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0D2C54]">
                      Payable Fee:
                    </span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-[#D31218] font-space">
                        ₹1,16,000
                      </span>
                      <p className="text-[10px] text-gray-400">All Taxes &amp; GST Included</p>
                    </div>
                  </div>
                </div>

                {/* Key Inclusions Bullet Points */}
                <div className="py-3.5 space-y-2 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1.5 Years Full Foundation (Prelims + Mains)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Daily 3 Hours Classroom Sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Comprehensive CSAT Course Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Integrated Prelims &amp; Mains Test Series</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1-on-1 Mentorship under Sudhagaran Sir</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free Interview Guidance Program (DAF + Mocks)</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-2.5">
                  <button
                    onClick={handleEnrollAction}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#D31218] hover:bg-[#A30D12] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Enroll Now / Book Seat</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleBrochureClick}
                    className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-gray-50 border-2 border-[#0D2C54] text-[#0D2C54] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D31218]" />
                    <span>Download PCM Brochure (PDF)</span>
                  </button>
                </div>

                {/* Direct Admission Helpline */}
                <div className="mt-4 pt-3.5 border-t border-gray-100 flex flex-col gap-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#D31218]" />
                    <span className="font-bold text-[#0D2C54]">Direct Admission Desk:</span>
                  </div>
                  <div className="flex items-center justify-between font-mono font-bold text-xs text-[#0D2C54] pt-1">
                    <a href="tel:9600060349" className="hover:text-[#D31218]">+91 96000 60349</a>
                    <span>•</span>
                    <a href="tel:9600060393" className="hover:text-[#D31218]">+91 96000 60393</a>
                  </div>
                </div>

              </div>

              {/* Telegram Community Quick Card */}
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-4 border border-sky-200 flex items-center justify-between text-xs shadow-xs">
                <div>
                  <p className="font-bold text-[#0D2C54]">Join Telegram Study Group</p>
                  <p className="text-[10px] text-gray-600">Daily micro notes &amp; PYQ insights</p>
                </div>
                <a
                  href="https://t.me/dcodesudhagaran"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] uppercase tracking-wider transition-all shadow-xs"
                >
                  Join Free
                </a>
              </div>

            </div>

          </div>
        </main>

        {/* Floating WhatsApp Quick Action Button */}
        <a
          href="https://wa.me/919600060393?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20the%20PCM%20UPSC%20Batch%202028%20Course."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp at +91 96000 60393"
          title="Chat on WhatsApp"
          className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#1DA851] focus:outline-none focus:ring-4 focus:ring-emerald-300 sm:bottom-7 sm:right-7"
        >
          <MessageCircle className="h-5 w-5" />
        </a>

        {/* Brochure Download Lead Modal */}
        <AnimatePresence>
          {isBrochureModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
              <div className="absolute inset-0" onClick={() => setIsBrochureModalOpen(false)} />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl z-10 border border-gray-100"
              >
                <button
                  onClick={() => setIsBrochureModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D31218] flex items-center justify-center mx-auto mb-3">
                    <FileDown className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#0D2C54]">
                    Download Official PCM 2028 Brochure
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your details to instantly receive the complete 1.5 Years syllabus, fee breakdown, and preparation roadmap PDF.
                  </p>
                </div>

                {downloadSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-sm text-[#0D2C54]">Brochure Downloading...</p>
                    <p className="text-xs text-gray-500 mt-1">Thank you! Your download will begin in a moment.</p>
                  </div>
                ) : (
                  <form onSubmit={handleBrochureSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#0D2C54] mb-1">
                        Aspirant Name <span className="text-[#D31218]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={brochureLead.name}
                        onChange={(e) => setBrochureLead({ ...brochureLead, name: e.target.value })}
                        placeholder="e.g. Ananya Sharma"
                        className="w-full text-xs py-2.5 px-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C54] bg-white text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0D2C54] mb-1">
                        Mobile Number <span className="text-[#D31218]">*</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 bg-gray-50 rounded-l-xl text-xs font-space text-gray-600 font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          value={brochureLead.phone}
                          onChange={(e) => setBrochureLead({ ...brochureLead, phone: e.target.value })}
                          placeholder="9876543210"
                          className="w-full text-xs py-2.5 px-3 border border-gray-200 rounded-r-xl focus:outline-none focus:border-[#0D2C54] bg-white text-gray-800 font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isDownloading}
                        className="w-full py-3 px-4 rounded-xl bg-[#D31218] hover:bg-[#A30D12] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>{isDownloading ? 'Preparing Brochure...' : 'Download Brochure Now'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* High-Resolution Infographic Lightbox Modal */}
        <AnimatePresence>
          {isInfographicModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
              <div className="absolute inset-0" onClick={() => setIsInfographicModalOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-w-4xl w-full max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
              >
                <div className="p-4 bg-[#0D2C54] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-300" />
                    <span className="font-serif font-bold text-sm">
                      Official Roadmap: Your Journey to UPSC CSE 2028
                    </span>
                  </div>
                  <button
                    onClick={() => setIsInfographicModalOpen(false)}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-2 sm:p-4 overflow-y-auto flex-1 bg-slate-50 flex items-center justify-center">
                  <img
                    src="/pcm-assets/pcm-roadmap-infographic.jpg"
                    alt="Your Journey to UPSC CSE 2028 Roadmap Infographic"
                    className="max-w-full h-auto object-contain rounded-xl shadow-md border border-gray-200"
                  />
                </div>
                <div className="p-3 bg-white border-t border-gray-200 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    D'code IAS Academy • 1.5 Years Full Foundation
                  </p>
                  <button
                    onClick={handleBrochureClick}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D31218] hover:bg-[#A30D12] text-white text-xs font-bold uppercase tracking-wider"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Full PDF Brochure</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

      {/* Footer */}
      <Footer onOpenPolicy={() => {}} onNavigate={() => onBackToHome()} />
    </div>
  );
}
