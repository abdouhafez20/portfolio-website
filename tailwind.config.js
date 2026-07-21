import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        ink: '#1C1C1A',
        forest: '#2A5840',
        'forest-hover': '#1E402E',
        'dark-forest': '#4D9E72',
        medical: '#357ABD',
        'dark-med': '#5A9FD4',
        gold: '#C2A36C',
        'dark-gold': '#D4B87A',
        mist: '#8A857A',
        surface: '#FFFFFF',
        'dark-bg': '#0E0E0C',
        'dark-text': '#E4E0D8',
        'dark-muted': '#9A958A',
        'dark-card': '#1A1A18',
        'card-border': 'rgba(28, 28, 26, 0.06)',
        'dark-border': 'rgba(255, 255, 255, 0.04)',
        'wa-green': '#25D366',
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
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
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
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '2xl': '16px',
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'lift': '0 12px 32px rgba(28, 28, 26, 0.12)',
        'card': '0 4px 24px rgba(28, 28, 26, 0.07)',
        'wa': '0 8px 24px rgba(37, 211, 102, 0.28)',
        'dark-lift': '0 12px 32px rgba(0, 0, 0, 0.4)',
        'dark-card': '0 4px 24px rgba(0, 0, 0, 0.3)',
        'focus': '0 0 0 3px rgba(42, 88, 64, 0.1), 0 0 0 1px rgba(42, 88, 64, 1)',
      },
      keyframes: {
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "ping-slow": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "shimmer": "shimmer 4s linear infinite",
        "marquee": "marquee 22s linear infinite",
        "ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "blink": "blink 1s step-end infinite",
      },
      backdropBlur: {
        xl: '20px',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
