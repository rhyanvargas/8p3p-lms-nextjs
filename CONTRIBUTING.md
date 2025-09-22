# Contributing to 8P3P LMS

Welcome to the 8P3P Learning Management System! This guide will help you contribute effectively to our codebase while maintaining high quality standards and smooth collaboration.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- Git knowledge
- Familiarity with Next.js 15, React 19, and TypeScript

### Setup
```bash
git clone https://github.com/your-org/8p3p-lms-nextjs.git
cd 8p3p-lms-nextjs
npm install
npx ampx sandbox  # Start AWS Amplify backend
npm run dev       # Start development server
```

## 📋 Development Process

### 1. Understanding Our Workflow

We follow a **sprint-based development cycle** with **stacked PRs** for complex features:

```
Sprint Planning → Feature Development → Code Review → Testing → Release
```

**Branch Strategy**:
```
main (production) ← release/v1.2.0 ← dev ← feature/your-feature
```

### 2. Before You Start

#### Read the Specifications
- **Project Overview**: [`specs/06-project-specification.md`](specs/06-project-specification.md)
- **Development Standards**: [`specs/01-development-standards.md`](specs/01-development-standards.md)
- **Feature Specs**: [`specs/features/`](specs/features/) for specific features
- **Release Strategy**: [`specs/07-release-strategy.md`](specs/07-release-strategy.md)

#### Check Current Sprint
- Review active sprint goals and priorities
- Check for existing work on similar features
- Coordinate with team to avoid conflicts

## 🔧 Development Standards

### Code Quality Requirements

#### Next.js 15+ Compliance
- **Server Components First**: Default choice for better performance
- **Client Components Only When Needed**: State, events, browser APIs
- **Route Parameters**: 
  - Server Components: `const { id } = await params`
  - Client Components: Use `useParams` hook from `@/hooks/use-params`

#### TypeScript Standards
- **Strict Mode**: All code must pass TypeScript strict checks
- **Proper Interfaces**: Define clear interfaces for all data structures
- **No `any` Types**: Use proper typing or `unknown` with type guards
- **Unused Variables**: Prefix with underscore (`_`) if intentionally unused

#### Code Comments & Documentation
```typescript
/**
 * Calculates estimated completion time for learning content
 * 
 * Uses industry-standard reading speeds and video duration analysis
 * to provide accurate time estimates for user planning.
 * 
 * @param content - The learning content to analyze
 * @param userProfile - User's historical learning data for personalization
 * @returns Time estimate with confidence level
 * 
 * @example
 * const estimate = calculateEstimatedTime(
 *   { wordCount: 500, videoDuration: 300 },
 *   { readingSpeed: 250 }
 * );
 * // Returns: { total: 8, confidence: 0.85 }
 */
export function calculateEstimatedTime(
  content: ContentAnalysis,
  userProfile: UserProfile
): TimeEstimate {
  // Calculate reading time based on user's historical speed
  // Default to 225 WPM if no user data available
  const readingSpeed = userProfile.readingSpeed || 225;
  const readingTime = content.wordCount / readingSpeed;
  
  // Video time is exact duration (no estimation needed)
  const videoTime = content.videoDuration / 60; // Convert to minutes
  
  // Add interaction buffer based on content complexity
  const interactionBuffer = calculateInteractionTime(content.complexity);
  
  return {
    reading: readingTime,
    video: videoTime,
    interaction: interactionBuffer,
    total: readingTime + videoTime + interactionBuffer,
    confidence: calculateConfidence(content, userProfile)
  };
}
```

**Comment Standards**:
- **Function Headers**: Purpose, parameters, return values, examples
- **Complex Logic**: Explain business rules and "why" decisions
- **Edge Cases**: Document error handling and boundary conditions
- **Performance Notes**: Explain optimization choices
- **TODO Comments**: Include ticket numbers and expected timeline

## 📝 Pull Request Guidelines

### PR Size & Scope
- **Maximum Size**: 200-400 lines of code
- **Single Purpose**: One feature, bug fix, or refactor per PR
- **Clear Title**: Use conventional commits format

### PR Title Format
```
feat: add timer component with countdown functionality
fix: resolve quiz submission timeout issue
docs: update API documentation for auth endpoints
refactor: extract common validation logic
test: add unit tests for estimation algorithms
```

### Stacked PRs for Complex Features

When a feature requires multiple PRs, use **stacked PRs**:

```bash
# PR #1: Foundation
git checkout dev
git checkout -b feature/timer-01-core
# ... implement core timer
git push origin feature/timer-01-core
# Create PR: feature/timer-01-core → dev

# PR #2: Build on PR #1
git checkout feature/timer-01-core
git checkout -b feature/timer-02-variants
# ... implement timer variants
git push origin feature/timer-02-variants
# Create PR: feature/timer-02-variants → feature/timer-01-core
```

**Stacked PR Benefits**:
- ✅ Smaller, reviewable PRs (200-400 lines each)
- ✅ Parallel development on different parts
- ✅ Independent testing and validation
- ✅ Safer rollback points

**Stacked PR Guidelines**:
1. **Document Dependencies**: Clearly state which PRs depend on others
2. **Sequential Merging**: Merge foundation PRs first
3. **Auto-Updates**: Dependent PRs automatically rebase when base merges
4. **Clear Descriptions**: Explain the relationship between stacked PRs

### PR Description Template
```markdown
## Summary
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that causes existing functionality to change)
- [ ] Documentation update

## Dependencies
- [ ] This PR depends on #123 (if applicable)
- [ ] This PR is part of stacked PRs: #123 → #124 → this PR

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] All existing tests pass

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (README, specs, etc.)
- [ ] No breaking changes (or properly documented)

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Additional Notes
[Any additional context or considerations]
```

## 🧪 Testing Requirements

### Pre-commit Validation
```bash
# Required before every commit
npm run lint          # ESLint validation
npm run type-check     # TypeScript validation
npm run test           # Unit tests
npm run pre-commit     # All checks combined
```

### Testing Standards
- **Unit Tests**: Jest + React Testing Library
- **Test Coverage**: Aim for 80%+ coverage on new code
- **Integration Tests**: For API endpoints and complex workflows
- **Accessibility Tests**: Ensure WCAG compliance

### Test Structure
```typescript
// src/components/common/timer/__tests__/Timer.test.tsx
import { render, screen, act } from '@testing-library/react';
import { Timer } from '../Timer';

describe('Timer Component', () => {
  it('should countdown from specified duration', () => {
    const onComplete = jest.fn();
    
    render(
      <Timer 
        duration={5} 
        onComplete={onComplete} 
        variant="countdown" 
      />
    );
    
    // Verify initial state
    expect(screen.getByText('0:05')).toBeInTheDocument();
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Verify completion
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
```

## 🔍 Code Review Process

### Review Requirements
- **Minimum Reviewers**: 1-2 reviewers (depending on change complexity)
- **Review Timeline**: Target 24-hour response time
- **Approval Required**: All reviewers must approve before merge

### Review Checklist

#### Code Quality
- [ ] **Follows Standards**: Adheres to project coding standards
- [ ] **Clean Comments**: Appropriate documentation and comments
- [ ] **No Code Smells**: No duplicated code, long functions, or complex conditionals
- [ ] **Error Handling**: Proper error handling and edge case coverage

#### Functionality
- [ ] **Meets Requirements**: Implements specified functionality correctly
- [ ] **User Experience**: Maintains good UX and accessibility
- [ ] **Performance**: No significant performance regressions
- [ ] **Security**: No security vulnerabilities introduced

#### Testing & Documentation
- [ ] **Test Coverage**: Adequate test coverage for new code
- [ ] **Documentation**: Updated specs, README, or API docs as needed
- [ ] **Breaking Changes**: Properly documented and versioned

### Giving Effective Reviews

#### Constructive Feedback
```markdown
# ✅ Good feedback
"Consider extracting this logic into a separate utility function for reusability. 
This pattern is used in 3 other places in the codebase."

# ❌ Avoid
"This is wrong."
```

#### Review Comments
- **Be Specific**: Point to exact lines and suggest improvements
- **Explain Why**: Provide context for requested changes
- **Offer Solutions**: Suggest specific improvements when possible
- **Acknowledge Good Work**: Highlight well-written code and good patterns

## 🚀 Deployment & Release

### Release Process
1. **Feature Complete**: All sprint features merged to `dev`
2. **Release Branch**: Create `release/vX.Y.Z` from `dev`
3. **Final Testing**: Integration and user acceptance testing
4. **Production Deploy**: Merge release branch to `main`
5. **Tag Version**: Create semantic version tag

### Hotfix Process
```bash
# Emergency bug fix
git checkout main
git checkout -b hotfix/critical-auth-bug
# ... implement fix
git push origin hotfix/critical-auth-bug
# Create PR: hotfix/critical-auth-bug → main (direct)
```

## 🤝 Communication & Collaboration

### Getting Help
- **Technical Questions**: Ask in team chat or create GitHub issue
- **Specification Clarification**: Review specs or ask product owner
- **Code Review**: Tag specific reviewers for expertise areas

### Best Practices
- **Communicate Early**: Discuss complex changes before implementation
- **Ask Questions**: Better to clarify than assume
- **Share Knowledge**: Document solutions and patterns for team benefit
- **Be Respectful**: Maintain professional and constructive communication

## 📚 Resources

### Documentation
- [Project Specification](specs/06-project-specification.md)
- [Development Standards](specs/01-development-standards.md)
- [Design System Standards](specs/03-design-system-standards.md)
- [AWS Amplify Backend](specs/02-aws-amplify-backend.md)

### Tools & Technologies
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [AWS Amplify Gen2](https://docs.amplify.aws/)

### Development Environment
- [ESLint Configuration](eslint.config.mjs)
- [TypeScript Configuration](tsconfig.json)
- [Package Dependencies](package.json)

## 🎯 Getting Started Checklist

- [ ] **Environment Setup**: Clone repo, install dependencies, start dev server
- [ ] **Read Specifications**: Understand project goals and standards
- [ ] **Review Current Sprint**: Check active work and priorities
- [ ] **Choose First Task**: Pick a good first issue or small feature
- [ ] **Create Feature Branch**: Follow naming conventions
- [ ] **Implement Changes**: Follow coding standards and comment guidelines
- [ ] **Write Tests**: Add appropriate test coverage
- [ ] **Run Pre-commit Checks**: Ensure all validation passes
- [ ] **Create PR**: Use template and follow guidelines
- [ ] **Respond to Review**: Address feedback promptly and professionally

---

**Welcome to the team!** 🎉 

We're excited to have you contribute to the 8P3P LMS. If you have any questions or need help getting started, don't hesitate to reach out to the team.

For more detailed information, check out our [specification documents](specs/) and feel free to suggest improvements to this contributing guide!
