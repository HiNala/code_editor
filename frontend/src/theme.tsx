import { createSystem, defaultConfig } from "@chakra-ui/react"
import { buttonRecipe } from "./theme/button.recipe"
import { gradients, tokens } from "./theme/tokens"

export const system = createSystem(defaultConfig, {
  globalCss: {
    // Import Inter font
    "@import":
      "url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')",

    html: {
      fontSize: "16px",
      height: "100%",
      fontFamily: tokens.typography.fontFamily.primary,
      // Use dynamic viewport height for better mobile/desktop compatibility
      minHeight: "100vh",
      "@supports (height: 100dvh)": {
        minHeight: "100dvh",
      },
    },
    body: {
      fontSize: tokens.typography.fontSizes.bodySm,
      lineHeight: tokens.typography.lineHeights.bodySm,
      fontWeight: tokens.typography.fontWeights.normal,
      fontFamily: tokens.typography.fontFamily.primary,
      margin: 0,
      padding: 0,
      height: "100%",
      // Prevent content from being hidden behind browser UI
      minHeight: "100vh",
      "@supports (height: 100dvh)": {
        minHeight: "100dvh",
      },
      // Add smooth scrolling
      scrollBehavior: "smooth",
    },
    "#root": {
      height: "100%",
      minHeight: "100vh",
      "@supports (height: 100dvh)": {
        minHeight: "100dvh",
      },
    },

    // Ghost word-mark background (oversized CRE8ABLE)
    "body::before": {
      content: "'CRE8ABLE'",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "12rem",
      fontWeight: tokens.typography.fontWeights.bold,
      color: "rgba(255, 102, 196, 0.04)",
      zIndex: "-1",
      userSelect: "none",
      pointerEvents: "none",
      whiteSpace: "nowrap",
    },

    // Keyframe animations
    "@keyframes pulse": {
      "0%": { opacity: "0.7" },
      "100%": { opacity: "1.0" },
    },

    "@keyframes float": {
      "0%, 100%": { transform: "translateY(0px)" },
      "50%": { transform: "translateY(-4px)" },
    },

    // Utility classes for gradients
    ".gradient-sunset": {
      background: gradients.sunset,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },

    ".gradient-sunset-bg": {
      background: gradients.sunset,
    },

    ".gradient-plan": {
      background: gradients.plan,
    },

    ".gradient-publish": {
      background: gradients.publish,
    },

    // Smooth transitions for all interactive elements
    "button, a, [role='button']": {
      transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`,
    },

    // Custom scrollbar styling
    "::-webkit-scrollbar": {
      width: "8px",
    },
    "::-webkit-scrollbar-track": {
      background: tokens.colors.charcoal100,
    },
    "::-webkit-scrollbar-thumb": {
      background: tokens.colors.charcoal300,
      borderRadius: tokens.radius.sm,
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: tokens.colors.charcoal500,
    },

    // Focus styles
    "*:focus-visible": {
      outline: `2px solid ${tokens.colors.gradientSunsetStart}`,
      outlineOffset: "2px",
    },

    // Selection styles
    "::selection": {
      background: tokens.colors.gradientSunsetStart,
      color: tokens.colors.surfaceWhite,
    },

    // Disable animations for users who prefer reduced motion
    "@media (prefers-reduced-motion: reduce)": {
      "*": {
        animation: "none !important",
        transition: "none !important",
      },
    },

    ".main-link": {
      color: tokens.colors.gradientSunsetStart,
      fontWeight: tokens.typography.fontWeights.semibold,
    },
  },

  theme: {
    tokens: {
      colors: {
        // Brand colors
        brand: {
          50: { value: "#FFF7ED" },
          100: { value: "#FFEDD5" },
          200: { value: "#FED7AA" },
          300: { value: "#FDBA74" },
          400: { value: "#FB923C" },
          500: { value: tokens.colors.gradientSunsetStart },
          600: { value: "#EA580C" },
          700: { value: "#C2410C" },
          800: { value: "#9A3412" },
          900: { value: "#7C2D12" },
        },

        // Semantic colors
        ui: {
          main: { value: tokens.colors.gradientSunsetStart },
          plan: { value: tokens.colors.accentPlan },
          publish: { value: tokens.colors.accentPublish },
          danger: { value: tokens.colors.danger },
          warning: { value: tokens.colors.warning },
          success: { value: tokens.colors.success },
        },

        // Surface colors
        surface: {
          primary: { value: tokens.colors.surface },
          card: { value: tokens.colors.surfaceWhite },
        },

        // Text colors
        text: {
          primary: { value: tokens.colors.charcoal900 },
          secondary: { value: tokens.colors.charcoal700 },
          muted: { value: tokens.colors.charcoal500 },
        },
      },

      fonts: {
        heading: { value: tokens.typography.fontFamily.primary },
        body: { value: tokens.typography.fontFamily.primary },
      },

      fontSizes: {
        display: { value: tokens.typography.fontSizes.display },
        "4xl": { value: tokens.typography.fontSizes.h1 },
        "3xl": { value: tokens.typography.fontSizes.h2 },
        "2xl": { value: tokens.typography.fontSizes.h3 },
        lg: { value: tokens.typography.fontSizes.bodyLg },
        md: { value: tokens.typography.fontSizes.bodySm },
        sm: { value: tokens.typography.fontSizes.caption },
      },

      lineHeights: {
        display: { value: tokens.typography.lineHeights.display },
        "4xl": { value: tokens.typography.lineHeights.h1 },
        "3xl": { value: tokens.typography.lineHeights.h2 },
        "2xl": { value: tokens.typography.lineHeights.h3 },
        lg: { value: tokens.typography.lineHeights.bodyLg },
        md: { value: tokens.typography.lineHeights.bodySm },
        sm: { value: tokens.typography.lineHeights.caption },
      },

      shadows: {
        sm: { value: tokens.shadows.sm },
        md: { value: tokens.shadows.md },
        lg: { value: tokens.shadows.lg },
        xl: { value: tokens.shadows.xl },
        gradient: { value: tokens.shadows.gradient },
      },

      radii: {
        sm: { value: tokens.radius.sm },
        md: { value: tokens.radius.md },
        lg: { value: tokens.radius.lg },
        xl: { value: tokens.radius.xl },
        pill: { value: tokens.radius.pill },
      },
    },

    recipes: {
      button: buttonRecipe,
    },
  },
})

// Export tokens for use in components
export { tokens, gradients }
