/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'efm-',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#163C70',
        accent: '#D4AF37',
        background: 'transparent',
        text: '#333333',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        nunito: ['"Nunito Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
