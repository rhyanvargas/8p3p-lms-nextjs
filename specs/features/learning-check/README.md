# Learning Check Feature Documentation

This directory contains the split specification for the Learning Check (Chapter-End Conversational Assessment) feature.

## Documentation Structure

### 📋 [requirements.md](./requirements.md)
**Requirements Specification** (~600 lines)
- User Stories with Gherkin acceptance criteria
- Edge cases and negative flows
- Non-functional requirements
- MoSCoW prioritization
- Dependencies and integration points
- Success criteria

**Audience**: Product Managers, Designers, Engineers, QA

### 🔧 [design.md](./design.md)
**Design Specification** (~310 lines)
- System architecture and data flow
- Component structure
- API routes
- Data models
- Configuration
- Analytics events
- UI/UX design
- Security and error handling

**Audience**: Developers, Technical Leads

### ✅ [tasks.md](./tasks.md)
**Task Breakdown** (~217 lines)
- 31 tasks across 5 implementation phases
- Task estimates and traceability matrix
- Current status tracking (Phase 1 Complete)

**Audience**: Engineering Team

### 🧪 [TESTING.md](./TESTING.md)
**Testing Guide** (~400 lines)
- Setup instructions
- Test scenarios for Phase 1
- Expected console outputs
- Manual Q&A testing procedures

**Audience**: QA, Developers

---

## Quick Links

- **Start Here**: [Requirements](./requirements.md) for user stories and acceptance criteria
- **Technical Design**: [Design Doc](./design.md) for architecture and implementation
- **Task Tracking**: [Tasks](./tasks.md) for implementation progress
- **Testing**: [Testing Guide](./TESTING.md) for Phase 1 Q&A testing
- **Archived Docs**: Historical specs moved to `/docs/archive/`

---

## Feature Overview

**Learning Check** is a 4-minute conversational assessment using Tavus CVI with AI avatar instructor that:
- Validates comprehension through natural dialogue
- Tracks audio + visual engagement (≥50% threshold)
- Uses Raven perception analysis for holistic assessment
- Provides transcripts and rubric scoring for instructors

**Timeline**: 7-10 days (MVP through Phase 2)  
**Priority**: High - Core MVP feature
