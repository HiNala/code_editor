import { defineRecipe } from "@chakra-ui/react"
import { tokens, gradients } from "./tokens"

export const buttonRecipe = defineRecipe({
  base: {
    alignItems: "center",
    appearance: "none",
    borderRadius: tokens.radius.md,
    cursor: "pointer",
    display: "inline-flex",
    fontFamily: tokens.typography.fontFamily.primary,
    fontWeight: tokens.typography.fontWeights.semibold,
    gap: tokens.spacing.sm,
    justifyContent: "center",
    minHeight: "44px",
    minWidth: "44px",
    outline: "2px solid transparent",
    outlineOffset: "2px",
    position: "relative",
    transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`,
    userSelect: "none",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    
    _focusVisible: {
      outline: `2px solid ${tokens.colors.gradientSunsetStart}`,
      outlineOffset: "2px",
    },
    
    _disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  
  variants: {
    variant: {
      // Primary - Full sunset gradient
      primary: {
        background: gradients.sunset,
        color: tokens.colors.surfaceWhite,
        border: "none",
        boxShadow: tokens.shadows.gradient,
        
        _hover: {
          transform: "translateY(-2px)",
          boxShadow: tokens.shadows.xl,
        },
        
        _active: {
          transform: "translateY(0)",
          boxShadow: tokens.shadows.md,
        },
        
        _disabled: {
          background: tokens.colors.charcoal300,
          color: tokens.colors.charcoal500,
          boxShadow: "none",
          transform: "none",
        },
      },
      
      // Secondary - Outline with gradient on hover
      secondary: {
        background: "transparent",
        color: tokens.colors.charcoal900,
        border: `1px solid ${tokens.colors.charcoal900}`,
        
        _hover: {
          background: gradients.sunset,
          color: tokens.colors.surfaceWhite,
          borderColor: "transparent",
          transform: "translateY(-1px)",
          boxShadow: tokens.shadows.gradient,
        },
        
        _active: {
          transform: "translateY(0)",
        },
        
        _disabled: {
          borderColor: tokens.colors.charcoal300,
          color: tokens.colors.charcoal300,
        },
      },
      
      // Ghost - Text only with gradient hover
      ghost: {
        background: "transparent",
        color: tokens.colors.charcoal700,
        border: "none",
        
        _hover: {
          background: `linear-gradient(135deg, ${tokens.colors.gradientSunsetStart}12, ${tokens.colors.gradientSunsetEnd}12)`,
          color: tokens.colors.gradientSunsetStart,
        },
        
        _active: {
          background: `linear-gradient(135deg, ${tokens.colors.gradientSunsetStart}20, ${tokens.colors.gradientSunsetEnd}20)`,
        },
      },
      
      // Plan - Blue gradient for plan-related actions
      plan: {
        background: gradients.plan,
        color: tokens.colors.surfaceWhite,
        border: "none",
        
        _hover: {
          transform: "translateY(-1px)",
          filter: "brightness(1.1)",
        },
        
        _active: {
          transform: "translateY(0)",
        },
      },
      
      // Publish - Green gradient for publish-related actions
      publish: {
        background: gradients.publish,
        color: tokens.colors.surfaceWhite,
        border: "none",
        
        _hover: {
          transform: "translateY(-1px)",
          filter: "brightness(1.1)",
        },
        
        _active: {
          transform: "translateY(0)",
        },
      },
      
      // Danger - Red for destructive actions
      danger: {
        background: tokens.colors.danger,
        color: tokens.colors.surfaceWhite,
        border: "none",
        
        _hover: {
          background: "#DC2626",
          transform: "translateY(-1px)",
        },
        
        _active: {
          transform: "translateY(0)",
        },
      },
    },
    
    size: {
      sm: {
        fontSize: tokens.typography.fontSizes.caption,
        minHeight: "36px",
        paddingX: tokens.spacing.md,
        paddingY: tokens.spacing.sm,
      },
      
      md: {
        fontSize: tokens.typography.fontSizes.bodySm,
        minHeight: "44px",
        paddingX: tokens.spacing.lg,
        paddingY: tokens.spacing.md,
      },
      
      lg: {
        fontSize: tokens.typography.fontSizes.bodyLg,
        minHeight: "52px",
        paddingX: tokens.spacing.xl,
        paddingY: tokens.spacing.lg,
      },
      
      // Icon button - Square with just icon
      icon: {
        aspectRatio: "1",
        minWidth: "44px",
        paddingX: "0",
        paddingY: "0",
      },
    },
    
    shape: {
      rounded: {
        borderRadius: tokens.radius.md,
      },
      
      pill: {
        borderRadius: tokens.radius.pill,
      },
      
      square: {
        borderRadius: tokens.radius.sm,
      },
    },
  },
  
  defaultVariants: {
    variant: "primary",
    size: "md",
    shape: "rounded",
  },
})

// Export button variants for easy use
export const buttonVariants = {
  primary: { variant: "primary" as const },
  secondary: { variant: "secondary" as const },
  ghost: { variant: "ghost" as const },
  plan: { variant: "plan" as const },
  publish: { variant: "publish" as const },
  danger: { variant: "danger" as const },
}
