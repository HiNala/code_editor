"use client"

import React, { useRef, useState } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { cn } from "../../lib/utils"

interface HoverBorderGradientProps {
  children: React.ReactNode
  containerClassName?: string
  className?: string
  as?: React.ElementType
  duration?: number
  clockwise?: boolean
  [key: string]: any
}

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Component = "div",
  duration = 1,
  clockwise = true,
  ...otherProps
}: HoverBorderGradientProps) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 300 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  const maskImage = useMotionTemplate`radial-gradient(240px circle at ${mouseXSpring}px ${mouseYSpring}px, white, transparent)`

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const isActive = hovered || focused

  return (
    <Component
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cn(
        "relative flex items-center justify-center transition-all duration-200",
        containerClassName
      )}
      {...otherProps}
    >
      {/* Animated border gradient */}
      <div
        className={cn(
          "absolute inset-0 rounded-[inherit] p-[1px] transition-opacity duration-300",
          isActive ? "opacity-100" : "opacity-0"
        )}
      >
        <motion.div
          className="absolute inset-0 rounded-[inherit]"
          style={{
            background: `conic-gradient(from ${clockwise ? "0deg" : "360deg"}, 
              hsl(var(--primary)) 0deg, 
              hsl(var(--primary)/0.8) 60deg, 
              hsl(var(--primary)/0.4) 120deg, 
              transparent 180deg, 
              hsl(var(--primary)/0.4) 240deg, 
              hsl(var(--primary)/0.8) 300deg, 
              hsl(var(--primary)) 360deg)`,
          }}
          animate={{
            rotate: isActive ? (clockwise ? 360 : -360) : 0,
          }}
          transition={{
            duration: duration,
            ease: "linear",
            repeat: isActive ? Infinity : 0,
          }}
        />
        
        {/* Inner border to create the border effect */}
        <div className="absolute inset-[1px] rounded-[inherit] bg-background" />
      </div>

      {/* Hover glow effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, hsl(var(--primary)/0.1) 0%, transparent 70%)`,
            maskImage,
          }}
          animate={{
            opacity: isActive ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center",
          className
        )}
      >
        {children}
      </div>

      {/* Focus ring for accessibility */}
      {focused && (
        <div className="absolute inset-0 rounded-[inherit] ring-2 ring-ring ring-offset-2 ring-offset-background" />
      )}
    </Component>
  )
}

// Preset variations
export function HoverBorderGradientButton({
  children,
  variant = "default",
  size = "default",
  ...props
}: HoverBorderGradientProps & {
  variant?: "default" | "primary" | "secondary" | "destructive"
  size?: "sm" | "default" | "lg"
}) {
  const variants = {
    default: "bg-background text-foreground border-border",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  }

  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg",
  }

  return (
    <HoverBorderGradient
      as="button"
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size]
      )}
      {...props}
    >
      {children}
    </HoverBorderGradient>
  )
}

// Utility function for reduced motion
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
} 