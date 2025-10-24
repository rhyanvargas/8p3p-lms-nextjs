---
trigger: always_on
---

# 8P3P LMS - Windsurf Project Rules

> **Consolidated project standards distilled from specifications**
> **Activation Mode**: Always On
> **File Limit**: 12000 characters (Windsurf requirement)

---

<project_context>

- **Project**: EMDR therapist training LMS (Learning Management System)
- **Stack**: Next.js 15, React 19, TypeScript 5.9, AWS Amplify Gen2, Tailwind v4, shadcn/ui
- **Development Phase**: MVP feature completion (Phase 1)
- **Testing Strategy**: Manual Q&A testing (no unit tests until post-MVP)
  </project_context>

---

<development_workflow>

## Branch Readiness Protocol (MANDATORY)

Before starting ANY new feature:

1. **Present Branch Readiness Plan**: Show feature spec, branch strategy, stacked PR plan, timeline
2. **Get User Confirmation**: Ask "Ready to create the branch and start {feature_name} development? 🚀"
3. **Wait for Approval**: Do NOT create branches without explicit user confirmation
4. **Document Decision**: Record approval before proceeding

## LOC Verification (MANDATORY)

Before every commit:

```bash
# Verify actual line count
git diff --cached --shortstat
git diff --cached --stat
```

**Rules**:

- **MUST** verify actual LOC before committing
- **NEVER** estimate LOC without verification
- **ALWAYS** report actual numbers in commit messages
- **EXCEPTION**: Auto-generated library files (document in commit)

## PR & Release Standards

- **PR Size**: 200-400 LOC maximum per PR
- **Stacked PRs**: For complex features, break into dependent PRs
- **Commit Format**: Semantic commits (feat:, fix:, docs:, refactor:, etc.)
- **Branch Strategy**: feature → dev → release/vX.Y.Z → main

</development_workflow>

---

<next_js_15_architecture>

## Server Components First Rule (HIGHEST PRIORITY)

- **DEFAULT**: Always start with Server Components (no "use client")
- **ONLY add "use client"** when you need:
  - State management (useState, useReducer)
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage, window)
  - React hooks requiring client-side execution

## Route Parameters Handling

### Server Components

```tsx
export default async function PostPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params; // Next.js 15+ requires await
	return <div>Post {id}</div>;
}
```

### Client Components

```tsx
"use client";
import { useParams } from "@/hooks/use-params";

export default function ClientComponent({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = useParams(params);
	return <div>Post {id}</div>;
}
```

**NEVER**: Use manual Promise unwrapping with `use()` in components

## Data Fetching

- **Prefer**: Server-side data fetching in Server Components
- **Client-side**: Only when server-side isn't suitable (real-time updates, user interactions)
- **Use**: ISR with `next: { revalidate: 3600 }` for cacheable data

</next_js_15_architecture>

---

<aws_amplify_backend>

## Authentication Standards

### Required Imports

```typescript
import { defineAuth, secret } from "@aws-amplify/backend";
```

### Core Rules

- **ALWAYS** import `secret` for auth configurations
- **External Providers**: Only Google, Apple, Amazon, Facebook supported
- **Callback/Logout URLs**: Must be inside `externalProviders` object
- **User Attributes**: Must be outside `loginWith` object
- **Login Methods**: Only `email` and `phone` (no `username`)

## Data Schema Design

### Authorization Rules (Gen2)

- Use `.guest()` instead of `.public()` (Gen2 only)
- Use `.to()` for permissions: `allow.guest().to(['read', 'write'])`

### Relationships

- `.hasMany()` and `.belongsTo()` always require related field ID
- Example: `members: a.hasMany("Member", "teamId")`
- Reference field must exist: `teamId: a.id()`

### Enums

- Don't use `.required()` or `.defaultValue()` with enums
- Enums are type-safe by definition

</aws_amplify_backend>

---

<design_system>

## Tailwind CSS v4 + shadcn/ui Standards

### CSS-First Configuration

- **No config file needed**: Tailwind v4 uses CSS-first configuration
- **Single import**: `@import "tailwindcss";` in globals.css
- **Theme customization**: Use `@theme` directive with CSS variables

### Stylesheet Structure (globals.css)

**Order matters**:

1. `@import` statements first
2. `@theme` directive for Tailwind customization
3. CSS variables in `:root` and `.dark`
4. `@layer` directives last

### Base Layer Rules

- **Use CSS variables directly** in `@layer base`
- **Correct**: `background-color: var(--background);`
- **Incorrect**: `@apply bg-background;`
- **Reason**: Tailwind v4 promotes CSS-first approach

### Component Standards

- **Primary**: shadcn/ui components for all UI elements
- **Custom Components**: Follow shadcn/ui patterns and composition
- **Styling**: Tailwind utility classes only (no CSS Modules except auto-generated libraries)
- **Theme**: Use CSS variables for dynamic theming

</design_system>

---

<code_quality>

## Codebase Analysis Protocol (MANDATORY)

Before ANY recommendations about files/components/functionality:

### 1. Existing Implementation Check

```bash
grep_search "functionName|ComponentName"     # Check existing implementations
find_by_name "*feature*|*component*"        # Find related files
grep_search "import.*ComponentName"          # Check usage patterns
```

### 2. Duplication Prevention

- **NEVER** suggest creating new files without checking existing implementations
- **NEVER** assume functionality doesn't exist without comprehensive searching
- **ALWAYS** build upon existing work rather than recreating it
- **ALWAYS** acknowledge existing implementations before suggesting changes

### 3. Recommendation Protocol

- **READ FIRST, RECOMMEND SECOND**: Scan existing codebase thoroughly
- **VERIFY ASSUMPTIONS**: Never assume something doesn't exist
- **ASK CLARIFYING QUESTIONS**: "I see you have X, are you looking to enhance it or replace it?"
- **ACKNOWLEDGE EXISTING WORK**: Recognize what's already implemented

## Quality Gates (Before Feature Completion)

**ALL must pass before declaring features complete**:

1. **ESLint**: `npm run lint` (0 errors, 0 warnings)
2. **TypeScript**: `npm run type-check` (full compilation)
3. **Build**: `npm run build` (successful production build)
4. **Functionality**: Core use cases work as specified
5. **Documentation**: README and code docs updated

## ESLint & TypeScript Rules

### Key Rules

- `@next/next/no-async-client-component`: Prevents async Client Components
- `@typescript-eslint/no-unused-vars`: Prefix unused with `_`
- `@typescript-eslint/no-explicit-any`: Avoid `any` type
- `react-hooks/exhaustive-deps`: Complete hook dependencies

### Naming Conventions

- **Variables/Functions**: camelCase
- **Components/Types**: PascalCase
- **Unused Variables**: Prefix with `_`
- **Files**: kebab-case for utilities, PascalCase for components

## Comment Standards

### Function Documentation

```typescript
/**
 * Analyzes video content and calculates engagement time
 *
 * @param content - Video URL and metadata
 * @param userProfile - User's learning preferences
 * @returns Estimated completion time with confidence score
 *
 * @example
 * const estimate = analyzeVideo('/videos/intro.mp4', userProfile);
 * // Returns: { timeMinutes: 15, confidence: 0.85 }
 */
```

### Business Logic Comments

- **WHY decisions**: Document reasoning behind non-obvious implementations
- **Edge Cases**: Explain handling of special conditions
- **Error Handling**: Document recovery strategies
- **Performance**: Note optimization reasons

### TODO Comments

```typescript
// TODO: [#TICKET-123] High priority - Add error retry logic
// Context: Current implementation fails silently on network errors
// Timeline: Sprint 3
```

</code_quality>

---

<component_development>

## Component Reusability Protocol (MANDATORY)

Before creating ANY new component:

### 1. Scan Existing Components

```bash
find_by_name "*component-name*" src/components/
grep_search "ComponentName" src/components/
```

### 2. Check shadcn/ui

- Search https://ui.shadcn.com/docs/components for relevant base components
- Install and use existing shadcn/ui components when applicable

### 3. Prioritization

1. **Reuse existing**: Extend or compose existing components
2. **shadcn/ui base**: Build on shadcn/ui components
3. **Create new**: Only when above options aren't suitable

### 4. Composition Over Creation

- Prefer composing multiple small components
- Document component composition in JSDoc headers
- Follow shadcn/ui patterns for consistency

</component_development>

---

<bug_resolution>

## Systematic Issue Resolution

### Resolution Protocol

1. **Root Cause Analysis**: Trace issue to source, not symptoms
2. **Solution Documentation**: Create resolution ticket descriptions
3. **User Confirmation**: MANDATORY before marking resolved
4. **Verification**: User must test in their environment

### Confirmation Process

```
REQUIRED STEPS:
1. Present solution and changes made
2. Ask user to test the fix
3. Request explicit confirmation: "Can you confirm this issue is resolved?"
4. Wait for user verification
5. If not resolved, investigate further
```

### RCA Documentation

Create RCA document when:

- Bug required significant investigation (>30 minutes)
- Root cause was non-obvious
- Issue involves React/Next.js patterns not widely known
- Multiple approaches were evaluated
- Debugging revealed important architecture insights

</bug_resolution>

---

<specification_process>

## Clarifying Questions Framework

### Before Implementation

- **ALWAYS** ask clarifying questions before implementation
- **NEVER** assume requirements without confirmation
- **DOCUMENT** all assumptions and decisions
- **VALIDATE** understanding before proceeding

### Question Categories

**Technical Architecture**:

- Data structure and relationships
- User interaction flow
- Performance requirements
- Integration patterns
- Scalability considerations

**Feature Specification**:

- Exact functionality
- Edge case handling
- Validation rules
- Error handling approach
- Accessibility requirements

**Implementation**:

- Technology stack choices
- Component architecture
- State management approach
- Testing strategy
- Deployment approach

## MoSCoW Prioritization

- **Must Have**: Critical features for MVP
- **Should Have**: Important but not critical
- **Could Have**: Nice to have features
- **Won't Have**: Out of scope for current iteration

</specification_process>

---

<testing_strategy>

## MVP Testing Approach

**Current Phase**: Manual Q&A testing only

- **No unit tests**: Deferred until post-MVP
- **Focus**: Feature completion over test coverage
- **Quality Gates**: ESLint, TypeScript, build validation only

**Rationale**: Rapid iteration and feature completion for MVP delivery

**Post-MVP**: Comprehensive automated testing suite will be implemented

</testing_strategy>

---

<mock_data>

## Mock Data Best Practices

- **Location**: Centralized in `src/lib/mock-data.ts`
- **TypeScript**: Use proper interfaces for typed data
- **Organization**: Group by feature
- **Structure**: Easy replacement for real APIs
- **Alternatives**: `src/data/`, `src/mocks/`, or `src/lib/data/` for larger projects

</mock_data>

---

<technical_debt>

## Current Technical Debt

### Tavus CVI Components - CSS Modules

**Status**: Deferred to Post-MVP

**Issue**: Tavus CVI uses CSS modules; project uses Tailwind v4 + shadcn/ui

**Impact**: Two styling systems in codebase

**Action**: Post-MVP migration to Tailwind patterns

**Priority**: Medium (after feature validation)

</technical_debt>
