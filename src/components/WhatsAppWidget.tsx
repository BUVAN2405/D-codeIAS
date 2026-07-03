import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, UserCheck, Phone, Users2, Shield, ArrowUpRight } from 'lucide-react';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([
    { sender: 'agent', text: 'Welcome to D\'code IAS Academy Chennai! I am your prep counselor. What would you like to ask about our UPSC or TNPSC batches today?' }
  ]);

  const faqs = [
    {
      q: '📅 Course Commencement',
      a: 'Mains Momentum 2027 starts on 15th Oct 2026. PCM Comprehensive foundation batch starts 1st Nov 2026. Classroom sessions take place in Anna Nagar, Chennai.'
    },
    {
      q: '📚 Study materials?',
      a: 'Absolutely! D\'code IAS provides exhaustive bilingual reference books, mind maps, and daily high-yield answer evaluation worksheets.'
    },
    {
      q: '🙋 Mentorship setup',
      a: 'Under Sudhagaran Sir (Former Mission Director of Naan Mudhalvan), candidates receive one-on-one answer sheet auditing and direct roadmap trackers.'
    },
    {
      q: '🚇 Center Location',
      a: 'Our premium study center is at: 825, 1st St, G Block, Ranganathan Garden, Anna Nagar, Chennai – 600040. Walkable from Anna Nagar Tower Metro.'
    }
  ];

  const handleFaqClick = (question: string, answer: string) => {
    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: question },
      { sender: 'agent', text: answer }
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans flex flex-col items-end gap-2.5">

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white border border-gray-100 rounded-xl shadow-2xl w-80 sm:w-96 overflow-hidden mr-0"
          >
            {/* Widget Header */}
            <div className="bg-[#0D2C54] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#D31218] flex items-center justify-center font-serif font-bold text-sm">
                    Dc
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0D2C54] animate-pulse" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold">D'code Academy Advisor</h4>
                  <p className="font-space text-[10px] text-gray-300 uppercase tracking-wider">Anna Nagar • Chennai</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                aria-label="Close counseling assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat History Output Area */}
            <div className="p-4 h-56 overflow-y-auto bg-gray-50 space-y-3 flex flex-col">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                    msg.sender === 'agent'
                      ? 'bg-white border border-gray-100 text-gray-800 self-start shadow-xs'
                      : 'bg-[#D31218] text-white self-end shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* WhatsApp Community Direct Action Banner inside Widget */}
            <div className="bg-[#E8F5E9] border-t border-b border-emerald-100 p-3 flex items-center justify-between gap-2.5 text-xs">
              <div className="text-emerald-950">
                <p className="font-bold text-[11px] uppercase tracking-wider font-space text-emerald-800">D'code WhatsApp Hub</p>
                <p className="text-[10px] leading-tight text-emerald-800/80 mt-0.5">Join 500+ civil services aspirants for daily study materials.</p>
              </div>
              <a 
                href="https://chat.whatsapp.com/JaLf2Lf9uMiB1ZKzhrCnGp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-space font-bold uppercase py-1.5 px-3 rounded cursor-pointer border-none shadow-xs"
              >
                Join Chat <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

            {/* FAQ Quick Prompts list */}
            <div className="p-3 bg-white">
              <p className="font-space text-[8px] uppercase text-gray-400 tracking-wider mb-2 font-bold text-center">
                Select topic for instant counselor response:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {faqs.map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFaqClick(faq.q, faq.a)}
                    className="text-[10px] text-left border border-gray-100 hover:border-[#D31218] hover:bg-red-50/20 py-1.5 px-2 rounded transition-all text-gray-700 font-medium"
                  >
                    {faq.q}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Notice */}
            <div className="bg-gray-50 text-[9px] text-gray-500 p-2 border-t border-gray-100 flex items-center justify-center gap-1.5">
              <Shield className="w-3 h-3 text-[#D31218]" />
              <span>Personalized counseling synced under Sudhagaran Sir</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circle Toggle Trigger for help guide */}
      <motion.button
        id="whatsapp-widget-trigger-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 bg-[#D31218] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#A30D12] transition-colors cursor-pointer z-50 active:scale-95 border-none"
        aria-label="Open support panel"
      >
        {isOpen ? (
          <X className="w-5 h-5 stroke-[2]" />
        ) : (
          <MessageCircle className="w-5 h-5 fill-white stroke-none animate-bounce-slow" />
        )}
      </motion.button>
    </div>
  );
}
