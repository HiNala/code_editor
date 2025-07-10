import { createFileRoute } from "@tanstack/react-router"
import { Box, VStack, Text, HStack } from "@chakra-ui/react"
import { useRef, useState, useEffect } from "react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
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
      flex="0 0 220px"
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
        height="120px"
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
          fontSize={tokens.typography.fontSizes.bodySm}
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
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateScrollState = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", updateScrollState)
      updateScrollState() // initial check
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollState)
      }
    }
  }, [])

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

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
      <HStack align="center" gap={4} width="100%">
        {/* Left Chevron */}
        <Box
          opacity={canScrollLeft ? 1 : 0.3}
          cursor={canScrollLeft ? "pointer" : "default"}
          onClick={canScrollLeft ? handleScrollLeft : undefined}
          transition="opacity 200ms"
          _hover={canScrollLeft ? { opacity: 0.7 } : {}}
          minW="24px"
        >
          <FiChevronLeft size={24} />
        </Box>

        {/* Cards Container - showing exactly 4 cards */}
        <Box
          flex="1"
          overflow="hidden"
          position="relative"
        >
          <HStack
            gap={3}
            overflowX="auto"
            ref={scrollContainerRef}
            css={{
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} title={project.title} />
            ))}
          </HStack>
        </Box>

        {/* Right Chevron */}
        <Box
          opacity={canScrollRight ? 1 : 0.3}
          cursor={canScrollRight ? "pointer" : "default"}
          onClick={canScrollRight ? handleScrollRight : undefined}
          transition="opacity 200ms"
          _hover={canScrollRight ? { opacity: 0.7 } : {}}
          minW="24px"
        >
          <FiChevronRight size={24} />
        </Box>
      </HStack>
    </VStack>
  )
}

function Dashboard() {
  const handleStateChange = (state: string) => {
    console.log("Workflow state changed to:", state)
    // Here you can add navigation logic or other actions based on the state
  }

  return (
    <Box
      minH="100vh"
      position="relative"
      p={{ base: 4, md: 8 }}
      display="flex"
      flexDirection="column"
    >
      {/* Upper section with WorkflowWheel */}
      <Box
        height={{ base: "50vh", md: "55vh" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={{ base: 4, md: 8 }}
      >
        <Box transform={["scale(0.8)", "scale(1.0)"]} transformOrigin="center">
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
        <VStack gap={{ base: 4, md: 8 }} align="stretch" height="100%">
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
