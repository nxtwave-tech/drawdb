/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    screens: {
      "3xl": { max: "2047px" },
      "2xl": { max: "1535px" },
      xl: { min: "1024px" },
      lg: { max: "1023px" },
      md: { max: "820px" },
      sm: { max: "639px" },
    },
    extend: {},
  },
  plugins: [],
};
