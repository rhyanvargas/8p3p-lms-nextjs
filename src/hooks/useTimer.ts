"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { formatTime, formatTimeWithLabel, getTimerColorTheme } from "@/lib/utils/time-formatting";

/**
 * Timer state interface for comprehensive timer management
 * 
 * @interface TimerState
 * @description Provides complete timer state information for UI components
 */
export interface TimerState {
  /** Current time value (remaining for countdown, elapsed for stopwatch) */
  time: number;
  /** Whether the timer is currently running */
  isRunning: boolean;
  /** Whether the timer has completed (reached 0 for countdown, target for stopwatch) */
  isCompleted: boolean;
  /** Whether the timer is paused */
  isPaused: boolean;
  /** Progress percentage (0-100) for visual indicators */
  progress: number;
}

/**
 * Timer configuration options
 * 
 * @interface TimerOptions
 * @description Configures timer behavior and callbacks
 */
export interface TimerOptions {
  /** Timer variant behavior */
  variant?: "countdown" | "stopwatch" | "progress";
  /** Auto-start timer on mount */
  autoStart?: boolean;
  /** Callback fired when timer completes */
  onComplete?: () => void;
  /** Callback fired every tick with current state */
  onTick?: (state: TimerState) => void;
  /** Callback fired when timer starts */
  onStart?: () => void;
  /** Callback fired when timer pauses */
  onPause?: () => void;
  /** Callback fired when timer resumes */
  onResume?: () => void;
  /** Callback fired when timer resets */
  onReset?: () => void;
  /** Target time for stopwatch variant (when to trigger completion) */
  targetTime?: number;
  /** Update interval in milliseconds (default: 1000) */
  interval?: number;
}

/**
 * Custom hook for timer functionality with comprehensive state management
 * 
 * Provides reusable timer logic with pause/resume, tab visibility handling,
 * and support for countdown, stopwatch, and progress timer variants.
 * 
 * @param initialDuration - Initial timer duration in seconds
 * @param options - Timer configuration options
 * @returns Timer state and control functions
 * 
 * @example
 * // Countdown timer for quiz
 * const timer = useTimer(300, {
 *   variant: "countdown",
 *   autoStart: true,
 *   onComplete: () => submitQuiz(),
 *   onTick: (state) => updateUI(state)
 * });
 * 
 * @example
 * // Stopwatch for content tracking
 * const timer = useTimer(0, {
 *   variant: "stopwatch",
 *   targetTime: 1800, // 30 minutes
 *   onComplete: () => showCompletionBadge()
 * });
 */
export function useTimer(
  initialDuration: number,
  options: TimerOptions = {}
) {
  const {
    variant = "countdown",
    autoStart = false,
    onComplete,
    onTick,
    onStart,
    onPause,
    onResume,
    onReset,
    targetTime,
    interval = 1000,
  } = options;

  // Timer state management
  const [time, setTime] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Refs for stable references and cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const lastTickRef = useRef<number>(Date.now());

  /**
   * Calculates progress percentage based on timer variant
   * 
   * For countdown: progress increases as time decreases
   * For stopwatch: progress increases as time increases (if targetTime set)
   * For progress: same as countdown but with visual progress bar emphasis
   */
  const calculateProgress = useCallback((): number => {
    switch (variant) {
      case "countdown":
      case "progress":
        if (initialDuration <= 0) return 100;
        return Math.max(0, Math.min(100, ((initialDuration - time) / initialDuration) * 100));
      
      case "stopwatch":
        if (!targetTime || targetTime <= 0) return 0;
        return Math.max(0, Math.min(100, (time / targetTime) * 100));
      
      default:
        return 0;
    }
  }, [variant, time, initialDuration, targetTime]);

  /**
   * Checks if timer should complete based on variant
   */
  const shouldComplete = useCallback((): boolean => {
    switch (variant) {
      case "countdown":
      case "progress":
        return time <= 0;
      
      case "stopwatch":
        return targetTime ? time >= targetTime : false;
      
      default:
        return false;
    }
  }, [variant, time, targetTime]);

  /**
   * Timer tick function with accurate time calculation
   * 
   * Uses high-resolution timestamps to maintain accuracy even
   * when tab is backgrounded or system is under load.
   */
  const tick = useCallback(() => {
    const now = Date.now();
    const deltaMs = now - lastTickRef.current;
    const deltaSeconds = deltaMs / 1000;
    
    lastTickRef.current = now;

    setTime(prevTime => {
      let newTime: number;
      
      switch (variant) {
        case "countdown":
        case "progress":
          newTime = Math.max(0, prevTime - deltaSeconds);
          break;
        
        case "stopwatch":
          newTime = prevTime + deltaSeconds;
          break;
        
        default:
          newTime = prevTime;
      }

      // Create current state for callbacks
      const currentState: TimerState = {
        time: newTime,
        isRunning: true,
        isCompleted: false,
        isPaused: false,
        progress: variant === "countdown" || variant === "progress" 
          ? Math.max(0, Math.min(100, ((initialDuration - newTime) / initialDuration) * 100))
          : targetTime ? Math.max(0, Math.min(100, (newTime / targetTime) * 100)) : 0,
      };

      // Fire tick callback
      onTick?.(currentState);

      return newTime;
    });
  }, [variant, initialDuration, targetTime, onTick]);

  /**
   * Starts the timer with proper initialization
   */
  const start = useCallback(() => {
    if (isCompleted) return;

    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    lastTickRef.current = Date.now();
    onStart?.();
  }, [isCompleted, onStart]);

  /**
   * Pauses the timer and tracks paused duration
   */
  const pause = useCallback(() => {
    if (!isRunning || isPaused) return;

    setIsRunning(false);
    setIsPaused(true);
    pausedTimeRef.current = Date.now();
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    onPause?.();
  }, [isRunning, isPaused, onPause]);

  /**
   * Resumes the timer with time adjustment for paused duration
   */
  const resume = useCallback(() => {
    if (!isPaused) return;

    setIsRunning(true);
    setIsPaused(false);
    
    // Adjust for time spent paused
    const _pausedDuration = Date.now() - pausedTimeRef.current;
    lastTickRef.current = Date.now();
    
    onResume?.();
  }, [isPaused, onResume]);

  /**
   * Resets timer to initial state
   */
  const reset = useCallback(() => {
    setTime(initialDuration);
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    lastTickRef.current = Date.now();
    
    onReset?.();
  }, [initialDuration, onReset]);

  /**
   * Toggles timer between running and paused states
   */
  const toggle = useCallback(() => {
    if (isCompleted) return;
    
    if (isRunning && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      start();
    }
  }, [isRunning, isPaused, isCompleted, start, pause, resume]);

  // Timer interval management
  useEffect(() => {
    if (isRunning && !isPaused && !isCompleted) {
      intervalRef.current = setInterval(tick, interval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, isCompleted, tick, interval]);

  // Completion detection and handling
  useEffect(() => {
    if (shouldComplete() && !isCompleted) {
      setIsCompleted(true);
      setIsRunning(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      onComplete?.();
    }
  }, [shouldComplete, isCompleted, onComplete]);

  // Tab visibility handling to maintain accuracy
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning && !isPaused) {
        // Tab became hidden - record the time
        pausedTimeRef.current = Date.now();
      } else if (!document.hidden && isRunning && !isPaused) {
        // Tab became visible - adjust for time difference
        const _timeDiff = Date.now() - pausedTimeRef.current;
        lastTickRef.current = Date.now();
        
        // Force a tick to catch up on missed time
        if (_timeDiff > interval) {
          tick();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isRunning, isPaused, interval, tick]);

  // Auto-start handling
  useEffect(() => {
    if (autoStart && !isRunning && !isCompleted) {
      start();
    }
  }, [autoStart, isRunning, isCompleted, start]);

  // Current timer state
  const timerState: TimerState = {
    time,
    isRunning,
    isCompleted,
    isPaused,
    progress: calculateProgress(),
  };

  return {
    // State
    ...timerState,
    
    // Control functions
    start,
    pause,
    resume,
    reset,
    toggle,
    
    // Utility functions
    getFormattedTime: (showHours = false, showMilliseconds = false) => {
      return formatTime(time, showHours, showMilliseconds);
    },
    
    getTimeWithLabel: (context: "remaining" | "elapsed" | "limit" | "estimated" = "remaining") => {
      return formatTimeWithLabel(time, context);
    },
    
    getColorTheme: () => {
      return variant === "countdown" || variant === "progress"
        ? getTimerColorTheme(time, initialDuration)
        : "default";
    },
  };
}
