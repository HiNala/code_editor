import { Flex, Image } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

import { useColorModeValue } from "../ui/color-mode"
import { ThemeToggle } from "../ui/theme-toggle"
import UserMenu from "./UserMenu"

const logo = "/assets/images/CRE8ABLE_logo.png"

function Navbar() {
  // Theme-responsive colors
  const bgColor = useColorModeValue("white", "gray.900")
  const textColor = useColorModeValue("gray.900", "white")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  return (
    <Flex
      display="flex"
      justify="space-between"
      position="sticky"
      color={textColor}
      align="center"
      bg={bgColor}
      borderBottom="1px solid"
      borderBottomColor={borderColor}
      w="100%"
      top={0}
      h={{ base: "14", md: "16" }} // 56px mobile, 64px desktop
      px={{ base: 2, md: 4 }}
      py={{ base: 1, md: 2 }}
      zIndex={10}
    >
      <Link to="/">
        <Image src={logo} alt="Cre8able logo" h={{ base: "8", md: "10" }} />
      </Link>
      <Flex gap={{ base: 2, md: 3 }} alignItems="center">
        <ThemeToggle />
        <UserMenu />
      </Flex>
    </Flex>
  )
}

export default Navbar
