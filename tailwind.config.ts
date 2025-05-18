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
        'status-open': '#76BC21', // Verde (Oferta abierta)
        'status-evaluation': '#e2e61c', // Amarillo (En evaluación)
        'status-closed': '#B0B0B0', // Gris (Cerrada)
        'status-suitable': '#28A745', // Verde oscuro (Apto / Contratado)
        'status-rejected': '#DC3545', // Rojo (No apto / Rechazado)
        'status-document-pending': '#FFA500', // Naranja (Documento pendiente)

        // Colores de estado para la lógica de la aplicación (TransportRequest status)
        'status-pending': '#e2e61c',      // Amarillo (En evaluación)
        'status-assigned': '#76BC21',     // Verde primario (Asignada)
        'status-inRoute': '#76BC21',      // Verde primario (En Ruta - puede ajustarse si se necesita diferenciación)
        'status-completed': '#28A745',    // Verde oscuro (Completada)
        'status-cancelled': '#DC3545',    // Rojo (Cancelada)
        
        // Colores base para shadcn/ui y tema general
        border: "hsl(var(--border))", 
        input: "hsl(var(--input))",   
        ring: "hsl(var(--ring))",     
        background: "hsl(var(--background))", 
        foreground: "hsl(var(--foreground))", 
        primary: {
          DEFAULT: '#76BC21', 
          foreground: '#FFFFFF', 
          hover: '#5a921a', 
        },
        secondary: {
          DEFAULT: '#243746', 
          foreground: '#FFFFFF', 
        },
        destructive: {
          DEFAULT: '#DC3545', 
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", 
          foreground: "hsl(var(--muted-foreground))", 
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", 
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))", 
          foreground: "hsl(var(--card-foreground))", 
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Open Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'Source Serif Pro', 'serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
