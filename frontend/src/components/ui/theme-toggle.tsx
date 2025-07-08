import { Box } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { LuMoon, LuSun } from "react-icons/lu"
import { useColorMode, useColorModeValue } from "./color-mode"

const MotionBox = motion.create(Box)

export function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === "dark"

  // Better contrast colors for visibility
  const bgGradient = useColorModeValue(
    "linear(135deg, blue.500 0%, purple.600 50%, indigo.600 100%)",
    "linear(135deg, purple.600 0%, indigo.700 50%, gray.800 100%)"
  )
  
  const sliderBg = useColorModeValue("white", "gray.100")
  const iconColor = useColorModeValue("orange.500", "yellow.400")
  const shadowColor = useColorModeValue("gray.400", "purple.500")
  const borderColor = useColorModeValue("gray.300", "gray.600")

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
      boxShadow={`0 2px 12px ${shadowColor}`}
      border="1px solid"
      borderColor={borderColor}
    >
      {/* Animated stars background for dark mode */}
      <MotionBox
        position="absolute"
        inset="0"
        animate={{
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        background="radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 1px, transparent 1px), radial-gradient(circle at 60% 20%, rgba(255,255,255,0.15) 1px, transparent 1px)"
        backgroundSize="15px 15px, 20px 20px, 12px 12px"
      />

      {/* Light mode cloud effect */}
      <MotionBox
        position="absolute"
        inset="0"
        animate={{
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        background="radial-gradient(circle at 30% 60%, rgba(255,255,255,0.3) 8px, transparent 8px), radial-gradient(circle at 70% 40%, rgba(255,255,255,0.2) 12px, transparent 12px)"
        backgroundSize="25px 25px, 30px 30px"
      />

      {/* Sliding indicator */}
      <MotionBox
        position="absolute"
        top="1"
        w="6"
        h="6"
        borderRadius="full"
        bg={sliderBg}
        boxShadow="0 2px 8px rgba(0,0,0,0.2)"
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
        border="1px solid"
        borderColor="gray.200"
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