import { type PropsWithChildren } from "react"
import { TooltipProvider } from "./tooltip"

export function Provider({ children }: PropsWithChildren) {
  return (
    <TooltipProvider>
      {children}
    </TooltipProvider>
  )
}
