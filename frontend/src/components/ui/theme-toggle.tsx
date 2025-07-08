import { Box } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { LuMoon, LuSun } from "react-icons/lu"
import { useColorMode, useColorModeValue } from "./color-mode"

const MotionBox = motion.create(Box)

export function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === "dark"

  // Dynamic colors based on theme
  const bgGradient = useColorModeValue(
    "linear(135deg, blue.200 0%, blue.300 50%, blue.100 100%)",
    "linear(135deg, purple.900 0%, purple.800 50%, gray.900 100%)"
  )
  
  const sliderBg = useColorModeValue("white", "gray.100")
  const iconColor = useColorModeValue("orange.500", "purple.400")
  const shadowColor = useColorModeValue("gray.300", "purple.700")

  return (
    <MotionBox
      as="button"
      position="relative"
      w="16"
      h="8"
      borderRadius="full"
      cursor="pointer"
      overflow="hidden"
      bgGradient={bgGradient}
      onClick={toggleColorMode}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      _focus={{
        outline: "none",
        ring: 2,
        ringColor: "blue.400",
        ringOffset: 2,
      }}
      aria-label="Toggle theme"
      role="switch"
      aria-checked={isDark}
      boxShadow={`0 2px 8px ${shadowColor}`}
    >
      {/* Animated stars background for dark mode */}
      <MotionBox
        position="absolute"
        inset="0"
        animate={{
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        background="radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.15) 1px, transparent 1px), radial-gradient(circle at 60% 20%, rgba(255,255,255,0.1) 1px, transparent 1px)"
        backgroundSize="20px 20px, 25px 25px, 15px 15px"
      />

      {/* Sliding indicator */}
      <MotionBox
        position="absolute"
        top="1"
        w="6"
        h="6"
        borderRadius="full"
        bg={sliderBg}
        boxShadow="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        animate={{
          x: isDark ? 36 : 4,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          duration: 0.4,
        }}
      >
        <MotionBox
          animate={{
            rotate: isDark ? 360 : 0,
            scale: isDark ? 0.9 : 1,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          {isDark ? (
            <LuMoon size={16} color={iconColor} />
          ) : (
            <LuSun size={16} color={iconColor} />
          )}
        </MotionBox>
      </MotionBox>
    </MotionBox>
  )
} 