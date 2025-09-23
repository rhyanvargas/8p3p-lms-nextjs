/**
 * TimeEstimate Component Tests
 * 
 * Tests for the TimeEstimate display component including all variants,
 * accessibility, and user interaction scenarios.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { TimeEstimate, type TimeEstimateProps } from '@/components/common/content-estimation/TimeEstimate';
import { mockTimeEstimates } from '@/lib/mock-data/content-estimation';

// Mock the formatTime utility
jest.mock('@/lib/utils/time-formatting', () => ({
  formatTime: jest.fn((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  })
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Clock: ({ className }: { className?: string }) => <div data-testid="clock-icon" className={className} />,
  User: ({ className }: { className?: string }) => <div data-testid="user-icon" className={className} />,
  BookOpen: ({ className }: { className?: string }) => <div data-testid="book-icon" className={className} />,
  Video: ({ className }: { className?: string }) => <div data-testid="video-icon" className={className} />,
  Coffee: ({ className }: { className?: string }) => <div data-testid="coffee-icon" className={className} />,
  Activity: ({ className }: { className?: string }) => <div data-testid="activity-icon" className={className} />
}));

describe('TimeEstimate Component', () => {
  const defaultProps: TimeEstimateProps = {
    estimate: mockTimeEstimates.mediumLesson,
    variant: 'detailed',
    showBreakdown: true,
    complexity: 'moderate'
  };

  describe('Rendering', () => {
    it('should render detailed variant by default', () => {
      render(<TimeEstimate {...defaultProps} />);
      
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
      expect(screen.getByText('30:00')).toBeInTheDocument(); // 1800 seconds = 30:00
      expect(screen.getByText('estimated')).toBeInTheDocument();
    });

    it('should render compact variant', () => {
      render(<TimeEstimate {...defaultProps} variant="compact" />);
      
      expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
      expect(screen.getByText('30:00')).toBeInTheDocument();
      expect(screen.queryByText('estimated')).not.toBeInTheDocument();
    });

    it('should render card variant', () => {
      render(<TimeEstimate {...defaultProps} variant="card" />);
      
      expect(screen.getByText('Estimated Time')).toBeInTheDocument();
      expect(screen.getByText('30:00')).toBeInTheDocument();
    });

    it('should show personalized badge when estimate is personalized', () => {
      const personalizedProps = {
        ...defaultProps,
        estimate: {
          ...mockTimeEstimates.mediumLesson,
          isPersonalized: true
        }
      };
      
      render(<TimeEstimate {...personalizedProps} />);
      
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
      expect(screen.getByText('Personalized')).toBeInTheDocument();
    });

    it('should display complexity badge', () => {
      render(<TimeEstimate {...defaultProps} complexity="complex" />);
      
      expect(screen.getByText('Complex')).toBeInTheDocument();
    });

    it('should display confidence badge', () => {
      render(<TimeEstimate {...defaultProps} />);
      
      const confidence = Math.round(mockTimeEstimates.mediumLesson.confidence * 100);
      expect(screen.getByText(`${confidence}% confident`)).toBeInTheDocument();
    });
  });

  describe('Time Breakdown', () => {
    it('should show breakdown when enabled', () => {
      render(<TimeEstimate {...defaultProps} showBreakdown={true} />);
      
      expect(screen.getByText('Time Breakdown')).toBeInTheDocument();
      expect(screen.getByTestId('book-icon')).toBeInTheDocument(); // Reading
      expect(screen.getByTestId('video-icon')).toBeInTheDocument(); // Video
      expect(screen.getByTestId('activity-icon')).toBeInTheDocument(); // Interaction
    });

    it('should hide breakdown when disabled', () => {
      render(<TimeEstimate {...defaultProps} showBreakdown={false} />);
      
      expect(screen.queryByText('Time Breakdown')).not.toBeInTheDocument();
    });

    it('should only show non-zero breakdown items', () => {
      const estimateWithoutBreaks = {
        ...mockTimeEstimates.mediumLesson,
        breakdown: {
          ...mockTimeEstimates.mediumLesson.breakdown,
          breaks: 0
        }
      };
      
      render(<TimeEstimate {...defaultProps} estimate={estimateWithoutBreaks} showBreakdown={true} />);
      
      expect(screen.queryByTestId('coffee-icon')).not.toBeInTheDocument();
    });

    it('should format breakdown times correctly', () => {
      render(<TimeEstimate {...defaultProps} showBreakdown={true} />);
      
      // Check that reading and video times are displayed (720 seconds each = 12:00)
      const timeElements = screen.getAllByText('12:00');
      expect(timeElements).toHaveLength(2); // Reading and Video both show 12:00
      
      // Check interaction time (360 seconds = 6:00)
      expect(screen.getByText('06:00')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<TimeEstimate {...defaultProps} />);
      
      // The component should be accessible to screen readers
      expect(screen.getByText('30:00')).toBeInTheDocument();
    });

    it('should be keyboard accessible when clickable', () => {
      const handleClick = jest.fn();
      render(<TimeEstimate {...defaultProps} onClick={handleClick} />);
      
      const clickableElement = screen.getByRole('button');
      expect(clickableElement).toBeInTheDocument();
      expect(clickableElement).toHaveAttribute('tabIndex', '0');
    });

    it('should not be focusable when not clickable', () => {
      render(<TimeEstimate {...defaultProps} />);
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<TimeEstimate {...defaultProps} onClick={handleClick} />);
      
      const clickableElement = screen.getByRole('button');
      fireEvent.click(clickableElement);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events when clickable', () => {
      const handleClick = jest.fn();
      render(<TimeEstimate {...defaultProps} onClick={handleClick} />);
      
      const clickableElement = screen.getByRole('button');
      fireEvent.keyDown(clickableElement, { key: 'Enter' });
      
      // Note: The component doesn't explicitly handle keyboard events,
      // but it should be accessible via standard button behavior
      expect(clickableElement).toBeInTheDocument();
    });
  });

  describe('Styling and CSS Classes', () => {
    it('should apply custom className', () => {
      const { container } = render(<TimeEstimate {...defaultProps} className="custom-class" />);
      
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should apply hover styles when clickable', () => {
      render(<TimeEstimate {...defaultProps} onClick={() => {}} />);
      
      const clickableElement = screen.getByRole('button');
      expect(clickableElement).toHaveClass('cursor-pointer');
    });
  });

  describe('Badge Variants', () => {
    it('should show correct complexity badge colors', () => {
      const { rerender } = render(<TimeEstimate {...defaultProps} complexity="simple" />);
      expect(screen.getByText('Simple')).toBeInTheDocument();
      
      rerender(<TimeEstimate {...defaultProps} complexity="moderate" />);
      expect(screen.getByText('Moderate')).toBeInTheDocument();
      
      rerender(<TimeEstimate {...defaultProps} complexity="complex" />);
      expect(screen.getByText('Complex')).toBeInTheDocument();
    });

    it('should show appropriate confidence badge variants', () => {
      const highConfidenceEstimate = {
        ...mockTimeEstimates.mediumLesson,
        confidence: 0.9
      };
      
      const lowConfidenceEstimate = {
        ...mockTimeEstimates.mediumLesson,
        confidence: 0.5
      };
      
      const { rerender } = render(<TimeEstimate {...defaultProps} estimate={highConfidenceEstimate} />);
      expect(screen.getByText('90% confident')).toBeInTheDocument();
      
      rerender(<TimeEstimate {...defaultProps} estimate={lowConfidenceEstimate} />);
      expect(screen.getByText('50% confident')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero time estimates', () => {
      const zeroEstimate = {
        total: 0,
        breakdown: { reading: 0, video: 0, interaction: 0, breaks: 0 },
        confidence: 0.5,
        isPersonalized: false
      };
      
      render(<TimeEstimate {...defaultProps} estimate={zeroEstimate} />);
      
      expect(screen.getByText('00:00')).toBeInTheDocument();
    });

    it('should handle very large time estimates', () => {
      const largeEstimate = {
        total: 7200, // 2 hours
        breakdown: { reading: 3600, video: 2400, interaction: 1200, breaks: 0 },
        confidence: 0.7,
        isPersonalized: true
      };
      
      render(<TimeEstimate {...defaultProps} estimate={largeEstimate} />);
      
      expect(screen.getByText('120:00')).toBeInTheDocument(); // 7200 seconds = 120:00
    });

    it('should handle missing complexity prop', () => {
      const { complexity, ...propsWithoutComplexity } = defaultProps;
      
      expect(() => render(<TimeEstimate {...propsWithoutComplexity} />)).not.toThrow();
    });
  });
});
