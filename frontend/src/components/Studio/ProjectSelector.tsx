import React from 'react'
import { FolderOpen } from 'lucide-react'
import { Button } from '../ui/button'

export const ProjectSelector: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <FolderOpen className="h-4 w-4" />
      <Button variant="ghost" size="sm">
        My Project
      </Button>
    </div>
  )
} 