# Learning Check Feature — Tasks

> **Feature**: Learning Check (Conversational Assessment)  
> **Status**: Phase 1 Complete ✅ | Phase 2-5 Pending ⏳  
> **Updated**: 2025-11-04

---

## Task Summary

| Phase | Tasks | Complete | Pending | Estimate |
|-------|-------|----------|---------|----------|
| Phase 1: MVP | 7 | 7 ✅ | 0 | 2-3 days |
| Phase 2: Webhooks | 10 | 0 | 10 ⏳ | 2 days |
| Phase 3: Persistence | 4 | 0 | 4 ⏳ | 1 day |
| Phase 4: Rubric | 5 | 0 | 5 ⏳ | 1-2 days |
| Phase 5: Polish | 5 | 0 | 5 ⏳ | 1 day |
| **TOTAL** | **31** | **7** | **24** | **7-10 days** |

---

## Phase 1: MVP ✅ COMPLETE

### ✅ Task 1.1: Quiz-Gated Access (2h)
- Lock/unlock based on quiz ≥70%
- Clear messaging when locked
- **US-1**

### ✅ Task 1.2: Hair Check Integration (3h)
- Camera/mic verification
- Device selection
- Permission error handling
- **US-2**

### ✅ Task 1.3: 3-Minute Timer (4h)
- Countdown 3:00 → 0:00
- Visual warnings (30s orange, 0:00 red)
- Auto-expire callback
- **US-3**

### ✅ Task 1.4: Engagement Tracking (3h)
- Track elapsed time
- Console log engagement
- Threshold comparison (≥90s)
- **US-4**

### ✅ Task 1.5: Create Conversation API (4h)
- POST `/api/learning-checks/conversation`
- Inject chapter context
- Return conversation URL/ID
- **US-5**

### ✅ Task 1.6: Termination (All Triggers) (5h)
- Timer expire, manual end, navigation, tab close, unmount, connection loss
- POST `/api/learning-checks/conversation/:id/end`
- Analytics events
- **US-6**

### ✅ Task 1.7: Mark Complete (3h)
- Show button when ≥90s
- Update course progress
- Success message
- **US-7**

---

## Phase 2: Webhooks ⏳ PENDING

### ⏳ Task 2.1: Generate Webhook Secret (30m)
- `crypto.randomBytes(32).toString('hex')`
- Store in env variables

### ⏳ Task 2.2: ngrok Setup (1h)
- Local webhook tunnel
- Update Tavus dashboard

### ⏳ Task 2.3: Webhook Endpoint (4h)
- POST `/api/webhooks/tavus`
- Route to event handlers
- **US-8**

### ⏳ Task 2.4: Signature Verification (2h)
- HMAC-SHA256 verification
- Security event logging

### ⏳ Task 2.5: Configure Perception Queries (1h)
- 6 queries in Tavus dashboard
- Gaze, engagement, note-taking, etc.

### ⏳ Task 2.6: Parse Perception Data (3h)
- Extract gaze percentage (regex)
- Map engagement level to score
- Calculate visual score

### ⏳ Task 2.7: Configure Objectives (1h)
- Recall → Application → Self-Explanation
- Tavus dashboard setup

### ⏳ Task 2.8: Extract Objectives (3h)
- Parse `objectives_completed`
- Calculate scores (0-100)

### ⏳ Task 2.9: Combined Score (2h)
- Formula: `audio*0.6 + visual*0.4`

### ⏳ Task 2.10: Console Log Data (1h)
- Log transcript, objectives, perception

---

## Phase 3: Persistence ⏳ PENDING

### ⏳ Task 3.1: Storage API Endpoint (3h)
- POST `/api/learning-checks`
- Auth validation
- **US-9**

### ⏳ Task 3.2: localStorage Fallback (2h)
- Testing mode storage
- 30-day expiration

### ⏳ Task 3.3: AWS Amplify DataStore (4h)
- Schema migration
- Production persistence

### ⏳ Task 3.4: Full Metadata Storage (2h)
- Transcript, objectives, perception

---

## Phase 4: AI Rubric ⏳ PENDING

### ⏳ Task 4.1: GPT-4 Mini Integration (3h)
- OpenAI API setup
- Prompt template
- **US-10**

### ⏳ Task 4.2: Generate Rubric (4h)
- Score, strengths, misconceptions, next steps
- Combine transcript + objectives + perception

### ⏳ Task 4.3: Identify Misconceptions (3h)
- Extract from transcript
- Link to topics

### ⏳ Task 4.4: Display Results UI (3h)
- Show rubric to learner
- Clear feedback

### ⏳ Task 4.5: Visual Engagement Insights (2h)
- Gaze, engagement level display

---

## Phase 5: Polish ⏳ PENDING

### ⏳ Task 5.1: Accessibility Features (3h)
- ARIA announcements
- Keyboard navigation
- Screen reader support

### ⏳ Task 5.2: Retry Flows (2h)
- Data reset
- Improved messaging

### ⏳ Task 5.3: Admin Dashboard (4h)
- View learner results
- Engagement metrics

### ⏳ Task 5.4: Performance Optimization (2h)
- Lazy loading
- Memoization

### ⏳ Task 5.5: Learner Perception Summary (2h)
- Privacy-friendly insights
- Positive framing

---

## Traceability Matrix

| User Story | Tasks | Status |
|------------|-------|--------|
| US-1: Quiz-Gated Access | 1.1 | ✅ |
| US-2: Hair Check | 1.2 | ✅ |
| US-3: Timer | 1.3 | ✅ |
| US-4: Engagement | 1.4 | ✅ |
| US-5: Conversation | 1.5 | ✅ |
| US-6: Termination | 1.6 | ✅ |
| US-7: Mark Complete | 1.7 | ✅ |
| US-8: Webhooks | 2.3-2.10 | ⏳ |
| US-9: Persistence | 3.1-3.4 | ⏳ |
| US-10: Rubric | 4.1-4.5 | ⏳ |

---

## Sign-Off

### Task Review Checklist

- [x] Phase 1 tasks completed and tested
- [ ] Phase 2 tasks defined with clear acceptance criteria
- [ ] Phase 3 tasks include database migration
- [ ] Phase 4 tasks include prompt engineering
- [ ] Phase 5 tasks include accessibility audit
- [ ] All tasks traceable to requirements

### Stakeholder Approval for Phase 2

- [ ] **Product Owner**: _____________________ Date: _____
- [ ] **Engineering Lead**: ___________________ Date: _____

---

**Status**: Phase 1 Complete | Ready for Phase 2 Implementation  
**Next Action**: Begin Task 2.1 (Generate Webhook Secret)
