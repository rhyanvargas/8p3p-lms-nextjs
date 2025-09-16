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

## Development Workflow

### Pre-commit Validation
```bash
npm run lint        # ESLint checking
npm run lint:fix    # Auto-fix issues
npm run lint:strict # Fail on warnings
npm run type-check  # TypeScript validation
npm run validate    # Both lint + type check
```

### Build Process
- Lint and type check before building
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