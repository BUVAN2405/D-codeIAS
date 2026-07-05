import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ZoomIn, X, Award, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

import ceoPhoto from '../Ceo.jpeg';
import academyLogo from '../LOGO.jpeg';

import img1 from '../1.jpeg';
import img2 from '../2.jpeg';
import img3 from '../3.jpeg';
import img4 from '../4.jpeg';
import img5 from '../5.jpeg';

import neyaFlowerImg from '../assets/toppers/Neya flower.jpeg';
import arunPandianImg from '../assets/toppers/Arun Pandian.jpeg';
import kirubakaranImg from '../assets/toppers/Kirubakaran.jpeg';
import subramaniaBharathiImg from '../assets/toppers/Subranabia Bharathi.jpeg';
import nishanthTImg from '../assets/toppers/Dr. NISHANTH T..jpeg';
import sanjayImg from '../assets/toppers/Sanjay.jpeg';
import praveenArockiarajImg from '../assets/toppers/PRAVEEN AROCKIARAJ.jpeg';
import arunVadivarasanImg from '../assets/toppers/ARUN VADIVARASAN.jpeg';
import rajeshwariSuveImg from '../assets/toppers/Rajeshwari Suve M.jpeg';

interface GalleryItem {
  id: number;
  title: string;
  category?: string;
  description: string;
  image: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 11,
    title: "UPSC Preparatory Session",
    category: "Coaching",
    description: "Dedicated learning atmosphere inside D'code IAS Academy, where future civil servants build their foundation.",
    image: img1
  },
  {
    id: 12,
    title: "Interactive Syllabus Strategy Hub",
    category: "Mentorship",
    description: "Personalized strategy review session where answer blueprints are audited under Sudhagaran Sir's guidance.",
    image: img2
  },
  {
    id: 13,
    title: "State-of-the-Art Classroom Infrastructure",
    category: "Campus",
    description: "Modern, high-tech classroom setup equipped to offer absolute clarity in lectures and test analysis.",
    image: img3
  },
  {
    id: 3,
    title: "D'code IAS Academy Main Campus",
    category: "Campus",
    description: "The beautifully illuminated, backlit signature logo greeting serious civil service aspirants.",
    image: academyLogo
  },
  {
    id: 14,
    title: "Comprehensive Study Hall",
    category: "Infrastructure",
    description: "A well-equipped resource center and study space designed for persistent revision and research.",
    image: img4
  },
  {
    id: 15,
    title: "Individually Supervised Answer Writing",
    category: "Mentorship",
    description: "One-on-one evaluations where each candidate's structure and writing velocity are analyzed.",
    image: img5
  },
  {
    id: 2,
    title: "Classroom Mentorship Masterclass",
    category: "Live Teaching",
    description: "Sudhagaran Sir dissecting the civil services syllabus and answer-writing mindmaps at the conference table.",
    image: ceoPhoto
  },
  {
    id: 4,
    title: "D'code IAS Academy Official Brand",
    category: "Infrastructure",
    description: "The beautifully illuminated, backlit main gateway of our Anna Nagar campus, greeting serious aspirants.",
    image: academyLogo
  }
];

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
    name: "Rajeshwari Suve M",
    rank: "CSE AIR - 2",
    type: "IAS",
    image: rajeshwariSuveImg,
    quote: "The personalized mentorship program and intensive answer-writing guidance under Sudhagaran Sir were pivotal to my success.",
    strategy: "I focused on syllabus mapping, consistent answer auditing, and daily review loops to refine my optional and GS papers."
  },
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

export default function MovingGallery() {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || activeItem !== null) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === GALLERY_ITEMS.length - 1 ? 0 : prev + 1));
    }, 4000); // Auto-slide every 4 seconds
    return () => clearInterval(interval);
  }, [isPlaying, activeItem]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? GALLERY_ITEMS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === GALLERY_ITEMS.length - 1 ? 0 : prev + 1));
  };

  const translateX = `-${currentIndex * 100}%`;

  return (
    <section className="py-20 bg-slate-50 overflow-hidden border-b border-gray-150 relative" id="academy-gallery">
      {/* Design accents */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-red-50/50 rounded-br-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-50/50 rounded-tl-full pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10 mb-12">
        {/* Section Header */}
        <div className="text-center">
          <span className="font-space text-xs font-bold uppercase tracking-widest text-[#D31218] bg-[#D31218]/8 px-3.5 py-1 rounded inline-flex items-center gap-1.5 mb-4 border border-[#D31218]/15">
            <Trophy className="w-3.5 h-3.5" /> ACADEMY GALLERY & HALL OF FAME
          </span>
          <h3 className="font-serif text-3xl sm:text-4.5xl font-bold tracking-tight text-[#0D2C54] mb-4">
            Inside D'code IAS Academy
          </h3>
          <p className="font-sans text-xs sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Explore active moments of mentorship, modern state-of-the-art campus learning environments, and our proud 2025 IAS & IFoS topper releases.
            <span className="block mt-1.5 font-semibold text-[#D31218] text-xs font-space uppercase tracking-wider">
              ✨ Click any photo below to inspect in full-screen interactive view ✨
            </span>
          </p>
        </div>
      </div>

      {/* Sliding Cards Carousel Section */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10">

        {/* Navigation buttons and progress line display */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-gray-400">
              Image <span className="text-[#D31218] font-bold">{currentIndex + 1}</span> of {GALLERY_ITEMS.length}
            </span>
            <div className="hidden sm:block h-[2px] w-24 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D31218] transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / GALLERY_ITEMS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer border-gray-300 text-[#0D2C54] hover:border-[#D31218] hover:bg-red-50/30"
              aria-label="Previous slide"
              id="gallery-prev-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer border-gray-300 text-[#0D2C54] hover:border-[#D31218] hover:bg-red-50/30"
              aria-label="Next slide"
              id="gallery-next-btn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Window */}
        <div
          className="overflow-hidden py-4 -mx-4 px-4 sm:mx-0 sm:px-0"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          <motion.div
            className="flex gap-0"
            animate={{ x: translateX }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
          >
            {GALLERY_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`w-full shrink-0 px-2 box-border`}
                id={`gallery-card-${item.id}`}
              >
                <div className={`w-full rounded-2xl overflow-hidden relative cursor-pointer group aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.4/1] max-h-[500px] shadow-md hover:shadow-xl transition-all duration-500 border border-gray-150 ${activeItem?.id === item.id ? 'ring-4 ring-[#D31218]' : ''
                  }`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />

                  {/* Elegant dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Info Overlay (Sits perfectly at the bottom of the image slider frame) */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10 flex flex-col justify-end text-white">
                    {item.category && (
                      <span className="self-start font-space text-[10px] uppercase tracking-wider font-extrabold text-white bg-[#D31218] px-3 py-1 rounded mb-2.5 shadow-sm">
                        {item.category}
                      </span>
                    )}
                    <h4 className="font-serif text-base sm:text-xl lg:text-2xl font-bold text-white leading-tight group-hover:text-red-200 transition-colors">
                      {item.title}
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-gray-200 line-clamp-1 mt-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      {item.description}
                    </p>
                  </div>

                  {/* Sleek top right Zoom Button icon on hover */}
                  <div className="absolute top-4 right-4 bg-white/95 text-[#0D2C54] rounded-full p-2.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
                    <ZoomIn className="w-4 h-4 text-[#D31218]" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bullet indicator for all screens */}
        <div className="flex justify-center gap-2 mt-6">
          {GALLERY_ITEMS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsPlaying(false);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx ? 'w-8 bg-[#D31218]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>

      {/* Toppers Direct Mentorship Shelf */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mt-16 relative z-10">
        <div className="bg-white rounded-2xl border border-gray-200/70 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <span className="font-space text-xs font-bold uppercase tracking-widest text-[#D31218] block mb-2">
                TESTIMONIALS
              </span>
              <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D2C54] tracking-tight mb-3">
                TESTIMONIALS OF TOPPERS
              </h4>
              <p className="font-sans text-xs sm:text-sm text-gray-500 leading-relaxed">
                Under the mentorship of Sudhagaran Sir who had aided in their UPSC journey and Forest Services exams.
              </p>
              <div className="mt-5 flex items-center gap-2.5 text-[#D31218]">
                <Award className="w-5 h-5" />
                <span className="font-space text-xs font-bold uppercase tracking-wider">
                  Guaranteed Results & Dedication
                </span>
              </div>
            </div>

            {/* Topper Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {TOPPER_HIGHLIGHTS.map((topper) => (
                <div
                  key={topper.name}
                  className="p-2 bg-slate-50/50 rounded-xl border border-gray-200/50 shadow-xs hover:border-[#D31218]/25 hover:bg-white transition-all group cursor-pointer flex flex-col justify-between"
                  onClick={() => {
                    setActiveItem({
                      id: 999,
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
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          topper.name === "Rajeshwari Suve M" 
                            ? "scale-[1.6] origin-[50%_18%] group-hover:scale-[1.7]" 
                            : "object-top group-hover:scale-105"
                        }`}
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
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-10"
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
                <p className="font-sans text-xs sm:text-sm text-gray-500 leading-relaxed">
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
