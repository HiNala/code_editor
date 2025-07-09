import { useState, useEffect } from "react"
import { Box, Container, Text, HStack, Badge } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

import useAuth from "@/hooks/useAuth"
import StepRail from "@/components/Navigation/StepRail"
import ProjectGallery from "@/components/Common/ProjectGallery"
import FloatingActionWheel from "@/components/Common/FloatingActionWheel"
import { useColorModeValue } from "@/components/ui/color-mode"
import { tokens, gradients, ghostWatermark } from "@/theme/tokens"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})

// Mock data - in a real app this would come from your backend
const mockProjects = [
  {
    id: "1",
    title: "The Exact Content Blueprint That Made Me Multi 6 Figures",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    type: "VIDEO" as const,
    lastModified: new Date("2024-01-15"),
    isFavorite: true,
    isShared: false,
    status: "PUBLISHED" as const,
  },
  {
    id: "2", 
    title: "Brand Identity Design System",
    type: "DESIGN" as const,
    lastModified: new Date("2024-01-10"),
    isFavorite: false,
    isShared: true,
    status: "DRAFT" as const,
  },
  {
    id: "3",
    title: "Social Media Template Pack",
    type: "TEMPLATE" as const,
    lastModified: new Date("2024-01-08"),
    isFavorite: false,
    isShared: false,
    status: "PUBLISHED" as const,
  },
  {
    id: "4",
    title: "Product Launch Video",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    type: "VIDEO" as const,
    lastModified: new Date("2024-01-05"),
    isFavorite: true,
    isShared: true,
    status: "DRAFT" as const,
  },
]

const rotatingMessages = [
  "Ready to bring your creative ideas to life? ✨",
  "Your next breakthrough project awaits 🚀",
  "Transform inspiration into impact 💡",
  "Create something amazing today 🎨",
  "Bold creativity made simple 🌟"
]

function Dashboard() {
  const { user: currentUser } = useAuth()
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  
  const dashboardBg = useColorModeValue(tokens.colors.surfaceDashboard, tokens.colors.dark.surfaceDashboard)
  const textColor = useColorModeValue(tokens.colors.textHero, tokens.colors.dark.textHero)
  const secondaryText = useColorModeValue("gray.600", "gray.400")
  const ghostColor = useColorModeValue("rgba(0,0,0,0.04)", "rgba(255,255,255,0.04)")

  // Rotate welcome messages every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % rotatingMessages.length)
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  // Calculate quick stats from projects
  const totalProjects = mockProjects.length
  const publishedProjects = mockProjects.filter(p => p.status === "PUBLISHED").length
  const inProgressProjects = mockProjects.filter(p => p.status === "DRAFT").length

  const handleActionWheel = {
    onNewProject: () => {
      console.log("Create new project")
      // Navigate to create page or open modal
    },
    onUseTemplate: () => {
      console.log("Use template")
      // Navigate to template gallery
    },
    onImportFile: () => {
      console.log("Import file")
      // Open file picker
    },
    onFromURL: () => {
      console.log("Add from URL")
      // Navigate to videos page or open URL input
    },
    onCollaborate: () => {
      console.log("Collaborate")
      // Open collaboration modal
    },
    onQuickSettings: () => {
      console.log("Quick settings")
      // Navigate to settings
    }
  }

  const handleProjectActions = {
    onCreateNew: () => {
      console.log("Create new project from gallery")
    },
    onEditProject: (id: string) => {
      console.log("Edit project:", id)
    },
    onDuplicateProject: (id: string) => {
      console.log("Duplicate project:", id)
    },
    onShareProject: (id: string) => {
      console.log("Share project:", id)
    },
    onOpenProject: (id: string) => {
      console.log("Open project:", id)
    }
  }

  return (
    <>
      {/* Ghost Watermark */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        fontSize={ghostWatermark.fontSize}
        fontWeight={ghostWatermark.fontWeight}
        color={ghostColor}
        zIndex={ghostWatermark.zIndex}
        pointerEvents="none"
        userSelect="none"
        fontFamily={tokens.typography.fontFamily.primary}
      >
        CRE8ABLE
      </Box>

      {/* Main Content */}
      <Box bg={dashboardBg} minH="100vh" position="relative">
        {/* Hero Section with StepRail */}
        <Box 
          bg={gradients.heroBackground}
          position="relative"
          overflow="hidden"
        >
          <Container maxW="full" py={8}>
            {/* Welcome Banner */}
            <Box textAlign="center" mb={8}>
              <Text 
                fontSize={tokens.typography.fontSizes.hero}
                fontWeight={tokens.typography.fontWeights.light}
                color={textColor}
                mb={4}
                lineHeight={tokens.typography.lineHeights.hero}
              >
                Welcome back, {currentUser?.full_name?.split(' ')[0] || "Creator"}!
              </Text>
              
              {/* Rotating sub-copy with cross-fade animation */}
              <Box position="relative" height="28px" mb={6}>
                {rotatingMessages.map((message, index) => (
                  <Text
                    key={index}
                    position="absolute"
                    top={0}
                    left="50%"
                    transform="translateX(-50%)"
                    fontSize={tokens.typography.fontSizes.subHero}
                    fontWeight={tokens.typography.fontWeights.normal}
                    color={secondaryText}
                    maxW="600px"
                    opacity={index === currentMessageIndex ? 1 : 0}
                    transition={`opacity ${tokens.motion.duration.slow} ${tokens.motion.easing.standard}`}
                    lineHeight={tokens.typography.lineHeights.subHero}
                  >
                    {message}
                  </Text>
                ))}
              </Box>

              {/* Quick Stats Chips */}
              <HStack justify="center" gap={4} mb={8}>
                <Badge
                  px={3}
                  py={2}
                  borderRadius={tokens.radius.pill}
                  fontSize={tokens.typography.fontSizes.caption}
                  fontWeight={tokens.typography.fontWeights.medium}
                  borderLeft="4px solid"
                  borderLeftColor={gradients.sunset}
                  bg={useColorModeValue("white", "gray.800")}
                  color={textColor}
                >
                  {totalProjects} Projects
                </Badge>
                <Badge
                  px={3}
                  py={2}
                  borderRadius={tokens.radius.pill}
                  fontSize={tokens.typography.fontSizes.caption}
                  fontWeight={tokens.typography.fontWeights.medium}
                  borderLeft="4px solid"
                  borderLeftColor={gradients.publish}
                  bg={useColorModeValue("white", "gray.800")}
                  color={textColor}
                >
                  {publishedProjects} Published
                </Badge>
                <Badge
                  px={3}
                  py={2}
                  borderRadius={tokens.radius.pill}
                  fontSize={tokens.typography.fontSizes.caption}
                  fontWeight={tokens.typography.fontWeights.medium}
                  borderLeft="4px solid"
                  borderLeftColor={gradients.plan}
                  bg={useColorModeValue("white", "gray.800")}
                  color={textColor}
                >
                  {inProgressProjects} In Progress
                </Badge>
              </HStack>
            </Box>
            
            {/* Step Navigation */}
            <StepRail />
          </Container>
        </Box>

        {/* Projects Gallery */}
        <Container maxW="full" py={8}>
          <ProjectGallery 
            projects={mockProjects}
            {...handleProjectActions}
          />
        </Container>

        {/* Floating Action Wheel */}
        <FloatingActionWheel {...handleActionWheel} />
      </Box>

      {/* Global animation styles */}
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </>
  )
}

export default Dashboard
