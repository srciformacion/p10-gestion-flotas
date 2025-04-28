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
        // Corporate Colors
        corporate: {
          green: {
            light: '#8ED833',    // Lighter shade of corporate green
            DEFAULT: '#78BE20',  // Corporate green (Pantone 368 C)
            dark: '#62A01A'      // Darker shade of corporate green
          },
          gray: {
            light: '#5A6B76',    // Lighter shade of corporate gray
            DEFAULT: '#3D4952',  // Corporate gray (Pantone 7546 C)
            dark: '#2B353C'      // Darker shade of corporate gray
          }
        },
        // Secondary Colors
        complementary: {
          green: {
            light: '#E8F5D9',    // Very light green
            DEFAULT: '#BADF94',  // Medium green
            dark: '#9BC06B'      // Dark green
          },
          gray: {
            light: '#F5F7F8',    // Very light gray
            DEFAULT: '#CDD5DA',  // Medium gray
            dark: '#8B979F'      // Dark gray
          }
        },
        // Off-white colors
        offwhite: {
          warm: '#F9F7F4',      // Warm off-white (beige tint)
          cool: '#F5F7F8'       // Cool off-white (gray tint)
        },
        // System colors mapping
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: '#78BE20',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#3D4952',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F5F7F8',
          foreground: '#3D4952',
        },
        accent: {
          DEFAULT: '#E8F5D9',
          foreground: '#3D4952',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#3D4952',
        },
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
