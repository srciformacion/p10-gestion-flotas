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
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          blue: {
            light: '#1E88E5',   // Azul claro
            DEFAULT: '#1976D2',  // Azul principal
            dark: '#0D47A1'      // Azul oscuro
          }
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          purple: {
            light: '#7E57C2',   // Púrpura claro
            DEFAULT: '#5E35B1',  // Púrpura principal
            dark: '#3F3D56'      // Púrpura oscuro
          }
        },
        medical: {
          blue: {
            light: '#33C3F0',   // Azul médico claro
            DEFAULT: '#1B6DC1',  // Azul médico principal
            dark: '#0A4F7E'      // Azul médico oscuro
          },
          gray: {
            light: '#8E9196',   // Gris claro
            DEFAULT: '#403E43',  // Gris principal
            dark: '#221F26'      // Gris oscuro
          }
        },
        status: {
          pending: '#FFC107',    // Amarillo
          assigned: '#FF9800',   // Naranja
          inRoute: '#4CAF50',    // Verde
          completed: '#1B5E20',  // Verde oscuro
          cancelled: '#F44336'   // Rojo
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif']
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
