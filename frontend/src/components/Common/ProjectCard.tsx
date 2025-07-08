import { useState } from "react"
import { 
  Box, 
  Image, 
  Text, 
  IconButton, 
  Badge,
  HStack,
  VStack
} from "@chakra-ui/react"
import { useColorModeValue } from "../ui/color-mode"
import { 
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from "../ui/menu"
import { FiEdit3, FiCopy, FiShare2, FiMoreHorizontal, FiPlay, FiFileText } from "react-icons/fi"

import { tokens, gradients } from "../../theme/tokens"

interface ProjectCardProps {
  id: string
  title: string
  thumbnail?: string
  type: "VIDEO" | "DESIGN" | "TEMPLATE"
  lastModified?: Date
  isFeature?: boolean
  onEdit?: () => void
  onDuplicate?: () => void
  onShare?: () => void
  onOpen?: () => void
}

export default function ProjectCard({
  title,
  thumbnail,
  type,
  lastModified,
  isFeature = false,
  onEdit = () => {},
  onDuplicate = () => {},
  onShare = () => {},
  onOpen = () => {},
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const surfaceColor = useColorModeValue(tokens.colors.surfaceCard, tokens.colors.dark.surfaceCard)
  const borderColor = useColorModeValue(tokens.colors.borderSubtle, tokens.colors.dark.borderSubtle)
  const textColor = useColorModeValue(tokens.colors.textHero, tokens.colors.dark.textHero)
  const secondaryText = useColorModeValue("gray.600", "gray.400")
  
  const gradientOverlay = useColorModeValue(
    "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%)",
    "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 40%)"
  )

  const getBadgeColor = () => {
    switch (type) {
      case "VIDEO":
        return { bg: gradients.sunset, color: "white" }
      case "DESIGN":
        return { bg: gradients.plan, color: "white" }
      case "TEMPLATE":
        return { bg: gradients.publish, color: "white" }
      default:
        return { bg: "gray.100", color: "gray.800" }
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case "VIDEO":
        return FiPlay
      case "DESIGN":
      case "TEMPLATE":
        return FiFileText
      default:
        return FiFileText
    }
  }

  const badgeStyle = getBadgeColor()
  const TypeIcon = getTypeIcon()

  return (
    <Box
      bg={surfaceColor}
      borderRadius={tokens.radius.xl}
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
      cursor="pointer"
      transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
      gridColumn={isFeature ? { base: "span 1", md: "span 2" } : "span 1"}
      gridRow={isFeature ? { base: "span 1", md: "span 2" } : "span 1"}
      _hover={{
        transform: "translateY(-12px) scale(1.02)",
        boxShadow: tokens.shadows.cardHover,
      }}
      onClick={onOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onOpen()
        }
      }}
    >
      {/* Thumbnail Section */}
      <Box
        position="relative"
        width="100%"
        height={isFeature ? { base: "200px", md: "320px" } : "200px"}
        bg="gray.100"
        overflow="hidden"
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        ) : (
          <Box
            width="100%"
            height="100%"
            bg="gray.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <TypeIcon size={48} color="gray.400" />
          </Box>
        )}

        {/* Hover Overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={gradientOverlay}
          opacity={isHovered ? 1 : 0}
          transition={`opacity ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={3}
        >
          <IconButton
            size="md"
            borderRadius={tokens.radius.full}
            bg="rgba(255, 255, 255, 0.9)"
            color="gray.800"
            _hover={{ bg: "white", transform: "scale(1.1)" }}
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            aria-label="Edit project"
            opacity={isHovered ? 1 : 0}
            transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard} 150ms`}
          >
            <FiEdit3 size={16} />
          </IconButton>

          <IconButton
            size="md"
            borderRadius={tokens.radius.full}
            bg="rgba(255, 255, 255, 0.9)"
            color="gray.800"
            _hover={{ bg: "white", transform: "scale(1.1)" }}
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate()
            }}
            aria-label="Duplicate project"
            opacity={isHovered ? 1 : 0}
            transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard} 200ms`}
          >
            <FiCopy size={16} />
          </IconButton>

          <IconButton
            size="md"
            borderRadius={tokens.radius.full}
            bg="rgba(255, 255, 255, 0.9)"
            color="gray.800"
            _hover={{ bg: "white", transform: "scale(1.1)" }}
            onClick={(e) => {
              e.stopPropagation()
              onShare()
            }}
            aria-label="Share project"
            opacity={isHovered ? 1 : 0}
            transition={`all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard} 250ms`}
          >
            <FiShare2 size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* Footer Bar */}
      <Box p={4}>
        <VStack align="stretch" gap={2}>
          <HStack justify="space-between" align="start">
            <VStack align="start" gap={1} flex={1}>
              <Text
                fontSize={isFeature ? tokens.typography.fontSizes.bodyLg : tokens.typography.fontSizes.bodySm}
                fontWeight={tokens.typography.fontWeights.medium}
                color={textColor}
                lineHeight="1.4"
                overflow="hidden"
                textOverflow="ellipsis"
                display="-webkit-box"
                css={{
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {title}
              </Text>
              
              {lastModified && (
                <Text
                  fontSize={tokens.typography.fontSizes.caption}
                  color={secondaryText}
                >
                  {lastModified.toLocaleDateString()}
                </Text>
              )}
            </VStack>

            <MenuRoot>
              <MenuTrigger asChild>
                <IconButton
                  size="sm"
                  variant="ghost"
                  color={secondaryText}
                  _hover={{ color: textColor }}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="More options"
                >
                  <FiMoreHorizontal size={16} />
                </IconButton>
              </MenuTrigger>
              <MenuContent>
                <MenuItem 
                  value="edit"
                  onClick={() => { onEdit() }}
                  gap={2}
                  style={{ cursor: "pointer" }}
                >
                  <FiEdit3 size={14} />
                  Edit
                </MenuItem>
                <MenuItem 
                  value="duplicate"
                  onClick={() => { onDuplicate() }}
                  gap={2}
                  style={{ cursor: "pointer" }}
                >
                  <FiCopy size={14} />
                  Duplicate
                </MenuItem>
                <MenuItem 
                  value="share"
                  onClick={() => { onShare() }}
                  gap={2}
                  style={{ cursor: "pointer" }}
                >
                  <FiShare2 size={14} />
                  Share
                </MenuItem>
              </MenuContent>
            </MenuRoot>
          </HStack>

          {/* Type Badge */}
          <HStack>
            <Badge
              bg={badgeStyle.bg}
              color={badgeStyle.color}
              borderRadius={tokens.radius.lg}
              px={2}
              py={1}
              fontSize="11px"
              fontWeight={tokens.typography.fontWeights.medium}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <TypeIcon size={12} />
              {type}
            </Badge>
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
} 