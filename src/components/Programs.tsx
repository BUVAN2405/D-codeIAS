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
    <section id="courses" className="py-20 bg-surface-cream border-b border-brand-violet/10">
      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-space text-xs font-bold uppercase tracking-widest text-brand-violet block mb-2">
            Our Programs
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-accent tracking-tight">
            Comprehensive UPSC Training
          </h2>
          <div className="w-16 h-0.5 bg-brand-violet/30 mx-auto mt-4" />
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, idx) => {
            const IconComponent = IconMap[course.iconName] || BookOpen;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white border-t-3 border-brand-violet rounded-lg p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-brand-violet/5 flex items-center justify-center text-brand-violet mb-6">
                    <IconComponent className="w-5 h-5 stroke-[2]" />
                  </div>

                  <h3 className="font-serif text-xl font-bold text-brand-accent mb-3">
                    {course.title}
                  </h3>
                  
                  <p className="font-sans text-xs text-brand-accent/75 leading-relaxed mb-6">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-violet/5">
                  <button
                    onClick={() => onCourseSelect(course)}
                    className="inline-flex items-center gap-1.5 text-xs font-space font-bold uppercase tracking-wider text-brand-violet hover:text-brand-accent transition-colors duration-200 cursor-pointer group"
                  >
                    Learn More
                    <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
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
