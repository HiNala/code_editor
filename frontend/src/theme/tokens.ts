// Design Tokens for CRE8ABLE Brand System
// Based on "Bold creativity made simple" personality
// Enhanced for Canva-quality Dashboard Experience

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
    
    // Enhanced Surface Colors (Dashboard Spec)
    surfaceDashboard: "#FFFFFF",
    surfaceCard: "#FCFCFD",
    borderSubtle: "rgba(0, 0, 0, 0.06)",
    textHero: "#1D1D1F",
    
    // Legacy Surface Colors
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
      surfaceDashboard: "#000000",
      surfaceCard: "#1C1C1E",
      borderSubtle: "rgba(255, 255, 255, 0.12)",
      textHero: "#FFFFFF",
      gradientSunsetStart: "#C53C9E",
      gradientSunsetEnd: "#FF8A38",
      // Legacy
      surface: "#1F2937",
      text: "#F9FAFB",
      textSecondary: "#D1D5DB",
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
      hero: "2rem", // 32px - Welcome banner
      subHero: "1.125rem", // 18px - Rotating sub-copy
    },
    lineHeights: {
      display: "5rem", // 80px
      h1: "3.5rem", // 56px
      h2: "2.75rem", // 44px
      h3: "2.25rem", // 36px
      bodyLg: "1.75rem", // 28px
      bodySm: "1.5rem", // 24px
      caption: "1.25rem", // 20px
      hero: "2.5rem", // 40px
      subHero: "1.75rem", // 28px
    },
    fontWeights: {
      light: "300", // Ghost watermark
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
    "5xl": "8rem", // 128px
  },
  
  // 4. BORDER RADIUS
  radius: {
    sm: "0.25rem", // 4px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px - Card badges
    xl: "1rem", // 16px
    pill: "62.5rem", // 999px
    full: "50%", // Circle buttons
  },
  
  // 5. SHADOWS & DEPTH
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    cardHover: "rgba(0,0,0,.15) 0 12px 24px", // Card hover elevation
    gradient: "0 10px 25px rgba(255, 102, 196, 0.15)",
  },
  
  // 6. ENHANCED MOTION TOKENS
  motion: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "400ms", // Action wheel
      crossFade: "12s", // Rotating sub-copy
    },
    easing: {
      standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      decelerate: "cubic-bezier(0.0, 0, 0.2, 1)",
      accelerate: "cubic-bezier(0.4, 0, 1, 1)",
      wheel: "cubic-bezier(.4,0,.2,1)", // Action wheel specific
    },
    stagger: {
      wheelChild: "30ms", // Action wheel children
    }
  },
  
  // 7. BREAKPOINTS
  breakpoints: {
    mobile: "640px",
    tablet: "1024px",
    desktop: "1280px",
    wide: "1440px", // 5-column grid
  },
  
  // 8. Z-INDEX SCALE
  zIndex: {
    base: 0,
    ghostWatermark: 1,
    overlay: 1000,
    actionWheel: 1050,
    modal: 1100,
    popover: 1200,
    tooltip: 1300,
  },
  
  // 9. GRID SPECIFICATIONS
  grid: {
    columns: {
      mobile: 1,
      tablet: 3,
      desktop: 4,
      wide: 5,
    },
    gaps: {
      mobile: "16px",
      tablet: "20px",
      desktop: "24px",
      wide: "24px",
    }
  },
  
  // 10. ACTION WHEEL SPECIFICATIONS
  actionWheel: {
    main: {
      size: "64px",
      offset: "80px",
    },
    child: {
      size: "48px",
      radius: {
        desktop: "110px",
        mobile: "90px",
      },
      fanAngle: "120deg",
    }
  }
}

// Helper functions for consistent usage
export const gradients = {
  sunset: `linear-gradient(135deg, ${tokens.colors.gradientSunsetStart} 0%, ${tokens.colors.gradientSunsetEnd} 100%)`,
  sunsetDark: `linear-gradient(135deg, ${tokens.colors.dark.gradientSunsetStart} 0%, ${tokens.colors.dark.gradientSunsetEnd} 100%)`,
  plan: `linear-gradient(135deg, ${tokens.colors.accentPlan} 0%, #60A5FA 100%)`,
  publish: `linear-gradient(135deg, ${tokens.colors.accentPublish} 0%, #34D399 100%)`,
  heroBackground: `linear-gradient(135deg, rgba(255, 102, 196, 0.02) 0%, rgba(255, 197, 77, 0.02) 100%)`,
  cardHover: `linear-gradient(45deg, transparent 0%, rgba(255, 102, 196, 0.15) 100%)`,
}

export const textGradients = {
  sunset: `linear-gradient(135deg, ${tokens.colors.gradientSunsetStart}, ${tokens.colors.gradientSunsetEnd})`,
  sunsetDark: `linear-gradient(135deg, ${tokens.colors.dark.gradientSunsetStart}, ${tokens.colors.dark.gradientSunsetEnd})`,
}

// Ghost watermark utility
export const ghostWatermark = {
  fontSize: "10vw",
  opacity: "0.04",
  fontWeight: tokens.typography.fontWeights.light,
  position: "fixed",
  zIndex: tokens.zIndex.ghostWatermark,
} 