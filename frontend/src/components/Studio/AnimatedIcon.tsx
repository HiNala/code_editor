import React from 'react'
import { Box, keyframes } from '@chakra-ui/react'

const spin = keyframes`
  from { transform: rotate(0deg) }
  to { transform: rotate(360deg) }
`

const pulse = keyframes`
  0%, 100% { opacity: 1 }
  50% { opacity: 0.5 }
`

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translateY(0) }
  40%, 43% { transform: translateY(-8px) }
  70% { transform: translateY(-4px) }
  90% { transform: translateY(-2px) }
`

const shake = keyframes`
  0%, 100% { transform: translateX(0) }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px) }
  20%, 40%, 60%, 80% { transform: translateX(4px) }
`

const wave = keyframes`
  0%, 100% { transform: scale(1) }
  50% { transform: scale(1.1) }
`

export interface AnimatedIconProps {
  children: React.ReactNode
  animation?: 'spin' | 'pulse' | 'bounce' | 'shake' | 'wave' | 'none'
  duration?: string
  isActive?: boolean
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  children,
  animation = 'none',
  duration = '1s',
  isActive = true,
}) => {
  const getAnimation = () => {
    if (!isActive || animation === 'none') return undefined
    
    switch (animation) {
      case 'spin':
        return `${spin} ${duration} linear infinite`
      case 'pulse':
        return `${pulse} ${duration} ease-in-out infinite`
      case 'bounce':
        return `${bounce} ${duration} ease infinite`
      case 'shake':
        return `${shake} 0.5s ease-in-out 3`
      case 'wave':
        return `${wave} ${duration} ease-in-out infinite`
      default:
        return undefined
    }
  }

  return (
    <Box
      as="span"
      display="inline-block"
      animation={getAnimation()}
      transformOrigin="center"
    >
      {children}
    </Box>
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