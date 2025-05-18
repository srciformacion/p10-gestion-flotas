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
        // Nuevos colores institucionales y de estado
        'status-open': '#76BC21',
        'status-evaluation': '#e2e61c',
        'status-closed': '#B0B0B0',
        'status-suitable': '#28A745',
        'status-rejected': '#DC3545',
        'status-document-pending': '#FFA500',
        
        // Colores base para shadcn/ui y tema general
        border: "hsl(var(--border))", // Se definirá en CSS :root
        input: "hsl(var(--input))",   // Se definirá en CSS :root
        ring: "hsl(var(--ring))",     // Se definirá en CSS :root
        background: "hsl(var(--background))", // #FFFFFF
        foreground: "hsl(var(--foreground))", // #2A2A2A
        primary: {
          DEFAULT: '#76BC21', // colorPrimarioVerde
          foreground: '#FFFFFF', // colorBlanco
          hover: '#5a921a', // Hover más oscuro para botones
        },
        secondary: {
          DEFAULT: '#243746', // colorFondoAzulOscuro
          foreground: '#FFFFFF', // colorBlanco
        },
        destructive: {
          DEFAULT: '#DC3545', // status-rejected (rojo para destructivo)
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // #E5E5E5 (colorGrisSuave)
          foreground: "hsl(var(--muted-foreground))", // Un gris más oscuro para texto sobre muted
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Un color de acento, podría ser un derivado del primario
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))", // #FFFFFF
          foreground: "hsl(var(--card-foreground))", // #243746 (texto oscuro de tarjeta)
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Open Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'Source Serif Pro', 'serif'], // Renombrado a 'serif' para uso genérico
      },
      borderRadius: {
        lg: "var(--radius)", // Será 12px (0.75rem)
        md: "calc(var(--radius) - 2px)", // 10px
        sm: "calc(var(--radius) - 4px)", // 8px
      },
      boxShadow: {
        'tarjeta-shadow': '0px 2px 8px rgba(0,0,0,0.1)',
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
