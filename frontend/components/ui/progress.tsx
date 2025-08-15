import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "success" | "warning" | "error"
  showLabel?: boolean
  label?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, size = "md", variant = "default", showLabel = false, label, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizeClasses = {
      sm: "h-2",
      md: "h-3",
      lg: "h-4"
    }

    const variantClasses = {
      default: "bg-primary",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500"
    }

    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        {(showLabel || label) && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {label || `Progress`}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        
        <div className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizeClasses[size]
        )}>
          <div
            className={cn(
              "h-full transition-all duration-300 ease-in-out rounded-full",
              variantClasses[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

// Step Progress Component
interface StepProgressProps {
  steps: Array<{
    label: string
    description?: string
    completed?: boolean
    current?: boolean
  }>
  className?: string
}

export function StepProgress({ steps, className }: StepProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step.completed 
                  ? "bg-green-500 text-white"
                  : step.current
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              )}>
                {step.completed ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={cn(
                  "text-sm font-medium",
                  step.current ? "text-primary" : "text-gray-600"
                )}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-1 mx-4 rounded-full transition-colors",
                steps[index + 1]?.completed || step.completed
                  ? "bg-green-500"
                  : "bg-gray-200"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// Circular Progress Component
interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
  label?: string
}

export function CircularProgress({ 
  value, 
  max = 100, 
  size = 120, 
  strokeWidth = 8, 
  className,
  showLabel = true,
  label
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-300 ease-in-out"
        />
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(percentage)}%
            </div>
            {label && (
              <div className="text-sm text-gray-500">
                {label}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { Progress }