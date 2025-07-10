import { Box } from "@chakra-ui/react"
import { AnimatePresence, motion } from "framer-motion"
import { LuMoon, LuSun } from "react-icons/lu"
import { useColorMode } from "./color-mode"

const MotionBox = motion.create(Box)

export function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === "dark"

  return (
    <MotionBox
      as="button"
      position="relative"
      w="16" // w-16 = 64px = 4rem (much smaller)
      h="8" // h-8 = 32px = 2rem  
      borderRadius="full"
      cursor="pointer"
      overflow="hidden"
      onClick={toggleColorMode}
      whileTap={{ scale: 0.95 }}
      boxShadow="lg"
      _focus={{
        outline: "none",
        ring: 2,
        ringColor: "blue.400",
        ringOffset: 2,
      }}
      aria-label="Toggle theme"
      role="switch"
      aria-checked={isDark}
    >
      {/* Background Scene */}
      <MotionBox
        position="absolute"
        inset="0"
        animate={{
          background: isDark
            ? "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)"
            : "linear-gradient(135deg, #FF66C4 0%, #FFC54D 100%)", // CRE8ABLE sunset gradient
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Stars (Dark Mode) */}
      <AnimatePresence>
        {isDark && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            position="absolute"
            inset="0"
          >
            {[...Array(6)].map((_, i) => (
              <MotionBox
                key={i}
                position="absolute"
                w="0.5"
                h="0.5"
                bg="white"
                borderRadius="full"
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${20 + (i % 2) * 25}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                }}
              />
            ))}
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Clouds (Light Mode) */}
      <AnimatePresence>
        {!isDark && (
          <MotionBox
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.6 }}
            position="absolute"
            inset="0"
          >
            <MotionBox
              position="absolute"
              top="1"
              left="10"
              w="2.5"
              h="1"
              bg="rgba(255, 255, 255, 0.4)"
              borderRadius="full"
              animate={{
                x: [0, 6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <MotionBox
              position="absolute"
              top="2.5"
              right="2"
              w="2"
              h="0.5"
              bg="rgba(255, 255, 255, 0.3)"
              borderRadius="full"
              animate={{
                x: [0, -4, 0],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Toggle Circle with Sun/Moon */}
      <MotionBox
        position="absolute"
        top="0.5"
        w="7"
        h="7"
        borderRadius="full"
        boxShadow="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        animate={{
          x: isDark ? 32 : 2, // 32px = 8 * 4 (moving from left to right in 64px container)
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <MotionBox
              key="moon"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.4 }}
              color="yellow.200"
            >
              <LuMoon size={14} fill="currentColor" />
            </MotionBox>
          ) : (
            <MotionBox
              key="sun"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.4 }}
              color="yellow.600"
            >
              <MotionBox
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <LuSun size={14} />
              </MotionBox>
            </MotionBox>
          )}
        </AnimatePresence>
      </MotionBox>

      {/* Glow Effect */}
      <MotionBox
        position="absolute"
        inset="0"
        borderRadius="full"
        animate={{
          boxShadow: isDark
            ? "inset 0 0 15px rgba(59, 130, 246, 0.3), 0 0 15px rgba(59, 130, 246, 0.2)"
            : "inset 0 0 15px rgba(255, 102, 196, 0.3), 0 0 15px rgba(255, 197, 77, 0.2)",
        }}
        transition={{ duration: 0.8 }}
      />
    </MotionBox>
  )
}
