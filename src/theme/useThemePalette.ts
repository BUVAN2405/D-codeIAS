import { useState, useEffect } from 'react';
import {
  ColorPalette,
  DEFAULT_PALETTE,
  getCachedPalette,
  applyPaletteToDom
} from './palette';
import { fetchPaletteApi } from '../services/api';

/**
 * Custom React hook to initialize, apply, and sync the global theme color palette.
 * - Applies cached palette from localStorage immediately on start (zero flash).
 * - Fetches latest palette from backend / Firestore asynchronously.
 * - Listens for local and cross-tab update events.
 */
export function useThemePalette() {
  const [palette, setPalette] = useState<ColorPalette>(getCachedPalette);

  useEffect(() => {
    // 1. Apply cached palette immediately on mount
    const cached = getCachedPalette();
    applyPaletteToDom(cached);
    setPalette(cached);

    // 2. Fetch remote palette from server/Firestore to sync any updates
    let isMounted = true;
    fetchPaletteApi()
      .then((remotePalette) => {
        if (isMounted && remotePalette) {
          applyPaletteToDom(remotePalette);
          setPalette(remotePalette);
        }
      })
      .catch((err) => {
        console.warn('[THEME] Could not fetch remote palette, staying with cached:', err);
      });

    // 3. Listen to local custom event broadcasted by admin updates
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ColorPalette>;
      if (customEvent.detail) {
        applyPaletteToDom(customEvent.detail);
        setPalette(customEvent.detail);
      } else {
        const fresh = getCachedPalette();
        applyPaletteToDom(fresh);
        setPalette(fresh);
      }
    };

    // 4. Listen to cross-tab changes via StorageEvent
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dcode_theme_palette_v1') {
        const fresh = getCachedPalette();
        applyPaletteToDom(fresh);
        setPalette(fresh);
      }
    };

    window.addEventListener('dcode_palette_updated', handleLocalUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      window.removeEventListener('dcode_palette_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { palette, setPalette };
}
