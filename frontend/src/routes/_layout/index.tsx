import { createFileRoute } from "@tanstack/react-router"
import { Box, VStack, Text, HStack, Input, Image } from "@chakra-ui/react"
import { useRef, useState, useEffect } from "react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { useForm } from "react-hook-form"
import { useColorModeValue } from "@/components/ui/color-mode"
import { tokens } from "@/theme/tokens"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"

import WorkflowWheel from "@/components/Common/WorkflowWheel"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})

interface Video {
  id: string // youtube id
  url: string
  title: string
}

interface VideoFormData {
  url: string
}

function parseYouTubeId(url: string): string | null {
  const regex =
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:v\/|watch\?.*v=|embed\/))([\w-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

async function fetchTitle(url: string): Promise<string> {
  try {
    const resp = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    )
    if (resp.ok) {
      const json = (await resp.json()) as { title: string }
      return json.title
    }
  } catch {
    /* ignore */
  }
  return "Untitled Video"
}

// Placeholder project data
const placeholderProjects = [
  { id: 1, title: "Project Alpha", thumbnail: "/api/placeholder/300/200" },
  { id: 2, title: "Project Beta", thumbnail: "/api/placeholder/300/200" },
  { id: 3, title: "Project Gamma", thumbnail: "/api/placeholder/300/200" },
  { id: 4, title: "Project Delta", thumbnail: "/api/placeholder/300/200" },
  { id: 5, title: "Project Echo", thumbnail: "/api/placeholder/300/200" },
  { id: 6, title: "Project Foxtrot", thumbnail: "/api/placeholder/300/200" },
]

function ProjectCard({ title, video }: { title: string; video?: Video }) {
  const cardBg = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.900", "white")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  return (
    <Box
      flex="0 0 calc(25% - 12px)" // 4 cards per row
      minWidth="160px"
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
      {video ? (
        <a href={video.url} target="_blank" rel="noopener noreferrer">
          <Image
            src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
            alt={video.title}
            height="120px"
            width="100%"
            objectFit="cover"
            cursor="pointer"
          />
        </a>
      ) : (
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
      )}
      <Box p={2}>
        <Text
          fontSize={tokens.typography.fontSizes.bodySm}
          fontWeight={tokens.typography.fontWeights.medium}
          color={textColor}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {video ? video.title : title}
        </Text>
      </Box>
    </Box>
  )
}

function ProjectSection({ title, projects, videos = [] }: { title: string; projects: typeof placeholderProjects; videos?: Video[] }) {
  const textColor = useColorModeValue("gray.900", "white")
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Combine videos and placeholder projects
  const allItems = [
    ...videos.map(video => ({ type: 'video' as const, video, title: video.title })),
    ...projects.slice(videos.length).map(project => ({ type: 'placeholder' as const, title: project.title }))
  ]

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
  }, [allItems.length])

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const firstCard = scrollContainerRef.current.querySelector('div') as HTMLElement
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 12 : 232
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" })
    }
  }

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const firstCard = scrollContainerRef.current.querySelector('div') as HTMLElement
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 12 : 232
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" })
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
            {allItems.map((item, index) => (
              <ProjectCard 
                key={item.type === 'video' ? item.video.id : `placeholder-${index}`}
                title={item.title}
                video={item.type === 'video' ? item.video : undefined}
              />
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
  const [videos, setVideos] = useState<Video[]>([])
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VideoFormData>({ defaultValues: { url: "" } })

  // Load videos from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("cre8able-videos")
    if (raw) {
      try {
        setVideos(JSON.parse(raw))
      } catch {
        /* ignore */
      }
    }
  }, [])

  const saveVideos = (newList: Video[]) => {
    setVideos(newList)
    localStorage.setItem("cre8able-videos", JSON.stringify(newList))
  }

  const onSubmit = async ({ url }: VideoFormData) => {
    const id = parseYouTubeId(url)
    if (!id) return
    const title = await fetchTitle(url)
    const newList = [...videos, { id, url, title }]
    saveVideos(newList)
    reset()
  }

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
        height={{ base: "40vh", md: "45vh" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={{ base: 2, md: 4 }}
      >
        <Box transform={["scale(0.9)", "scale(1.1)"]} transformOrigin="center">
          <WorkflowWheel onStateChange={handleStateChange} />
        </Box>
      </Box>

      {/* Project Sections - taking remaining space */}
      <Box
        flex="1"
        minHeight="55vh"
        maxWidth="1400px"
        mx="auto"
        width="100%"
      >
        {/* Video Input Form */}
        <Box mb={4}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field
              invalid={!!errors.url}
              errorText={errors.url?.message}
              label="Add Video"
            >
              <InputGroup
                w="100%"
                endElement={
                  <Button type="submit" loading={isSubmitting}>
                    Add
                  </Button>
                }
              >
                <Input
                  placeholder="Paste YouTube link"
                  {...register("url", {
                    required: "URL is required",
                    validate: (v) =>
                      parseYouTubeId(v) !== null || "Invalid YouTube URL",
                  })}
                />
              </InputGroup>
            </Field>
          </form>
        </Box>

        <VStack gap={{ base: 3, md: 6 }} align="stretch" height="100%">
          <Box flex="1">
            <ProjectSection title="Your Feed" projects={placeholderProjects} videos={videos} />
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
