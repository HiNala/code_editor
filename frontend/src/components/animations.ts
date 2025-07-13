// Animation utilities for micro-interactions
export const pulse = () => 'animate-pulse'
export const shake = () => 'animate-shake' 
export const spinDot = () => 'animate-spin'
export const highlightFlash = () => 'animate-highlight-flash'
export const wave = () => 'animate-wave'
export const bounce = () => 'animate-bounce'

// Event-based animation triggers
export const animationTriggers = {
  thinking: () => wave(),
  token: () => highlightFlash(),
  file_written: () => highlightFlash(),
  build_ok: () => bounce(),
  error: () => shake(),
}

// CSS-in-JS animation styles for Chakra UI
export const animationStyles = {
  pulse: {
    animation: 'pulse 2s ease-in-out infinite',
  },
  spin: {
    animation: 'spin 2s linear infinite',
  },
  shake: {
    animation: 'shake 0.5s ease-in-out 3',
  },
  bounce: {
    animation: 'bounce 1s ease infinite',
  },
  wave: {
    animation: 'wave 2s ease-in-out infinite',
  },
  highlightFlash: {
    animation: 'highlightFlash 400ms ease-out',
  },
}

// Reduced motion fallbacks
export const getAnimation = (animationType: keyof typeof animationStyles) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  if (prefersReducedMotion) {
    return {
      transition: 'opacity 250ms ease',
    }
  }
  
  return animationStyles[animationType]
}

// Button micro-interactions
export const buttonAnimations = {
  hover: {
    transform: 'scale(1.02)',
    transition: 'all 120ms ease',
  },
  active: {
    transform: 'scale(0.98)',
    transition: 'all 80ms ease',
  },
  disabled: {
    opacity: 0.4,
    transition: 'opacity 200ms ease',
  },
}

// Focus ring styles
export const focusRing = {
  outline: '2px solid var(--color-studio-blue)',
  outlineOffset: '2px',
}

// Toast animations
export const toastAnimations = {
  enter: {
    transform: 'translateX(100%)',
    opacity: 0,
  },
  enterActive: {
    transform: 'translateX(0)',
    opacity: 1,
    transition: 'all 300ms ease',
  },
  exit: {
    transform: 'translateX(100%)',
    opacity: 0,
    transition: 'all 200ms ease',
  },
}

// Modal animations
export const modalAnimations = {
  backdrop: {
    enter: { opacity: 0 },
    enterActive: { opacity: 1, transition: 'opacity 150ms ease' },
    exit: { opacity: 0, transition: 'opacity 100ms ease' },
  },
  content: {
    enter: { 
      opacity: 0, 
      transform: 'scale(0.95) translateY(-10px)' 
    },
    enterActive: { 
      opacity: 1, 
      transform: 'scale(1) translateY(0)',
      transition: 'all 200ms ease'
    },
    exit: { 
      opacity: 0, 
      transform: 'scale(0.95) translateY(-10px)',
      transition: 'all 150ms ease'
    },
  },
}

// Sidebar slide animations
export const sidebarAnimations = {
  slideInRight: {
    transform: 'translateX(100%)',
    transition: 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  slideInLeft: {
    transform: 'translateX(-100%)',
    transition: 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  slideOut: {
    transform: 'translateX(0)',
    transition: 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} 