/** @type {import('tailwindcss').Config} */
import { defaultTheme } from "./src/themes.js"; 

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Colores existentes que no están en themes.js, mantenidos
        "dark-1": "#171717",
        "dark-2": "#1e1e1e",
        "dark-3": "#242424",
        "dark-4": "#3a3a3a",
        "dark-5": "#333",
        "dark-6": "#444",
        "light-border": "#ccc",
        success: "#10b981", // Verde para Toast
        warning: "#f59e0b", // Amarillo para Toast
        info: "#3b82f6", // Azul claro para Toast

        // Colores de themes.js
        primary: defaultTheme.primary, // #0fbcf9 (reemplaza cyan)
        background: defaultTheme.background, // #f5f5f5
        "text-primary": defaultTheme.textPrimary, // rgba(255, 255, 255, 0.87)
        "text-dark": defaultTheme.textDark, // #000
        sidebar: defaultTheme.sidebar, // #1877f2 (reemplaza blue-primary)
        "sidebar-hover": defaultTheme.sidebarHover, // #3889f3 (reemplaza blue-hover)
        error: defaultTheme.error, // red
        gray: defaultTheme.gray, // #8a8383
      },
      backgroundImage: {
        "dark-gradient": defaultTheme.darkBackground, // linear-gradient(135deg, #1e1e1e, #3a3a3a)
      },
      fontFamily: {
        inter: [
          "Inter",
          "system-ui",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontWeight: {
        normal: 400,
        semibold: 600,
        bold: 700,
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "spin-slow": "react-logo-spin 20s linear infinite",
        "slide-in": "slideIn 0.5s ease-in-out",
        pulse: "pulse 1s infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "react-logo-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulse: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.5" } },
      },
    },
  },
  darkMode: "media",
  plugins: [],
};
