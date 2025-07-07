import { Flex } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"

import { ItemsService, type ItemPublic } from "@/client"

import Card from "./Card"
import Column from "./Column"

import {
  DrawerRoot,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerCloseTrigger,
} from "@/components/ui/drawer"

import ChatPanel from "@/components/Chat/ChatPanel"

export interface ColumnType {
  id: string
  title: string
  cards: ItemPublic[]
  bg: string
}

const EMPTY_COLUMNS: ColumnType[] = [
  { id: "idea", title: "Ideas", cards: [], bg: "gray.50" },
  { id: "progress", title: "In Progress", cards: [], bg: "pink.50" },
  { id: "done", title: "Done", cards: [], bg: "orange.50" },
]

function buildColumns(items: ItemPublic[]): ColumnType[] {
  const mappingRaw = localStorage.getItem("plan-board-mapping")
  const mapping: Record<string, string> = mappingRaw ? JSON.parse(mappingRaw) : {}

  const cols: ColumnType[] = [
    { id: "idea", title: "Ideas", cards: [], bg: "gray.50" },
    { id: "progress", title: "In Progress", cards: [], bg: "pink.50" },
    { id: "done", title: "Done", cards: [], bg: "orange.50" },
  ]

  items.forEach((item) => {
    const colId = mapping[item.id] ?? "idea"
    const column = cols.find((c) => c.id === colId) ?? cols[0]
    column.cards.push(item)
  })

  return cols
}

export default function Board() {
  const [columns, setColumns] = useState<ColumnType[]>(EMPTY_COLUMNS)
  const [selected, setSelected] = useState<ItemPublic | null>(null)
  const [open, setOpen] = useState(false)

  const { data } = useQuery({
    queryKey: ["items"],
    queryFn: () => ItemsService.readItems({ skip: 0, limit: 100 }),
  })

  // When items change, populate idea column
  useEffect(() => {
    if (data) {
      setColumns(buildColumns(data.data))
    }
  }, [data])

  const handleCardDrop = useCallback(
    (cardId: string, toColumnId: string) => {
      setColumns((prev) => {
        const newCols = prev.map((col) => ({ ...col, cards: [...col.cards] }))

        let movedCard: ItemPublic | null = null
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

        // persist mapping
        const mappingRaw = localStorage.getItem("plan-board-mapping")
        const mapping: Record<string, string> = mappingRaw ? JSON.parse(mappingRaw) : {}
        mapping[cardId] = toColumnId
        localStorage.setItem("plan-board-mapping", JSON.stringify(mapping))

        return newCols
      })
    },
    [],
  )

  return (
    <>
      <Flex direction={{ base: "column", md: "row" }} gap={4}>
      {columns.map((col) => (
        <Column
          key={col.id}
          id={col.id}
          title={col.title}
          onCardDrop={handleCardDrop}
          bg={col.bg}
        >
          {col.cards.map((item) => (
            <Card
              key={item.id}
              item={item}
              onSelect={(it) => {
                setSelected(it)
                setOpen(true)
              }}
            />
          ))}
        </Column>
      ))}
      </Flex>

      <DrawerRoot open={open} onOpenChange={({ open }) => setOpen(open)} placement="end">
        <DrawerBackdrop />
        <DrawerContent w="60vw" maxW="60vw">
          <DrawerHeader borderBottomWidth="1px">
            <DrawerTitle>{selected?.title}</DrawerTitle>
            <DrawerCloseTrigger />
          </DrawerHeader>
          <DrawerBody p={0}>
            {selected && <ChatPanel threadId={selected.id} />}
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </>
  )
}
