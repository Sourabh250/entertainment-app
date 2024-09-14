/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'red-custom': '#FC4747',
        'gray-dark': '#10141E',
        'gray-light': '#5A698F',
        'gray-mid': '#161D2F',
        'white': '#FFFFFF',
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}