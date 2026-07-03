import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, FileText, CheckCircle, Download, Book, ArrowRight, Sparkles, MessageSquare, Clipboard, ExternalLink } from 'lucide-react';

interface BookItem {
  subject: string;
  bookName: string;
  author: string;
  utility: string;
}

const CORE_BOOKLIST: BookItem[] = [
  { subject: "Indian Polity", bookName: "Indian Polity (7th Edition)", author: "M. Laxmikanth", utility: "Prelims & Mains GS-2 core text" },
  { subject: "Modern History", bookName: "A Brief History of Modern India", author: "Spectrum (Rajiv Ahir)", utility: "Prelims & GS-1 modern timeline" },
  { subject: "Indian Economy", bookName: "Indian Economy", author: "Ramesh Singh / Nitin Singhania", utility: "Mains economic policies & budget" },
  { subject: "Geography", bookName: "Certificate Physical & Human Geography", author: "G.C. Leong", utility: "Physical patterns & map markings" },
  { subject: "Art & Culture", bookName: "Indian Art and Culture", author: "Nitin Singhania", utility: "GS-1 cultural movements & monuments" },
  { subject: "Environment", bookName: "Environmental Studies", author: "Shankar IAS", utility: "High-yield topics for Prelims" }
];

export default function FreeContent() {
  const [activeTab, setActiveTab] = useState<'qa' | 'syllabus' | 'booklist'>('qa');
  const [answerText, setAnswerText] = useState('');
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const dailyQuestion = {
    date: "June 30, 2026",
    subject: "GS-2 Polity & Governance",
    question: "Analyze the role of the Governor under the Indian Constitution, particularly in relation to the discretionary powers and the friction points arising with state-elected cabinets. Highlight judicial precedents.",
    modelHint: "Structure your response into: 1. Constitutional position (Article 153/163), 2. Area of friction (Bills assent, floor tests), 3. Recommendations of Sarkaria & Punchhi Commissions, 4. Way forward."
  };

  const syllabusSections = [
    {
      stage: "Prelims Stage (GS-1)",
      subjects: ["History of India & Indian National Movement", "Indian and World Geography", "Indian Polity & Governance", "Economic & Social Development", "General issues on Environmental Ecology", "General Science"]
    },
    {
      stage: "Mains GS Papers",
      subjects: ["GS-1: Indian Heritage, Culture, History & Geography of World and Society", "GS-2: Governance, Constitution, Polity, Social Justice & International Relations", "GS-3: Technology, Economic Development, Bio-diversity, Environment, Security & Disaster Management", "GS-4: Ethics, Integrity & Aptitude"]
    }
  ];

  const handleAnswerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    setAnswerSubmitted(true);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadSyllabus = () => {
    const content = `D'code IAS Academy - Official UPSC Syllabus and Micro-Topic Breakdown\n\nStages: Prelims, Mains, Interview.\nUnder direct supervision of Sudhagaran Sir.\n\nHotline: +91 96000 60393\nAddress: Anna Nagar, Chennai.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Dcode_IAS_UPSC_Syllabus_Package.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="free-resources" className="py-20 bg-amber-50/20 border-b border-gray-100">
      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-space text-xs font-bold uppercase tracking-widest text-[#D31218] bg-red-100 px-3 py-1 rounded inline-block mb-3 shadow-xs">
            Aspirant Corner
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2C54] tracking-tight">
            Free High-Yield Resources
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
            Boost your daily preparation with high-value materials curated personally under Sudhagaran Sir's supervision.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center border-b border-gray-200 mb-10 max-w-xl mx-auto">
          <button
            onClick={() => setActiveTab('qa')}
            className={`flex-1 py-3 px-4 font-space text-[11px] font-bold uppercase tracking-wider text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'qa'
                ? 'border-[#D31218] text-[#D31218]'
                : 'border-transparent text-gray-400 hover:text-[#0D2C54]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Daily Q&A Practice</span>
          </button>
          
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`flex-1 py-3 px-4 font-space text-[11px] font-bold uppercase tracking-wider text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'syllabus'
                ? 'border-[#D31218] text-[#D31218]'
                : 'border-transparent text-gray-400 hover:text-[#0D2C54]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Syllabus breakdown</span>
          </button>
          
          <button
            onClick={() => setActiveTab('booklist')}
            className={`flex-1 py-3 px-4 font-space text-[11px] font-bold uppercase tracking-wider text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'booklist'
                ? 'border-[#D31218] text-[#D31218]'
                : 'border-transparent text-gray-400 hover:text-[#0D2C54]'
            }`}
          >
            <Book className="w-3.5 h-3.5" />
            <span>Standard Booklist</span>
          </button>
        </div>

        {/* Tab Panels */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 md:p-10 shadow-sm max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: DAILY ANSWER WRITING PRACTICE */}
            {activeTab === 'qa' && (
              <motion.div
                key="qa"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div>
                    <span className="font-space text-[9px] uppercase tracking-wider font-extrabold text-[#D31218] bg-red-50 px-2 py-0.5 rounded">
                      {dailyQuestion.subject}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono ml-3">{dailyQuestion.date}</span>
                  </div>
                  <span className="font-sans text-[10px] text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                    Live Review Queue
                  </span>
                </div>

                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                  <h4 className="font-space text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">UPSC Mains Model Question</h4>
                  <p className="font-serif text-base font-bold text-[#0D2C54] leading-relaxed">
                    "{dailyQuestion.question}"
                  </p>
                </div>

                <div className="bg-blue-50/30 rounded-xl p-4 border border-blue-100/50">
                  <h5 className="font-space text-[10px] font-bold text-blue-700 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Sudhagaran Sir's Answer Structuring Guideline
                  </h5>
                  <p className="font-sans text-[11px] text-[#0D2C54]/85 leading-relaxed">
                    {dailyQuestion.modelHint}
                  </p>
                </div>

                {!answerSubmitted ? (
                  <form onSubmit={handleAnswerSubmit} className="space-y-4">
                    <div>
                      <label className="block font-space text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Draft Your Structured Answer (Supports rough ideas or points)
                      </label>
                      <textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        rows={6}
                        maxLength={2000}
                        placeholder="Type your introduction or bullet points here..."
                        className="w-full text-xs font-sans p-4 rounded-xl border border-gray-200 bg-gray-50/30 focus:bg-white transition-colors leading-relaxed focus:outline-hidden resize-none"
                      />
                      <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono mt-1 px-1">
                        <span>Characters: {answerText.length}/2000</span>
                        <span>Mains Word limit reference: ~150-250 words</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!answerText.trim()}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D31218] hover:bg-[#A30D12] text-white py-3 px-6 rounded-xl font-space text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-red-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Clipboard className="w-4 h-4" />
                      <span>Submit Answer for Review</span>
                    </button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-emerald-50/50 border border-emerald-200 rounded-2xl text-center space-y-4"
                  >
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-space text-sm font-bold text-emerald-900 uppercase tracking-wide">Answer Successfully Logged!</h4>
                      <p className="font-sans text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                        Your practice answer is queued in our local evaluation board. D'code Academy mentors will analyze your structuring logic, and text an optimization report to your phone.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setAnswerSubmitted(false);
                        setAnswerText('');
                      }}
                      className="inline-flex items-center gap-1 text-[10px] font-space font-bold uppercase tracking-widest text-emerald-800 hover:text-emerald-900 bg-white border border-emerald-200 px-3 py-1.5 rounded-full shadow-xs cursor-pointer transition-colors"
                    >
                      Write Another Response
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* TAB 2: UPSC SYLLABUS BREAKDOWN */}
            {activeTab === 'syllabus' && (
              <motion.div
                key="syllabus"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#0D2C54]">Official UPSC Civil Services Curriculum</h4>
                    <p className="font-sans text-xs text-gray-500 mt-0.5">Structured micro-topics mapped carefully for systemic target reviews.</p>
                  </div>
                  <button
                    onClick={handleDownloadSyllabus}
                    className="inline-flex items-center gap-2 bg-[#0D2C54] hover:bg-[#D31218] text-white py-2 px-4 rounded-xl font-space text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Pack</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {syllabusSections.map((section, idx) => (
                    <div key={idx} className="border border-gray-200/80 rounded-2xl p-5 bg-slate-50/30">
                      <span className="font-space text-[10px] font-extrabold text-[#D31218] uppercase tracking-widest block mb-3">
                        {section.stage}
                      </span>
                      <ul className="space-y-2.5">
                        {section.subjects.map((sub, sidx) => (
                          <li key={sidx} className="flex items-start gap-2 text-xs font-medium text-[#0D2C54]/90">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0D2C54] mt-1.5 shrink-0" />
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-xl flex items-start gap-3">
                  <div className="p-1 bg-amber-100 rounded text-amber-800 mt-0.5 font-space text-xs font-bold">HOT</div>
                  <p className="font-sans text-xs text-[#0D2C54]/80 leading-relaxed">
                    <strong>Optional Syllabus Analysis:</strong> Our specialized programs deeply analyze <strong>Sociology</strong>, <strong>Public Administration</strong>, and <strong>Anthropology</strong> optionals. Ask Sudhagaran Sir's desk for customized syllabus trackers.
                  </p>
                </div>
              </motion.div>
            )}

            {/* TAB 3: CORE BOOKLIST */}
            {activeTab === 'booklist' && (
              <motion.div
                key="booklist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#0D2C54]">Core Reference Booklist & Materials</h4>
                  <p className="font-sans text-xs text-gray-500 mt-0.5">The ultimate checklist of standard reference texts recommended by toppers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CORE_BOOKLIST.map((book, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 border border-gray-200/60 hover:border-[#D31218]/20 bg-white hover:bg-slate-50/30 rounded-xl transition-all flex justify-between items-start group"
                    >
                      <div className="space-y-1 pr-4">
                        <span className="font-space text-[9px] uppercase tracking-wider font-extrabold text-[#0D2C54]/60">
                          {book.subject}
                        </span>
                        <h5 className="font-serif text-sm font-bold text-[#0D2C54] group-hover:text-[#D31218] transition-colors">
                          {book.bookName}
                        </h5>
                        <p className="font-sans text-[10px] text-gray-400">Author: {book.author}</p>
                        <p className="font-sans text-[11px] text-gray-500 italic mt-1">{book.utility}</p>
                      </div>

                      <button
                        onClick={() => copyToClipboard(`${book.bookName} by ${book.author}`, idx)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-[#0D2C54] transition-colors cursor-pointer shrink-0"
                        title="Copy to clipboard"
                      >
                        <span className="font-space text-[9px] uppercase font-bold text-emerald-600 block transition-all">
                          {copiedIndex === idx ? 'Copied' : 'Copy'}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
