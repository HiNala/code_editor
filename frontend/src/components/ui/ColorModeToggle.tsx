import React from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'
import { Button } from './button'
import { useTheme } from 'next-themes'

export const ColorModeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const isDark = theme === 'dark'
  const Icon = isDark ? FiSun : FiMoon
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={label}
      className="h-8 w-8 p-0 hover:scale-105 transition-transform"
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
} 