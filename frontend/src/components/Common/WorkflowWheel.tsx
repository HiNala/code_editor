import { useState } from "react"
import { Box, Text, VStack, HStack } from "@chakra-ui/react"
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

  const textColor = useColorModeValue("black", "white")
  const mutedTextColor = useColorModeValue("gray.600", "gray.400")
  const arrowColor = useColorModeValue("gray.400", "gray.500")
  const arrowHoverColor = useColorModeValue("gray.600", "gray.300")

  const cycleState = (direction: "up" | "down") => {
    if (isAnimating) return

    setIsAnimating(true)

    let newIndex
    if (direction === "up") {
      newIndex = (currentStateIndex - 1 + WORKFLOW_STATES.length) % WORKFLOW_STATES.length
    } else {
      newIndex = (currentStateIndex + 1) % WORKFLOW_STATES.length
    }
    
    setCurrentStateIndex(newIndex)
    onStateChange(WORKFLOW_STATES[newIndex])

    setTimeout(() => setIsAnimating(false), 300)
  }

  const currentState = WORKFLOW_STATES[currentStateIndex]

  const getStateOpacity = (index: number) => {
    // Hide/fade the duplicate label that matches the active button
    if (index === currentStateIndex) return 0.3 // faint hint of the wheel depth
    return 1
  }

  const getStateTransform = (index: number) => {
    // Slight lift for inactive labels to reinforce wheel feel
    if (index === currentStateIndex) return "translateY(0px) rotateX(0deg) scale(0.88)"
    const distance = index - currentStateIndex
    const depthScale = 1 // keep full size for visible labels
    return `translateY(${distance * 12}px) rotateX(${distance * 20}deg) scale(${depthScale})`
  }

  const getStateBlur = (index: number) => {
    // Blur only the duplicate label inside the wheel (matching active button)
    // Ensure blur value is never negative to avoid CSS warnings
    return index === currentStateIndex ? "blur(2px)" : "blur(0px)"
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      py={8}
    >

      <HStack gap={8} position="relative" zIndex={10}>
        {/* Left side - Workflow wheel with chevrons outside */}
        <VStack gap={4}>
          {/* Up Chevron */}
          <Box
            color={arrowColor}
            _hover={{ color: arrowHoverColor }}
            cursor="pointer"
            onClick={() => cycleState("up")}
            transition={`color ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`}
          >
            <FiChevronUp size={24} />
          </Box>

          {/* PLAN text */}
          <Text
            fontSize={tokens.typography.fontSizes.bodySm}
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

          {/* Main Button */}
          <Box
            position="relative"
            width="140px"
            height="48px"
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
                fontSize="18px"
                textShadow="0 2px 4px rgba(0,0,0,0.3)"
              >
                {currentState}
              </Text>
            </Box>
          </Box>

          {/* PUBLISH text */}
          <Text
            fontSize={tokens.typography.fontSizes.bodySm}
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

          {/* Down Chevron */}
          <Box
            color={arrowColor}
            _hover={{ color: arrowHoverColor }}
            cursor="pointer"
            onClick={() => cycleState("down")}
            transition={`color ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`}
          >
            <FiChevronDown size={24} />
          </Box>
        </VStack>

        {/* Right side - PROJECT */}
        <Text
          fontSize="3xl"
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