import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, ExternalLink } from 'lucide-react';

export default function FaqSection() {
  const faqs = [
    {
      id: 'faq1',
      q: 'What makes D\'code IAS Academy different from other institutes?',
      a: 'D\'code IAS Academy operates under the direct leadership of Sudhagaran Sir, Former Mission Director of Naan Mudhalvan. Instead of just delivering lectures, we focus heavily on simplifying the preparation. We use systematic syllabus-slicing mapping and offer a personal mentoring feedback loop where your answers are evaluated directly with action points within 24 hours.'
    },
    {
      id: 'faq2',
      q: 'What optional coaching subjects are available at D\'code?',
      a: 'We specialize in three high-yield optional subjects that consistently produce top marks: Public Administration, Sociology, and Anthropology. Each optional program is a structured 4-month module featuring concept notes, PYQ breakdown, and weekly test evaluations.'
    },
    {
      id: 'faq3',
      q: 'Do you offer state civil services coaching (TNPSC)?',
      a: 'Yes! We run comprehensive TNPSC coaching programs for Group 1, Group 2, and Group 4. These sessions feature high-quality bilingual study materials in Tamil and English, with mock exams closely mapped to the latest TNPSC annual planners and exam patterns.'
    },
    {
      id: 'faq4',
      q: 'Can absolute beginners join the PCM Comprehensive Batch?',
      a: 'Absolutely. The Prelims Cum Mains (PCM) program is customized specifically for beginners. We cover fundamental concepts from scratch, guide you through standard textbooks (NCERTs), and integrate CSAT, Essay, and Daily Test series into your schedule.'
    },
    {
      id: 'faq5',
      q: 'How does the Mains Momentum 2027 program work?',
      a: 'The Mains Momentum is an intensive 5-month answer development and mentoring bootcamp. It includes GS papers 1, 2, 3, Ethics, and Essay. Candidates undergo daily writing practices, discuss critical current issues, and learn specific answer structuring and pattern-decoding tricks under Sudhagaran Sir.'
    },
    {
      id: 'faq6',
      q: 'How can I connect with other aspirants and receive official updates?',
      a: 'You can join our active WhatsApp community. This is a private, supervised space where we share daily news breakdowns, model answers, and announcements. Click the link at the bottom of our page or in the footer to join.'
    }
  ];

  const [openId, setOpenId] = useState<string | null>('faq1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-space text-xs font-bold uppercase tracking-widest text-[#D31218] block mb-2">
            Clarifications
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0D2C54] tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-0.5 bg-[#D31218]/30 mx-auto mt-4" />
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-4">
          {faqs.map((f) => {
            const isOpen = openId === f.id;
            return (
              <div
                key={f.id}
                className="border border-gray-200/80 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(f.id)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left bg-surface-slate hover:bg-gray-50 transition-colors"
                >
                  <div className="flex gap-3 items-center">
                    <HelpCircle className="w-4.5 h-4.5 text-[#D31218] shrink-0" />
                    <span className="font-serif font-bold text-sm sm:text-base text-[#0D2C54]">
                      {f.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#0D2C54] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 pt-2 font-sans text-xs sm:text-sm text-gray-600 leading-relaxed bg-white border-t border-gray-100">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* WhatsApp Callout */}
        <div className="mt-12 p-6 bg-[#0D2C54]/5 rounded-xl border border-[#0D2C54]/10 text-center">
          <p className="font-sans text-xs text-gray-700">
            Have a different question or need direct academic scheduling counseling?
          </p>
          <a
            href="https://chat.whatsapp.com/JaLf2Lf9uMiB1ZKzhrCnGp"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-space text-xs font-bold uppercase tracking-wider text-[#D31218] hover:text-[#A30D12] mt-3 transition-colors"
          >
            Join WhatsApp Discussion Group
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
