/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Typekit: Trajan Pro 3 (títulos) + Archivo (body)
        serif: ["trajan-pro-3", "Georgia", "serif"],
        sans: ["archivo", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      colors: {
        // Fondo y texto principal
        page: "#FFFEFC",
        ink: "#231F20",
        // Acentos (botones, etiquetas)
        gold: {
          DEFAULT: "#C9A96E",
          light: "#DFC898",
          dark: "#A07F4A",
        },
      },
      spacing: {
        "hero": "100vh",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
