/**
 * Custom hook for content estimation with caching and personalization
 * 
 * Provides a React hook interface for the content analysis engine with
 * automatic caching, error handling, and user profile integration.
 * 
 * Integrates with existing timer infrastructure and follows React best practices.
 * 
 * @example
 * const { estimate, isLoading, error, updateUserProfile } = useContentEstimation({
 *   content: { text: "Course content...", videos: [...] },
 *   userProfile: { readingSpeed: 220 },
 *   autoAnalyze: true
 * });
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  calculateTimeEstimate, 
  updateUserProfile as updateProfile,
  type MixedContent, 
  type UserProfile, 
  type TimeEstimate,
  type EstimationConfig,
  DEFAULT_ESTIMATION_CONFIG 
} from "@/lib/content-analysis";

export interface UseContentEstimationOptions {
  /** Content to analyze */
  content: MixedContent | null;
  /** User profile for personalization */
  userProfile?: UserProfile;
  /** Estimation configuration */
  config?: EstimationConfig;
  /** Whether to automatically analyze when content changes */
  autoAnalyze?: boolean;
  /** Cache key for memoization (optional) */
  cacheKey?: string;
}

export interface UseContentEstimationReturn {
  /** Current time estimate */
  estimate: TimeEstimate | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: string | null;
  /** Function to manually trigger analysis */
  analyze: () => Promise<void>;
  /** Function to update user profile with completion data */
  updateUserProfile: (actualTime: number, contentComplexity: 'simple' | 'moderate' | 'complex') => void;
  /** Function to clear current estimate */
  clearEstimate: () => void;
  /** Whether estimate is from cache */
  isCached: boolean;
}

// Simple in-memory cache for estimates
const estimateCache = new Map<string, TimeEstimate>();

/**
 * Hook for content estimation with caching and error handling
 */
export function useContentEstimation({
  content,
  userProfile,
  config = DEFAULT_ESTIMATION_CONFIG,
  autoAnalyze = true,
  cacheKey
}: UseContentEstimationOptions): UseContentEstimationReturn {
  const [estimate, setEstimate] = useState<TimeEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  // Generate cache key based on content and user profile
  const generatedCacheKey = useMemo(() => {
    if (cacheKey) return cacheKey;
    if (!content) return null;
    
    const contentHash = JSON.stringify({
      text: content.text?.slice(0, 100), // First 100 chars for hashing
      videoCount: content.videos?.length || 0,
      contentType: content.contentType,
      userReadingSpeed: userProfile?.readingSpeed,
      userCompletionRate: userProfile?.completionRate
    });
    
    return btoa(contentHash).slice(0, 16); // Short hash for cache key
  }, [content, userProfile, cacheKey]);

  // Analyze content function
  const analyze = useCallback(async () => {
    if (!content) {
      setError("No content provided for analysis");
      return;
    }

    // Check cache first
    if (generatedCacheKey && estimateCache.has(generatedCacheKey)) {
      const cachedEstimate = estimateCache.get(generatedCacheKey)!;
      setEstimate(cachedEstimate);
      setIsCached(true);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsCached(false);

    try {
      // Perform analysis
      const result = calculateTimeEstimate(content, userProfile || {}, config);
      
      // Cache the result
      if (generatedCacheKey) {
        estimateCache.set(generatedCacheKey, result);
      }
      
      setEstimate(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      setEstimate(null);
    } finally {
      setIsLoading(false);
    }
  }, [content, userProfile, config, generatedCacheKey]);

  // Auto-analyze when dependencies change
  useEffect(() => {
    if (autoAnalyze && content) {
      analyze();
    }
  }, [autoAnalyze, analyze, content]);

  // Update user profile function
  const updateUserProfile = useCallback((
    actualTime: number, 
    contentComplexity: 'simple' | 'moderate' | 'complex'
  ) => {
    if (!estimate || !userProfile) return;

    const updatedProfile = updateProfile(
      userProfile,
      estimate.total,
      actualTime,
      contentComplexity
    );

    // You would typically save this to your user management system
    // For now, we'll just trigger a re-analysis with the updated profile
    console.log('Updated user profile:', updatedProfile);
    
    // Clear cache to force re-analysis with new profile
    if (generatedCacheKey) {
      estimateCache.delete(generatedCacheKey);
    }
  }, [estimate, userProfile, generatedCacheKey]);

  // Clear estimate function
  const clearEstimate = useCallback(() => {
    setEstimate(null);
    setError(null);
    setIsCached(false);
    if (generatedCacheKey) {
      estimateCache.delete(generatedCacheKey);
    }
  }, [generatedCacheKey]);

  return {
    estimate,
    isLoading,
    error,
    analyze,
    updateUserProfile,
    clearEstimate,
    isCached
  };
}

/**
 * Hook for tracking progress during content consumption
 * 
 * Integrates with existing timer infrastructure to track actual
 * completion time and compare with estimates.
 */
export function useProgressTracking(estimatedTime: number) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);

  // Start tracking
  const startTracking = useCallback(() => {
    setStartTime(new Date());
    setIsActive(true);
    setElapsedTime(0);
    setProgress(0);
  }, []);

  // Stop tracking
  const stopTracking = useCallback(() => {
    setIsActive(false);
    return elapsedTime;
  }, [elapsedTime]);

  // Update progress (0-100)
  const updateProgress = useCallback((progressPercentage: number) => {
    setProgress(Math.max(0, Math.min(100, progressPercentage)));
  }, []);

  // Calculate elapsed time
  useEffect(() => {
    if (!isActive || !startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime]);

  // Calculate remaining time based on progress
  const remainingTime = useMemo(() => {
    if (progress === 0) return estimatedTime;
    const estimatedTotal = (elapsedTime / progress) * 100;
    return Math.max(0, estimatedTotal - elapsedTime);
  }, [elapsedTime, progress, estimatedTime]);

  return {
    startTime,
    elapsedTime,
    remainingTime,
    progress,
    isActive,
    startTracking,
    stopTracking,
    updateProgress
  };
}

/**
 * Hook for managing user estimation preferences
 */
export function useEstimationPreferences() {
  const [preferences, setPreferences] = useState<EstimationConfig>(DEFAULT_ESTIMATION_CONFIG);

  const updatePreferences = useCallback((updates: Partial<EstimationConfig>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_ESTIMATION_CONFIG);
  }, []);

  return {
    preferences,
    updatePreferences,
    resetPreferences
  };
}
