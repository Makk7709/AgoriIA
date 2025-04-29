import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "secondary" | "muted"
  className?: string
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
}

const colorClasses = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-muted-foreground",
}

export function LoadingSpinner({
  size = "md",
  color = "primary",
  className,
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
      />
    </div>
  )
} 