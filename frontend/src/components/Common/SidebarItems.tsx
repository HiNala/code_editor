import { Box, Flex, Icon, Text } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { Link as RouterLink } from "@tanstack/react-router"
import {
  FiHome,
  FiLayout,
  FiPlusSquare,
  FiSettings,
  FiUsers,
  FiVideo,
} from "react-icons/fi"
import type { IconType } from "react-icons/lib"

import type { UserPublic } from "@/client"
import { useColorModeValue } from "../ui/color-mode"

const items = [
  { icon: FiHome, title: "Dashboard", path: "/" },
  { icon: FiLayout, title: "Plan", path: "/plan" },
  { icon: FiPlusSquare, title: "Create", path: "/create" },
  { icon: FiVideo, title: "Videos", path: "/videos" },
  // { icon: FiBox, title: "Items", path: "/items" }, // hidden for now
  { icon: FiSettings, title: "User Settings", path: "/settings" },
]

interface SidebarItemsProps {
  onClose?: () => void
  isCollapsed?: boolean
}

interface Item {
  icon: IconType
  title: string
  path: string
}

const SidebarItems = ({ onClose, isCollapsed = false }: SidebarItemsProps) => {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])

  // Theme-responsive colors
  const menuTextColor = useColorModeValue("gray.600", "whiteAlpha.700")
  const itemHoverBg = useColorModeValue("gray.100", "whiteAlpha.200")
  const itemActiveBg = useColorModeValue("purple.100", "whiteAlpha.200")
  const itemActiveHoverBg = useColorModeValue("purple.200", "whiteAlpha.300")
  const itemTextColor = useColorModeValue("gray.700", "whiteAlpha.900")
  const itemActiveTextColor = useColorModeValue("purple.700", "white")
  const itemIconColor = useColorModeValue("gray.600", "whiteAlpha.800")
  const itemActiveIconColor = useColorModeValue("purple.600", "white")
  const activeIndicatorColor = useColorModeValue("purple.500", "white")

  const finalItems: Item[] = currentUser?.is_superuser
    ? [...items, { icon: FiUsers, title: "Admin", path: "/admin" }]
    : items

  const listItems = finalItems.map(({ icon, title, path }, index) => {
    // Simple active detection based on current path
    const isActive =
      typeof window !== "undefined" && window.location.pathname === path

    return (
      <RouterLink key={title} to={path} onClick={onClose}>
        <Flex
          gap={2}
          px={isCollapsed ? 2 : 4}
          py={3}
          mx={isCollapsed ? 2 : 0}
          mb={2}
          _hover={{
            background: isActive ? itemActiveHoverBg : itemHoverBg,
            transform: "translateX(2px)",
          }}
          alignItems="center"
          fontSize="sm"
          justify={isCollapsed ? "center" : "flex-start"}
          borderRadius="md"
          w={isCollapsed ? "auto" : "full"}
          position="relative"
          background={isActive ? itemActiveBg : "transparent"}
          transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          transitionDelay={`${index * 0.05}s`}
          title={isCollapsed ? title : undefined}
          css={{
            "&:hover .sidebar-icon": {
              transform: isCollapsed ? "scale(1.1)" : "scale(1.05)",
            },
          }}
        >
          {/* Active indicator */}
          {isActive && (
            <Box
              position="absolute"
              left={0}
              top={0}
              bottom={0}
              width="3px"
              bg={activeIndicatorColor}
              borderRadius="0 2px 2px 0"
              transition="all 0.3s ease-out"
            />
          )}

          <Icon
            as={icon}
            className="sidebar-icon"
            alignSelf="center"
            fontSize={isCollapsed ? "lg" : "md"}
            color={isActive ? itemActiveIconColor : itemIconColor}
            transition="all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
            transform={isCollapsed ? "scale(1)" : "scale(1)"}
          />

          <Text
            ml={2}
            color={isActive ? itemActiveTextColor : itemTextColor}
            fontWeight={isActive ? "semibold" : "normal"}
            opacity={isCollapsed ? 0 : 1}
            transform={isCollapsed ? "translateX(-10px)" : "translateX(0)"}
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            transitionDelay={isCollapsed ? "0s" : "0.15s"}
            whiteSpace="nowrap"
            overflow="hidden"
            maxW={isCollapsed ? "0" : "200px"}
          >
            {title}
          </Text>
        </Flex>
      </RouterLink>
    )
  })

  return (
    <>
      <Text
        fontSize="xs"
        px={4}
        py={2}
        fontWeight="bold"
        color={menuTextColor}
        textTransform="uppercase"
        letterSpacing="wider"
        opacity={isCollapsed ? 0 : 1}
        transition="opacity 0.3s ease"
        transitionDelay={isCollapsed ? "0s" : "0.15s"}
        maxH={isCollapsed ? "0" : "auto"}
        overflow="hidden"
      >
        Menu
      </Text>
      <Box
        display="flex"
        flexDirection="column"
        alignItems={isCollapsed ? "center" : "stretch"}
        transition="all 0.3s ease-out"
      >
        {listItems}
      </Box>
    </>
  )
}

export default SidebarItems
