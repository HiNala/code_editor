import { Box, IconButton, Text } from "@chakra-ui/react"
import type React from "react"
import { useState } from "react"
import {
  FiFile,
  FiFileText,
  FiLink,
  FiPlus,
  FiSettings,
  FiUpload,
  FiUsers,
} from "react-icons/fi"
import { useColorModeValue } from "../ui/color-mode"

import { gradients, tokens } from "../../theme/tokens"

interface ActionItem {
  icon: React.ComponentType<{ size?: number }>
  label: string
  action: () => void
}

interface FloatingActionWheelProps {
  onNewProject?: () => void
  onUseTemplate?: () => void
  onImportFile?: () => void
  onFromURL?: () => void
  onCollaborate?: () => void
  onQuickSettings?: () => void
}

export default function FloatingActionWheel({
  onNewProject = () => {},
  onUseTemplate = () => {},
  onImportFile = () => {},
  onFromURL = () => {},
  onCollaborate = () => {},
  onQuickSettings = () => {},
}: FloatingActionWheelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const bgGradient = useColorModeValue(gradients.sunset, gradients.sunsetDark)
  const surfaceColor = useColorModeValue(
    tokens.colors.surfaceCard,
    tokens.colors.dark.surfaceCard,
  )
  const overlayBg = useColorModeValue("rgba(0,0,0,0.1)", "rgba(0,0,0,0.3)")

  const actions: ActionItem[] = [
    { icon: FiFile, label: "New Project", action: onNewProject },
    { icon: FiFileText, label: "Use Template", action: onUseTemplate },
    { icon: FiUpload, label: "Import File", action: onImportFile },
    { icon: FiLink, label: "From URL", action: onFromURL },
    { icon: FiUsers, label: "Collaborate", action: onCollaborate },
    { icon: FiSettings, label: "Quick Settings", action: onQuickSettings },
  ]

  const toggleWheel = () => setIsOpen(!isOpen)

  const handleActionClick = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  // Calculate positions for fan-out (120° arc, 6 items)
  const getChildPosition = (index: number) => {
    const totalItems = actions.length
    const startAngle = -60 // Start angle in degrees (top-left of arc)
    const angleStep = 120 / (totalItems - 1) // Distribute across 120°
    const angle = startAngle + index * angleStep
    const radian = (angle * Math.PI) / 180

    const radius = { base: 90, md: 110 } // Mobile: 90px, Desktop: 110px

    return {
      x: Math.cos(radian) * radius.base,
      y: Math.sin(radian) * radius.base,
      xMd: Math.cos(radian) * radius.md,
      yMd: Math.sin(radian) * radius.md,
    }
  }

  return (
    <>
      {/* Backdrop overlay when open */}
      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={overlayBg}
          backdropFilter="blur(6px)"
          zIndex={tokens.zIndex.actionWheel}
          onClick={() => setIsOpen(false)}
          animation={`fadeIn ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
        />
      )}

      {/* Action wheel container */}
      <Box
        position="fixed"
        bottom={tokens.actionWheel.main.offset}
        right={tokens.actionWheel.main.offset}
        zIndex={tokens.zIndex.actionWheel + 1}
      >
        {/* Child action buttons */}
        {actions.map((action, index) => {
          const pos = getChildPosition(index)
          const delay = `${index * Number.parseInt(tokens.motion.stagger.wheelChild)}ms`

          return (
            <Box
              key={action.label}
              position="absolute"
              transform={
                isOpen
                  ? {
                      base: `translate(${pos.x}px, ${pos.y}px)`,
                      md: `translate(${pos.xMd}px, ${pos.yMd}px)`,
                    }
                  : "translate(0, 0)"
              }
              opacity={isOpen ? 1 : 0}
              transition={`all ${tokens.motion.duration.slow} ${tokens.motion.easing.wheel} ${delay}`}
              bottom={0}
              right={0}
            >
              <IconButton
                size="lg"
                width={tokens.actionWheel.child.size}
                height={tokens.actionWheel.child.size}
                borderRadius={tokens.radius.full}
                bg={surfaceColor}
                color="gray.600"
                border="1px solid"
                borderColor={useColorModeValue(
                  tokens.colors.borderSubtle,
                  tokens.colors.dark.borderSubtle,
                )}
                _hover={{
                  bg: bgGradient,
                  color: "white",
                  transform: "scale(1.1)",
                  boxShadow: tokens.shadows.md,
                }}
                transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
                onClick={() => handleActionClick(action.action)}
                aria-label={action.label}
              >
                <action.icon size={20} />
              </IconButton>

              {/* Tooltip label */}
              <Text
                position="absolute"
                top="50%"
                right="calc(100% + 12px)"
                transform="translateY(-50%)"
                bg={useColorModeValue("gray.800", "gray.200")}
                color={useColorModeValue("white", "gray.800")}
                px={2}
                py={1}
                borderRadius={tokens.radius.md}
                fontSize={tokens.typography.fontSizes.caption}
                fontWeight={tokens.typography.fontWeights.medium}
                whiteSpace="nowrap"
                opacity={0}
                pointerEvents="none"
                _groupHover={{ opacity: 1 }}
                transition={`opacity ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`}
              >
                {action.label}
              </Text>
            </Box>
          )
        })}

        {/* Main action button */}
        <IconButton
          size="xl"
          width={tokens.actionWheel.main.size}
          height={tokens.actionWheel.main.size}
          borderRadius={tokens.radius.full}
          bg={bgGradient}
          color="white"
          transform={isOpen ? "rotate(45deg)" : "rotate(0deg)"}
          _hover={{
            transform: isOpen ? "rotate(45deg) scale(1.1)" : "scale(1.1)",
            boxShadow: tokens.shadows.gradient,
          }}
          transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
          onClick={toggleWheel}
          aria-label={isOpen ? "Close actions" : "Open actions"}
          aria-expanded={isOpen}
        >
          <FiPlus size={24} />
        </IconButton>
      </Box>

      {/* Global styles for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </>
  )
}
