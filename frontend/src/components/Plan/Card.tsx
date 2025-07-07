import { Box, Flex, Text } from "@chakra-ui/react"
import { memo } from "react"

import type { ItemPublic } from "@/client"

import CardActionsMenu from "./CardActionsMenu"

export interface CardProps {
  item: ItemPublic
}

function Card({ item }: CardProps) {
  const { id, title, description } = item
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ cardId: id })
    )
  }

  return (
    <Box
      draggable
      onDragStart={handleDragStart}
      bg="white"
      borderRadius="md"
      p={3}
      mb={4}
      boxShadow="sm"
      _dark={{ bg: "gray.700" }}
      cursor="grab"
    >
      <Flex align="start" justify="space-between" gap={2}>
        <Text
          fontWeight="bold"
          mb={1}
          flex="1"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title} 
        </Text>
        <CardActionsMenu item={item} />
      </Flex>
      {description && (
        <Text
          fontSize="sm"
          color="gray.500"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Text>
      )}
    </Box>
  )
}

export default memo(Card)
