import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqData: FaqItem[] = [
    {
      question: "Who leads the mentoring program at D'code IAS Academy?",
      answer: "All preparation programs are designed and structured under the direct guidance of Sudhagaran Sir, Former Mission Director of Naan Mudhalvan. He conducts regular milestone feedback sessions, answers evaluation audits, and guides students with customizable roadmap schedules."
    },
    {
      question: "What is the 'Mains Momentum 2027' program?",
      answer: "Mains Momentum 2027 is a specialized 5-month intensive mains answer development and mentoring course. It covers General Studies Papers I, II, and III, as well as focused modules on Ethics and Essay writing. Features include personal mentoring, daily writing practice, and full mock test series."
    },
    {
      question: "Which Optional Subjects are offered at D'code?",
      answer: "We offer comprehensive optional coaching in three of the most high-scoring subjects: Public Administration, Sociology, and Anthropology. Each optional course spans 4 months and includes comprehensive structured notes, PYQ analysis, and direct answer evaluation loops."
    },
    {
      question: "Does the Academy provide TNPSC coaching?",
      answer: "Yes, D'code offers specialized coaching for TNPSC Group 1, Group 2, and Group 4 exams. This is a bilingual prep program (Tamil & English) with high-quality study materials, regular mock exams matching state-level trends, and dedicated support for Unit 8 and Unit 9."
    },
    {
      question: "Where is D'code IAS Academy located?",
      answer: "Our premium preparation center is located at: 825, 1st St, G Block, Ranganathan Garden, Anna Nagar, Chennai – 600040 (Phone contacts: 96000 60393, 96000 60349)."
    },
    {
      question: "How does the personal mentorship feedback loop work?",
      answer: "Every student is assigned a dedicated expert mentor. Students write answers daily, which are evaluated by mentors with granular remarks on structural logic, content enrichment, and presentation. Critical milestones are personally audited by Sudhagaran Sir."
    }
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white border-b border-[#D31218]/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="font-space text-xs font-bold uppercase tracking-widest text-[#D31218] block mb-2">
            CURRICULUM RESOLUTIONS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0D2C54] tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-0.5 bg-[#D31218] mx-auto mt-4" />
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqData.map((item, idx) => {
            const isOpen = activeIndex === idx;

            return (
              <div 
                key={idx}
                className={`border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 ${
                  isOpen ? 'bg-[#F8FAFC] shadow-sm border-[#D31218]/10' : 'bg-white hover:bg-gray-50/50'
                }`}
              >
                {/* Trigger Button */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors duration-200 focus:outline-none cursor-pointer"
                >
                  <div className="flex items-start gap-3.5 pr-4">
                    <HelpCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${
                      isOpen ? 'text-[#D31218]' : 'text-gray-400'
                    }`} />
                    <span className="font-serif text-sm sm:text-base font-bold text-[#0D2C54]">
                      {item.question}
                    </span>
                  </div>
                  <div className="flex-shrink-0 text-[#0D2C54]">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#D31218]" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Answer Accordion Dropdown */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 pl-12 border-t border-gray-100/40 pt-3">
                        <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
