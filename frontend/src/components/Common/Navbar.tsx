import { Flex, Image, useBreakpointValue } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

import { useColorModeValue } from "../ui/color-mode"
import { ThemeToggle } from "../ui/theme-toggle"
import UserMenu from "./UserMenu"

const logo = "/assets/images/CRE8ABLE_logo.png"

function Navbar() {
  const display = useBreakpointValue({ base: "none", md: "flex" })

  // Theme-responsive colors
  const bgColor = useColorModeValue("white", "gray.900")
  const textColor = useColorModeValue("gray.900", "white")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  return (
    <Flex
      display={display}
      justify="space-between"
      position="sticky"
      color={textColor}
      align="center"
      bg={bgColor}
      borderBottom="1px solid"
      borderBottomColor={borderColor}
      w="100%"
      top={0}
      h="16" // 64px - slightly taller
      px={4}
      py={2}
      zIndex={10}
    >
      <Link to="/">
        <Image src={logo} alt="Cre8able logo" h="10" />
      </Link>
      <Flex gap={3} alignItems="center">
        <ThemeToggle />
        <UserMenu />
      </Flex>
    </Flex>
  )
}

export default Navbar
