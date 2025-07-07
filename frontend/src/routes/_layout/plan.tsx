import { Container, Heading } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

import Board from "@/components/Plan/Board"
import AddItem from "@/components/Items/AddItem"

export const Route = createFileRoute("/_layout/plan")({
  component: PlanPage,
})

function PlanPage() {
  return (
    <Container maxW="full" py={12}>
      <Heading size="lg" mb={8} textAlign={{ base: "center", md: "left" }}>
        Planning Board
      </Heading>
      <AddItem />
      <Board />
    </Container>
  )
}

export default PlanPage
