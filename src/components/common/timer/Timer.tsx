"use client";

import { useTimer, type TimerState } from "@/hooks/useTimer";
import { TimerDisplay, TimerProgressDisplay } from "./TimerDisplay";
import { cn } from "@/lib/utils";
import { validateTimerDuration } from "@/lib/utils/time-formatting";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Square } from "lucide-react";

/**
 * Timer component props interface following development standards
 * 
 * @interface TimerProps
 * @description Defines props for reusable timer component with multiple variants
 */
export interface TimerProps {
  /** Timer duration in seconds */
  duration: number;
  /** Callback fired when timer completes */
  onComplete?: () => void;
  /** Callback fired every second with remaining/elapsed time */
  onTick?: (state: TimerState) => void;
  /** Callback fired when timer starts */
  onStart?: () => void;
  /** Callback fired when timer pauses */
  onPause?: () => void;
  /** Callback fired when timer resumes */
  onResume?: () => void;
  /** Callback fired when timer resets */
  onReset?: () => void;
  /** Whether to start timer immediately on mount */
  autoStart?: boolean;
  /** Whether to show milliseconds in display */
  showMilliseconds?: boolean;
  /** Timer behavior and visual variant */
  variant?: "countdown" | "stopwatch" | "progress";
  /** Visual size variant */
  size?: "sm" | "md" | "lg";
  /** Color theme for urgency indication */
  color?: "default" | "warning" | "danger" | "success";
  /** Whether to show control buttons */
  showControls?: boolean;
  /** Whether to show progress bar (for progress variant) */
  showProgress?: boolean;
  /** Whether to show contextual labels */
  showLabels?: boolean;
  /** Timer context for validation and theming */
  context?: "quiz" | "ai" | "learning" | "general";
  /** Accessibility label for screen readers */
  "aria-label"?: string;
  /** Additional CSS classes for styling */
  className?: string;
  /** Whether timer is disabled */
  disabled?: boolean;
  /** Target time for stopwatch variant completion */
  targetTime?: number;
}

/**
 * Main Timer Component (Client Component)
 * 
 * A comprehensive timer component that supports countdown, stopwatch, and progress
 * timer variants with full interactivity, accessibility, and proper state management.
 * 
 * Features:
 * - Multiple timer variants (countdown, stopwatch, progress)
 * - Play/pause/reset controls with keyboard support
 * - Automatic color theming based on remaining time
 * - Tab visibility handling for accurate timing
 * - Comprehensive accessibility support
 * - Input validation with context-aware limits
 * - Progress visualization for progress variant
 * 
 * @param props - Timer configuration and callbacks
 * @returns Interactive timer component
 * 
 * @example
 * // Quiz countdown timer
 * <Timer
 *   duration={300}
 *   variant="countdown"
 *   context="quiz"
 *   autoStart
 *   showControls
 *   onComplete={handleQuizSubmit}
 *   onTick={updateQuizState}
 * />
 * 
 * @example
 * // AI interaction timer
 * <Timer
 *   duration={240}
 *   variant="countdown"
 *   context="ai"
 *   color="warning"
 *   showLabels
 *   onComplete={handleAITimeout}
 * />
 * 
 * @example
 * // Content progress timer
 * <Timer
 *   duration={0}
 *   variant="stopwatch"
 *   targetTime={1800}
 *   showProgress
 *   context="learning"
 *   onComplete={showCompletionBadge}
 * />
 */
export function Timer({
  duration,
  onComplete,
  onTick,
  onStart,
  onPause,
  onResume,
  onReset,
  autoStart = false,
  showMilliseconds = false,
  variant = "countdown",
  size = "md",
  color,
  showControls = false,
  showProgress = false,
  showLabels = true,
  context = "general",
  "aria-label": ariaLabel,
  className,
  disabled = false,
  targetTime,
}: TimerProps) {
  // Validate timer duration based on context
  const validation = validateTimerDuration(duration, context);
  const validatedDuration = validation.isValid ? validation.duration : duration;
  
  // Log validation warnings in development
  if (!validation.isValid && process.env.NODE_ENV === "development") {
    console.warn(`Timer validation warning: ${validation.error}`);
  }

  // Initialize timer with validated duration and options
  const timer = useTimer(validatedDuration, {
    variant,
    autoStart: autoStart && !disabled,
    onComplete,
    onTick,
    onStart,
    onPause,
    onResume,
    onReset,
    targetTime,
    interval: showMilliseconds ? 100 : 1000, // Higher frequency for milliseconds
  });

  // Determine color theme automatically if not specified
  const effectiveColor = color || timer.getColorTheme();
  
  // Generate accessible description
  const timerDescription = ariaLabel || 
    `${variant} timer for ${context} with ${timer.getTimeWithLabel()}`;

  // Handle keyboard controls
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (event.key) {
      case " ": // Spacebar to toggle
      case "Enter":
        event.preventDefault();
        timer.toggle();
        break;
      case "r":
      case "R":
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          timer.reset();
        }
        break;
      case "Escape":
        event.preventDefault();
        timer.pause();
        break;
    }
  };

  // Control button configurations
  const controlButtons = [
    {
      icon: timer.isRunning && !timer.isPaused ? Pause : Play,
      label: timer.isRunning && !timer.isPaused ? "Pause" : "Start",
      onClick: timer.toggle,
      disabled: timer.isCompleted,
    },
    {
      icon: RotateCcw,
      label: "Reset",
      onClick: timer.reset,
      disabled: false,
    },
    {
      icon: Square,
      label: "Stop",
      onClick: timer.pause,
      disabled: !timer.isRunning || timer.isPaused,
    },
  ];

  return (
    <div
      className={cn(
        "timer-component",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        "rounded-lg p-4",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      role="group"
      aria-label={timerDescription}
      aria-live="polite"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
    >
      {/* Timer Display */}
      <div className="timer-display-container">
        {variant === "progress" && showProgress ? (
          <TimerProgressDisplay
            time={timer.time}
            progress={timer.progress}
            size={size}
            color={effectiveColor}
            showLabel={showLabels}
            labelContext="remaining"
            aria-label="" // Prevent duplicate announcements
          />
        ) : (
          <TimerDisplay
            time={timer.time}
            size={size}
            color={effectiveColor}
            showMilliseconds={showMilliseconds}
            showLabel={showLabels}
            labelContext={variant === "stopwatch" ? "elapsed" : "remaining"}
            aria-label="" // Prevent duplicate announcements
          />
        )}
      </div>

      {/* Control Buttons */}
      {showControls && (
        <div className="timer-controls mt-4 flex justify-center gap-2">
          {controlButtons.map(({ icon: Icon, label, onClick, disabled: buttonDisabled }) => (
            <Button
              key={label}
              variant="outline"
              size="sm"
              onClick={onClick}
              disabled={disabled || buttonDisabled}
              aria-label={`${label} timer`}
              className="timer-control-button"
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{label}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Timer Status for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {timer.isCompleted && "Timer completed"}
        {timer.isPaused && "Timer paused"}
        {timer.isRunning && !timer.isPaused && `Timer running: ${timer.getTimeWithLabel()}`}
      </div>

      {/* Validation Error Display (Development Only) */}
      {!validation.isValid && process.env.NODE_ENV === "development" && (
        <div className="timer-validation-warning mt-2 text-xs text-yellow-600 dark:text-yellow-400">
          ⚠️ {validation.error}
        </div>
      )}
    </div>
  );
}

/**
 * Compact Timer Component
 * 
 * A minimal timer component for use in constrained spaces like
 * navigation bars, cards, or inline contexts. Provides essential
 * timer functionality without controls.
 * 
 * @param props - Subset of TimerProps for compact display
 * @returns Compact timer component
 * 
 * @example
 * // Compact quiz timer in header
 * <CompactTimer
 *   duration={180}
 *   variant="countdown"
 *   autoStart
 *   onComplete={submitQuiz}
 * />
 */
export function CompactTimer({
  duration,
  onComplete,
  onTick,
  variant = "countdown",
  color,
  context = "general",
  autoStart = false,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: Pick<TimerProps, 
  | "duration" 
  | "onComplete" 
  | "onTick" 
  | "variant" 
  | "color" 
  | "context" 
  | "autoStart" 
  | "disabled" 
  | "className" 
  | "aria-label"
>) {
  // Validate duration
  const validation = validateTimerDuration(duration, context);
  const validatedDuration = validation.isValid ? validation.duration : duration;

  // Initialize compact timer
  const timer = useTimer(validatedDuration, {
    variant,
    autoStart: autoStart && !disabled,
    onComplete,
    onTick,
  });

  const effectiveColor = color || timer.getColorTheme();
  const timerLabel = ariaLabel || `Compact ${variant} timer: ${timer.getTimeWithLabel()}`;

  return (
    <div
      className={cn(
        "compact-timer inline-flex items-center",
        disabled && "opacity-50",
        className
      )}
      role="timer"
      aria-label={timerLabel}
      aria-live="polite"
    >
      <TimerDisplay
        time={timer.time}
        size="sm"
        color={effectiveColor}
        showLabel={false}
        monospace
        aria-label="" // Use container's aria-label
      />
    </div>
  );
}

/**
 * Timer Hook Export
 * 
 * Re-export the useTimer hook for direct use in other components
 * when custom timer UI is needed.
 */
export { useTimer } from "@/hooks/useTimer";
export type { TimerState } from "@/hooks/useTimer";
