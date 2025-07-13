"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

export interface NavItem {
  name: string
  icon: React.ComponentType<{ className?: string }>
  url: string
  badge?: number
}

export interface TubelightNavBarProps {
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
        : "bg-background border-t border-border w-full justify-center py-2 px-4",
      className
    )}>
      {/* Background highlight */}
      {activeIndex >= 0 && (
        <motion.div
          layoutId={`navbar-highlight-${variant}`}
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
          layoutId={`navbar-glow-${variant}`}
          className={cn(
            "absolute bg-primary/20 blur-sm rounded-full",
            variant === "desktop" ? "inset-y-0" : "inset-y-0"
          )}
          initial={false}
          animate={{
            x: variant === "desktop" 
              ? `calc(${activeIndex} * (100% / ${items.length}) + 0.125rem)`
              : `calc(${activeIndex} * (100% / ${items.length}) + 0.125rem)`,
            width: variant === "desktop" 
              ? `calc(100% / ${items.length} - 0.25rem)`
              : `calc(100% / ${items.length} - 0.25rem)`
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      )}
      
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
                "relative flex items-center justify-center transition-all duration-200 focus-ring-mobile",
                variant === "desktop" 
                  ? "px-4 py-2 text-sm font-medium rounded-full min-w-[80px] hover:scale-105"
                  : "p-3 flex-col gap-1 min-h-[56px] min-w-[56px] hover:scale-110",
                isActive 
                  ? "text-primary scale-105" 
                  : "text-muted-foreground hover:text-foreground",
                // Enhanced mobile touch targets
                variant === "mobile" && "touch-target"
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={`${item.name}${item.badge ? ` (${item.badge} notifications)` : ''}`}
            >
              <Icon className={cn(
                "transition-transform duration-200",
                variant === "desktop" ? "w-4 h-4 mr-2" : "w-5 h-5",
                isActive && "scale-110"
              )} />
              
              {variant === "desktop" && (
                <span className="font-medium">{item.name}</span>
              )}
              
              {variant === "mobile" && (
                <span className={cn(
                  "text-xs font-medium transition-opacity duration-200",
                  isActive ? "opacity-100" : "opacity-75"
                )}>
                  {item.name}
                </span>
              )}

              {/* Badge */}
              {item.badge && item.badge > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "absolute bg-destructive text-destructive-foreground text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium shadow-md",
                    variant === "desktop" 
                      ? "-top-1 -right-1" 
                      : "top-1 right-1"
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

              {/* Hover effect overlay */}
              <motion.div
                className="absolute inset-0 bg-primary/5 rounded-full opacity-0"
                whileHover={{ opacity: 1 }}
                whileTap={{ opacity: 0.5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// Convenience functions for different variants
export const createDesktopNavBar = (props: Omit<TubelightNavBarProps, "variant">) => (
  <TubelightNavBar {...props} variant="desktop" />
)

export const createMobileNavBar = (props: Omit<TubelightNavBarProps, "variant">) => (
  <TubelightNavBar {...props} variant="mobile" />
) 