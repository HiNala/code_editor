import { Box, Flex, IconButton, Text } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { FaBars } from "react-icons/fa"
import { FiLogOut, FiChevronLeft, FiChevronRight } from "react-icons/fi"

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
            <FaBars />
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
        h="100vh"
        p={4}
        transition="width 0.3s ease"
        flexDirection="column"
        borderRight="1px solid"
        borderRightColor="whiteAlpha.200"
      >
        {/* Logo/Brand Area */}
        <Flex 
          justify={isCollapsed ? "center" : "flex-start"} 
          align="center"
          mb={6}
          h="40px"
        >
          {!isCollapsed && (
            <Text 
              fontSize="lg" 
              fontWeight="bold" 
              color="white"
              letterSpacing="wide"
            >
              CRE8ABLE
            </Text>
          )}
          {isCollapsed && (
            <Box 
              w="8" 
              h="8" 
              bg="white" 
              borderRadius="md" 
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="sm" fontWeight="bold" color="black">
                C8
              </Text>
            </Box>
          )}
        </Flex>

        {/* Toggle Button */}
        <Flex justify={isCollapsed ? "center" : "flex-end"} mb={4}>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
            color="whiteAlpha.700"
            _hover={{
              bg: "whiteAlpha.200",
              color: "white"
            }}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </IconButton>
        </Flex>

        {/* Sidebar Content */}
        <Box flex="1">
          <SidebarItems isCollapsed={isCollapsed} />
        </Box>

        {/* Logout Button */}
        <Flex
          as="button"
          onClick={() => {
            logout()
          }}
          alignItems="center"
          gap={4}
          px={4}
          py={2}
          mt={4}
          _hover={{
            background: "whiteAlpha.200",
          }}
          borderRadius="md"
          justify={isCollapsed ? "center" : "flex-start"}
          color="whiteAlpha.900"
          transition="all 0.2s"
        >
          <FiLogOut />
          {!isCollapsed && <Text>Log Out</Text>}
        </Flex>

        {/* User Email */}
        {currentUser?.email && !isCollapsed && (
          <Text 
            fontSize="sm" 
            p={2} 
            truncate 
            maxW="sm"
            color="whiteAlpha.600"
            mt={2}
          >
            Logged in as: {currentUser.email}
          </Text>
        )}
      </Box>
    </>
  )
}

export default Sidebar
