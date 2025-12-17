---
trigger: always_on
---

# 8P3P LMS – Windsurf Project Rules (Main Rules Summary v2)

> Context: EMDR Therapist Training LMS • Stack: Next.js 15, React 19, TS 5.9, Tailwind v4, shadcn/ui • Phase: MVP (manual Q&A only)

## 1) Mandatory Protocol Sequence

1. Codebase Analysis (ALWAYS FIRST) – Review related code and acknowledge existing work.
2. Branch Readiness – Present plan (feature spec, stacked PRs, timeline); require user approval before branch creation.
3. Implementation – Proceed only after Steps 1–2; follow quality gates.
   Skipping sequence causes invalid recommendations and wasted time.

## 2) Development Workflow

Branch creation requires prior Codebase Analysis and explicit approval.  
LOC Verification: run `git diff --cached --shortstat` before commits.  
PR Standards: ≤400 LOC, semantic commits, stacked PRs for large features.  
Branch flow: feature → dev → release/vX.Y.Z → main

## 3) Next.js 15 Architecture

Server Components first; use "use client" only for client logic (state, events, browser APIs).  
Prefer server-side data fetching; use ISR `next:{revalidate:3600}` for cacheable data.  
Never unwrap Promises with use().

## 4) Design System (Tailwind v4 + shadcn/ui)

CSS-first config: `@import "tailwindcss";` → `@theme` → vars → `@layer`.  
Use CSS vars directly, not @apply.  
Use shadcn/ui components; follow composition patterns.  
Tailwind utilities only, no CSS Modules (except auto-generated libs).

## 5) Code Quality & Accountability

Run Codebase Analysis before planning: Search → Read → Acknowledge.  
Quality Gates: pass lint, type-check, build, functionality, and docs.  
Naming: camelCase (vars), PascalCase (components), kebab-case (utils).  
Document reasoning (“why”) in comments.  
AI recommendations must cite protocol, evidence, and LOC realism.

## 6) Component Reusability

Reuse existing components first.  
Extend shadcn/ui next.  
Create new only when necessary.

## 7) Bug Resolution

Perform Root Cause Analysis; document fixes; request user confirmation before closing.  
Create RCA doc for issues requiring >30 min investigation.

## 8) Specification Process

Clarify requirements before coding.  
Address architecture, validation, edge cases, and deployment.  
Prioritize using MoSCoW (Must / Should / Could).

## 9) Testing

Manual Q&A only for MVP; enforce lint, type, and build checks.

## 10) Mock Data

Store in src/lib/mock-data.ts, typed with interfaces, grouped by feature.

## 11) No Barrel Exports (Next.js 15 Mandatory Rule)

Do not use barrel export patterns (index.ts / index.tsx).  
Directory-imports for single-file components are fine.
Barrel re-exports increase load and coupling; disallowed.
Example:  
✅ `import { VideoPlayer } from '@/components/video/video-player'`  
❌ `import { VideoPlayer } from '@/components/video'`  
Reason: Barrel files load all exports, slowing builds and runtime.  
Migration Checklist: remove barrel files, update imports, re-run type-check and build.  
No exceptions.  
Reference: [Vercel – How We Optimized Package Imports](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)

## 12) Technical Debt

Tavus CVI (CSS Modules) deferred until post-MVP for Tailwind/shadcn alignment.
