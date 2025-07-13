"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

export interface NavItem {
  name: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface TubelightNavBarProps {
  items: NavItem[]
  activeItem?: string
  onItemClick?: (item: NavItem) => void
  className?: string
  variant?: "desktop" | "mobile"
}

export function TubelightNavBar({
  items,
  activeItem,
  onItemClick,
  className,
  variant = "desktop"
}: TubelightNavBarProps) {
  const activeIndex = items.findIndex(item => item.url === activeItem || item.name.toLowerCase() === activeItem?.toLowerCase())

  return (
    <nav className={cn(
      "relative flex items-center",
      variant === "desktop" 
        ? "bg-background/95 backdrop-blur-md border border-border rounded-full p-1 shadow-lg"
        : "bg-background border-t border-border w-full justify-center py-2",
      className
    )}>
      {/* Background highlight */}
      {activeIndex >= 0 && (
        <motion.div
          layoutId="navbar-highlight"
          className={cn(
            "absolute bg-primary/10 rounded-full",
            variant === "desktop" ? "inset-y-1" : "inset-y-1"
          )}
          initial={false}
          animate={{
            x: variant === "desktop" 
              ? `calc(${activeIndex} * (100% / ${items.length}) + 0.25rem)`
              : `calc(${activeIndex} * (100% / ${items.length}))`,
            width: variant === "desktop" 
              ? `calc(100% / ${items.length} - 0.5rem)`
              : `calc(100% / ${items.length})`
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      )}

      {/* Tubelight glow effect */}
      {activeIndex >= 0 && (
        <motion.div
          layoutId="navbar-glow"
          className={cn(
            "absolute bg-primary/20 rounded-full blur-sm",
            variant === "desktop" ? "inset-y-0" : "inset-y-0"
          )}
          initial={false}
          animate={{
            x: variant === "desktop" 
              ? `calc(${activeIndex} * (100% / ${items.length}) + 0.125rem)`
              : `calc(${activeIndex} * (100% / ${items.length}))`,
            width: variant === "desktop" 
              ? `calc(100% / ${items.length} - 0.25rem)`
              : `calc(100% / ${items.length})`
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      )}

      {/* Navigation items */}
      <div className={cn(
        "relative flex w-full",
        variant === "desktop" ? "gap-0" : "justify-around"
      )}>
        {items.map((item, index) => {
          const isActive = index === activeIndex
          const Icon = item.icon

          return (
            <button
              key={item.name}
              onClick={() => onItemClick?.(item)}
              className={cn(
                "relative flex items-center justify-center transition-colors duration-200 focus-ring",
                variant === "desktop" 
                  ? "px-4 py-2 text-sm font-medium rounded-full min-w-[80px]"
                  : "p-3 flex-col gap-1",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={cn(
                variant === "desktop" ? "w-4 h-4 mr-2" : "w-5 h-5"
              )} />
              
              {variant === "desktop" && (
                <span>{item.name}</span>
              )}
              
              {variant === "mobile" && (
                <span className="text-xs font-medium">{item.name}</span>
              )}

              {/* Badge */}
              {item.badge && item.badge > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center",
                    variant === "mobile" && "top-0 right-2"
                  )}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </motion.div>
              )}

              {/* Active indicator for mobile */}
              {variant === "mobile" && isActive && (
                <motion.div
                  layoutId="mobile-indicator"
                  className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full"
                  initial={false}
                  animate={{ x: "-50%" }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// Preset configurations
export const createDesktopNavBar = (props: Omit<TubelightNavBarProps, "variant">) => (
  <TubelightNavBar {...props} variant="desktop" />
)

export const createMobileNavBar = (props: Omit<TubelightNavBarProps, "variant">) => (
  <TubelightNavBar {...props} variant="mobile" />
) 