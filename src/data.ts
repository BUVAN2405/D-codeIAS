import { Course, Advantage, FacultyMember, Topper, BatchSchedule } from './types';
import ceoPhoto from './Ceo.jpeg';

export const COURSES: Course[] = [
  {
    id: 'mains_momentum_2027',
    title: 'Mains Momentum 2027',
    badge: 'Specialized Track',
    tagline: '5-Month Intensive Mains Answer Development & Mentoring Program.',
    description: 'An outcome-focused program built around paper coverage, mentorship feedback loops, mock schedules, and key current insights.',
    iconName: 'PenTool',
    duration: '5 Months',
    syllabusOverview: [
      'Personal Mentoring by Sudhagaran Sir',
      'Daily Answer Writing Practice & Evaluation',
      'UPSC Mock Test Series with Discussions',
      'Ethics & Essay Writing Specialization',
      'Comprehensive coverage of GS Papers I, II, III, IV'
    ]
  },
  {
    id: 'pcm_comprehensive',
    title: 'PCM Comprehensive',
    badge: 'Prelims Cum Mains',
    tagline: 'Complete Foundation Course for Beginners covering both UPSC Prelims and Mains.',
    description: 'Covers syllabus foundations systematically, combining consistent topic examinations, doubt clearing discussions, and pricing formats built for accessibility.',
    iconName: 'BookOpen',
    duration: 'Full Duration',
    syllabusOverview: [
      'Comprehensive Syllabus Foundation Coverage',
      'Daily Tests & Regular Discussions',
      'Affordable Fee Structure with Quality Assurance',
      'Mentorship Support & Concept Clarity Classes',
      'Integrated CSAT and Essay Prep Modules'
    ]
  },
  {
    id: 'public_administration',
    title: 'Public Administration Optional',
    badge: 'Optional Subject',
    tagline: 'Complete Public Administration Optional Coaching for UPSC Mains.',
    description: 'A thorough 4-month program designed to decode public administration concepts, evaluate previous years questions, and offer one-on-one personal mentoring.',
    iconName: 'Briefcase',
    duration: '4 Months',
    syllabusOverview: [
      'Complete Syllabus Decoding and Concept Mapping',
      'Previous Years Questions (PYQ) Exhaustive Analysis',
      'Personal Mentoring under Expert Faculty',
      'Daily Answer Writing and Feedback Evaluation',
      'High-Yield Concept Notes and Material Kits'
    ]
  },
  {
    id: 'sociology_optional',
    title: 'Sociology Optional',
    badge: 'Optional Subject',
    tagline: 'Sociology Optional Course with Structured Roadmap & answer writing guidance.',
    description: 'A comprehensive 4-month course providing complete syllabus coverage, comprehensive structured notes, and direct answers review.',
    iconName: 'Users',
    duration: '4 Months',
    syllabusOverview: [
      'Syllabus-wise Comprehensive Structured Notes',
      'Detailed answer writing guidance and evaluations',
      'Sociological theories made intuitive and visual',
      'Previous Years Questions discussion sessions',
      'Weekly mock exams with detailed model answers'
    ]
  },
  {
    id: 'anthropology_optional',
    title: 'Anthropology Optional',
    badge: 'Optional Subject',
    tagline: 'Anthropology Optional Coaching featuring regular mentorship and paper evaluation.',
    description: 'An in-depth 4-month coaching module focusing on biological anthropology, cultural theory, and daily answer evaluation.',
    iconName: 'Compass',
    duration: '4 Months',
    syllabusOverview: [
      'In-depth syllabus coverage & diagram tutorials',
      'Daily Answer Evaluation & Mentorship Loops',
      'Biological and Tribal Anthropology Focus',
      'Answer enrichment templates & case studies',
      'Comprehensive revision notes and reference keys'
    ]
  },
  {
    id: 'tnpsc_coaching',
    title: 'TNPSC Group 1, 2 & 4',
    badge: 'State PSC',
    tagline: 'Bilingual preparation program for Group 1, 2 and 4 TNPSC exams.',
    description: 'State-level mentors delivering comprehensive coaching with bilingual study materials and mock exam suites.',
    iconName: 'Award',
    duration: 'Ongoing',
    syllabusOverview: [
      'High-Quality Bilingual Study Materials (Tamil/English)',
      'Regular Mock Exams matching latest TNPSC Patterns',
      'Mentorship by state-level rank holders',
      'Special focus on Unit 8 and Unit 9 of TNPSC syllabus',
      'Current Affairs compilations specific to Tamil Nadu'
    ]
  }
];

export const ADVANTAGES: Advantage[] = [
  {
    id: 'faculty',
    title: 'Experienced Faculty',
    description: 'Learn from the country\'s best educators led by Sudhagaran Sir with decades of administrative and classroom leadership.',
    iconName: 'Award'
  },
  {
    id: 'material',
    title: 'Structured Material',
    description: 'Exhaustive study materials, concept sheets, and mind maps updated periodically with the latest UPSC/TNPSC trends and updates.',
    iconName: 'Layers'
  },
  {
    id: 'tests',
    title: 'Mock Tests',
    description: 'Real-time examination simulation, precise grading metrics, and instant analytical feedback on speed, selection, and error patterns.',
    iconName: 'FileText'
  },
  {
    id: 'mentorship',
    title: 'Personal Mentorship',
    description: 'One-on-one sessions with Sudhagaran Sir and other experts to bridge gaps in preparation, address academic fatigue, and custom-tailor targets.',
    iconName: 'Users'
  },
  {
    id: 'track_record',
    title: 'Track Record',
    description: 'A stellar legacy of producing top ranks consistently across GS, Optionals, and Interview streams year after year.',
    iconName: 'TrendingUp'
  },
  {
    id: 'study_material',
    title: 'Study Material',
    description: 'Curated static and dynamic reference notes for General Studies, CSAT, and standard optional subjects.',
    iconName: 'BookMarked'
  }
];

export const FACULTY: FacultyMember[] = [
  {
    id: 'sudhagaran_sir',
    name: 'Sudhagaran Sir',
    specialty: 'Founder & Chief Mentor',
    education: 'Former Mission Director, Naan Mudhalvan',
    experience: 'Distinguished Administrative Mentor & UPSC Expert',
    bio: 'Former Mission Director of Naan Mudhalvan who has mentored over 500 UPSC aspirants, guiding many towards Top 10 All India Ranks. Renowned for his approach of simplicity and clarity to empower candidates.',
    image: ceoPhoto
  },
  
];

export const TOPPERS: Topper[] = [
  {
    id: 'topper1',
    name: 'Rahul Deshmukh',
    rank: 12,
    year: 2025,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    quote: 'D\'code IAS Academy\'s meticulous mains answer writing feedback transformed my GS answers into policy-briefing style outputs.',
    strategy: 'Dedicated 3 hours daily to answer structuring and syllabus mapping under Sudhagaran Sir\'s personal guidance.'
  },
  {
    id: 'topper2',
    name: 'Sneha Iyer',
    rank: 28,
    year: 2025,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    quote: 'The personal mentorship program under Sudhagaran Sir helped me handle academic fatigue and fine-tune my Sociology optional syllabus.',
    strategy: 'Focused on making short micro-notes for active recall. Solved both dynamic news and premium maps questions for GS Paper I.'
  },
  {
    id: 'topper3',
    name: 'Vivek Anand',
    rank: 45,
    year: 2025,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    quote: 'Interview panels with retired bureaucrats gave me the core composure, confidence, and objective speaking poise required for success.',
    strategy: 'DAF analysis was incredibly detailed down to minor terms. This helped me answer questions on regional administration seamlessly.'
  }
];

export const BATCH_SCHEDULES: BatchSchedule[] = [
  {
    id: 'batch_mains_momentum',
    name: 'Mains Momentum 2027',
    startDate: '15th Oct, 2026',
    mode: 'Offline + Online',
    availability: 'Closed'
  },
  {
    id: 'batch_pcm_comprehensive',
    name: 'PCM Comprehensive',
    startDate: '01st Nov, 2026',
    mode: 'Offline + Online',
    availability: 'Coming Soon'
  },
  {
    id: 'batch_optionals_special',
    name: 'Optionals Special Module',
    startDate: '10th Nov, 2026',
    mode: 'Offline Only',
    availability: 'Coming Soon'
  }
];
