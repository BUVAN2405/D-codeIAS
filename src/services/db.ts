// Local database storage for D'code IAS Academy student enrollments and inquiries
import { InquiryFormInput } from '../types';
import { ALL_RETRIEVED_LEADS } from '../data/storedLeads';

export interface SavedInquiry extends InquiryFormInput {
  id: string;
  createdAt: string;
  status: 'New' | 'Contacted' | 'Enrolled';
  formType?: 'enrollment' | 'contact' | 'registration' | 'inquiry';
}

const STORAGE_KEY = 'dcode_ias_academy_enquiries_v4';
const OLD_STORAGE_KEY = 'dcode_ias_academy_enquiries_v2';

// Master baseline roster of active enrolled students, registered candidates, and direct inquiries
export const DEFAULT_ACADEMY_STUDENTS: SavedInquiry[] = [
  // =========================================================================
  // 1. Confirmed Enrolled Students (Current Batches)
  // =========================================================================
  {
    id: 'DC-2026-ENR001',
    fullName: 'Kavitha Sundaram',
    phone: '9840182736',
    email: 'kavitha.sundaram@gmail.com',
    course: 'UPSC Prelims Conquer 2027 (GS + CSAT + Mentorship)',
    formType: 'enrollment',
    status: 'Enrolled',
    message: 'Confirmed Enrollment: 43 Tests Prelims Conquer 2027 package. Full fees cleared. Assigned to personal mentorship under Sudhagaran Sir.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'DC-2026-ENR002',
    fullName: 'Karthik Rajan',
    phone: '9444158920',
    email: 'karthik.rajan98@gmail.com',
    course: 'Mains Momentum 2027',
    formType: 'enrollment',
    status: 'Enrolled',
    message: 'Active Enrolled Student: Mains Momentum 2027 (Batch 1). Submitting daily answer copies for GS Paper I, II, and Ethics.',
    createdAt: new Date(Date.now() - 3600000 * 42).toISOString()
  },
  {
    id: 'DC-2026-ENR003',
    fullName: 'Divya Bharathi S',
    phone: '9791045231',
    email: 'divya.bharathi@yahoo.com',
    course: 'PCM Comprehensive',
    formType: 'enrollment',
    status: 'Enrolled',
    message: 'Enrolled in 2-Year PCM Comprehensive Foundation batch. Classroom seat reserved at Anna Nagar academy branch.',
    createdAt: new Date(Date.now() - 3600000 * 68).toISOString()
  },
  {
    id: 'DC-2026-ENR004',
    fullName: 'Senthil Nathan M',
    phone: '9884210943',
    email: 'senthil.nathan@outlook.com',
    course: 'Public Administration Optional',
    formType: 'enrollment',
    status: 'Enrolled',
    message: 'Enrolled for Public Administration optional subject under expert faculty. Comprehensive PYQ kit and notes issued.',
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString()
  },
  {
    id: 'DC-2026-ENR005',
    fullName: 'Meenakshi Sundaram',
    phone: '9445087123',
    email: 'meenakshi.sundaram@gmail.com',
    course: 'Sociology Optional',
    formType: 'enrollment',
    status: 'Enrolled',
    message: 'Enrolled in Sociology Optional classroom batch. Weekly mock evaluations and sociological thinkers concept maps accessed.',
    createdAt: new Date(Date.now() - 3600000 * 130).toISOString()
  },
  {
    id: 'DC-2026-ENR006',
    fullName: 'Vigneshwaran K',
    phone: '9600147852',
    email: 'vignesh.k@gmail.com',
    course: 'TNPSC Group 1, 2 & 4',
    formType: 'enrollment',
    status: 'Enrolled',
    message: 'Active student in TNPSC Group 1 Integrated Prelims & Mains coaching batch. Bilingual study material received.',
    createdAt: new Date(Date.now() - 3600000 * 170).toISOString()
  },
  {
    id: 'DC-2026-ENR007',
    fullName: 'Ananya Radhakrishnan',
    phone: '9841236547',
    email: 'ananya.radha@gmail.com',
    course: 'Anthropology Optional',
    formType: 'enrollment',
    status: 'Enrolled',
    message: 'Enrolled in Anthropology Optional 4-month program. Biological and tribal anthropology syllabus modules active.',
    createdAt: new Date(Date.now() - 3600000 * 210).toISOString()
  },
  {
    id: 'DC-2026-ENR008',
    fullName: 'Balaji Krishnan',
    phone: '9940321589',
    email: 'balaji.krishnan@gmail.com',
    course: 'UPSC Prelims Conquer 2027 (Test Series Only)',
    formType: 'enrollment',
    status: 'Enrolled',
    message: 'Enrolled in 43 Tests Package Conquer 2027. Full schedule booklet and discussion portal unlocked.',
    createdAt: new Date(Date.now() - 3600000 * 250).toISOString()
  },

  // =========================================================================
  // 2. Existing Registered Students & Orientation Attendees
  // =========================================================================
  {
    id: 'DC-2026-REG009',
    fullName: 'Deepak Narayanan',
    phone: '9710325419',
    email: 'deepak.narayanan@gmail.com',
    course: 'UPSC Prelims Conquer 2027 (GS + CSAT + Mentorship)',
    formType: 'registration',
    status: 'Contacted',
    message: 'Registered reservation for upcoming Prelims Conquer batch starting 01st Nov. Requested fee installment structure.',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'DC-2026-REG010',
    fullName: 'Shalini Venkataraman',
    phone: '9840987654',
    email: 'shalini.v@gmail.com',
    course: 'Mains Momentum 2027',
    formType: 'registration',
    status: 'Contacted',
    message: 'Registered for Mains answer development program. Spoke with admissions team, scheduled counselor meeting at Anna Nagar center.',
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString()
  },
  {
    id: 'DC-2026-REG011',
    fullName: 'Sanjay Kumar P',
    phone: '9500128743',
    email: 'sanjay.kumar@hotmail.com',
    course: 'PCM Comprehensive',
    formType: 'registration',
    status: 'New',
    message: 'Registered for preliminary counseling with Sudhagaran Sir. Fresher graduate from Anna University seeking foundation advice.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'DC-2026-REG012',
    fullName: 'Nandhini Devi T',
    phone: '9841785236',
    email: 'nandhini.devi@gmail.com',
    course: 'Public Administration Optional',
    formType: 'registration',
    status: 'New',
    message: 'Registered for Public Administration demo lecture and previous years question trend analysis workbook.',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    id: 'DC-1784655455996-5607',
    fullName: 'Buvaneshwaran User',
    phone: '9876543210',
    email: 'bhuvaneshwaan2405@gmail.com',
    course: 'TNPSC Group 1, 2 & 4',
    formType: 'registration',
    status: 'Contacted',
    message: 'Registration submission to bhuvaneshwaan2405@gmail.com. Verified admission eligibility.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },

  // =========================================================================
  // 3. Existing User Submissions & Inquiries
  // =========================================================================
  {
    id: 'DC-1784664600644-2217',
    fullName: 'Dcode IAS Final Test',
    phone: '8251002026',
    email: 'test.student@example.com',
    course: 'Mains Momentum 2027',
    formType: 'enrollment',
    status: 'Enrolled',
    message: 'Live dual mail dispatch to info@decodeias.com and CC dcodesudhagaran@gmail.com.',
    createdAt: new Date(Date.now() - 3600000 * 52).toISOString()
  },
  {
    id: 'DC-1784663878976-1155',
    fullName: 'Student Applicant Test',
    phone: '9840199999',
    email: 'student.applicant@example.com',
    course: 'Mains Momentum 2027',
    formType: 'enrollment',
    status: 'Contacted',
    message: 'Dual dispatch verification for primary & mentor notification accounts.',
    createdAt: new Date(Date.now() - 3600000 * 56).toISOString()
  },
  {
    id: 'DC-1784657312295-1508',
    fullName: 'Arjun Sundar',
    phone: '9840112233',
    email: 'bhuvaneshwaran2405@gmail.com',
    course: 'Mains Momentum 2027',
    formType: 'enrollment',
    status: 'Enrolled',
    message: 'Requesting a premium batch schedule briefing under Sudhagaran Sir.',
    createdAt: new Date(Date.now() - 3600000 * 64).toISOString()
  },
  {
    id: 'DC-1784655703535-9465',
    fullName: 'BUVAN',
    phone: '8825442386',
    email: 'bhuvanesh020405@gmail.com',
    course: 'Mains Momentum 2027',
    formType: 'enrollment',
    status: 'Enrolled',
    message: 'Preferred Slot: morning. Commute Mode: offline-hybrid. Prior attempt: no.',
    createdAt: new Date(Date.now() - 3600000 * 70).toISOString()
  },
  {
    id: 'DC-1784656209068-7776',
    fullName: 'Bhuvaneshwaran S',
    phone: '7402186480',
    email: 'bhuvaneshwaran2405@gmail.com',
    course: 'Mains Momentum 2027',
    formType: 'enrollment',
    status: 'Enrolled',
    message: 'Preferred Slot: morning. Commute Mode: offline-hybrid. Enrolled in test series.',
    createdAt: new Date(Date.now() - 3600000 * 75).toISOString()
  },
  {
    id: 'DC-2026-INQ013',
    fullName: 'Aravind Swamy',
    phone: '9840123456',
    email: 'aravind@example.com',
    course: 'Mains Momentum 2027',
    formType: 'contact',
    status: 'Contacted',
    message: 'Interested in joining Mains Momentum 2027 under Sudhagaran Sir. Requested complete 5-month syllabus schedule.',
    createdAt: new Date(Date.now() - 3600000 * 80).toISOString()
  },
  {
    id: 'DC-2026-INQ014',
    fullName: 'Priya Ravichandran',
    phone: '9600123456',
    email: 'priya.r@example.com',
    course: 'TNPSC Group 1, 2 & 4',
    formType: 'contact',
    status: 'New',
    message: 'Could you please share batch timings for TNPSC Group 1 weekend batches?',
    createdAt: new Date(Date.now() - 3600000 * 85).toISOString()
  },
  {
    id: 'DC-2026-INQ015',
    fullName: 'Ramesh Kannan',
    phone: '9884561230',
    email: 'ramesh.k@gmail.com',
    course: 'UPSC Prelims Conquer 2027 (GS + CSAT + Mentorship)',
    formType: 'inquiry',
    status: 'Contacted',
    message: 'Working professional inquiring about weekend mentorship schedules and CSAT video library access.',
    createdAt: new Date(Date.now() - 3600000 * 95).toISOString()
  },
  {
    id: 'DC-2026-INQ016',
    fullName: 'Harini Subramanian',
    phone: '9962145890',
    email: 'harini.subbu@gmail.com',
    course: 'Sociology Optional',
    formType: 'inquiry',
    status: 'New',
    message: 'Inquiring about Sociology optional model answer copies evaluated by top rankers.',
    createdAt: new Date(Date.now() - 3600000 * 110).toISOString()
  }
];

export function saveEnquiryToDb(input: InquiryFormInput & { formType?: 'enrollment' | 'contact' | 'registration' | 'inquiry' }): SavedInquiry {
  const currentEnquiries = getAllEnquiries();
  
  const newInquiry: SavedInquiry = {
    ...input,
    id: `DC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: 'New',
    formType: input.formType || 'contact'
  };

  const updated = [newInquiry, ...currentEnquiries];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Trigger custom event so any active admin panels can hot-reload without refresh
  window.dispatchEvent(new Event('dcode_leads_updated'));

  return newInquiry;
}

// Combined master academy roster including all historical Firestore inquiries & baseline students
export const MASTER_ACADEMY_ROSTER: SavedInquiry[] = (() => {
  const map = new Map<string, SavedInquiry>();
  for (const s of ALL_RETRIEVED_LEADS) {
    map.set(s.id, s);
  }
  for (const s of DEFAULT_ACADEMY_STUDENTS) {
    if (!map.has(s.id)) {
      map.set(s.id, s);
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
})();

export function getAllEnquiries(): SavedInquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      let previousEntries: SavedInquiry[] = [];
      const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
      if (oldRaw) {
        try {
          previousEntries = JSON.parse(oldRaw);
        } catch {
          // ignore parsing error
        }
      }
      const existingIds = new Set(MASTER_ACADEMY_ROSTER.map(s => s.id));
      const customOld = previousEntries.filter(p => !existingIds.has(p.id));
      const initial = [...MASTER_ACADEMY_ROSTER, ...customOld].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const stored: SavedInquiry[] = JSON.parse(raw);
    
    // Check if stored has the full baseline of students
    const storedIds = new Set(stored.map(s => s.id));
    const missingMaster = MASTER_ACADEMY_ROSTER.filter(d => !storedIds.has(d.id));
    if (missingMaster.length > 0) {
      const merged = [...stored, ...missingMaster].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }

    return stored;
  } catch (err) {
    console.error('Failed to read enquiries database', err);
    return MASTER_ACADEMY_ROSTER;
  }
}

export function deleteEnquiry(id: string): void {
  const current = getAllEnquiries();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('dcode_leads_updated'));
}

export function updateEnquiryStatus(id: string, status: 'New' | 'Contacted' | 'Enrolled'): void {
  const current = getAllEnquiries();
  const updated = current.map(item => {
    if (item.id === id) {
      return { ...item, status };
    }
    return item;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('dcode_leads_updated'));
}
