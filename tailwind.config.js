/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        mainColor: "#0284c7",
        primary: "#0c4a6e",
        secondary: "#075985",
        "light-grey": "#F2F2F2",
        "text-color": "#333333",
        "button-color": "#006633",
        "error-color": "#FF6666",
        "warning-color": "#FFCC33",
      },
      fontSize: {
        14: "14px",
        18: "18px",
        24: "24px",
        32: "32px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },

      animation: {
        "text-animation": "text-animation 2s infinite",
      },
      keyframes: {
        "text-animation": {
          "0%": { color: "blue" },
          "50%": { color: "red" },
          "100%": { color: "blue" },
        },
      },
    },
  },
  daisyui: {
    themes: ["light"],
  },
  plugins: [require("daisyui")],
};
