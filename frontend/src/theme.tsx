import { createSystem, defaultConfig } from "@chakra-ui/react"
import { buttonRecipe } from "./theme/button.recipe"

export const system = createSystem(defaultConfig, {
  globalCss: {
    html: {
      fontSize: "16px",
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    body: {
      fontSize: "0.875rem",
      margin: 0,
      padding: 0,
      lineHeight: 1.5,
    },
    ".main-link": {
      color: "studio.500",
      fontWeight: "bold",
    },
    "*": {
      boxSizing: "border-box",
    },
  },
  theme: {
    tokens: {
      colors: {
        // Studio color palette
        studio: {
          50: { value: '#eff6ff' },
          100: { value: '#dbeafe' },
          200: { value: '#bfdbfe' },
          300: { value: '#93c5fd' },
          400: { value: '#60a5fa' },
          500: { value: '#0ea5e9' }, // Primary studio blue
          600: { value: '#0284c7' },
          700: { value: '#0369a1' },
          800: { value: '#075985' },
          900: { value: '#0c4a6e' },
        },
        success: {
          50: { value: '#f0fdf4' },
          100: { value: '#dcfce7' },
          200: { value: '#bbf7d0' },
          300: { value: '#86efac' },
          400: { value: '#4ade80' },
          500: { value: '#10b981' }, // Success green
          600: { value: '#059669' },
          700: { value: '#047857' },
          800: { value: '#065f46' },
          900: { value: '#064e3b' },
        },
        warning: {
          50: { value: '#fffbeb' },
          100: { value: '#fef3c7' },
          200: { value: '#fde68a' },
          300: { value: '#fcd34d' },
          400: { value: '#fbbf24' },
          500: { value: '#f59e0b' }, // Warning amber
          600: { value: '#d97706' },
          700: { value: '#b45309' },
          800: { value: '#92400e' },
          900: { value: '#78350f' },
        },
        error: {
          50: { value: '#fef2f2' },
          100: { value: '#fee2e2' },
          200: { value: '#fecaca' },
          300: { value: '#fca5a5' },
          400: { value: '#f87171' },
          500: { value: '#ef4444' }, // Error crimson
          600: { value: '#dc2626' },
          700: { value: '#b91c1c' },
          800: { value: '#991b1b' },
          900: { value: '#7f1d1d' },
        },
        // UI semantic colors
        ui: {
          main: { value: "#0ea5e9" }, // Studio blue
          bg: {
            canvas: { value: '#ffffff' },
            subtle: { value: '#f8fafc' },
            muted: { value: '#f1f5f9' },
          },
          border: {
            subtle: { value: '#e2e8f0' },
            muted: { value: '#cbd5e1' },
          },
          text: {
            primary: { value: '#1e293b' },
            secondary: { value: '#64748b' },
            muted: { value: '#94a3b8' },
          }
        },
      },
      fonts: {
        heading: { value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
        body: { value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
        mono: { value: 'JetBrains Mono, Fira Code, monospace' },
      },
      fontSizes: {
        xs: { value: '12px' },
        sm: { value: '14px' },
        md: { value: '16px' },
        lg: { value: '18px' },
        xl: { value: '20px' },
        '2xl': { value: '24px' },
        '3xl': { value: '32px' },
      },
      radii: {
        xs: { value: '4px' },
        sm: { value: '6px' },
        md: { value: '8px' },
        lg: { value: '12px' },
        xl: { value: '16px' },
      },
      spacing: {
        tight: { value: '4px' },
        standard: { value: '8px' },
        comfortable: { value: '16px' },
        spacious: { value: '24px' },
        generous: { value: '32px' },
      }
    },
    semanticTokens: {
      colors: {
        bg: {
          canvas: { 
            value: { base: 'white', _dark: 'gray.900' }
          },
          subtle: { 
            value: { base: 'gray.50', _dark: 'gray.800' }
          },
          muted: { 
            value: { base: 'gray.100', _dark: 'gray.700' }
          },
        },
        border: {
          subtle: { 
            value: { base: 'gray.200', _dark: 'gray.600' }
          },
          muted: { 
            value: { base: 'gray.300', _dark: 'gray.500' }
          },
        },
        text: {
          primary: { 
            value: { base: 'gray.900', _dark: 'gray.100' }
          },
          secondary: { 
            value: { base: 'gray.600', _dark: 'gray.400' }
          },
          muted: { 
            value: { base: 'gray.500', _dark: 'gray.500' }
          },
        }
      }
    },
    recipes: {
      button: buttonRecipe,
    },
  },
})
