import { useState } from "react"
import { Box, Text, IconButton, VStack, HStack } from "@chakra-ui/react"
import { FiChevronUp, FiChevronDown } from "react-icons/fi"
import { useColorModeValue } from "../ui/color-mode"
import { tokens, gradients } from "../../theme/tokens"

const WORKFLOW_STATES = ["PLAN", "CREATE", "PUBLISH"]

interface WorkflowWheelProps {
  onStateChange?: (state: string) => void
}

export default function WorkflowWheel({ onStateChange = () => {} }: WorkflowWheelProps) {
  const [currentStateIndex, setCurrentStateIndex] = useState(1) // Start with CREATE
  const [isAnimating, setIsAnimating] = useState(false)

  const bgColor = useColorModeValue("gray.50", "gray.900")
  const textColor = useColorModeValue("black", "white")
  const mutedTextColor = useColorModeValue("gray.600", "gray.400")
  const ghostTextColor = useColorModeValue("rgba(0,0,0,0.02)", "rgba(255,255,255,0.02)")
  const arrowColor = useColorModeValue("gray.400", "gray.500")
  const arrowHoverColor = useColorModeValue("gray.600", "gray.300")

  const cycleState = (direction: "up" | "down") => {
    if (isAnimating) return

    setIsAnimating(true)

    let newIndex
    if (direction === "up") {
      newIndex = (currentStateIndex + 1) % WORKFLOW_STATES.length
    } else {
      newIndex = (currentStateIndex - 1 + WORKFLOW_STATES.length) % WORKFLOW_STATES.length
    }
    
    setCurrentStateIndex(newIndex)
    onStateChange(WORKFLOW_STATES[newIndex])

    setTimeout(() => setIsAnimating(false), 300)
  }

  const currentState = WORKFLOW_STATES[currentStateIndex]

  const getStateOpacity = (index: number) => {
    if (index === currentStateIndex) return 1
    const distance = Math.abs(index - currentStateIndex)
    return Math.max(0.15, 1 - (distance * 0.6))
  }

  const getStateTransform = (index: number) => {
    if (index === currentStateIndex) return "translateY(0px) rotateX(0deg) scale(1)"
    const distance = index - currentStateIndex
    const fadeOut = Math.abs(distance) > 1 ? 0.5 : 0.8
    return `translateY(${distance * 12}px) rotateX(${distance * 25}deg) scale(${fadeOut})`
  }

  const getStateBlur = (index: number) => {
    if (index === currentStateIndex) return "blur(0px)"
    const distance = Math.abs(index - currentStateIndex)
    return `blur(${distance * 1.5}px)`
  }

  return (
    <Box
      minH="100vh"
      bg={bgColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      {/* Background CRE8ABLE text */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        fontSize="12rem"
        fontWeight={tokens.typography.fontWeights.bold}
        color={ghostTextColor}
        pointerEvents="none"
        userSelect="none"
        fontFamily={tokens.typography.fontFamily.primary}
        zIndex={1}
      >
        CRE8ABLE
      </Box>

      <HStack gap={12} position="relative" zIndex={10}>
        {/* Left side - PLAN, CREATE, PUBLISH with wheel rotation effect */}
        <VStack gap={12}>
          <Text
            fontSize={tokens.typography.fontSizes.bodyLg}
            fontWeight={tokens.typography.fontWeights.medium}
            color={mutedTextColor}
            cursor="pointer"
            userSelect="none"
            opacity={getStateOpacity(0)}
            transform={getStateTransform(0)}
            filter={getStateBlur(0)}
            transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
            _hover={{
              transform: currentStateIndex === 0 ? "scale(1.05) rotateX(5deg)" : getStateTransform(0),
              filter: "blur(0px)",
              opacity: 1,
            }}
            onClick={() => setCurrentStateIndex(0)}
          >
            PLAN
          </Text>

          {/* Slot Machine Button */}
          <Box position="relative">
            {/* Up Arrow */}
            <IconButton
              position="absolute"
              top="-40px"
              left="50%"
              transform="translateX(-50%)"
              color={arrowColor}
              _hover={{ color: arrowHoverColor }}
              bg="transparent"
              size="sm"
              onClick={() => cycleState("up")}
              disabled={isAnimating}
              aria-label="Cycle up"
              zIndex={20}
            >
              <FiChevronUp size={24} />
            </IconButton>

            {/* Main Button with enhanced styling */}
            <Box
              position="relative"
              width="176px"
              height="64px"
              bg={gradients.sunset}
              borderRadius={tokens.radius.xl}
              overflow="hidden"
              boxShadow={tokens.shadows.lg}
              transform={isAnimating ? "scale(1.02)" : "scale(1)"}
              transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
              _hover={{
                transform: "scale(1.02)",
                boxShadow: tokens.shadows.xl,
              }}
              cursor="pointer"
              onClick={() => cycleState("down")}
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                opacity={isAnimating ? 0 : 1}
                transform={isAnimating ? "translateY(30px) rotateX(45deg)" : "translateY(0px) rotateX(0deg)"}
                transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
              >
                <Text
                  color="white"
                  fontWeight={tokens.typography.fontWeights.bold}
                  fontSize="24px"
                  textShadow="0 2px 4px rgba(0,0,0,0.3)"
                >
                  {currentState}
                </Text>
              </Box>
            </Box>

            {/* Down Arrow */}
            <IconButton
              position="absolute"
              bottom="-40px"
              left="50%"
              transform="translateX(-50%)"
              color={arrowColor}
              _hover={{ color: arrowHoverColor }}
              bg="transparent"
              size="sm"
              onClick={() => cycleState("down")}
              disabled={isAnimating}
              aria-label="Cycle down"
              zIndex={20}
            >
              <FiChevronDown size={24} />
            </IconButton>
          </Box>

          <Text
            fontSize={tokens.typography.fontSizes.bodyLg}
            fontWeight={tokens.typography.fontWeights.medium}
            color={mutedTextColor}
            cursor="pointer"
            userSelect="none"
            opacity={getStateOpacity(2)}
            transform={getStateTransform(2)}
            filter={getStateBlur(2)}
            transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
            _hover={{
              transform: currentStateIndex === 2 ? "scale(1.05) rotateX(-5deg)" : getStateTransform(2),
              filter: "blur(0px)",
              opacity: 1,
            }}
            onClick={() => setCurrentStateIndex(2)}
          >
            PUBLISH
          </Text>
        </VStack>

        {/* Right side - PROJECT */}
        <Text
          fontSize="5xl"
          fontWeight={tokens.typography.fontWeights.bold}
          color={textColor}
          userSelect="none"
          transform={isAnimating ? "scale(1.02)" : "scale(1)"}
          transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
          fontFamily={tokens.typography.fontFamily.primary}
        >
          PROJECT
        </Text>
      </HStack>

      {/* Global animation styles */}
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
              transition: none !important;
            }
          }
        `}
      </style>
    </Box>
  )
} 