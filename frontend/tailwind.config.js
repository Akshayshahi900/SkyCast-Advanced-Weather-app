/** @type {import('tailwindcss').Config} */
export default {
  darkMode:'class' , //Enables the dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGray: 'rgb(236, 242, 244)', // First color
        customWhite: '#ffffff', // Second color
      },
    },
  },
  plugins: [],
}
