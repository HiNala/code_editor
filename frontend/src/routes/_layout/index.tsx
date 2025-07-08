import { Box, Container, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

import useAuth from "@/hooks/useAuth"
import Gallery from "@/components/Videos/Gallery"
import StepRail from "@/components/Navigation/StepRail"
import { tokens } from "@/theme/tokens"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})

function Dashboard() {
  const { user: currentUser } = useAuth()

  return (
    <>
      {/* Hero Section with StepRail */}
      <Box 
        bg="linear-gradient(135deg, rgba(255, 102, 196, 0.02) 0%, rgba(255, 197, 77, 0.02) 100%)"
        position="relative"
        overflow="hidden"
      >
        <Container maxW="full" py={12}>
          {/* Welcome Message */}
          <Box textAlign="center" mb={8}>
            <Text 
              fontSize={tokens.typography.fontSizes.h1}
              fontWeight={tokens.typography.fontWeights.bold}
              className="gradient-sunset"
              mb={4}
            >
              Welcome Back!
            </Text>
            <Text 
              fontSize={tokens.typography.fontSizes.bodyLg}
              color="gray.600"
              maxW="600px"
              mx="auto"
            >
              Hi {currentUser?.full_name || currentUser?.email} 👋🏼 
              Ready to bring your creative ideas to life?
            </Text>
          </Box>
          
          {/* Step Navigation */}
          <StepRail />
        </Container>
      </Box>

      {/* Projects Gallery */}
      <Container maxW="full" py={8}>
        <Gallery />
      </Container>
    </>
  )
}
