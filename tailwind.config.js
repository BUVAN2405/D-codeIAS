/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        tertiary: 'rgb(var(--tertiary) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        'text-heading': 'rgb(var(--text-heading) / <alpha-value>)',
        'text-body': 'rgb(var(--text-body) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',
        'text-link': 'rgb(var(--text-link) / <alpha-value>)',
        'btn-primary-bg': 'rgb(var(--btn-primary-bg) / <alpha-value>)',
        'btn-primary-text': 'rgb(var(--btn-primary-text) / <alpha-value>)',
        'btn-primary-hover': 'rgb(var(--btn-primary-hover) / <alpha-value>)',
        'btn-secondary-bg': 'rgb(var(--btn-secondary-bg) / <alpha-value>)',
        'btn-secondary-text': 'rgb(var(--btn-secondary-text) / <alpha-value>)',
        'btn-secondary-hover': 'rgb(var(--btn-secondary-hover) / <alpha-value>)',
        'btn-special-bg': 'rgb(var(--btn-special-bg) / <alpha-value>)',
        'btn-special-text': 'rgb(var(--btn-special-text) / <alpha-value>)',
        'btn-special-hover': 'rgb(var(--btn-special-hover) / <alpha-value>)',
        'navbar-bg': 'rgb(var(--navbar-bg) / <alpha-value>)',
        'navbar-text': 'rgb(var(--navbar-text) / <alpha-value>)',
        'footer-bg': 'rgb(var(--footer-bg) / <alpha-value>)',
        'footer-text': 'rgb(var(--footer-text) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
      }
    }
  }
};
