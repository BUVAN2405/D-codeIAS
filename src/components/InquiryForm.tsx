import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, HelpCircle, X } from 'lucide-react';
import { Course } from '../types';
import { submitInquiryApi } from '../services/api';

interface InquiryFormProps {
  courses: Course[];
  onSubmitSuccess: () => void;
}

export default function InquiryForm({ courses, onSubmitSuccess }: InquiryFormProps) {
  const [isFormHidden, setIsFormHidden] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    course: 'mains_momentum_2027',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Please fill out Name and Phone Number.');
      return;
    }

    setLoading(true);
    
    try {
      await submitInquiryApi({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || undefined,
        course: formData.course,
        formType: 'contact',
        message: formData.message || undefined
      });

      setLoading(false);
      setSuccess(true);
      onSubmitSuccess();
      
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          course: 'mains_momentum_2027',
          message: ''
        });
      }, 4000);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8">
        
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Panel: Contact Form Card */}
          <div className="lg:col-span-7 bg-[#F8FAFC] p-6 sm:p-10 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
            
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#D31218]" />

            {isFormHidden ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-12 h-12 bg-[#D31218]/5 rounded-full flex items-center justify-center mx-auto text-[#D31218]">
                  <HelpCircle className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#0D2C54]">
                  Inquiry Section Minimized
                </h3>
                <p className="font-sans text-xs text-gray-500 max-w-sm mx-auto">
                  If you have questions about materials, hostel options, or trial classes, click below to open the query desk.
                </p>
                <button
                  type="button"
                  onClick={() => setIsFormHidden(false)}
                  className="px-5 py-2.5 bg-[#D31218] hover:bg-[#A30D12] text-white font-space text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer border-none shadow-sm"
                >
                  Open Inquiry Form
                </button>
              </div>
            ) : (
              <>
                {/* Exit Form Close Button */}
                <button
                  type="button"
                  onClick={() => setIsFormHidden(true)}
                  className="absolute top-4 right-4 flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-red-50 hover:bg-red-100 text-[#D31218] hover:text-[#A30D12] transition-colors border border-red-200/50 cursor-pointer z-10 font-space text-[10px] font-bold uppercase tracking-wider shadow-xs"
                  title="Close and minimize form"
                >
                  <span>Exit</span>
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                <div className="mb-8 pr-12">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D2C54] tracking-tight">
                    Submit Admission Query
                  </h2>
                  <p className="font-sans text-xs text-gray-500 mt-2 leading-relaxed">
                    Connect directly with Sudhagaran Sir's counselor desk. Reach out today for free career mapping, trial class schedules, or syllabus guidance.
                  </p>
                </div>

                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 text-center bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4">
                      <ShieldCheck className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="font-serif text-lg font-bold mb-1">
                      Inquiry Captured & Saved!
                    </h3>
                    <p className="font-sans text-xs text-emerald-800/80 max-w-sm mx-auto">
                      Your inquiry has been stored in our local database, and notification emails have been dispatched. A senior coordinator will call you in <strong className="font-semibold text-emerald-900">15 minutes</strong>.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Full name */}
                    <div>
                      <label className="block text-xs font-space font-semibold text-[#0D2C54] mb-1.5 uppercase tracking-wider">
                        Full Name <span className="text-[#D31218]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full text-xs py-3 px-3.5 border border-gray-200 rounded-md focus:outline-none focus:border-[#0D2C54] bg-white text-gray-800 font-sans"
                      />
                    </div>

                    {/* Grid for Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-space font-semibold text-[#0D2C54] mb-1.5 uppercase tracking-wider">
                          Phone Number <span className="text-[#D31218]">*</span>
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 bg-gray-50 rounded-l-md text-xs font-space text-gray-500 font-bold">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Enter 10-digit number"
                            className="w-full text-xs py-3 px-3.5 border border-gray-200 rounded-r-md focus:outline-none focus:border-[#0D2C54] bg-white text-gray-800 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-space font-semibold text-[#0D2C54] mb-1.5 uppercase tracking-wider flex items-center justify-between">
                          <span>Email Address</span>
                          <span className="text-gray-400 lowercase text-[10px] italic">optional</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="w-full text-xs py-3 px-3.5 border border-gray-200 rounded-md focus:outline-none focus:border-[#0D2C54] bg-white text-gray-800"
                        />
                      </div>
                    </div>

                    {/* Selected target course Selection */}
                    <div>
                      <label className="block text-xs font-space font-semibold text-[#0D2C54] mb-1.5 uppercase tracking-wider">
                        Interested Course / Program
                      </label>
                      <select
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full text-xs py-3 px-3.5 border border-gray-200 rounded-md focus:outline-none focus:border-[#0D2C54] bg-white text-gray-800 font-sans"
                      >
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title} Program
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Additional optional message */}
                    <div>
                      <label className="block text-xs font-space font-semibold text-[#0D2C54] mb-1.5 uppercase tracking-wider">
                        Additional Query or Notes
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Ask about materials, hostel partners, optional subjects, or fees..."
                        className="w-full text-xs py-3 px-3.5 border border-gray-200 rounded-md focus:outline-none focus:border-[#0D2C54] bg-white text-gray-800"
                      />
                    </div>

                    {/* Submit button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#D31218] hover:bg-[#A30D12] text-white font-space text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 shadow-sm border-none"
                      >
                        {loading ? (
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Submit Inquiry Request
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                )}
              </>
            )}
          </div>

          {/* Right Panel: Address & Communications directories */}
          <div className="lg:col-span-5 space-y-8 lg:pl-6">
            
            {/* Academy Address */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded bg-[#D31218]/5 flex items-center justify-center text-[#D31218] flex-shrink-0 mt-1">
                <MapPin className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="text-xs">
                <p className="font-space font-bold uppercase tracking-wider text-[#0D2C54] mb-1.5">Academy Address</p>
                <p className="font-sans text-gray-700 leading-relaxed font-semibold">
                  825, 1st St, G Block, Ranganathan Garden,<br />
                  Anna Nagar, Chennai – 600040
                </p>
              </div>
            </div>

            {/* Direct Phone Numbers */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded bg-[#D31218]/5 flex items-center justify-center text-[#D31218] flex-shrink-0 mt-1">
                <Phone className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="text-xs">
                <p className="font-space font-bold uppercase tracking-wider text-[#0D2C54] mb-1.5">Direct Contacts</p>
                <p className="font-sans text-gray-900 leading-relaxed text-sm font-bold">
                  +91 96000 60393 / 96000 60349
                </p>
                <p className="font-space text-[10px] text-[#D31218] mt-0.5 uppercase tracking-widest font-bold">
                  Counseling helpline: 24/7 active
                </p>
              </div>
            </div>

            {/* Support Emails */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded bg-[#D31218]/5 flex items-center justify-center text-[#D31218] flex-shrink-0 mt-1">
                <Mail className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="text-xs">
                <p className="font-space font-bold uppercase tracking-wider text-[#0D2C54] mb-1.5">Email Address</p>
                <p className="font-sans text-gray-900 leading-relaxed text-sm font-bold">
                  info@dcodeias.com
                </p>
              </div>
            </div>

            {/* Operating schedules */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded bg-[#D31218]/5 flex items-center justify-center text-[#D31218] flex-shrink-0 mt-1">
                <Clock className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="text-xs">
                <p className="font-space font-bold uppercase tracking-wider text-[#0D2C54] mb-1.5">Operating Hours</p>
                <div className="font-sans text-gray-600 space-y-1 font-semibold leading-relaxed">
                  <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
                  <p>Sunday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
