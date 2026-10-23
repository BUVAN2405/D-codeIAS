import { ComponentType } from 'react';
import { motion } from 'motion/react';
import { Course } from '../types';
import { BookOpen, Zap, PenTool, UserCheck, ChevronRight } from 'lucide-react';

interface ProgramsProps {
  courses: Course[];
  onCourseSelect: (course: Course) => void;
}

// Icon mapper for dynamic string rendering
const IconMap: { [key: string]: ComponentType<any> } = {
  BookOpen: BookOpen,
  Zap: Zap,
  PenTool: PenTool,
  UserCheck: UserCheck,
};

export default function Programs({ courses, onCourseSelect }: ProgramsProps) {
  return (
    <section id="courses" className="py-12 sm:py-16 bg-surface-cream border-b border-brand-violet/10">
      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="font-space text-xs font-bold uppercase tracking-widest text-brand-violet block mb-1.5">
            Our Programs
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-accent tracking-tight">
            Comprehensive UPSC Training
          </h2>
          <div className="w-12 h-0.5 bg-brand-violet/30 mx-auto mt-3" />
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {courses.map((course, idx) => {
            const IconComponent = IconMap[course.iconName] || BookOpen;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white border-t-2 border-[#0D2C54] rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Icon & Title Row (Side-by-Side) */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0D2C54]/8 flex items-center justify-center text-[#0D2C54] shrink-0">
                      <IconComponent className="w-4 h-4 stroke-[2]" />
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#0D2C54] leading-snug">
                      {course.title}
                    </h3>
                  </div>
                  
                  <p className="font-sans text-xs text-gray-600 leading-relaxed line-clamp-3 mb-3">
                    {course.description}
                  </p>
                </div>

                {/* Learn More Button with tight spacing */}
                <div className="pt-2.5 border-t border-gray-100">
                  <button
                    onClick={() => onCourseSelect(course)}
                    className="inline-flex items-center gap-1 text-[11px] font-space font-bold uppercase tracking-wider text-[#0D2C54] hover:text-[#D31218] transition-colors duration-200 cursor-pointer group"
                  >
                    <span>Learn More</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
