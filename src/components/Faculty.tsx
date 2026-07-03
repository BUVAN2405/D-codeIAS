import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FacultyMember } from '../types';
import { X, GraduationCap, Briefcase, Award, ArrowRight } from 'lucide-react';

interface FacultyProps {
  facultyList: FacultyMember[];
  onConsultationRequest: () => void;
}

export default function Faculty({ facultyList, onConsultationRequest }: FacultyProps) {
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);

  return (
    <section id="faculty" className="py-20 bg-surface-cream border-b border-brand-violet/10">
      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-space text-xs font-bold uppercase tracking-widest text-brand-violet block mb-2">
            Subject Leaders
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-accent tracking-tight">
            Our Distinguished Faculty
          </h2>
          <div className="w-16 h-0.5 bg-brand-violet/30 mx-auto mt-4" />
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {facultyList.map((teacher, idx) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedFaculty(teacher)}
              className="bg-white rounded-lg overflow-hidden border border-brand-violet/10 hover:shadow-md transition-all duration-200 cursor-pointer group text-center"
            >
              {/* Profile Image with Slate Tint Filter */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-brand-violet/10">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-violet/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>

              {/* Title Coordinates */}
              <div className="p-5">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-accent group-hover:text-brand-violet transition-colors">
                  {teacher.name}
                </h3>
                <p className="font-sans text-xs font-semibold text-brand-violet uppercase tracking-wider mt-1.5 bh-badge">
                  {teacher.specialty}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Panel CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => setSelectedFaculty(facultyList[0])}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 border border-brand-violet/30 hover:bg-brand-violet text-brand-violet hover:text-white rounded font-space text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Show Academic Roster
          </button>
        </div>
      </div>

      {/* Faculty Detailed Drawer Overlay */}
      <AnimatePresence>
        {selectedFaculty && (
          <div id="faculty-info-modal" className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setSelectedFaculty(null)} />

            <motion.div
              initial={{ x: '105%' }}
              animate={{ x: 0 }}
              exit={{ x: '105%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-surface-cream text-brand-accent shadow-2xl h-full flex flex-col justify-between overflow-y-auto rounded-l-xl border-l border-brand-violet/20"
            >
              <div>
                {/* Close Button */}
                <button
                  onClick={() => setSelectedFaculty(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-violet/10 text-brand-violet z-10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Cover Portrait Section */}
                <div className="relative h-64 w-full bg-[#17172c]">
                  <img
                    src={selectedFaculty.image}
                    alt={selectedFaculty.name}
                    className="w-full h-full object-cover object-top opacity-85"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-cream via-surface-cream/40 to-black/30" />
                  
                  <div className="absolute bottom-4 left-6">
                    <h3 className="font-serif text-2xl font-extrabold text-[#111] leading-tight">
                      {selectedFaculty.name}
                    </h3>
                    <p className="font-sans text-xs font-bold text-brand-violet bg-white/90 border border-brand-violet/10 px-2.5 py-0.5 rounded mt-1.5 inline-block">
                      {selectedFaculty.specialty}
                    </p>
                  </div>
                </div>

                {/* Educational Insights Block */}
                <div className="p-6 md:p-8 space-y-6">
                  
                  {/* Bio */}
                  <div>
                    <h4 className="font-space text-[10px] uppercase tracking-widest text-[#93000a] font-bold mb-2">
                      Academic Biography
                    </h4>
                    <p className="font-sans text-xs text-brand-accent/85 leading-relaxed">
                      {selectedFaculty.bio}
                    </p>
                  </div>

                  {/* Credentials / Education */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-violet/10">
                    <div className="flex items-start gap-2.5">
                      <GraduationCap className="w-5 h-5 text-brand-violet flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-space text-[9px] text-[#4b463e] uppercase">Education</p>
                        <p className="font-sans text-xs font-semibold leading-snug">{selectedFaculty.education}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Briefcase className="w-5 h-5 text-brand-violet flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-space text-[9px] text-[#4b463e] uppercase">Experience</p>
                        <p className="font-sans text-xs font-semibold leading-snug">{selectedFaculty.experience}</p>
                      </div>
                    </div>
                  </div>

                  {/* Syllabus / Administrative Areas taught */}
                  <div className="bg-white rounded p-4 border border-brand-violet/10">
                    <h5 className="font-space text-[10px] uppercase tracking-widest text-brand-violet font-semibold mb-3">
                      Syllabus Responsibilities
                    </h5>
                    <ul className="space-y-2 text-xs font-sans text-brand-accent/80">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-violet" />
                         UPSC Civil Services general studies paper mapping
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-violet" />
                        NCERT core fundamental alignment lectures
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-violet" />
                        Dynamic UPSC daily answer writing evaluation
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* Booking Trigger Footer */}
              <div className="p-6 md:p-8 bg-[#585990]/5 border-t border-brand-violet/10 flex items-center justify-between gap-4">
                <div className="text-left font-sans">
                  <p className="text-[10px] uppercase font-space text-brand-violet">COUNSELING MENTOR</p>
                  <p className="text-xs font-bold text-brand-accent">Book Callback Session</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFaculty(null);
                    onConsultationRequest();
                  }}
                  className="bg-brand-violet text-white font-space text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded hover:bg-brand-violet/90 transition-all cursor-pointer"
                >
                  Schedule Callback
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
