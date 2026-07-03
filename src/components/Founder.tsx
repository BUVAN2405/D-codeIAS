import { motion } from 'motion/react';
import { Instagram, Youtube, Send, Award, Users, CheckCircle, ExternalLink } from 'lucide-react';
import ceoImage from '../Ceo.jpeg';

export default function Founder() {
  const highlights = [
    'Former Mission Director of Naan Mudhalvan',
    'Mentored 500+ UPSC Aspirants & Guided Top 10 AIRs',
    'Simplicity and Clarity Approach for civil services prep',
    'Leading a Carefully Curated Team of Experienced Mentors'
  ];

  return (
    <section id="founder" className="py-24 bg-[#0D2C54] text-white relative overflow-hidden border-b border-white/5">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Professional image container with social overlay */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-[380px]"
            >
              {/* Card border decoration */}
              <div className="absolute inset-0 border border-[#D31218]/30 rounded-2xl transform translate-x-4 translate-y-4" />
              
              <div className="relative bg-[#112F5A] rounded-2xl p-4 border border-white/10 shadow-2xl">
                <img
                  src={ceoImage}
                  alt="Sudhagaran Sir - Founder"
                  className="w-full h-[360px] object-cover rounded-xl filter contrast-105"
                  referrerPolicy="no-referrer"
                />

                <div className="mt-5 text-center">
                  <h3 className="font-serif text-xl font-bold text-white" style={{ color: '#fdfdff' }}>Sudhagaran Sir</h3>
                  <p className="font-space text-xs text-[#ffb6b6] uppercase tracking-wider mt-1">
                    Founder & Chief Mentor
                  </p>
                  <p className="font-sans text-[10px] text-gray-400 mt-1">
                    Former Mission Director, Naan Mudhalvan
                  </p>
                </div>

                {/* Social media connections */}
                <div className="flex justify-center gap-4 mt-4 border-t border-white/5 pt-4">
                  <a
                    href="https://www.instagram.com/sudhagaran_sir_official_"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D31218] text-white flex items-center justify-center transition-all"
                    aria-label="Sudhagaran Sir Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.youtube.com/@SudhagaranSirOfficial"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D31218] text-white flex items-center justify-center transition-all"
                    aria-label="Sudhagaran Sir YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href="https://t.me/sudhagaranirps"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D31218] text-white flex items-center justify-center transition-all"
                    aria-label="Sudhagaran Sir Telegram"
                  >
                    <Send className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Detailed text presentation */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="font-space text-xs font-bold uppercase tracking-widest text-[#D31218] bg-[#D31218]/10 px-3 py-1 rounded-full inline-block">
                Meet the Founder
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Led by Sudhagaran Sir <br />
                <span className="text-[#ffb6b6]">Former Mission Director, Naan Mudhalvan</span>
              </h2>

              <div className="font-sans text-sm text-gray-300 space-y-4 leading-relaxed">
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

              <div className="border-l-4 border-[#D31218] pl-5 py-2 my-4 bg-white/5 rounded-r">
                <p className="italic text-xs font-serif text-gray-200">
                  "UPSC is not a test of your memory; it is a test of your clarity, articulation, and synthesis of critical issues. We simplify the mapping so you can express authority in every single mains answer you draft."
                </p>
                <p className="font-space text-[10px] uppercase font-semibold text-white mt-2 tracking-widest">
                  — Sudhagaran Sir
                </p>
              </div>

              {/* Highlights bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <CheckCircle className="w-4 h-4 text-[#D31218] shrink-0 mt-0.5" />
                    <span className="font-sans text-xs text-gray-200">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA links to Social Handles */}
              <div className="flex flex-wrap gap-4 pt-6">
                <a
                  href="https://www.youtube.com/@SudhagaranSirOfficial"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#D31218] hover:bg-[#A30D12] text-white font-space text-xs font-bold uppercase tracking-wider py-3 px-6 rounded transition-all active:scale-[0.98]"
                >
                  YouTube channel
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://t.me/sudhagaranirps"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-transparent hover:bg-white/5 border border-white/30 text-white font-space text-xs font-bold uppercase tracking-wider py-3 px-6 rounded transition-all active:scale-[0.98]"
                >
                  Join Telegram Channel
                  <Send className="w-4 h-4" />
                </a>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
