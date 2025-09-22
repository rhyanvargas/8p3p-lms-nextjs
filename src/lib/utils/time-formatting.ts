/**
 * Time formatting utilities for timer components
 * 
 * Provides consistent time display formatting across the application
 * with proper edge case handling and internationalization support.
 */

/**
 * Formats seconds into human-readable time string
 * 
 * Uses industry-standard time formatting (MM:SS or HH:MM:SS) with
 * proper zero-padding and edge case handling for negative values.
 * 
 * @param seconds - Time in seconds (can be negative for countdown scenarios)
 * @param showHours - Whether to show hours even when less than 1 hour
 * @param showMilliseconds - Whether to include milliseconds in display
 * @returns Formatted time string (e.g., "05:30", "1:05:30", "00:00")
 * 
 * @example
 * formatTime(90) // Returns: "01:30"
 * formatTime(3661, true) // Returns: "1:01:01"
 * formatTime(-10) // Returns: "00:00" (handles negative gracefully)
 */
export function formatTime(
  seconds: number,
  showHours = false,
  showMilliseconds = false
): string {
  // Handle edge cases: negative time, NaN, infinity
  if (!isFinite(seconds) || seconds < 0) {
    return showHours ? "0:00:00" : "00:00";
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  const milliseconds = Math.floor((seconds - totalSeconds) * 1000);

  // Format with proper zero-padding
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
  const formattedMilliseconds = milliseconds.toString().padStart(3, "0");

  // Return appropriate format based on requirements
  if (showHours || hours > 0) {
    const formattedHours = hours.toString();
    const baseTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    return showMilliseconds ? `${baseTime}.${formattedMilliseconds}` : baseTime;
  }

  const baseTime = `${formattedMinutes}:${formattedSeconds}`;
  return showMilliseconds ? `${baseTime}.${formattedMilliseconds}` : baseTime;
}

/**
 * Formats time with contextual labels for better UX
 * 
 * Provides user-friendly time descriptions with proper pluralization
 * and context-aware formatting for different timer scenarios.
 * 
 * @param seconds - Time in seconds
 * @param context - Context for appropriate labeling
 * @returns Human-readable time description
 * 
 * @example
 * formatTimeWithLabel(90, "remaining") // Returns: "1 minute 30 seconds remaining"
 * formatTimeWithLabel(3661, "elapsed") // Returns: "1 hour 1 minute elapsed"
 * formatTimeWithLabel(30, "limit") // Returns: "30 seconds limit"
 */
export function formatTimeWithLabel(
  seconds: number,
  context: "remaining" | "elapsed" | "limit" | "estimated" = "remaining"
): string {
  // Handle edge cases
  if (!isFinite(seconds) || seconds < 0) {
    return `0 seconds ${context}`;
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const parts: string[] = [];

  // Build time parts with proper pluralization
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  }
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds} ${remainingSeconds === 1 ? "second" : "seconds"}`);
  }

  // Join parts and add context
  const timeString = parts.slice(0, 2).join(" "); // Limit to 2 most significant units
  return `${timeString} ${context}`;
}

/**
 * Calculates time progress as percentage
 * 
 * Used for progress bars and visual indicators in timer components.
 * Handles edge cases and ensures valid percentage range (0-100).
 * 
 * @param elapsed - Time elapsed in seconds
 * @param total - Total time duration in seconds
 * @returns Progress percentage (0-100)
 * 
 * @example
 * calculateProgress(30, 60) // Returns: 50
 * calculateProgress(90, 60) // Returns: 100 (clamped)
 * calculateProgress(-10, 60) // Returns: 0 (handles negative)
 */
export function calculateProgress(elapsed: number, total: number): number {
  // Handle edge cases: invalid inputs, division by zero
  if (!isFinite(elapsed) || !isFinite(total) || total <= 0) {
    return 0;
  }

  // Calculate percentage and clamp to valid range
  const percentage = (elapsed / total) * 100;
  return Math.max(0, Math.min(100, percentage));
}

/**
 * Determines appropriate color theme based on time remaining
 * 
 * Provides visual urgency indicators for countdown timers with
 * configurable thresholds for different timer contexts.
 * 
 * @param remaining - Time remaining in seconds
 * @param total - Total time duration in seconds
 * @param thresholds - Custom thresholds for color changes
 * @returns Color theme identifier
 * 
 * @example
 * getTimerColorTheme(10, 60) // Returns: "danger" (< 25% remaining)
 * getTimerColorTheme(30, 60) // Returns: "warning" (25-50% remaining)
 * getTimerColorTheme(45, 60) // Returns: "success" (> 50% remaining)
 */
export function getTimerColorTheme(
  remaining: number,
  total: number,
  thresholds = { danger: 0.25, warning: 0.5 }
): "success" | "warning" | "danger" | "default" {
  // Handle edge cases
  if (!isFinite(remaining) || !isFinite(total) || total <= 0) {
    return "default";
  }

  const percentage = remaining / total;

  // Determine color based on remaining time percentage
  if (percentage <= thresholds.danger) {
    return "danger";
  } else if (percentage <= thresholds.warning) {
    return "warning";
  } else {
    return "success";
  }
}

/**
 * Validates timer duration input
 * 
 * Ensures timer durations are valid and within reasonable limits
 * for different timer contexts (quiz, AI interaction, etc.).
 * 
 * @param duration - Duration in seconds to validate
 * @param context - Timer context for appropriate limits
 * @returns Validation result with sanitized duration
 * 
 * @example
 * validateTimerDuration(300, "quiz") // Returns: { isValid: true, duration: 300 }
 * validateTimerDuration(-10, "quiz") // Returns: { isValid: false, duration: 60, error: "..." }
 * validateTimerDuration(7200, "ai") // Returns: { isValid: false, duration: 300, error: "..." }
 */
export function validateTimerDuration(
  duration: number,
  context: "quiz" | "ai" | "learning" | "general" = "general"
): {
  isValid: boolean;
  duration: number;
  error?: string;
} {
  // Define context-specific limits (in seconds)
  const limits = {
    quiz: { min: 30, max: 3600 }, // 30 seconds to 1 hour
    ai: { min: 60, max: 300 }, // 1 minute to 5 minutes
    learning: { min: 60, max: 1800 }, // 1 minute to 30 minutes
    general: { min: 1, max: 7200 }, // 1 second to 2 hours
  };

  const { min, max } = limits[context];

  // Validate input
  if (!isFinite(duration)) {
    return {
      isValid: false,
      duration: min,
      error: "Duration must be a valid number",
    };
  }

  if (duration < min) {
    return {
      isValid: false,
      duration: min,
      error: `Duration must be at least ${min} seconds for ${context} timers`,
    };
  }

  if (duration > max) {
    return {
      isValid: false,
      duration: max,
      error: `Duration cannot exceed ${max} seconds for ${context} timers`,
    };
  }

  return {
    isValid: true,
    duration: Math.floor(duration), // Ensure integer seconds
  };
}
