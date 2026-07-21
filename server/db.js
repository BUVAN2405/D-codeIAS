import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'inquiries.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 1. Initialize Supabase Client if configured
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let supabase = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== "" && SUPABASE_ANON_KEY !== "") {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log(`\n[DATABASE] Connected to Supabase Cloud Instance: ${SUPABASE_URL}`);
  } catch (err) {
    console.error('[DATABASE] Failed to initialize Supabase client:', err);
  }
} else {
  console.log('\n[DATABASE] Supabase variables not set. Using local file database fallback: inquiries.json');
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
    id: `DC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    fullName: input.fullName,
    phone: input.phone,
    email: input.email || null,
    course: input.course || 'general_inquiry',
    formType: formType,
    message: input.message || '',
    status: 'New',
    createdAt: new Date().toISOString()
  };

  if (supabase) {
    // 1. Try single master 'inquiries' table first
    let { error } = await supabase.from('inquiries').insert([newRecord]);
    if (!error) {
      return newRecord;
    }

    // 2. If 'inquiries' table doesn't exist, fallback to separate category tables (enrollments, contacts, registrations)
    let targetTable = 'contacts';
    if (formType === 'enrollment') targetTable = 'enrollments';
    else if (formType === 'registration') targetTable = 'registrations';

    const { error: subError } = await supabase.from(targetTable).insert([newRecord]);
    if (!subError) {
      console.log(`[SUPABASE SUCCESS] Lead saved to '${targetTable}' table`);
      return newRecord;
    }

    console.error(`[SUPABASE ERROR] Could not save lead to 'inquiries' or '${targetTable}' table:`, error?.message || subError?.message);
    // Fallback: save locally
    const current = readDb();
    writeDb([newRecord, ...current]);
    return newRecord;
  } else {
    const current = readDb();
    const updated = [newRecord, ...current];
    writeDb(updated);
    return newRecord;
  }
}

export async function getAllInquiriesFromDb() {
  if (supabase) {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('createdAt', { ascending: false });
      
    if (error) {
      console.error('[SUPABASE ERROR] Failed to fetch leads from Supabase:', error);
      return readDb();
    }
    return data || [];
  } else {
    return readDb();
  }
}

export async function updateInquiryStatusInDb(id, status) {
  if (supabase) {
    const { data, error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) {
      console.error('[SUPABASE ERROR] Failed to update lead status in Supabase:', error);
      // Fallback: update locally
      return localUpdateStatus(id, status);
    }
    return data && data.length > 0 ? data[0] : null;
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
  if (supabase) {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[SUPABASE ERROR] Failed to delete lead in Supabase:', error);
      return localDelete(id);
    }
    return true;
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
