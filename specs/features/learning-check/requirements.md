# Learning Check Feature — Requirements Specification

> **Feature Name**: Learning Check (Conversational Assessment)  
> **Status**: Ready for Implementation  
> **Last Updated**: 2025-11-04  
> **Version**: 1.0

---

## Inputs

| Input | Value |
|-------|-------|
| **FEATURE_NAME** | Learning Check (Conversational Assessment) |
| **BUSINESS_CONTEXT** | Move beyond traditional testing to assess true understanding through self-explanation and application in a low-stakes conversational format. Provides deeper insight into learner comprehension through natural dialogue. |
| **SCOPE** | Chapter-end conversational assessment using Tavus CVI with AI avatar instructor. Includes 5 implementation phases: MVP console logging, webhook integration, data persistence, rubric generation, and UX polish. |
| **TARGET_TIMELINE** | 7-10 days total (Phase 1 MVP: 2-3 days) |
| **STAKEHOLDERS** | Product Owner, Engineering Team, Instructional Design, QA, Learners |
| **DEPENDENCIES** | Tavus CVI API, Timer component, Quiz system (completion gate), Next.js 15, AWS Amplify backend |
| **NON_FUNCTIONAL_REQS** | 3-minute session limit, ≥95% Hair Check success rate, 99% webhook delivery rate, <3s conversation start time, WCAG AA accessibility compliance |

---

## Business Value

**Problem Statement**: Traditional multiple-choice quizzes cannot assess whether learners truly understand concepts or can apply them in real-world scenarios. We need to validate deeper comprehension through self-explanation and application.

**Proposed Solution**: Conversational assessment at chapter end using AI avatar instructor that conducts a 3-minute structured dialogue covering recall, application, and self-explanation.

**Expected Outcomes**:
- Improved learning outcomes through deeper comprehension validation
- Increased learner engagement with conversational format
- Better identification of misconceptions requiring remediation
- Reduced reliance on passive assessment methods

**Success Metrics**:
- ≥80% completion rate for learners who start
- ≥120s average engagement time (67% of session)
- <20% retry rate
- Correlation between rubric scores and next chapter quiz performance

---

## User Stories

### Epic: Conversational Assessment System

**As a learner**, I want to have a natural conversation with an AI instructor about what I learned, so that I can demonstrate my understanding in a low-pressure environment.

---

### US-1: Quiz-Gated Access

**As a learner**, I want the Learning Check to unlock only after passing the chapter quiz, so that I'm adequately prepared for the conversational assessment.

**Acceptance Criteria**:

```gherkin
Scenario: Learning Check locked when quiz not passed
  Given I am on a chapter page
  And I have not passed the chapter quiz
  When I navigate to the Learning Check section
  Then I should see a locked state message
  And the message should display my current quiz score
  And I should not be able to start the Learning Check

Scenario: Learning Check unlocked after passing quiz
  Given I am on a chapter page
  And I have passed the chapter quiz with ≥70%
  When I navigate to the Learning Check section
  Then I should see the Learning Check unlocked
  And I should see a "Start" button
  And the button should be disabled until Hair Check completes
```

**Priority**: Must Have (Phase 1)

---

### US-2: Hair Check (Device Verification)

**As a learner**, I want to verify my camera and microphone work before starting, so that I can ensure a smooth conversational experience.

**Acceptance Criteria**:

```gherkin
Scenario: Hair Check presents device verification
  Given the Learning Check is unlocked
  When I click "Start"
  Then I should see the Hair Check screen
  And I should see my camera preview
  And I should see microphone level indicator
  And I should be able to select different camera/mic devices

Scenario: Hair Check handles permission denial
  Given I am on the Hair Check screen
  When I deny camera or microphone permissions
  Then I should see a clear error message
  And the message should include browser-specific instructions
  And I should see a "Try Again" button

Scenario: Hair Check enables conversation start
  Given I am on the Hair Check screen
  And I have granted camera and microphone permissions
  When devices are successfully verified
  Then the "Join" button should be enabled
  And clicking "Join" should start the conversation
```

**Priority**: Must Have (Phase 1)

---

### US-3: Timed Conversation Session

**As a learner**, I want a 3-minute countdown timer during my conversation, so that I can manage my time effectively.

**Acceptance Criteria**:

```gherkin
Scenario: Timer starts on conversation begin
  Given I have completed Hair Check
  When the conversation starts
  Then I should see a countdown timer starting at 3:00
  And the timer should count down in MM:SS format
  And the timer should be visible throughout the conversation

Scenario: Timer auto-terminates at expiration
  Given the conversation is in progress
  When the timer reaches 0:00
  Then the conversation should automatically terminate
  And I should be shown my engagement time
  And analytics event "lc_timeout" should be logged

Scenario: Timer warning at 30 seconds (optional)
  Given the conversation is in progress
  When the timer reaches 0:30
  Then I should see a visual warning indicator
  And the timer color should change to orange
```

**Priority**: Must Have (Phase 1)

---

### US-4: Engagement Tracking

**As a learner**, I want my speaking time to be tracked, so that I can complete the assessment by meeting the minimum engagement threshold.

**Acceptance Criteria**:

```gherkin
Scenario: Engagement time tracked during conversation
  Given the conversation is in progress
  When I speak into my microphone
  Then my engagement time should increment
  And engagement time should be logged to console (Phase 1)
  And "handleTimerTick" should calculate elapsed time

Scenario: Completion gate requires minimum engagement
  Given the conversation has ended
  When my engagement time is ≥90 seconds
  Then I should see the "Mark Complete" button
  And the button should be enabled

Scenario: Retry available when threshold not met
  Given the conversation has ended
  When my engagement time is <90 seconds
  Then I should see a retry message
  And I should not see the "Mark Complete" button
  And I should be able to retry immediately
```

**Priority**: Must Have (Phase 1)

---

### US-5: AI Instructor Conversation

**As a learner**, I want to have a conversation with an AI instructor that asks about recall, application, and self-explanation, so that I can demonstrate comprehensive understanding.

**Acceptance Criteria**:

```gherkin
Scenario: Conversation uses configured persona
  Given the conversation starts
  Then the AI should use the "8p3p - AI Instructor Assistant" persona
  And the AI should use Olivia avatar replica
  And the greeting should reference the chapter title

Scenario: Conversation injects chapter context
  Given the conversation is created
  Then the AI should receive chapter title and learning objectives
  And the AI should know topics covered in the chapter
  And the AI should emphasize recall, application, self-explanation

Scenario: Conversation follows structured objectives (Phase 2)
  Given the conversation is in progress
  Then the AI should ask at least one recall question
  And then ask at least one application question
  And then ask at least one self-explanation question
  And the sequence should be: recall → application → self-explanation
```

**Priority**: Must Have (Phase 1 - basic; Phase 2 - structured objectives)

---

### US-6: Conversation Termination

**As the system**, I want conversations to always terminate properly, so that we prevent unnecessary Tavus API charges.

**Acceptance Criteria**:

```gherkin
Scenario: Timer expiration terminates conversation
  Given the conversation is active
  When the timer reaches 0:00
  Then an API call should be made to "/api/learning-checks/conversation/{id}/end"
  And the conversation should be terminated on Tavus
  And analytics event "lc_timeout" should be logged

Scenario: Manual end button terminates conversation
  Given the conversation is active
  When I click "End Session"
  Then the conversation should be terminated immediately
  And analytics event "lc_user_end" should be logged
  And my current engagement time should be saved

Scenario: Page navigation terminates conversation
  Given the conversation is active
  When I navigate to a different page
  Then navigator.sendBeacon() should call the termination endpoint
  And analytics event "lc_terminated_navigation" should be logged
  And the conversation should be terminated on Tavus

Scenario: Tab close terminates conversation
  Given the conversation is active
  When I close the browser tab
  Then beforeunload handler should trigger termination
  And navigator.sendBeacon() should be used for reliability
  And analytics event "lc_terminated_manual" should be logged

Scenario: Component unmount cleans up
  Given the conversation is active
  When the component unmounts
  Then useEffect cleanup should call handleEnd
  And the conversation should be properly terminated
```

**Priority**: Must Have (Phase 1) - Critical for cost management

---

### US-7: Mark Complete

**As a learner**, I want to mark the Learning Check complete after meeting requirements, so that my progress is tracked and I can continue to the next chapter.

**Acceptance Criteria**:

```gherkin
Scenario: Mark complete button appears after threshold met
  Given the conversation has ended
  And my engagement time is ≥90 seconds
  When results are displayed
  Then I should see "Mark Complete" button
  And the button should be prominent and accessible

Scenario: Mark complete updates progress
  Given I see the "Mark Complete" button
  When I click the button
  Then the Learning Check should be marked complete
  And analytics event "lc_completed" should be logged
  And my course progress should update
  And I should see a success confirmation
```

**Priority**: Must Have (Phase 1)

---

### US-8: Webhook Integration (Phase 2)

**As the system**, I want to receive and process Tavus webhooks, so that I can capture transcripts, objectives, and perception analysis.

**Acceptance Criteria**:

```gherkin
Scenario: Webhook endpoint receives transcription
  Given a conversation has ended
  When Tavus sends "application.transcription_ready" webhook
  Then the endpoint should verify HMAC-SHA256 signature
  And extract the full transcript
  And extract objectives_completed array
  And parse output variables (recall_key_terms, application_example, etc.)
  And calculate objective scores (0-100)

Scenario: Webhook endpoint receives perception analysis
  Given a conversation has ended
  And perception analysis is enabled
  When Tavus sends "application.perception_analysis" webhook
  Then the endpoint should parse gaze percentage using regex
  And map engagement level to score (high=90, medium=70, low=50)
  And detect note-taking boolean
  And calculate visual engagement score (0-100)
  And calculate combined score: audio*0.6 + visual*0.4

Scenario: Webhook delivery fails and retries
  Given Tavus attempts to send a webhook
  When the endpoint is temporarily unavailable
  Then Tavus should retry delivery
  And the system should log the failure
  And partial data should be stored if available
```

**Priority**: Should Have (Phase 2)

---

### US-9: Data Persistence (Phase 3)

**As the system**, I want to persist Learning Check results, so that instructors can review learner performance and identify struggling students.

**Acceptance Criteria**:

```gherkin
Scenario: Results stored after completion
  Given a Learning Check has completed
  When I click "Mark Complete"
  Then results should be stored in localStorage (testing)
  And results should migrate to database (production)
  And stored data should include: transcript, objectives, perception, engagement

Scenario: Results accessible for review
  Given Learning Check results are stored
  When an instructor views the learner's progress
  Then they should see engagement time and percentage
  And see objective scores (recall, application, self-explanation)
  And see visual engagement score (if available)
  And see identified misconceptions (Phase 4)
```

**Priority**: Should Have (Phase 3)

---

### US-10: AI Rubric Generation (Phase 4)

**As an instructor**, I want AI-generated rubrics for each Learning Check, so that I can quickly identify learner strengths and misconceptions.

**Acceptance Criteria**:

```gherkin
Scenario: Rubric generated from transcript and perception
  Given a Learning Check has completed
  When results are processed
  Then GPT-4 mini should analyze the full transcript
  And incorporate perception analysis data
  And incorporate objective completion scores
  And generate a rubric with: score, strengths, misconceptions, next steps

Scenario: Rubric displayed to learner
  Given a rubric has been generated
  When I complete the Learning Check
  Then I should see my overall score
  And see 2-3 key strengths identified
  And see misconceptions that need addressing
  And see recommended next steps for improvement
```

**Priority**: Could Have (Phase 4)

---

## Edge Cases and Negative Flows

### Edge Case: Connection Loss During Conversation

```gherkin
Scenario: Connection lost mid-session
  Given the conversation is active
  When the network connection is lost
  Then the system should attempt to reconnect
  And show a reconnection UI to the learner
  And pause the timer during reconnection
  And analytics event "lc_terminated_connection" should be logged
  And the conversation should terminate if reconnection fails after 30s
```

---

### Edge Case: Learner Remains Silent

```gherkin
Scenario: Learner speaks less than 90 seconds
  Given the conversation is active
  When the timer expires
  And my engagement time is <90 seconds
  Then I should see a message explaining the threshold
  And be offered an immediate retry
  And see tips for engaging more in the conversation
```

---

### Edge Case: Tavus API Downtime

```gherkin
Scenario: Tavus API unavailable at conversation creation
  Given I click "Join" after Hair Check
  When the Tavus API is unavailable
  Then I should see a clear error message
  And be offered a "Try Again" button
  And the error should be logged to analytics
  And fallback message should suggest trying again later
```

---

### Edge Case: Webhook Delivery Failure

```gherkin
Scenario: Webhook never arrives
  Given a conversation has ended
  When the webhook is not received within 30 seconds
  Then the system should log a timeout warning
  And store partial data (engagement time, duration)
  And display results with "analysis pending" message
  And queue for manual review if webhook is critical
```

---

## Non-Functional Requirements

### Performance

- **Conversation Start Time**: <3 seconds from "Join" click to AI greeting
- **Hair Check Load Time**: <2 seconds to display camera preview
- **Timer Accuracy**: ±1 second over 3-minute session
- **Webhook Processing**: <500ms to parse and store results

### Reliability

- **Hair Check Success Rate**: ≥95% (across Chrome, Safari, Firefox)
- **Webhook Delivery Rate**: 99% (with retry logic)
- **Termination Success Rate**: 100% (all triggers must work)
- **Uptime**: 99.9% (excluding Tavus API dependency)

### Scalability

- **Concurrent Sessions**: Support up to 10 simultaneous Learning Checks (configurable)
- **Storage Growth**: Plan for 1000+ Learning Check results per course
- **Webhook Volume**: Handle bursts of 100+ webhooks during peak usage

### Security

- **API Keys**: Store Tavus API key server-side only (never expose to client)
- **Webhook Verification**: HMAC-SHA256 signature verification for all webhooks
- **Permissions**: Camera/mic permissions requested only when needed
- **Data Privacy**: Never store raw video frames (only analysis summaries)

### Accessibility

- **WCAG AA Compliance**: 4.5:1 color contrast for all text
- **Keyboard Navigation**: All controls accessible via Tab, Enter, Esc
- **Screen Reader Support**: ARIA announcements for timer milestones and state changes
- **Captions**: Closed captions for AI avatar speech (Tavus native feature)

### Cost Management

- **Conversation Termination**: 100% termination rate to prevent runaway costs
- **Session Duration**: Hard 3-minute limit (no exceptions)
- **Concurrent Session Limit**: Configurable maximum (default: 10)
- **Monitoring**: Alert if costs exceed $X per day

---

## MoSCoW Prioritization

### Must Have (Phase 1 - MVP)
- ✅ Quiz-gated access
- ✅ Hair Check with AV verification
- ✅ 3-minute countdown timer with hard stop
- ✅ Engagement time tracking (≥90s threshold)
- ✅ Tavus persona with chapter context injection
- ✅ All 6 termination triggers
- ✅ Console logging for debugging
- ✅ Analytics events (13 events)

### Should Have (Phase 2)
- 🔄 Webhook endpoint (`/api/webhooks/tavus`)
- 🔄 Webhook signature verification
- 🔄 Perception analysis parsing
- 🔄 Objectives tracking and scoring
- 🔄 Combined engagement score (audio 60% + visual 40%)
- 🔄 Retry flows with data reset

### Could Have (Phase 3-4)
- 💡 Database persistence (vs localStorage)
- 💡 AI rubric generation (GPT-4 mini)
- 💡 Transcript review UI
- 💡 Admin dashboard with metrics
- 💡 Learner-facing perception summary

### Won't Have (Out of Scope)
- ❌ Text-only fallback (audio/video required)
- ❌ Group learning checks
- ❌ Live instructor takeover
- ❌ Custom avatar selection per learner
- ❌ Adaptive difficulty based on performance

---

## Dependencies and Integration Points

### External Dependencies
- **Tavus CVI API**: Conversation creation, termination, webhooks
- **Tavus Raven Model**: Perception analysis (Phase 2)
- **GPT-4 Mini**: Rubric generation (Phase 4)

### Internal Dependencies
- **Timer Component**: `src/components/common/timer.tsx`
- **Quiz System**: Completion status and score for gating
- **Course Progress**: Update completion status on "Mark Complete"
- **Analytics System**: 13 custom events for tracking

### API Routes
- **POST** `/api/learning-checks/conversation` - Create Tavus conversation
- **POST** `/api/learning-checks/conversation/:id/end` - Terminate conversation
- **POST** `/api/webhooks/tavus` - Handle Tavus webhook callbacks
- **POST** `/api/learning-checks` - Store completion data (Phase 3)

---

## Open Questions

1. **Rubric Scoring**: Real-time or post-session batch processing?
   - **Recommendation**: Post-session batch (avoid latency, allow full analysis)
   - **Decision Needed**: Approval from Product Owner

2. **Retry Behavior**: Immediate retry or 24-hour cooldown?
   - **Recommendation**: Immediate retry for MVP, add cooldown if abuse detected
   - **Decision Needed**: Monitor abuse patterns after launch

3. **Chapter Progression**: Is Learning Check completion required to unlock next chapter?
   - **Recommendation**: Optional for MVP, required Phase 2+ after data analysis
   - **Decision Needed**: Product Owner approval

4. **Warning Notification**: Implement 30-second warning?
   - **Recommendation**: Yes - low implementation cost, high UX value
   - **Decision Needed**: Approval for Phase 1 or defer to Phase 5

5. **Conversation Quality**: Who reviews transcripts to validate AI behavior?
   - **Recommendation**: Instructional designer weekly for first 2 weeks, then monthly
   - **Decision Needed**: Assign responsibility and schedule

---

## Success Criteria

This feature will be considered successful when:

1. ✅ **All Phase 1 acceptance criteria pass** (US-1 through US-7)
2. ✅ **≥95% Hair Check success rate** (across major browsers)
3. ✅ **100% conversation termination rate** (all 6 triggers working)
4. ✅ **≥80% learner completion rate** (of those who start)
5. ✅ **<3s conversation start time** (from "Join" to AI greeting)
6. ✅ **0 cost leaks** (no unterminated conversations in production)
7. ✅ **WCAG AA compliance** (accessibility audit passes)
8. ✅ **13 analytics events firing** (verified in production)

---

## Sign-Off

### Requirements Review Checklist

- [ ] All user stories have clear acceptance criteria in Gherkin format
- [ ] Edge cases and negative flows documented
- [ ] Non-functional requirements defined and measurable
- [ ] MoSCoW prioritization completed
- [ ] Dependencies and integration points identified
- [ ] Open questions documented with recommendations
- [ ] Success criteria are clear and testable

### Stakeholder Approval

- [ ] **Product Owner**: _____________________ Date: _____
- [ ] **Engineering Lead**: ___________________ Date: _____
- [ ] **Instructional Design**: ________________ Date: _____
- [ ] **QA Lead**: ___________________________ Date: _____

---

**Document Status**: Ready for Design Phase  
**Next Step**: Create design.md with technical architecture
