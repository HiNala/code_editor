import React from 'react'
import { User } from 'lucide-react'
import { Button } from '../ui/button'

export const UserDropdown: React.FC = () => {
  return (
    <Button variant="ghost" size="sm">
      <User className="h-4 w-4" />
    </Button>
  )
} 