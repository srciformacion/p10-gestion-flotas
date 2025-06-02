
import type { Config } from "tailwindcss";

export default {
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
    extend: {
      colors: {
        // Colores Institucionales de La Rioja
        'rioja-green': '#76BC21',     // Verde institucional
        'rioja-blue': '#243746',      // Azul institucional
        'rioja-white': '#FFFFFF',     // Blanco institucional
        
        // Status Colors para ambulancias
        'status-pending': '#FF9800',     // Orange
        'status-assigned': '#3B82F6',    // Blue
        'status-inRoute': '#76BC21',     // Verde Rioja
        'status-completed': '#10B981',   // Green
        'status-cancelled': '#EF4444',   // Red
        
        // System colors mapping con colores de La Rioja
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: '#76BC21',  // Verde Rioja
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#243746',  // Azul Rioja
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F5F7F8',
          foreground: '#243746',
        },
        accent: {
          DEFAULT: '#E8F5D9',
          foreground: '#243746',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#243746',
        },
      },
      fontFamily: {
        sans: ['Georgia', 'Times New Roman', 'serif'],
        heading: ['Georgia', 'Times New Roman', 'serif']
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
