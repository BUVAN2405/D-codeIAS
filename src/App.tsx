import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Programs from './components/Programs';
import Advantages from './components/Advantages';
import Faculty from './components/Faculty';
import BatchSchedulesList from './components/BatchSchedule';
import InquiryForm from './components/InquiryForm';
import Footer from './components/Footer';
import EnrollModal from './components/EnrollModal';
import WhatsAppWidget from './components/WhatsAppWidget';

// Custom Sections
import AboutAcademy from './components/AboutAcademy';
import Founder from './components/Founder';
import LearningProcess from './components/LearningProcess';
import FaqSection from './components/FaqSection';
import InquiryPopup from './components/InquiryPopup';
import LeadControls from './components/LeadControls';
import AdminLeadsDrawer from './components/AdminLeadsDrawer';

// New Dynamic Content Sections
import Toppers from './components/Toppers';
import FreeContent from './components/FreeContent';
import CourseDetailedAnalysis from './components/CourseDetailedAnalysis';
import WhyDcodeVisual from './components/WhyDcodeVisual';
import VideoTestimonials from './components/VideoTestimonials';

import { COURSES, ADVANTAGES, FACULTY, TOPPERS, BATCH_SCHEDULES } from './data';
import { Course, BatchSchedule } from './types';
import { CheckCircle, Info, Landmark, Lightbulb } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<BatchSchedule | null>(null);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // IntersectionObserver to auto-update active navbar coordinates on scroll
  useEffect(() => {
    const sections = ['home', 'courses', 'faculty', 'contact'];
    
    // Fallback: If 'blog' or custom sections are requested, map them
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px', // Target coordinates midpoint of screen
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Soft trigger for scrolling down to a specified target ID
  const scrollToSection = (sectionId: string) => {
    // If 'results' is selected, scroll specifically, if 'blog' scroll to courses range
    const targetId = sectionId === 'blog' ? 'courses' : sectionId;
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const triggerModalGeneric = () => {
    setSelectedCourse(null);
    setSelectedBatch(null);
    setIsModalOpen(true);
  };

  const triggerModalForCourse = (course: Course) => {
    setSelectedCourse(course);
    setSelectedBatch(null);
    setIsModalOpen(true);
  };

  const triggerModalForBatch = (batch: BatchSchedule) => {
    setSelectedCourse(null);
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  const handleStaticBrochureRequest = () => {
    // Show download confirmation notification badge
    setShowNotification('UPSC Curriculum Syllabus Brochure successfully dispatched to download spool!');
    setTimeout(() => {
      setShowNotification(null);
    }, 4500);

    // Trigger local anchor download action for simulated PDF
    const mockPdfContent = `D'code IAS Academy Official Syllabus Package & Course Curriculum 2026-2027 under Sudhagaran Sir (Anna Nagar, Chennai)`;
    const blob = new Blob([mockPdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'D_code_IAS_Academy_Brochure_2026.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInquiryNotification = () => {
    setShowNotification('Thank you! Inquiry packet validated. An academic advisor will phone you momentarily.');
    setTimeout(() => {
      setShowNotification(null);
    }, 5000);
  };

  return (
    <div className="bg-[#fdf8f6] min-h-screen text-brand-accent selection:bg-[#fff2e0] selection:text-brand-primary overflow-x-hidden font-sans">
      
      {/* Sticky Top-level Header Menu bar */}
      <Navbar
        onEnrollClick={triggerModalGeneric}
        onNavigate={scrollToSection}
        activeSection={activeSection}
      />

      {/* Main landing segments */}
      <main>
        
        {/* Banner Segment */}
        <Hero
          onExploreClick={() => scrollToSection('courses')}
          onBrochureClick={handleStaticBrochureRequest}
        />

        {/* 1st content: Courses Offered on top of the Moving Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <Programs
            courses={COURSES}
            onCourseSelect={triggerModalForCourse}
          />
        </motion.div>

        {/* UPSC Toppers direct mentorship grid */}
        <Toppers />

        {/* 2nd content: FREE CONTENT */}
        <FreeContent />

        {/* 3rd content: DETAILED ANALYSIS OF COURSE */}
        <CourseDetailedAnalysis />

        {/* Why D'code IAS Academy - Made Highly Visual */}
        <WhyDcodeVisual />

        {/* About Academy Section */}
        <AboutAcademy />

        {/* Founder Section */}
        <Founder />

        {/* Learning Process Section */}
        <LearningProcess />

        {/* Teacher Profiles & Specialty Deep Dives */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <Faculty
            facultyList={FACULTY}
            onConsultationRequest={triggerModalGeneric}
          />
        </motion.div>

        {/* YouTube Video Testimonials */}
        <VideoTestimonials />

        {/* Batches Table with interactive reservation indicators */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <BatchSchedulesList
            batches={BATCH_SCHEDULES}
            onEnrollClick={triggerModalForBatch}
          />
        </motion.div>

        {/* FAQ Accordions Section */}
        <FaqSection />

        {/* Get in Touch inquiry fields */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <InquiryForm
            courses={COURSES}
            onSubmitSuccess={handleInquiryNotification}
          />
        </motion.div>

      </main>

      {/* Structured Legal Directory Footer */}
      <Footer />

      {/* Interactive Floating WhatsApp Guidance panel */}
      <WhatsAppWidget />

      {/* Interactive Sticky Lead Controls Panel */}
      <LeadControls onInquiryClick={triggerModalGeneric} />

      {/* Automatic Invitation popup modal */}
      <InquiryPopup courses={COURSES} onSubmitSuccess={handleInquiryNotification} />

      {/* Master Registration Reservation Modal Overlay */}
      <EnrollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCourse={selectedCourse}
        selectedBatch={selectedBatch}
        coursesList={COURSES}
      />

      {/* Admin Leads and Email Logs verification portal */}
      <AdminLeadsDrawer />

      {/* Responsive Dispatch Notification toast for file spool and callbacks */}
      {showNotification && (
        <div className="fixed bottom-24 left-6 z-50 max-w-sm bg-brand-violet text-white py-3 px-4 rounded-lg shadow-xl border border-white/15 flex items-start gap-2.5 animate-bounce">
          <CheckCircle className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold uppercase tracking-wider font-space text-[10px] text-brand-gold">
              Academy Bulletin
            </p>
            <p className="font-sans leading-relaxed mt-0.5">{showNotification}</p>
          </div>
        </div>
      )}

      {/* Documentation Drawer for component expansion */}
      <div className="bg-brand-violet/5 py-4 border-t border-brand-violet/15">
        <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-space text-brand-violet/85 uppercase tracking-wider font-semibold py-1 px-3 bg-white border border-brand-violet/10 rounded">
            <Lightbulb className="w-3.5 h-3.5 text-brand-gold" />
            Developer Reference docs: expand components inside `/src/components/*` securely.
          </div>
        </div>
      </div>

    </div>
  );
}
