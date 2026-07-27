import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // The five-token Ledger scale — no other display sizes allowed
        display: [
          "clamp(3.5rem, 0.5rem + 12vw, 13.5rem)",
          { lineHeight: "0.9", letterSpacing: "-0.02em" },
        ],
        title: [
          "clamp(2rem, 1.35rem + 3.1vw, 4.25rem)",
          { lineHeight: "1.05", letterSpacing: "-0.01em" },
        ],
        statement: [
          "clamp(1.5rem, 1.23rem + 1.35vw, 2.5rem)",
          { lineHeight: "1.3" },
        ],
        body: ["clamp(1rem, 0.96rem + 0.2vw, 1.125rem)", { lineHeight: "1.65" }],
        meta: ["0.75rem", { lineHeight: "1", letterSpacing: "0.22em" }],
      },
      spacing: {
        section: "clamp(5rem, 3rem + 8vw, 10rem)",
      },
      maxWidth: {
        content: "84rem",
      },
      colors: {
        brand: {
          // RGB-triplet CSS vars so the day-cycle can tween the whole
          // palette at runtime while opacity modifiers keep working
          paper: "rgb(var(--brand-paper) / <alpha-value>)",
          ink: "rgb(var(--brand-ink) / <alpha-value>)",
          accent: "#ff3b00",
          gray: "rgb(var(--brand-gray) / <alpha-value>)",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
