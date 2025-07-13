import React from 'react'
import { cn } from '../../lib/utils'

export interface AnimatedIconProps {
  children: React.ReactNode
  animation?: 'spin' | 'pulse' | 'bounce' | 'shake' | 'wave' | 'none'
  duration?: string
  isActive?: boolean
  className?: string
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  children,
  animation = 'none',
  duration = '1s',
  isActive = true,
  className,
}) => {
  const getAnimationClass = () => {
    if (!isActive || animation === 'none') return ''
    
    switch (animation) {
      case 'spin':
        return 'animate-spin'
      case 'pulse':
        return 'animate-pulse'
      case 'bounce':
        return 'animate-bounce'
      case 'shake':
        return 'animate-pulse' // Tailwind doesn't have shake, using pulse
      case 'wave':
        return 'animate-pulse'
      default:
        return ''
    }
  }

  return (
    <span
      className={cn(
        'inline-block transform-gpu',
        getAnimationClass(),
        className
      )}
      style={{
        animationDuration: duration,
      }}
    >
      {children}
    </span>
  )
}

// Convenience components for common animations
export const SpinningIcon: React.FC<{ children: React.ReactNode; isActive?: boolean }> = ({
  children,
  isActive = true,
}) => (
  <AnimatedIcon animation="spin" duration="2s" isActive={isActive}>
    {children}
  </AnimatedIcon>
)

export const PulsingIcon: React.FC<{ children: React.ReactNode; isActive?: boolean }> = ({
  children,
  isActive = true,
}) => (
  <AnimatedIcon animation="pulse" duration="2s" isActive={isActive}>
    {children}
  </AnimatedIcon>
)

export const WaveIcon: React.FC<{ children: React.ReactNode; isActive?: boolean }> = ({
  children,
  isActive = true,
}) => (
  <AnimatedIcon animation="wave" duration="2s" isActive={isActive}>
    {children}
  </AnimatedIcon>
)

export const ShakeIcon: React.FC<{ children: React.ReactNode; trigger?: boolean }> = ({
  children,
  trigger = false,
}) => (
  <AnimatedIcon animation="shake" isActive={trigger}>
    {children}
  </AnimatedIcon>
) 