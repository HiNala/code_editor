import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient } from "@tanstack/react-query"
import { Link as RouterLink, useMatchRoute } from "@tanstack/react-router"
import { 
  Home, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  BarChart3,
  FileText,
  Bell,
  Search,
  HelpCircle,
  MessageSquare,
  Video,
  PlusSquare,
  Users
} from 'lucide-react'
import type { IconType } from "react-icons/lib"

import type { UserPublic } from "@/client"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { ScrollArea } from "../ui/scroll-area"

interface NavigationItem {
  id: string
  name: string
  icon: any
  href: string
  badge?: string
}

interface SidebarItemsProps {
  onClose?: () => void
  isCollapsed?: boolean
}

// Navigation items
const items = [
  { id: "dashboard", name: "Dashboard", icon: Home, href: "/" },
  { id: "plan", name: "Plan", icon: BarChart3, href: "/plan" },
  { id: "create", name: "Create", icon: PlusSquare, href: "/create" },
  { id: "videos", name: "Videos", icon: Video, href: "/videos" },
  { id: "settings", name: "User Settings", icon: Settings, href: "/settings" },
]

const sidebarVariants = {
  open: {
    width: "16rem",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    width: "4rem",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

const itemVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    x: -10,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

const SidebarItems = ({ onClose, isCollapsed = false }: SidebarItemsProps) => {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const matchRoute = useMatchRoute()
  const [activeItem, setActiveItem] = useState("dashboard")

  // Add admin item if user is superuser
  const finalItems = currentUser?.is_superuser
    ? [...items, { id: "admin", name: "Admin", icon: Users, href: "/admin" }]
    : items

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId)
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="px-2 py-2">
          <ul className="space-y-1">
            {finalItems.map((item) => {
              const Icon = item.icon
              const isActive = !!matchRoute({ to: item.href, fuzzy: false })

              return (
                <li key={item.id}>
                  <RouterLink to={item.href} onClick={() => handleItemClick(item.id)}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start h-10 px-2 relative group",
                        isCollapsed && "justify-center"
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon className={cn(
                        "h-4 w-4 mr-2",
                        isCollapsed && "mr-0",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                      
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.div
                            variants={itemVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="flex items-center justify-between w-full"
                          >
                            <span className={cn(
                              "text-sm",
                              isActive && "font-medium"
                            )}>
                              {item.name}
                            </span>
                            
                            {item.badge && (
                              <Badge variant={isActive ? "default" : "secondary"} className="ml-auto">
                                {item.badge}
                              </Badge>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Badge for collapsed state */}
                      {isCollapsed && item.badge && (
                        <Badge 
                          variant="default"
                          className="absolute top-1 right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px]"
                        >
                          {parseInt(item.badge) > 9 ? '9+' : item.badge}
                        </Badge>
                      )}

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                          layoutId="activeIndicator"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Button>
                  </RouterLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </ScrollArea>

      {/* Bottom section with profile */}
      <div className="mt-auto border-t border-border">
        {/* Profile Section */}
        <div className="p-3">
          <div className={cn(
            "flex items-center rounded-md p-2 bg-muted/50 hover:bg-muted transition-colors",
            isCollapsed ? "justify-center" : "px-3"
          )}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                {currentUser?.full_name ? currentUser.full_name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="ml-3 flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-foreground truncate">
                    {currentUser?.full_name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentUser?.email || "user@example.com"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!isCollapsed && (
              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" title="Online" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidebarItems
