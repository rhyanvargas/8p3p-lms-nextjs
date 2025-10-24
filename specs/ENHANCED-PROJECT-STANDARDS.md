---
trigger: always_on
---

# 8P3P LMS - Windsurf Project Rules

<project_context>
- **Project**: EMDR therapist training LMS
- **Stack**: Next.js 15, React 19, TypeScript 5.9, AWS Amplify Gen2, Tailwind v4, shadcn/ui
- **Development Phase**: MVP feature completion (Phase 1)
- **Testing Strategy**: Manual Q&A testing (no unit tests until post-MVP)
</project_context>

<protocol_hierarchy>
## Protocol Execution Order (CRITICAL)

**MANDATORY SEQUENCE** - Must be followed in exact order:

### Step 1: Codebase Analysis Protocol (ALWAYS FIRST)
- **Trigger**: ANY request involving files, components, or functionality
- **Required**: Complete existing implementation check before ANY recommendations
- **Blocker**: Cannot proceed to other protocols without completing this step

### Step 2: Branch Readiness Protocol
- **Trigger**: Creating new branches or starting development work
- **Required**: User confirmation before any branch creation
- **Depends on**: Step 1 completion

### Step 3: Implementation
- **Trigger**: After user approval from Step 2
- **Required**: Follow all quality gates and standards
- **Depends on**: Steps 1 & 2 completion

**VIOLATION CONSEQUENCES**:
- Inaccurate recommendations (ignoring existing work)
- Wasted development time
- Loss of user trust in AI recommendations
</protocol_hierarchy>

<development_workflow>
## Branch Readiness Protocol (MANDATORY)

**PREREQUISITE**: Codebase Analysis Protocol MUST be completed first.

Before starting ANY new feature:
1. **Complete Codebase Analysis**: Verify existing implementations and acknowledge current state
2. **Present Branch Readiness Plan**: Show feature spec, branch strategy, stacked PR plan, timeline
3. **Get User Confirmation**: Ask "Ready to create the branch and start {feature_name} development? 🚀"
4. **Wait for Approval**: Do NOT create branches without explicit user confirmation
5. **Document Decision**: Record approval before proceeding

**BLOCKER**: Cannot proceed without completing Step 1 (Codebase Analysis)

## LOC Verification (MANDATORY)

Before every commit:
```bash
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
export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params; // Next.js 15+ requires await
	return <div>Post {id}</div>;
}
```

### Client Components
```tsx
"use client";
import { useParams } from "@/hooks/use-params";

export default function ClientComponent({ params }: { params: Promise<{ id: string }> }) {
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

<aws_amplify_backend>
## Authentication Standards

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
</aws_amplify_backend>

<design_system>
## Tailwind CSS v4 + shadcn/ui Standards

### CSS-First Configuration
- **No config file needed**: Tailwind v4 uses CSS-first configuration
- **Single import**: `@import "tailwindcss";` in globals.css

### Stylesheet Structure (globals.css)
**Order matters**: `@import` → `@theme` → CSS variables → `@layer`

### Base Layer Rules
- **Use CSS variables directly** in `@layer base`
- **Correct**: `background-color: var(--background);`
- **Incorrect**: `@apply bg-background;`

### Component Standards
- **Primary**: shadcn/ui components for all UI elements
- **Custom Components**: Follow shadcn/ui patterns and composition
- **Styling**: Tailwind utility classes only (no CSS Modules except auto-generated libraries)
</design_system>

<code_quality>
## Codebase Analysis Protocol (MANDATORY - ALWAYS FIRST)

**CRITICAL**: This protocol MUST be executed BEFORE any other protocols or recommendations.

### Trigger Conditions
- User requests feature implementation
- User asks about existing functionality
- User mentions creating/modifying files
- User says "proceed with [feature]"
- ANY development-related request

### Required Analysis Steps

**Step 1: Search Existing Implementations**
```bash
grep_search "featureName|ComponentName"
find_by_name "*feature*|*component*"
grep_search "import.*ComponentName"
```

**Step 2: Read Complete Context**
- Read ALL related files completely (not partial)
- Understand existing architecture and patterns
- Identify what's already implemented vs what's missing

**Step 3: Acknowledge Before Recommending**
- **ALWAYS** acknowledge existing implementations first
- State completion percentage: "X is 85% complete, missing Y and Z"
- Build upon existing work rather than recreating

### Enforcement Rules
- **NEVER** present plans without completing analysis first
- **NEVER** assume files don't exist without searching
- **NEVER** ignore existing implementations in recommendations
- **ALWAYS** state "Following Codebase Analysis Protocol" when starting
- **ALWAYS** acknowledge existing work before suggesting new work

### Violation Prevention
**Before ANY recommendation, ask yourself**:
1. ✅ Did I search for existing implementations?
2. ✅ Did I read the complete existing code?
3. ✅ Did I acknowledge what's already built?
4. ✅ Am I building upon existing work vs recreating?

**If ANY answer is NO, STOP and complete the analysis first.**

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
- **Files**: kebab-case for utilities, PascalCase for components

## Comment Standards

### Function Documentation
```typescript
/**
 * Analyzes video content and calculates engagement time
 * @param content - Video URL and metadata
 * @returns Estimated completion time with confidence score
 */
```

### Business Logic Comments
- **WHY decisions**: Document reasoning behind non-obvious implementations
- **Edge Cases**: Explain handling of special conditions
- **Error Handling**: Document recovery strategies

## AI Accountability Standards

### Protocol Compliance Verification
**Before presenting ANY plan or recommendation**:
1. ✅ **State Protocol**: "Following Codebase Analysis Protocol..."
2. ✅ **Show Evidence**: Present search results and existing implementations found
3. ✅ **Acknowledge Work**: "I found X is already implemented, Y needs completion"
4. ✅ **Build Upon**: "Building upon existing work rather than recreating"
5. ✅ **Accurate Scope**: Present realistic LOC and timeline based on actual state

### Trust Maintenance
**User can rely on AI recommendations when**:
- All protocols followed in correct sequence
- Existing work acknowledged and respected
- Plans based on actual codebase state, not assumptions

**User should question AI recommendations when**:
- Protocols skipped or reordered
- Existing implementations ignored
- Plans seem to recreate existing functionality
</code_quality>

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
</component_development>

<bug_resolution>
## Systematic Issue Resolution

### Resolution Protocol
1. **Root Cause Analysis**: Trace issue to source, not symptoms
2. **Solution Documentation**: Create resolution ticket descriptions
3. **User Confirmation**: MANDATORY before marking resolved
4. **Verification**: User must test in their environment

### Confirmation Process
```
1. Present solution and changes made
2. Ask user to test the fix
3. Request explicit confirmation: "Can you confirm this issue is resolved?"
4. Wait for user verification
```

### RCA Documentation
Create RCA document when:
- Bug required significant investigation (>30 minutes)
- Root cause was non-obvious
- Multiple approaches were evaluated
</bug_resolution>

<specification_process>
## Clarifying Questions Framework

### Before Implementation
- **ALWAYS** ask clarifying questions before implementation
- **NEVER** assume requirements without confirmation

### Question Categories
**Technical Architecture**: Data structure, user flow, performance, integration, scalability
**Feature Specification**: Functionality, edge cases, validation, error handling, accessibility
**Implementation**: Technology choices, component architecture, state management, testing, deployment

## MoSCoW Prioritization
- **Must Have**: Critical features for MVP
- **Should Have**: Important but not critical
- **Could Have**: Nice to have features
</specification_process>

<testing_strategy>
## MVP Testing Approach
**Current Phase**: Manual Q&A testing only
- **No unit tests**: Deferred until post-MVP
- **Focus**: Feature completion over test coverage
- **Quality Gates**: ESLint, TypeScript, build validation only
</testing_strategy>

<mock_data>
## Mock Data Best Practices
- **Location**: Centralized in `src/lib/mock-data.ts`
- **TypeScript**: Use proper interfaces for typed data
- **Organization**: Group by feature
</mock_data>

<technical_debt>
## Current Technical Debt

### Tavus CVI Components - CSS Modules
**Status**: Deferred to Post-MVP
**Issue**: Tavus CVI uses CSS modules; project uses Tailwind v4 + shadcn/ui
**Action**: Post-MVP migration to Tailwind patterns
</technical_debt>