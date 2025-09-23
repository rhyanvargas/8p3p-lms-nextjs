/**
 * Estimation Engine for Content Estimation System
 * 
 * Provides high-level estimation algorithms that combine text and video analysis
 * with user personalization and historical data for accurate time predictions.
 * 
 * Integrates with existing timer infrastructure and provides adaptive estimates
 * that improve over time based on actual user completion data.
 */

import { analyzeMixedContent, ContentAnalysis, MixedContent, isValidMixedContent } from './content-parser';
import { getPersonalizedReadingTime } from './text-analyzer';

export interface UserProfile {
  /** User's personal reading speed in words per minute */
  readingSpeed?: number;
  /** Historical completion rate (actual time / estimated time) */
  completionRate?: number;
  /** User's preferred learning pace */
  learningPace?: 'fast' | 'moderate' | 'slow';
  /** User's experience level with the subject matter */
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface EstimationConfig {
  /** Whether to include interaction time in estimates */
  includeInteractionTime: boolean;
  /** Whether to include break time in estimates */
  includeBreakTime: boolean;
  /** Confidence threshold for displaying estimates (0-1) */
  confidenceThreshold: number;
  /** Whether to use personalized adjustments */
  usePersonalization: boolean;
}

export interface TimeEstimate {
  /** Total estimated time in seconds */
  total: number;
  /** Time breakdown by component */
  breakdown: {
    reading: number;
    video: number;
    interaction: number;
    breaks: number;
  };
  /** Confidence level in the estimate (0-1) */
  confidence: number;
  /** Whether estimate is personalized */
  isPersonalized: boolean;
  /** Recommended learning approach */
  recommendations: {
    suggestedSessions: number;
    sessionLength: number; // in seconds
    breakFrequency: number; // breaks per hour
    pace: 'fast' | 'moderate' | 'slow';
  };
}

/**
 * Default estimation configuration for balanced accuracy and usability
 */
export const DEFAULT_ESTIMATION_CONFIG: EstimationConfig = {
  includeInteractionTime: true,
  includeBreakTime: true,
  confidenceThreshold: 0.6,
  usePersonalization: true
};

/**
 * Calculates comprehensive time estimate for mixed content
 * 
 * @param content - Mixed content to analyze
 * @param userProfile - User's learning profile for personalization
 * @param config - Estimation configuration options
 * @returns Complete time estimate with breakdown and recommendations
 * 
 * @example
 * const estimate = calculateTimeEstimate(
 *   { text: "Course content...", videos: [...] },
 *   { readingSpeed: 220, completionRate: 1.1 },
 *   DEFAULT_ESTIMATION_CONFIG
 * );
 * // Returns: { total: 1800, breakdown: {...}, confidence: 0.85, ... }
 */
export function calculateTimeEstimate(
  content: MixedContent,
  userProfile: UserProfile = {},
  config: EstimationConfig = DEFAULT_ESTIMATION_CONFIG
): TimeEstimate {
  // Validate input content
  if (!isValidMixedContent(content)) {
    throw new Error('Invalid content provided for time estimation');
  }

  // Perform base content analysis
  const contentAnalysis = analyzeMixedContent(content);
  
  // Apply personalization if enabled and user profile available
  const personalizedAnalysis = config.usePersonalization 
    ? applyPersonalization(contentAnalysis, userProfile)
    : contentAnalysis;

  // Calculate detailed time breakdown
  const breakdown = calculateDetailedBreakdown(personalizedAnalysis, config);
  
  // Generate learning recommendations
  const recommendations = generateRecommendations(
    breakdown,
    personalizedAnalysis.overallComplexity,
    userProfile
  );

  return {
    total: breakdown.reading + breakdown.video + breakdown.interaction + breakdown.breaks,
    breakdown,
    confidence: personalizedAnalysis.confidence,
    isPersonalized: config.usePersonalization && hasPersonalizationData(userProfile),
    recommendations
  };
}

/**
 * Applies user personalization to content analysis
 * 
 * @param analysis - Base content analysis
 * @param userProfile - User's learning profile
 * @returns Personalized content analysis
 */
function applyPersonalization(
  analysis: ContentAnalysis,
  userProfile: UserProfile
): ContentAnalysis {
  // Create a copy to avoid mutating the original
  const personalizedAnalysis = { ...analysis };

  // Apply personalized reading time if text analysis exists
  if (analysis.textAnalysis && userProfile.readingSpeed) {
    const personalizedReadingTime = getPersonalizedReadingTime(
      analysis.textAnalysis,
      userProfile.readingSpeed
    );
    
    // Update the breakdown with personalized reading time
    const timeDifference = personalizedReadingTime - analysis.breakdown.text;
    personalizedAnalysis.breakdown = {
      ...analysis.breakdown,
      text: personalizedReadingTime,
      total: analysis.breakdown.total + timeDifference
    };
    personalizedAnalysis.totalEstimatedTime = personalizedAnalysis.breakdown.total;
  }

  // Apply completion rate adjustment if available
  if (userProfile.completionRate) {
    const adjustmentFactor = userProfile.completionRate;
    personalizedAnalysis.totalEstimatedTime = Math.round(
      personalizedAnalysis.totalEstimatedTime * adjustmentFactor
    );
    personalizedAnalysis.breakdown.total = personalizedAnalysis.totalEstimatedTime;
  }

  // Adjust confidence based on personalization data quality
  if (hasPersonalizationData(userProfile)) {
    personalizedAnalysis.confidence = Math.min(personalizedAnalysis.confidence + 0.1, 0.95);
  }

  return personalizedAnalysis;
}

/**
 * Calculates detailed time breakdown including breaks and interaction time
 * 
 * @param analysis - Content analysis (potentially personalized)
 * @param config - Estimation configuration
 * @returns Detailed time breakdown
 */
function calculateDetailedBreakdown(
  analysis: ContentAnalysis,
  config: EstimationConfig
): TimeEstimate['breakdown'] {
  const baseBreakdown = analysis.breakdown;
  
  // Calculate break time if enabled
  let breakTime = 0;
  if (config.includeBreakTime) {
    const totalActiveTime = baseBreakdown.text + baseBreakdown.video;
    // Add 5-minute break for every 30 minutes of active content
    const breakCount = Math.floor(totalActiveTime / (30 * 60));
    breakTime = breakCount * (5 * 60); // 5 minutes per break
  }

  // Use interaction time from analysis if enabled, otherwise set to 0
  const interactionTime = config.includeInteractionTime ? baseBreakdown.interaction : 0;

  return {
    reading: baseBreakdown.text,
    video: baseBreakdown.video,
    interaction: interactionTime,
    breaks: breakTime
  };
}

/**
 * Generates learning recommendations based on time breakdown and user profile
 * 
 * @param breakdown - Time breakdown
 * @param complexity - Content complexity level
 * @param userProfile - User's learning profile
 * @returns Learning recommendations
 */
function generateRecommendations(
  breakdown: TimeEstimate['breakdown'],
  complexity: 'simple' | 'moderate' | 'complex',
  userProfile: UserProfile
): TimeEstimate['recommendations'] {
  const totalTime = breakdown.reading + breakdown.video + breakdown.interaction + breakdown.breaks;
  const totalMinutes = totalTime / 60;

  // Determine optimal session length based on content and user preferences
  let sessionLength = 25 * 60; // Default 25 minutes (Pomodoro technique)
  
  if (userProfile.learningPace === 'fast') {
    sessionLength = 35 * 60; // 35 minutes for fast learners
  } else if (userProfile.learningPace === 'slow' || complexity === 'complex') {
    sessionLength = 20 * 60; // 20 minutes for slow pace or complex content
  }

  // Calculate number of sessions needed
  const suggestedSessions = Math.ceil(totalTime / sessionLength);

  // Determine break frequency (breaks per hour of active learning)
  let breakFrequency = 2; // Default 2 breaks per hour
  if (complexity === 'complex') breakFrequency = 3;
  if (complexity === 'simple') breakFrequency = 1;

  // Determine recommended pace
  let pace: 'fast' | 'moderate' | 'slow' = 'moderate';
  if (userProfile.learningPace) {
    pace = userProfile.learningPace;
  } else if (complexity === 'complex') {
    pace = 'slow';
  } else if (complexity === 'simple' && totalMinutes < 15) {
    pace = 'fast';
  }

  return {
    suggestedSessions,
    sessionLength,
    breakFrequency,
    pace
  };
}

/**
 * Updates user profile based on actual completion data
 * 
 * @param userProfile - Current user profile
 * @param estimatedTime - Originally estimated time in seconds
 * @param actualTime - Actual completion time in seconds
 * @param contentComplexity - Complexity of the completed content
 * @returns Updated user profile
 * 
 * @example
 * const updatedProfile = updateUserProfile(
 *   currentProfile,
 *   1800, // 30 minutes estimated
 *   2100, // 35 minutes actual
 *   'moderate'
 * );
 * // Returns profile with updated completion rate
 */
export function updateUserProfile(
  userProfile: UserProfile,
  estimatedTime: number,
  actualTime: number,
  _contentComplexity: 'simple' | 'moderate' | 'complex'
): UserProfile {
  const currentCompletionRate = userProfile.completionRate || 1.0;
  const newCompletionRate = actualTime / estimatedTime;
  
  // Use weighted average to gradually adjust completion rate
  // Give more weight to recent data, but don't change too drastically
  const weight = 0.3; // 30% weight to new data, 70% to historical
  const updatedCompletionRate = (currentCompletionRate * (1 - weight)) + (newCompletionRate * weight);

  return {
    ...userProfile,
    completionRate: Math.max(0.5, Math.min(2.0, updatedCompletionRate)) // Cap between 0.5x and 2x
  };
}

/**
 * Checks if user profile has sufficient data for personalization
 * 
 * @param userProfile - User profile to check
 * @returns True if profile has personalization data
 */
function hasPersonalizationData(userProfile: UserProfile): boolean {
  return !!(userProfile.readingSpeed || userProfile.completionRate || userProfile.learningPace);
}

/**
 * Validates estimation configuration
 * 
 * @param config - Configuration to validate
 * @returns True if configuration is valid
 */
export function isValidEstimationConfig(config: EstimationConfig): boolean {
  if (!config || typeof config !== 'object') return false;
  if (typeof config.includeInteractionTime !== 'boolean') return false;
  if (typeof config.includeBreakTime !== 'boolean') return false;
  if (typeof config.confidenceThreshold !== 'number') return false;
  if (config.confidenceThreshold < 0 || config.confidenceThreshold > 1) return false;
  if (typeof config.usePersonalization !== 'boolean') return false;
  return true;
}
