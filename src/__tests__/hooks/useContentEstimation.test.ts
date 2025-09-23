/**
 * useContentEstimation Hook Tests
 * 
 * Tests for the content estimation hook including caching,
 * error handling, and user profile integration.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useContentEstimation, useProgressTracking } from '@/hooks/useContentEstimation';
import { mockLessons, mockUserProfiles } from '@/lib/mock-data/content-estimation';

// Mock the content analysis functions
jest.mock('@/lib/content-analysis', () => ({
  calculateTimeEstimate: jest.fn(),
  updateUserProfile: jest.fn(),
  DEFAULT_ESTIMATION_CONFIG: {
    includeInteractionTime: true,
    includeBreakTime: true,
    confidenceThreshold: 0.6,
    usePersonalization: true
  }
}));

import { calculateTimeEstimate, updateUserProfile } from '@/lib/content-analysis';

const mockCalculateTimeEstimate = jest.mocked(calculateTimeEstimate);
const mockUpdateUserProfile = jest.mocked(updateUserProfile);

describe('useContentEstimation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the cache between tests
    // Clear the cache between tests
    if (typeof global !== 'undefined' && 'estimateCache' in global) {
      (global as { estimateCache?: { clear?: () => void } }).estimateCache?.clear?.();
    }
  });

  const mockEstimate = {
    total: 1800,
    breakdown: { reading: 600, video: 900, interaction: 300, breaks: 0 },
    confidence: 0.85,
    isPersonalized: true,
    recommendations: {
      suggestedSessions: 2,
      sessionLength: 900,
      breakFrequency: 2,
      pace: 'moderate' as const
    }
  };

  describe('Basic Functionality', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useContentEstimation({
        content: null,
        autoAnalyze: false
      }));

      expect(result.current.estimate).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isCached).toBe(false);
    });

    it('should auto-analyze when content is provided', async () => {
      mockCalculateTimeEstimate.mockReturnValue(mockEstimate);

      const { result } = renderHook(() => useContentEstimation({
        content: mockLessons.introductionLesson,
        autoAnalyze: true
      }));

      await waitFor(() => {
        expect(result.current.estimate).toEqual(mockEstimate);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
      });

      expect(mockCalculateTimeEstimate).toHaveBeenCalled();
    });

    it('should not auto-analyze when autoAnalyze is false', () => {
      mockCalculateTimeEstimate.mockReturnValue(mockEstimate);

      const { result } = renderHook(() => useContentEstimation({
        content: mockLessons.introductionLesson,
        autoAnalyze: false
      }));

      expect(result.current.estimate).toBeNull();
      expect(mockCalculateTimeEstimate).not.toHaveBeenCalled();
    });

    it('should handle manual analysis trigger', async () => {
      mockCalculateTimeEstimate.mockReturnValue(mockEstimate);

      const { result } = renderHook(() => useContentEstimation({
        content: mockLessons.introductionLesson,
        autoAnalyze: false
      }));

      await act(async () => {
        await result.current.analyze();
      });

      await waitFor(() => {
        expect(result.current.estimate).toEqual(mockEstimate);
      });
    });
  });

  describe('User Profile Integration', () => {
    it('should pass user profile to analysis function', async () => {
      mockCalculateTimeEstimate.mockReturnValue(mockEstimate);
      const userProfile = mockUserProfiles.fastReader;

      const { result } = renderHook(() => useContentEstimation({
        content: mockLessons.introductionLesson,
        userProfile,
        autoAnalyze: true
      }));

      await waitFor(() => {
        expect(result.current.estimate).toEqual(mockEstimate);
        expect(result.current.estimate?.isPersonalized).toBe(true);
      });
    });

    it('should update user profile with completion data', () => {
      const updatedProfile = { ...mockUserProfiles.fastReader, completionRate: 0.95 };
      mockUpdateUserProfile.mockReturnValue(updatedProfile);
      mockCalculateTimeEstimate.mockReturnValue(mockEstimate);

      const { result } = renderHook(() => useContentEstimation({
        content: mockLessons.introductionLesson,
        userProfile: mockUserProfiles.fastReader,
        autoAnalyze: true
      }));

      act(() => {
        result.current.updateUserProfile(1620, 'moderate'); // 27 minutes actual vs 30 estimated
      });

      expect(mockUpdateUserProfile).toHaveBeenCalledWith(
        mockUserProfiles.fastReader,
        1800, // estimated time from mock
        1620, // actual time
        'moderate'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle analysis errors gracefully', async () => {
      const errorMessage = 'Analysis failed';
      mockCalculateTimeEstimate.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const { result } = renderHook(() => useContentEstimation({
        content: mockLessons.introductionLesson,
        autoAnalyze: true
      }));

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.estimate).toBeNull();
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle invalid content error', async () => {
      const { result } = renderHook(() => useContentEstimation({
        content: null,
        autoAnalyze: true
      }));

      await act(async () => {
        await result.current.analyze();
      });

      expect(result.current.error).toBe('No content provided for analysis');
      expect(result.current.estimate).toBeNull();
    });

    it('should clear error on successful analysis', async () => {
      mockCalculateTimeEstimate
        .mockImplementationOnce(() => { throw new Error('First error'); })
        .mockReturnValueOnce(mockEstimate);

      const { result } = renderHook(() => useContentEstimation({
        content: mockLessons.introductionLesson,
        autoAnalyze: true
      }));

      // Wait for first error
      await waitFor(() => {
        expect(result.current.error).toBe('First error');
      });

      // Trigger successful analysis
      await act(async () => {
        await result.current.analyze();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.estimate).toEqual(mockEstimate);
    });
  });

  describe('Caching', () => {
    it('should cache analysis results', async () => {
      mockCalculateTimeEstimate.mockReturnValue(mockEstimate);

      const { result } = renderHook(() => useContentEstimation({
        content: mockLessons.introductionLesson,
        cacheKey: 'test-cache-key',
        autoAnalyze: true
      }));

      await waitFor(() => {
        expect(result.current.estimate).toEqual(mockEstimate);
      });

      // Second analysis should use cache
      await act(async () => {
        await result.current.analyze();
      });

      expect(mockCalculateTimeEstimate).toHaveBeenCalledTimes(1); // Only called once
      expect(result.current.isCached).toBe(true);
    });

    it('should clear cache when requested', async () => {
      mockCalculateTimeEstimate.mockReturnValue(mockEstimate);

      const { result } = renderHook(() => useContentEstimation({
        content: mockLessons.introductionLesson,
        cacheKey: 'test-cache-key',
        autoAnalyze: true
      }));

      await waitFor(() => {
        expect(result.current.estimate).toEqual(mockEstimate);
      });

      act(() => {
        result.current.clearEstimate();
      });

      expect(result.current.estimate).toBeNull();
      expect(result.current.isCached).toBe(false);
    });
  });

  describe('Configuration', () => {
    it('should use custom configuration', async () => {
      mockCalculateTimeEstimate.mockReturnValue(mockEstimate);
      const customConfig = {
        includeInteractionTime: false,
        includeBreakTime: false,
        confidenceThreshold: 0.8,
        usePersonalization: false
      };

      const { result } = renderHook(() => useContentEstimation({
        content: mockLessons.introductionLesson,
        config: customConfig,
        autoAnalyze: true
      }));

      await waitFor(() => {
        expect(result.current.estimate).toEqual(mockEstimate);
        expect(result.current.error).toBeNull();
      });
    });
  });
});

describe('useProgressTracking', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useProgressTracking(1800));

    expect(result.current.startTime).toBeNull();
    expect(result.current.elapsedTime).toBe(0);
    expect(result.current.progress).toBe(0);
    expect(result.current.isActive).toBe(false);
    expect(result.current.remainingTime).toBe(1800);
  });

  it('should start tracking when requested', () => {
    const { result } = renderHook(() => useProgressTracking(1800));

    act(() => {
      result.current.startTracking();
    });

    expect(result.current.startTime).toBeInstanceOf(Date);
    expect(result.current.isActive).toBe(true);
  });

  it('should update elapsed time', () => {
    const { result } = renderHook(() => useProgressTracking(1800));

    act(() => {
      result.current.startTracking();
    });

    // Advance time by 30 seconds
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(result.current.elapsedTime).toBe(30);
  });

  it('should calculate remaining time based on progress', () => {
    const { result } = renderHook(() => useProgressTracking(1800));

    act(() => {
      result.current.startTracking();
    });

    // Advance time and set progress
    act(() => {
      jest.advanceTimersByTime(30000); // 30 seconds elapsed
      result.current.updateProgress(25); // 25% complete
    });

    // At 25% progress in 30 seconds, projected total is 120 seconds
    // So remaining time should be 120 - 30 = 90 seconds
    expect(result.current.remainingTime).toBe(90);
  });

  it('should stop tracking and return elapsed time', () => {
    const { result } = renderHook(() => useProgressTracking(1800));

    act(() => {
      result.current.startTracking();
    });

    act(() => {
      jest.advanceTimersByTime(45000); // 45 seconds
    });

    let returnedTime: number;
    act(() => {
      returnedTime = result.current.stopTracking();
    });

    expect(returnedTime!).toBe(45);
    expect(result.current.isActive).toBe(false);
  });

  it('should handle progress updates correctly', () => {
    const { result } = renderHook(() => useProgressTracking(1800));

    act(() => {
      result.current.updateProgress(50);
    });

    expect(result.current.progress).toBe(50);

    // Test bounds
    act(() => {
      result.current.updateProgress(-10);
    });
    expect(result.current.progress).toBe(0);

    act(() => {
      result.current.updateProgress(150);
    });
    expect(result.current.progress).toBe(100);
  });
});
