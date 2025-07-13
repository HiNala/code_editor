import React from 'react'
import { FolderOpen } from 'lucide-react'
import { Button } from '../ui/button'

interface ProjectSelectorProps {
  currentProject?: string | null
  onProjectChange?: () => void
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({ 
  currentProject = "My Project",
  onProjectChange 
}) => {
  return (
    <div className="flex items-center gap-2">
      <FolderOpen className="h-4 w-4" />
      <Button variant="ghost" size="sm" onClick={onProjectChange}>
        {currentProject || "My Project"}
      </Button>
    </div>
  )
} 