/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#26AFDE",
          dark: "#0f2742",
          teal: "#47C5B9",
        },
      },
    },
  },
  plugins: [],
};
