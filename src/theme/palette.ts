// Source of Truth for Website Theme & Color Palette

export interface ColorPalette {
  // Brand
  primary: string;
  secondary: string;
  tertiary: string;

  // Layout & Surfaces
  background: string;
  surface: string;
  border: string;

  // Typography
  textHeading: string;
  textBody: string;
  textMuted: string;
  textLink: string;

  // Buttons
  btnPrimaryBg: string;
  btnPrimaryText: string;
  btnPrimaryHover: string;

  btnSecondaryBg: string;
  btnSecondaryText: string;
  btnSecondaryHover: string;

  btnSpecialBg: string;
  btnSpecialText: string;
  btnSpecialHover: string;

  // Header & Footer
  navbarBg: string;
  navbarText: string;
  footerBg: string;
  footerText: string;

  // Feedback States
  success: string;
  warning: string;
  danger: string;
}

export const PALETTE_STORAGE_KEY = 'dcode_theme_palette_v1';

// Default values reflecting D'code IAS Academy's brand identity
export const DEFAULT_PALETTE: ColorPalette = {
  // Brand
  primary: '#D31218',          // D'code Crimson
  secondary: '#0D2C54',        // Deep Oxford Navy
  tertiary: '#F59E0B',         // Warm Amber / Gold

  // Surfaces
  background: '#F8FAFC',       // Slate 50 soft background
  surface: '#FFFFFF',          // Pure White Card Surface
  border: '#E2E8F0',           // Slate 200 Subtle Border

  // Typography
  textHeading: '#0D2C54',      // Deep Navy Heading
  textBody: '#334155',         // Slate 700 Body text
  textMuted: '#64748B',        // Slate 500 Muted text
  textLink: '#D31218',         // Crimson Link

  // Primary Button
  btnPrimaryBg: '#D31218',
  btnPrimaryText: '#FFFFFF',
  btnPrimaryHover: '#B91C1C',

  // Secondary Button
  btnSecondaryBg: '#0D2C54',
  btnSecondaryText: '#FFFFFF',
  btnSecondaryHover: '#1E3A8A',

  // Special Button (Spotlight / Conquer '27)
  btnSpecialBg: '#F59E0B',
  btnSpecialText: '#FFFFFF',
  btnSpecialHover: '#D97706',

  // Navbar
  navbarBg: '#0D2C54',
  navbarText: '#FFFFFF',

  // Footer
  footerBg: '#081B34',
  footerText: '#E2E8F0',

  // Feedback
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444'
};

// CSS variable names mapped to palette keys
export const PALETTE_VAR_MAP: Record<keyof ColorPalette, string> = {
  primary: '--primary',
  secondary: '--secondary',
  tertiary: '--tertiary',
  background: '--background',
  surface: '--surface',
  border: '--border',
  textHeading: '--text-heading',
  textBody: '--text-body',
  textMuted: '--text-muted',
  textLink: '--text-link',
  btnPrimaryBg: '--btn-primary-bg',
  btnPrimaryText: '--btn-primary-text',
  btnPrimaryHover: '--btn-primary-hover',
  btnSecondaryBg: '--btn-secondary-bg',
  btnSecondaryText: '--btn-secondary-text',
  btnSecondaryHover: '--btn-secondary-hover',
  btnSpecialBg: '--btn-special-bg',
  btnSpecialText: '--btn-special-text',
  btnSpecialHover: '--btn-special-hover',
  navbarBg: '--navbar-bg',
  navbarText: '--navbar-text',
  footerBg: '--footer-bg',
  footerText: '--footer-text',
  success: '--success',
  warning: '--warning',
  danger: '--danger'
};

export interface ColorFieldMeta {
  key: keyof ColorPalette;
  label: string;
  description: string;
  group: 'brand' | 'surfaces' | 'typography' | 'buttons' | 'headerFooter' | 'feedback';
}

export const COLOR_FIELDS_METADATA: ColorFieldMeta[] = [
  // Brand
  { key: 'primary', label: 'Primary Brand Color', description: 'Used for flagship branding, active highlights, and badges', group: 'brand' },
  { key: 'secondary', label: 'Secondary Brand Color', description: 'Deep accent tone used for authority accents and bars', group: 'brand' },
  { key: 'tertiary', label: 'Tertiary Accent', description: 'Warm highlight color used for badges and stars', group: 'brand' },

  // Layout & Surfaces
  { key: 'background', label: 'Page Background', description: 'Global main page background color behind content sections', group: 'surfaces' },
  { key: 'surface', label: 'Card Surface', description: 'Background of program cards, modals, tables, and containers', group: 'surfaces' },
  { key: 'border', label: 'Card & Divider Border', description: 'Subtle borders and separators between sections', group: 'surfaces' },

  // Typography
  { key: 'textHeading', label: 'Heading Text', description: 'Section headers, card titles, and bold typography', group: 'typography' },
  { key: 'textBody', label: 'Body Text', description: 'Readable copy, paragraphs, and informational text', group: 'typography' },
  { key: 'textMuted', label: 'Muted Text', description: 'Secondary captions, timestamps, dates, and placeholders', group: 'typography' },
  { key: 'textLink', label: 'Link & Interactive Text', description: 'Actionable link text, breadcrumbs, and tags', group: 'typography' },

  // Buttons - Primary
  { key: 'btnPrimaryBg', label: 'Primary Button Background', description: 'Main CTA buttons such as "Inquire Now" and "Submit"', group: 'buttons' },
  { key: 'btnPrimaryText', label: 'Primary Button Text', description: 'Text label color on primary buttons', group: 'buttons' },
  { key: 'btnPrimaryHover', label: 'Primary Button Hover', description: 'Background color when mouse hovers over primary button', group: 'buttons' },

  // Buttons - Secondary
  { key: 'btnSecondaryBg', label: 'Secondary Button Background', description: 'Secondary action buttons and dark navigation controls', group: 'buttons' },
  { key: 'btnSecondaryText', label: 'Secondary Button Text', description: 'Text label color on secondary buttons', group: 'buttons' },
  { key: 'btnSecondaryHover', label: 'Secondary Button Hover', description: 'Hover background on secondary buttons', group: 'buttons' },

  // Buttons - Special
  { key: 'btnSpecialBg', label: 'Special Button Background', description: 'Spotlight button (e.g. "Prelims Conquer 2027")', group: 'buttons' },
  { key: 'btnSpecialText', label: 'Special Button Text', description: 'Text color on special spotlight button', group: 'buttons' },
  { key: 'btnSpecialHover', label: 'Special Button Hover', description: 'Hover state for special spotlight button', group: 'buttons' },

  // Header & Footer
  { key: 'navbarBg', label: 'Navbar Background', description: 'Top fixed header menu background', group: 'headerFooter' },
  { key: 'navbarText', label: 'Navbar Text & Links', description: 'Navigation links and icons inside top navbar', group: 'headerFooter' },
  { key: 'footerBg', label: 'Footer Background', description: 'Deep bottom footer section background', group: 'headerFooter' },
  { key: 'footerText', label: 'Footer Text & Links', description: 'Directory labels and disclaimer text inside footer', group: 'headerFooter' },

  // Feedback States
  { key: 'success', label: 'Success State', description: 'Successful enrollment, submitted confirmations, and alerts', group: 'feedback' },
  { key: 'warning', label: 'Warning State', description: 'Urgent notices, limited seat badges, and reminders', group: 'feedback' },
  { key: 'danger', label: 'Danger / Error State', description: 'Form validation errors, offline flags, and closed batch markers', group: 'feedback' }
];

/**
 * Validates whether a given string is a valid 3- or 6-digit CSS hex color.
 */
export function isValidHex(hex: string): boolean {
  if (!hex || typeof hex !== 'string') return false;
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim());
}

/**
 * Normalizes a hex string to standard 6-digit uppercase format with '#' prefix.
 */
export function normalizeHex(hex: string): string {
  if (!hex) return '#000000';
  let cleaned = hex.trim().replace(/^#/, '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  return '#' + cleaned.toUpperCase();
}

/**
 * Converts a hex color into space-delimited RGB channels "R G B".
 * Example: "#D31218" -> "211 18 24"
 */
export function hexToRgbChannels(hex: string): string {
  const norm = normalizeHex(hex).replace('#', '');
  const num = parseInt(norm, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
}

/**
 * Applies a palette object directly to document.documentElement CSS variables.
 * Sets direct HEX colors, Tailwind semantic color variables, and RGB channel representations.
 */
export function applyPaletteToDom(palette: Partial<ColorPalette>): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  for (const [key, varName] of Object.entries(PALETTE_VAR_MAP)) {
    const hexVal = palette[key as keyof ColorPalette];
    if (hexVal && isValidHex(hexVal)) {
      const normalized = normalizeHex(hexVal);
      const rgbChannels = hexToRgbChannels(hexVal);
      const cleanKey = varName.replace(/^--/, '');

      // 1. Direct color value (e.g. #D31218) for var(--primary) and var(--color-primary)
      root.style.setProperty(varName, normalized);
      root.style.setProperty(`--color-${cleanKey}`, normalized);
      root.style.setProperty(`--color-${key}`, normalized);

      // 2. Space-delimited RGB channel format (e.g. "211 18 24")
      root.style.setProperty(`${varName}-rgb`, rgbChannels);
      root.style.setProperty(`--${key}-rgb`, rgbChannels);
    }
  }
}

/**
 * Reads cached palette from localStorage, falling back to DEFAULT_PALETTE.
 */
export function getCachedPalette(): ColorPalette {
  if (typeof window === 'undefined') return DEFAULT_PALETTE;
  try {
    const raw = localStorage.getItem(PALETTE_STORAGE_KEY);
    if (!raw) return DEFAULT_PALETTE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PALETTE, ...parsed };
  } catch {
    return DEFAULT_PALETTE;
  }
}

/**
 * Caches a palette in localStorage.
 */
export function setCachedPalette(palette: ColorPalette): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PALETTE_STORAGE_KEY, JSON.stringify(palette));
  } catch (err) {
    console.warn('[THEME] Could not write palette to localStorage', err);
  }
}

