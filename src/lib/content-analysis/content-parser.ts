/**
 * Mixed Content Parser for Content Estimation System
 * 
 * Combines text and video analysis to provide comprehensive content
 * analysis for educational materials with mixed media types.
 * 
 * Handles complex content structures and provides unified time estimates
 * for complete learning experiences.
 */

import { analyzeTextContent, TextAnalysis, isValidTextContent } from './text-analyzer';
import { analyzeVideoContent, VideoAnalysis, VideoMetadata, calculateTotalVideoTime, isValidVideoMetadata } from './video-analyzer';

export interface MixedContent {
  /** Text content for analysis */
  text?: string;
  /** Video content metadata */
  videos?: VideoMetadata[];
  /** Content title or identifier */
  title?: string;
  /** Content type classification */
  contentType?: 'lesson' | 'chapter' | 'section' | 'quiz' | 'assessment';
}

export interface ContentAnalysis {
  /** Total estimated completion time in seconds */
  totalEstimatedTime: number;
  /** Breakdown of time by content type */
  breakdown: {
    text: number;
    video: number;
    interaction: number;
    total: number;
  };
  /** Confidence level in the estimate (0-1) */
  confidence: number;
  /** Text analysis results (if text content present) */
  textAnalysis?: TextAnalysis;
  /** Video analysis results (if video content present) */
  videoAnalyses?: VideoAnalysis[];
  /** Content complexity assessment */
  overallComplexity: 'simple' | 'moderate' | 'complex';
  /** Recommended learning approach */
  learningRecommendations: {
    suggestedBreaks: number;
    estimatedSessions: number;
    recommendedPace: 'fast' | 'moderate' | 'slow';
  };
}

/**
 * Analyzes mixed content (text + video) to provide comprehensive time estimates
 * 
 * @param content - Mixed content with text and/or video components
 * @returns Complete content analysis with time breakdown and recommendations
 * 
 * @example
 * const analysis = analyzeMixedContent({
 *   text: "This lesson covers EMDR therapy basics...",
 *   videos: [{ url: "intro-video.mp4", duration: 300 }],
 *   contentType: "lesson"
 * });
 * // Returns comprehensive analysis with total time and breakdown
 */
export function analyzeMixedContent(content: MixedContent): ContentAnalysis {
  let textAnalysis: TextAnalysis | undefined;
  let videoAnalyses: VideoAnalysis[] = [];
  
  // Analyze text content if present
  if (content.text && isValidTextContent(content.text)) {
    textAnalysis = analyzeTextContent(content.text);
  }
  
  // Analyze video content if present
  if (content.videos && content.videos.length > 0) {
    videoAnalyses = content.videos
      .filter(isValidVideoMetadata)
      .map(analyzeVideoContent);
  }
  
  // Calculate time breakdown
  const breakdown = calculateTimeBreakdown(textAnalysis, videoAnalyses, content.contentType);
  
  // Determine overall complexity
  const overallComplexity = determineOverallComplexity(textAnalysis, videoAnalyses);
  
  // Calculate confidence level
  const confidence = calculateConfidenceLevel(textAnalysis, videoAnalyses, content);
  
  // Generate learning recommendations
  const learningRecommendations = generateLearningRecommendations(
    breakdown.total,
    overallComplexity,
    content.contentType
  );
  
  return {
    totalEstimatedTime: breakdown.total,
    breakdown,
    confidence,
    textAnalysis,
    videoAnalyses: videoAnalyses.length > 0 ? videoAnalyses : undefined,
    overallComplexity,
    learningRecommendations
  };
}

/**
 * Calculates time breakdown for mixed content
 * 
 * @param textAnalysis - Text analysis results (optional)
 * @param videoAnalyses - Video analysis results array
 * @param contentType - Type of content for interaction time calculation
 * @returns Time breakdown by content type
 */
function calculateTimeBreakdown(
  textAnalysis?: TextAnalysis,
  videoAnalyses?: VideoAnalysis[],
  contentType?: string
): ContentAnalysis['breakdown'] {
  // Calculate text reading time
  const textTime = textAnalysis?.estimatedReadingTime || 0;
  
  // Calculate total video time including engagement factors
  const videoTime = videoAnalyses?.reduce((total, analysis) => {
    return total + calculateTotalVideoTime(analysis);
  }, 0) || 0;
  
  // Calculate interaction time based on content type and complexity
  const interactionTime = calculateInteractionTime(textTime, videoTime, contentType);
  
  const total = textTime + videoTime + interactionTime;
  
  return {
    text: textTime,
    video: videoTime,
    interaction: interactionTime,
    total
  };
}

/**
 * Calculates additional interaction time based on content type
 * 
 * Different types of educational content require different amounts
 * of processing and interaction time beyond reading and watching.
 * 
 * @param textTime - Time spent reading text content
 * @param videoTime - Time spent watching video content
 * @param contentType - Type of educational content
 * @returns Additional interaction time in seconds
 */
function calculateInteractionTime(
  textTime: number,
  videoTime: number,
  contentType?: string
): number {
  const totalContentTime = textTime + videoTime;
  
  // Interaction time multipliers by content type
  const interactionMultipliers = {
    'lesson': 0.15,      // 15% additional time for note-taking and reflection
    'chapter': 0.20,     // 20% additional time for comprehension and review
    'section': 0.10,     // 10% additional time for basic processing
    'quiz': 0.25,        // 25% additional time for thinking and answering
    'assessment': 0.30,  // 30% additional time for careful consideration
    'default': 0.15      // Default 15% for unknown content types
  };
  
  const multiplier = interactionMultipliers[contentType as keyof typeof interactionMultipliers] 
    || interactionMultipliers.default;
  
  // Calculate interaction time with reasonable bounds
  const interactionTime = totalContentTime * multiplier;
  
  // Cap interaction time to reasonable limits (max 10 minutes for most content)
  const maxInteractionTime = Math.min(totalContentTime * 0.5, 600);
  
  return Math.round(Math.min(interactionTime, maxInteractionTime));
}

/**
 * Determines overall content complexity from text and video analyses
 * 
 * @param textAnalysis - Text analysis results (optional)
 * @param videoAnalyses - Video analysis results array
 * @returns Overall complexity level
 */
function determineOverallComplexity(
  textAnalysis?: TextAnalysis,
  videoAnalyses?: VideoAnalysis[]
): 'simple' | 'moderate' | 'complex' {
  let complexityScore = 0;
  
  // Factor in text complexity
  if (textAnalysis) {
    switch (textAnalysis.complexity) {
      case 'simple': complexityScore += 1; break;
      case 'moderate': complexityScore += 2; break;
      case 'complex': complexityScore += 3; break;
    }
  }
  
  // Factor in video complexity (based on type and duration)
  if (videoAnalyses && videoAnalyses.length > 0) {
    const videoComplexityScore = videoAnalyses.reduce((score, analysis) => {
      switch (analysis.type) {
        case 'lecture': return score + 1;
        case 'demo': return score + 2;
        case 'interactive': return score + 3;
        default: return score + 1;
      }
    }, 0);
    
    complexityScore += videoComplexityScore / videoAnalyses.length;
  }
  
  // Multiple videos add complexity
  if (videoAnalyses && videoAnalyses.length > 2) {
    complexityScore += 1;
  }
  
  // Determine final complexity level
  if (complexityScore >= 4) return 'complex';
  if (complexityScore >= 2.5) return 'moderate';
  return 'simple';
}

/**
 * Calculates confidence level in the time estimate
 * 
 * @param textAnalysis - Text analysis results (optional)
 * @param videoAnalyses - Video analysis results array
 * @param content - Original content structure
 * @returns Confidence level (0-1)
 */
function calculateConfidenceLevel(
  textAnalysis?: TextAnalysis,
  videoAnalyses?: VideoAnalysis[],
  content?: MixedContent
): number {
  let confidence = 0.5; // Base confidence
  
  // Higher confidence if we have text analysis
  if (textAnalysis) {
    confidence += 0.2;
    // Higher confidence for longer text (more data points)
    if (textAnalysis.wordCount > 100) confidence += 0.1;
  }
  
  // Higher confidence if we have video duration data
  if (videoAnalyses && videoAnalyses.length > 0) {
    const hasExactDurations = videoAnalyses.every(analysis => !analysis.isDurationEstimated);
    if (hasExactDurations) {
      confidence += 0.2;
    } else {
      confidence += 0.1; // Some confidence for estimated durations
    }
  }
  
  // Higher confidence for well-structured content
  if (content?.title && content.contentType) {
    confidence += 0.1;
  }
  
  // Cap confidence at 0.95 (never 100% certain)
  return Math.min(confidence, 0.95);
}

/**
 * Generates learning recommendations based on content analysis
 * 
 * @param totalTime - Total estimated learning time in seconds
 * @param complexity - Overall content complexity
 * @param contentType - Type of educational content
 * @returns Learning recommendations for optimal engagement
 */
function generateLearningRecommendations(
  totalTime: number,
  complexity: 'simple' | 'moderate' | 'complex',
  contentType?: string
): ContentAnalysis['learningRecommendations'] {
  const totalMinutes = totalTime / 60;
  
  // Calculate suggested breaks based on content length and complexity
  let suggestedBreaks = 0;
  if (totalMinutes > 15) suggestedBreaks = 1;
  if (totalMinutes > 30) suggestedBreaks = 2;
  if (totalMinutes > 45) suggestedBreaks = 3;
  
  // Adjust for complexity
  if (complexity === 'complex') suggestedBreaks += 1;
  if (complexity === 'simple' && suggestedBreaks > 0) suggestedBreaks -= 1;
  
  // Calculate estimated sessions
  let estimatedSessions = 1;
  if (totalMinutes > 20) estimatedSessions = Math.ceil(totalMinutes / 20);
  if (complexity === 'complex') estimatedSessions = Math.ceil(totalMinutes / 15);
  
  // Determine recommended pace
  let recommendedPace: 'fast' | 'moderate' | 'slow' = 'moderate';
  if (complexity === 'simple' && totalMinutes < 15) recommendedPace = 'fast';
  if (complexity === 'complex' || contentType === 'assessment') recommendedPace = 'slow';
  
  return {
    suggestedBreaks: Math.max(0, suggestedBreaks),
    estimatedSessions: Math.max(1, estimatedSessions),
    recommendedPace
  };
}

/**
 * Validates mixed content structure for analysis
 * 
 * @param content - Mixed content to validate
 * @returns True if content is valid for analysis
 */
export function isValidMixedContent(content: MixedContent): boolean {
  if (!content || typeof content !== 'object') return false;
  
  // Must have either text or video content
  const hasValidText = !!(content.text && isValidTextContent(content.text));
  const hasValidVideos = !!(content.videos && content.videos.length > 0 
    && content.videos.some(isValidVideoMetadata));
  
  return hasValidText || hasValidVideos;
}
