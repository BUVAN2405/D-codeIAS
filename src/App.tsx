import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Programs from './components/Programs';
import Advantages from './components/Advantages';
import Faculty from './components/Faculty';
import BatchSchedulesList from './components/BatchSchedule';
import InquiryForm from './components/InquiryForm';
import Footer from './components/Footer';
import EnrollModal from './components/EnrollModal';

// System Pages & Overlays
import ErrorBoundary from './components/ErrorBoundary';
import NotFoundPage from './components/NotFoundPage';
import MaintenancePage from './components/MaintenancePage';
import ServerErrorPage from './components/ServerErrorPage';
import AccessDeniedPage from './components/AccessDeniedPage';
import ServiceStatusModal from './components/ServiceStatusModal';
import NetworkStatusOverlay from './components/NetworkStatusOverlay';
import LegalPolicyModal, { PolicyType } from './components/LegalPolicyModal';
import PrelimsOrientationPopup, { ORIENTATION_HASHTAGS, REGISTRATION_FORM_URL } from './components/PrelimsOrientationPopup';

// Custom Sections
import AboutAcademy from './components/AboutAcademy';
import Founder from './components/Founder';
import LearningProcess from './components/LearningProcess';
import FaqSection from './components/FaqSection';
import LeadControls from './components/LeadControls';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import { getAdminSession } from './services/api';

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

  // System States (404, 503 Maintenance, 500 Server Error, 401 Access Denied, Policies, Admin)
  const [is404, setIs404] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [is500ServerError, setIs500ServerError] = useState(false);
  const [is401AccessDenied, setIs401AccessDenied] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isOrientationOpen, setIsOrientationOpen] = useState(false);

  // Auto-open UPSC Prelims 2027 Conquer Orientation popup when user enters the website
  useEffect(() => {
    const isDismissed = sessionStorage.getItem('dcode_prelims_2027_popup_closed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOrientationOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Detect 404 URL route or system mode query overrides (e.g. ?mode=maintenance, ?mode=500, ?mode=401, ?mode=status)
  useEffect(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const mode = searchParams.get('mode');

    if (mode === 'maintenance' || mode === '503') setIsMaintenanceMode(true);
    if (mode === '500' || mode === 'servererror') setIs500ServerError(true);
    if (mode === '401' || mode === '403' || mode === 'accessdenied') setIs401AccessDenied(true);
    if (mode === 'status') setIsStatusModalOpen(true);

    if (path !== '/' && path !== '' && !path.includes('index.html')) {
      setIs404(true);
    }
  }, []);

  const handleOpenAdminPortal = () => {
    const session = getAdminSession();
    if (session && session.token) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

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

  if (isMaintenanceMode) {
    return (
      <ErrorBoundary>
        <NetworkStatusOverlay />
        <MaintenancePage onRefresh={() => setIsMaintenanceMode(false)} />
      </ErrorBoundary>
    );
  }

  if (is500ServerError) {
    return (
      <ErrorBoundary>
        <NetworkStatusOverlay />
        <ServerErrorPage
          onRetry={() => setIs500ServerError(false)}
          onGoHome={() => {
            window.history.pushState({}, '', '/');
            setIs500ServerError(false);
          }}
        />
      </ErrorBoundary>
    );
  }

  if (is401AccessDenied) {
    return (
      <ErrorBoundary>
        <NetworkStatusOverlay />
        <AccessDeniedPage
          onGoHome={() => {
            window.history.pushState({}, '', '/');
            setIs401AccessDenied(false);
          }}
          onOpenLogin={() => {
            setIs401AccessDenied(false);
            setIsAdminLoginOpen(true);
          }}
        />
      </ErrorBoundary>
    );
  }

  if (is404) {
    return (
      <ErrorBoundary>
        <NetworkStatusOverlay />
        <NotFoundPage
          onGoHome={() => {
            window.history.pushState({}, '', '/');
            setIs404(false);
          }}
          onNavigateSection={(sec) => {
            window.history.pushState({}, '', '/');
            setIs404(false);
            setTimeout(() => scrollToSection(sec), 150);
          }}
        />
      </ErrorBoundary>
    );
  }

  const getDynamicTitle = () => {
    switch (activeSection) {
      case 'courses': return "Courses & Programs | D'code IAS Academy";
      case 'faculty': return "Faculty & Mentors | D'code IAS Academy";
      case 'contact': return "Contact Us | D'code IAS Academy";
      default: return "D'code IAS Academy | Best IAS Academy in Chennai & Top UPSC Coaching";
    }
  };

  return (
    <ErrorBoundary>
      <Helmet>
        <title>{getDynamicTitle()}</title>
        {/* Canonical must always be the root URL — hash fragments (#section) are ignored by Googlebot */}
        <link rel="canonical" href="https://decodeias.com/" />
        <meta property="og:url" content="https://decodeias.com/" />
        {/* SEO Meta Keywords targeting orientation and hashtags */}
        <meta 
          name="keywords" 
          content={`dcode ias academy, best IAS academy in Chennai, top UPSC coaching in Tamil Nadu, UPSC Prelims 2027, Sudhagaran Sir, Periyar Hall orientation, ${ORIENTATION_HASHTAGS.map(h => h.replace('#', '')).join(', ')}`} 
        />
        {/* Schema.org Educational Event for UPSC Prelims 2027 Orientation */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationEvent",
            "name": "D’code Prelims Conquer Orientation 2027 with Sudhagaran Sir & Team",
            "description": "Complete practical Prelims 2027 strategy covering GS Strategy, CSAT Strategy, Current Affairs, PYQs, Revision Strategy, Test Strategy, and Prelims Planning roadmap.",
            "startDate": "2026-10-15T09:30:00+05:30",
            "endDate": "2026-10-15T13:30:00+05:30",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "location": {
              "@type": "Place",
              "name": "Periyar Hall",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Chennai",
                "addressRegion": "Tamil Nadu",
                "addressCountry": "IN"
              }
            },
            "organizer": {
              "@type": "EducationalOrganization",
              "name": "D'code IAS Academy",
              "url": "https://decodeias.com"
            },
            "offers": {
              "@type": "Offer",
              "url": REGISTRATION_FORM_URL,
              "price": "0",
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock"
            },
            "performer": {
              "@type": "Person",
              "name": "Sudhagaran Sir"
            }
          })}
        </script>
      </Helmet>

      {/* Network Connectivity & Offline Detector */}
      <NetworkStatusOverlay />

      <div className="bg-[#fdf8f6] min-h-screen text-brand-accent selection:bg-[#fff2e0] selection:text-brand-primary overflow-x-hidden font-sans">
        
        {/* Sticky Top-level Header Menu bar */}
        <Navbar
          onEnrollClick={triggerModalGeneric}
          onNavigate={scrollToSection}
          activeSection={activeSection}
          onAdminClick={handleOpenAdminPortal}
        />

        {/* Main landing segments */}
        <main className="w-full max-w-full overflow-x-hidden">
          
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
        <Footer
          onOpenPolicy={(policy) => setActivePolicy(policy)}
          onNavigate={scrollToSection}
          onOpenStatusModal={() => setIsStatusModalOpen(true)}
        />

        {/* Real-Time Service Health Telemetry Modal */}
        <ServiceStatusModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
        />

        {/* Legal Policies Modal (Privacy, Terms, Refund) */}
        <LegalPolicyModal
          policyType={activePolicy}
          onClose={() => setActivePolicy(null)}
        />

        {/* Interactive Sticky Lead Controls Panel */}
        <LeadControls 
          onInquiryClick={triggerModalGeneric} 
          onOrientationClick={() => setIsOrientationOpen(true)}
        />

        {/* Exclusive UPSC Prelims 2027 Conquer Orientation Popup */}
        <PrelimsOrientationPopup
          isOpen={isOrientationOpen}
          onClose={() => {
            setIsOrientationOpen(false);
            sessionStorage.setItem('dcode_prelims_2027_popup_closed', 'true');
          }}
        />

        {/* Master Registration Reservation Modal Overlay */}
        <EnrollModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedCourse={selectedCourse}
          selectedBatch={selectedBatch}
          coursesList={COURSES}
        />

        {/* Owner Admin Authentication Modal */}
        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => setIsAdminLoginOpen(false)}
          onSuccess={() => {
            setIsAdminLoginOpen(false);
            setIsAdminDashboardOpen(true);
          }}
        />

        {/* Owner Master Admin Dashboard Overlay */}
        <AdminDashboard
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
        />

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
    </ErrorBoundary>
  );
}
