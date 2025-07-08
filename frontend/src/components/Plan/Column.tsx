import { Box, Heading, Badge, Flex, Text } from "@chakra-ui/react"
import { ReactNode, useCallback, useState } from "react"
import { tokens, gradients } from "../../theme/tokens"
import { useColorModeValue } from "../ui/color-mode"

export interface ColumnProps {
  id: string
  title: string
  children: ReactNode
  onCardDrop: (cardId: string, toColumnId: string) => void
  bg?: string
}

export default function Column({
  id,
  title,
  onCardDrop,
  children,
}: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  
  // Theme colors
  const columnBg = useColorModeValue(tokens.colors.surfaceWhite, tokens.colors.dark.surfaceCard)
  const headerBg = useColorModeValue(tokens.colors.surface, tokens.colors.dark.surface)
  const textColor = useColorModeValue(tokens.colors.charcoal900, tokens.colors.dark.text)
  const mutedTextColor = useColorModeValue(tokens.colors.charcoal500, tokens.colors.dark.textSecondary)
  const borderColor = useColorModeValue(tokens.colors.charcoal300, tokens.colors.charcoal700)
  
  // Count cards
  const cardCount = Array.isArray(children) ? children.length : children ? 1 : 0
  
  // Get column gradient based on ID
  const getColumnGradient = () => {
    switch (id) {
      case "idea":
        return gradients.plan
      case "progress":
        return gradients.sunset
      case "done":
        return gradients.publish
      default:
        return gradients.sunset
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragOver(false)
      
      const data = e.dataTransfer.getData("application/json")
      if (!data) return
      try {
        const { cardId } = JSON.parse(data)
        if (cardId) {
          onCardDrop(cardId, id)
        }
      } catch {
        /* empty */
      }
    },
    [id, onCardDrop],
  )

  return (
    <Box
      w={{ base: "100%", md: "33.33%" }}
      px={2}
      py={2}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
      transform={isDragOver ? "scale(1.02)" : "scale(1)"}
      boxShadow={isDragOver ? tokens.shadows.lg : "none"}
    >
      <Box
        bg={columnBg}
        borderRadius={tokens.radius.lg}
        boxShadow={tokens.shadows.md}
        overflow="hidden"
        border="1px solid"
        borderColor={borderColor}
        h="full"
        minH="500px"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: getColumnGradient(),
        }}
      >
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          px={6}
          py={4}
          bg={headerBg}
          borderBottom="1px solid"
          borderBottomColor={borderColor}
        >
          <Heading 
            size="md" 
            color={textColor}
            fontWeight={tokens.typography.fontWeights.bold}
            fontSize={tokens.typography.fontSizes.h3}
          >
            {title}
          </Heading>
          
          {/* Task counter badge */}
          <Badge
            variant="subtle"
            colorScheme="gray"
            borderRadius={tokens.radius.pill}
            px={3}
            py={1}
            fontSize="sm"
            fontWeight={tokens.typography.fontWeights.semibold}
            background={getColumnGradient()}
            color="white"
            border="1px solid"
            borderColor="rgba(255,255,255,0.2)"
          >
            {cardCount}
          </Badge>
        </Flex>

        {/* Content Area */}
        <Box 
          p={4}
          minH="400px"
          position="relative"
          _after={isDragOver ? {
            content: '""',
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${getColumnGradient()}10, ${getColumnGradient()}05)`,
            borderRadius: tokens.radius.md,
            border: `2px dashed ${getColumnGradient()}`,
            pointerEvents: "none",
          } : {}}
        >
          {children}
          
          {/* Empty state */}
          {cardCount === 0 && (
            <Flex
              direction="column"
              align="center"
              justify="center"
              minH="200px"
              textAlign="center"
              color={mutedTextColor}
            >
              <Text fontSize="lg" mb={2}>
                No items yet
              </Text>
              <Text fontSize="sm" opacity={0.7}>
                Drag cards here or create new ones
              </Text>
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  )
}
