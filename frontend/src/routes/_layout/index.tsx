import { useState, useEffect } from "react"
import { Box, Container, Text, HStack, VStack, Badge } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { FiYoutube, FiFileText, FiUsers, FiEdit } from "react-icons/fi"

import useAuth from "@/hooks/useAuth"
import CentralWheel from "@/components/Common/CentralWheel"
import { useColorModeValue } from "@/components/ui/color-mode"
import { tokens, gradients } from "@/theme/tokens"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})

const inspirationalQuotes = [
  "Every great project starts with a single idea",
  "Creativity is intelligence having fun",
  "The best time to plant a tree was 20 years ago. The second best time is now",
  "Innovation distinguishes between a leader and a follower",
  "Bold creativity made simple"
]

const recentActivity = [
  { action: "You updated 'Marketing Video'", time: "2 hours ago" },
  { action: "Sarah shared 'Brand Guidelines' with you", time: "4 hours ago" },
  { action: "New template available: Social Media Kit", time: "1 day ago" },
  { action: "Team completed 'Product Launch' project", time: "2 days ago" },
]

const quickActions = [
  { icon: FiYoutube, label: "Import from YouTube", color: gradients.sunset },
  { icon: FiFileText, label: "Use Template", color: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)" },
  { icon: FiUsers, label: "Collaborate", color: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)" },
  { icon: FiEdit, label: "Quick Edit", color: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)" },
]

const recentProjects = [
  { id: "1", title: "Marketing Video", thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg", updated: "2h ago" },
  { id: "2", title: "Brand Guidelines", thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg", updated: "4h ago" },
  { id: "3", title: "Social Media Kit", thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg", updated: "1d ago" },
  { id: "4", title: "Product Launch", thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg", updated: "2d ago" },
]

const featuredTemplates = [
  { id: "1", title: "Social Media Pack", thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg" },
  { id: "2", title: "Presentation Deck", thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg" },
  { id: "3", title: "Brand Identity", thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg" },
]

function Dashboard() {
  const { user: currentUser } = useAuth()
  const [activeSegment, setActiveSegment] = useState<"PLAN" | "CREATE" | "PROJECT" | "PUBLISH">("CREATE")
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  
  const dashboardBg = useColorModeValue(tokens.colors.surfaceDashboard, tokens.colors.dark.surfaceDashboard)
  const textColor = useColorModeValue(tokens.colors.textHero, tokens.colors.dark.textHero)
  const secondaryText = useColorModeValue("gray.600", "gray.400")
  const cardBg = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue(tokens.colors.borderSubtle, tokens.colors.dark.borderSubtle)
  
  // Massive background text
  const ghostColor = useColorModeValue("rgba(0,0,0,0.02)", "rgba(255,255,255,0.02)")

  // Rotate inspirational quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % inspirationalQuotes.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case "PLAN": return "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
      case "CREATE": return gradients.sunset
      case "PROJECT": return "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)"
      case "PUBLISH": return "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)"
      default: return gradients.sunset
    }
  }

  return (
    <>
      {/* Massive Background Typography */}
      <Box
        position="fixed"
        top="20%"
        left="10%"
        fontSize="120px"
        fontWeight={tokens.typography.fontWeights.light}
        color={ghostColor}
        zIndex={0}
        pointerEvents="none"
        userSelect="none"
        fontFamily={tokens.typography.fontFamily.primary}
        transform="rotate(-15deg)"
      >
        CRE8ABLE
      </Box>

      {/* Geometric Background Patterns */}
      <Box
        position="fixed"
        top="15%"
        right="20%"
        width="60px"
        height="60px"
        borderRadius="50%"
        bg="rgba(255, 102, 196, 0.03)"
        zIndex={0}
      />
      <Box
        position="fixed"
        bottom="25%"
        left="15%"
        width="40px"
        height="40px"
        transform="rotate(45deg)"
        bg="rgba(59, 130, 246, 0.03)"
        zIndex={0}
      />
      <Box
        position="fixed"
        top="60%"
        right="15%"
        width="0"
        height="0"
        borderLeft="30px solid transparent"
        borderRight="30px solid transparent"
        borderBottom="52px solid rgba(16, 185, 129, 0.03)"
        zIndex={0}
      />

      {/* Main Content */}
      <Box bg={dashboardBg} minH="100vh" position="relative" zIndex={1}>
        <Container maxW="full" py={8}>
          <HStack align="stretch" gap={8} minH="calc(100vh - 64px)">
            {/* Left Panel - Recent Activity */}
            <VStack
              width="280px"
              align="stretch"
              gap={6}
              pt={16}
            >
              <Text
                fontSize={tokens.typography.fontSizes.bodyLg}
                fontWeight={tokens.typography.fontWeights.semibold}
                color={textColor}
                mb={4}
              >
                Recent Activity
              </Text>
              
              {recentActivity.map((item, index) => (
                <Box
                  key={index}
                  position="relative"
                  pl={6}
                  pb={4}
                  borderLeft="2px solid"
                  borderLeftColor={borderColor}
                  _last={{ borderLeft: "none" }}
                >
                  <Box
                    position="absolute"
                    left="-5px"
                    top="8px"
                    width="8px"
                    height="8px"
                    borderRadius="50%"
                    bg={getSegmentColor(activeSegment)}
                  />
                  <Text
                    fontSize={tokens.typography.fontSizes.bodySm}
                    color={textColor}
                    mb={1}
                  >
                    {item.action}
                  </Text>
                  <Text
                    fontSize={tokens.typography.fontSizes.caption}
                    color={secondaryText}
                  >
                    {item.time}
                  </Text>
                </Box>
              ))}
            </VStack>

            {/* Center Content */}
            <VStack flex={1} align="center" justify="center" gap={12} py={8}>
              {/* Welcome Section */}
              <VStack gap={6} textAlign="center">
                <Text
                  fontSize="32px"
                  fontWeight={tokens.typography.fontWeights.light}
                  color={textColor}
                >
                  Welcome back, {currentUser?.full_name?.split(' ')[0] || "Creator"}!
                </Text>
                
                {/* Rotating Inspirational Quote */}
                <Box position="relative" height="32px">
                  {inspirationalQuotes.map((quote, index) => (
                    <Text
                      key={index}
                      position="absolute"
                      top={0}
                      left="50%"
                      transform="translateX(-50%)"
                      fontSize={tokens.typography.fontSizes.bodyLg}
                      color={secondaryText}
                      opacity={index === currentQuoteIndex ? 1 : 0}
                      transition={`opacity ${tokens.motion.duration.slow} ${tokens.motion.easing.standard}`}
                      whiteSpace="nowrap"
                    >
                      {quote}
                    </Text>
                  ))}
                </Box>

                {/* Quick Stats */}
                <HStack gap={6}>
                  <Badge
                    px={4}
                    py={2}
                    borderRadius={tokens.radius.pill}
                    bg={cardBg}
                    border="1px solid"
                    borderColor={borderColor}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Box
                      width="8px"
                      height="8px"
                      borderRadius="50%"
                      bg={getSegmentColor("CREATE")}
                    />
                    <Text color={textColor} fontSize={tokens.typography.fontSizes.caption}>
                      12 Active Projects
                    </Text>
                  </Badge>
                  <Badge
                    px={4}
                    py={2}
                    borderRadius={tokens.radius.pill}
                    bg={cardBg}
                    border="1px solid"
                    borderColor={borderColor}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Box
                      width="8px"
                      height="8px"
                      borderRadius="50%"
                      bg={getSegmentColor("PUBLISH")}
                    />
                    <Text color={textColor} fontSize={tokens.typography.fontSizes.caption}>
                      8 Published
                    </Text>
                  </Badge>
                  <Badge
                    px={4}
                    py={2}
                    borderRadius={tokens.radius.pill}
                    bg={cardBg}
                    border="1px solid"
                    borderColor={borderColor}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Box
                      width="8px"
                      height="8px"
                      borderRadius="50%"
                      bg={getSegmentColor("PLAN")}
                    />
                    <Text color={textColor} fontSize={tokens.typography.fontSizes.caption}>
                      4 In Review
                    </Text>
                  </Badge>
                </HStack>
              </VStack>

              {/* Central Wheel */}
              <CentralWheel
                activeSegment={activeSegment}
                onSegmentChange={setActiveSegment}
              />

              {/* Bottom Content - Project Shortcuts & Templates */}
              <VStack gap={8} width="100%">
                {/* Recent Projects */}
                <VStack gap={4} width="100%">
                  <Text
                    fontSize={tokens.typography.fontSizes.bodyLg}
                    fontWeight={tokens.typography.fontWeights.medium}
                    color={textColor}
                  >
                    Recent Projects
                  </Text>
                  <HStack gap={4} justify="center">
                    {recentProjects.map((project) => (
                      <Box
                        key={project.id}
                        width="150px"
                        height="100px"
                        bg={cardBg}
                        borderRadius={tokens.radius.lg}
                        border="1px solid"
                        borderColor={borderColor}
                        overflow="hidden"
                        cursor="pointer"
                        transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: tokens.shadows.md,
                        }}
                      >
                        <Box
                          width="100%"
                          height="70px"
                          bg="gray.100"
                          backgroundImage={`url(${project.thumbnail})`}
                          backgroundSize="cover"
                          backgroundPosition="center"
                        />
                        <Box p={2}>
                                                     <Text
                             fontSize={tokens.typography.fontSizes.caption}
                             fontWeight={tokens.typography.fontWeights.medium}
                             color={textColor}
                             overflow="hidden"
                             textOverflow="ellipsis"
                             whiteSpace="nowrap"
                           >
                             {project.title}
                           </Text>
                        </Box>
                      </Box>
                    ))}
                  </HStack>
                </VStack>

                {/* Featured Templates */}
                <VStack gap={4} width="100%">
                  <Text
                    fontSize={tokens.typography.fontSizes.bodyLg}
                    fontWeight={tokens.typography.fontWeights.medium}
                    color={textColor}
                  >
                    Start with a template
                  </Text>
                  <HStack gap={4} justify="center">
                    {featuredTemplates.map((template) => (
                      <Box
                        key={template.id}
                        width="150px"
                        height="100px"
                        bg={cardBg}
                        borderRadius={tokens.radius.lg}
                        border="1px solid"
                        borderColor={borderColor}
                        overflow="hidden"
                        cursor="pointer"
                        transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: tokens.shadows.md,
                        }}
                      >
                        <Box
                          width="100%"
                          height="70px"
                          bg="gray.100"
                          backgroundImage={`url(${template.thumbnail})`}
                          backgroundSize="cover"
                          backgroundPosition="center"
                        />
                        <Box p={2}>
                                                     <Text
                             fontSize={tokens.typography.fontSizes.caption}
                             fontWeight={tokens.typography.fontWeights.medium}
                             color={textColor}
                             overflow="hidden"
                             textOverflow="ellipsis"
                             whiteSpace="nowrap"
                           >
                             {template.title}
                           </Text>
                        </Box>
                      </Box>
                    ))}
                  </HStack>
                </VStack>
              </VStack>
            </VStack>

            {/* Right Panel - Quick Actions */}
            <VStack
              width="280px"
              align="stretch"
              gap={6}
              pt={16}
            >
              <Text
                fontSize={tokens.typography.fontSizes.bodyLg}
                fontWeight={tokens.typography.fontWeights.semibold}
                color={textColor}
                mb={4}
              >
                Quick Actions
              </Text>
              
              {quickActions.map((action, index) => (
                                 <Box
                   key={index}
                   p={4}
                   bg={cardBg}
                   borderRadius={tokens.radius.lg}
                   border="1px solid"
                   borderColor={borderColor}
                   cursor="pointer"
                   transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
                   _hover={{
                     transform: "translateY(-2px)",
                     boxShadow: tokens.shadows.md,
                     borderColor: "transparent",
                     background: action.color,
                   }}
                 >
                  <HStack gap={3}>
                    <Box
                      p={2}
                      borderRadius={tokens.radius.md}
                      bg="rgba(0, 0, 0, 0.05)"
                    >
                      <action.icon size={20} />
                    </Box>
                    <Text
                      fontSize={tokens.typography.fontSizes.bodySm}
                      fontWeight={tokens.typography.fontWeights.medium}
                      color={textColor}
                    >
                      {action.label}
                    </Text>
                  </HStack>
                </Box>
              ))}

                             {/* Team Activity */}
               <Box mt={8}>
                 <Text
                   fontSize={tokens.typography.fontSizes.bodyLg}
                   fontWeight={tokens.typography.fontWeights.semibold}
                   color={textColor}
                   mb={4}
                 >
                   Team Activity
                 </Text>
                 <HStack gap={2}>
                   <Box
                     width="32px"
                     height="32px"
                     borderRadius="50%"
                     bg="linear-gradient(135deg, #FF66C4 0%, #FFC54D 100%)"
                     display="flex"
                     alignItems="center"
                     justifyContent="center"
                     color="white"
                     fontSize="12px"
                     fontWeight="bold"
                   >
                     SC
                   </Box>
                   <Box
                     width="32px"
                     height="32px"
                     borderRadius="50%"
                     bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                     display="flex"
                     alignItems="center"
                     justifyContent="center"
                     color="white"
                     fontSize="12px"
                     fontWeight="bold"
                   >
                     MJ
                   </Box>
                   <Box
                     width="32px"
                     height="32px"
                     borderRadius="50%"
                     bg="linear-gradient(135deg, #10B981 0%, #06B6D4 100%)"
                     display="flex"
                     alignItems="center"
                     justifyContent="center"
                     color="white"
                     fontSize="12px"
                     fontWeight="bold"
                   >
                     ED
                   </Box>
                   <Box
                     width="32px"
                     height="32px"
                     borderRadius="50%"
                     bg="linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)"
                     display="flex"
                     alignItems="center"
                     justifyContent="center"
                     color="white"
                     fontSize="12px"
                     fontWeight="bold"
                   >
                     +2
                   </Box>
                 </HStack>
                 <Text
                   fontSize={tokens.typography.fontSizes.caption}
                   color={secondaryText}
                   mt={2}
                 >
                   5 team members active
                 </Text>
               </Box>
            </VStack>
          </HStack>
        </Container>
      </Box>

      {/* Global Styles */}
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
              transition: none !important;
            }
          }
        `}
      </style>
    </>
  )
}

export default Dashboard
