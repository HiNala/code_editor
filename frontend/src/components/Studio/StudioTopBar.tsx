import React from "react"
import { motion } from "framer-motion"
import { 
  Sparkles, 
  History, 
  Share, 
  Menu,
  Search,
  Bell,
  Settings
} from "lucide-react"
import { StudioLogo } from "./StudioLogo"
import { ProjectSelector } from "../Studio/ProjectSelector"
import { ConnectionStatus } from "./ConnectionStatus"
import { UserDropdown } from "./UserDropdown"
import { HoverBorderGradient } from "../ui/hover-border-gradient"
import { Button } from "../ui/button"
import { useStudioStore } from "../../stores/studioStore"
import { cn } from "../../lib/utils"

interface StudioTopBarProps {
  className?: string
}

export function StudioTopBar({ className }: StudioTopBarProps) {
  const {
    currentProject,
    connectionStatus,
    isGenerating,
    startGeneration,
    // User would come from auth context
  } = useStudioStore()

  const handleSaveVersion = () => {
    // TODO: Implement save version functionality
    console.log("Save version clicked")
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share clicked")
  }

  const handleGenerate = () => {
    if (!isGenerating) {
      startGeneration()
    }
  }

  const handleSearch = () => {
    console.log("Search clicked")
  }

  const handleNotifications = () => {
    console.log("Notifications clicked")
  }

  return (
    <div className={cn("studio-topbar", className)}>
      {/* Mobile Layout */}
      <div className="mobile-only flex items-center justify-between w-full">
        {/* Left: Brand + Menu */}
        <div className="flex items-center gap-2">
          <StudioLogo className="h-5 w-5" />
          <span className="font-semibold text-sm">Studio</span>
        </div>
        
        {/* Right: Essential actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearch}
            className="touch-target p-2"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNotifications}
            className="touch-target p-2 relative"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>
          
          <UserDropdown />
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="tablet-only flex items-center justify-between w-full">
        {/* Left: Brand + Project */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StudioLogo className="h-6 w-6" />
            <span className="font-semibold text-sm">Studio</span>
          </div>
          
          <div className="h-4 w-px bg-border" />
          
          <ProjectSelector 
            currentProject={currentProject}
            onProjectChange={() => {}}
          />
        </div>
        
        {/* Right: Actions + Status + User */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSaveVersion}
            disabled={!currentProject}
            className="hidden sm:flex"
          >
            <History className="h-4 w-4 mr-1" />
            Save
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShare}
            disabled={!currentProject}
          >
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
          
          <ConnectionStatus status={connectionStatus} />
          
          <div className="h-4 w-px bg-border" />
          
          <UserDropdown />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="desktop-only flex items-center justify-between w-full">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StudioLogo className="h-6 w-6" />
            <span className="font-semibold text-sm">Studio</span>
          </div>
        </div>
        
        {/* Center: Project Context */}
        <div className="flex items-center gap-3">
          <ProjectSelector 
            currentProject={currentProject}
            onProjectChange={() => {}}
          />
          
          <div className="h-4 w-px bg-border" />
          
          <HoverBorderGradient
            as="button"
            containerClassName="rounded-xl"
            className="bg-background px-3 py-1.5 text-sm font-medium border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={handleSaveVersion}
            disabled={!currentProject}
          >
            <History className="h-4 w-4 mr-1" />
            Save Version
          </HoverBorderGradient>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShare}
            disabled={!currentProject}
          >
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
        
        {/* Right: Status & User */}
        <div className="flex items-center gap-3">
          <ConnectionStatus status={connectionStatus} />
          
          <div className="h-4 w-px bg-border" />
          
          <UserDropdown />
        </div>
      </div>

      {/* Floating Generate Button (v0.dev style) - All screen sizes */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <HoverBorderGradient
            as="button"
            containerClassName="rounded-xl shadow-lg"
            className={cn(
              "bg-primary text-primary-foreground font-medium transition-all duration-200",
              // Responsive sizing
              "px-4 py-2 text-sm", // Mobile
              "sm:px-6 sm:py-3 sm:text-base", // Tablet and up
              isGenerating && "opacity-75 cursor-not-allowed"
            )}
            disabled={isGenerating || !currentProject}
            onClick={handleGenerate}
            duration={0.8}
          >
            <Sparkles className={cn(
              "mr-2",
              "h-4 w-4", // Mobile
              "sm:h-5 sm:w-5", // Tablet and up
              isGenerating && "animate-spin"
            )} />
            <span className="hidden xs:inline">
              {isGenerating ? "Generating..." : "Generate"}
            </span>
            {/* Mobile: Show only icon on very small screens */}
            <span className="xs:hidden sr-only">
              {isGenerating ? "Generating..." : "Generate"}
            </span>
          </HoverBorderGradient>

          {/* Pulse animation when ready */}
          {!isGenerating && currentProject && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-primary/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
} 