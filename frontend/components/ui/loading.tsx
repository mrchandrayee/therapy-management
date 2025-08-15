import { cn } from "@/lib/utils"

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "spinner" | "dots" | "pulse" | "skeleton"
  className?: string
  text?: string
}

export function Loading({ size = "md", variant = "spinner", className, text }: LoadingProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="flex flex-col items-center space-y-2">
          <svg
            className={cn("animate-spin text-primary", sizes[size])}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center space-x-1", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-primary rounded-full animate-pulse",
                size === "sm" && "w-1 h-1",
                size === "md" && "w-2 h-2",
                size === "lg" && "w-3 h-3",
                size === "xl" && "w-4 h-4"
              )}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1s"
              }}
            />
          ))}
        </div>
        {text && <p className="text-sm text-muted-foreground ml-2">{text}</p>}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="flex flex-col items-center space-y-2">
          <div className={cn("bg-primary rounded-full animate-pulse", sizes[size])} />
          {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
      </div>
    )
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  return null
}

// Page loading component
export function PageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loading size="lg" text={text} />
    </div>
  )
}

// Section loading component
export function SectionLoading({ text, className }: { text?: string; className?: string }) {
  return (
    <div className={cn("py-12 flex items-center justify-center", className)}>
      <Loading size="md" text={text} />
    </div>
  )
}

// Button loading component
export function ButtonLoading({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <svg
      className={cn(
        "animate-spin",
        size === "sm" ? "w-4 h-4" : "w-5 h-5"
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}