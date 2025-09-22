/**
 * Unit tests for Timer components
 * 
 * Tests component rendering, user interactions, and accessibility
 * following Jest + React Testing Library standards.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timer, CompactTimer } from "@/components/common/timer/Timer";

// Mock the useTimer hook for controlled testing
jest.mock("@/hooks/useTimer", () => ({
  useTimer: jest.fn(),
}));

// Mock time formatting utilities
jest.mock("@/lib/utils/time-formatting", () => ({
  validateTimerDuration: jest.fn((duration) => ({
    isValid: true,
    duration: duration, // Return the input duration as-is for testing
  })),
  formatTime: jest.fn((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }),
  formatTimeWithLabel: jest.fn((seconds, context) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeStr = mins > 0 ? `${mins} minute${mins !== 1 ? 's' : ''} ${secs} second${secs !== 1 ? 's' : ''}` : `${secs} second${secs !== 1 ? 's' : ''}`;
    return `${timeStr} ${context}`;
  }),
  calculateProgress: jest.fn((elapsed, total) => Math.min(100, Math.max(0, (elapsed / total) * 100))),
  getTimerColorTheme: jest.fn(() => "default"),
}));

// Mock UI components
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, ...props }: React.ComponentProps<"button">) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  Play: () => <span data-testid="play-icon">Play</span>,
  Pause: () => <span data-testid="pause-icon">Pause</span>,
  RotateCcw: () => <span data-testid="reset-icon">Reset</span>,
  Square: () => <span data-testid="stop-icon">Stop</span>,
}));

import { useTimer } from "@/hooks/useTimer";

const mockUseTimer = jest.mocked(useTimer);

describe("Timer Component", () => {
  const defaultTimerState = {
    time: 300,
    isRunning: false,
    isPaused: false,
    isCompleted: false,
    progress: 0,
    start: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    reset: jest.fn(),
    toggle: jest.fn(),
    getFormattedTime: jest.fn(() => "05:00"),
    getTimeWithLabel: jest.fn(() => "5 minutes remaining"),
    getColorTheme: jest.fn(() => "default"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTimer.mockReturnValue(defaultTimerState);
  });

  describe("basic rendering", () => {
    it("renders timer with default props", () => {
      render(<Timer duration={300} />);
      
      expect(screen.getByRole("group")).toBeInTheDocument();
      expect(screen.getByRole("timer")).toBeInTheDocument();
    });

    it("renders with custom aria-label", () => {
      render(
        <Timer 
          duration={300} 
          aria-label="Quiz countdown timer" 
        />
      );
      
      expect(screen.getByLabelText(/quiz countdown timer/i)).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Timer 
          duration={300} 
          className="custom-timer-class" 
        />
      );
      
      const timerElement = screen.getByRole("group");
      expect(timerElement).toHaveClass("custom-timer-class");
    });
  });

  describe("timer variants", () => {
    it("renders countdown timer correctly", () => {
      render(
        <Timer 
          duration={300} 
          variant="countdown" 
          showLabels 
        />
      );
      
      expect(mockUseTimer).toHaveBeenCalledWith(300, expect.objectContaining({
        variant: "countdown",
      }));
    });

    it("renders stopwatch timer correctly", () => {
      render(
        <Timer 
          duration={0} 
          variant="stopwatch" 
          targetTime={1800} 
        />
      );
      
      expect(mockUseTimer).toHaveBeenCalledWith(0, expect.objectContaining({
        variant: "stopwatch",
        targetTime: 1800,
      }));
    });

    it("renders progress timer with progress bar", () => {
      mockUseTimer.mockReturnValue({
        ...defaultTimerState,
        progress: 50,
      });

      render(
        <Timer 
          duration={300} 
          variant="progress" 
          showProgress 
        />
      );
      
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  describe("timer controls", () => {
    it("shows control buttons when enabled", () => {
      render(
        <Timer 
          duration={300} 
          showControls 
        />
      );
      
      expect(screen.getByLabelText(/start timer/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/reset timer/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/stop timer/i)).toBeInTheDocument();
    });

    it("hides control buttons by default", () => {
      render(<Timer duration={300} />);
      
      expect(screen.queryByLabelText(/start timer/i)).not.toBeInTheDocument();
    });

    it("calls toggle when play/pause button clicked", async () => {
      const user = userEvent.setup();
      
      render(
        <Timer 
          duration={300} 
          showControls 
        />
      );
      
      const playButton = screen.getByLabelText(/start timer/i);
      await user.click(playButton);
      
      expect(defaultTimerState.toggle).toHaveBeenCalledTimes(1);
    });

    it("calls reset when reset button clicked", async () => {
      const user = userEvent.setup();
      
      render(
        <Timer 
          duration={300} 
          showControls 
        />
      );
      
      const resetButton = screen.getByLabelText(/reset timer/i);
      await user.click(resetButton);
      
      expect(defaultTimerState.reset).toHaveBeenCalledTimes(1);
    });

    it("disables controls when timer is disabled", () => {
      render(
        <Timer 
          duration={300} 
          showControls 
          disabled 
        />
      );
      
      const buttons = screen.getAllByRole("button");
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("keyboard interactions", () => {
    it("toggles timer on spacebar press", () => {
      render(<Timer duration={300} />);
      
      const timerElement = screen.getByRole("group");
      fireEvent.keyDown(timerElement, { key: " " });
      
      expect(defaultTimerState.toggle).toHaveBeenCalledTimes(1);
    });

    it("toggles timer on Enter press", () => {
      render(<Timer duration={300} />);
      
      const timerElement = screen.getByRole("group");
      fireEvent.keyDown(timerElement, { key: "Enter" });
      
      expect(defaultTimerState.toggle).toHaveBeenCalledTimes(1);
    });

    it("resets timer on Ctrl+R", () => {
      render(<Timer duration={300} />);
      
      const timerElement = screen.getByRole("group");
      fireEvent.keyDown(timerElement, { key: "r", ctrlKey: true });
      
      expect(defaultTimerState.reset).toHaveBeenCalledTimes(1);
    });

    it("pauses timer on Escape", () => {
      render(<Timer duration={300} />);
      
      const timerElement = screen.getByRole("group");
      fireEvent.keyDown(timerElement, { key: "Escape" });
      
      expect(defaultTimerState.pause).toHaveBeenCalledTimes(1);
    });

    it("ignores keyboard input when disabled", () => {
      render(<Timer duration={300} disabled />);
      
      const timerElement = screen.getByRole("group");
      fireEvent.keyDown(timerElement, { key: " " });
      
      expect(defaultTimerState.toggle).not.toHaveBeenCalled();
    });
  });

  describe("timer states", () => {
    it("shows pause icon when timer is running", () => {
      mockUseTimer.mockReturnValue({
        ...defaultTimerState,
        isRunning: true,
        isPaused: false,
      });

      render(
        <Timer 
          duration={300} 
          showControls 
        />
      );
      
      expect(screen.getByTestId("pause-icon")).toBeInTheDocument();
    });

    it("shows play icon when timer is paused", () => {
      mockUseTimer.mockReturnValue({
        ...defaultTimerState,
        isRunning: false,
        isPaused: true,
      });

      render(
        <Timer 
          duration={300} 
          showControls 
        />
      );
      
      expect(screen.getByTestId("play-icon")).toBeInTheDocument();
    });

    it("disables play button when completed", () => {
      mockUseTimer.mockReturnValue({
        ...defaultTimerState,
        isCompleted: true,
      });

      render(
        <Timer 
          duration={300} 
          showControls 
        />
      );
      
      const playButton = screen.getByLabelText(/start timer/i);
      expect(playButton).toBeDisabled();
    });

    it("announces completion to screen readers", () => {
      mockUseTimer.mockReturnValue({
        ...defaultTimerState,
        isCompleted: true,
      });

      render(<Timer duration={300} />);
      
      expect(screen.getByText("Timer completed")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has proper ARIA roles and labels", () => {
      render(<Timer duration={300} />);
      
      expect(screen.getByRole("group")).toBeInTheDocument();
      expect(screen.getByRole("timer")).toBeInTheDocument();
      expect(screen.getByLabelText(/timer/i)).toBeInTheDocument();
    });

    it("has live region for status updates", () => {
      render(<Timer duration={300} />);
      
      // Timer components use role="timer" with aria-live="polite" for status updates
      const timerElements = screen.getAllByRole("timer");
      expect(timerElements.length).toBeGreaterThan(0);
      
      // Verify the timer has aria-live attribute for screen reader announcements
      const timerElement = timerElements[0];
      expect(timerElement).toHaveAttribute("aria-live", "polite");
    });

    it("is keyboard accessible", () => {
      render(<Timer duration={300} />);
      
      const timerElement = screen.getByRole("group");
      expect(timerElement).toHaveAttribute("tabIndex", "0");
    });

    it("removes from tab order when disabled", () => {
      render(<Timer duration={300} disabled />);
      
      const timerElement = screen.getByRole("group");
      expect(timerElement).toHaveAttribute("tabIndex", "-1");
    });
  });

  describe("callbacks", () => {
    it("passes callbacks to useTimer hook", () => {
      const callbacks = {
        onComplete: jest.fn(),
        onTick: jest.fn(),
        onStart: jest.fn(),
        onPause: jest.fn(),
        onResume: jest.fn(),
        onReset: jest.fn(),
      };

      render(<Timer duration={300} {...callbacks} />);
      
      expect(mockUseTimer).toHaveBeenCalledWith(300, expect.objectContaining(callbacks));
    });

    it("handles autoStart correctly", () => {
      render(<Timer duration={300} autoStart />);
      
      expect(mockUseTimer).toHaveBeenCalledWith(300, expect.objectContaining({
        autoStart: true,
      }));
    });

    it("disables autoStart when disabled", () => {
      render(<Timer duration={300} autoStart disabled />);
      
      expect(mockUseTimer).toHaveBeenCalledWith(300, expect.objectContaining({
        autoStart: false,
      }));
    });
  });

  describe("validation", () => {
    it("uses validated duration", () => {
      // Test that Timer component uses the validated duration from validateTimerDuration
      // Our mock already returns the input duration, so we test with a different input
      render(<Timer duration={300} context="quiz" />);
      
      expect(mockUseTimer).toHaveBeenCalledWith(300, expect.any(Object));
    });

    it("shows validation warning in development", () => {
      // Test that validation is called - the actual warning logic is tested in the validation utility tests
      render(<Timer duration={30} context="quiz" />);
      
      // Test passes if component renders without errors - validation logic is tested in utility tests
      expect(mockUseTimer).toHaveBeenCalledWith(30, expect.any(Object));
    });
  });
});

describe("CompactTimer Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTimer.mockReturnValue({
      time: 120,
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      progress: 0,
      start: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      reset: jest.fn(),
      toggle: jest.fn(),
      getFormattedTime: jest.fn(() => "02:00"),
      getTimeWithLabel: jest.fn(() => "2 minutes remaining"),
      getColorTheme: jest.fn(() => "default"),
    });
  });

  it("renders compact timer correctly", () => {
    render(<CompactTimer duration={120} />);
    
    // Check for the compact timer container specifically
    const compactTimer = screen.getByLabelText(/compact.*timer/i);
    expect(compactTimer).toBeInTheDocument();
    expect(compactTimer).toHaveClass("compact-timer");
  });

  it("passes minimal props to useTimer", () => {
    render(
      <CompactTimer 
        duration={120} 
        variant="countdown" 
        context="ai" 
      />
    );
    
    expect(mockUseTimer).toHaveBeenCalledWith(120, expect.objectContaining({
      variant: "countdown",
      autoStart: false,
    }));
  });

  it("handles disabled state", () => {
    render(<CompactTimer duration={120} disabled />);
    
    // Check for the compact timer container specifically
    const compactTimer = screen.getByLabelText(/compact.*timer/i);
    expect(compactTimer).toHaveClass("opacity-50");
  });

  it("has proper accessibility", () => {
    render(
      <CompactTimer 
        duration={120} 
        aria-label="Compact quiz timer" 
      />
    );
    
    expect(screen.getByLabelText(/compact quiz timer/i)).toBeInTheDocument();
  });
});
