import React from "react"
import { motion } from "framer-motion"
import { MessageSquare, Palette, Eye, Code, ChevronDown } from "lucide-react"
import { TubelightNavBar } from "../ui/tubelight-navbar"
import { Button } from "../ui/button"
import { useStudioStore } from "../../stores/studioStore"
import { WORKSPACE_ITEMS, VIEW_ITEMS } from "../../lib/navigation"
import { cn } from "../../lib/utils"
import type { WorkspaceType, ViewType } from "../../lib/navigation"

interface WorkspaceTabsProps {
  className?: string
}

export function WorkspaceTabs({ className }: WorkspaceTabsProps) {
  const { 
    activeWorkspace, 
    setActiveWorkspace, 
    activeView, 
    setActiveView 
  } = useStudioStore()

  const handleWorkspaceChange = (item: any) => {
    const workspace = item.name.toLowerCase() as WorkspaceType
    setActiveWorkspace(workspace)
  }

  const handleViewChange = (item: any) => {
    const view = item.name.toLowerCase() as ViewType
    setActiveView(view)
  }

  return (
    <div className={cn("studio-tabs", className)}>
      {/* Left Side: Workspace Tabs */}
      <div className="flex items-center">
        <TubelightNavBar
          items={WORKSPACE_ITEMS}
          activeItem={activeWorkspace}
          onItemClick={handleWorkspaceChange}
          variant="desktop"
          className="bg-background border border-border rounded-lg p-1"
        />
      </div>
      
      {/* Right Side: View Tabs + Version Selector */}
      <div className="flex items-center gap-4">
        <TubelightNavBar
          items={VIEW_ITEMS}
          activeItem={activeView}
          onItemClick={handleViewChange}
          variant="desktop"
          className="bg-background border border-border rounded-lg p-1"
        />
        
        <VersionSelector />
      </div>
    </div>
  )
}

// Version Selector Component
function VersionSelector() {
  const [isOpen, setIsOpen] = React.useState(false)
  const currentVersion = "v3" // Mock current version

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xs font-medium">{currentVersion}</span>
        <ChevronDown className="ml-1 h-3 w-3" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Version Dropdown */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-50 p-1">
            <div className="text-xs font-medium text-muted-foreground px-2 py-1">
              Recent Versions
            </div>
            
            {['v3', 'v2', 'v1'].map((version) => (
              <button
                key={version}
                className={cn(
                  "flex items-center justify-between w-full px-2 py-2 text-sm hover:bg-accent rounded-md",
                  version === currentVersion && "bg-accent"
                )}
                onClick={() => {
                  console.log("Version selected:", version)
                  setIsOpen(false)
                }}
              >
                <span>{version}</span>
                {version === currentVersion && (
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
            
            <div className="border-t border-border my-1" />
            
            <button
              className="flex items-center w-full px-2 py-2 text-sm hover:bg-accent rounded-md text-muted-foreground"
              onClick={() => {
                console.log("View all versions")
                setIsOpen(false)
              }}
            >
              View All Versions
            </button>
          </div>
        </>
      )}
    </div>
  )
} 