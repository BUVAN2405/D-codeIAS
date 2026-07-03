import { motion } from 'motion/react';
import { Landmark, Compass, Award, Shield } from 'lucide-react';

export default function AboutAcademy() {
  const values = [
    {
      icon: Compass,
      title: 'Clarity of Path',
      description: 'We cut through the noise of UPSC syllabus overload to provide clear, actionable mapping for every topic.'
    },
    {
      icon: Award,
      title: 'Systematic Preparation',
      description: 'Daily timelines, structured feedback, and progress tracking keep your prep rigorous and aligned.'
    },
    {
      icon: Shield,
      title: 'Structured Mentorship',
      description: 'Under the personal supervision of Sudhagaran Sir, you receive detailed feedback on your exact weaknesses.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-white border-b border-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-gray-50/50 to-transparent pointer-events-none" />
      
      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Graphic and statistics visual */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative p-8 bg-[#0D2C54] text-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Abstract lines bg */}
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
              <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-[#D31218]/10 blur-2xl" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-[#D31218]" />
                </div>
                <span className="font-space text-xs font-semibold uppercase tracking-widest text-[#ffb6b6]">
                  D'code Philosophy
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-white mb-4 leading-tight">
                "We simplify what others make complex."
              </h3>
              
              <p className="font-sans text-xs text-gray-300 leading-relaxed mb-8">
                Decode IAS Academy is committed to simplifying the IAS journey through clarity, systematic preparation, and structured mentoring. The academy helps aspirants navigate UPSC preparation with confidence through focused learning and a clear roadmap.
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                <div>
                  <p className="font-space text-2xl font-extrabold text-white">100%</p>
                  <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Syllabus Decoded</p>
                </div>
                <div>
                  <p className="font-space text-2xl font-extrabold text-[#D31218]">Personal</p>
                  <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Feedback Loops</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Text Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="font-space text-xs font-bold uppercase tracking-widest text-[#D31218]">
                About D'code IAS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0D2C54] leading-tight tracking-tight">
                Simplifying Your IAS <br />
                Journey and Guaranteeing Clarity.
              </h2>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">
                UPSC is often perceived as an ocean of information. At D'code IAS Academy, we operate under a single core directive: <strong>Simplify</strong>. Under the personal oversight of <strong>Sudhagaran Sir</strong>, we design systematic, paper-by-paper tracking spreadsheets and answer reviews so you always know exactly what to study next and how to execute on exam day.
              </p>

              {/* Value list items */}
              <div className="space-y-4 pt-4">
                {values.map((v, i) => {
                  const Icon = v.icon;
                  return (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#D31218] flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-space text-xs font-bold uppercase text-[#0D2C54] tracking-wider mb-1">
                          {v.title}
                        </h4>
                        <p className="font-sans text-xs text-gray-600 leading-relaxed">
                          {v.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
