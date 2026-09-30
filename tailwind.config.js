/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b0b0b',
        surface: 'rgba(15, 15, 15, 0.85)',
        'surface-card': 'rgba(18, 18, 18, 0.9)',
        gold: '#d4af37',
        'gold-bright': '#f2d06b',
        primary: '#d4af37',
        'primary-hover': '#f2d06b',
        text: '#f7f4ef',
        'text-muted': '#b3a894',
        border: 'rgba(212, 175, 55, 0.25)',
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
