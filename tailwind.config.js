/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1.4" }],
      sm: ["0.875rem", { lineHeight: "1.4" }],
      base: ["1rem", { lineHeight: "1.4" }],
      lg: ["1.125rem", { lineHeight: "1.4" }],
      xl: ["1.25rem", { lineHeight: "1.4" }],
      "2xl": ["1.5rem", { lineHeight: "1.4" }],
      "3xl": ["1.875rem", { lineHeight: "1.4" }],
    },
    extend: {
      screens: {
        xs: "480px",
      },
      colors: {
        primary: "hsl(244, 100%, 75%)",
        secondary: "hsl(40, 100%, 56%)",
        "dark-100": "hsl(0, 0%, 0%)",
        "dark-200": "hsl(240, 5%, 4%)",
        "dark-300": "hsl(240, 6%, 7%)",
        "dark-400": "hsl(240, 5%, 13%)",
        "light-100": "hsl(0, 0%, 100%)",
        "light-200": "hsl(0, 0%, 94%)",
        "light-300": "hsl(240, 19%, 55%)",
        "light-400": "hsl(240, 14%, 42%)",
        red: "#FF5A5A",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        heading: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-border":
          "linear-gradient(180deg, #877EFF, #685DFF 46.1458%, #3121FF)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
