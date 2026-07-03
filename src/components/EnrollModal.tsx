import { motion, AnimatePresence } from 'motion/react';
import { X, Check, MapPin, Calendar, BookOpen, Clock } from 'lucide-react';
import { Course, BatchSchedule } from '../types';
import { useState, FormEvent, useEffect } from 'react';
import { saveEnquiryToDb } from '../services/db';
import { dispatchEnquiryEmails } from '../services/email';

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse?: Course | null;
  selectedBatch?: BatchSchedule | null;
  coursesList: Course[];
}

export default function EnrollModal({
  isOpen,
  onClose,
  selectedCourse,
  selectedBatch,
  coursesList
}: EnrollModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    selectedId: 'mains_momentum_2027',
    scheduleType: 'offline-hybrid',
    hasPriorAttempt: 'no',
    preferredTime: 'morning'
  });

  const [submitted, setSubmitted] = useState(false);

  // Sync selected options if provided
  useEffect(() => {
    if (selectedCourse) {
      setFormData(prev => ({ ...prev, selectedId: selectedCourse.id }));
    } else if (selectedBatch) {
      const matchedCourse = coursesList.find(c => c.title.toLowerCase().includes(selectedBatch.name.toLowerCase()) || selectedBatch.name.toLowerCase().includes(c.title.toLowerCase()));
      setFormData(prev => ({ ...prev, selectedId: matchedCourse?.id || 'mains_momentum_2027' }));
    }
  }, [selectedCourse, selectedBatch, coursesList]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please fill out Name and Phone Number.');
      return;
    }

    // 1. Save entry to local database
    saveEnquiryToDb({
      fullName: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      course: formData.selectedId,
      message: `Preferred Slot: ${formData.preferredTime}. Commute Mode: ${formData.scheduleType}. Prior attempt: ${formData.hasPriorAttempt}`
    });

    // 2. Dispatch simulated Resend emails
    dispatchEnquiryEmails({
      fullName: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      course: formData.selectedId,
      message: `Preferred Slot: ${formData.preferredTime}. Commute Mode: ${formData.scheduleType}. Prior attempt: ${formData.hasPriorAttempt}`
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        selectedId: 'mains_momentum_2027',
        scheduleType: 'offline-hybrid',
        hasPriorAttempt: 'no',
        preferredTime: 'morning'
      });
      onClose();
    }, 2800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="enroll-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-3xl bg-[#F8FAFC] text-gray-800 rounded-xl border border-gray-100 shadow-xl overflow-hidden z-10 my-auto max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] md:max-h-none flex flex-col"
          >
            {/* Header indicator bar */}
            <div className="h-1.5 bg-[#D31218] shrink-0" />

            <button
              id="close-modal-btn"
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full bg-red-50 hover:bg-red-100 text-[#D31218] hover:text-[#A30D12] transition-colors border border-red-200/50 cursor-pointer z-20 font-space text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-xs"
              aria-label="Close dialog"
            >
              <span>Exit</span>
              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            </button>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 sm:p-12 text-center flex flex-col items-center justify-center min-h-[350px] md:min-h-[450px]"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 sm:mb-6 relative">
                  <motion.div
                    className="absolute inset-0 rounded-full border border-emerald-400"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D2C54] mb-2 sm:mb-3">
                  Seat Provisionally Reserved!
                </h3>
                <p className="max-w-md text-gray-600 font-sans mb-4 text-xs sm:text-sm px-2">
                  Thank you, <strong className="text-[#D31218] font-semibold">{formData.name}</strong>. Your application has been saved to the database. A senior advisor will call you within <strong className="font-semibold text-[#0D2C54]">15 minutes</strong> for onboarding.
                </p>
                <div className="border border-[#D31218]/10 bg-[#D31218]/5 py-2 px-4 rounded font-space text-[11px] sm:text-xs text-[#D31218] mb-2 font-bold">
                  Reference ID: DC-2026-{Math.floor(100000 + Math.random() * 900000)}
                </div>
                <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-space font-bold">
                  D'code IAS Academy • Chennai Anna Nagar
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto md:overflow-visible flex-1">
                {/* Left Side: Course Specific Details */}
                <div className="md:col-span-5 bg-[#0D2C54] text-white p-5 sm:p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <span className="font-space text-[9px] sm:text-[10px] uppercase tracking-wider bg-white/10 text-white px-2 py-0.5 rounded font-bold">
                      D'code IAS Academy
                    </span>
                    
                    {selectedCourse ? (
                      <div className="mt-4 sm:mt-6">
                        <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold mb-1.5">
                          {selectedCourse.title}
                        </h3>
                        {selectedCourse.badge && (
                          <p className="text-[#D31218] font-space text-[10px] sm:text-[11px] uppercase tracking-wide mb-2.5 font-extrabold">
                            {selectedCourse.badge}
                          </p>
                        )}
                        <p className="text-[11px] sm:text-xs text-gray-300 font-sans leading-relaxed mb-4 md:mb-6">
                          {selectedCourse.tagline}
                        </p>

                        <div className="space-y-3 pt-3 md:pt-4 border-t border-white/10">
                          <div className="flex items-center gap-3">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <div className="text-[11px] sm:text-xs">
                              <p className="font-space text-gray-400 uppercase tracking-widest text-[8px] sm:text-[9px]">DURATION</p>
                              <p className="font-sans font-medium">{selectedCourse.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                            <div className="text-[11px] sm:text-xs">
                              <p className="font-space text-gray-400 uppercase tracking-widest text-[8px] sm:text-[9px]">STRUCTURE</p>
                              <p className="font-sans font-medium">Under Sudhagaran Sir</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : selectedBatch ? (
                      <div className="mt-4 sm:mt-6">
                        <span className="font-space text-[9px] sm:text-xs bg-[#D31218] text-white px-2 py-0.5 rounded-full font-bold">
                          Selected Cycle
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold mb-1.5 mt-2 text-white">
                          {selectedBatch.name}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-300 font-sans leading-relaxed mb-4 md:mb-6">
                          Reserve your seat under our upcoming preparation schedule at Chennai Anna Nagar.
                        </p>

                        <div className="space-y-3 pt-3 md:pt-4 border-t border-white/10">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <div className="text-[11px] sm:text-xs">
                              <p className="font-space text-gray-400 uppercase tracking-widest text-[8px] sm:text-[9px]">COMMENCING</p>
                              <p className="font-sans font-medium">{selectedBatch.startDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <div className="text-[11px] sm:text-xs">
                              <p className="font-space text-gray-400 uppercase tracking-widest text-[8px] sm:text-[9px]">VENUE</p>
                              <p className="font-sans font-medium">Anna Nagar, Chennai</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 sm:mt-6">
                        <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold mb-1.5">
                          Simplified preparation
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-300 font-sans leading-relaxed mb-4 md:mb-6">
                          Empowering aspirants with structured roadmaps, systematic evaluation loops, and focused counseling under Sudhagaran Sir.
                        </p>

                        <div className="space-y-3 pt-3 md:pt-4 border-t border-white/10 text-[11px] sm:text-xs">
                          <p className="font-space text-gray-400 uppercase tracking-widest font-bold text-[8px] sm:text-[9px]">D'CODE METRICS:</p>
                          <ul className="space-y-1.5 font-sans text-gray-300">
                            <li className="flex items-start gap-1"><span className="text-[#D31218]">✓</span> Former Mission Director leadership</li>
                            <li className="flex items-start gap-1"><span className="text-[#D31218]">✓</span> Personal Mentorship Tracking</li>
                            <li className="flex items-start gap-1"><span className="text-[#D31218]">✓</span> High-Yield Syllabus Mapping</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 md:mt-8 pt-3 md:pt-4 border-t border-white/10 text-center md:text-left">
                    <p className="font-space text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-widest">ADMISSION COUNSELING HOTLINES</p>
                    <p className="font-sans font-bold text-xs sm:text-sm text-white">+91 96000 60393 / 96000 60349</p>
                  </div>
                </div>

                {/* Right Side: Interactive Admission Request Form */}
                <div className="md:col-span-7 p-5 sm:p-6 md:p-8">
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-[#0D2C54] mb-1">
                    Academic Registration
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-sans mb-4 sm:mb-6">
                    Enroll securely in just seconds. Confirm details to guarantee current batch pricing and materials kit.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-space font-semibold text-[#0D2C54] mb-1">
                        FULL NAME <span className="text-[#D31218]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Bhuvanesh Kumar"
                        className="w-full text-[11px] sm:text-xs py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#0D2C54] bg-white text-gray-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-[10px] sm:text-xs font-space font-semibold text-[#0D2C54] mb-1">
                          PHONE NUMBER <span className="text-[#D31218]">*</span>
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-2 border border-r-0 border-gray-200 bg-gray-50 rounded-l-md text-[11px] sm:text-xs font-space text-gray-500 font-bold">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="9600060393"
                            className="w-full text-[11px] sm:text-xs py-2 px-3 border border-gray-200 rounded-r-md focus:outline-none focus:border-[#0D2C54] bg-white text-gray-800 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] sm:text-xs font-space font-semibold text-[#0D2C54] mb-1 flex items-center justify-between">
                          <span>EMAIL ADDRESS</span>
                          <span className="text-gray-400 lowercase text-[8px] sm:text-[9px] italic font-normal">optional</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full text-[11px] sm:text-xs py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#0D2C54] bg-white text-gray-800"
                        />
                      </div>
                    </div>

                    {!selectedCourse && !selectedBatch && (
                      <div>
                        <label className="block text-[10px] sm:text-xs font-space font-semibold text-[#0D2C54] mb-1">
                          SELECT TARGET ACADEMIC PROGRAM
                        </label>
                        <select
                          value={formData.selectedId}
                          onChange={(e) => setFormData({ ...formData, selectedId: e.target.value })}
                          className="w-full text-[11px] sm:text-xs py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#0D2C54] bg-white text-gray-800"
                        >
                          {coursesList.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] sm:text-xs font-space font-semibold text-[#0D2C54] mb-1">
                        PREFERRED STUDY MODE & COMMUTE
                      </label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, scheduleType: 'offline-hybrid' })}
                          className={`border rounded-md p-1.5 sm:p-2 flex items-center justify-between cursor-pointer text-[10px] sm:text-xs ${formData.scheduleType === 'offline-hybrid' ? 'border-[#0D2C54] bg-[#0D2C54]/5 text-[#0D2C54] font-semibold' : 'border-gray-200 text-gray-600'}`}
                        >
                          <span>Offline (Anna Nagar)</span>
                          {formData.scheduleType === 'offline-hybrid' && <span className="w-1.5 h-1.5 rounded-full bg-[#0D2C54]" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, scheduleType: 'online-live' })}
                          className={`border rounded-md p-1.5 sm:p-2 flex items-center justify-between cursor-pointer text-[10px] sm:text-xs ${formData.scheduleType === 'online-live' ? 'border-[#0D2C54] bg-[#0D2C54]/5 text-[#0D2C54] font-semibold' : 'border-gray-200 text-gray-600'}`}
                        >
                          <span>Online Live Stream</span>
                          {formData.scheduleType === 'online-live' && <span className="w-1.5 h-1.5 rounded-full bg-[#0D2C54]" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-[10px] sm:text-xs font-space font-semibold text-[#0D2C54] mb-1">
                          PRIOR UPSC/TNPSC ATTEMPT?
                        </label>
                        <select
                          value={formData.hasPriorAttempt}
                          onChange={(e) => setFormData({ ...formData, hasPriorAttempt: e.target.value })}
                          className="w-full text-[11px] sm:text-xs py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#0D2C54] bg-white text-gray-800"
                        >
                          <option value="no">No, First Attempt</option>
                          <option value="yes-prelims">Yes, written Prelims</option>
                          <option value="yes-mains">Yes, written Mains</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] sm:text-xs font-space font-semibold text-[#0D2C54] mb-1">
                          COUNSELING SLOT
                        </label>
                        <select
                          value={formData.preferredTime}
                          onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                          className="w-full text-[11px] sm:text-xs py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-[#0D2C54] bg-white text-gray-800"
                        >
                          <option value="morning">Morning (9 AM - 12 PM)</option>
                          <option value="afternoon">Afternoon (1 PM - 4 PM)</option>
                          <option value="evening">Evening (5 PM - 8 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-[#D31218] text-white font-space text-[11px] sm:text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-md hover:bg-[#A30D12] transition-all active:scale-[0.99] cursor-pointer shadow-sm border-none"
                      >
                        Secure Provisionally Reserved Seat
                      </button>
                    </div>

                    <div className="text-[8px] sm:text-[9px] text-gray-400 text-center select-none pt-1">
                      🔒 Your details are saved securely in our local admissions database and mapped strictly to Sudhagaran Sir's counseling desk.
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
