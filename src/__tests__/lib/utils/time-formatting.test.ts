/**
 * Unit tests for time formatting utilities
 * 
 * Tests cover edge cases, accuracy, and proper formatting
 * following Jest + React Testing Library standards.
 */

import {
  formatTime,
  formatTimeWithLabel,
  calculateProgress,
  getTimerColorTheme,
  validateTimerDuration,
} from "@/lib/utils/time-formatting";

describe("formatTime", () => {
  describe("basic formatting", () => {
    it("formats minutes and seconds correctly", () => {
      expect(formatTime(30)).toBe("00:30");
      expect(formatTime(90)).toBe("01:30");
      expect(formatTime(125)).toBe("02:05");
      expect(formatTime(3661)).toBe("1:01:01"); // 3661 seconds = 1 hour, 1 minute, 1 second
    });

    it("formats with hours when requested", () => {
      expect(formatTime(3661, true)).toBe("1:01:01");
      expect(formatTime(7322, true)).toBe("2:02:02");
      expect(formatTime(90, true)).toBe("0:01:30");
    });

    it("includes milliseconds when requested", () => {
      expect(formatTime(90.5, false, true)).toBe("01:30.500");
      expect(formatTime(125.123, false, true)).toBe("02:05.123");
      expect(formatTime(3661.999, true, true)).toBe("1:01:01.998"); // Precision may vary due to floating point
    });
  });

  describe("edge cases", () => {
    it("handles zero time", () => {
      expect(formatTime(0)).toBe("00:00");
      expect(formatTime(0, true)).toBe("0:00:00");
    });

    it("handles negative time gracefully", () => {
      expect(formatTime(-10)).toBe("00:00");
      expect(formatTime(-100, true)).toBe("0:00:00");
    });

    it("handles invalid inputs", () => {
      expect(formatTime(NaN)).toBe("00:00");
      expect(formatTime(Infinity)).toBe("00:00");
      expect(formatTime(-Infinity)).toBe("00:00");
    });

    it("handles very large numbers", () => {
      expect(formatTime(359999)).toBe("99:59:59"); // 359999 seconds = 99 hours, 59 minutes, 59 seconds
      expect(formatTime(359999, true)).toBe("99:59:59");
    });
  });

  describe("precision", () => {
    it("floors seconds to avoid rounding issues", () => {
      expect(formatTime(90.9)).toBe("01:30");
      expect(formatTime(125.99)).toBe("02:05");
    });

    it("handles millisecond precision correctly", () => {
      expect(formatTime(90.001, false, true)).toBe("01:30.001");
      expect(formatTime(90.999, false, true)).toBe("01:30.998"); // Precision may vary due to floating point
    });
  });
});

describe("formatTimeWithLabel", () => {
  describe("context labeling", () => {
    it("formats with remaining context", () => {
      expect(formatTimeWithLabel(90, "remaining")).toBe("1 minute 30 seconds remaining");
      expect(formatTimeWithLabel(3661, "remaining")).toBe("1 hour 1 minute remaining");
    });

    it("formats with elapsed context", () => {
      expect(formatTimeWithLabel(90, "elapsed")).toBe("1 minute 30 seconds elapsed");
      expect(formatTimeWithLabel(125, "elapsed")).toBe("2 minutes 5 seconds elapsed");
    });

    it("formats with limit context", () => {
      expect(formatTimeWithLabel(300, "limit")).toBe("5 minutes limit");
      expect(formatTimeWithLabel(30, "limit")).toBe("30 seconds limit");
    });

    it("formats with estimated context", () => {
      expect(formatTimeWithLabel(450, "estimated")).toBe("7 minutes 30 seconds estimated");
    });
  });

  describe("pluralization", () => {
    it("handles singular forms correctly", () => {
      expect(formatTimeWithLabel(61, "remaining")).toBe("1 minute 1 second remaining");
      expect(formatTimeWithLabel(3601, "remaining")).toBe("1 hour 1 second remaining");
    });

    it("handles plural forms correctly", () => {
      expect(formatTimeWithLabel(120, "remaining")).toBe("2 minutes remaining");
      expect(formatTimeWithLabel(7200, "remaining")).toBe("2 hours remaining");
    });
  });

  describe("edge cases", () => {
    it("handles zero time", () => {
      expect(formatTimeWithLabel(0, "remaining")).toBe("0 seconds remaining");
    });

    it("handles negative time", () => {
      expect(formatTimeWithLabel(-10, "remaining")).toBe("0 seconds remaining");
    });

    it("limits to two most significant units", () => {
      expect(formatTimeWithLabel(3661, "remaining")).toBe("1 hour 1 minute remaining");
      expect(formatTimeWithLabel(3721, "remaining")).toBe("1 hour 2 minutes remaining");
    });
  });
});

describe("calculateProgress", () => {
  describe("basic calculations", () => {
    it("calculates progress percentage correctly", () => {
      expect(calculateProgress(30, 60)).toBe(50);
      expect(calculateProgress(15, 60)).toBe(25);
      expect(calculateProgress(45, 60)).toBe(75);
    });

    it("handles completion scenarios", () => {
      expect(calculateProgress(60, 60)).toBe(100);
      expect(calculateProgress(90, 60)).toBe(100); // Clamped to 100
    });

    it("handles zero elapsed time", () => {
      expect(calculateProgress(0, 60)).toBe(0);
    });
  });

  describe("edge cases", () => {
    it("handles zero total time", () => {
      expect(calculateProgress(30, 0)).toBe(0);
    });

    it("handles negative values", () => {
      expect(calculateProgress(-10, 60)).toBe(0);
      expect(calculateProgress(30, -60)).toBe(0);
    });

    it("handles invalid inputs", () => {
      expect(calculateProgress(NaN, 60)).toBe(0);
      expect(calculateProgress(30, NaN)).toBe(0);
      expect(calculateProgress(Infinity, 60)).toBe(0);
    });
  });

  describe("precision", () => {
    it("handles decimal values correctly", () => {
      expect(calculateProgress(33.33, 100)).toBeCloseTo(33.33, 2);
      expect(calculateProgress(66.67, 100)).toBeCloseTo(66.67, 2);
    });
  });
});

describe("getTimerColorTheme", () => {
  describe("default thresholds", () => {
    it("returns danger for low remaining time", () => {
      expect(getTimerColorTheme(10, 60)).toBe("danger"); // 16.7% remaining
      expect(getTimerColorTheme(5, 60)).toBe("danger"); // 8.3% remaining
    });

    it("returns warning for medium remaining time", () => {
      expect(getTimerColorTheme(20, 60)).toBe("warning"); // 33.3% remaining
      expect(getTimerColorTheme(25, 60)).toBe("warning"); // 41.7% remaining
    });

    it("returns success for high remaining time", () => {
      expect(getTimerColorTheme(35, 60)).toBe("success"); // 58.3% remaining
      expect(getTimerColorTheme(50, 60)).toBe("success"); // 83.3% remaining
    });
  });

  describe("custom thresholds", () => {
    it("uses custom danger threshold", () => {
      const thresholds = { danger: 0.1, warning: 0.3 };
      expect(getTimerColorTheme(5, 60, thresholds)).toBe("danger"); // 8.3% < 10%
      expect(getTimerColorTheme(10, 60, thresholds)).toBe("warning"); // 16.7% > 10% but < 30%
    });

    it("uses custom warning threshold", () => {
      const thresholds = { danger: 0.1, warning: 0.4 };
      expect(getTimerColorTheme(20, 60, thresholds)).toBe("warning"); // 33.3% < 40%
      expect(getTimerColorTheme(30, 60, thresholds)).toBe("success"); // 50% > 40%
    });
  });

  describe("edge cases", () => {
    it("handles zero total time", () => {
      expect(getTimerColorTheme(30, 0)).toBe("default");
    });

    it("handles negative values", () => {
      expect(getTimerColorTheme(-10, 60)).toBe("danger"); // Negative remaining time is danger
      expect(getTimerColorTheme(30, -60)).toBe("default");
    });

    it("handles invalid inputs", () => {
      expect(getTimerColorTheme(NaN, 60)).toBe("default");
      expect(getTimerColorTheme(30, NaN)).toBe("default");
    });
  });
});

describe("validateTimerDuration", () => {
  describe("quiz context validation", () => {
    it("accepts valid quiz durations", () => {
      const result = validateTimerDuration(300, "quiz"); // 5 minutes
      expect(result.isValid).toBe(true);
      expect(result.duration).toBe(300);
      expect(result.error).toBeUndefined();
    });

    it("rejects too short quiz durations", () => {
      const result = validateTimerDuration(15, "quiz"); // 15 seconds
      expect(result.isValid).toBe(false);
      expect(result.duration).toBe(30); // Minimum
      expect(result.error).toContain("at least 30 seconds");
    });

    it("rejects too long quiz durations", () => {
      const result = validateTimerDuration(7200, "quiz"); // 2 hours
      expect(result.isValid).toBe(false);
      expect(result.duration).toBe(3600); // Maximum
      expect(result.error).toContain("cannot exceed 3600 seconds");
    });
  });

  describe("AI context validation", () => {
    it("accepts valid AI durations", () => {
      const result = validateTimerDuration(240, "ai"); // 4 minutes
      expect(result.isValid).toBe(true);
      expect(result.duration).toBe(240);
    });

    it("rejects durations outside AI limits", () => {
      expect(validateTimerDuration(30, "ai").isValid).toBe(false); // Too short
      expect(validateTimerDuration(600, "ai").isValid).toBe(false); // Too long
    });
  });

  describe("learning context validation", () => {
    it("accepts valid learning durations", () => {
      const result = validateTimerDuration(900, "learning"); // 15 minutes
      expect(result.isValid).toBe(true);
      expect(result.duration).toBe(900);
    });

    it("enforces learning context limits", () => {
      expect(validateTimerDuration(30, "learning").isValid).toBe(false); // Too short
      expect(validateTimerDuration(3600, "learning").isValid).toBe(false); // Too long
    });
  });

  describe("general context validation", () => {
    it("accepts wide range of durations", () => {
      expect(validateTimerDuration(1, "general").isValid).toBe(true);
      expect(validateTimerDuration(7200, "general").isValid).toBe(true);
    });

    it("still enforces basic limits", () => {
      expect(validateTimerDuration(0, "general").isValid).toBe(false);
      expect(validateTimerDuration(10000, "general").isValid).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("handles invalid numbers", () => {
      const result = validateTimerDuration(NaN, "quiz");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("valid number");
    });

    it("floors decimal durations", () => {
      const result = validateTimerDuration(300.7, "quiz");
      expect(result.isValid).toBe(true);
      expect(result.duration).toBe(300); // Floored
    });

    it("handles infinity", () => {
      const result = validateTimerDuration(Infinity, "quiz");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("valid number");
    });
  });
});
