# Troubleshooting Documentation Standards

## Overview

This specification defines the practice of creating Root Cause Analysis (RCA) documentation for major bug fixes and feature implementations. These documents serve as learning resources and historical records of complex problem-solving processes.

## Purpose

1. **Knowledge Preservation**: Capture deep technical insights that might otherwise be lost
2. **Learning Resource**: Help team members understand complex debugging processes
3. **Pattern Recognition**: Identify recurring issues and systematic solutions
4. **Onboarding Aid**: Accelerate new developer ramp-up with real-world examples
5. **Decision Documentation**: Record why certain approaches were chosen over alternatives

## When to Create RCA Documentation

Create an RCA document when:

- ✅ The bug required significant investigation (>30 minutes of debugging)
- ✅ The root cause was non-obvious or counter-intuitive
- ✅ The fix involves React/Next.js patterns that may not be widely known
- ✅ The issue could easily recur if patterns aren't understood
- ✅ Multiple approaches were evaluated before finding the solution
- ✅ The debugging process revealed important system architecture insights

## RCA Document Structure

Each RCA document should follow this template:

```markdown
# [Feature/Bug Name] - Root Cause Analysis

**Date**: YYYY-MM-DD
**Severity**: Critical | High | Medium | Low
**Component**: [Component or system affected]
**Status**: ✅ Resolved | 🔄 In Progress | ⚠️ Workaround Applied

## Problem Statement

Clear, concise description of the observed issue.
- What was the user-visible symptom?
- What was the expected behavior?
- When did this occur? (Always, on load, specific conditions)

## Root Cause

Detailed technical explanation of why the issue occurred.
- What was the actual underlying cause?
- Why did it happen?
- What was missed initially?

## Investigation Process

Chronological steps taken to identify the root cause:
1. Initial hypothesis
2. Testing approach
3. Findings that led to breakthrough
4. Dead ends (important for learning!)

## Solution

Technical implementation of the fix:
- Code changes made
- Why this approach was chosen
- Alternative approaches considered

## Prevention

How to avoid this issue in the future:
- Patterns to follow
- Patterns to avoid
- Tests to add
- Documentation to update

## Related Issues

Links to similar issues or related documentation.

## Lessons Learned

Key takeaways for the team.
```

## Storage Location

All RCA documents are stored alongside specifications for easy reference:

```
/specs/
├── 01-development-standards.md
├── 08-troubleshooting-documentation.md
└── troubleshooting/
    ├── README.md
    ├── video-transcript-auto-sync-2025-10-02.md
    └── [issue-name]-[YYYY-MM-DD].md
```

### File Naming Convention

```
[kebab-case-description]-[YYYY-MM-DD].md
```

Examples:
- `video-transcript-auto-sync-2025-10-02.md`
- `timer-state-management-2025-09-20.md`
- `auth-middleware-race-condition-2025-10-01.md`

## Version Control Strategy

RCA documents are **committed to git** because:

1. **Team Knowledge Base**: Everyone benefits from documented solutions
2. **Historical Context**: Future developers can see why decisions were made
3. **Pattern Recognition**: Similar issues can be quickly identified and referenced
4. **Onboarding Resource**: New team members learn from real-world debugging examples
5. **Cross-Reference**: Easy to link from code comments, PRs, and other specs

### Quality Before Commit

Before committing an RCA document:

1. ✅ Remove any sensitive information (API keys, internal URLs, etc.)
2. ✅ Ensure code snippets are representative (not copy-pasted production data)
3. ✅ Verify links to external resources are public
4. ✅ Proofread for clarity - this will be read by others
5. ✅ Update `troubleshooting/README.md` index

## Integration with Development Workflow

### AI-Assisted Documentation

When working with AI assistants (Cascade, etc.) on complex bugs:

**During Debugging:**
1. AI provides detailed root cause analysis in chat
2. User requests: "Please create an RCA document for this fix"
3. AI automatically saves to `/specs/troubleshooting/[issue]-[YYYY-MM-DD].md`
4. AI updates `/specs/troubleshooting/README.md` index

**Request Format:**
```
"Can you add to your steering @specs to create a .md format file for this fix?"
```

**AI Response Pattern:**
1. ✅ Creates spec file (e.g., `08-troubleshooting-documentation.md`) if needed
2. ✅ Creates RCA document in `/specs/troubleshooting/`
3. ✅ Updates `/specs/troubleshooting/README.md` index
4. ✅ Provides summary of what was documented

**Benefits:**
- Zero manual documentation overhead
- Captures analysis while fresh in context
- Consistent format across all RCAs
- Automatic indexing and cross-referencing

### When AI Creates RCA Docs

When Cascade or other AI assistants provide detailed root cause breakdowns:

1. **Auto-Save**: Save the analysis to `/specs/troubleshooting/[issue]-[date].md`
2. **Auto-Index**: Update README.md with new entry
3. **Commit**: Add to git with the bug fix (RCAs are now version controlled)
4. **Reference**: Link from PR description, commit message, or code comments
5. **Review**: Team reviews during PR if issue was particularly complex

### Manual Creation

Developers should create RCA docs when:

1. They discover something they wish they'd known earlier
2. They solve a bug that took >1 hour to diagnose
3. They implement a workaround that needs explanation
4. They want to document tribal knowledge
5. AI wasn't involved in the debugging process

## Quality Standards

RCA documents should:

- ✅ **Be Specific**: Include actual code snippets, not generic descriptions
- ✅ **Show Timeline**: Explain the debugging journey, not just the answer
- ✅ **Include Visuals**: Add diagrams, screenshots, or ASCII art when helpful
- ✅ **Credit Sources**: Link to docs, Stack Overflow, or references that helped
- ✅ **Be Honest**: Include what didn't work and why
- ✅ **Use Plain Language**: Avoid jargon where possible; explain when necessary

## Examples of Good RCA Titles

- ✅ "Video Transcript Auto-Sync Fix - Callback Ref vs useEffect"
- ✅ "Timer Component Re-render Loop - State Closure Issue"
- ✅ "Next-Video Asset Loading - Storage Hook Implementation"
- ✅ "Authentication Middleware Race Condition - Cookie Timing"

## Examples of Poor RCA Titles

- ❌ "Bug Fix" (too generic)
- ❌ "Video Issue" (not specific)
- ❌ "Fixed the thing" (no context)
- ❌ "Update" (meaningless)

## Maintenance

- **Retention**: Keep RCA docs indefinitely (they're in git history anyway)
- **Organization**: Create subdirectories by category or year if folder gets large
- **Search**: Use filename conventions that support `grep`/`find`/GitHub search
- **Index**: Maintain `README.md` in `/specs/troubleshooting/` with categorized links
- **Updates**: If a pattern evolves, update the RCA or add a "Follow-up" section
- **Cross-Reference**: Link RCAs from relevant spec files when patterns are codified

## Success Metrics

A good RCA documentation practice should result in:

1. Faster debugging of similar issues (pattern recognition)
2. Fewer repeated mistakes (institutional memory)
3. Better PR reviews (reviewers can reference similar fixes)
4. Improved onboarding (real examples vs theoretical docs)
5. Stronger team knowledge sharing

---

**Note**: This is a living document. Update it as the team's RCA practices evolve.
