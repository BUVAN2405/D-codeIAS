import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Check, X, Star, Users, Flame, LayoutGrid, Hourglass } from 'lucide-react';

export default function WhyDcodeVisual() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const loopSteps = [
    {
      step: 1,
      title: "Write & Upload",
      time: "Hour 0",
      description: "Aspirant writes daily answers in exam-simulated conditions and uploads or hands in the hardcopy sheet."
    },
    {
      step: 2,
      title: "Mentor Evaluation",
      time: "Hour 2 - 12",
      description: "Dedicated expert mentors review the answer with precise margins annotations, checking argument flow, data correctness, and maps."
    },
    {
      step: 3,
      title: "1-on-1 Counseling Cabin",
      time: "Hour 12 - 20",
      description: "Aspirants sit inside 1-on-1 cabins with mentors to talk through constructive critiques and clear academic hurdles."
    },
    {
      step: 4,
      title: "Sudhagaran Sir's Quality Audit",
      time: "Hour 20 - 24",
      description: "Sudhagaran Sir randomly samples evaluated sheets to ensure grading consistency and correct pedagogical directions."
    }
  ];

  const metrics = [
    { label: "Mentored Candidates", value: "500+", desc: "Personally guided towards Civil Services pathways" },
    { label: "Top 10 All India Ranks", value: "AIR 1 - 10", desc: "Top-tier achievers shaped by simplified principles" },
    { label: "Feedback Commitment", value: "< 24 Hrs", desc: "Instant evaluation checks to prevent drift" },
    { label: "Personal Accountability", value: "100%", desc: "No passive lectures; active cabin-by-cabin milestones" }
  ];

  return (
    <section id="why-visual" className="py-20 bg-amber-50/10 border-b border-gray-150">
      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-space text-xs font-bold uppercase tracking-widest text-[#D31218] bg-red-100 px-3 py-1 rounded inline-block mb-3">
            What Makes Us Different
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2C54] tracking-tight">
            Why D'code IAS Academy?
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
            We reject overly complicated rote coaching. Here is the highly visual proof of how our mentorship ecosystem transforms preparation into selection.
          </p>
        </div>

        {/* 1. Comparison Board: Visual Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Legacy Coaching model */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs opacity-85 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <X className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-400">
                Traditional Rote Coaching
              </h3>
            </div>

            <ul className="space-y-4 font-sans text-xs text-gray-500">
              <li className="flex items-start gap-3 border-b border-gray-50 pb-3">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Overcrowded classrooms with 300+ students, ignoring individual weak areas.</span>
              </li>
              <li className="flex items-start gap-3 border-b border-gray-50 pb-3">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Mains test evaluations taking 15-20 days, rendering feedback loops stale.</span>
              </li>
              <li className="flex items-start gap-3 border-b border-gray-50 pb-3">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Passive lecture-listening without active typing or formatting practice.</span>
              </li>
              <li className="flex items-start gap-3 pb-3">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>No direct access to core founders or state-level career skill administrators.</span>
              </li>
            </ul>
          </div>

          {/* D'code IAS model */}
          <div className="bg-[#0D2C54] rounded-3xl border border-[#D31218]/30 p-6 sm:p-8 shadow-md text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D31218]/10 rounded-bl-full" />
            
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#D31218]/20 flex items-center justify-center text-[#ff8c8f]">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                D'code Mentorship Method
              </h3>
            </div>

            <ul className="space-y-4 font-sans text-xs text-gray-300">
              <li className="flex items-start gap-3 border-b border-white/5 pb-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Micro-cohort counseling cabins and 1-on-1 personalized preparation sheets.</span>
              </li>
              <li className="flex items-start gap-3 border-b border-white/5 pb-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Guaranteed 24-hour assessment cycle audited by Sudhagaran Sir.</span>
              </li>
              <li className="flex items-start gap-3 border-b border-white/5 pb-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Active, custom daily answer-writing practice with baseline feedback spreadsheets.</span>
              </li>
              <li className="flex items-start gap-3 pb-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Direct daily access to seasoned bureaucrats and expert educators.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 2. Visual 24-Hour Feedback Flowchart */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-10 mb-16 shadow-xs">
          <h3 className="font-serif text-xl font-bold text-[#0D2C54] text-center mb-8">
            The 24-Hour Evaluation & Counseling Pipeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {loopSteps.map((step) => (
              <div 
                key={step.step}
                onClick={() => setActiveStep(step.step)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative ${
                  activeStep === step.step
                    ? 'border-[#D31218] bg-red-50/40 shadow-xs'
                    : 'border-gray-150 bg-white hover:border-gray-300'
                }`}
              >
                {/* Arrow helper for large screens */}
                {step.step < 4 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-[#0D2C54]/20">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-full bg-[#0D2C54] text-white flex items-center justify-center font-space text-xs font-bold">
                    {step.step}
                  </span>
                  <span className="font-mono text-[9px] font-bold text-[#D31218] uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded-md">
                    {step.time}
                  </span>
                </div>

                <h4 className="font-serif text-sm font-bold text-[#0D2C54] mb-1.5">{step.title}</h4>
                <p className="font-sans text-xs text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Core Metrics Visual Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-200 rounded-3xl p-6 text-center shadow-xs hover:border-[#D31218]/20 hover:shadow-md transition-all duration-300"
            >
              <div className="text-[#D31218] font-space text-3xl font-extrabold tracking-tight mb-2">
                {metric.value}
              </div>
              <h4 className="font-serif text-sm font-bold text-[#0D2C54] mb-1">{metric.label}</h4>
              <p className="font-sans text-[11px] text-gray-500 leading-relaxed">{metric.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
