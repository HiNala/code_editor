/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    // Mobile-first responsive breakpoints
    screens: {
      'xs': '375px',    // Small phones
      'sm': '640px',    // Large phones  
      'md': '768px',    // Tablets
      'lg': '1024px',   // Small laptops
      'xl': '1280px',   // Desktop
      '2xl': '1536px',  // Large desktop
    },
    extend: {
      // Enhanced spacing scale for responsive design
      spacing: {
        '2': '0.125rem',  // 2px
        '4': '0.25rem',   // 4px
        '6': '0.375rem',  // 6px
        '8': '0.5rem',    // 8px
        '12': '0.75rem',  // 12px
        '16': '1rem',     // 16px
        '20': '1.25rem',  // 20px
        '24': '1.5rem',   // 24px
        '32': '2rem',     // 32px
        '40': '2.5rem',   // 40px
        '48': '3rem',     // 48px
        '56': '3.5rem',   // 56px
        '64': '4rem',     // 64px
      },
      
      // Semantic color system
      colors: {
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
      
      // Typography with responsive line heights
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      
      // Enhanced shadow system with glow effects
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
        'studio': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'studio-lg': '0 8px 40px rgba(0, 0, 0, 0.15)',
      },
      
      // Enhanced animation system
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 1s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'slide-left': 'slide-left 0.3s ease-out',
        'slide-right': 'slide-right 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.2s ease-out',
      },
      
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
          },
          '50%': { 
            opacity: '0.8',
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)'
          },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'wave': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
      },
      
      // Z-index scale for proper layering
      zIndex: {
        'modal': '1050',
        'popover': '1040',
        'tooltip': '1030',
        'navbar': '1020',
        'dropdown': '1010',
        'max': '9999',
      },
      
      // Border radius scale
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} 