import React from "react"
import { Share, Sparkles, History, Settings } from "lucide-react"
import { Button } from "../ui/button"
import { HoverBorderGradient } from "../ui/hover-border-gradient"
import { ProjectSelector } from "../Studio/ProjectSelector"
import { UserDropdown } from "./UserDropdown"
import { ConnectionStatus } from "./ConnectionStatus"
import { StudioLogo } from "./StudioLogo"
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

  return (
    <div className={cn("studio-topbar", className)}>
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

      {/* Floating Generate Button (v0.dev style) */}
      <div className="fixed bottom-6 right-6 z-50">
        <HoverBorderGradient
          as="button"
          containerClassName="rounded-xl shadow-lg"
          className={cn(
            "bg-primary text-primary-foreground px-6 py-3 font-medium transition-all duration-200",
            isGenerating && "opacity-75 cursor-not-allowed"
          )}
          disabled={isGenerating || !currentProject}
          onClick={handleGenerate}
          duration={0.8}
        >
          <Sparkles className={cn(
            "h-4 w-4 mr-2",
            isGenerating && "animate-spin"
          )} />
          {isGenerating ? "Generating..." : "Generate"}
        </HoverBorderGradient>
      </div>
    </div>
  )
} 