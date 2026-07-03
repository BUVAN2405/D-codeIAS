import { motion } from 'motion/react';
import { Eye, Map, FileEdit, Users, CheckCircle2 } from 'lucide-react';

export default function LearningProcess() {
  const steps = [
    {
      step: '01',
      title: 'Pattern Decoding',
      subtitle: 'Analyze PYQs & Trends',
      icon: Eye,
      description: 'We don\'t start with arbitrary readings. We dissect standard civil services questions from the last decade to catalog exact evaluation patterns and high-yield topics.'
    },
    {
      step: '02',
      title: 'Comprehensive Mapping',
      subtitle: 'Syllabus Micro-Slicing',
      icon: Map,
      description: 'Each GS topic is sliced into bite-sized concept sheets, ensuring no syllabus gaps remain while preventing material fatigue.'
    },
    {
      step: '03',
      title: 'Answer Structuring',
      subtitle: 'Daily Intensive Drills',
      icon: FileEdit,
      description: 'Aspirants practice writing answers daily. We focus on structural frameworks: introduction hooks, body bulleting, flow diagrams, and constructive policy conclusions.'
    },
    {
      step: '04',
      title: 'Mentorship Loops',
      subtitle: 'One-on-One Live Audits',
      icon: Users,
      description: 'Sudhagaran Sir and our specialized evaluation board provide comprehensive paper reviews within 24 hours, correcting arguments and adding value-addition matrices.'
    }
  ];

  return (
    <section id="process" className="py-24 bg-surface-slate border-b border-gray-100 relative">
      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-space text-xs font-bold uppercase tracking-widest text-[#D31218] block mb-2">
            The D'code Methodology
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0D2C54] tracking-tight">
            How We Simplify Your IAS Journey
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-3 leading-relaxed max-w-lg mx-auto">
            A meticulous, structured four-step feedback framework that transforms raw memory into clear, policy-driven exam articulation.
          </p>
          <div className="w-16 h-0.5 bg-[#D31218]/30 mx-auto mt-4" />
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 sm:p-7 border border-gray-200/80 shadow-xs relative flex flex-col justify-between group hover:border-[#0D2C54]/30 hover:shadow-md transition-all duration-300"
              >
                <div>
                  {/* Step counter & Icon header */}
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-space text-3xl font-extrabold text-gray-200 group-hover:text-[#D31218]/20 transition-colors">
                      {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#D31218]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#0D2C54] mb-1">
                    {s.title}
                  </h3>
                  <p className="font-space text-[10px] font-semibold text-[#D31218] uppercase tracking-wider mb-4">
                    {s.subtitle}
                  </p>
                  
                  <p className="font-sans text-xs text-gray-600 leading-relaxed mb-6">
                    {s.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center gap-1.5 text-[10px] font-space uppercase tracking-widest text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Quality Checked
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
