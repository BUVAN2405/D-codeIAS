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
import NetworkStatusOverlay from './components/NetworkStatusOverlay';
import LegalPolicyModal, { PolicyType } from './components/LegalPolicyModal';
import PrelimsOrientationPage from './components/PrelimsOrientationPage';
import PrelimsConquerCoursePage from './components/PrelimsConquerCoursePage';
import PcmBatch2028CoursePage from './components/PcmBatch2028CoursePage';
import { useThemePalette } from './theme/useThemePalette';
import PrelimsConquerPopupModal from './components/PrelimsConquerPopupModal';
import { isOrientationExpired } from './utils/orientationConfig';
import { ORIENTATION_HASHTAGS } from './components/PrelimsOrientationPopup';

// Custom Sections
import AboutAcademy from './components/AboutAcademy';
import Founder from './components/Founder';
import LearningProcess from './components/LearningProcess';
import FaqSection from './components/FaqSection';
import LeadControls from './components/LeadControls';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginPage from './components/AdminLoginPage';
import { getAdminSession } from './services/api';

// New Dynamic Content Sections
import Toppers from './components/Toppers';
import FreeContent from './components/FreeContent';
import CourseDetailedAnalysis from './components/CourseDetailedAnalysis';
import WhyDcodeVisual from './components/WhyDcodeVisual';
import VideoTestimonials from './components/VideoTestimonials';

import { COURSES, ADVANTAGES, FACULTY, TOPPERS, BATCH_SCHEDULES } from './data';
import { Course, BatchSchedule } from './types';
import { CheckCircle, Info, Landmark } from 'lucide-react';

export default function App() {
  useThemePalette();
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

  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [isAdminPage, setIsAdminPage] = useState(false);
  const [adminSessionKey, setAdminSessionKey] = useState(0);
  const [isOrientationPage, setIsOrientationPage] = useState(false);
  const [isPrelimsConquerPage, setIsPrelimsConquerPage] = useState(false);
  const [isPcmCoursePage, setIsPcmCoursePage] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  // Detect URL routes (including dedicated /prelims-orientation-2027 page, /prelims-conquer-2027 page, /pcm-batch-2028, 404, etc.)
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);
      const mode = searchParams.get('mode');

      if (mode === 'maintenance' || mode === '503') setIsMaintenanceMode(true);
      if (mode === '500' || mode === 'servererror') setIs500ServerError(true);
      if (mode === '401' || mode === '403' || mode === 'accessdenied') setIs401AccessDenied(true);

      // Check for dedicated PCM UPSC Batch 2028 Course Page routes
      if (
        path === '/pcm-batch-2028' ||
        path === '/pcm-2028' ||
        path === '/pcm' ||
        path.startsWith('/pcm-batch-2028') ||
        path.startsWith('/pcm-2028') ||
        hash === '#pcm-batch-2028' ||
        hash === '#pcm-2028' ||
        searchParams.get('course') === 'pcm-2028' ||
        searchParams.get('course') === 'pcm-batch-2028' ||
        searchParams.get('page') === 'pcm-2028' ||
        searchParams.get('page') === 'pcm'
      ) {
        setIsPcmCoursePage(true);
        setIsPrelimsConquerPage(false);
        setIsOrientationPage(false);
        setIsAdminPage(false);
        setIs404(false);
        return;
      }
      setIsPcmCoursePage(false);

      // Check for dedicated Prelims Conquer 2027 Course Page routes
      if (
        path === '/prelims-conquer-2027' ||
        path === '/prelims-conquer' ||
        path.startsWith('/prelims-conquer') ||
        hash === '#prelims-conquer-2027' ||
        hash === '#prelims-conquer' ||
        searchParams.get('course') === 'prelims-conquer-2027' ||
        searchParams.get('page') === 'prelims-conquer'
      ) {
        setIsPrelimsConquerPage(true);
        setIsOrientationPage(false);
        setIsAdminPage(false);
        setIs404(false);
        return;
      }
      setIsPrelimsConquerPage(false);

      // Check for dedicated Orientation page routes
      if (
        path === '/prelims-orientation-2027' ||
        path === '/orientation' ||
        path === '/prelims-2027' ||
        hash === '#prelims-orientation-2027' ||
        searchParams.get('page') === 'orientation'
      ) {
        if (isOrientationExpired()) {
          setIsOrientationPage(false);
          setIs404(true);
          return;
        }
        setIsOrientationPage(true);
        setIsAdminPage(false);
        setIs404(false);
        return;
      }

      setIsOrientationPage(false);

      // Check for Admin Portal route (/admin or #admin)
      if (
        path === '/admin' ||
        path.startsWith('/admin') ||
        hash === '#admin' ||
        searchParams.get('page') === 'admin'
      ) {
        setIsAdminPage(true);
        setIsPrelimsConquerPage(false);
        setIsOrientationPage(false);
        setIs404(false);
        return;
      }
      setIsAdminPage(false);

      if (path !== '/' && path !== '' && !path.includes('index.html')) {
        setIs404(true);
      } else {
        setIs404(false);
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  const handleOpenPrelimsConquerPage = () => {
    window.history.pushState({}, '', '/prelims-conquer-2027');
    setIsPrelimsConquerPage(true);
    setIsPcmCoursePage(false);
    setIsAdminPage(false);
    setIsOrientationPage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHomeFromPrelimsConquer = () => {
    window.history.pushState({}, '', '/');
    setIsPrelimsConquerPage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPcmCoursePage = () => {
    window.history.pushState({}, '', '/pcm-batch-2028');
    setIsPcmCoursePage(true);
    setIsPrelimsConquerPage(false);
    setIsAdminPage(false);
    setIsOrientationPage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHomeFromPcmCourse = () => {
    window.history.pushState({}, '', '/');
    setIsPcmCoursePage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOrientationPage = () => {
    if (isOrientationExpired()) return;
    window.location.href = '/prelims-orientation-2027';
  };

  const handleGoHomeFromOrientation = () => {
    window.location.href = '/';
  };

  const handleOpenAdminPortal = () => {
    window.open('/admin', '_blank');
  };

  const handleGoHomeFromAdmin = () => {
    window.history.pushState({}, '', '/');
    setIsAdminPage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (sectionId === 'enquiry-27') {
      handleOpenPrelimsConquerPage();
      return;
    }
    if (sectionId === 'pcm-2028') {
      handleOpenPcmCoursePage();
      return;
    }
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
            setIsAdminPage(true);
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

  if (isPcmCoursePage) {
    return (
      <ErrorBoundary>
        <Helmet>
          <title>UPSC PCM Batch 2028 | 1.5 Years Prelims-Cum-Mains Full Foundation | D'code IAS Academy</title>
          <meta
            name="description"
            content="Enroll in UPSC PCM Batch 2028 by D'code IAS Academy with Sudhagaran Sir. Comprehensive 1.5-year Prelims-cum-Mains foundation course targeting UPSC CSE 2028. Daily 3-hour classes, 8-step roadmap, weekly assessments, Mains & optional mentoring, and Prelims test series."
          />
        </Helmet>
        <NetworkStatusOverlay />
        <PcmBatch2028CoursePage
          onBackToHome={handleGoHomeFromPcmCourse}
          onEnrollClick={(_packageName) => {
            triggerModalGeneric();
          }}
          onNavigateToPrelimsConquer={handleOpenPrelimsConquerPage}
        />
        {/* Master Registration Reservation Modal Overlay */}
        <EnrollModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedCourse={selectedCourse}
          selectedBatch={selectedBatch}
          coursesList={COURSES}
        />
      </ErrorBoundary>
    );
  }

  if (isPrelimsConquerPage) {
    return (
      <ErrorBoundary>
        <Helmet>
          <title>UPSC Prelims Conquer 2027 Course & 43 Tests Mentorship | D'code IAS Academy</title>
          <meta
            name="description"
            content="Enroll in UPSC Prelims Conquer 2027 by D'code IAS Academy with Sudhagaran Sir. 43 tests (28 GS + 15 CSAT), daily direction classes, theme PYQ analysis, and 1-on-1 mentorship. Download brochure and schedule."
          />
        </Helmet>
        <NetworkStatusOverlay />
        <PrelimsConquerCoursePage
          onBackToHome={handleGoHomeFromPrelimsConquer}
          onEnrollClick={(_packageName) => {
            triggerModalGeneric();
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
      </ErrorBoundary>
    );
  }

  if (isOrientationPage) {
    return (
      <ErrorBoundary>
        <NetworkStatusOverlay />
        <PrelimsOrientationPage
          onGoHome={handleGoHomeFromOrientation}
          onSubmitSuccess={handleInquiryNotification}
        />
      </ErrorBoundary>
    );
  }

  if (isAdminPage) {
    const session = getAdminSession();
    if (!session || !session.token) {
      return (
        <ErrorBoundary>
          <Helmet>
            <title>Admin Login | D'code IAS Academy</title>
            <meta name="robots" content="noindex, nofollow" />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            <link rel="icon" type="image/jpeg" href="/LOGO.jpeg" />
            <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/LOGO.jpeg" />
          </Helmet>
          <NetworkStatusOverlay />
          <AdminLoginPage
            onLoginSuccess={() => {
              setIsAdminPage(true);
              setAdminSessionKey(Date.now());
              setShowNotification('Logged in successfully as Administrator.');
              setTimeout(() => setShowNotification(null), 3500);
            }}
            onBackToHome={handleGoHomeFromAdmin}
          />
        </ErrorBoundary>
      );
    }

    return (
      <ErrorBoundary>
        <Helmet>
          <title>Master Admin Dashboard | D'code IAS Academy</title>
          <meta name="robots" content="noindex, nofollow" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="icon" type="image/jpeg" href="/LOGO.jpeg" />
          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/LOGO.jpeg" />
        </Helmet>
        <NetworkStatusOverlay />
        <AdminDashboard
          isOpen={true}
          isPage={true}
          onClose={handleGoHomeFromAdmin}
          onBackToHome={handleGoHomeFromAdmin}
          onLogout={() => {
            setAdminSessionKey(Date.now());
            setIsAdminPage(true);
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
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/jpeg" href="/LOGO.jpeg" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/LOGO.jpeg" />
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
              "url": "https://decodeias.com/#prelims-orientation-2027",
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

      <div className="bg-[#fdf8f6] min-h-screen text-brand-accent selection:bg-[#fff2e0] selection:text-brand-primary font-sans">
        
        {/* Sticky Top-level Header Menu bar */}
        <Navbar
          onEnrollClick={triggerModalGeneric}
          onNavigate={scrollToSection}
          activeSection={activeSection}
          onAdminClick={handleOpenAdminPortal}
          onOrientationClick={handleOpenOrientationPage}
          onPrelimsConquerClick={handleOpenPrelimsConquerPage}
          onPcmClick={handleOpenPcmCoursePage}
          onMenuToggle={setIsNavMenuOpen}
        />

        {/* Main landing segments */}
        <main className="w-full max-w-full">
          
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
              onCourseSelect={(course) => {
                if (course.id === 'pcm_comprehensive') {
                  handleOpenPcmCoursePage();
                } else {
                  triggerModalForCourse(course);
                }
              }}
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
          onAdminClick={handleOpenAdminPortal}
        />

        {/* Legal Policies Modal (Privacy, Terms, Refund) */}
        <LegalPolicyModal
          policyType={activePolicy}
          onClose={() => setActivePolicy(null)}
        />

        {/* Interactive Sticky Lead Controls Panel (Hidden when menu is open) */}
        {!isNavMenuOpen && (
          <LeadControls 
            onInquiryClick={triggerModalGeneric} 
            onOrientationClick={!isOrientationExpired() ? handleOpenOrientationPage : undefined}
          />
        )}

        {/* Flagship Entry Advertisement Popup for Prelims Conquer 2027 & PCM Batch 2028 */}
        <PrelimsConquerPopupModal
          onNavigateToCourse={handleOpenPrelimsConquerPage}
          onNavigateToPcmCourse={handleOpenPcmCoursePage}
        />

        {/* Master Registration Reservation Modal Overlay */}
        <EnrollModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedCourse={selectedCourse}
          selectedBatch={selectedBatch}
          coursesList={COURSES}
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

      </div>
    </ErrorBoundary>
  );
}
