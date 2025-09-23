/**
 * Content Analysis System - Main Export File
 * 
 * Provides a unified interface for all content analysis functionality
 * including text analysis, video analysis, mixed content parsing,
 * and time estimation algorithms.
 */

// Text Analysis
export {
  analyzeTextContent,
  getPersonalizedReadingTime,
  isValidTextContent,
  DEFAULT_READING_CONFIG,
  type TextAnalysis,
  type ReadingSpeedConfig
} from './text-analyzer';

// Video Analysis
export {
  analyzeVideoContent,
  calculateTotalVideoTime,
  isValidVideoMetadata,
  type VideoMetadata,
  type VideoAnalysis
} from './video-analyzer';

// Mixed Content Analysis
export {
  analyzeMixedContent,
  isValidMixedContent,
  type MixedContent,
  type ContentAnalysis
} from './content-parser';

// Estimation Engine
export {
  calculateTimeEstimate,
  updateUserProfile,
  isValidEstimationConfig,
  DEFAULT_ESTIMATION_CONFIG,
  type UserProfile,
  type EstimationConfig,
  type TimeEstimate
} from './estimation-engine';
