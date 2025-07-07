import { Box, Text } from "@chakra-ui/react"
import { memo } from "react"

export interface CardProps {
  id: string
  title: string
  description?: string
}

function Card({ id, title, description }: CardProps) {
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
      <Text
        fontWeight="bold"
        mb={1}
        style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {title}
      </Text>
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
