import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"

import type { ItemPublic } from "@/client"

import DeleteItem from "@/components/Items/DeleteItem"
import EditItem from "@/components/Items/EditItem"
import { MenuContent, MenuRoot, MenuTrigger } from "@/components/ui/menu"

interface CardActionsMenuProps {
  item: ItemPublic
}

export default function CardActionsMenu({ item }: CardActionsMenuProps) {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton
          variant="ghost"
          size="xs"
          aria-label="Card actions"
          color="inherit"
          _hover={{ bg: "gray.100" }}
          _dark={{ _hover: { bg: "gray.600" } }}
          onClick={(e) => e.stopPropagation()}
        >
          <BsThreeDotsVertical />
        </IconButton>
      </MenuTrigger>
      <MenuContent minW="40">
        <EditItem item={item} />
        <DeleteItem id={item.id} />
      </MenuContent>
    </MenuRoot>
  )
}
