/**
 * Text Analyzer Tests
 * 
 * Comprehensive test suite for text analysis functionality including
 * word count, reading time estimation, and complexity assessment.
 * 
 * Tests cover edge cases, performance, and accuracy requirements.
 */

import {
  analyzeTextContent,
  getPersonalizedReadingTime,
  isValidTextContent,
  DEFAULT_READING_CONFIG,
  type TextAnalysis,
  type ReadingSpeedConfig
} from '@/lib/content-analysis/text-analyzer';

describe('Text Analyzer', () => {
  describe('analyzeTextContent', () => {
    it('should analyze simple text content correctly', () => {
      const content = "This is a simple test with exactly ten words here.";
      const analysis = analyzeTextContent(content);

      expect(analysis.wordCount).toBe(10);
      expect(analysis.complexity).toBe('simple');
      expect(analysis.estimatedReadingTime).toBeGreaterThan(0);
      expect(analysis.characterCount).toBe(content.length);
      expect(analysis.readingTimeBreakdown.totalTime).toBe(analysis.estimatedReadingTime);
    });

    it('should handle moderate complexity content', () => {
      const content = `
        Eye Movement Desensitization and Reprocessing (EMDR) is an integrative 
        psychotherapy approach that has been extensively researched and proven 
        effective for the treatment of trauma. The therapeutic process involves 
        bilateral stimulation techniques that facilitate memory processing and 
        integration within existing cognitive frameworks.
      `;
      
      const analysis = analyzeTextContent(content);

      expect(analysis.wordCount).toBeGreaterThan(30);
      expect(['moderate', 'complex']).toContain(analysis.complexity);
      expect(analysis.estimatedReadingTime).toBeGreaterThan(10);
    });

    it('should identify complex content with technical terms', () => {
      const content = `
        The neurobiological mechanisms underlying EMDR therapy involve complex 
        interactions between limbic system, prefrontal cortex, and hippocampus. 
        Bilateral stimulation facilitates interhemispheric communication and 
        promotes integration of traumatic memories within cognitive schemas. 
        Contemporary neuroimaging research utilizing fMRI and EEG demonstrates 
        measurable changes in brain activation patterns following therapeutic 
        intervention. The Adaptive Information Processing model posits that 
        psychological health requires systematic desensitization and reprocessing 
        of maladaptively stored traumatic experiences through comprehensive 
        eight-phase protocol implementation.
      `;
      
      const analysis = analyzeTextContent(content);

      expect(analysis.complexity).toBe('complex');
      expect(analysis.estimatedReadingTime).toBeGreaterThan(20);
    });

    it('should use custom reading speed configuration', () => {
      const content = "Test content with twenty words to verify custom configuration settings work properly and accurately.";
      const customConfig: ReadingSpeedConfig = {
        wordsPerMinute: {
          slow: 100,
          average: 150,
          fast: 200
        },
        complexityMultipliers: {
          simple: 1.0,
          moderate: 0.9,
          complex: 0.8
        }
      };

      const analysis = analyzeTextContent(content, customConfig);
      const defaultAnalysis = analyzeTextContent(content);

      expect(analysis.wordCount).toBe(defaultAnalysis.wordCount);
      expect(analysis.estimatedReadingTime).not.toBe(defaultAnalysis.estimatedReadingTime);
    });

    it('should handle empty or invalid content gracefully', () => {
      expect(() => analyzeTextContent("")).not.toThrow();
      expect(() => analyzeTextContent("   ")).not.toThrow();
      
      const emptyAnalysis = analyzeTextContent("");
      expect(emptyAnalysis.wordCount).toBe(0);
      expect(emptyAnalysis.estimatedReadingTime).toBe(0);
    });

    it('should normalize whitespace correctly', () => {
      const content1 = "Word1    Word2\n\nWord3\tWord4     Word5";
      const content2 = "Word1 Word2 Word3 Word4 Word5";
      
      const analysis1 = analyzeTextContent(content1);
      const analysis2 = analyzeTextContent(content2);

      expect(analysis1.wordCount).toBe(analysis2.wordCount);
      expect(analysis1.wordCount).toBe(5);
    });

    it('should provide accurate reading time breakdown', () => {
      const content = "This is test content for reading time breakdown verification purposes.";
      const analysis = analyzeTextContent(content);

      expect(analysis.readingTimeBreakdown.baseTime).toBeGreaterThan(0);
      expect(analysis.readingTimeBreakdown.totalTime).toBe(analysis.estimatedReadingTime);
      expect(typeof analysis.readingTimeBreakdown.complexityAdjustment).toBe('number');
    });
  });

  describe('getPersonalizedReadingTime', () => {
    it('should return original time when no user speed provided', () => {
      const analysis: TextAnalysis = {
        wordCount: 100,
        estimatedReadingTime: 30,
        complexity: 'moderate',
        characterCount: 500,
        readingTimeBreakdown: {
          baseTime: 30,
          complexityAdjustment: 0,
          totalTime: 30
        }
      };

      const personalizedTime = getPersonalizedReadingTime(analysis);
      expect(personalizedTime).toBe(30);
    });

    it('should adjust time for faster readers', () => {
      const analysis: TextAnalysis = {
        wordCount: 200,
        estimatedReadingTime: 60,
        complexity: 'moderate',
        characterCount: 1000,
        readingTimeBreakdown: {
          baseTime: 60,
          complexityAdjustment: 0,
          totalTime: 60
        }
      };

      const personalizedTime = getPersonalizedReadingTime(analysis, 300); // Fast reader
      expect(personalizedTime).toBeLessThan(60);
    });

    it('should adjust time for slower readers', () => {
      const analysis: TextAnalysis = {
        wordCount: 200,
        estimatedReadingTime: 60,
        complexity: 'moderate',
        characterCount: 1000,
        readingTimeBreakdown: {
          baseTime: 60,
          complexityAdjustment: 0,
          totalTime: 60
        }
      };

      const personalizedTime = getPersonalizedReadingTime(analysis, 100); // Slow reader
      expect(personalizedTime).toBeGreaterThan(60);
    });

    it('should apply complexity multipliers to personalized speed', () => {
      const simpleAnalysis: TextAnalysis = {
        wordCount: 100,
        estimatedReadingTime: 30,
        complexity: 'simple',
        characterCount: 500,
        readingTimeBreakdown: { baseTime: 30, complexityAdjustment: 0, totalTime: 30 }
      };

      const complexAnalysis: TextAnalysis = {
        wordCount: 100,
        estimatedReadingTime: 30,
        complexity: 'complex',
        characterCount: 500,
        readingTimeBreakdown: { baseTime: 30, complexityAdjustment: 0, totalTime: 30 }
      };

      const simpleTime = getPersonalizedReadingTime(simpleAnalysis, 200);
      const complexTime = getPersonalizedReadingTime(complexAnalysis, 200);

      expect(simpleTime).toBeLessThan(complexTime);
    });
  });

  describe('isValidTextContent', () => {
    it('should validate correct text content', () => {
      expect(isValidTextContent("This is valid content with enough words.")).toBe(true);
      expect(isValidTextContent("Valid content here with five words.")).toBe(true);
    });

    it('should reject invalid content', () => {
      expect(isValidTextContent("")).toBe(false);
      expect(isValidTextContent("   ")).toBe(false);
      expect(isValidTextContent("Too few")).toBe(false); // Less than 5 words
      expect(isValidTextContent(null as never)).toBe(false);
      expect(isValidTextContent(undefined as never)).toBe(false);
      expect(isValidTextContent(123 as never)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidTextContent("One two three four five")).toBe(true); // Exactly 5 words
      expect(isValidTextContent("One two three four")).toBe(false); // Less than 5 words
    });
  });

  describe('DEFAULT_READING_CONFIG', () => {
    it('should have reasonable default values', () => {
      expect(DEFAULT_READING_CONFIG.wordsPerMinute.slow).toBe(150);
      expect(DEFAULT_READING_CONFIG.wordsPerMinute.average).toBe(200);
      expect(DEFAULT_READING_CONFIG.wordsPerMinute.fast).toBe(250);
      
      expect(DEFAULT_READING_CONFIG.complexityMultipliers.simple).toBe(1.2);
      expect(DEFAULT_READING_CONFIG.complexityMultipliers.moderate).toBe(1.0);
      expect(DEFAULT_READING_CONFIG.complexityMultipliers.complex).toBe(0.8);
    });

    it('should maintain logical relationships', () => {
      const { wordsPerMinute, complexityMultipliers } = DEFAULT_READING_CONFIG;
      
      expect(wordsPerMinute.fast).toBeGreaterThan(wordsPerMinute.average);
      expect(wordsPerMinute.average).toBeGreaterThan(wordsPerMinute.slow);
      
      expect(complexityMultipliers.simple).toBeGreaterThan(complexityMultipliers.moderate);
      expect(complexityMultipliers.moderate).toBeGreaterThan(complexityMultipliers.complex);
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle very long content efficiently', () => {
      const longContent = "Word ".repeat(10000); // 10,000 words
      const startTime = Date.now();
      
      const analysis = analyzeTextContent(longContent);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
      expect(analysis.wordCount).toBe(10000);
    });

    it('should handle special characters and formatting', () => {
      const content = "Test content with special chars: @#$%^&*()! And numbers: 123 456.";
      const analysis = analyzeTextContent(content);
      
      expect(analysis.wordCount).toBeGreaterThan(0);
      expect(analysis.estimatedReadingTime).toBeGreaterThan(0);
    });

    it('should be consistent across multiple runs', () => {
      const content = "Consistent test content for multiple analysis runs.";
      
      const analysis1 = analyzeTextContent(content);
      const analysis2 = analyzeTextContent(content);
      const analysis3 = analyzeTextContent(content);
      
      expect(analysis1.wordCount).toBe(analysis2.wordCount);
      expect(analysis2.wordCount).toBe(analysis3.wordCount);
      expect(analysis1.estimatedReadingTime).toBe(analysis2.estimatedReadingTime);
      expect(analysis2.estimatedReadingTime).toBe(analysis3.estimatedReadingTime);
    });
  });
});
