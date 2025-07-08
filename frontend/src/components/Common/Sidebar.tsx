import { Box, Flex, IconButton, Text } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { FiLogOut, FiChevronRight, FiChevronLeft } from "react-icons/fi"

import type { UserPublic } from "@/client"
import useAuth from "@/hooks/useAuth"
import { useColorModeValue } from "../ui/color-mode"
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerRoot,
  DrawerTrigger,
} from "../ui/drawer"
import SidebarItems from "./SidebarItems"

const Sidebar = () => {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)
  
  // Theme-responsive colors
  const sidebarBg = useColorModeValue("white", "gray.900")
  const sidebarTextColor = useColorModeValue("gray.900", "white")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const hoverBg = useColorModeValue("gray.100", "whiteAlpha.200")
  const mutedTextColor = useColorModeValue("gray.600", "whiteAlpha.700")
  const iconColor = useColorModeValue("gray.500", "whiteAlpha.500")
  const iconHoverColor = useColorModeValue("gray.700", "whiteAlpha.700")
  
  // Persist collapsed state in localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed")
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed))
    }
  }, [isCollapsed])

  return (
    <>
      {/* Mobile */}
      <DrawerRoot
        placement="start"
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
      >
        <DrawerBackdrop />
        <DrawerTrigger asChild>
          <IconButton
            variant="ghost"
            color="inherit"
            display={{ base: "flex", md: "none" }}
            aria-label="Open Menu"
            position="absolute"
            zIndex="100"
            m={4}
          >
            <FiChevronRight />
          </IconButton>
        </DrawerTrigger>
        <DrawerContent maxW="xs" bg={sidebarBg} color={sidebarTextColor}>
          <DrawerCloseTrigger color={sidebarTextColor} />
          <DrawerBody>
            <Flex flexDir="column" justify="space-between" h="full">
              <Box>
                <SidebarItems onClose={() => setOpen(false)} />
                <Flex
                  as="button"
                  onClick={() => {
                    logout()
                  }}
                  alignItems="center"
                  gap={4}
                  px={4}
                  py={2}
                  _hover={{
                    background: hoverBg,
                  }}
                  borderRadius="md"
                  color={sidebarTextColor}
                  transition="all 0.2s"
                >
                  <FiLogOut />
                  <Text>Log Out</Text>
                </Flex>
              </Box>
              {currentUser?.email && (
                <Text fontSize="sm" p={2} truncate maxW="sm" color={mutedTextColor}>
                  Logged in as: {currentUser.email}
                </Text>
              )}
            </Flex>
          </DrawerBody>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>

      {/* Desktop */}
      <Box
        display={{ base: "none", md: "flex" }}
        position="sticky"
        bg={sidebarBg}
        top={0}
        w={isCollapsed ? "60px" : "240px"}
        minW={isCollapsed ? "60px" : "240px"}
        maxW={isCollapsed ? "60px" : "240px"}
        h="100%"
        p={4}
        transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        flexDirection="column"
        borderRight="1px solid"
        borderRightColor={borderColor}
      >
        {/* Toggle Button with Arrow Icons */}
        <Flex justify="flex-end" mb={4}>
          <IconButton
            variant="ghost"
            size="xs"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
            color={iconColor}
            _hover={{
              bg: hoverBg,
              color: iconHoverColor
            }}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </IconButton>
        </Flex>

        {/* Sidebar Content */}
        <Box 
          flex="1" 
          overflowY={isCollapsed ? "visible" : "auto"}
          overflowX="hidden"
        >
          <SidebarItems isCollapsed={isCollapsed} />
        </Box>

        {/* Logout Button */}
        <Flex
          as="button"
          onClick={() => {
            logout()
          }}
          alignItems="center"
          gap={isCollapsed ? 0 : 4}
          px={isCollapsed ? 2 : 4}
          py={3}
          mt={4}
          _hover={{
            background: hoverBg,
          }}
          borderRadius="md"
          justify="center"
          color={sidebarTextColor}
          transition="all 0.2s"
          title={isCollapsed ? "Log Out" : undefined}
          w={isCollapsed ? "auto" : "full"}
          minH="44px"
        >
          <FiLogOut size={isCollapsed ? "18px" : "16px"} />
          {!isCollapsed && <Text>Log Out</Text>}
        </Flex>

        {/* User Email */}
        {currentUser?.email && !isCollapsed && (
          <Text 
            fontSize="xs" 
            p={2} 
            truncate 
            maxW="full"
            color={mutedTextColor}
            mt={2}
          >
            {currentUser.email}
          </Text>
        )}
      </Box>
    </>
  )
}

export default Sidebar
