import React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const loaderVariants = cva(
  "animate-spin",
  {
    variants: {
      variant: {
        circular: "border-2 border-current border-t-transparent rounded-full",
        dots: "flex space-x-1",
        bars: "flex space-x-1",
      },
      size: {
        sm: "w-4 h-4",
        md: "w-6 h-6", 
        lg: "w-8 h-8",
      },
    },
    defaultVariants: {
      variant: "circular",
      size: "md",
    },
  }
)

interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, variant, size, ...props }, ref) => {
    if (variant === "dots") {
      return (
        <div
          ref={ref}
          className={cn("flex space-x-1", className)}
          {...props}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-current rounded-full animate-pulse",
                size === "sm" && "w-1 h-1",
                size === "md" && "w-1.5 h-1.5",
                size === "lg" && "w-2 h-2"
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "0.6s",
              }}
            />
          ))}
        </div>
      )
    }

    if (variant === "bars") {
      return (
        <div
          ref={ref}
          className={cn("flex space-x-1 items-end", className)}
          {...props}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-current animate-pulse",
                size === "sm" && "w-0.5 h-2",
                size === "md" && "w-1 h-3",
                size === "lg" && "w-1.5 h-4"
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(loaderVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
Loader.displayName = "Loader"

export { Loader, loaderVariants } 