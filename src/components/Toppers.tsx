import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, X } from 'lucide-react';

import neyaFlowerImg from '../assets/toppers/Neya flower.jpeg';
import arunPandianImg from '../assets/toppers/Arun Pandian.jpeg';
import kirubakaranImg from '../assets/toppers/Kirubakaran.jpeg';
import subramaniaBharathiImg from '../assets/toppers/Subranabia Bharathi.jpeg';
import nishanthTImg from '../assets/toppers/Dr. NISHANTH T..jpeg';
import sanjayImg from '../assets/toppers/Sanjay.jpeg';
import praveenArockiarajImg from '../assets/toppers/PRAVEEN AROCKIARAJ.jpeg';
import arunVadivarasanImg from '../assets/toppers/ARUN VADIVARASAN.jpeg';

interface TopperHighlight {
  name: string;
  rank: string;
  type: 'IAS' | 'IFoS';
  image: string;
  quote: string;
  strategy: string;
}

const TOPPER_HIGHLIGHTS: TopperHighlight[] = [
  { 
    name: "Neya Flower S", 
    rank: "CSE AIR - 515", 
    type: "IAS",
    image: neyaFlowerImg,
    quote: "The study materials and micro-notes methodology of D'code IAS Academy helped me compress and retain the entire syllabus.",
    strategy: "I revised the core NCERT syllabus systematically and solved all dynamic mock exams."
  },
  { 
    name: "Arun Pandian N", 
    rank: "CSE AIR - 213", 
    type: "IAS",
    image: arunPandianImg,
    quote: "Personal mentorship under Sudhagaran Sir helped me navigate complex optional subjects with absolute clarity.",
    strategy: "I structured my notes as answer flowcharts and maps to write authoritative answers in the mains exam."
  },
  { 
    name: "Mouleswaran S", 
    rank: "CSE AIR - 410", 
    type: "IAS",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80",
    quote: "The interactive counseling desk and daily test reviews pushed me to maintain a stellar streak throughout the year.",
    strategy: "Focused heavily on mains GS papers, dedicating 3 hours daily to answer evaluation reviews."
  },
  { 
    name: "Kirubakaran N", 
    rank: "CSE AIR - 439", 
    type: "IAS",
    image: kirubakaranImg,
    quote: "D'code's rich library facilities and interactive peer groups provided the ultimate academic environment.",
    strategy: "Analyzed current affairs through PIB and editorial mapping to align with UPSC GS mains guidelines."
  },
  { 
    name: "Subramania Bharathi", 
    rank: "CSE AIR - 778", 
    type: "IAS",
    image: subramaniaBharathiImg,
    quote: "The essay and ethics courses were a game-changer. They boosted my overall marks significantly.",
    strategy: "Practiced standard mind mapping to structure essays seamlessly during the active test hours."
  },
  { 
    name: "Nishanth T", 
    rank: "CSE AIR - 821", 
    type: "IAS",
    image: nishanthTImg,
    quote: "Regular one-on-one reviews of my answers under Sudhagaran Sir helped me correct persistent structure errors.",
    strategy: "Made comprehensive revision folders for general studies papers to support rapid revisions before mains."
  },
  { 
    name: "Sanjay S", 
    rank: "CSE AIR - 953", 
    type: "IAS",
    image: sanjayImg,
    quote: "Continuous counseling at D'code ensured I stayed focused and motivated, especially during the crucial mains phase.",
    strategy: "Systematically solved CSAT papers to eliminate errors and maintain high safety margins."
  },
  { 
    name: "Praveen Arockiaraj J", 
    rank: "IFoS AIR - 102", 
    type: "IFoS",
    image: praveenArockiarajImg,
    quote: "The scientific precision demanded by the Forest Service exam was covered brilliantly by the mentorship team.",
    strategy: "Prepared short, fact-driven notes for biology and forestry subjects with high diagram density."
  },
  { 
    name: "Arun Vadivarasan E", 
    rank: "IFoS AIR - 128", 
    type: "IFoS",
    image: arunVadivarasanImg,
    quote: "Sudhagaran Sir's personal optional audits helped me build answer structures that stood out to the evaluators.",
    strategy: "Leveraged mapping, graphs, and structured case studies to enrich papers and secure a top national rank."
  }
];

interface ActiveItem {
  title: string;
  category: string;
  description: string;
  image: string;
}

export default function Toppers() {
  const [activeItem, setActiveItem] = useState<ActiveItem | null>(null);

  return (
    <section className="py-16 bg-slate-50 border-b border-gray-150 relative">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10">
        <div className="bg-white rounded-2xl border border-gray-200/70 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column - Section Info */}
            <div className="lg:col-span-4">
              <span className="font-space text-xs font-bold uppercase tracking-widest text-[#D31218] block mb-2">
                DIRECT MENTORSHIP SELECTIONS
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D2C54] tracking-tight mb-3">
                UPSC Toppers under Sudhagaran Sir
              </h3>
              <p className="font-sans text-xs sm:text-sm text-gray-500 leading-relaxed">
                Under the direct academic guidance and intensive answer-writing clinics supervised by our founder, these candidates secured elite national ranks in the UPSC Civil Services and Forest Services exams.
              </p>
              <div className="mt-5 flex items-center gap-2.5 text-[#D31218]">
                <Award className="w-5 h-5 animate-bounce" />
                <span className="font-space text-xs font-bold uppercase tracking-wider">
                  Guaranteed Results & Dedication
                </span>
              </div>
            </div>

            {/* Right Column - Toppers Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {TOPPER_HIGHLIGHTS.map((topper) => (
                <div 
                  key={topper.name}
                  className="p-2 bg-slate-50/50 rounded-xl border border-gray-200/50 shadow-xs hover:border-[#D31218]/25 hover:bg-white transition-all group cursor-pointer flex flex-col justify-between"
                  onClick={() => {
                    setActiveItem({
                      title: `${topper.name} (${topper.rank})`,
                      category: `UPSC ${topper.type} Selection`,
                      description: `"${topper.quote}"\n\n💡 Prep Strategy:\n${topper.strategy}`,
                      image: topper.image
                    });
                  }}
                >
                  <div>
                    {/* Topper Avatar Frame */}
                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden mb-2 bg-gray-100 border border-gray-150">
                      <img 
                        src={topper.image} 
                        alt={topper.name} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {/* Floating Rank overlay inside avatar */}
                      <div className="absolute top-1.5 left-1.5">
                        <span className="font-space text-[8px] font-extrabold text-[#D31218] tracking-wider uppercase bg-white/95 border border-red-100 px-1.5 py-0.5 rounded shadow-sm">
                          {topper.rank.split(' ').pop()}
                        </span>
                      </div>
                    </div>

                    <h5 className="font-serif text-xs font-bold text-[#0D2C54] group-hover:text-[#D31218] transition-colors line-clamp-1">
                      {topper.name}
                    </h5>
                  </div>
                  <p className="font-sans text-[9px] text-gray-400 mt-0.5">
                    UPSC {topper.type}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setActiveItem(null)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-10 border-none outline-none"
              onClick={() => setActiveItem(null)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Poster container */}
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Frame */}
              <div className="flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-2">
                <img 
                  src={activeItem.image} 
                  alt={activeItem.title} 
                  className="max-w-full max-h-[68vh] sm:max-h-[72vh] object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title, Category & Description at bottom */}
              <div className="p-4 sm:p-6 border-t border-gray-100 bg-white">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {activeItem.category && (
                    <>
                      <span className="font-space text-[10px] uppercase tracking-wider font-extrabold text-[#D31218] bg-[#D31218]/10 px-2.5 py-0.5 rounded-full border border-[#D31218]/10">
                        {activeItem.category}
                      </span>
                      <span className="text-gray-300">•</span>
                    </>
                  )}
                  <span className="text-xs text-gray-400 font-mono">D'code IAS Official Media</span>
                </div>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#0D2C54] mb-1.5">
                  {activeItem.title}
                </h4>
                <p className="font-sans text-xs sm:text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                  {activeItem.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
