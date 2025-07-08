import { Box, Flex, IconButton, Text } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { FiLogOut, FiChevronRight, FiChevronLeft } from "react-icons/fi"

import type { UserPublic } from "@/client"
import useAuth from "@/hooks/useAuth"
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
        <DrawerContent maxW="xs" bg="black" color="white">
          <DrawerCloseTrigger color="white" />
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
                    background: "whiteAlpha.200",
                  }}
                  borderRadius="md"
                  color="whiteAlpha.900"
                  transition="all 0.2s"
                >
                  <FiLogOut />
                  <Text>Log Out</Text>
                </Flex>
              </Box>
              {currentUser?.email && (
                <Text fontSize="sm" p={2} truncate maxW="sm" color="whiteAlpha.700">
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
        bg="black"
        top={0}
        w={isCollapsed ? "60px" : "240px"}
        minW={isCollapsed ? "60px" : "240px"}
        maxW={isCollapsed ? "60px" : "240px"}
        h="100%"
        p={4}
        transition="all 0.3s ease"
        flexDirection="column"
        borderRight="1px solid"
        borderRightColor="whiteAlpha.200"
      >
        {/* Toggle Button with Arrow Icons */}
        <Flex justify="flex-end" mb={4}>
          <IconButton
            variant="ghost"
            size="xs"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
            color="whiteAlpha.500"
            _hover={{
              bg: "whiteAlpha.100",
              color: "whiteAlpha.700"
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
            background: "whiteAlpha.200",
          }}
          borderRadius="md"
          justify="center"
          color="whiteAlpha.900"
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
            color="whiteAlpha.600"
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
