/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F0FE',
          100: '#C5D9FD',
          200: '#94B8FB',
          300: '#5C91F9',
          400: '#3270F7',
          500: '#1A73E8',
          600: '#185ABC',
          700: '#134694',
          800: '#0E336C',
          900: '#092147',
        },
        sidebar: '#0F172A',
        card: '#FFFFFF',
        textPrimary: '#202124',
        appBg: '#F8F9FA',
        'apple-bg': '#F5F5F7',
        'apple-card': '#FFFFFF',
        'apple-text-primary': '#1D1D1F',
        'apple-text-secondary': '#86868B',
        'apple-text-muted': '#A1A1A6',
        'apple-divider': '#E5E5EA',
        'apple-blue': '#0066CC',
        'apple-blue-active': '#0055AB',
        'apple-hover-bg': '#F5F5F7',
        'apple-status-green': '#34C759',
        'apple-status-red': '#FF3B30',
      },
      borderRadius: {
        'apple-card': '20px',
        'apple-sm': '12px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'apple': '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'apple-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'stripe': '0 2px 5px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.04)',
        'apple-card': '0 4px 24px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}
