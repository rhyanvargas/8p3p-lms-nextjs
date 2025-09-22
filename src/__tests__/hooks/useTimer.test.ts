/**
 * Unit tests for useTimer hook
 * 
 * Tests timer functionality, state management, and edge cases
 * following Jest + React Testing Library standards.
 */

import { renderHook, act } from "@testing-library/react";
import { useTimer } from "@/hooks/useTimer";

// Mock time-related functions to control timing in tests
jest.useFakeTimers();

describe("useTimer", () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  describe("countdown timer", () => {
    it("initializes with correct default state", () => {
      const { result } = renderHook(() => 
        useTimer(60, { variant: "countdown" })
      );

      expect(result.current.time).toBe(60);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
      expect(result.current.isCompleted).toBe(false);
      expect(result.current.progress).toBe(0);
    });

    it("starts automatically when autoStart is true", () => {
      const { result } = renderHook(() => 
        useTimer(60, { variant: "countdown", autoStart: true })
      );

      expect(result.current.isRunning).toBe(true);
    });

    it("counts down correctly", () => {
      const { result } = renderHook(() => 
        useTimer(60, { variant: "countdown" })
      );

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);

      // Advance time by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.time).toBeLessThan(60);
      expect(result.current.time).toBeGreaterThan(58);
    });

    it("completes when reaching zero", () => {
      const onComplete = jest.fn();
      const { result } = renderHook(() => 
        useTimer(2, { variant: "countdown", onComplete })
      );

      act(() => {
        result.current.start();
      });

      // Advance time to completion
      act(() => {
        jest.advanceTimersByTime(2500);
      });

      expect(result.current.isCompleted).toBe(true);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.time).toBe(0);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("calculates progress correctly", () => {
      const { result } = renderHook(() => 
        useTimer(60, { variant: "countdown" })
      );

      act(() => {
        result.current.start();
      });

      // Advance time by 30 seconds (50% progress)
      act(() => {
        jest.advanceTimersByTime(30000);
      });

      expect(result.current.progress).toBeCloseTo(50, 1);
    });
  });

  describe("stopwatch timer", () => {
    it("initializes with zero time", () => {
      const { result } = renderHook(() => 
        useTimer(0, { variant: "stopwatch" })
      );

      expect(result.current.time).toBe(0);
      expect(result.current.progress).toBe(0);
    });

    it("counts up correctly", () => {
      const { result } = renderHook(() => 
        useTimer(0, { variant: "stopwatch" })
      );

      act(() => {
        result.current.start();
      });

      // Advance time by 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.time).toBeGreaterThan(4);
      expect(result.current.time).toBeLessThan(6);
    });

    it("completes when reaching target time", () => {
      const onComplete = jest.fn();
      const { result } = renderHook(() => 
        useTimer(0, { 
          variant: "stopwatch", 
          targetTime: 5,
          onComplete 
        })
      );

      act(() => {
        result.current.start();
      });

      // Advance time to target
      act(() => {
        jest.advanceTimersByTime(6000);
      });

      expect(result.current.isCompleted).toBe(true);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("calculates progress with target time", () => {
      const { result } = renderHook(() => 
        useTimer(0, { 
          variant: "stopwatch", 
          targetTime: 60 
        })
      );

      act(() => {
        result.current.start();
      });

      // Advance time by 30 seconds (50% progress)
      act(() => {
        jest.advanceTimersByTime(30000);
      });

      expect(result.current.progress).toBeCloseTo(50, 1);
    });
  });

  describe("timer controls", () => {
    it("starts timer correctly", () => {
      const onStart = jest.fn();
      const { result } = renderHook(() => 
        useTimer(60, { variant: "countdown", onStart })
      );

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);
      expect(result.current.isPaused).toBe(false);
      expect(onStart).toHaveBeenCalledTimes(1);
    });

    it("pauses timer correctly", () => {
      const onPause = jest.fn();
      const { result } = renderHook(() => 
        useTimer(60, { variant: "countdown", onPause })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        result.current.pause();
      });

      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(true);
      expect(onPause).toHaveBeenCalledTimes(1);
    });

    it("resumes timer correctly", () => {
      const onResume = jest.fn();
      const { result } = renderHook(() => 
        useTimer(60, { variant: "countdown", onResume })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        result.current.pause();
      });

      act(() => {
        result.current.resume();
      });

      expect(result.current.isRunning).toBe(true);
      expect(result.current.isPaused).toBe(false);
      expect(onResume).toHaveBeenCalledTimes(1);
    });

    it("resets timer correctly", () => {
      const onReset = jest.fn();
      const { result } = renderHook(() => 
        useTimer(60, { variant: "countdown", onReset })
      );

      act(() => {
        result.current.start();
      });

      // Advance time
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.time).toBe(60);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
      expect(result.current.isCompleted).toBe(false);
      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it("toggles timer state correctly", () => {
      const { result } = renderHook(() => 
        useTimer(60, { variant: "countdown" })
      );

      // Toggle from stopped to running
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isRunning).toBe(true);

      // Toggle from running to paused
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isPaused).toBe(true);

      // Toggle from paused to running
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isRunning).toBe(true);
      expect(result.current.isPaused).toBe(false);
    });
  });

  describe("callbacks", () => {
    it("calls onTick callback with correct state", () => {
      const onTick = jest.fn();
      const { result } = renderHook(() => 
        useTimer(60, { variant: "countdown", onTick })
      );

      act(() => {
        result.current.start();
      });

      // Advance time to trigger tick
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(onTick).toHaveBeenCalled();
      const lastCall = onTick.mock.calls[onTick.mock.calls.length - 1][0];
      expect(lastCall).toHaveProperty("time");
      expect(lastCall).toHaveProperty("isRunning", true);
      expect(lastCall).toHaveProperty("progress");
    });

    it("calls completion callback only once", () => {
      const onComplete = jest.fn();
      const { result } = renderHook(() => 
        useTimer(1, { variant: "countdown", onComplete })
      );

      act(() => {
        result.current.start();
      });

      // Advance time well past completion
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("handles zero duration", () => {
      const { result } = renderHook(() => 
        useTimer(0, { variant: "countdown" })
      );

      expect(result.current.time).toBe(0);
      expect(result.current.progress).toBe(100);
    });

    it("handles negative duration", () => {
      const { result } = renderHook(() => 
        useTimer(-10, { variant: "countdown" })
      );

      expect(result.current.time).toBe(-10);
      // Should handle gracefully without crashing
    });

    it("prevents starting completed timer", () => {
      const { result } = renderHook(() => 
        useTimer(1, { variant: "countdown" })
      );

      act(() => {
        result.current.start();
      });

      // Complete the timer
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.isCompleted).toBe(true);

      // Try to start again
      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(false);
    });

    it("handles rapid toggle operations", () => {
      const { result } = renderHook(() => 
        useTimer(60, { variant: "countdown" })
      );

      // Rapid toggles
      act(() => {
        result.current.toggle();
        result.current.toggle();
        result.current.toggle();
      });

      // Should end up running (odd number of toggles)
      expect(result.current.isRunning).toBe(true);
    });
  });

  describe("custom intervals", () => {
    it("respects custom interval setting", () => {
      const onTick = jest.fn();
      const { result } = renderHook(() => 
        useTimer(60, { 
          variant: "countdown", 
          interval: 500, // 500ms interval
          onTick 
        })
      );

      act(() => {
        result.current.start();
      });

      // Advance by 500ms
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(onTick).toHaveBeenCalled();
    });

    it("uses high frequency for milliseconds", () => {
      const { result } = renderHook(() => 
        useTimer(60, { variant: "countdown" })
      );

      // Check that getFormattedTime works
      expect(typeof result.current.getFormattedTime).toBe("function");
      expect(result.current.getFormattedTime()).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe("utility functions", () => {
    it("provides formatted time", () => {
      const { result } = renderHook(() => 
        useTimer(90, { variant: "countdown" })
      );

      expect(result.current.getFormattedTime()).toBe("01:30");
      expect(result.current.getFormattedTime(true)).toBe("0:01:30");
    });

    it("provides time with label", () => {
      const { result } = renderHook(() => 
        useTimer(90, { variant: "countdown" })
      );

      const labeled = result.current.getTimeWithLabel("remaining");
      expect(labeled).toContain("remaining");
      expect(labeled).toContain("minute");
    });

    it("provides color theme", () => {
      const { result } = renderHook(() => 
        useTimer(60, { variant: "countdown" })
      );

      const theme = result.current.getColorTheme();
      expect(["default", "success", "warning", "danger"]).toContain(theme);
    });
  });
});
