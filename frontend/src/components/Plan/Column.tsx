import { Box, Heading } from "@chakra-ui/react"
import { ReactNode, useCallback } from "react"

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
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
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
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Heading size="md" mb={4} textAlign="center">
        {title}
      </Heading>
      <Box minH="100px">{children}</Box>
    </Box>
  )
}
