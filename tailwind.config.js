/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        loop: {
          red: '#f18989',       // Soft Red/Pink — warmth, community
          purple: '#8B6897',    // Muted Purple — trust, organization
          gray: '#e8e6e6',      // Light Gray — backgrounds, neutrals
          green: '#0a3200',     // Deep Dark Green — text, high contrast
          blue: '#aFD2E9',      // Light Blue — accents, highlights
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
