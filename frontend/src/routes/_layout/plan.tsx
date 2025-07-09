import { Container } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

import AddItem from "@/components/Items/AddItem"
import Board from "@/components/Plan/Board"

export const Route = createFileRoute("/_layout/plan")({
  component: PlanPage,
})

function PlanPage() {
  return (
    <Container maxW="full" py={4}>
      <AddItem />
      <Board />
    </Container>
  )
}

export default PlanPage
