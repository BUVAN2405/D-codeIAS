import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Download,
  ArrowRight,
  Award,
  Phone,
  ChevronRight,
  X,
  FileDown
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

interface PrelimsConquerCoursePageProps {
  onBackToHome: () => void;
  onEnrollClick?: (packageName?: string) => void;
}

export type PlanType = 'test_series_only' | 'gs_csat_gs_crash' | 'csat_crash_test' | 'complete_combo';

interface CoursePlan {
  id: PlanType;
  name: string;
  shortName: string;
  heroSubtitle: string;
  badge?: string;
  price: number;
  totalTests: number;
  totalTestsDetail: string;
  brochureType: 'csat' | 'pts';
  brochureName: string;
  brochureUrl: string;
  description: string;
  featuresTitle: string;
  features: string[];
}

const COURSE_PLANS: Record<PlanType, CoursePlan> = {
  test_series_only: {
    id: 'test_series_only',
    name: 'TEST SERIES ONLY (GS + CSAT Tests)',
    shortName: 'Test Series Only (GS + CSAT)',
    heroSubtitle: 'GS + CSAT Test Series (43 Tests)',
    price: 8999,
    totalTests: 43,
    totalTestsDetail: '28 GS + 15 CSAT',
    brochureType: 'pts',
    brochureName: 'Prelims Conquer Test Series Brochure (PDF)',
    brochureUrl: '/D_code_IAS_Prelims_Conquer_PTS_Brochure_2026-27.pdf',
    description: 'Complete rigorous Prelims simulation track featuring 43 high-standard UPSC tests (28 General Studies + 15 CSAT) with detailed post-test analysis and explanation PDFs.',
    featuresTitle: 'Test Series Key Features',
    features: [
      '43 Total Tests (28 GS + 15 CSAT Papers)',
      'UPSC-Standard Questions crafted to match real prelims difficulty',
      'Live Discussion Classes after every test to resolve doubts and analyze mistakes',
      'Detailed Post-Test Analysis with downloadable explanation PDFs',
      '17 GS Topic-Wise Tests + 6 Full Length Revision Tests + 3 GS Mocks + 2 Online Mocks',
      '10 CSAT Topic-Wise Tests + 5 Full Length CSAT Papers'
    ]
  },
  gs_csat_gs_crash: {
    id: 'gs_csat_gs_crash',
    name: 'GS Test Series + CSAT Test Series + GS Crash Course',
    shortName: 'GS Crash + Tests',
    heroSubtitle: 'GS Crash Course + 43 Tests (GS + CSAT)',
    price: 13499,
    totalTests: 43,
    totalTestsDetail: '28 GS + 15 CSAT',
    brochureType: 'pts',
    brochureName: 'PTS Complete Program Brochure (PDF)',
    brochureUrl: '/D_code_IAS_Prelims_Conquer_PTS_Brochure_2026-27.pdf',
    description: 'All 43 tests paired with intensive General Studies Crash Course classes, Daily Direction lectures, and Theme-by-Theme PYQ decoding.',
    featuresTitle: 'GS Key Features',
    features: [
      'Daily Direction Classes: A short daily class that sets your focus and direction for the day.',
      'Daily Micro Test: A quick daily test to check what you learned and keep revision regular.',
      'Theme Analysis With PYQ in Classes: Topics taught theme by theme, with PYQs showing how UPSC asks them.',
      'Integrated Current Affairs Classes: Extra attention to the 2026 paper to understand how static and current go together.',
      'UPSC Standard Questions: Questions set at the difficulty and pattern of the real Prelims paper.',
      'Live Discussion Classes After Every Test: Detailed analysis and explanation PDF to learn from each mistake and improve.',
      'All 43 Tests (28 GS + 15 CSAT) with full evaluation & discussion.'
    ]
  },
  csat_crash_test: {
    id: 'csat_crash_test',
    name: 'CSAT Full Course + CSAT Test Series',
    shortName: 'Full CSAT Course + CSAT Test Series',
    heroSubtitle: 'Full CSAT Course + 15 CSAT Tests',
    price: 9499,
    totalTests: 15,
    totalTestsDetail: '10 Topic-Wise + 5 Full Length',
    brochureType: 'csat',
    brochureName: 'CSAT Dedicated Track Brochure (PDF)',
    brochureUrl: '/D_code_IAS_Prelims_CSAT_Brochure_2026-27.pdf',
    description: 'Dedicated high-impact CSAT track for non-math backgrounds and students wanting guaranteed qualifying score (66.67+) with zero fear.',
    featuresTitle: 'CSAT Key Features',
    features: [
      'Comprehensive CSAT Course: Master Quantitative Aptitude, Logical Reasoning, Data Interpretation, Data Sufficiency, and Reading Comprehension.',
      'Topic by Topic Concept Building & Practice: Build strong fundamentals through systematic concept learning, guided practice, and right approach.',
      'Complete PYQ Solving in Class: Gain exam insights by solving Previous Year Questions (PYQs) in class and mastering shortcuts.',
      '5,000+ MCQs Covered: Strengthen your preparation with an extensive question bank designed to improve accuracy, speed, and confidence.',
      'UPSC Standard Test Followed by Discussion: Evaluate preparation through UPSC-standard tests with detailed discussions to clarify concepts.',
      '15 Total Tests: 10 Topic-Wise Tests + 5 Full-Length simulation papers with 80 MCQs each.'
    ]
  },
  complete_combo: {
    id: 'complete_combo',
    name: 'GS + CSAT Test Series + GS Crash Course + CSAT Full Course',
    shortName: 'Full Course (Complete Combo)',
    heroSubtitle: 'Complete Course + 43 Tests Mentorship',
    badge: 'MOST POPULAR • COMPLETE PACK',
    price: 14499,
    totalTests: 43,
    totalTestsDetail: '28 GS + 15 CSAT',
    brochureType: 'pts',
    brochureName: 'PTS Complete Program Brochure (PDF)',
    brochureUrl: '/D_code_IAS_Prelims_Conquer_PTS_Brochure_2026-27.pdf',
    description: 'The ultimate 360-degree UPSC Prelims 2027 Conquer Masterplan. Combines every GS lecture, CSAT class, all 43 tests, and personal mentorship under Sudhagaran Sir.',
    featuresTitle: 'Full Course Complete Package Features',
    features: [
      'Complete Course: Includes both the GS Crash Course and the Full CSAT Course.',
      '43 GS + CSAT Tests: Access all 28 GS and 15 CSAT tests online or in the Anna Nagar classroom.',
      'Daily Preparation: Build a consistent routine with Daily Direction Classes and Daily Micro-Tests.',
      'PYQ Analysis: Study themes and learn from detailed analysis of the latest UPSC paper trends.',
      'Complete CSAT Preparation: Practice with 5,000+ MCQs, concept drills, and PYQ elimination techniques.',
      'Test Discussions: Review every test in live discussion classes and use the included explanation PDFs.',
      'Personal Mentorship: Get guidance and performance auditing from Sudhagaran Sir and his team.'
    ]
  }
};

export default function PrelimsConquerCoursePage({ onBackToHome, onEnrollClick }: PrelimsConquerCoursePageProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<PlanType>('complete_combo');

  // Brochure Download Lead Modal State
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [brochureLead, setBrochureLead] = useState({ name: '', phone: '' });
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const selectedPlan = COURSE_PLANS[selectedPlanId];

  const handleEnrollAction = () => {
    if (onEnrollClick) {
      onEnrollClick(selectedPlan.name);
    } else {
      window.location.href = `/#enroll?course=${encodeURIComponent(selectedPlan.name)}`;
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(handleEnrollAction, 30_000);
    return () => window.clearTimeout(timer);
  }, [selectedPlan.name, onEnrollClick]);

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
        course: selectedPlan.name,
        formType: 'inquiry',
        message: `Brochure Request for ${selectedPlan.name} (${selectedPlan.brochureName})`
      });

      // Trigger actual download of brochure
      const filename = selectedPlan.brochureUrl.replace('/', '');
      triggerDirectDownload(selectedPlan.brochureUrl, filename);

      setDownloadSuccess(true);
      setTimeout(() => {
        setIsBrochureModalOpen(false);
        setIsDownloading(false);
        setBrochureLead({ name: '', phone: '' });
      }, 1800);
    } catch (err) {
      console.error(err);
      // Still trigger download so user gets brochure even if network fails
      const filename = selectedPlan.brochureUrl.replace('/', '');
      triggerDirectDownload(selectedPlan.brochureUrl, filename);
      setIsBrochureModalOpen(false);
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0D2C54] font-sans selection:bg-red-100 selection:text-[#D31218]">
      
      {/* Top Navbar */}
      <Navbar
        onEnrollClick={() => onEnrollClick && onEnrollClick(selectedPlan.name)}
        onNavigate={(sectionId) => {
          onBackToHome();
          setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        activeSection="enquiry-27"
        onPrelimsConquerClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Wrapper with Top Padding to prevent merging with Fixed Navbar */}
      <div className="pt-24 sm:pt-28 md:pt-30">
        {/* Breadcrumbs Navigation */}
        <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
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
              All Courses
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#0D2C54] font-bold truncate">
              Prelims Conquer 2027 (Course + Test Series)
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
            <div className="bg-gradient-to-br from-[#0D2C54] via-[#163E72] to-[#0A2244] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm font-sans">
                    Classes Start: <span className="font-space font-extrabold tracking-wide">02 NOV 2026</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-200 text-xs font-semibold border border-white/20">
                    Online & Offline (Anna Nagar, Chennai)
                  </span>
                </div>

                {/* Dynamic Title & Subtitle based on Selected Course */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-sans font-extrabold tracking-tight leading-tight text-white">
                  UPSC Prelims Conquer <span className="font-space font-extrabold tracking-tight">2027</span> <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white transition-all">
                    {selectedPlan.heroSubtitle}
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-gray-200 font-sans leading-relaxed max-w-2xl">
                  Guided directly by <strong>Sudhagaran Sir</strong> (Former Mission Director of Naan Mudhalvan). A rigorous, research-backed prelims mastery roadmap combining daily direction classes, theme PYQ analysis, and personalized performance auditing.
                </p>

                {/* Quick Meta Pills (Only Total Tests & Test Mode) */}
                <div className="grid w-full grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-black/25 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Total Tests</p>
                    <p className="text-white font-extrabold text-base mt-0.5 font-space">
                      {selectedPlan.totalTests} Tests
                      <span className="ml-1 text-amber-300 text-[10px] font-medium">{selectedPlan.totalTestsDetail}</span>
                    </p>
                  </div>
                  <div className="bg-black/25 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Test Mode</p>
                    <p className="text-white font-bold text-base mt-0.5">Both Online & Offline</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Package Inclusions & Features */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6"
                >
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D31218]">
                      <span>Selected Package Inclusions</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0D2C54] mt-1">
                      {selectedPlan.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {selectedPlan.description}
                    </p>
                  </div>

                  {/* Dynamic Key Features List from Official Brochure */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#0D2C54] mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D31218]" />
                      {selectedPlan.featuresTitle}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedPlan.features.map((feat, idx) => {
                        const separatorIndex = feat.indexOf(':');
                        const title = separatorIndex >= 0 ? feat.slice(0, separatorIndex) : undefined;
                        const description = separatorIndex >= 0 ? feat.slice(separatorIndex + 1).trim() : feat;

                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-100 text-xs sm:text-sm text-gray-800 hover:border-[#0D2C54]/20 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="leading-snug">
                              {title && <p className="font-bold text-[#0D2C54]">{title}</p>}
                              <p className={title ? 'mt-1 text-gray-600' : ''}>{description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

              {/* Toppers Reviews */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-[2rem] border border-gray-200/70 bg-white p-4 shadow-sm sm:p-6 lg:p-8"
                >
                  <div className="space-y-6">
                    <div>
                      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#D31218]">
                        Testimonials
                      </span>
                      <h3 className="mb-3 font-serif text-2xl font-bold tracking-tight text-[#0D2C54] sm:text-3xl">
                        Testimonials of Toppers
                      </h3>
                      <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">
                        Under the mentorship of Sudhagaran Sir, who has aided them in their UPSC journey and Forest Services exams.
                      </p>
                      <div className="mt-5 flex items-center gap-2.5 text-[#D31218]">
                        <Award className="h-5 w-5 animate-bounce" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Guaranteed Results &amp; Dedication
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {[
                      {
                        name: 'Rajeshwari Suve M',
                        rank: '2',
                        exam: 'UPSC IAS',
                        image: topperRajeshwari,
                        imageClass: 'scale-[1.6] origin-[50%_18%] group-hover:scale-[1.7]'
                      },
                      {
                        name: 'Neya Flower S',
                        rank: '515',
                        exam: 'UPSC IAS',
                        image: topperNeya,
                        imageClass: 'object-top group-hover:scale-105'
                      },
                      {
                        name: 'Arun Pandian N',
                        rank: '213',
                        exam: 'UPSC IAS',
                        image: topperArunPandian,
                        imageClass: 'object-top group-hover:scale-105'
                      },
                      {
                        name: 'Kirubakaran N',
                        rank: '439',
                        exam: 'UPSC IAS',
                        image: topperKirubakaran,
                        imageClass: 'object-top group-hover:scale-105'
                      },
                      {
                        name: 'Subramania Bharathi',
                        rank: '778',
                        exam: 'UPSC IAS',
                        image: topperSubramania,
                        imageClass: 'object-top group-hover:scale-105'
                      },
                      {
                        name: 'Nishanth T',
                        rank: '821',
                        exam: 'UPSC IAS',
                        image: topperNishanth,
                        imageClass: 'object-top group-hover:scale-105'
                      },
                      {
                        name: 'Sanjay S',
                        rank: '953',
                        exam: 'UPSC IAS',
                        image: topperSanjay,
                        imageClass: 'object-top group-hover:scale-105'
                      },
                      {
                        name: 'Praveen Arockiaraj J',
                        rank: '102',
                        exam: 'UPSC IFoS',
                        image: topperPraveen,
                        imageClass: 'object-top group-hover:scale-105'
                      },
                      {
                        name: 'Arun Vadivarasan E',
                        rank: '128',
                        exam: 'UPSC IFoS',
                        image: topperArunVadivarasan,
                        imageClass: 'object-top group-hover:scale-105'
                      }
                    ].map((top) => (
                      <div
                        key={top.name}
                        className="group flex cursor-pointer flex-col justify-between rounded-xl border border-gray-200/50 bg-slate-50/50 p-2 shadow-xs transition-all hover:border-[#D31218]/25 hover:bg-white"
                      >
                        <div>
                          <div className="relative mb-2 aspect-[3/4] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                            <img
                              src={top.image}
                              alt={top.name}
                              loading="lazy"
                              className={`h-full w-full object-cover transition-transform duration-300 ${top.imageClass}`}
                            />
                            <span className="absolute left-1.5 top-1.5 rounded bg-white/95 px-1.5 py-0.5 font-space text-[8px] font-extrabold uppercase tracking-wider text-[#D31218] shadow-sm">
                              {top.rank}
                            </span>
                          </div>
                          <h4 className="line-clamp-2 font-serif text-xs font-bold text-[#0D2C54] transition-colors group-hover:text-[#D31218]">
                            {top.name}
                          </h4>
                        </div>
                        <p className="mt-0.5 font-sans text-[9px] text-gray-400">{top.exam}</p>
                      </div>
                    ))}
                    </div>
                  </div>
                </motion.div>

              {/* FAQs */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-4"
                >
                  <h3 className="text-xl font-serif font-bold text-[#0D2C54]">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100">
                      <h4 className="font-bold text-[#0D2C54]">Can I attend tests in offline classroom mode?</h4>
                      <p className="mt-2 text-gray-600 leading-relaxed">
                        Yes! All tests are available in offline classroom simulation at our Anna Nagar center (Diamond Plaza, 2nd Ave) with real OMR sheets and invigilation, as well as online via our portal.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100">
                      <h4 className="font-bold text-[#0D2C54]">When do the Prelims Conquer 2027 classes start?</h4>
                      <p className="mt-2 text-gray-600 leading-relaxed">
                        Classes officially commence on <strong>02 November 2026</strong>. Early bird orientation and preparation diagnostics are provided immediately upon enrollment.
                      </p>
                    </div>
                  </div>
                </motion.div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Sticky Package Selector & Pricing (4 Cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 sticky top-28 sm:top-32 space-y-5">
            
            <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-[#0D2C54]/10 relative overflow-hidden">
              
              {/* Header */}
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-serif text-[#0D2C54]">
                    Select Your Package
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Nov 2026 Batch
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Choose your course type to view custom pricing & schedule.
                </p>
              </div>

              {/* Package Radio Selector Cards */}
              <div className="py-4 space-y-2.5">
                {(Object.keys(COURSE_PLANS) as PlanType[]).map(planKey => {
                  const plan = COURSE_PLANS[planKey];
                  const isSelected = selectedPlanId === planKey;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[#0D2C54] bg-blue-50/40 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      {plan.badge && (
                        <span className="absolute -top-2.5 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D31218] text-white">
                          {plan.badge}
                        </span>
                      )}

                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="course_plan"
                          checked={isSelected}
                          onChange={() => setSelectedPlanId(plan.id)}
                          className="mt-1 w-4 h-4 text-[#0D2C54] focus:ring-[#0D2C54] cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className={`text-xs font-bold leading-snug ${isSelected ? 'text-[#0D2C54]' : 'text-gray-800'}`}>
                            {plan.name}
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-sm font-black text-[#D31218] font-space">
                              ₹{plan.price.toLocaleString('en-IN')}
                              <span className="text-[10px] font-normal text-gray-500 ml-1 font-sans">(incl. GST)</span>
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">
                              {plan.totalTests} Tests
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Summary Box */}
              <div className="mt-2 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Selected Package:</span>
                  <span className="font-bold text-[#0D2C54] truncate max-w-[170px]">{selectedPlan.shortName}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Total Payable:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#0D2C54] font-space">
                      ₹{selectedPlan.price.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[10px] text-gray-400">All Taxes & GST Included</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5">
                
                {/* Primary Enroll Button */}
                <button
                  onClick={handleEnrollAction}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#D31218] hover:bg-[#A30D12] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Enroll in this Package</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Specific Brochure Download Button - Opens Lead Capture Modal */}
                <button
                  onClick={handleBrochureClick}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-gray-50 border-2 border-[#0D2C54] text-[#0D2C54] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#D31218]" />
                  <span>Download {selectedPlan.brochureType === 'csat' ? 'CSAT' : 'PTS'} Brochure (PDF)</span>
                </button>

              </div>

              {/* Direct Admission Help Callout */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D31218]" />
                  <span>Admission Enquiry:</span>
                </div>
                <a
                  href="tel:9600060393"
                  className="font-bold text-[#0D2C54] hover:text-[#D31218] transition-colors"
                >
                  +91 96000 60393
                </a>
              </div>

            </div>

            {/* Telegram Community Quick Card */}
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-4 border border-sky-200 flex items-center justify-between text-xs shadow-xs">
              <div>
                <p className="font-bold text-[#0D2C54]">Join Telegram Study Group</p>
                <p className="text-[10px] text-gray-600">Daily micro notes & PYQ insights</p>
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

      {/* Brochure Download Lead Modal (Page 4 requirement) */}
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
                  Download Official Brochure
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your details to instantly receive the {selectedPlan.shortName} schedule & syllabus PDF.
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
                      placeholder="e.g. John Doe"
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
                        placeholder="1234567890"
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

      </div>

      {/* Footer */}
      <Footer onOpenPolicy={() => {}} onNavigate={() => onBackToHome()} />

    </div>
  );
}
