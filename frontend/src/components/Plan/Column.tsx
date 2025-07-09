import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react"
import { type ReactNode, useCallback, useState } from "react"
import { FiPlus } from "react-icons/fi"
import { gradients, tokens } from "../../theme/tokens"
import { useColorModeValue } from "../ui/color-mode"

export interface ColumnProps {
  id: string
  title: string
  children: ReactNode
  onCardDrop: (cardId: string, toColumnId: string) => void
}

export default function Column({
  id,
  title,
  onCardDrop,
  children,
}: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  // Theme colors following Apple-CRE8ABLE spec
  const surfaceCard = useColorModeValue("#FFFFFF", "#1C1C1E")
  const textPrimary = useColorModeValue("#1D1D1F", "#FFFFFF")
  const textSecondary = useColorModeValue("#8E8E93", "#8E8E8E")

  // Count cards
  const cardCount = Array.isArray(children) ? children.length : children ? 1 : 0

  // Get column gradient and config based on ID
  const getColumnConfig = () => {
    switch (id) {
      case "idea":
        return {
          gradient: gradients.plan,
          color: tokens.colors.accentPlan,
          title: "Ideas",
          description: "Capture your creative sparks",
        }
      case "progress":
        return {
          gradient: gradients.sunset,
          color: tokens.colors.gradientSunsetStart,
          title: "In Progress",
          description: "Bringing ideas to life",
        }
      case "done":
        return {
          gradient: gradients.publish,
          color: tokens.colors.accentPublish,
          title: "Done",
          description: "Ready to share with the world",
        }
      default:
        return {
          gradient: gradients.sunset,
          color: tokens.colors.gradientSunsetStart,
          title: title,
          description: "Your creative workspace",
        }
    }
  }

  const columnConfig = getColumnConfig()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only set drag over to false if we're actually leaving the column
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false)
    }
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
      flex="1"
      minW="320px"
      mx="16px" // 32px total gap (16px each side)
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      transition="all 300ms cubic-bezier(0.4, 0, 0.2, 1)"
      transform={isDragOver ? "scale(1.02)" : "scale(1)"}
    >
      <Box
        bg={surfaceCard}
        borderRadius="12px"
        overflow="hidden"
        minH="600px"
        position="relative"
        // Apple-inspired shadow
        boxShadow={
          isDragOver
            ? "0 8px 24px rgba(0,0,0,0.12)"
            : "0 2px 8px rgba(0,0,0,0.04)"
        }
        // Gradient bottom border instead of top
        _after={{
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: columnConfig.gradient,
        }}
      >
        {/* Column Header */}
        <Box
          px="24px"
          py="20px"
          borderBottom="1px solid"
          borderBottomColor={useColorModeValue(
            "rgba(0,0,0,0.06)",
            "rgba(255,255,255,0.06)",
          )}
        >
          <Flex align="center" justify="space-between" mb="8px">
            <Heading
              fontSize="36px"
              lineHeight="44px"
              fontWeight="600"
              color={textPrimary}
            >
              {columnConfig.title}
            </Heading>

            {/* Task counter badge with gradient border */}
            <Box
              position="relative"
              p="1px"
              borderRadius="50%"
              background={columnConfig.gradient}
            >
              <Flex
                align="center"
                justify="center"
                w="32px"
                h="32px"
                bg={surfaceCard}
                borderRadius="50%"
                fontSize="14px"
                fontWeight="600"
                color={columnConfig.color}
              >
                {cardCount}
              </Flex>
            </Box>
          </Flex>

          <Text fontSize="14px" lineHeight="20px" color={textSecondary}>
            {columnConfig.description}
          </Text>
        </Box>

        {/* Content Area */}
        <Box p="24px" minH="500px" position="relative">
          {/* Drag-over visual feedback */}
          {isDragOver && (
            <Box
              position="absolute"
              inset="24px"
              borderRadius="8px"
              border="2px dashed"
              borderColor={columnConfig.color}
              background={`linear-gradient(135deg, ${columnConfig.color}05, ${columnConfig.color}02)`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={1}
              pointerEvents="none"
            >
              <Text fontSize="16px" fontWeight="500" color={columnConfig.color}>
                Drop card here
              </Text>
            </Box>
          )}

          {children}

          {/* Elegant empty state */}
          {cardCount === 0 && !isDragOver && (
            <Flex
              direction="column"
              align="center"
              justify="center"
              minH="300px"
              textAlign="center"
              opacity={0.6}
            >
              {/* Gradient outline icon */}
              <Box
                position="relative"
                mb="20px"
                p="2px"
                borderRadius="50%"
                background={columnConfig.gradient}
              >
                <Flex
                  align="center"
                  justify="center"
                  w="48px"
                  h="48px"
                  bg={surfaceCard}
                  borderRadius="50%"
                >
                  <Icon
                    as={FiPlus}
                    w="24px"
                    h="24px"
                    color={columnConfig.color}
                  />
                </Flex>
              </Box>

              <Text
                fontSize="18px"
                lineHeight="28px"
                fontWeight="600"
                color={textPrimary}
                mb="8px"
              >
                Ready to spark your next idea?
              </Text>

              <Text
                fontSize="14px"
                lineHeight="20px"
                color={textSecondary}
                maxW="200px"
              >
                Drag cards here or create new ones to get started
              </Text>
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
  )
}
