import React from "react"
import { Code } from "lucide-react"
import { cn } from "../../lib/utils"

interface StudioLogoProps {
  className?: string
}

export function StudioLogo({ className }: StudioLogoProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Code className="w-full h-full text-primary" />
    </div>
  )
} 