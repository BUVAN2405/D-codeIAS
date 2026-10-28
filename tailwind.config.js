/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        tertiary: 'var(--color-tertiary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        'text-heading': 'var(--color-text-heading)',
        'text-body': 'var(--color-text-body)',
        'text-muted': 'var(--color-text-muted)',
        'text-link': 'var(--color-text-link)',
        'btn-primary-bg': 'var(--color-btn-primary-bg)',
        'btn-primary-text': 'var(--color-btn-primary-text)',
        'btn-primary-hover': 'var(--color-btn-primary-hover)',
        'btn-secondary-bg': 'var(--color-btn-secondary-bg)',
        'btn-secondary-text': 'var(--color-btn-secondary-text)',
        'btn-secondary-hover': 'var(--color-btn-secondary-hover)',
        'btn-special-bg': 'var(--color-btn-special-bg)',
        'btn-special-text': 'var(--color-btn-special-text)',
        'btn-special-hover': 'var(--color-btn-special-hover)',
        'navbar-bg': 'var(--color-navbar-bg)',
        'navbar-text': 'var(--color-navbar-text)',
        'footer-bg': 'var(--color-footer-bg)',
        'footer-text': 'var(--color-footer-text)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
      }
    }
  }
};

