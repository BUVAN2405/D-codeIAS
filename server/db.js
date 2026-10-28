import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.FIREBASE_CONFIG ? path.join('/tmp', 'data') : path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'inquiries.json');
const PALETTE_FILE = path.join(DATA_DIR, 'palette.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('[DATABASE] Could not create local data directory:', err.message);
}

// 1. Initialize Firebase App for Server DB Service
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDY4HchpMwX-Bv8gQcyJ7E-pvcamNCwgXE",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "d-code-ias.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "d-code-ias",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "d-code-ias.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "401375610463",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:401375610463:web:8f35db9c9d77e58ba73dea"
};

let firestore = null;
try {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  firestore = getFirestore(app);
  console.log(`\n[DATABASE] Connected to Firebase Firestore Project: ${firebaseConfig.projectId}`);
} catch (err) {
  console.error('[DATABASE] Failed to initialize Firebase Firestore:', err.message);
}

// Master baseline records of active enrolled students, registered candidates, and direct inquiries
const INITIAL_RECORDS = [
  // 1. Confirmed Enrolled Students (Current Batches)
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

  // 2. Registered Students (Orientation & Batch Reservations)
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

  // 3. Prospective Inquiries & Lead Inquiries
  {
    id: 'DC-2026-INQ013',
    fullName: 'Aravind Swamy',
    phone: '9840123456',
    email: 'aravind@example.com',
    course: 'Mains Momentum 2027',
    formType: 'contact',
    status: 'Contacted',
    message: 'Interested in joining Mains Momentum 2027 under Sudhagaran Sir. Requested complete 5-month syllabus schedule.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
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
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString()
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
    createdAt: new Date(Date.now() - 3600000 * 84).toISOString()
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
    createdAt: new Date(Date.now() - 3600000 * 112).toISOString()
  }
];

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDb(INITIAL_RECORDS);
      return INITIAL_RECORDS;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file, using fallback records:', err);
    return INITIAL_RECORDS;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}

// 2. Database Action Helpers (Async)
export async function saveInquiryToDb(input) {
  const formType = input.formType || 'contact';
  const newRecord = {
    fullName: input.fullName,
    phone: input.phone,
    email: input.email || null,
    course: input.course || 'general_inquiry',
    formType: formType,
    message: input.message || '',
    status: 'new',
  };

  if (firestore) {
    try {
      const docRef = await addDoc(collection(firestore, 'query'), {
        ...newRecord,
        createdAt: serverTimestamp()
      });
      console.log(`[FIREBASE SUCCESS] Lead saved to Firestore 'query' collection with ID: ${docRef.id}`);
      return {
        id: docRef.id,
        ...newRecord,
        createdAt: new Date().toISOString()
      };
    } catch (err) {
      console.error(`[FIREBASE ERROR] Could not save lead to Firestore:`, err.message);
      // Fallback: save locally
      const localId = `DC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const fallbackRecord = { id: localId, ...newRecord, createdAt: new Date().toISOString() };
      const current = readDb();
      writeDb([fallbackRecord, ...current]);
      return fallbackRecord;
    }
  } else {
    const localId = `DC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fallbackRecord = { id: localId, ...newRecord, createdAt: new Date().toISOString() };
    const current = readDb();
    writeDb([fallbackRecord, ...current]);
    return fallbackRecord;
  }
}

export async function getAllInquiriesFromDb() {
  if (firestore) {
    try {
      const q = query(collection(firestore, 'query'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        let createdAtStr = new Date().toISOString();
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
          createdAtStr = data.createdAt.toDate().toISOString();
        } else if (data.createdAt) {
          createdAtStr = new Date(data.createdAt).toISOString();
        }
        return {
          id: docSnap.id,
          fullName: data.fullName || '',
          phone: data.phone || '',
          email: data.email || null,
          course: data.course || '',
          formType: data.formType || 'contact',
          message: data.message || '',
          status: data.status || 'new',
          createdAt: createdAtStr
        };
      });
    } catch (err) {
      console.error('[FIREBASE ERROR] Failed to fetch leads from Firestore:', err.message);
      return readDb();
    }
  } else {
    return readDb();
  }
}

export async function updateInquiryStatusInDb(id, status) {
  if (firestore) {
    try {
      const docRef = doc(firestore, 'query', id);
      await updateDoc(docRef, { status });
      return { id, status };
    } catch (err) {
      console.error('[FIREBASE ERROR] Failed to update lead status in Firestore:', err.message);
      return localUpdateStatus(id, status);
    }
  } else {
    return localUpdateStatus(id, status);
  }
}

function localUpdateStatus(id, status) {
  const current = readDb();
  let updatedRecord = null;

  const updated = current.map(item => {
    if (item.id === id) {
      updatedRecord = { ...item, status };
      return updatedRecord;
    }
    return item;
  });

  if (updatedRecord) {
    writeDb(updated);
  }
  return updatedRecord;
}

export async function deleteInquiryFromDb(id) {
  if (firestore) {
    try {
      const docRef = doc(firestore, 'query', id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error('[FIREBASE ERROR] Failed to delete lead in Firestore:', err.message);
      return localDelete(id);
    }
  } else {
    return localDelete(id);
  }
}

function localDelete(id) {
  const current = readDb();
  const initialLength = current.length;
  const filtered = current.filter(item => item.id !== id);

  if (filtered.length < initialLength) {
    writeDb(filtered);
    return true;
  }
  return false;
}


// =========================================================================
// COLOR PALETTE SYSTEM SERVICE
// =========================================================================

export const SERVER_DEFAULT_PALETTE = {
  primary: '#D31218',
  secondary: '#0D2C54',
  tertiary: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textHeading: '#0D2C54',
  textBody: '#334155',
  textMuted: '#64748B',
  textLink: '#D31218',
  btnPrimaryBg: '#D31218',
  btnPrimaryText: '#FFFFFF',
  btnPrimaryHover: '#B91C1C',
  btnSecondaryBg: '#0D2C54',
  btnSecondaryText: '#FFFFFF',
  btnSecondaryHover: '#1E3A8A',
  btnSpecialBg: '#F59E0B',
  btnSpecialText: '#FFFFFF',
  btnSpecialHover: '#D97706',
  navbarBg: '#0D2C54',
  navbarText: '#FFFFFF',
  footerBg: '#081B34',
  footerText: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444'
};

export async function getPaletteFromDb() {
  if (firestore) {
    try {
      const docRef = doc(firestore, 'settings', 'palette');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.palette) {
          return { ...SERVER_DEFAULT_PALETTE, ...data.palette };
        }
      }
    } catch (err) {
      console.warn('[FIRESTORE] Error reading palette:', err.message);
    }
  }

  try {
    if (fs.existsSync(PALETTE_FILE)) {
      const raw = fs.readFileSync(PALETTE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      return { ...SERVER_DEFAULT_PALETTE, ...parsed };
    }
  } catch (err) {
    console.warn('[DATABASE] Error reading local palette file:', err.message);
  }

  return SERVER_DEFAULT_PALETTE;
}

export async function savePaletteToDb(palette) {
  const merged = { ...SERVER_DEFAULT_PALETTE, ...palette };

  if (firestore) {
    try {
      const docRef = doc(firestore, 'settings', 'palette');
      await setDoc(docRef, {
        palette: merged,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error('[FIRESTORE] Error saving palette:', err.message);
    }
  }

  try {
    fs.writeFileSync(PALETTE_FILE, JSON.stringify(merged, null, 2), 'utf8');
  } catch (err) {
    console.warn('[DATABASE] Error saving local palette file:', err.message);
  }

  return merged;
}

export async function resetPaletteInDb() {
  return savePaletteToDb(SERVER_DEFAULT_PALETTE);
}
