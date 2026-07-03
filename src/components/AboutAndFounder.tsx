import { motion } from 'motion/react';
import { Youtube, Instagram, Award, ExternalLink, BookmarkCheck, ArrowUpRight } from 'lucide-react';

export default function AboutAndFounder() {
  return (
    <section id="about" className="py-24 bg-white border-b border-[#D31218]/10 overflow-hidden">
      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8">
        
        {/* About D'code Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D31218]/5 border border-[#D31218]/10 rounded text-[#D31218] font-space text-[10px] uppercase tracking-wider font-bold">
              <BookmarkCheck className="w-3.5 h-3.5" />
              About Our Academy
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D2C54] tracking-tight leading-tight">
              We Simplify Your <br />
              <span className="text-[#D31218]">IAS Journey.</span>
            </h2>
            
            <p className="font-sans text-sm sm:text-base text-gray-700 leading-relaxed">
              D'code IAS Academy is committed to simplifying the IAS journey through clarity, systematic preparation, and structured mentoring. We believe that UPSC Civil Services preparation doesn't have to be overwhelmingly complex. The academy helps aspirants navigate UPSC preparation with confidence through focused learning and a clear roadmap.
            </p>
            
            <p className="font-sans text-xs sm:text-sm text-gray-500 leading-relaxed">
              Under the direct, rigorous oversight of veteran mentors, we bypass rote-memorization. Instead, we map out the UPSC syllabus systematically, helping you build core concept clarity, answer logic, and writing speed.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="p-4 bg-[#F8FAFC] border border-gray-100 rounded-lg">
                <p className="font-serif text-2xl font-bold text-[#D31218]">Clarity</p>
                <p className="font-sans text-[11px] text-gray-500 mt-1">Direct breakdown of complex topics.</p>
              </div>
              <div className="p-4 bg-[#F8FAFC] border border-gray-100 rounded-lg">
                <p className="font-serif text-2xl font-bold text-[#D31218]">Systematic</p>
                <p className="font-sans text-[11px] text-gray-500 mt-1">Milestone-based progress tracker.</p>
              </div>
              <div className="p-4 bg-[#F8FAFC] border border-gray-100 rounded-lg">
                <p className="font-serif text-2xl font-bold text-[#D31218]">Structured</p>
                <p className="font-sans text-[11px] text-gray-500 mt-1">Dynamic feedback & mentor advice.</p>
              </div>
            </div>
          </motion.div>

          {/* Visual Side Banner */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0D2C54]/10 to-[#D31218]/10 rounded-2xl transform rotate-3" />
            <div className="relative bg-[#0D2C54] text-white p-8 sm:p-10 rounded-2xl shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-4">
                The D'code Guarantee
              </h3>
              <p className="font-sans text-xs text-gray-300 leading-relaxed mb-6">
                "Our core model strips away the unnecessary noise from civil services coaching, leaving a high-yield preparation ecosystem that accelerates learning."
              </p>

              <div className="space-y-3.5 border-t border-white/10 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D31218] flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                  <span className="font-sans text-xs font-semibold text-gray-200">100% Personal Mentorship Feedback</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D31218] flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                  <span className="font-sans text-xs font-semibold text-gray-200">High-Yield Bilingual Concept Materials</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D31218] flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                  <span className="font-sans text-xs font-semibold text-gray-200">Anna Nagar Premium UPSC Test Center</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Founder Spotlights */}
        <div id="founder" className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Founder Image Portrait */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-4"
            >
              <div className="relative rounded-xl overflow-hidden aspect-[3/4] max-w-sm mx-auto shadow-md border-2 border-white bg-[#0D2C54]">
                <img 
                  src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=600&auto=format&fit=crop&q=80" 
                  alt="Sudhagaran Sir" 
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
                  <p className="font-space text-[10px] uppercase tracking-widest text-[#ffb6b6] font-bold">FOUNDER & CHIEF MENTOR</p>
                  <p className="font-serif text-lg font-bold">Sudhagaran Sir</p>
                  <p className="font-sans text-[11px] text-gray-300">Former Mission Director, Naan Mudhalvan</p>
                </div>
              </div>
            </motion.div>

            {/* Founder Story and Direct Coordinates */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-8 space-y-6"
            >
              <div>
                <span className="font-space text-xs font-bold uppercase tracking-widest text-[#D31218] block mb-1">
                  MEET OUR FOUNDER
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0D2C54] tracking-tight">
                  Sudhagaran Sir
                </h3>
                <p className="font-sans text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
                  Former Mission Director of Naan Mudhalvan • Distinguished Administrative Mentor
                </p>
              </div>

              <div className="font-sans text-sm text-gray-700 space-y-4 leading-relaxed">
                <p>
                  Sudhagaran Sir, former Mission Director of Naan Mudhalvan, has mentored over 500 UPSC aspirants, guiding many towards success in the Civil Services Examination, including the achievement of Top 10 All India Ranks.
                </p>
                <p>
                  Renowned for his approach of simplicity and clarity, his mentorship has enabled several aspirants from Tamil Nadu to secure distinguished All India Ranks in the UPSC Civil Services Examination.
                </p>
                <p>
                  Building on this legacy, Sudhagaran Sir, along with a carefully curated team of experienced mentors, has embarked on a new mission through D’code IAS Academy—to nurture, mentor, and empower the next generation of Civil Services aspirants with the same proven approach that has shaped numerous success stories.
                </p>
              </div>

              <div className="space-y-3.5 border-t border-gray-200/60 pt-6">
                <h4 className="font-space text-xs font-bold uppercase tracking-widest text-[#0D2C54]">
                  Direct Counseling Pillars under Sudhagaran Sir:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D31218] mt-1.5 flex-shrink-0" />
                    <span>Personalized roadmap mapping & DAF guidance</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D31218] mt-1.5 flex-shrink-0" />
                    <span>One-on-one paper evaluation & answer enrichment</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D31218] mt-1.5 flex-shrink-0" />
                    <span>Intensive Public Administration & GS ethics tutoring</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D31218] mt-1.5 flex-shrink-0" />
                    <span>Rigorous mental stamina drills & study tracking</span>
                  </div>
                </div>
              </div>

              {/* Founder Social Links & YouTube Sub-CTA */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a 
                  href="https://www.youtube.com/@SudhagaranSirOfficial" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D31218] hover:bg-[#A30D12] text-white rounded font-space text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer border-none"
                >
                  <Youtube className="w-4 h-4 fill-white" />
                  YouTube channel
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a 
                  href="https://www.instagram.com/sudhagaran_sir_official_/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D2C54] hover:bg-opacity-90 text-white rounded font-space text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer border-none"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram profile
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a 
                  href="https://t.me/sudhagaranirps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-space text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer border-none"
                >
                  <span className="font-black text-xs font-mono">TG</span>
                  Telegram Channel
                </a>
              </div>

            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
