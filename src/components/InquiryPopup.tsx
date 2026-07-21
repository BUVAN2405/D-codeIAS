import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, Phone, User, Mail, ShieldCheck } from 'lucide-react';
import { Course } from '../types';
import { submitInquiryApi } from '../services/api';

interface InquiryPopupProps {
  courses: Course[];
  onSubmitSuccess: () => void;
}

export default function InquiryPopup({ courses, onSubmitSuccess }: InquiryPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: 'mains_momentum_2027',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the popup or submitted
    const isDismissed = localStorage.getItem('dcode_popup_dismissed_v2');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500); // 2.5 seconds delay

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('dcode_popup_dismissed_v2', 'true');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    
    try {
      await submitInquiryApi({
        fullName: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        course: formData.course,
        formType: 'registration',
        message: formData.message || 'Auto Enquiry Popup Registration'
      });

      setLoading(false);
      setSuccess(true);
      onSubmitSuccess();

      setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem('dcode_popup_dismissed_v2', 'true');
      }, 3000);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('Failed to submit registration. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white hover:bg-red-50 text-[#0D2C54] hover:text-[#D31218] transition-all cursor-pointer border border-white/20 font-space text-[10px] font-bold uppercase tracking-wider shadow-md"
              aria-label="Dismiss inquiry"
            >
              <span>Exit</span>
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Split top banner */}
            <div className="bg-[#0D2C54] text-white p-6 sm:p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D31218]/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-[#D31218] animate-pulse" />
                <span className="font-space text-[9px] uppercase tracking-widest text-[#ffb6b6] font-bold">
                  Exclusive Guidance Pass
                </span>
              </div>
              
              <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                Simplify Your IAS Journey
              </h3>
              <p className="font-sans text-xs text-gray-300 mt-1 leading-relaxed">
                Book a 1-on-1 counseling slot with Sudhagaran Sir (Former Mission Director, Naan Mudhalvan) to get your personalized preparation roadmap.
              </p>
            </div>

            {/* Form body */}
            <div className="p-6 sm:p-8">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-3"
                >
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-100">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#0D2C54]">
                    Roadmap Slot Reserved!
                  </h4>
                  <p className="font-sans text-xs text-gray-500 max-w-xs mx-auto">
                    We have dispatched your inquiry details. An academic advisor will reach out to you within 15 minutes.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name field */}
                  <div>
                    <label className="block text-[10px] font-space font-semibold uppercase tracking-wider text-[#0D2C54] mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Anand Kumar"
                        className="w-full text-xs py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D2C54] focus:border-[#0D2C54]"
                      />
                    </div>
                  </div>

                  {/* Phone & Email (Optional) Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-space font-semibold uppercase tracking-wider text-[#0D2C54] mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="10-digit number"
                          className="w-full text-xs py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D2C54] focus:border-[#0D2C54]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-space font-semibold uppercase tracking-wider text-[#0D2C54] mb-1">
                        Email Address <span className="text-gray-400 lowercase italic">(optional)</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="w-full text-xs py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D2C54] focus:border-[#0D2C54]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Course select */}
                  <div>
                    <label className="block text-[10px] font-space font-semibold uppercase tracking-wider text-[#0D2C54] mb-1">
                      Select Interested Program
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full text-xs py-3 px-3.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0D2C54] focus:border-[#0D2C54]"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message (optional) */}
                  <div>
                    <label className="block text-[10px] font-space font-semibold uppercase tracking-wider text-[#0D2C54] mb-1">
                      Brief Query / Schedule Preference <span className="text-gray-400 italic font-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Schedule for a demo session, hostel questions..."
                      className="w-full text-xs py-3 px-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D2C54] focus:border-[#0D2C54]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#D31218] hover:bg-[#A30D12] text-white font-space text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-red-600/10 border-none"
                    >
                      {loading ? (
                        <span className="inline-block w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Request Counseling
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-gray-400 mt-2">
                    🔒 We respect your privacy. No spam. You will only receive official communications.
                  </p>

                </form>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
