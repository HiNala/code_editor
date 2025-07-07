import { Box, Flex, IconButton, Text } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
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
  const [isCollapsed, setIsCollapsed] = useState(false)

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
        <DrawerContent maxW="xs">
          <DrawerCloseTrigger />
          <DrawerBody>
            <Flex flexDir="column" justify="space-between">
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
                >
                  <FiLogOut />
                  <Text>Log Out</Text>
                </Flex>
              </Box>
              {currentUser?.email && (
                <Text fontSize="sm" p={2} truncate maxW="sm">
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
        bg="bg.subtle"
        top={0}
        w={isCollapsed ? "60px" : "240px"}
        h="100vh"
        p={4}
        transition="width 0.3s ease"
        flexDirection="column"
      >
        {/* Toggle Button */}
        <Flex justify={isCollapsed ? "center" : "flex-end"} mb={4}>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
            background: "gray.subtle",
          }}
          borderRadius="md"
          justify={isCollapsed ? "center" : "flex-start"}
        >
          <FiLogOut />
          {!isCollapsed && <Text>Log Out</Text>}
        </Flex>

        {/* User Email */}
        {currentUser?.email && !isCollapsed && (
          <Text fontSize="sm" p={2} truncate maxW="sm">
            Logged in as: {currentUser.email}
          </Text>
        )}
      </Box>
    </>
  )
}

export default Sidebar
