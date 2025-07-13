import React from 'react'
import { IconButton } from '@chakra-ui/react'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useColorMode, useColorModeValue } from './color-mode'

export const ColorModeToggle: React.FC = () => {
  const { toggleColorMode } = useColorMode()
  const SunIcon = useColorModeValue(FiMoon, FiSun)
  const label = useColorModeValue('Switch to dark mode', 'Switch to light mode')

  return (
    <IconButton
      aria-label={label}
      icon={<SunIcon />}
      onClick={toggleColorMode}
      variant="ghost"
      size="sm"
      className="focus-ring"
      _hover={{
        bg: useColorModeValue('gray.100', 'gray.700'),
        transform: 'scale(1.05)',
      }}
      transition="all var(--transition-fast)"
    />
  )
} 