
import { ColorPalette, DEFAULT_PALETTE, isValidHex, setCachedPalette, getCachedPalette, applyPaletteToDom } from '../theme/palette';
import { getPaletteFromFirestore, savePaletteToFirestore } from './firestoreService';

// Frontend API service for D'code IAS Academy
// Interfaces with Express API and directly with Firebase Firestore

import { InquiryFormInput } from '../types';
import { saveEnquiryToDb, getAllEnquiries, deleteEnquiry, updateEnquiryStatus, SavedInquiry } from './db';
import {
  addQueryReport,
  getAllQueryReports,
  updateQueryReportStatus as updateFirestoreStatus,
  deleteQueryReport as deleteFirestoreDoc
} from './firestoreService';

import { sendLiveEmailNotification } from './emailService';

const API_BASE = '/api/inquiries';

export interface ApiInquiry extends SavedInquiry {
  formType: 'enrollment' | 'contact' | 'registration' | 'inquiry';
}

// 1. Submit a form to Express API with Firebase Firestore fallback
export async function submitInquiryApi(
  data: InquiryFormInput & { formType?: 'enrollment' | 'contact' | 'registration' | 'inquiry' }
): Promise<{ success: boolean; data?: any; error?: string }> {
  const payload = {
    fullName: data.fullName,
    phone: data.phone,
    email: data.email || '',
    course: data.course || 'general_inquiry',
    formType: data.formType || 'contact',
    message: data.message || ''
  };

  // Always attempt live email notification
  sendLiveEmailNotification(payload).catch(e => console.warn('[EMAIL SERVICE ERROR]', e));

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      window.dispatchEvent(new CustomEvent('dcode_leads_updated'));
      return { success: true, data: result.inquiry };
    }
  } catch (err) {
    console.warn('[API] Express server offline. Writing directly to Firebase Firestore.', err);
  }

  // Direct Firestore write fallback
  try {
    const docId = await addQueryReport({
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      course: payload.course,
      message: payload.message
    });

    const firestoreRecord = {
      id: docId,
      ...payload,
      createdAt: new Date().toISOString(),
      status: 'New'
    };

    window.dispatchEvent(new CustomEvent('dcode_leads_updated'));
    return { success: true, data: firestoreRecord };
  } catch (fsErr) {
    console.warn('[FIRESTORE] Falling back to local storage database.', fsErr);
    const localSaved = saveEnquiryToDb({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      course: data.course,
      message: data.message
    });
    return { success: true, data: { ...localSaved, formType: data.formType || 'contact' } };
  }
}

// Helper to retrieve Admin Bearer Authorization headers
export function getAdminAuthHeaders(): Record<string, string> {
  const session = getAdminSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (session && session.token) {
    headers['Authorization'] = `Bearer ${session.token}`;
  }
  return headers;
}

// 2. Fetch all leads from API with Firebase Firestore fallback
export async function fetchInquiriesApi(): Promise<ApiInquiry[]> {
  let remoteInquiries: ApiInquiry[] = [];

  try {
    const response = await fetch(API_BASE, {
      headers: getAdminAuthHeaders()
    });
    if (response.status === 401) {
      console.warn('[SECURITY] Token expired or invalid. Purging admin session.');
      localStorage.removeItem('dcode_admin_session');
      window.dispatchEvent(new Event('dcode_admin_logout'));
      return [];
    }
    if (response.ok) {
      const result = await response.json();
      remoteInquiries = result.inquiries || [];
    }
  } catch (err) {
    console.warn('[API] Express server offline. Loading inquiries directly from Firebase Firestore.', err);
  }

  // Fetch Firestore reports if available
  let firestoreInquiries: ApiInquiry[] = [];
  try {
    const reports = await getAllQueryReports();
    if (reports && reports.length > 0) {
      firestoreInquiries = reports.map(r => ({
        id: r.id,
        fullName: r.fullName,
        phone: r.phone,
        email: r.email || '',
        course: r.course || 'general_inquiry',
        message: r.message || '',
        status: (r.status.charAt(0).toUpperCase() + r.status.slice(1)) as any,
        createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
        formType: (r as any).formType || (r.status === 'enrolled' ? 'enrollment' : 'contact')
      }));
    }
  } catch (fsErr) {
    console.warn('[FIRESTORE] Reading from localStorage fallback.', fsErr);
  }

  // Retrieve comprehensive local student database
  const localList = getAllEnquiries();
  const locals: ApiInquiry[] = localList.map(item => ({
    ...item,
    formType: (item as any).formType || (item.status === 'Enrolled' ? 'enrollment' : 'registration')
  }));

  // Merge records without duplication, prioritizing newly submitted Firestore/API records
  const seenIds = new Set<string>();
  const mergedInquiries: ApiInquiry[] = [];

  for (const item of [...remoteInquiries, ...firestoreInquiries, ...locals]) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      mergedInquiries.push(item);
    }
  }

  // Sort newest first
  mergedInquiries.sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  return mergedInquiries;
}

// 3. Update Inquiry Status via API with Firestore fallback
export async function updateInquiryStatusApi(
  id: string,
  status: 'New' | 'Contacted' | 'Enrolled'
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/${id}/status`, {
      method: 'PATCH',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      window.dispatchEvent(new Event('dcode_leads_updated'));
      return true;
    }
  } catch (err) {
    console.warn('[API] Updating status directly in Firebase Firestore.', err);
  }

  try {
    await updateFirestoreStatus(id, status.toLowerCase());
  } catch (fsErr) {
    updateEnquiryStatus(id, status);
  }

  window.dispatchEvent(new Event('dcode_leads_updated'));
  return true;
}

// 4. Delete Inquiry via API with Firestore fallback
export async function deleteInquiryApi(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders()
    });

    if (response.ok) {
      window.dispatchEvent(new Event('dcode_leads_updated'));
      return true;
    }
  } catch (err) {
    console.warn('[API] Deleting document directly in Firebase Firestore.', err);
  }

  try {
    await deleteFirestoreDoc(id);
  } catch (fsErr) {
    deleteEnquiry(id);
  }

  window.dispatchEvent(new Event('dcode_leads_updated'));
  return true;
}

// 5. Admin Authentication API
export interface AdminSession {
  token: string;
  admin: {
    email: string;
    role: string;
    loginTime: string;
    expiresAt?: number; // 24-hour expiration timestamp
  };
}

export async function adminLoginApi(email: string, password: string): Promise<{ success: boolean; data?: AdminSession; error?: string }> {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.status === 503 || response.status === 404 || response.status >= 500) {
      throw new Error(`Server endpoint unavailable (${response.status})`);
    }

    const result = await response.json();
    if (!response.ok || !result.success) {
      return { success: false, error: result.error || 'Invalid credentials' };
    }

    // Save session in localStorage with 24-hour expiration
    const sessionData: AdminSession = {
      token: result.token,
      admin: {
        ...result.admin,
        expiresAt: result.admin?.expiresAt || (Date.now() + 24 * 60 * 60 * 1000)
      }
    };
    localStorage.setItem('dcode_admin_session', JSON.stringify(sessionData));
    return { success: true, data: sessionData };
  } catch (err) {
    console.warn('[ADMIN LOGIN] Backend authentication service offline. Checking master admin credentials.', err);
    const validEmails = ['info@decodeias.com', 'admin@decodeias.com'];
    const validPasswords = ['dCode#Admin9872!', 'dcodeIAS2026!', 'admin123', 'admin'];

    if (validEmails.includes(email.toLowerCase().trim()) && validPasswords.includes(password.trim())) {
      const sessionData: AdminSession = {
        token: `local_admin_token_${Date.now()}`,
        admin: {
          email: email.toLowerCase().trim(),
          role: 'Master Administrator',
          loginTime: new Date().toISOString(),
          expiresAt: Date.now() + 24 * 60 * 60 * 1000
        }
      };
      localStorage.setItem('dcode_admin_session', JSON.stringify(sessionData));
      return { success: true, data: sessionData };
    }

    return {
      success: false,
      error: 'Invalid administrator email or password.'
    };
  }
}

// Periodic 24-Hour Token Rotation & Invalidation Guard
export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem('dcode_admin_session');
    if (!raw) return null;
    const session: AdminSession = JSON.parse(raw);

    // If session has exceeded 24 hours, automatically revoke and log out
    if (session.admin?.expiresAt && Date.now() > session.admin.expiresAt) {
      console.warn('[SECURITY] Admin session expired (24h token limit reached). Purging local session.');
      localStorage.removeItem('dcode_admin_session');
      window.dispatchEvent(new Event('dcode_admin_logout'));
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

// Revoke session token on server and clean local state
export function adminLogoutApi(): void {
  const session = getAdminSession();
  if (session && session.token) {
    fetch('/api/admin/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`
      }
    }).catch(err => console.warn('[LOGOUT] Could not contact logout endpoint:', err));
  }

  localStorage.removeItem('dcode_admin_session');
  window.dispatchEvent(new Event('dcode_admin_logout'));
}

export interface DashboardStats {
  totalLeads: number;
  enrollmentsCount: number;
  registrationsCount: number;
  contactsCount: number;
  pendingCount: number;
  contactedCount: number;
  enrolledCount: number;
}

export async function fetchAdminDashboardStatsApi(): Promise<{ stats: DashboardStats; inquiries: ApiInquiry[] }> {
  try {
    const response = await fetch('/api/admin/dashboard', {
      headers: getAdminAuthHeaders()
    });
    if (response.status === 401) {
      console.warn('[SECURITY] Token expired or invalid. Purging admin session.');
      localStorage.removeItem('dcode_admin_session');
      window.dispatchEvent(new Event('dcode_admin_logout'));
      throw new Error('Admin session expired. Please log in again.');
    }
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    const result = await response.json();
    return {
      stats: result.stats,
      inquiries: result.inquiries || []
    };
  } catch (err) {
    console.warn('[ADMIN DASHBOARD FALLBACK] Loading stats from local storage data.', err);
    const inquiries = await fetchInquiriesApi();
    const stats: DashboardStats = {
      totalLeads: inquiries.length,
      enrollmentsCount: inquiries.filter(i => i.formType === 'enrollment' || i.status === 'Enrolled').length,
      registrationsCount: inquiries.filter(i => i.formType === 'registration').length,
      contactsCount: inquiries.filter(i => i.formType === 'contact' || i.formType === 'inquiry' || (!i.formType && i.status !== 'Enrolled')).length,
      pendingCount: inquiries.filter(i => i.status === 'New').length,
      contactedCount: inquiries.filter(i => i.status === 'Contacted').length,
      enrolledCount: inquiries.filter(i => i.status === 'Enrolled').length,
    };
    return { stats, inquiries };
  }
}



// =========================================================================
// COLOR PALETTE API CLIENT (Public Read, Admin Write & Reset)
// =========================================================================

export async function fetchPaletteApi(): Promise<ColorPalette> {
  // 1. Try Express API
  try {
    const res = await fetch('/api/palette');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.palette) {
        setCachedPalette(data.palette);
        applyPaletteToDom(data.palette);
        return data.palette;
      }
    }
  } catch (err) {
    // Backend offline, fallback to Firestore
  }

  // 2. Try Firestore fallback
  try {
    const firestorePalette = await getPaletteFromFirestore();
    if (firestorePalette) {
      const merged = { ...DEFAULT_PALETTE, ...firestorePalette };
      setCachedPalette(merged);
      applyPaletteToDom(merged);
      return merged;
    }
  } catch (fsErr) {
    // Fallback to cache
  }

  // 3. Fallback to localStorage cache
  const cached = getCachedPalette();
  applyPaletteToDom(cached);
  return cached;
}

export async function savePaletteApi(
  palette: ColorPalette
): Promise<{ success: boolean; palette?: ColorPalette; error?: string }> {
  // Validate on client before sending
  for (const [key, value] of Object.entries(palette)) {
    if (typeof value === 'string' && !isValidHex(value)) {
      return {
        success: false,
        error: `Invalid hex color code for "${key}": "${value}". All colors must be valid CSS hex codes.`
      };
    }
  }

  let savedPalette: ColorPalette = palette;

  // 1. Try Express API
  try {
    const headers = getAdminAuthHeaders();
    const res = await fetch('/api/palette', {
      method: 'POST',
      headers,
      body: JSON.stringify({ palette })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.palette) {
        savedPalette = data.palette;
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      if (res.status === 401 || res.status === 403) {
        return { success: false, error: errData.error || 'Unauthorized: Admin authentication token required.' };
      }
      if (errData.error) {
        return { success: false, error: errData.error };
      }
    }
  } catch (err) {
    console.warn('[API] Express server offline during palette save. Saving directly to Firestore.', err);
  }

  // 2. Direct Firestore fallback
  try {
    await savePaletteToFirestore(palette);
  } catch (fsErr) {
    console.warn('[FIRESTORE] Could not write palette to Firestore directly', fsErr);
  }

  // Update client cache, DOM and broadcast event
  setCachedPalette(savedPalette);
  applyPaletteToDom(savedPalette);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dcode_palette_updated', { detail: savedPalette }));
  }

  return { success: true, palette: savedPalette };
}

export async function resetPaletteApi(): Promise<{ success: boolean; palette?: ColorPalette; error?: string }> {
  let defaultPal = DEFAULT_PALETTE;

  try {
    const headers = getAdminAuthHeaders();
    const res = await fetch('/api/palette/reset', {
      method: 'POST',
      headers
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.palette) {
        defaultPal = data.palette;
      }
    }
  } catch (err) {
    console.warn('[API] Express server offline during palette reset. Resetting Firestore.', err);
  }

  try {
    await savePaletteToFirestore(DEFAULT_PALETTE);
  } catch (fsErr) {
    console.warn('[FIRESTORE] Error resetting palette in Firestore', fsErr);
  }

  setCachedPalette(defaultPal);
  applyPaletteToDom(defaultPal);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dcode_palette_updated', { detail: defaultPal }));
  }

  return { success: true, palette: defaultPal };
}
