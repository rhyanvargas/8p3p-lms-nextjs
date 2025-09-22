# Development Standards & Best Practices

## Next.js 15+ Compliance (Highest Priority)

### Server Components First Rule
- **DEFAULT**: Always start with Server Components (no "use client")
- **ONLY add "use client"** when you need:
  - State management (useState, useReducer)
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage, window)
  - React hooks that require client-side execution

### Route Parameters Handling
- **Server Components**: Use `await params` directly
- **Client Components**: Use `useParams` hook from `@/hooks/use-params`
- **NEVER**: Use manual Promise unwrapping with `use()` in components

### Code Quality Standards
- **MUST**: Run `npm run lint` before suggesting code
- **MUST**: Follow ESLint rules in `eslint.config.mjs`
- **MUST**: Use TypeScript strict mode
- **MUST**: Remove unused imports and variables
- **MUST**: Pass all quality gates before declaring features complete (see `specs/00-specification-framework.md#quality-gates`)

### Quality Gate Compliance
Before any feature, component, or phase can be marked as "complete":
1. **ESLint**: `npm run lint` passes with 0 errors
2. **TypeScript**: `npm run type-check` passes for production code
3. **Build**: `npm run build` succeeds without errors
4. **Functionality**: Core use cases work as specified
5. **Documentation**: README and code docs updated

**Reference**: See `specs/00-specification-framework.md` for complete quality gate requirements.

### Branch Readiness Protocol (MANDATORY)
Before starting any new feature development:
1. **Present Branch Readiness Plan**: Show feature spec, branch strategy, and timeline
2. **Get User Confirmation**: Ask "Ready to create the branch and start {feature_name} development? 🚀"
3. **Wait for Approval**: Do NOT create branches or start development without explicit user confirmation
4. **Document Decision**: Record user approval and proceed with branch creation

**Reference**: See `specs/00-specification-framework.md#branch-readiness-protocol` for complete protocol.

## ESLint & TypeScript Rules

### Core Principles
1. **Code Consistency**: Maintain consistent coding style across projects
2. **Type Safety**: Leverage TypeScript's type system for better code quality
3. **Performance**: Follow best practices for React and Next.js performance
4. **Maintainability**: Write clean, self-documenting code

### Key ESLint Rules
- `@next/next/no-async-client-component`: Prevents async Client Components
- `@typescript-eslint/no-unused-vars`: Prevents unused variables (prefix with `_`)
- `@typescript-eslint/no-explicit-any`: Warns about `any` type usage
- `react-hooks/exhaustive-deps`: Warns about missing hook dependencies

### Variable Naming Conventions
- Use descriptive variable names
- Prefix unused variables with underscore (`_`)
- Use camelCase for variables and functions
- Use PascalCase for components and types

## Clean Code & Developer Experience (DX)

### Comment Standards for Better DX
- **MUST**: Add comprehensive comments for better developer experience
- **MUST**: Document complex business logic and "why" decisions
- **MUST**: Include JSDoc headers for all public functions and components
- **MUST**: Explain edge cases and error handling approaches

### Function Documentation Pattern
```typescript
/**
 * Calculates estimated completion time for learning content
 * 
 * Uses industry-standard reading speeds (225 WPM) and actual video duration
 * to provide accurate time estimates for user planning and progress tracking.
 * 
 * @param content - Content analysis data (word count, video duration, etc.)
 * @param userProfile - User's historical learning data for personalization
 * @returns Time estimate object with breakdown and confidence level
 * 
 * @example
 * const estimate = calculateEstimatedTime(
 *   { wordCount: 500, videoDuration: 300, complexity: 'medium' },
 *   { readingSpeed: 250, completionRate: 0.85 }
 * );
 * // Returns: { total: 8, reading: 2, video: 5, interaction: 1, confidence: 0.9 }
 */
export function calculateEstimatedTime(
  content: ContentAnalysis,
  userProfile: UserProfile
): TimeEstimate {
  // Use personalized reading speed or fall back to industry average
  // Research shows 225 WPM is optimal for technical content comprehension
  const readingSpeed = userProfile.readingSpeed || 225;
  
  // Calculate base reading time in minutes
  const readingTime = content.wordCount / readingSpeed;
  
  // Video time is exact - no estimation needed
  const videoTime = content.videoDuration / 60;
  
  // Add interaction buffer based on content complexity
  // Complex content requires 20-30% additional time for processing
  const complexityMultiplier = {
    low: 1.1,    // 10% buffer for simple content
    medium: 1.2, // 20% buffer for moderate complexity
    high: 1.3    // 30% buffer for complex concepts
  };
  
  const interactionTime = (readingTime + videoTime) * 
    (complexityMultiplier[content.complexity] - 1);
  
  return {
    reading: Math.round(readingTime),
    video: Math.round(videoTime),
    interaction: Math.round(interactionTime),
    total: Math.round(readingTime + videoTime + interactionTime),
    confidence: calculateConfidence(content, userProfile)
  };
}
```

### Component Documentation Pattern
```typescript
/**
 * Reusable timer component for tracking user interactions with time limits
 * 
 * Supports multiple variants (countdown, stopwatch, progress) and integrates
 * with quiz systems, AI interactions, and content consumption tracking.
 * 
 * @param duration - Timer duration in seconds
 * @param onComplete - Callback fired when timer reaches zero or target
 * @param onTick - Optional callback fired every second with remaining time
 * @param variant - Visual and behavioral variant
 * @param autoStart - Whether to start timer immediately on mount
 * 
 * @example
 * // Quiz timer with 4-minute limit
 * <Timer 
 *   duration={240} 
 *   onComplete={handleQuizSubmit}
 *   variant="countdown"
 *   autoStart={true}
 * />
 * 
 * @example
 * // Content consumption tracking
 * <Timer 
 *   duration={0}
 *   onTick={trackProgress}
 *   variant="stopwatch"
 *   autoStart={true}
 * />
 */
export function Timer({ 
  duration, 
  onComplete, 
  onTick,
  variant = 'countdown',
  autoStart = false 
}: TimerProps) {
  // Track current time state with 1-second precision
  const [currentTime, setCurrentTime] = useState(
    variant === 'countdown' ? duration : 0
  );
  
  // Handle timer completion for all variants
  useEffect(() => {
    const isComplete = variant === 'countdown' 
      ? currentTime <= 0 
      : currentTime >= duration;
      
    if (isComplete && onComplete) {
      // Prevent multiple completion calls
      onComplete();
    }
  }, [currentTime, onComplete, variant, duration]);
  
  return (
    <div className="timer-container" role="timer" aria-live="polite">
      {/* Accessible time display with proper ARIA labels */}
      <TimeDisplay 
        time={currentTime}
        variant={variant}
        aria-label={`${variant} timer: ${formatTime(currentTime)}`}
      />
    </div>
  );
}
```

### Business Logic Comments
```typescript
// BUSINESS RULE: Users must complete video + all sections before quiz unlock
// This ensures proper learning progression and prevents quiz attempts
// without consuming the prerequisite content
const isQuizUnlocked = (chapter: Chapter): boolean => {
  // Video completion is optional for chapters (some are text-only)
  const videoComplete = !chapter.videoUrl || chapter.videoCompleted;
  
  // All sections must be completed (this is mandatory)
  const allSectionsComplete = chapter.sections.every(
    section => section.completed
  );
  
  return videoComplete && allSectionsComplete;
};

// PERFORMANCE NOTE: This calculation runs on every render
// Consider memoizing if chapter data is large or changes frequently
const chapterProgress = useMemo(() => {
  return calculateChapterProgress(chapter);
}, [chapter.sections, chapter.videoCompleted, chapter.quizPassed]);
```

### Error Handling Comments
```typescript
try {
  const userSession = await fetchAuthSession();
  return userSession.tokens?.accessToken;
} catch (error) {
  // EDGE CASE: Session might be expired or invalid
  // Don't throw here - let components handle unauthenticated state gracefully
  // This prevents auth errors from breaking the entire app
  console.warn('Auth session fetch failed:', error);
  return null;
}
```

### TODO Comments with Context
```typescript
// TODO: Implement adaptive time limits based on user performance
// Ticket: LMS-234 | Priority: Medium | Timeline: Sprint 3
// Context: Users with higher completion rates could get extended time
// Research: 15% of users request more time on complex assessments
const getQuizTimeLimit = (quiz: Quiz, user: User): number => {
  return quiz.defaultTimeLimit; // Currently using static time limits
};
```

## Clarifying Questions Protocol

### Requirements Gathering Process
1. **ALWAYS** ask clarifying questions before implementation
2. **NEVER** assume requirements without explicit confirmation
3. **DOCUMENT** all assumptions and decisions in specification files
4. **VALIDATE** understanding through detailed confirmation

### Question Categories
- **Technical Architecture**: Data structure, component design, integration approach
- **User Experience**: Interaction flows, edge cases, error handling
- **Business Logic**: Rules, validation, constraints, performance requirements
- **Implementation**: Technology choices, testing strategy, deployment approach

### MoSCoW Prioritization
- **Must Have**: Critical for MVP functionality
- **Should Have**: Important but not blocking
- **Could Have**: Nice-to-have features
- **Won't Have**: Out of scope for current iteration

### Specification Documentation
- **Project Specification**: High-level architecture and milestones (see `specs/06-project-specification.md`)
- **Feature Specifications**: Detailed feature requirements (see `specs/features/`)
- **Decision Log**: Document all major decisions and rationale
- **Safe Rollback Points**: Maintain checkpoints for safe rollback

## File Organization & Architecture

### Separation of Concerns (SoC)
- **Data Layer**: `src/lib/*-data.ts` - Pure data only
- **Business Logic**: `src/lib/*-utils.ts` - Functions and calculations
- **Components**: UI logic only

### File Path Requirements
1. **ALWAYS** mention which file path the user needs to paste code in
2. **IF** code spans multiple files, divide snippets and mention each file path
3. **IF** file doesn't exist, provide steps to generate the files
4. **COMMENT** every piece of code that improves code quality

### Data Organization
- **Centralized Location**: `src/lib/mock-data.ts` - keeps all mock data in one place
- **Typed Data**: Export with proper TypeScript interfaces
- **Organized by Feature**: Group related data together
- **Easy to Replace**: When ready for real APIs, just change the import

## Component Development

### Component Structure
- Use Server Components by default
- Only use Client Components when necessary (interactivity, browser APIs)
- Keep components focused on single responsibility
- Extract reusable logic into custom hooks

### Performance Best Practices
- Memoize expensive calculations with `useMemo`
- Memoize callbacks with `useCallback` when passed as props
- Use proper dependency arrays in hooks
- Avoid unnecessary re-renders

### Type Safety
- Avoid using `any` type
- Define proper interfaces and types
- Use type narrowing instead of type assertions
- Leverage TypeScript's utility types

## Testing Standards

### Jest Configuration (Next.js Official)

**Reference**: [Next.js Testing with Jest](https://nextjs.org/docs/app/guides/testing/jest.md)

Our testing setup follows Next.js official recommendations:

#### Required Dependencies
```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

#### Jest Configuration (`jest.config.mjs`)
```javascript
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
```

#### Jest Setup (`jest.setup.js`)
```javascript
import '@testing-library/jest-dom'
```

### Testing Best Practices

#### Component Testing
- **MUST**: Use React Testing Library for component tests
- **MUST**: Test user interactions, not implementation details
- **MUST**: Include accessibility testing (screen readers, keyboard navigation)
- **MUST**: Mock external dependencies and API calls

#### Test Structure
- **MUST**: Follow AAA pattern (Arrange, Act, Assert)
- **MUST**: Use descriptive test names that explain the expected behavior
- **MUST**: Group related tests using `describe` blocks
- **MUST**: Clean up after tests (unmount components, clear mocks)

#### Coverage Requirements
- **MINIMUM**: 80% coverage for new components and utilities
- **FOCUS**: Critical business logic and user interactions
- **EXCLUDE**: Configuration files, mock data, and type definitions

## Development Workflow

### Pre-commit Validation
```bash
npm run lint        # ESLint checking
npm run lint:fix    # Auto-fix issues
npm run lint:strict # Fail on warnings
npm run type-check  # TypeScript validation
npm run test        # Run Jest tests
npm run validate    # Lint + type check + tests
```

### Build Process
- Lint and type check before building
- Run tests before committing
- Use pre-commit hooks for quality assurance
- Follow consistent Node.js version (20+)
- Cache dependencies for faster builds

## Bug Resolution Protocol

### Mandatory User Confirmation
- **REQUIRED**: All bug/issue resolutions must be confirmed by the user
- **PROCESS**: Present solution → User tests → Explicit confirmation required
- **NEVER**: Mark issues as resolved without user verification
- **REFERENCE**: See `specs/05-bug-resolution-workflow.md` for complete process

### Resolution Documentation
- **MUST**: Create resolution ticket descriptions for all fixes
- **INCLUDE**: Root cause analysis, technical changes, verification steps
- **FORMAT**: Follow standard template in bug resolution workflow
- **PURPOSE**: Knowledge sharing and future reference

## Documentation Maintenance

### README.md Update Requirements
- **MANDATORY**: Update README.md for any changes that affect:
  - **Workflow changes**: Development process, CI/CD pipeline, build steps
  - **Architecture changes**: New patterns, component structure, data flow
  - **Feature additions**: New functionality, components, or capabilities
  - **Enhancement updates**: Performance improvements, UX changes, optimization
  - **DevOps changes**: Deployment process, environment setup, infrastructure
  - **Dependency changes**: New packages, version upgrades, tool changes
  - **Configuration changes**: Environment variables, build settings, auth setup

### Documentation Standards
- **IMMEDIATE**: Update README.md in the same PR/commit as the change
- **COMPREHENSIVE**: Include setup instructions, usage examples, troubleshooting
- **ACCURATE**: Verify all instructions work in clean environment
- **CURRENT**: Remove outdated information and broken links
- **ACCESSIBLE**: Use clear language and step-by-step instructions