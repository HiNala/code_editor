import { Flex, Image, useBreakpointValue } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

import { useColorModeValue } from "@/components/ui/color-mode"
import UserMenu from "./UserMenu"

const logoLight = "/assets/images/cre8able-logo-light.svg"
const logoDark = "/assets/images/cre8able-logo-dark.svg"

function Navbar() {
  const display = useBreakpointValue({ base: "none", md: "flex" })

  const logoSrc = useColorModeValue(logoLight, logoDark)

  return (
    <Flex
      display={display}
      justify="space-between"
      position="sticky"
      color="white"
      align="center"
      bg="bg.muted"
      w="100%"
      top={0}
      p={4}
    >
      <Link to="/">
        <Image src={logoSrc} alt="Cre8able logo" maxW="3xs" p={2} />
      </Link>
      <Flex gap={2} alignItems="center">
        <UserMenu />
      </Flex>
    </Flex>
  )
}

export default Navbar
