import React from "react"
import { Wifi, WifiOff, Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

interface ConnectionStatusProps {
  status: 'connected' | 'connecting' | 'disconnected'
  className?: string
}

export function ConnectionStatus({ status, className }: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: Wifi,
          color: "text-success-500",
          bgColor: "bg-success-500/10",
          label: "Connected"
        }
      case 'connecting':
        return {
          icon: Loader2,
          color: "text-warning-500",
          bgColor: "bg-warning-500/10", 
          label: "Connecting",
          animate: "animate-spin"
        }
      case 'disconnected':
        return {
          icon: WifiOff,
          color: "text-error-500",
          bgColor: "bg-error-500/10",
          label: "Disconnected"
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <div className={cn(
      "flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium",
      config.bgColor,
      className
    )}>
      <Icon className={cn(
        "w-3 h-3",
        config.color,
        config.animate
      )} />
      <span className={config.color}>
        {config.label}
      </span>
    </div>
  )
} 