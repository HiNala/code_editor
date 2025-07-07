import { Container, Heading, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/create")({
  component: CreatePage,
})

function CreatePage() {
  return (
    <Container maxW="full">
      <Heading size="lg" pt={12}>
        Creation Studio
      </Heading>
      <Text mt={4} color="gray">
        Generate, edit and finalise your content assets with AI-assisted tools. (Coming
        soon)
      </Text>
    </Container>
  )
}

export default CreatePage
