/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
        // Deep Charcoal Palette
        charcoal: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e3e6ea',
          300: '#c7ccd1',
          400: '#9aa0a6',
          500: '#5f6368',
          600: '#3c4043',
          700: '#2d3134',
          800: '#1f2124',
          900: '#171a1d',
          950: '#0f1114',
        },
        // Muted Accent Colors
        accent: {
          slate: '#64748b',
          zinc: '#71717a',
          neutral: '#737373',
          stone: '#78716c',
          gray: '#6b7280',
          red: '#ef4444',
          orange: '#f97316',
          amber: '#f59e0b',
          yellow: '#eab308',
          lime: '#84cc16',
          green: '#22c55e',
          emerald: '#10b981',
          teal: '#14b8a6',
          cyan: '#06b6d4',
          sky: '#0ea5e9',
          blue: '#3b82f6',
          indigo: '#6366f1',
          violet: '#8b5cf6',
          purple: '#a855f7',
          fuchsia: '#d946ef',
          pink: '#ec4899',
          rose: '#f43f5e',
        },
        // Sophisticated Gradients
        gradient: {
          primary: 'linear-gradient(135deg, #1f2124 0%, #2d3134 50%, #3c4043 100%)',
          secondary: 'linear-gradient(135deg, #0f1114 0%, #171a1d 50%, #1f2124 100%)',
          accent: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
          muted: 'linear-gradient(135deg, #64748b 0%, #71717a 50%, #737373 100%)',
          success: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
          warning: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)',
        },
        // Semantic Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: 0, transform: "translateX(-20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)" },
          "50%": { boxShadow: "0 0 30px rgba(59, 130, 246, 0.2)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "glow": "glow 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      boxShadow: {
        'charcoal': '0 4px 6px -1px rgba(15, 17, 20, 0.1), 0 2px 4px -1px rgba(15, 17, 20, 0.06)',
        'charcoal-lg': '0 10px 15px -3px rgba(15, 17, 20, 0.1), 0 4px 6px -2px rgba(15, 17, 20, 0.05)',
        'charcoal-xl': '0 20px 25px -5px rgba(15, 17, 20, 0.1), 0 10px 10px -5px rgba(15, 17, 20, 0.04)',
        'accent': '0 0 20px rgba(59, 130, 246, 0.15)',
        'accent-lg': '0 0 30px rgba(59, 130, 246, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
