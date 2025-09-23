/**
 * ProgressIndicator component for real-time content consumption tracking
 * 
 * Built using existing Progress component from shadcn/ui and integrates
 * with our timer infrastructure and content estimation system.
 * 
 * Displays progress percentage, elapsed time, remaining time, and
 * provides visual feedback for learning sessions.
 * 
 * @example
 * <ProgressIndicator 
 *   progress={45}
 *   estimatedTime={1800}
 *   elapsedTime={810}
 *   variant="linear"
 *   showTimeRemaining={true}
 * />
 */

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/utils/time-formatting";
import { Clock, Timer, CheckCircle, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressIndicatorProps {
  /** Current progress percentage (0-100) */
  progress: number;
  /** Original estimated time in seconds */
  estimatedTime: number;
  /** Actual elapsed time in seconds */
  elapsedTime: number;
  /** Display variant */
  variant?: 'linear' | 'circular' | 'minimal';
  /** Whether to show remaining time calculation */
  showTimeRemaining?: boolean;
  /** Whether the session is currently active */
  isActive?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Optional label for the progress */
  label?: string;
}

/**
 * Main ProgressIndicator component with multiple display variants
 */
export function ProgressIndicator({
  progress,
  estimatedTime,
  elapsedTime,
  variant = 'linear',
  showTimeRemaining = true,
  isActive = false,
  className,
  label
}: ProgressIndicatorProps) {
  // Calculate remaining time based on current progress
  const remainingTime = calculateRemainingTime(progress, elapsedTime, estimatedTime);
  
  // Determine if we're ahead or behind schedule
  const isAheadOfSchedule = elapsedTime < (estimatedTime * (progress / 100));
  
  if (variant === 'circular') {
    return (
      <CircularProgress
        progress={progress}
        estimatedTime={estimatedTime}
        elapsedTime={elapsedTime}
        remainingTime={remainingTime}
        isActive={isActive}
        showTimeRemaining={showTimeRemaining}
        className={className}
        label={label}
      />
    );
  }

  if (variant === 'minimal') {
    return (
      <MinimalProgress
        progress={progress}
        elapsedTime={elapsedTime}
        remainingTime={remainingTime}
        isActive={isActive}
        className={className}
      />
    );
  }

  return (
    <LinearProgress
      progress={progress}
      estimatedTime={estimatedTime}
      elapsedTime={elapsedTime}
      remainingTime={remainingTime}
      isAheadOfSchedule={isAheadOfSchedule}
      isActive={isActive}
      showTimeRemaining={showTimeRemaining}
      className={className}
      label={label}
    />
  );
}

/**
 * Linear progress display with detailed time information
 */
function LinearProgress({
  progress,
  estimatedTime,
  elapsedTime,
  remainingTime,
  isAheadOfSchedule,
  isActive,
  showTimeRemaining,
  className,
  label
}: {
  progress: number;
  estimatedTime: number;
  elapsedTime: number;
  remainingTime: number;
  isAheadOfSchedule: boolean;
  isActive: boolean;
  showTimeRemaining: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header with label and status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isActive ? (
            <PlayCircle className="h-4 w-4 text-green-600 animate-pulse" />
          ) : progress === 100 ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground" />
          )}
          
          <span className="text-sm font-medium">
            {label || "Progress"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
            {Math.round(progress)}%
          </Badge>
          
          {isAheadOfSchedule && progress > 10 && (
            <Badge variant="default" className="text-xs bg-green-600">
              Ahead
            </Badge>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <Progress 
        value={progress} 
        className="h-2"
        aria-label={`${Math.round(progress)}% complete`}
      />

      {/* Time information */}
      {showTimeRemaining && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              Elapsed: <span className="font-medium text-foreground">
                {formatTime(elapsedTime)}
              </span>
            </span>
            
            <span>
              Estimated: <span className="font-medium text-foreground">
                {formatTime(estimatedTime)}
              </span>
            </span>
          </div>
          
          {remainingTime > 0 && (
            <span>
              Remaining: <span className="font-medium text-foreground">
                ~{formatTime(remainingTime)}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Circular progress display for compact spaces
 */
function CircularProgress({
  progress,
  estimatedTime: _estimatedTime,
  elapsedTime,
  remainingTime,
  isActive,
  showTimeRemaining,
  className,
  label
}: {
  progress: number;
  estimatedTime: number;
  elapsedTime: number;
  remainingTime: number;
  isActive: boolean;
  showTimeRemaining: boolean;
  className?: string;
  label?: string;
}) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Circular progress SVG */}
      <div className="relative">
        <svg
          className="w-20 h-20 transform -rotate-90"
          viewBox="0 0 100 100"
          aria-label={`${Math.round(progress)}% complete`}
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={cn(
              "transition-all duration-300 ease-in-out",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          />
        </svg>
        
        {/* Center percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Time information */}
      <div className="space-y-1">
        {label && (
          <div className="text-sm font-medium">{label}</div>
        )}
        
        <div className="space-y-1 text-xs text-muted-foreground">
          <div>
            Elapsed: <span className="font-medium text-foreground">
              {formatTime(elapsedTime)}
            </span>
          </div>
          
          {showTimeRemaining && remainingTime > 0 && (
            <div>
              Remaining: <span className="font-medium text-foreground">
                ~{formatTime(remainingTime)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Minimal progress display for inline use
 */
function MinimalProgress({
  progress,
  elapsedTime,
  remainingTime,
  isActive,
  className
}: {
  progress: number;
  elapsedTime: number;
  remainingTime: number;
  isActive: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {isActive ? (
        <Timer className="h-4 w-4 text-green-600 animate-pulse" />
      ) : (
        <Clock className="h-4 w-4 text-muted-foreground" />
      )}
      
      <span className="font-medium">
        {Math.round(progress)}%
      </span>
      
      <span className="text-muted-foreground">•</span>
      
      <span className="text-muted-foreground">
        {formatTime(elapsedTime)}
      </span>
      
      {remainingTime > 0 && (
        <>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            ~{formatTime(remainingTime)} left
          </span>
        </>
      )}
    </div>
  );
}

/**
 * Calculates remaining time based on current progress and elapsed time
 */
function calculateRemainingTime(
  progress: number,
  elapsedTime: number,
  estimatedTime: number
): number {
  if (progress === 0) return estimatedTime;
  if (progress >= 100) return 0;
  
  // Calculate projected total time based on current pace
  const projectedTotalTime = (elapsedTime / progress) * 100;
  
  // Return remaining time, but don't let it be negative
  return Math.max(0, projectedTotalTime - elapsedTime);
}
