/**
 * Simple Timer Component for MVP
 * 
 * Reusable countdown timer for quizzes, questions, and learning checks
 * Uses shadcn countdown hook for reliable timing functionality
 */

"use client";

import React from "react";
import { useCountdown } from "@/hooks/use-countdown";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  /** Duration in seconds */
  duration: number;
  /** Callback when timer expires */
  onExpire?: () => void;
  /** Callback with remaining time updates */
  onTick?: (remainingTime: number) => void;
  /** Auto start timer when component mounts */
  autoStart?: boolean;
  /** Show warning when time is low */
  warningThreshold?: number;
  /** Timer label */
  label?: string;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'large';
  /** Custom className */
  className?: string;
}

export function Timer({
  duration,
  onExpire,
  onTick,
  autoStart = true,
  warningThreshold = 30,
  label,
  variant = 'default',
  className
}: TimerProps) {
  const [count, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: duration,
    intervalMs: 1000,
    countStop: 0
  });

  // Handle expiration
  React.useEffect(() => {
    if (count === 0 && onExpire) {
      onExpire();
    }
  }, [count, onExpire]);

  // Call onTick when count changes
  React.useEffect(() => {
    if (onTick) {
      onTick(count);
    }
  }, [count, onTick]);

  // Auto start if enabled
  React.useEffect(() => {
    if (autoStart) {
      startCountdown();
    }
  }, [autoStart, startCountdown]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Track if timer is running (we need to manage this ourselves since the hook doesn't provide it)
  const [isRunning, setIsRunning] = React.useState(false);

  // Determine if in warning state
  const isWarning = count <= warningThreshold && count > 0;
  const isExpired = count === 0;

  // Handle start/stop actions
  const handleStart = () => {
    startCountdown();
    setIsRunning(true);
  };

  const handleStop = () => {
    stopCountdown();
    setIsRunning(false);
  };

  const handleReset = () => {
    resetCountdown();
    setIsRunning(false);
  };

  // Stop running when timer expires
  React.useEffect(() => {
    if (count === 0) {
      setIsRunning(false);
    }
  }, [count]);

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          container: "inline-flex items-center gap-2 px-3 py-1",
          time: "text-sm font-mono",
          icon: "h-3 w-3"
        };
      case 'large':
        return {
          container: "flex flex-col items-center gap-3 p-6",
          time: "text-3xl font-mono font-bold",
          icon: "h-6 w-6"
        };
      default:
        return {
          container: "flex items-center gap-3 p-4",
          time: "text-lg font-mono font-semibold",
          icon: "h-4 w-4"
        };
    }
  };

  const styles = getVariantStyles();

  // Color scheme based on state
  const getColorScheme = () => {
    if (isExpired) {
      return {
        badge: "destructive",
        text: "text-red-600",
        icon: "text-red-600"
      };
    }
    if (isWarning) {
      return {
        badge: "secondary",
        text: "text-orange-600",
        icon: "text-orange-600"
      };
    }
    return {
      badge: "default",
      text: "text-foreground",
      icon: "text-muted-foreground"
    };
  };

  const colors = getColorScheme();

  if (variant === 'compact') {
    return (
      <Badge 
        variant={colors.badge as "default" | "secondary" | "destructive" | "outline"}
        className={cn("gap-1", className)}
      >
        {isWarning || isExpired ? (
          <AlertTriangle className={cn(styles.icon, colors.icon)} />
        ) : (
          <Clock className={cn(styles.icon, colors.icon)} />
        )}
        <span className={styles.time}>
          {formatTime(count)}
        </span>
      </Badge>
    );
  }

  return (
    <Card className={cn(styles.container, className)}>
      {isWarning || isExpired ? (
        <AlertTriangle className={cn(styles.icon, colors.icon)} />
      ) : (
        <Clock className={cn(styles.icon, colors.icon)} />
      )}
      
      <div className="flex flex-col items-center gap-1">
        {label && (
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {label}
          </span>
        )}
        <span className={cn(styles.time, colors.text)}>
          {formatTime(count)}
        </span>
      </div>
      
      {variant === 'large' && (
        <div className="flex gap-2">
          <button
            onClick={isRunning ? handleStop : handleStart}
            className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            Reset
          </button>
        </div>
      )}
    </Card>
  );
}

// Export timer controls for external use
export interface TimerControls {
  start: () => void;
  stop: () => void;
  reset: () => void;
  isActive: boolean;
  remainingTime: number;
}

/**
 * Hook to get timer controls without rendering the component
 */
export function useTimerControls(duration: number, onExpire?: () => void): TimerControls {
  const [count, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: duration,
    intervalMs: 1000,
    countStop: 0
  });

  const [isActive, setIsActive] = React.useState(false);

  // Handle expiration
  React.useEffect(() => {
    if (count === 0 && onExpire) {
      onExpire();
      setIsActive(false);
    }
  }, [count, onExpire]);

  const start = () => {
    startCountdown();
    setIsActive(true);
  };

  const stop = () => {
    stopCountdown();
    setIsActive(false);
  };

  const reset = () => {
    resetCountdown();
    setIsActive(false);
  };

  return {
    start,
    stop,
    reset,
    isActive,
    remainingTime: count
  };
}
