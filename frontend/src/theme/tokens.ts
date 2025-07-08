// Design Tokens for CRE8ABLE Brand System
// Based on "Bold creativity made simple" personality

export const tokens = {
  // 1. COLOR SYSTEM
  colors: {
    // Sunset Gradient (Brand Signature)
    gradientSunsetStart: "#FF66C4",
    gradientSunsetEnd: "#FFC54D",
    
    // Charcoal Scale
    charcoal900: "#111111",
    charcoal700: "#374151",
    charcoal500: "#6B7280",
    charcoal300: "#D1D5DB",
    charcoal100: "#F3F4F6",
    
    // Surface Colors
    surface: "#F9FAFB",
    surfaceWhite: "#FFFFFF",
    
    // Accent Colors
    accentPlan: "#3B82F6",
    accentPublish: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    success: "#10B981",
    
    // Dark Mode Equivalents
    dark: {
      surface: "#1F2937",
      surfaceCard: "#374151",
      text: "#F9FAFB",
      textSecondary: "#D1D5DB",
      gradientSunsetStart: "#C53C9E",
      gradientSunsetEnd: "#FF8A38",
    }
  },
  
  // 2. TYPOGRAPHY SCALE
  typography: {
    fontFamily: {
      primary: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    fontSizes: {
      display: "4.5rem", // 72px
      h1: "3rem", // 48px
      h2: "2.25rem", // 36px
      h3: "1.75rem", // 28px
      bodyLg: "1.125rem", // 18px
      bodySm: "1rem", // 16px
      caption: "0.875rem", // 14px
    },
    lineHeights: {
      display: "5rem", // 80px
      h1: "3.5rem", // 56px
      h2: "2.75rem", // 44px
      h3: "2.25rem", // 36px
      bodyLg: "1.75rem", // 28px
      bodySm: "1.5rem", // 24px
      caption: "1.25rem", // 20px
    },
    fontWeights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    }
  },
  
  // 3. SPACING SYSTEM (8pt grid)
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "6rem", // 96px
  },
  
  // 4. BORDER RADIUS
  radius: {
    sm: "0.25rem", // 4px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    pill: "62.5rem", // 999px
  },
  
  // 5. SHADOWS & DEPTH
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    gradient: "0 10px 25px rgba(255, 102, 196, 0.15)",
  },
  
  // 6. MOTION TOKENS
  motion: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      decelerate: "cubic-bezier(0.0, 0, 0.2, 1)",
      accelerate: "cubic-bezier(0.4, 0, 1, 1)",
    }
  },
  
  // 7. BREAKPOINTS
  breakpoints: {
    mobile: "640px",
    tablet: "1024px",
    desktop: "1280px",
  },
  
  // 8. Z-INDEX SCALE
  zIndex: {
    base: 0,
    overlay: 1000,
    modal: 1100,
    popover: 1200,
    tooltip: 1300,
  }
}

// Helper functions for consistent usage
export const gradients = {
  sunset: `linear-gradient(135deg, ${tokens.colors.gradientSunsetStart} 0%, ${tokens.colors.gradientSunsetEnd} 100%)`,
  sunsetDark: `linear-gradient(135deg, ${tokens.colors.dark.gradientSunsetStart} 0%, ${tokens.colors.dark.gradientSunsetEnd} 100%)`,
  plan: `linear-gradient(135deg, ${tokens.colors.accentPlan} 0%, #60A5FA 100%)`,
  publish: `linear-gradient(135deg, ${tokens.colors.accentPublish} 0%, #34D399 100%)`,
}

export const textGradients = {
  sunset: `linear-gradient(135deg, ${tokens.colors.gradientSunsetStart}, ${tokens.colors.gradientSunsetEnd})`,
  sunsetDark: `linear-gradient(135deg, ${tokens.colors.dark.gradientSunsetStart}, ${tokens.colors.dark.gradientSunsetEnd})`,
} 