import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Trophy, LineChart, Layers, Users, BookOpen, Search, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProgressionPhase {
  phase: string;
  duration: string;
  milestone: string;
  details: string[];
}

interface CourseDetailedSchema {
  id: string;
  title: string;
  tagline: string;
  totalHours: string;
  weeklyTests: string;
  mentoringRatio: string;
  progression: ProgressionPhase[];
}

const COURSES_ANALYSIS_DATA: CourseDetailedSchema[] = [
  {
    id: "foundation",
    title: "UPSC Integrated Foundation 2027",
    tagline: "Absolute zero-to-advanced pathway for ultimate syllabus coverage.",
    totalHours: "1200+ Class Hours",
    weeklyTests: "2 Tests / Week",
    mentoringRatio: "1:1 Dedicated Mentor",
    progression: [
      {
        phase: "Phase 1: NCERT & Core Concepts",
        duration: "Months 1 - 3",
        milestone: "Baseline assessment & conceptual clarity",
        details: [
          "NCERT foundation classes covering Class 6 to 12 subjects.",
          "Basic answer writing: structuring intros and conclusions.",
          "Weekly MCQ tests on current affairs basics."
        ]
      },
      {
        phase: "Phase 2: Advanced Syllabus & Mains Integration",
        duration: "Months 4 - 8",
        milestone: "Micro-topic syllabus coverage & core books",
        details: [
          "Deep dive into Laxmikanth (Polity), Ramesh Singh (Economy), Spectrum (History).",
          "GS-1, GS-2, and GS-3 paper-by-paper integration.",
          "Bi-weekly mains answer evaluations audited by senior mentors."
        ]
      },
      {
        phase: "Phase 3: Prelims Targeting & Test Series",
        duration: "Months 9 - 11",
        milestone: "10,000+ MCQs & GS refinement",
        details: [
          "Specialized CSAT workshops & math/analytical training.",
          "Prelims simulation test series on real UPSC standard.",
          "Current affairs revision briefs and map markings."
        ]
      },
      {
        phase: "Phase 4: Intensive Mains Writing",
        duration: "Month 12+",
        milestone: "Full-length mock exam series",
        details: [
          "GS 1-4 full-length test simulation (3 hours each).",
          "Personalized review meetings with Sudhagaran Sir.",
          "Value-addition matrices for score maximization."
        ]
      }
    ]
  },
  {
    id: "mains",
    title: "Mains Momentum Program 2027",
    tagline: "Dedicated answer structuring and evaluation feedback loop.",
    totalHours: "450+ Practice Hours",
    weeklyTests: "Daily Answer Structuring",
    mentoringRatio: "Immediate Feedback Queue",
    progression: [
      {
        phase: "Phase 1: Question Deconstruction",
        duration: "Weeks 1 - 4",
        milestone: "Understanding core directive verbs",
        details: [
          "Analyze verbs like: Evaluate, Critically Analyze, Elucidate, Discuss.",
          "Developing template intro scripts for frequently asked areas.",
          "Mastering standard constitution articles and supreme court cases."
        ]
      },
      {
        phase: "Phase 2: Paragraph vs. Point-Wise Structuring",
        duration: "Weeks 5 - 12",
        milestone: "Content density and map inclusion",
        details: [
          "Speed training: drafting answers within 7 minutes.",
          "Drawing flowcharts, Venn diagrams, and India map outline maps in under 30 seconds.",
          "Daily upload with expert score breakdowns."
        ]
      },
      {
        phase: "Phase 3: Value Addition Metrics",
        duration: "Weeks 13 - 16",
        milestone: "Advanced data points & reports",
        details: [
          "Integrating 2nd ARC recommendations, Economic Survey, and NITI Aayog action plans.",
          "Case-study mapping to ethically enrich GS-4 responses.",
          "Simulated full mock drills in Anna Nagar exam halls."
        ]
      }
    ]
  },
  {
    id: "optionals",
    title: "Optional Masterclasses (Soc, Pub-Ad, Anthro)",
    tagline: "Highly analytical coaching targeting 300+ marks in optionals.",
    totalHours: "350+ Core Hours",
    weeklyTests: "1 Test / Week",
    mentoringRatio: "Specialist Optional Boards",
    progression: [
      {
        phase: "Phase 1: Thinkers & Theoretical Frameworks",
        duration: "Months 1 - 2",
        milestone: "Establishing solid conceptual foundations",
        details: [
          "Sociology: Karl Marx, Max Weber, Emile Durkheim.",
          "Public Administration: Taylor, Fayol, Administrative Behaviour.",
          "Anthropology: Physical theories, human genetics, tribal communities."
        ]
      },
      {
        phase: "Phase 2: Applied Indian Systems",
        duration: "Months 3 - 4",
        milestone: "Interlinking Paper 1 theories with Paper 2",
        details: [
          "Integrating Indian social structures, tribal developments, or local self-governments.",
          "Analysis of administrative reforms & central state dynamics.",
          "Mains test series with specialized individual evaluator notes."
        ]
      }
    ]
  }
];

export default function CourseDetailedAnalysis() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("foundation");
  const activeCourse = COURSES_ANALYSIS_DATA.find(c => c.id === selectedCourseId) || COURSES_ANALYSIS_DATA[0];

  return (
    <section id="detailed-analysis" className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-space text-xs font-bold uppercase tracking-widest text-[#D31218] bg-red-100 px-3 py-1 rounded inline-block mb-3">
            Pedagogical Breakdown
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2C54] tracking-tight">
            Detailed Analysis of Course
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
            See how our preparation pipelines are structurally layered to ensure absolute syllabus tracking, feedback audits, and score enhancement.
          </p>
        </div>

        {/* Outer Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Navigation Buttons */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-space text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-4 px-1">
              Select Program Pathway
            </h4>
            
            {COURSES_ANALYSIS_DATA.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  selectedCourseId === course.id
                    ? 'border-[#D31218] bg-[#0D2C54] shadow-md'
                    : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div>
                  <h3 className={`font-serif text-sm sm:text-base font-bold transition-colors duration-250 ${
                    selectedCourseId === course.id
                      ? 'text-white'
                      : 'text-[#0D2C54] group-hover:text-[#D31218]'
                  }`}>
                    {course.title}
                  </h3>
                  <p className={`font-sans text-[11px] mt-1 line-clamp-1 transition-colors duration-250 ${
                    selectedCourseId === course.id 
                      ? 'text-gray-300' 
                      : 'text-gray-500 group-hover:text-[#0D2C54]'
                  }`}>
                    {course.tagline}
                  </p>
                </div>
                <Clock className={`w-4 h-4 shrink-0 ml-3 transition-transform duration-250 ${
                  selectedCourseId === course.id 
                    ? 'text-red-300 translate-x-1' 
                    : 'text-gray-400 group-hover:text-[#D31218]'
                }`} />
              </button>
            ))}

            <div className="mt-8 p-5 bg-[#0D2C54]/5 border border-[#0D2C54]/10 rounded-2xl">
              <span className="font-space text-[9px] font-extrabold uppercase text-[#D31218] tracking-widest block mb-1">
                Evaluation Metric
              </span>
              <p className="font-sans text-[11px] text-[#0D2C54] leading-relaxed">
                All evaluation frameworks, score models, and answer reviews are personally audited by <strong>Sudhagaran Sir</strong>.
              </p>
            </div>
          </div>

          {/* Right Detailed Panel */}
          <div className="lg:col-span-8 bg-slate-50/50 border border-gray-200/60 rounded-3xl p-6 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCourse.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Course Header Info */}
                <div className="border-b border-gray-200/80 pb-6">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0D2C54]">
                    {activeCourse.title}
                  </h3>
                  <p className="font-sans text-xs text-gray-500 mt-1">
                    {activeCourse.tagline}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-3 mt-5">
                    <div className="bg-white p-3 rounded-xl border border-gray-200/80 text-center">
                      <Clock className="w-4 h-4 text-[#D31218] mx-auto mb-1" />
                      <p className="font-sans text-[10px] text-gray-400">Total Duration</p>
                      <p className="font-space text-[10px] font-bold text-[#0D2C54] uppercase tracking-wider mt-0.5">{activeCourse.totalHours}</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-xl border border-gray-200/80 text-center">
                      <Calendar className="w-4 h-4 text-[#D31218] mx-auto mb-1" />
                      <p className="font-sans text-[10px] text-gray-400">Assessment Cycle</p>
                      <p className="font-space text-[10px] font-bold text-[#0D2C54] uppercase tracking-wider mt-0.5">{activeCourse.weeklyTests}</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-xl border border-gray-200/80 text-center">
                      <Users className="w-4 h-4 text-[#D31218] mx-auto mb-1" />
                      <p className="font-sans text-[10px] text-gray-400">Mentorship Ratio</p>
                      <p className="font-space text-[10px] font-bold text-[#0D2C54] uppercase tracking-wider mt-0.5">{activeCourse.mentoringRatio}</p>
                    </div>
                  </div>
                </div>

                {/* Vertical Progression Map */}
                <div className="space-y-6">
                  <h4 className="font-space text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                    Course Phases & Milestones
                  </h4>

                  <div className="relative border-l border-gray-200 ml-3.5 pl-7 space-y-8">
                    {activeCourse.progression.map((item, idx) => (
                      <div key={idx} className="relative group">
                        
                        {/* Number bullet */}
                        <div className="absolute -left-[43px] top-1.5 w-8 h-8 rounded-full bg-white border-2 border-[#0D2C54] flex items-center justify-center text-xs font-bold text-[#0D2C54] group-hover:border-[#D31218] group-hover:text-[#D31218] transition-all duration-300">
                          {idx + 1}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h5 className="font-serif text-sm sm:text-base font-bold text-[#0D2C54]">
                              {item.phase}
                            </h5>
                            <span className="font-mono text-[9px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                              {item.duration}
                            </span>
                          </div>
                          
                          <p className="font-sans text-[11px] font-semibold text-[#D31218] mt-1">
                            Milestone: {item.milestone}
                          </p>

                          <ul className="mt-3.5 space-y-2">
                            {item.details.map((detail, d_idx) => (
                              <li key={d_idx} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                                <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
