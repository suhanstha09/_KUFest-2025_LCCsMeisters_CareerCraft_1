import * as React from "react"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className = "", value = 0, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, value));

    const getProgressColor = (score: number) => {
      if (score >= 80) return 'bg-green-500';
      if (score >= 60) return 'bg-blue-500';
      if (score >= 40) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div
        ref={ref}
        className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${className}`}
        {...props}
      >
        <div
          className={`h-full transition-all duration-500 ease-out ${getProgressColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
