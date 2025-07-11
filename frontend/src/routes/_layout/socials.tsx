import { createFileRoute } from '@tanstack/react-router'
import { Container, Heading, Text } from '@chakra-ui/react'

export const Route = createFileRoute(
  '/_layout/socials'
)(
  {
    component: SocialsPage,
  }
)

function SocialsPage() {
  const { creationId } = Route.useParams() as { creationId: string }
  return (
    <Container maxW="full" py={8}>
      <Heading size="lg" mb={4}>
        Schedule Social Post
      </Heading>
      <Text>Creation ID: {creationId}</Text>
      {/* TODO: implement social media scheduling UI */}
    </Container>
  )
}

export default SocialsPage