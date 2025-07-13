import React from 'react'
import { Button } from '../ui/button'

export const WorkspaceTabs: React.FC = () => {
  return (
    <div className="flex items-center gap-1">
      <Button variant="default" size="sm">
        Code
      </Button>
      <Button variant="ghost" size="sm">
        Preview
      </Button>
      <Button variant="ghost" size="sm">
        Console
      </Button>
    </div>
  )
} 