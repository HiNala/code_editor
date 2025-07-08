import { Box, Flex, Icon, Text } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { Link as RouterLink } from "@tanstack/react-router"
import { 
  FiHome, 
  FiSettings, 
  FiUsers, 
  FiLayout, 
  FiPlusSquare,
  FiVideo
} from "react-icons/fi"
import type { IconType } from "react-icons/lib"

import type { UserPublic } from "@/client"

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

  const finalItems: Item[] = currentUser?.is_superuser
    ? [...items, { icon: FiUsers, title: "Admin", path: "/admin" }]
    : items

  const listItems = finalItems.map(({ icon, title, path }) => {
    // Simple active detection based on current path
    const isActive = typeof window !== "undefined" && window.location.pathname === path
    
    return (
      <RouterLink key={title} to={path} onClick={onClose}>
        <Flex
          gap={isCollapsed ? 0 : 4}
          px={isCollapsed ? 2 : 4}
          py={3}
          mx={isCollapsed ? 2 : 0}
          mb={isCollapsed ? 3 : 1}
          _hover={{
            background: isActive ? "whiteAlpha.300" : "whiteAlpha.200",
          }}
          alignItems="center"
          fontSize="sm"
          justify={isCollapsed ? "center" : "flex-start"}
          borderRadius="md"
          w={isCollapsed ? "auto" : "full"}
          position="relative"
          background={isActive ? "whiteAlpha.200" : "transparent"}
          transition="all 0.2s"
          title={isCollapsed ? title : undefined}
        >
          {/* Active indicator */}
          {isActive && (
            <Box
              position="absolute"
              left={0}
              top={0}
              bottom={0}
              width="3px"
              bg="white"
              borderRadius="0 2px 2px 0"
            />
          )}
          
          <Icon 
            as={icon} 
            alignSelf="center" 
            fontSize={isCollapsed ? "lg" : "md"}
            color={isActive ? "white" : "whiteAlpha.800"}
          />
          {!isCollapsed && (
            <Text 
              ml={2} 
              color={isActive ? "white" : "whiteAlpha.900"}
              fontWeight={isActive ? "semibold" : "normal"}
            >
              {title}
            </Text>
          )}
        </Flex>
      </RouterLink>
    )
  })

  return (
    <>
      {!isCollapsed && (
        <Text 
          fontSize="xs" 
          px={4} 
          py={2} 
          fontWeight="bold"
          color="whiteAlpha.700"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          Menu
        </Text>
      )}
      <Box display="flex" flexDirection="column" alignItems={isCollapsed ? "center" : "stretch"}>
        {listItems}
      </Box>
    </>
  )
}

export default SidebarItems
