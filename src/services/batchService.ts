import { BatchSchedule } from '../types';

export const INITIAL_BATCHES: BatchSchedule[] = [
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

const STORAGE_KEY = 'dcode_batches_store_v1';

export function getStoredBatches(): BatchSchedule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BATCHES));
      return INITIAL_BATCHES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_BATCHES;
  } catch (err) {
    console.warn('[BATCH SERVICE] Error reading stored batches, falling back to initial', err);
    return INITIAL_BATCHES;
  }
}

export function saveStoredBatch(batch: BatchSchedule): BatchSchedule[] {
  const current = getStoredBatches();
  const index = current.findIndex(b => b.id === batch.id);
  let updated: BatchSchedule[];

  if (index >= 0) {
    // Update existing
    updated = [...current];
    updated[index] = { ...batch };
  } else {
    // Create new
    const newBatch: BatchSchedule = {
      ...batch,
      id: batch.id || `batch_${Date.now()}`
    };
    updated = [newBatch, ...current];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dcode_batches_updated', { detail: updated }));
  } catch (err) {
    console.error('[BATCH SERVICE] Error writing batches to storage', err);
  }

  return updated;
}

export function deleteStoredBatch(id: string): BatchSchedule[] {
  const current = getStoredBatches();
  const updated = current.filter(b => b.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dcode_batches_updated', { detail: updated }));
  } catch (err) {
    console.error('[BATCH SERVICE] Error deleting batch', err);
  }

  return updated;
}

export function resetStoredBatches(): BatchSchedule[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BATCHES));
    window.dispatchEvent(new CustomEvent('dcode_batches_updated', { detail: INITIAL_BATCHES }));
  } catch (err) {
    console.error('[BATCH SERVICE] Error resetting batches', err);
  }
  return INITIAL_BATCHES;
}
