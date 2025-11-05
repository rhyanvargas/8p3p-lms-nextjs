---
description: Create feature specs.
auto_execution_mode: 1
---

## Objective

Create a full specification for a new feature so that the implementation agent (human or AI) has clear, testable tasks, acceptance criteria, and traceability.

---

## Inputs

| Input               | Type              | Description                                      |
| ------------------- | ----------------- | ------------------------------------------------ |
| FEATURE_NAME        | string            | Short descriptive name of the feature            |
| BUSINESS_CONTEXT    | string            | Business value or user need addressed            |
| SCOPE               | string            | Defined boundaries or sub-scope for this feature |
| TARGET_TIMELINE     | string            | Target date or sprint reference                  |
| STAKEHOLDERS        | list              | Roles such as Product, UX, Engineering, QA       |
| DEPENDENCIES        | list              | Related features, modules, or external systems   |
| NON_FUNCTIONAL_REQS | string (optional) | Performance, security, or compliance constraints |

---

## Phases

### 1. Requirements Phase

- Document user stories and business requirements using EARS or a similar format.  
  [Source: Ernest Chiang](https://www.ernestchiang.com/en/notes/ai/kiro/)
- For each user story, include acceptance criteria in Gherkin format:

```gherkin
Scenario: <scenario title>
  Given <initial context>
  When <event occurs>
  Then <observable outcome>
```

- Identify edge cases and negative flows.
- Map to business value: “As a user, I want <capability> so that <benefit>.”

---

### 2. Design Phase

- Define architecture, key components, APIs, data models, and UI interactions.
- Add sequence or flow diagrams as needed (Mermaid or similar).
- Define interfaces and integration points (internal and external).
- Specify non-functional requirements: performance, scalability, security.
- Identify configuration options or feature flags.

---

### 3. Tasks Phase

- Break the design into discrete, traceable tasks.  
  Each task should include:
  - Title
  - Status (`Pending`, `In Progress`, `Completed`, `Blocked`)
  - Dependencies
  - Estimate (time or story points)
  - Assignee (role or owner)
  - Acceptance criteria/tests and deliverables
  - Notes (implementation hints, constraints)
- Ensure traceability between tasks and requirements.
- Include tracking details for progress and completion.

---

### 4. Review and Approval

- Stakeholders review requirements, design, and tasks.
- Record formal sign-off via comment or markdown checklist.
- Confirm:
  - Acceptance criteria are measurable and clear.
  - Tasks are sequenced and dependencies handled.

---

### 5. Implementation and Monitoring

- Start implementation only after approval.
- Monitor progress:
  - Update task statuses.
  - Log blockers.
  - Revise spec if scope changes.
- Keep the document updated as a living artifact.  
  [Source: Kiro Best Practices](https://kiro.dev/docs/specs/best-practices/)
- After completion:
  - Validate acceptance criteria and tests.
  - Update documentation and finalize the checklist.

---

## Outputs

- `requirements.md`
- `design.md`
- `tasks.md`
- Summary checklist: “Feature <FEATURE_NAME> ready for development”
- Gherkin test suite or reference link
- Progress tracking dashboard or markdown summary

---

## Safety and Guardrails

- Do not start coding until sign-off is complete.
- Avoid scope creep; re-approve any changes.
- Define tests before implementation.
- Maintain traceability from business value → user story → acceptance → task.
