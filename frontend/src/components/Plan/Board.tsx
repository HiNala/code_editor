import { Flex } from "@chakra-ui/react"
import { nanoid } from "nanoid"
import { useCallback, useState } from "react"

import Card from "./Card"
import Column from "./Column"

export interface CardType {
  id: string
  title: string
  description?: string
}

export interface ColumnType {
  id: string
  title: string
  cards: CardType[]
}

const initialColumns: ColumnType[] = [
  {
    id: "idea",
    title: "Ideas",
    cards: [
      { id: nanoid(), title: "Video about React", description: "Hook overview" },
      { id: nanoid(), title: "Tweet thread: AI Tools" },
    ],
  },
  {
    id: "production",
    title: "In Production",
    cards: [
      { id: nanoid(), title: "Shorts on FastAPI", description: "fastapi basics" },
    ],
  },
  {
    id: "scheduled",
    title: "Scheduled",
    cards: [],
  },
]

export default function Board() {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns)

  const handleCardDrop = useCallback(
    (cardId: string, toColumnId: string) => {
      setColumns((prev) => {
        const newCols = prev.map((col) => ({ ...col, cards: [...col.cards] }))

        let movedCard: CardType | null = null
        // remove card from original column
        newCols.forEach((col) => {
          const idx = col.cards.findIndex((c) => c.id === cardId)
          if (idx !== -1) {
            movedCard = col.cards.splice(idx, 1)[0]
          }
        })

        if (!movedCard) return prev

        // add to target column end
        const targetCol = newCols.find((c) => c.id === toColumnId)
        if (targetCol) {
          targetCol.cards.push(movedCard)
        }

        return newCols
      })
    },
    [],
  )

  return (
    <Flex direction={{ base: "column", md: "row" }} gap={4}>
      {columns.map((col) => (
        <Column
          key={col.id}
          id={col.id}
          title={col.title}
          onCardDrop={handleCardDrop}
        >
          {col.cards.map((c) => (
            <Card key={c.id} id={c.id} title={c.title} description={c.description} />
          ))}
        </Column>
      ))}
    </Flex>
  )
}
