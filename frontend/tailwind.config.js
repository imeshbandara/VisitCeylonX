/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F766E",      // Teal
        secondary: "#14B8A6",    
        accent: "#F59E0B",      // Amber
        background: "#F8FAFC",
        textPrimary: "#1E293B",
        textSecondary: "#64748B",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1rem',
        'xl': '0.75rem',
      }
    },
  },
  plugins: [],
}