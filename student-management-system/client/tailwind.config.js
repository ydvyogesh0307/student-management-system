/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        canvas: "#F2F4F6",
        ink: "#16202A",
        muted: "#5B6773",
        line: "#DCE2E8",
        accent: { DEFAULT: "#0E7C6B", dark: "#0A5F52", soft: "#E3F3F0" },
        danger: { DEFAULT: "#B42318", soft: "#FDECEA" },
      },
    },
  },
  plugins: [],
};
