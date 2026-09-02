import React from 'react';
import { X, ShieldCheck, FileText, RefreshCcw } from 'lucide-react';

export type PolicyType = 'privacy' | 'terms' | 'refund' | null;

interface LegalPolicyModalProps {
  policyType: PolicyType;
  onClose: () => void;
}

export default function LegalPolicyModal({ policyType, onClose }: LegalPolicyModalProps) {
  if (!policyType) return null;

  const contentMap = {
    privacy: {
      title: "Privacy Policy",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      text: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            At <strong>D'code IAS Academy</strong> (Anna Nagar, Chennai), accessible from <code>decodeias.com</code>, one of our main priorities is the privacy of our prospective students and civil services aspirants.
          </p>
          <h4 className="font-bold text-slate-900 text-base">1. Information We Collect</h4>
          <p>
            When you register for trial passes, request syllabus brochures, or submit an inquiry, we collect personal details including your Full Name, Mobile Phone Number, Email Address, and Target UPSC/TNPSC Program.
          </p>
          <h4 className="font-bold text-slate-900 text-base">2. How We Use Your Information</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Dispatching official UPSC Mains/Prelims syllabus packages.</li>
            <li>Scheduling personalized academic advisory calls with Sudhagaran Sir and faculty members.</li>
            <li>Sending critical batch updates and classroom pass confirmations.</li>
          </ul>
          <h4 className="font-bold text-slate-900 text-base">3. Data Protection & Confidentiality</h4>
          <p>
            We strictly protect your personal information. Your contact details are never rented, sold, or shared with third-party telemarketers.
          </p>
        </div>
      )
    },
    terms: {
      title: "Terms & Conditions",
      icon: <FileText className="w-6 h-6 text-brand-navy" />,
      text: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            Welcome to <strong>D'code IAS Academy</strong>. By accessing our portal or reserving classroom seats, you agree to adhere to the following academic terms.
          </p>
          <h4 className="font-bold text-slate-900 text-base">1. Enrollment & Batch Seat Reservation</h4>
          <p>
            Classroom seats for Prelims-cum-Mains and Optional Coaching batches are filled on a strict merit and first-come-first-served basis.
          </p>
          <h4 className="font-bold text-slate-900 text-base">2. Study Material & Intellectual Property</h4>
          <p>
            All test series papers, mentorship modules, and copyrighted classroom notes provided by D'code IAS Academy are solely for the personal preparation of enrolled students. Unauthorized duplication is strictly prohibited.
          </p>
        </div>
      )
    },
    refund: {
      title: "Refund & Cancellation Policy",
      icon: <RefreshCcw className="w-6 h-6 text-amber-600" />,
      text: (
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            Thank you for enrolling with <strong>D'code IAS Academy</strong>. We maintain total transparency regarding course fee structures.
          </p>
          <h4 className="font-bold text-slate-900 text-base">1. Trial Passes & Demo Classes</h4>
          <p>
            We offer 3-day complimentary classroom pass access for aspirants to evaluate our teaching methodology, faculty interaction, and study material before committing to full course fee payment.
          </p>
          <h4 className="font-bold text-slate-900 text-base">2. Fee Refund Guidelines</h4>
          <p>
            Registration fees submitted for seat reservation are non-refundable. For course fee adjustments or installment scheduling assistance, students may approach the Anna Nagar center administration.
          </p>
        </div>
      )
    }
  };

  const current = contentMap[policyType];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            {current.icon}
            <h3 className="font-serif font-bold text-lg text-slate-900">{current.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {current.text}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="bg-brand-navy text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
}
