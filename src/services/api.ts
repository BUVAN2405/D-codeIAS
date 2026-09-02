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

// 2. Fetch all leads from API with Firebase Firestore fallback
export async function fetchInquiriesApi(): Promise<ApiInquiry[]> {
  try {
    const response = await fetch(API_BASE);
    if (response.ok) {
      const result = await response.json();
      return result.inquiries || [];
    }
  } catch (err) {
    console.warn('[API] Express server offline. Loading inquiries directly from Firebase Firestore.', err);
  }

  try {
    const reports = await getAllQueryReports();
    if (reports && reports.length > 0) {
      return reports.map(r => ({
        id: r.id,
        fullName: r.fullName,
        phone: r.phone,
        email: r.email || '',
        course: r.course || 'general_inquiry',
        message: r.message || '',
        status: (r.status.charAt(0).toUpperCase() + r.status.slice(1)) as any,
        createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
        formType: 'contact'
      }));
    }
  } catch (fsErr) {
    console.warn('[FIRESTORE] Reading from localStorage fallback.', fsErr);
  }

  const locals = getAllEnquiries();
  return locals.map(item => ({
    ...item,
    formType: 'contact'
  }));
}

// 3. Update Inquiry Status via API with Firestore fallback
export async function updateInquiryStatusApi(
  id: string,
  status: 'New' | 'Contacted' | 'Enrolled'
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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
      method: 'DELETE'
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
  };
}

export async function adminLoginApi(email: string, password: string): Promise<{ success: boolean; data?: AdminSession; error?: string }> {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      return { success: false, error: result.error || 'Invalid credentials' };
    }

    // Save session in localStorage
    const sessionData: AdminSession = {
      token: result.token,
      admin: result.admin
    };
    localStorage.setItem('dcode_admin_session', JSON.stringify(sessionData));
    return { success: true, data: sessionData };
  } catch (err) {
    console.warn('[ADMIN LOGIN FALLBACK] Express server offline. Checking static local fallback credentials.', err);
    // Static local fallback validation when server is offline
    if (email.toLowerCase().trim() === 'info@decodeias.com' && password === 'dCode#Admin9872!') {
      const fallbackSession: AdminSession = {
        token: `dcode_local_token_${Date.now()}`,
        admin: {
          email: 'info@decodeias.com',
          role: 'Administrator',
          loginTime: new Date().toISOString()
        }
      };
      localStorage.setItem('dcode_admin_session', JSON.stringify(fallbackSession));
      return { success: true, data: fallbackSession };
    }
    return { success: false, error: 'Invalid admin credentials.' };
  }
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem('dcode_admin_session');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function adminLogoutApi(): void {
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
    const response = await fetch('/api/admin/dashboard');
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
      enrollmentsCount: inquiries.filter(i => i.formType === 'enrollment').length,
      registrationsCount: inquiries.filter(i => i.formType === 'registration').length,
      contactsCount: inquiries.filter(i => !i.formType || i.formType === 'contact' || i.formType === 'inquiry').length,
      pendingCount: inquiries.filter(i => i.status === 'New').length,
      contactedCount: inquiries.filter(i => i.status === 'Contacted').length,
      enrolledCount: inquiries.filter(i => i.status === 'Enrolled').length,
    };
    return { stats, inquiries };
  }
}

