import React, { useState, useMemo } from "react"
import { 
  Box, 
  Text, 
  Button,
  HStack,
  VStack,
  Badge,
  Input
} from "@chakra-ui/react"
import { FiSearch, FiGrid, FiHeart, FiUsers, FiClock } from "react-icons/fi"
import { useColorModeValue } from "../ui/color-mode"
import { InputGroup } from "../ui/input-group"

import ProjectCard from "./ProjectCard"
import { tokens, gradients } from "../../theme/tokens"

interface Project {
  id: string
  title: string
  thumbnail?: string
  type: "VIDEO" | "DESIGN" | "TEMPLATE"
  lastModified: Date
  isFavorite?: boolean
  isShared?: boolean
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
}

interface ProjectGalleryProps {
  projects?: Project[]
  onCreateNew?: () => void
  onEditProject?: (id: string) => void
  onDuplicateProject?: (id: string) => void
  onShareProject?: (id: string) => void
  onOpenProject?: (id: string) => void
}

type FilterCategory = "All" | "Recent" | "Favorites" | "Shared"
type FilterType = "ALL" | "VIDEO" | "DESIGN" | "TEMPLATE"
type FilterStatus = "ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED"

export default function ProjectGallery({
  projects = [],
  onCreateNew = () => {},
  onEditProject = () => {},
  onDuplicateProject = () => {},
  onShareProject = () => {},
  onOpenProject = () => {},
}: ProjectGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All")
  const [activeType, setActiveType] = useState<FilterType>("ALL")
  const [activeStatus, setActiveStatus] = useState<FilterStatus>("ALL")

  const surfaceColor = useColorModeValue(tokens.colors.surfaceDashboard, tokens.colors.dark.surfaceDashboard)
  const textColor = useColorModeValue(tokens.colors.textHero, tokens.colors.dark.textHero)
  const secondaryText = useColorModeValue("gray.600", "gray.400")
  const borderColor = useColorModeValue(tokens.colors.borderSubtle, tokens.colors.dark.borderSubtle)

  // Filter projects based on current selections
  const filteredProjects = useMemo(() => {
    let filtered = [...projects]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    switch (activeCategory) {
      case "Recent":
        filtered = filtered.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime()).slice(0, 10)
        break
      case "Favorites":
        filtered = filtered.filter(project => project.isFavorite)
        break
      case "Shared":
        filtered = filtered.filter(project => project.isShared)
        break
      default:
        break
    }

    // Type filter
    if (activeType !== "ALL") {
      filtered = filtered.filter(project => project.type === activeType)
    }

    // Status filter
    if (activeStatus !== "ALL") {
      filtered = filtered.filter(project => project.status === activeStatus)
    }

    return filtered
  }, [projects, searchQuery, activeCategory, activeType, activeStatus])

  // Get featured project (most recent or first)
  const featuredProject = filteredProjects[0]
  const regularProjects = filteredProjects.slice(1)

  const categories: { key: FilterCategory; label: string; icon?: React.ComponentType<{ size?: number }> }[] = [
    { key: "All", label: "All", icon: FiGrid },
    { key: "Recent", label: "Recent", icon: FiClock },
    { key: "Favorites", label: "Favorites", icon: FiHeart },
    { key: "Shared", label: "Shared", icon: FiUsers },
  ]

  const typeFilters: { key: FilterType; label: string }[] = [
    { key: "ALL", label: "All Types" },
    { key: "VIDEO", label: "Videos" },
    { key: "DESIGN", label: "Designs" },
    { key: "TEMPLATE", label: "Templates" },
  ]

  const statusFilters: { key: FilterStatus; label: string }[] = [
    { key: "ALL", label: "All Status" },
    { key: "DRAFT", label: "Drafts" },
    { key: "PUBLISHED", label: "Published" },
    { key: "ARCHIVED", label: "Archived" },
  ]

  const getTabStyles = (isActive: boolean) => ({
    position: "relative" as const,
    color: isActive ? textColor : secondaryText,
    fontWeight: isActive ? tokens.typography.fontWeights.medium : tokens.typography.fontWeights.normal,
    transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`,
    _after: isActive ? {
      content: '""',
      position: "absolute",
      bottom: "-2px",
      left: 0,
      right: 0,
      height: "2px",
      bg: gradients.sunset,
      borderRadius: tokens.radius.sm,
    } : {},
  })

  const getChipStyles = (isActive: boolean) => ({
    bg: isActive ? gradients.sunset : "transparent",
    color: isActive ? "white" : secondaryText,
    borderColor: isActive ? "transparent" : borderColor,
    _hover: {
      bg: isActive ? gradients.sunset : useColorModeValue("gray.50", "gray.800"),
      transform: "translateY(-1px)",
    },
    transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`,
  })

  return (
    <VStack align="stretch" gap={6} w="100%">
      {/* Search and Filters */}
      <VStack align="stretch" gap={4}>
        {/* Search Bar */}
        <InputGroup 
          maxW="480px" 
          mx="auto"
          startElement={<FiSearch size={16} color={secondaryText} />}
        >
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg={surfaceColor}
            borderColor={borderColor}
            _focus={{
              borderColor: gradients.sunset,
              boxShadow: `0 0 0 1px ${gradients.sunset}`,
            }}
          />
        </InputGroup>

        {/* Category Tabs */}
        <HStack justify="center" gap={8}>
          {categories.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant="ghost"
              onClick={() => setActiveCategory(key)}
              {...getTabStyles(activeCategory === key)}
            >
              <HStack gap={2}>
                {Icon && <Icon size={16} />}
                {label}
              </HStack>
            </Button>
          ))}
        </HStack>

        {/* Filter Chips */}
        <HStack justify="center" gap={3} flexWrap="wrap">
          {typeFilters.map(({ key, label }) => (
            <Badge
              key={key}
              as="button"
              onClick={() => setActiveType(key)}
              px={3}
              py={1}
              borderRadius={tokens.radius.pill}
              border="1px solid"
              cursor="pointer"
              fontSize={tokens.typography.fontSizes.caption}
              {...getChipStyles(activeType === key)}
            >
              {label}
            </Badge>
          ))}
          
          {statusFilters.map(({ key, label }) => (
            <Badge
              key={key}
              as="button"
              onClick={() => setActiveStatus(key)}
              px={3}
              py={1}
              borderRadius={tokens.radius.pill}
              border="1px solid"
              cursor="pointer"
              fontSize={tokens.typography.fontSizes.caption}
              {...getChipStyles(activeStatus === key)}
            >
              {label}
            </Badge>
          ))}
        </HStack>
      </VStack>

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <Box
          textAlign="center"
          py={12}
          px={6}
        >
          <Text
            fontSize={tokens.typography.fontSizes.bodyLg}
            color={secondaryText}
            mb={4}
          >
            {searchQuery || activeCategory !== "All" || activeType !== "ALL" || activeStatus !== "ALL"
              ? "No projects found matching your filters"
              : "No projects yet"}
          </Text>
          <Text
            fontSize={tokens.typography.fontSizes.bodySm}
            color={secondaryText}
            mb={6}
          >
            {searchQuery || activeCategory !== "All" || activeType !== "ALL" || activeStatus !== "ALL"
              ? "Try adjusting your search or filter criteria"
              : "Create your first project to get started"}
          </Text>
          <Button
            bg={gradients.sunset}
            color="white"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: tokens.shadows.gradient,
            }}
            onClick={onCreateNew}
          >
            Create New Project
          </Button>
        </Box>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{
            base: "1fr",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)",
          }}
          gap={{
            base: tokens.grid.gaps.mobile,
            md: tokens.grid.gaps.tablet,
            lg: tokens.grid.gaps.desktop,
            xl: tokens.grid.gaps.wide,
          }}
          w="100%"
        >
          {/* Featured Project */}
          {featuredProject && (
            <ProjectCard
              key={featuredProject.id}
              id={featuredProject.id}
              title={featuredProject.title}
              thumbnail={featuredProject.thumbnail}
              type={featuredProject.type}
              lastModified={featuredProject.lastModified}
              isFeature={true}
              onEdit={() => onEditProject(featuredProject.id)}
              onDuplicate={() => onDuplicateProject(featuredProject.id)}
              onShare={() => onShareProject(featuredProject.id)}
              onOpen={() => onOpenProject(featuredProject.id)}
            />
          )}

          {/* Regular Projects */}
          {regularProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              thumbnail={project.thumbnail}
              type={project.type}
              lastModified={project.lastModified}
              isFeature={false}
              onEdit={() => onEditProject(project.id)}
              onDuplicate={() => onDuplicateProject(project.id)}
              onShare={() => onShareProject(project.id)}
              onOpen={() => onOpenProject(project.id)}
            />
          ))}
        </Box>
      )}
    </VStack>
  )
} 