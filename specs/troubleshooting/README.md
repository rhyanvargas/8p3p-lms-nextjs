# Troubleshooting Documentation

This directory contains Root Cause Analysis (RCA) documents for major bug fixes and feature implementations in the 8P3P LMS project.

## Purpose

These documents serve as:
- 📚 **Learning Resources**: Deep dives into complex problem-solving processes
- 🧠 **Knowledge Base**: Historical record of issues and solutions
- 🚀 **Onboarding Aid**: Real-world examples for new team members
- 🔍 **Pattern Library**: Recognition of recurring issues and systematic solutions

## Directory Structure

```
/specs/troubleshooting/
├── README.md (this file)
├── video-transcript-auto-sync-2025-10-02.md
├── [feature-name]-[YYYY-MM-DD].md
└── ...
```

**Note**: All RCA documents are **committed to git** as part of the team's knowledge base.

## Document Index

### Video & Media
- [Video Transcript Auto-Sync Fix](./video-transcript-auto-sync-2025-10-02.md) - Callback ref pattern for DOM event listeners

### Components
- (Add more as created)

### State Management
- (Add more as created)

### Performance
- (Add more as created)

## When to Create an RCA Document

Create a new RCA document when:

- ✅ The bug required significant investigation (>30 minutes)
- ✅ The root cause was non-obvious or counter-intuitive
- ✅ The fix involves React/Next.js patterns worth documenting
- ✅ The issue could recur if patterns aren't understood
- ✅ The debugging process revealed important architecture insights

## How to Use These Documents

### For Debugging
1. Search by component name or symptom
2. Check "Related Issues" sections for similar problems
3. Review "Patterns to Avoid" to prevent the issue

### For Learning
1. Read "Investigation Process" to understand debugging approach
2. Study "Alternative Approaches" to see why certain solutions were chosen
3. Review code snippets to internalize patterns

### For Code Review
1. Reference similar issues when reviewing PRs
2. Suggest RCA creation for complex fixes
3. Link to relevant RCAs in PR comments

## Template

See [specs/08-troubleshooting-documentation.md](../specs/08-troubleshooting-documentation.md) for the full template and standards.

Quick template:
```markdown
# [Issue Name] - Root Cause Analysis

**Date**: YYYY-MM-DD
**Severity**: Critical | High | Medium | Low
**Component**: [Component name]
**Status**: ✅ Resolved

## Problem Statement
[What went wrong from user perspective]

## Root Cause
[Technical explanation of why it happened]

## Investigation Process
[Chronological debugging steps]

## Solution
[How it was fixed and why]

## Prevention
[Patterns to follow/avoid, tests to add]

## Related Issues
[Links to similar problems]

## Lessons Learned
[Key takeaways]
```

## Contributing

When you solve a complex bug:

1. Copy the template from specs
2. Document while memory is fresh
3. Include code snippets and diagrams
4. Be honest about dead ends
5. Save as `[kebab-case-description]-[YYYY-MM-DD].md`
6. Update this README's index

## Graduation to Specs

If an RCA reveals patterns worth preserving:

1. Refine the document for broader audience
2. Extract relevant sections to appropriate spec files
3. Keep original RCA as historical reference
4. Add cross-references between spec and RCA

---

**Last Updated**: 2025-10-02  
**Total Documents**: 1
