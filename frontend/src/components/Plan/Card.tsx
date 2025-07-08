import { Box, Flex, Text } from "@chakra-ui/react"
import { memo, useState } from "react"
import { tokens } from "../../theme/tokens"
import { useColorModeValue } from "../ui/color-mode"

import type { ItemPublic } from "@/client"

import CardActionsMenu from "./CardActionsMenu"

export interface CardProps {
  item: ItemPublic
}

// Priority colors for left stripe
const getPriorityColor = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return tokens.colors.danger
    case "medium":
      return tokens.colors.warning
    case "low":
      return tokens.colors.accentPlan
    default:
      return tokens.colors.accentPlan
  }
}

function Card({ item, onSelect }: CardProps & { onSelect?: (i: ItemPublic) => void }) {
  const { id, title, description } = item
  const [isDragging, setIsDragging] = useState(false)
  
  // Theme colors
  const cardBg = useColorModeValue(tokens.colors.surfaceWhite, tokens.colors.dark.surfaceCard)
  const textColor = useColorModeValue(tokens.colors.charcoal900, tokens.colors.dark.text)
  const mutedTextColor = useColorModeValue(tokens.colors.charcoal500, tokens.colors.dark.textSecondary)
  const borderColor = useColorModeValue(tokens.colors.charcoal300, tokens.colors.charcoal700)
  
  // Get priority from item (assuming it might be added later)
  const priority = "medium" // Default priority, can be made dynamic
  const priorityColor = getPriorityColor(priority)
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true)
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ cardId: id })
    )
    
    // Create ghost image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement
    dragImage.style.transform = "scale(0.9)"
    dragImage.style.opacity = "0.4"
    dragImage.style.filter = "blur(2px)"
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 0, 0)
    
    // Clean up ghost image after drag
    setTimeout(() => {
      document.body.removeChild(dragImage)
    }, 0)
  }
  
  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <Box
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      bg={cardBg}
      borderRadius={tokens.radius.md}
      p={4}
      mb={4}
      boxShadow={tokens.shadows.sm}
      border="1px solid"
      borderColor={borderColor}
      cursor="grab"
      position="relative"
      overflow="hidden"
      transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
      transform={isDragging ? "scale(0.95)" : "scale(1)"}
      opacity={isDragging ? 0.8 : 1}
      _hover={{
        boxShadow: tokens.shadows.gradient,
        transform: "translateY(-2px)",
        borderColor: tokens.colors.gradientSunsetStart,
      }}
      _active={{
        cursor: "grabbing",
        transform: "translateY(0)",
      }}
      onClick={() => onSelect?.(item)}
      // Left priority stripe
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "4px",
        background: priorityColor,
      }}
    >
      {/* Header */}
      <Flex align="start" justify="space-between" gap={2} mb={2}>
        <Text
          fontWeight={tokens.typography.fontWeights.semibold}
          fontSize={tokens.typography.fontSizes.bodySm}
          color={textColor}
          flex="1"
          lineHeight="1.4"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </Text>
        <CardActionsMenu item={item} />
      </Flex>
      
      {/* Description */}
      {description && (
        <Text
          fontSize={tokens.typography.fontSizes.caption}
          color={mutedTextColor}
          lineHeight="1.5"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Text>
      )}
      
      {/* Priority indicator */}
      <Flex align="center" justify="space-between" mt={3}>
        <Box
          fontSize="xs"
          fontWeight={tokens.typography.fontWeights.medium}
          color={priorityColor}
          textTransform="uppercase"
          letterSpacing="0.5px"
        >
          {priority} priority
        </Box>
        
        {/* Subtle gradient overlay on hover */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          background={`linear-gradient(135deg, ${tokens.colors.gradientSunsetStart}02, ${tokens.colors.gradientSunsetEnd}02)`}
          opacity={0}
          transition={`opacity ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
          _groupHover={{
            opacity: 1,
          }}
          pointerEvents="none"
        />
      </Flex>
    </Box>
  )
}

export default memo(Card)
