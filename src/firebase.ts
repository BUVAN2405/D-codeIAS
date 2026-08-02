import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDY4HchpMwX-Bv8gQcyJ7E-pvcamNCwgXE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "d-code-ias.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "d-code-ias",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "d-code-ias.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "401375610463",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:401375610463:web:8f35db9c9d77e58ba73dea",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FTL8QPXZQJ"
};

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Safe Analytics initialization (only in browser environment)
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};
