import { cn } from "@/lib/utils";
import { formatTime, formatTimeWithLabel } from "@/lib/utils/time-formatting";

/**
 * Timer display component props interface
 * 
 * @interface TimerDisplayProps
 * @description Defines props for the timer display component (Server Component)
 */
export interface TimerDisplayProps {
  /** Current time value in seconds */
  time: number;
  /** Visual size variant */
  size?: "sm" | "md" | "lg";
  /** Color theme for urgency indication */
  color?: "default" | "success" | "warning" | "danger";
  /** Whether to show hours even when less than 1 hour */
  showHours?: boolean;
  /** Whether to show milliseconds in display */
  showMilliseconds?: boolean;
  /** Whether to show contextual label */
  showLabel?: boolean;
  /** Context for label display */
  labelContext?: "remaining" | "elapsed" | "limit" | "estimated";
  /** Custom label text (overrides labelContext) */
  customLabel?: string;
  /** Accessibility label for screen readers */
  "aria-label"?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to use monospace font for consistent width */
  monospace?: boolean;
}

/**
 * Timer Display Component (Server Component)
 * 
 * Provides consistent visual formatting for timer values across the application.
 * This is a Server Component that handles the visual presentation of timer data
 * without any client-side interactivity.
 * 
 * Features:
 * - Responsive sizing with consistent typography
 * - Color themes for urgency indication
 * - Accessibility support with proper ARIA labels
 * - Monospace font option for stable width
 * - Contextual labeling for better UX
 * 
 * @param props - Timer display configuration
 * @returns JSX element for timer display
 * 
 * @example
 * // Basic countdown display
 * <TimerDisplay 
 *   time={90} 
 *   color="warning" 
 *   showLabel 
 *   labelContext="remaining" 
 * />
 * 
 * @example
 * // Large stopwatch display with hours
 * <TimerDisplay 
 *   time={3661} 
 *   size="lg" 
 *   showHours 
 *   monospace 
 *   labelContext="elapsed" 
 * />
 */
export function TimerDisplay({
  time,
  size = "md",
  color = "default",
  showHours = false,
  showMilliseconds = false,
  showLabel = false,
  labelContext = "remaining",
  customLabel,
  "aria-label": ariaLabel,
  className,
  monospace = true,
}: TimerDisplayProps) {
  // Format the time value
  const formattedTime = formatTime(time, showHours, showMilliseconds);
  
  // Generate label if needed
  const label = customLabel || (showLabel ? formatTimeWithLabel(time, labelContext) : null);
  
  // Size-based styling
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl font-semibold",
  };
  
  // Color-based styling using CSS variables for theme compatibility
  const colorClasses = {
    default: "text-foreground",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400", 
    danger: "text-red-600 dark:text-red-400",
  };
  
  // Generate accessible label for screen readers
  const accessibleLabel = ariaLabel || 
    (showLabel ? label : `Timer showing ${formattedTime}`) || 
    `Timer showing ${formattedTime}`;
  
  return (
    <div 
      className={cn(
        "timer-display flex flex-col items-center gap-1",
        className
      )}
      role="timer"
      aria-label={accessibleLabel}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Main time display */}
      <div
        className={cn(
          "timer-value font-medium tabular-nums",
          sizeClasses[size],
          colorClasses[color],
          monospace && "font-mono",
          // Ensure consistent width for countdown timers
          "min-w-fit text-center"
        )}
        aria-hidden="true" // Screen readers will use the container's aria-label
      >
        {formattedTime}
      </div>
      
      {/* Optional label */}
      {label && (
        <div
          className={cn(
            "timer-label text-xs text-muted-foreground text-center",
            size === "lg" && "text-sm"
          )}
          aria-hidden="true" // Included in main aria-label
        >
          {label}
        </div>
      )}
    </div>
  );
}

/**
 * Compact Timer Display Component
 * 
 * A minimal version of TimerDisplay for use in tight spaces like
 * navigation bars, cards, or inline contexts.
 * 
 * @param props - Subset of TimerDisplayProps for compact display
 * @returns JSX element for compact timer display
 * 
 * @example
 * // Compact timer for navigation
 * <CompactTimerDisplay time={120} color="warning" />
 */
export function CompactTimerDisplay({
  time,
  color = "default",
  showHours = false,
  className,
  "aria-label": ariaLabel,
}: Pick<TimerDisplayProps, "time" | "color" | "showHours" | "className" | "aria-label">) {
  const formattedTime = formatTime(time, showHours, false);
  const colorClasses = {
    default: "text-foreground",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-red-600 dark:text-red-400",
  };
  
  return (
    <span
      className={cn(
        "timer-compact font-mono text-sm font-medium tabular-nums",
        colorClasses[color],
        className
      )}
      role="timer"
      aria-label={ariaLabel || `Timer: ${formattedTime}`}
      aria-live="polite"
    >
      {formattedTime}
    </span>
  );
}

/**
 * Timer Progress Display Component
 * 
 * Combines timer display with a visual progress indicator.
 * Useful for progress timers and visual countdown scenarios.
 * 
 * @param props - Timer display props with progress information
 * @returns JSX element with timer and progress bar
 * 
 * @example
 * // Progress timer for section completion
 * <TimerProgressDisplay 
 *   time={45} 
 *   progress={75} 
 *   color="success" 
 *   showLabel 
 * />
 */
export function TimerProgressDisplay({
  time,
  progress,
  size = "md",
  color = "default",
  showLabel = true,
  labelContext = "remaining",
  className,
  "aria-label": ariaLabel,
}: TimerDisplayProps & { progress: number }) {
  const progressColorClasses = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
  };
  
  return (
    <div 
      className={cn(
        "timer-progress-display space-y-2",
        className
      )}
      role="timer"
      aria-label={ariaLabel || `Timer with ${Math.round(progress)}% progress`}
    >
      {/* Timer display */}
      <TimerDisplay
        time={time}
        size={size}
        color={color}
        showLabel={showLabel}
        labelContext={labelContext}
        aria-label="" // Prevent duplicate announcements
      />
      
      {/* Progress bar */}
      <div 
        className="timer-progress-bar w-full bg-muted rounded-full h-2"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${Math.round(progress)}%`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            progressColorClasses[color]
          )}
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
    </div>
  );
}
