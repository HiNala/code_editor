import { createFileRoute } from "@tanstack/react-router"
import { Box, VStack, Text, HStack } from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui/color-mode"
import { tokens } from "@/theme/tokens"

import WorkflowWheel from "@/components/Common/WorkflowWheel"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})

// Placeholder project data
const placeholderProjects = [
  { id: 1, title: "Project Alpha", thumbnail: "/api/placeholder/300/200" },
  { id: 2, title: "Project Beta", thumbnail: "/api/placeholder/300/200" },
  { id: 3, title: "Project Gamma", thumbnail: "/api/placeholder/300/200" },
  { id: 4, title: "Project Delta", thumbnail: "/api/placeholder/300/200" },
  { id: 5, title: "Project Echo", thumbnail: "/api/placeholder/300/200" },
  { id: 6, title: "Project Foxtrot", thumbnail: "/api/placeholder/300/200" },
]

function ProjectCard({ title }: { title: string }) {
  const cardBg = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.900", "white")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  return (
    <Box
      flex="0 0 180px"
      bg={cardBg}
      borderRadius={tokens.radius.lg}
      overflow="hidden"
      border="1px solid"
      borderColor={borderColor}
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: tokens.shadows.lg,
      }}
      transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
      cursor="pointer"
    >
      <Box
        height="100px"
        bg="gray.200"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="gray.500"
        fontSize="xs"
      >
        {title} Thumbnail
      </Box>
      <Box p={2}>
        <Text
          fontSize={tokens.typography.fontSizes.caption}
          fontWeight={tokens.typography.fontWeights.medium}
          color={textColor}
        >
          {title}
        </Text>
      </Box>
    </Box>
  )
}

function ProjectSection({ title, projects }: { title: string; projects: typeof placeholderProjects }) {
  const textColor = useColorModeValue("gray.900", "white")

  return (
    <VStack align="stretch" gap={3} width="100%">
      <Text
        fontSize={tokens.typography.fontSizes.bodyLg}
        fontWeight={tokens.typography.fontWeights.bold}
        color={textColor}
        fontFamily={tokens.typography.fontFamily.primary}
      >
        {title}
      </Text>
      <HStack gap={3} width="100%" justify="space-between">
        {projects.map((project) => (
          <ProjectCard key={project.id} title={project.title} />
        ))}
      </HStack>
    </VStack>
  )
}

function Dashboard() {
  const bgColor = useColorModeValue("gray.50", "gray.900")

  const handleStateChange = (state: string) => {
    console.log("Workflow state changed to:", state)
    // Here you can add navigation logic or other actions based on the state
  }

  return (
    <Box
      minH="100vh"
      bg={bgColor}
      position="relative"
      p={8}
      display="flex"
      flexDirection="column"
    >
      {/* Upper section with WorkflowWheel */}
      <Box
        height="40vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={8}
      >
        <Box transform="scale(0.7)" transformOrigin="center">
          <WorkflowWheel onStateChange={handleStateChange} />
        </Box>
      </Box>

      {/* Project Sections - taking remaining space */}
      <Box
        flex="1"
        maxWidth="1400px"
        mx="auto"
        width="100%"
      >
        <VStack gap={8} align="stretch" height="100%">
          <Box flex="1">
            <ProjectSection title="Your Feed" projects={placeholderProjects} />
          </Box>
          <Box flex="1">
            <ProjectSection title="Inspiration" projects={placeholderProjects} />
          </Box>
        </VStack>
      </Box>
    </Box>
  )
}

export default Dashboard
