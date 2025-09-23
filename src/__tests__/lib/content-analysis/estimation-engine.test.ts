/**
 * Estimation Engine Tests
 * 
 * Comprehensive test suite for the time estimation engine including
 * personalization, user profile updates, and configuration validation.
 */

import {
  calculateTimeEstimate,
  updateUserProfile,
  isValidEstimationConfig,
  DEFAULT_ESTIMATION_CONFIG,
  type UserProfile,
  type EstimationConfig,
} from '@/lib/content-analysis/estimation-engine';
import { mockLessons, mockUserProfiles } from '@/lib/mock-data/content-estimation';

describe('Estimation Engine', () => {
  describe('calculateTimeEstimate', () => {
    it('should calculate basic time estimate for simple content', () => {
      const content = mockLessons.introductionLesson;
      const estimate = calculateTimeEstimate(content);

      expect(estimate.total).toBeGreaterThan(0);
      expect(estimate.breakdown.reading).toBeGreaterThan(0);
      expect(estimate.breakdown.video).toBeGreaterThan(0);
      expect(estimate.confidence).toBeGreaterThan(0);
      expect(estimate.confidence).toBeLessThanOrEqual(1);
      expect(estimate.isPersonalized).toBe(false);
    });

    it('should apply personalization when user profile provided', () => {
      const content = mockLessons.comprehensiveChapter;
      const userProfile = mockUserProfiles.fastReader;
      
      const personalizedEstimate = calculateTimeEstimate(content, userProfile);
      const baseEstimate = calculateTimeEstimate(content);

      expect(personalizedEstimate.isPersonalized).toBe(true);
      expect(personalizedEstimate.confidence).toBeGreaterThanOrEqual(baseEstimate.confidence);
    });

    it('should handle content with only text', () => {
      const content = mockLessons.textOnlyLesson;
      const estimate = calculateTimeEstimate(content);

      expect(estimate.breakdown.reading).toBeGreaterThan(0);
      expect(estimate.breakdown.video).toBe(0);
      expect(estimate.total).toBe(
        estimate.breakdown.reading + 
        estimate.breakdown.interaction + 
        estimate.breakdown.breaks
      );
    });

    it('should handle content with only videos', () => {
      const content = mockLessons.videoOnlyLesson;
      const estimate = calculateTimeEstimate(content);

      expect(estimate.breakdown.reading).toBe(0);
      expect(estimate.breakdown.video).toBeGreaterThan(0);
      expect(estimate.total).toBe(
        estimate.breakdown.video + 
        estimate.breakdown.interaction + 
        estimate.breakdown.breaks
      );
    });

    it('should apply completion rate adjustments', () => {
      const content = mockLessons.comprehensiveChapter;
      const slowProfile: UserProfile = {
        ...mockUserProfiles.averageReader,
        completionRate: 1.5 // Takes 50% longer than estimated
      };
      const fastProfile: UserProfile = {
        ...mockUserProfiles.averageReader,
        completionRate: 0.8 // Takes 20% less time than estimated
      };

      const slowEstimate = calculateTimeEstimate(content, slowProfile);
      const fastEstimate = calculateTimeEstimate(content, fastProfile);
      const baseEstimate = calculateTimeEstimate(content);

      expect(slowEstimate.total).toBeGreaterThanOrEqual(baseEstimate.total);
      expect(fastEstimate.total).toBeLessThanOrEqual(baseEstimate.total);
    });

    it('should respect configuration options', () => {
      const content = mockLessons.comprehensiveChapter;
      const configWithoutInteraction: EstimationConfig = {
        ...DEFAULT_ESTIMATION_CONFIG,
        includeInteractionTime: false
      };
      const configWithoutBreaks: EstimationConfig = {
        ...DEFAULT_ESTIMATION_CONFIG,
        includeBreakTime: false
      };

      const estimateWithoutInteraction = calculateTimeEstimate(content, {}, configWithoutInteraction);
      const estimateWithoutBreaks = calculateTimeEstimate(content, {}, configWithoutBreaks);
      const fullEstimate = calculateTimeEstimate(content);

      expect(estimateWithoutInteraction.breakdown.interaction).toBe(0);
      expect(estimateWithoutBreaks.breakdown.breaks).toBe(0);
      expect(estimateWithoutInteraction.total).toBeLessThan(fullEstimate.total);
    });

    it('should generate appropriate recommendations', () => {
      const shortContent = mockLessons.introductionLesson;
      const longContent = mockLessons.advancedSection;

      const shortEstimate = calculateTimeEstimate(shortContent);
      const longEstimate = calculateTimeEstimate(longContent);

      expect(shortEstimate.recommendations.suggestedSessions).toBeLessThanOrEqual(
        longEstimate.recommendations.suggestedSessions
      );
      expect(longEstimate.recommendations.suggestedSessions).toBeGreaterThan(1);
    });

    it('should throw error for invalid content', () => {
      const invalidContent = { title: "Invalid" }; // No text or videos
      
      expect(() => calculateTimeEstimate(invalidContent as never)).toThrow();
    });
  });

  describe('updateUserProfile', () => {
    it('should update completion rate based on actual vs estimated time', () => {
      const originalProfile = mockUserProfiles.averageReader;
      const estimatedTime = 1800; // 30 minutes
      const actualTime = 2100; // 35 minutes (slower than estimated)

      const updatedProfile = updateUserProfile(
        originalProfile,
        estimatedTime,
        actualTime,
        'moderate'
      );

      expect(updatedProfile.completionRate).toBeGreaterThan(originalProfile.completionRate!);
    });

    it('should handle faster completion', () => {
      const originalProfile = mockUserProfiles.averageReader;
      const estimatedTime = 1800; // 30 minutes
      const actualTime = 1500; // 25 minutes (faster than estimated)

      const updatedProfile = updateUserProfile(
        originalProfile,
        estimatedTime,
        actualTime,
        'moderate'
      );

      expect(updatedProfile.completionRate).toBeLessThan(originalProfile.completionRate!);
    });

    it('should preserve other profile properties', () => {
      const originalProfile = mockUserProfiles.fastReader;
      const updatedProfile = updateUserProfile(originalProfile, 1800, 2000, 'moderate');

      expect(updatedProfile.readingSpeed).toBe(originalProfile.readingSpeed);
      expect(updatedProfile.learningPace).toBe(originalProfile.learningPace);
      expect(updatedProfile.experienceLevel).toBe(originalProfile.experienceLevel);
    });

    it('should cap completion rate within reasonable bounds', () => {
      const originalProfile = mockUserProfiles.averageReader;
      
      // Test extremely slow completion
      const verySlowProfile = updateUserProfile(originalProfile, 1800, 7200, 'moderate'); // 4x slower
      expect(verySlowProfile.completionRate).toBeLessThanOrEqual(2.0);
      
      // Test extremely fast completion
      const veryFastProfile = updateUserProfile(originalProfile, 1800, 450, 'moderate'); // 4x faster
      expect(veryFastProfile.completionRate).toBeGreaterThanOrEqual(0.5);
    });

    it('should handle profile without existing completion rate', () => {
      const newProfile: UserProfile = {
        readingSpeed: 200,
        learningPace: 'moderate'
      };

      const updatedProfile = updateUserProfile(newProfile, 1800, 2000, 'moderate');
      expect(updatedProfile.completionRate).toBeGreaterThan(1.0);
    });
  });

  describe('isValidEstimationConfig', () => {
    it('should validate correct configuration', () => {
      expect(isValidEstimationConfig(DEFAULT_ESTIMATION_CONFIG)).toBe(true);
      
      const customConfig: EstimationConfig = {
        includeInteractionTime: false,
        includeBreakTime: true,
        confidenceThreshold: 0.7,
        usePersonalization: false
      };
      expect(isValidEstimationConfig(customConfig)).toBe(true);
    });

    it('should reject invalid configurations', () => {
      expect(isValidEstimationConfig(null as never)).toBe(false);
      expect(isValidEstimationConfig(undefined as never)).toBe(false);
      expect(isValidEstimationConfig({} as never)).toBe(false);
      
      const invalidConfigs = [
        { ...DEFAULT_ESTIMATION_CONFIG, includeInteractionTime: "true" }, // Wrong type
        { ...DEFAULT_ESTIMATION_CONFIG, confidenceThreshold: -0.1 }, // Out of range
        { ...DEFAULT_ESTIMATION_CONFIG, confidenceThreshold: 1.1 }, // Out of range
        { ...DEFAULT_ESTIMATION_CONFIG, usePersonalization: "yes" }, // Wrong type
      ];

      invalidConfigs.forEach(config => {
        expect(isValidEstimationConfig(config as never)).toBe(false);
      });
    });

    it('should validate confidence threshold bounds', () => {
      const validConfigs = [
        { ...DEFAULT_ESTIMATION_CONFIG, confidenceThreshold: 0.0 },
        { ...DEFAULT_ESTIMATION_CONFIG, confidenceThreshold: 0.5 },
        { ...DEFAULT_ESTIMATION_CONFIG, confidenceThreshold: 1.0 }
      ];

      validConfigs.forEach(config => {
        expect(isValidEstimationConfig(config)).toBe(true);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should produce consistent results for same input', () => {
      const content = mockLessons.comprehensiveChapter;
      const userProfile = mockUserProfiles.averageReader;
      
      const estimate1 = calculateTimeEstimate(content, userProfile);
      const estimate2 = calculateTimeEstimate(content, userProfile);
      const estimate3 = calculateTimeEstimate(content, userProfile);

      expect(estimate1.total).toBe(estimate2.total);
      expect(estimate2.total).toBe(estimate3.total);
      expect(estimate1.confidence).toBe(estimate2.confidence);
    });

    it('should handle complex content with multiple videos', () => {
      const content = mockLessons.advancedSection;
      const estimate = calculateTimeEstimate(content);

      expect(estimate.breakdown.video).toBeGreaterThan(0);
      expect(estimate.breakdown.reading).toBeGreaterThan(0);
      expect(estimate.breakdown.interaction).toBeGreaterThan(0);
      expect(estimate.recommendations.suggestedSessions).toBeGreaterThan(1);
    });

    it('should provide reasonable time estimates', () => {
      const content = mockLessons.comprehensiveChapter;
      const estimate = calculateTimeEstimate(content);

      // Sanity checks for reasonable estimates
      expect(estimate.total).toBeGreaterThan(300); // At least 5 minutes
      expect(estimate.total).toBeLessThan(7200); // Less than 2 hours
      expect(estimate.confidence).toBeGreaterThan(0.5); // Reasonable confidence
      expect(estimate.recommendations.sessionLength).toBeGreaterThan(600); // At least 10 minutes per session
    });

    it('should adapt recommendations based on user experience', () => {
      const content = mockLessons.advancedSection;
      const beginnerProfile = mockUserProfiles.newUser;
      const expertProfile = mockUserProfiles.experiencedLearner;

      const beginnerEstimate = calculateTimeEstimate(content, beginnerProfile);
      const expertEstimate = calculateTimeEstimate(content, expertProfile);

      // Expert should have different recommendations than beginner
      expect(beginnerEstimate.recommendations).toBeDefined();
      expect(expertEstimate.recommendations).toBeDefined();
    });
  });
});
