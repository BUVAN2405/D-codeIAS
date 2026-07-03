// Local database storage for D'code IAS Academy lead inquiries
import { InquiryFormInput } from '../types';

export interface SavedInquiry extends InquiryFormInput {
  id: string;
  createdAt: string;
  status: 'New' | 'Contacted' | 'Enrolled';
}

const STORAGE_KEY = 'dcode_ias_academy_enquiries';

export function saveEnquiryToDb(input: InquiryFormInput): SavedInquiry {
  const currentEnquiries = getAllEnquiries();
  
  const newInquiry: SavedInquiry = {
    ...input,
    id: `DC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: 'New'
  };

  const updated = [newInquiry, ...currentEnquiries];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Trigger custom event so any active admin panels can hot-reload without refresh
  window.dispatchEvent(new Event('dcode_leads_updated'));

  return newInquiry;
}

export function getAllEnquiries(): SavedInquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialMockEnquiries();
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read enquiries database', err);
    return [];
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

function getInitialMockEnquiries(): SavedInquiry[] {
  return [
    {
      id: 'DC-2026-890214',
      fullName: 'Aravind Swamy',
      phone: '9840123456',
      email: 'aravind@example.com',
      course: 'mains_momentum_2027',
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
      message: 'Could you please share batch timings for TNPSC Group 1?',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      status: 'New'
    }
  ];
}
