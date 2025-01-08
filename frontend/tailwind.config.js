/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
        cedarville: ['Cedarville Cursive', 'cursive'],
        prata: ['Prata', 'serif'],
      },
    },
  },
  plugins: [],
};
