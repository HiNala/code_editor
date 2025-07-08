import { Box, Flex, Text } from "@chakra-ui/react"
import { memo, useState } from "react"
import { tokens } from "../../theme/tokens"
import { useColorModeValue } from "../ui/color-mode"

import type { ItemPublic } from "@/client"

import CardActionsMenu from "./CardActionsMenu"

export interface CardProps {
  item: ItemPublic
}

// Priority colors with gradient support
const getPriorityConfig = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case "urgent":
      return {
        color: `linear-gradient(135deg, ${tokens.colors.gradientSunsetStart}, ${tokens.colors.gradientSunsetEnd})`,
        label: "URGENT",
        isPulsing: true,
      }
    case "high":
      return {
        color: `linear-gradient(135deg, ${tokens.colors.gradientSunsetStart}, ${tokens.colors.gradientSunsetEnd})`,
        label: "HIGH",
        isPulsing: false,
      }
    case "medium":
      return {
        color: tokens.colors.accentPlan,
        label: "MEDIUM",
        isPulsing: false,
      }
    case "low":
      return {
        color: tokens.colors.accentPublish,
        label: "LOW",
        isPulsing: false,
      }
    default:
      return {
        color: tokens.colors.accentPlan,
        label: "MEDIUM",
        isPulsing: false,
      }
  }
}

function Card({ item, onSelect }: CardProps & { onSelect?: (i: ItemPublic) => void }) {
  const { id, title, description } = item
  const [isDragging, setIsDragging] = useState(false)
  
  // Theme colors following Apple-CRE8ABLE spec
  const cardBg = useColorModeValue("#FFFFFF", "#1C1C1E")
  const textPrimary = useColorModeValue("#1D1D1F", "#FFFFFF")
  const textSecondary = useColorModeValue("#8E8E93", "#8E8E8E")
  
  // Priority configuration
  const priority = "medium" // Default priority, can be made dynamic
  const priorityConfig = getPriorityConfig(priority)
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true)
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ cardId: id })
    )
    
    // Set drag effect
    e.dataTransfer.effectAllowed = "move"
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
      borderRadius="12px"
      p="16px"
      mb="16px"
      position="relative"
      overflow="hidden"
      cursor="grab"
      // Apple-inspired shadow with CRE8ABLE touch
      boxShadow={isDragging 
        ? "0 12px 24px rgba(0,0,0,0.12)" 
        : "0 2px 4px rgba(0,0,0,0.04)"
      }
      // Inner highlight for depth
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(90deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 100%)",
        opacity: isDragging ? 0.8 : 0.65,
      }}
      // Priority stripe (left edge)
      _after={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "4px",
        background: priorityConfig.color,
        animation: priorityConfig.isPulsing ? "pulse 800ms ease-in-out infinite alternate" : "none",
      }}
      // Elegant transitions
      transition="all 300ms cubic-bezier(0.4, 0, 0.2, 1)"
      transform={isDragging ? "scale(0.95)" : "scale(1)"}
      opacity={isDragging ? 0.9 : 1}
      // Hover state
      _hover={{
        transform: isDragging ? "scale(0.95)" : "translateY(-2px)",
        boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
        _before: {
          opacity: 0.85,
        }
      }}
      // Active state
      _active={{
        cursor: "grabbing",
        transform: "scale(0.98)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
      }}
      onClick={() => onSelect?.(item)}
    >
      {/* Card Header */}
      <Flex align="flex-start" justify="space-between" mb="8px">
        <Text
          fontSize="18px"
          lineHeight="28px"
          fontWeight="600"
          color={textPrimary}
          letterSpacing="0.5px"
          flex="1"
          pr="8px"
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
          fontSize="14px"
          lineHeight="20px"
          color={textSecondary}
          mb="12px"
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
      
      {/* Priority Label */}
      <Box mt="8px">
        <Text
          fontSize="12px"
          lineHeight="20px"
          fontWeight="500"
          color={typeof priorityConfig.color === 'string' && priorityConfig.color.startsWith('linear-gradient') 
            ? tokens.colors.gradientSunsetStart 
            : priorityConfig.color}
          textTransform="uppercase"
          letterSpacing="0.5px"
        >
          {priorityConfig.label} PRIORITY
        </Text>
      </Box>
    </Box>
  )
}

export default memo(Card)
