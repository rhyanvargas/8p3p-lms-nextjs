/**
 * Text Analysis Engine for Content Estimation System
 * 
 * Analyzes text content to provide word count, reading time estimates,
 * and complexity assessment for accurate learning time predictions.
 * 
 * Uses industry-standard reading speeds and content complexity analysis
 * to provide reliable estimates for educational content.
 */

export interface TextAnalysis {
  /** Total word count in the content */
  wordCount: number;
  /** Estimated reading time in seconds */
  estimatedReadingTime: number;
  /** Content complexity level affecting reading speed */
  complexity: 'simple' | 'moderate' | 'complex';
  /** Character count including spaces */
  characterCount: number;
  /** Estimated reading time breakdown by complexity */
  readingTimeBreakdown: {
    baseTime: number;
    complexityAdjustment: number;
    totalTime: number;
  };
}

export interface ReadingSpeedConfig {
  /** Words per minute for different reading speeds */
  wordsPerMinute: {
    slow: number;
    average: number;
    fast: number;
  };
  /** Complexity multipliers affecting reading speed */
  complexityMultipliers: {
    simple: number;    // Faster reading for simple content
    moderate: number;  // Standard reading speed
    complex: number;   // Slower reading for complex content
  };
}

/**
 * Default reading speed configuration based on educational research
 * 
 * Research sources:
 * - Average adult reading speed: 200-250 WPM for comprehension
 * - Technical content: 150-200 WPM for retention
 * - Educational content: 175-225 WPM for learning
 */
export const DEFAULT_READING_CONFIG: ReadingSpeedConfig = {
  wordsPerMinute: {
    slow: 150,     // Careful, thorough reading
    average: 200,  // Standard educational content reading
    fast: 250      // Quick scanning/review reading
  },
  complexityMultipliers: {
    simple: 1.2,   // 20% faster for simple content
    moderate: 1.0, // Standard speed
    complex: 0.8   // 20% slower for complex content
  }
};

/**
 * Analyzes text content to extract word count, complexity, and reading time estimates
 * 
 * @param content - Raw text content to analyze
 * @param config - Reading speed configuration (optional, uses defaults)
 * @returns Comprehensive text analysis with reading time estimates
 * 
 * @example
 * const analysis = analyzeTextContent(
 *   "This is a sample educational content about EMDR therapy techniques...",
 *   DEFAULT_READING_CONFIG
 * );
 * // Returns: { wordCount: 12, estimatedReadingTime: 3.6, complexity: 'moderate', ... }
 */
export function analyzeTextContent(
  content: string,
  config: ReadingSpeedConfig = DEFAULT_READING_CONFIG
): TextAnalysis {
  // Clean and normalize the content for accurate analysis
  const cleanContent = content
    .replace(/\s+/g, ' ')           // Normalize whitespace
    .replace(/[^\w\s]/g, ' ')       // Remove special characters for word counting
    .trim();

  // Calculate basic metrics
  const wordCount = cleanContent.split(' ').filter(word => word.length > 0).length;
  const characterCount = content.length;

  // Determine content complexity based on various factors
  const complexity = determineContentComplexity(content, wordCount);

  // Calculate reading time with complexity adjustment
  const baseWordsPerMinute = config.wordsPerMinute.average;
  const complexityMultiplier = config.complexityMultipliers[complexity];
  const adjustedWordsPerMinute = baseWordsPerMinute * complexityMultiplier;

  // Calculate reading time in seconds
  const baseReadingTimeMinutes = wordCount / baseWordsPerMinute;
  const adjustedReadingTimeMinutes = wordCount / adjustedWordsPerMinute;
  const estimatedReadingTime = Math.round(adjustedReadingTimeMinutes * 60);

  // Create detailed breakdown for transparency
  const readingTimeBreakdown = {
    baseTime: Math.round(baseReadingTimeMinutes * 60),
    complexityAdjustment: Math.round((adjustedReadingTimeMinutes - baseReadingTimeMinutes) * 60),
    totalTime: estimatedReadingTime
  };

  return {
    wordCount,
    estimatedReadingTime,
    complexity,
    characterCount,
    readingTimeBreakdown
  };
}

/**
 * Determines content complexity based on multiple factors
 * 
 * Analyzes sentence length, vocabulary complexity, technical terms,
 * and formatting to assess reading difficulty.
 * 
 * @param content - Original content with formatting
 * @param wordCount - Pre-calculated word count
 * @returns Complexity level: simple, moderate, or complex
 */
function determineContentComplexity(content: string, wordCount: number): 'simple' | 'moderate' | 'complex' {
  let complexityScore = 0;

  // Factor 1: Average sentence length
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const averageWordsPerSentence = wordCount / sentences.length;
  
  if (averageWordsPerSentence > 20) complexityScore += 2;
  else if (averageWordsPerSentence > 15) complexityScore += 1;

  // Factor 2: Technical terminology (common in EMDR/therapy content)
  const technicalTerms = [
    'emdr', 'therapy', 'therapeutic', 'bilateral', 'stimulation', 'trauma',
    'processing', 'desensitization', 'reprocessing', 'cognitive', 'behavioral',
    'neurological', 'psychological', 'clinical', 'assessment', 'intervention'
  ];
  
  const technicalTermCount = technicalTerms.reduce((count, term) => {
    const regex = new RegExp(term, 'gi');
    return count + (content.match(regex) || []).length;
  }, 0);

  const technicalDensity = technicalTermCount / wordCount;
  if (technicalDensity > 0.05) complexityScore += 2;
  else if (technicalDensity > 0.02) complexityScore += 1;

  // Factor 3: Formatting complexity (lists, headings, code blocks)
  const hasComplexFormatting = /#{1,6}|```|\*\*|\*|1\.|•|-/.test(content);
  if (hasComplexFormatting) complexityScore += 1;

  // Factor 4: Long words (7+ characters indicate higher complexity)
  const words = content.split(/\s+/);
  const longWordCount = words.filter(word => word.length > 7).length;
  const longWordDensity = longWordCount / wordCount;
  
  if (longWordDensity > 0.3) complexityScore += 2;
  else if (longWordDensity > 0.2) complexityScore += 1;

  // Determine final complexity level
  if (complexityScore >= 5) return 'complex';
  if (complexityScore >= 2) return 'moderate';
  return 'simple';
}

/**
 * Estimates reading time for a specific user based on their reading speed
 * 
 * @param analysis - Text analysis results
 * @param userReadingSpeed - User's personal reading speed in WPM (optional)
 * @returns Personalized reading time estimate in seconds
 * 
 * @example
 * const personalizedTime = getPersonalizedReadingTime(analysis, 180);
 * // Returns reading time adjusted for user's 180 WPM reading speed
 */
export function getPersonalizedReadingTime(
  analysis: TextAnalysis,
  userReadingSpeed?: number
): number {
  if (!userReadingSpeed) {
    return analysis.estimatedReadingTime;
  }

  // Apply complexity multiplier to user's reading speed
  const complexityMultiplier = DEFAULT_READING_CONFIG.complexityMultipliers[analysis.complexity];
  const adjustedUserSpeed = userReadingSpeed * complexityMultiplier;
  
  // Calculate personalized reading time
  const readingTimeMinutes = analysis.wordCount / adjustedUserSpeed;
  return Math.round(readingTimeMinutes * 60);
}

/**
 * Validates text content for analysis
 * 
 * @param content - Content to validate
 * @returns True if content is valid for analysis
 */
export function isValidTextContent(content: string): boolean {
  if (!content || typeof content !== 'string') return false;
  if (content.trim().length === 0) return false;
  if (content.trim().split(' ').length < 5) return false; // Minimum 5 words
  return true;
}
