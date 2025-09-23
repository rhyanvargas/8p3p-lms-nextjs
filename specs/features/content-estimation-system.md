# Content Estimation System Specification

## Executive Summary

The Content Estimation System provides intelligent time estimation for learning content, enabling learners to plan their study sessions effectively. Building on the Phase 1 Timer System foundation, this feature analyzes content types (text, video, interactive elements) to provide accurate completion time estimates and real-time progress tracking.

## User Stories

### Must Have (Phase 2A)

**EST-001: Reading Time Estimation**
- **As a learner**, I want to see estimated reading time for text content
- **So that** I can plan my study sessions appropriately
- **Acceptance Criteria**:
  - Display reading time estimates for course content
  - Account for different reading speeds (slow, average, fast)
  - Show estimates in human-readable format (e.g., "5 min read")

**EST-002: Video Duration Integration**
- **As a learner**, I want to see total time including video content
- **So that** I understand the full time commitment for mixed content
- **Acceptance Criteria**:
  - Parse video duration from content metadata
  - Combine text reading time + video duration
  - Display total estimated time for lessons with mixed content

**EST-003: Progress Tracking**
- **As a learner**, I want to see my progress through content in real-time
- **So that** I can track my completion and remaining time
- **Acceptance Criteria**:
  - Show progress percentage for current content
  - Display remaining time based on current progress
  - Update estimates dynamically as user progresses

**EST-004: Content Hierarchy Estimates**
- **As a learner**, I want to see time estimates at chapter and course levels
- **So that** I can plan my learning schedule
- **Acceptance Criteria**:
  - Aggregate time estimates for chapters
  - Show total course completion time
  - Display estimates in course navigation

### Should Have (Future Phases)

**EST-005: Personalized Estimates**
- **As a learner**, I want estimates based on my actual reading speed
- **So that** predictions become more accurate over time

**EST-006: Historical Learning Data**
- **As a learner**, I want to see how my actual time compares to estimates
- **So that** I can better understand my learning patterns

## Technical Requirements

### Core Components

#### 1. Content Analysis Engine
```typescript
interface ContentAnalyzer {
  analyzeTextContent(content: string): TextAnalysis;
  analyzeVideoContent(metadata: VideoMetadata): VideoAnalysis;
  analyzeMixedContent(content: MixedContent): ContentAnalysis;
}

interface TextAnalysis {
  wordCount: number;
  estimatedReadingTime: number; // in seconds
  complexity: 'simple' | 'moderate' | 'complex';
}

interface VideoAnalysis {
  duration: number; // in seconds
  type: 'lecture' | 'demo' | 'interactive';
}

interface ContentAnalysis {
  totalEstimatedTime: number;
  breakdown: {
    text: number;
    video: number;
    interactive: number;
  };
  confidence: number; // 0-1 scale
}
```

#### 2. Estimation Algorithms
```typescript
interface EstimationConfig {
  readingSpeed: {
    slow: number;    // words per minute
    average: number;
    fast: number;
  };
  complexityMultipliers: {
    simple: number;
    moderate: number;
    complex: number;
  };
}

interface EstimationEngine {
  calculateReadingTime(wordCount: number, complexity: string, userSpeed?: number): number;
  calculateTotalTime(analysis: ContentAnalysis): number;
  updateEstimate(progress: number, elapsed: number, originalEstimate: number): number;
}
```

#### 3. Progress Tracking
```typescript
interface ProgressTracker {
  startTracking(contentId: string, estimatedTime: number): void;
  updateProgress(contentId: string, progress: number): void;
  getProgress(contentId: string): ProgressData;
  completeContent(contentId: string, actualTime: number): void;
}

interface ProgressData {
  contentId: string;
  startTime: Date;
  currentProgress: number; // 0-100
  estimatedTime: number;
  elapsedTime: number;
  remainingTime: number;
  isCompleted: boolean;
}
```

#### 4. UI Components
```typescript
// Time estimate display component
interface TimeEstimateProps {
  estimatedTime: number;
  variant: 'compact' | 'detailed' | 'card';
  showBreakdown?: boolean;
  className?: string;
}

// Progress indicator component
interface ProgressIndicatorProps {
  progress: number;
  estimatedTime: number;
  elapsedTime: number;
  variant: 'linear' | 'circular' | 'minimal';
  showTimeRemaining?: boolean;
}

// Content estimator wrapper
interface ContentEstimatorProps {
  content: string | MixedContent;
  onEstimateReady: (estimate: ContentAnalysis) => void;
  trackProgress?: boolean;
  userPreferences?: EstimationConfig;
}
```

### Integration Points

#### 1. Timer System Integration
- Leverage existing `useTimer` hook for progress tracking
- Reuse `formatTime` utilities for time display
- Integrate with `TimerDisplay` components for consistent UI

#### 2. Content Management
- Parse content from course data structure
- Extract video metadata from embedded content
- Handle different content formats (markdown, HTML, structured data)

#### 3. User Preferences
- Store reading speed preferences
- Track historical accuracy for personalization
- Provide settings for estimation preferences

## Implementation Plan

### Phase 2A Sprint 1: Content Analysis Foundation (Week 1)
1. **Content Analysis Engine**
   - Text analysis utilities (word count, complexity detection)
   - Video metadata parsing
   - Mixed content analysis

2. **Estimation Algorithms**
   - Reading speed calculations
   - Time estimation formulas
   - Dynamic estimate updates

3. **Core Utilities**
   - Content parsing functions
   - Estimation configuration management
   - Integration with existing timer utilities

### Phase 2A Sprint 2: UI Components & Integration (Week 2)
1. **UI Components**
   - `TimeEstimate` display component
   - `ProgressIndicator` component
   - `ContentEstimator` wrapper component

2. **Progress Tracking**
   - `ProgressTracker` implementation
   - Integration with `useTimer` hook
   - Real-time progress updates

3. **Testing & Documentation**
   - Comprehensive unit tests
   - Integration tests with timer system
   - Component documentation and examples

## File Structure

```
src/
├── lib/
│   ├── content-analysis/
│   │   ├── text-analyzer.ts
│   │   ├── video-analyzer.ts
│   │   ├── content-parser.ts
│   │   └── estimation-engine.ts
│   ├── progress/
│   │   ├── progress-tracker.ts
│   │   └── progress-storage.ts
│   └── utils/
│       └── content-estimation.ts
├── components/
│   └── common/
│       ├── content-estimation/
│       │   ├── TimeEstimate.tsx
│       │   ├── ProgressIndicator.tsx
│       │   ├── ContentEstimator.tsx
│       │   └── EstimationSettings.tsx
│       └── progress/
│           ├── ProgressTracker.tsx
│           └── ProgressDisplay.tsx
├── hooks/
│   ├── useContentEstimation.ts
│   ├── useProgressTracking.ts
│   └── useEstimationSettings.ts
└── __tests__/
    ├── lib/
    │   ├── content-analysis/
    │   └── progress/
    ├── components/
    │   ├── content-estimation/
    │   └── progress/
    └── hooks/
```

## Success Criteria

### Functional Requirements
- [ ] Accurate reading time estimates (±20% of actual time)
- [ ] Video duration integration working correctly
- [ ] Real-time progress tracking functional
- [ ] Content hierarchy estimates displaying properly

### Technical Requirements
- [ ] 100% test coverage for estimation algorithms
- [ ] Integration tests with existing timer system
- [ ] TypeScript strict mode compliance
- [ ] Performance: estimates calculated in <100ms

### User Experience
- [ ] Intuitive time estimate displays
- [ ] Smooth progress tracking without lag
- [ ] Consistent UI with existing timer components
- [ ] Accessible components (WCAG compliance)

### Quality Gates
- [ ] ESLint: 0 errors, 0 warnings
- [ ] TypeScript: 0 errors
- [ ] Tests: 100% pass rate
- [ ] Build: Production build successful
- [ ] Documentation: Complete API docs and examples

## Dependencies

### Internal Dependencies
- Phase 1 Timer System (useTimer, formatTime, TimerDisplay)
- Existing UI components (Button, Progress, etc.)
- Mock data structure for content

### External Dependencies
- No new external dependencies required
- Leverage existing React, TypeScript, Jest setup

## Risk Assessment

### Technical Risks
- **Content parsing complexity**: Mitigated by starting with simple text analysis
- **Performance with large content**: Mitigated by lazy loading and chunked analysis
- **Timer integration complexity**: Mitigated by leveraging proven Phase 1 patterns

### User Experience Risks
- **Estimate accuracy**: Mitigated by conservative estimates and user feedback
- **UI consistency**: Mitigated by reusing existing design patterns
- **Performance perception**: Mitigated by instant UI feedback while calculating

## Future Enhancements (Phase 3+)

### Personalization
- Machine learning for reading speed adaptation
- Content difficulty assessment
- Historical accuracy tracking

### Advanced Features
- Interactive content time estimation
- Break recommendations for long content
- Study session planning tools

### Analytics
- Learning pattern insights
- Content engagement metrics
- Estimation accuracy reporting

---

**Next Steps**: Begin implementation with content analysis engine and basic time estimation algorithms.
