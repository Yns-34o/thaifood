/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        dm: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        th: {
          50: '#eef7ee', 100: '#d5ecd5', 200: '#aed9ae', 300: '#7bbe7b',
          400: '#4ea34e', 500: '#2B6E2B', 600: '#235823', 700: '#1D491D',
          800: '#173A17', 900: '#112B11', 950: '#0A1C0A',
        },
        gold: {
          50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047',
          400: '#c9a96e', 500: '#b8943e', 600: '#a17f2f', 700: '#856824',
          800: '#6d5320', 900: '#5a441c',
        },
        cream: {
          50: '#fefdf8', 100: '#fdf9ed', 200: '#faf0d5', 300: '#f5e5b8',
        },
      },
    },
  },
  plugins: [],
};
