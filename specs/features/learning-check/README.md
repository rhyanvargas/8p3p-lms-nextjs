# Learning Check Feature Documentation

This directory contains the split specification for the Learning Check (Chapter-End Conversational Assessment) feature.

## Documentation Structure

### 📄 [learning-check-spec.md](./learning-check-spec.md)
**Product Requirements Document** (~400 lines)
- Overview & Goals
- User Stories
- Functional Requirements (1-9)
- MoSCoW Prioritization
- Success Metrics
- Open Questions
- Risk Mitigation

**Audience**: Product Managers, Designers, Stakeholders

### 🔧 [learning-check-implementation.md](./learning-check-implementation.md)
**Technical Implementation Guide** (~400 lines)
- Perception Analysis Integration
- Webhook Setup & Configuration
- Data Structures & Interfaces
- Technical Requirements
- Implementation Phases (1-5)
- Acceptance Criteria
- Code Examples

**Audience**: Developers, Technical Leads

---

## Quick Links

- **Start Here**: [Product Spec](./learning-check-spec.md) for requirements overview
- **Implementation**: [Technical Guide](./learning-check-implementation.md) for development details
- **Original Spec**: [learning-check-tavus.md](../learning-check-tavus.md) (deprecated, kept for reference)

---

## Feature Overview

**Learning Check** is a 4-minute conversational assessment using Tavus CVI with AI avatar instructor that:
- Validates comprehension through natural dialogue
- Tracks audio + visual engagement (≥50% threshold)
- Uses Raven perception analysis for holistic assessment
- Provides transcripts and rubric scoring for instructors

**Timeline**: 7-10 days (MVP through Phase 2)  
**Priority**: High - Core MVP feature
