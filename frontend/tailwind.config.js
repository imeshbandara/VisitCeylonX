/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D5C53",     // Our new design blueprint theme variables
        secondary: "#197A6D",   
        accent: "#F2A93B",      
      }
    },
  },
  plugins: [],
}