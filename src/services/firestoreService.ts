import {
  collection,
  addDoc,
  getDoc,
  setDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Interface matching the Firestore "query" collection document schema.
 * Note: `createdAt` is parsed into a native JS Date object when retrieved.
 */
export interface QueryReport {
  id: string;
  course: string;
  createdAt: Date;
  email: string;
  fullName: string;
  message: string;
  phone: string;
  status: string;
}

/**
 * Custom error class for Firestore operations to provide diagnostic context.
 */
export class FirestoreServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'FirestoreServiceError';
  }
}

const COLLECTION_NAME = 'query';

/**
 * Safely converts a Firestore DocumentSnapshot into a typed QueryReport.
 */
function mapDocToQueryReport(docSnap: DocumentSnapshot<DocumentData>): QueryReport {
  const data = docSnap.data();
  if (!data) {
    throw new FirestoreServiceError(`Document with ID ${docSnap.id} contains no data.`);
  }

  // Convert Firestore Timestamp to JS Date object
  let createdAt: Date;
  if (data.createdAt && typeof data.createdAt.toDate === 'function') {
    createdAt = data.createdAt.toDate();
  } else if (data.createdAt instanceof Date) {
    createdAt = data.createdAt;
  } else if (typeof data.createdAt === 'string' || typeof data.createdAt === 'number') {
    createdAt = new Date(data.createdAt);
  } else {
    createdAt = new Date();
  }

  return {
    id: docSnap.id,
    course: String(data.course ?? ''),
    createdAt,
    email: String(data.email ?? ''),
    fullName: String(data.fullName ?? ''),
    message: String(data.message ?? ''),
    phone: String(data.phone ?? ''),
    status: String(data.status ?? 'new'),
  };
}

/**
 * Schema mismatch guard & input sanitizer to prevent writing key names instead of input values.
 */
function validateAndSanitizeQueryInput(
  data: Omit<QueryReport, 'id' | 'createdAt' | 'status'>
): Omit<QueryReport, 'id' | 'createdAt' | 'status'> {
  if (!data || typeof data !== 'object') {
    throw new FirestoreServiceError('Input data passed to addQueryReport must be an object.');
  }

  const fieldsToCheck: (keyof Omit<QueryReport, 'id' | 'createdAt' | 'status'>)[] = [
    'fullName',
    'email',
    'phone',
    'course',
    'message',
  ];

  for (const field of fieldsToCheck) {
    const val = data[field];

    if (val !== undefined && val !== null && typeof val !== 'string') {
      throw new FirestoreServiceError(
        `Field '${field}' must be a string value, but received type '${typeof val}'. ` +
          `Make sure you are passing state values or e.target.value instead of event objects.`
      );
    }

    // Flag schema mismatch if field value literally equals its field key name
    if (typeof val === 'string' && val.trim().toLowerCase() === field.toLowerCase()) {
      throw new FirestoreServiceError(
        `[SCHEMA MISMATCH DETECTED] Field '${field}' has literal string value '${val}'. ` +
          `Verify that your form submit handler is binding e.target.value or form state, not e.target.name or key names.`
      );
    }
  }

  if (!data.fullName || !data.fullName.trim()) {
    throw new FirestoreServiceError("Required field 'fullName' cannot be empty.");
  }
  if (!data.phone || !data.phone.trim()) {
    throw new FirestoreServiceError("Required field 'phone' cannot be empty.");
  }

  return {
    fullName: data.fullName.trim(),
    email: data.email ? data.email.trim() : '',
    phone: data.phone.trim(),
    course: data.course ? data.course.trim() : '',
    message: data.message ? data.message.trim() : '',
  };
}

/**
 * 1. Add a new document to the "query" collection.
 * Auto-sets `createdAt` (serverTimestamp) and `status: "new"`.
 * Returns the created document ID.
 */
export async function addQueryReport(
  data: Omit<QueryReport, 'id' | 'createdAt' | 'status'>
): Promise<string> {
  try {
    const sanitized = validateAndSanitizeQueryInput(data);
    const queryColRef = collection(db, COLLECTION_NAME);

    const payload = {
      ...sanitized,
      status: 'new',
      createdAt: serverTimestamp(),
    };

    console.log('[FIRESTORE DIAGNOSTIC] Payload being sent to addDoc:', payload);

    const docRef = await addDoc(queryColRef, payload);

    return docRef.id;
  } catch (err: any) {
    console.error('[FIRESTORE RAW ERROR]', {
      code: err?.code,
      message: err?.message,
      name: err?.name,
      raw: err
    });

    if (err instanceof FirestoreServiceError) throw err;
    throw new FirestoreServiceError('Failed to add query report to Firestore.', err);
  }
}

/**
 * 2. Fetch a single document by ID from the "query" collection.
 */
export async function getQueryReportById(id: string): Promise<QueryReport | null> {
  try {
    if (!id || !id.trim()) {
      throw new FirestoreServiceError('Document ID must be a non-empty string.');
    }

    const docRef = doc(db, COLLECTION_NAME, id.trim());
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return null;
    }

    return mapDocToQueryReport(snap);
  } catch (err) {
    if (err instanceof FirestoreServiceError) throw err;
    throw new FirestoreServiceError(`Failed to fetch query report with ID '${id}'.`, err);
  }
}

/**
 * 3. Fetch all documents from the "query" collection ordered by createdAt descending.
 */
export async function getAllQueryReports(): Promise<QueryReport[]> {
  try {
    let querySnapshot;
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      querySnapshot = await getDocs(q);
    } catch (orderErr) {
      console.warn('[FIRESTORE] Ordered query fallback, fetching collection directly:', orderErr);
      querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    }

    const reports: QueryReport[] = [];
    for (const docSnap of querySnapshot.docs) {
      try {
        reports.push(mapDocToQueryReport(docSnap));
      } catch (mapErr) {
        console.warn(`[FIRESTORE] Skipping malformed document ${docSnap.id}:`, mapErr);
      }
    }

    // Sort by createdAt descending
    reports.sort((a, b) => {
      const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return timeB - timeA;
    });

    return reports;
  } catch (err) {
    if (err instanceof FirestoreServiceError) throw err;
    throw new FirestoreServiceError('Failed to fetch query reports from Firestore.', err);
  }
}

/**
 * 4. Fetch documents from the "query" collection filtered by status.
 */
export async function getQueryReportsByStatus(status: string): Promise<QueryReport[]> {
  try {
    if (!status || !status.trim()) {
      throw new FirestoreServiceError('Status filter must be a non-empty string.');
    }

    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', status.trim())
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(mapDocToQueryReport);
  } catch (err) {
    if (err instanceof FirestoreServiceError) throw err;
    throw new FirestoreServiceError(
      `Failed to fetch query reports with status '${status}'.`,
      err
    );
  }
}

/**
 * 5. Update the status field of a document in the "query" collection.
 */
export async function updateQueryReportStatus(id: string, status: string): Promise<void> {
  try {
    if (!id || !id.trim()) {
      throw new FirestoreServiceError('Document ID must be a non-empty string.');
    }
    if (!status || !status.trim()) {
      throw new FirestoreServiceError('Status value must be a non-empty string.');
    }

    const docRef = doc(db, COLLECTION_NAME, id.trim());
    await updateDoc(docRef, {
      status: status.trim(),
    });
  } catch (err) {
    if (err instanceof FirestoreServiceError) throw err;
    throw new FirestoreServiceError(
      `Failed to update status for query report '${id}'.`,
      err
    );
  }
}

/**
 * 6. Delete a query report document by ID.
 */
export async function deleteQueryReport(id: string): Promise<void> {
  try {
    if (!id || !id.trim()) {
      throw new FirestoreServiceError('Document ID must be a non-empty string.');
    }

    const docRef = doc(db, COLLECTION_NAME, id.trim());
    await deleteDoc(docRef);
  } catch (err) {
    if (err instanceof FirestoreServiceError) throw err;
    throw new FirestoreServiceError(
      `Failed to delete query report with ID '${id}'.`,
      err
    );
  }
}


/**
 * 7. Fetch theme palette from Firestore settings/palette document.
 */
export async function getPaletteFromFirestore(): Promise<any | null> {
  try {
    const docRef = doc(db, 'settings', 'palette');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data?.palette || null;
    }
  } catch (err) {
    console.warn('[FIRESTORE] Could not read settings/palette doc:', err);
  }
  return null;
}

/**
 * 8. Save theme palette to Firestore settings/palette document.
 */
export async function savePaletteToFirestore(palette: any): Promise<boolean> {
  try {
    const docRef = doc(db, 'settings', 'palette');
    await setDoc(docRef, {
      palette,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('[FIRESTORE] Could not write settings/palette doc:', err);
    return false;
  }
}
