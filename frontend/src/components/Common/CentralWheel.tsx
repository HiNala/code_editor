import { useState } from "react"
import { Box, Text, VStack } from "@chakra-ui/react"
import { useColorModeValue } from "../ui/color-mode"
import { tokens, gradients } from "../../theme/tokens"

interface CentralWheelProps {
  activeSegment?: "PLAN" | "CREATE" | "PROJECT" | "PUBLISH"
  onSegmentChange?: (segment: "PLAN" | "CREATE" | "PROJECT" | "PUBLISH") => void
}

export default function CentralWheel({
  activeSegment = "CREATE",
  onSegmentChange = () => {},
}: CentralWheelProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)
  const [isRotating, setIsRotating] = useState(false)

  const textColor = useColorModeValue(tokens.colors.textHero, tokens.colors.dark.textHero)

  const segments = [
    {
      id: "PLAN",
      label: "PLAN",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)", // Blue to purple
      hoverGradient: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
    },
    {
      id: "CREATE", 
      label: "CREATE",
      gradient: gradients.sunset, // Pink to orange (signature)
      hoverGradient: "linear-gradient(135deg, #EC4899 0%, #F97316 100%)",
    },
    {
      id: "PROJECT",
      label: "PROJECT", 
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)", // Purple to pink
      hoverGradient: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
    },
    {
      id: "PUBLISH",
      label: "PUBLISH",
      gradient: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)", // Green to teal
      hoverGradient: "linear-gradient(135deg, #059669 0%, #0891B2 100%)",
    },
  ]

  const handleSegmentClick = (segmentId: string) => {
    if (segmentId !== activeSegment) {
      setIsRotating(true)
      setTimeout(() => {
        onSegmentChange(segmentId as any)
        setIsRotating(false)
      }, 300)
    }
  }

  const getSegmentStyles = (segment: any) => {
    const isActive = segment.id === activeSegment
    const isHovered = hoveredSegment === segment.id
    
    return {
      background: isHovered ? segment.hoverGradient : segment.gradient,
      transform: isActive 
        ? "scale(1.05) translateY(-2px)" 
        : isHovered 
        ? "scale(1.02) translateY(-1px)" 
        : "scale(1)",
      boxShadow: isActive
        ? "0 12px 32px rgba(255, 102, 196, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)"
        : isHovered
        ? "0 8px 24px rgba(0, 0, 0, 0.15)"
        : "0 4px 12px rgba(0, 0, 0, 0.08)",
      zIndex: isActive ? 3 : isHovered ? 2 : 1,
    }
  }

  return (
    <VStack gap={8} align="center" position="relative">
      {/* PROJECT Label */}
      <Text
        fontSize="48px"
        fontWeight={tokens.typography.fontWeights.bold}
        color={textColor}
        letterSpacing="0.02em"
        textAlign="center"
        mb={4}
      >
        PROJECT
      </Text>

      {/* Central Wheel Container */}
      <Box
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={0}
        transform={isRotating ? "rotateY(10deg)" : "rotateY(0deg)"}
        transition={`transform ${tokens.motion.duration.slow} ${tokens.motion.easing.standard}`}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        {segments.map((segment, index) => {
          const isActive = segment.id === activeSegment
          const isCenter = segment.id === "CREATE" || segment.id === "PROJECT"
          
          return (
            <Box
              key={segment.id}
              position="relative"
              cursor="pointer"
              transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
              onMouseEnter={() => setHoveredSegment(segment.id)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => handleSegmentClick(segment.id)}
              {...getSegmentStyles(segment)}
            >
              <Box
                px={isCenter ? 8 : 6}
                py={isCenter ? 4 : 3}
                borderRadius={tokens.radius.xl}
                position="relative"
                overflow="hidden"
              >
                {/* Segment Content */}
                <Text
                  fontSize={isCenter ? "24px" : "18px"}
                  fontWeight={tokens.typography.fontWeights.bold}
                  color="white"
                  textAlign="center"
                  letterSpacing="0.05em"
                  textShadow="0 2px 4px rgba(0, 0, 0, 0.2)"
                  position="relative"
                  zIndex={2}
                >
                  {segment.label}
                </Text>

                {/* Active Indicator */}
                {isActive && (
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    border="3px solid"
                    borderColor="rgba(255, 255, 255, 0.6)"
                    borderRadius={tokens.radius.xl}
                    animation="pulse 2s infinite"
                  />
                )}

                {/* Shimmer Effect */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  background="linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)"
                  transform="translateX(-100%)"
                  animation={isActive ? "shimmer 2s infinite" : undefined}
                  pointerEvents="none"
                />
              </Box>

              {/* Connection Lines */}
              {index < segments.length - 1 && (
                <Box
                  position="absolute"
                  top="50%"
                  right="-16px"
                  width="32px"
                  height="3px"
                  bg={useColorModeValue("gray.300", "gray.600")}
                  transform="translateY(-50%)"
                  borderRadius="full"
                  opacity={0.6}
                  zIndex={0}
                />
              )}
            </Box>
          )
        })}
      </Box>

      {/* Global Animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
              transition: none !important;
            }
          }
        `}
      </style>
    </VStack>
  )
} 