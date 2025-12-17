# Better Auth Migration Feature Documentation

This directory contains the split specification for the **Better Auth Migration** feature, which replaces AWS Amplify authentication with Better Auth backed by Postgres + Drizzle.

## Documentation Structure

### 📋 [requirements.md](./requirements.md)

**Requirements Specification**

- Business context and goals
- Scope and assumptions (Postgres + Drizzle, email/password only, no user migration)
- User stories with Gherkin acceptance criteria
- Edge cases and negative flows
- Non-functional requirements (security, performance, operability)
- MoSCoW prioritization and success criteria

**Audience**: Product, Engineering, QA

### 🔧 [design.md](./design.md)

**Design Specification**

- High-level architecture and data flow
- Better Auth instance configuration (Postgres + Drizzle)
- Next.js integration (API route, middleware, RSC usage, client)
- Data model expectations and email provider integration
- Migration strategy from Amplify to Better Auth
- Security considerations and failure modes

**Audience**: Developers, Technical Leads

### ✅ [tasks.md](./tasks.md)

**Task Breakdown**

- Phased implementation tasks (foundation, auth flows, migration, decommissioning)
- Task statuses and dependencies
- Estimates and acceptance criteria
- Traceability back to requirements

**Audience**: Engineering Team

---

## Feature Overview

**Better Auth Migration** transitions the LMS from AWS Amplify authentication to **Better Auth + Postgres/Drizzle** while:

- Using email/password as the initial auth method
- Supporting email verification and password reset
- Enforcing auth via middleware + server components (RSC) in Next.js 15
- Fully removing Amplify code, configuration, and unused AWS resources

**Timeline**: 1–2 sprints for full migration and cleanup  
**Priority**: High – Core platform infrastructure change

---

## Quick Links

- **Start Here**: [Requirements](./requirements.md) for user stories and acceptance criteria
- **Technical Design**: [Design](./design.md) for architecture and integration details
- **Task Tracking**: [Tasks](./tasks.md) for implementation phases and progress
