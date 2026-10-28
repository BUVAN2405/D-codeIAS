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

// Initial mock data if empty
const INITIAL_RECORDS = [
  {
    id: 'DC-2026-890214',
    fullName: 'Aravind Swamy',
    phone: '9840123456',
    email: 'aravind@example.com',
    course: 'mains_momentum_2027',
    formType: 'enrollment',
    message: 'Interested in joining Mains Momentum 2027 under Sudhagaran Sir.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'Contacted'
  },
  {
    id: 'DC-2026-150293',
    fullName: 'Priya Ravichandran',
    phone: '9600123456',
    email: 'priya.r@example.com',
    course: 'tnpsc_coaching',
    formType: 'contact',
    message: 'Could you please share batch timings for TNPSC Group 1?',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'New'
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
