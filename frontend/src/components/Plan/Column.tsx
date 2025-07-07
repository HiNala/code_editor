import { Box, Heading } from "@chakra-ui/react"
import { ReactNode, useCallback } from "react"

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
  bg,
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
      py={2}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      bg={bg}
      _dark={{ bg: bg?.replace(".50", ".700") }}
      borderRadius="md"
    >
      <Heading size="md" mb={4} textAlign="center">
        {title}
      </Heading>
      <Box minH="100px">{children}</Box>
    </Box>
  )
}
