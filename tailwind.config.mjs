import defaultTheme from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Atkinson", ...defaultTheme.fontFamily.sans],
        mono: ["\"JetBrains Mono Variable\"", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        // Theme tokens live in global.css as RGB triplets so opacity modifiers work.
        accent: "rgb(var(--accent) / <alpha-value>)",
        warn: "rgb(var(--warn) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "full",
          },
        },
      },
      animation: {
        pulse2: "pulse2 2.4s ease-in-out infinite",
        scan: "scan 6s linear infinite",
      },
      keyframes: {
        pulse2: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.35 },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
