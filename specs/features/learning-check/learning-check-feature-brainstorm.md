# Learning Check Feature — Consolidated Brainstorm

> **Status**: MVP Implementation Ready  
> **Priority**: High — Core LMS Assessment Feature  
> **Updated**: 2025-11-01

---

## Executive Summary

**What**: Conversational assessment at the end of each chapter using Tavus CVI with AI avatar instructor that validates comprehension through natural dialogue while tracking both audio and visual engagement.

**Why**: Move beyond traditional testing to assess true understanding through self-explanation and application in a low-stakes conversational format.

**How**: 3-minute time-limited conversation with AI avatar, requiring ≥90 seconds (50%) engagement across 3 structured objectives (recall, application, self-explanation).

---

## Core Requirements

### 1. Access & Placement

- **Location**: End of every chapter, after video sections and chapter quiz
- **Unlock Condition**: Must pass chapter quiz (≥70%) to access
- **Locked State**: Show clear message with quiz score when not accessible

### 2. Time Management

- **Duration**: **3 minutes (180 seconds)** hard limit
- **Display**: Countdown timer (MM:SS format)
- **Hard Stop**: Auto-terminate at 0:00, no extensions
- **Warning**: Optional 30-second warning notification

### 3. Engagement Tracking

- **Threshold**: **≥90 seconds (50%)** active speaking/engagement required
- **Audio Detection**: Track when learner's microphone detects speech activity
- **Visual Detection** (Phase 2): Perception analysis via Tavus Raven model
- **Timer Display**: Countdown timer showing time remaining (3:00 → 0:00)
- **Completion Gate**: "Mark Complete" button only appears when threshold met AND session ended

### 4. Device Requirements

- **Hair Check**: Required camera + microphone verification before session start
- **Permissions**: Handle denied browser permissions with clear instructions
- **Device Selection**: Allow camera/mic selection if multiple devices available
- **Start Button**: Only enabled after successful Hair Check

### 5. Conversation Behavior

- **Persona**: "8p3p - AI Instructor Assistant" (configured in Tavus dashboard)
- **Replica**: Olivia avatar
- **Base Prompt**: Managed in Tavus dashboard for easy team updates
- **Chapter Context**: Injected dynamically at conversation creation:
  - Chapter title + learning objectives
  - Topics covered in this chapter
  - Emphasis on recall, application, self-explanation

### 6. Assessment Objectives (Tavus Objectives System)

**Sequential Flow**: recall → application → self-explanation

| Objective                       | Prompt Type                               | Output Variables                           | Scoring |
| ------------------------------- | ----------------------------------------- | ------------------------------------------ | ------- |
| **Recall Assessment**           | "Explain what [key concept] means"        | `recall_key_terms`, `recall_score`         | 0-100   |
| **Application Assessment**      | "How would you apply this with a client?" | `application_example`, `application_score` | 0-100   |
| **Self-Explanation Assessment** | "Why do you think this technique works?"  | `explanation_summary`, `explanation_score` | 0-100   |

**Completion Criteria**:

- All 3 objectives marked "completed" by Tavus AI
- Average score ≥70% across all objectives
- Time engagement ≥90s

### 7. Conversation Termination (Cost Management)

**Critical**: Always end conversations to prevent unnecessary Tavus charges

**Termination Triggers**:

1. Timer expiration (0:00)
2. User clicks "End Session" button
3. Page navigation (route change)
4. Tab/window close (beforeunload)
5. Connection loss (network failure)
6. Component unmount (React cleanup)

**Termination Method**:

- API call to `/api/learning-checks/terminate`
- Use `navigator.sendBeacon()` for navigation/close events (reliability)
- Log termination reason for analytics

---

## Technical Architecture

### Data Flow

```
1. Quiz Passed → Unlock Learning Check
2. Hair Check → Verify AV → Enable Start Button
3. Create Conversation → Inject Chapter Context + Objectives
4. Active Session → Track Time + Engagement + Objectives
5. Session End → Webhook Callbacks → Parse Results
6. Display Results → Show Scores + Feedback
7. Mark Complete → Update Progress
```

### Webhook Integration

**Webhook URL**: `/api/webhooks/tavus`

**Events Handled**:

- `application.transcription_ready`: Full transcript + objectives completed
- `application.perception_analysis`: Visual engagement analysis (Phase 2)
- `system.shutdown`: Conversation lifecycle tracking

**Webhook Security**:

- HMAC-SHA256 signature verification
- Use `TAVUS_WEBHOOK_SECRET` from environment

**Webhook Processing**:

- Extract `objectives_completed` array
- Parse perception analysis text → structured data
- Calculate engagement scores (audio 60% + visual 40%)
- Store results (localStorage MVP → database Phase 3)

### Component Structure

**Location**: `src/components/course/chapter-content/`

```
LearningCheckContainer
├── Header (Chapter title, "Learning Check" label)
├── Timer (countdown: 3:00 → 0:00)
├── HairCheck (Tavus CVI component)
├── ConversationView (Tavus AI Avatar)
└── ControlButtons
    ├── Start (enabled after Hair Check)
    ├── End Session (always available during session)
    └── Mark Complete (visible after threshold met + ended)
```

**Component States**:

1. **Locked**: Quiz not passed
2. **Pre-session**: Hair Check in progress
3. **Active**: Conversation in progress
4. **Ended (threshold not met)**: Retry available
5. **Ended (threshold met)**: Complete button available
6. **Completed**: Learning check marked complete
7. **Processing**: Waiting for webhook results

### API Routes

| Route                               | Method | Purpose                         |
| ----------------------------------- | ------ | ------------------------------- |
| `/api/learning-checks/conversation` | POST   | Create Tavus conversation       |
| `/api/learning-checks/terminate`    | POST   | Terminate active conversation   |
| `/api/webhooks/tavus`               | POST   | Handle Tavus webhook callbacks  |
| `/api/learning-checks`              | POST   | Store completion data (Phase 3) |

---

## Perception Analysis (Phase 2)

### Perception Queries (Configured in Tavus Dashboard)

1. **Screen Gaze**: "On a scale of 1-100, how often was the learner looking at the screen?"
2. **Engagement Level**: "What was the learner's overall engagement? (attentive/distracted/thoughtful/confused)"
3. **Comprehension Indicators**: "Were there visual indicators of comprehension struggles?"
4. **Note-Taking**: "Did the learner appear to be taking notes or referencing materials?"
5. **Distractions**: "Was there indication of multiple people present or distractions?"
6. **Body Language**: "How would you rate body language and facial expressions?"

### Perception Data Processing

**Webhook Event**: `application.perception_analysis`

**Parsing Strategy**:

- Use regex to extract gaze percentage: `/(\d+)%/`
- Map engagement level to score: high=90, medium=70, low=50
- Detect note-taking: boolean flag
- Calculate visual engagement score (0-100)

**Combined Engagement Score**:

```typescript
const combinedScore = audioEngagement * 0.6 + visualEngagement * 0.4;
```

**Privacy Requirements**:

- Inform learners about visual tracking
- Provide audio-only opt-out mode
- Never store raw video frames (only analysis summaries)
- 90-day retention policy
- Anonymize perception data

---

## Analytics Events

**Total Events**: 13

| Event                      | Trigger                  | Data Captured                 |
| -------------------------- | ------------------------ | ----------------------------- |
| `lc_started`               | Start clicked            | chapterId, userId, timestamp  |
| `lc_hair_check_ok`         | Hair Check passed        | deviceInfo                    |
| `lc_timeout`               | Timer → 0:00             | engagementTime, thresholdMet  |
| `lc_user_end`              | Manual end               | timeRemaining, engagementTime |
| `lc_completed`             | Mark complete            | scores, engagementPercent     |
| `lc_blocked_not_passed`    | Locked shown             | quizScore                     |
| `lc_terminated_navigation` | Page navigation          | timeRemaining, reason         |
| `lc_terminated_connection` | Connection lost          | connectionState               |
| `lc_terminated_manual`     | Manual end (not timeout) | timeRemaining                 |
| `lc_perception_received`   | Perception webhook       | perceptionDataSize            |
| `lc_perception_parsed`     | Parsing successful       | visualEngagementScore         |
| `lc_objectives_received`   | Objectives webhook       | objectivesCompleted           |
| `lc_rubric_generated`      | AI rubric done           | rubricData                    |

---

## Implementation Phases

### Phase 1: MVP (2-3 days) — Console Logging

- [x] Locked/unlocked states based on quiz
- [x] Hair Check integration
- [x] Tavus conversation with chapter context + persona
- [x] Timer component (countdown display)
- [x] Button state logic
- [x] Console log basic data (no perception yet)
- [x] Termination on all triggers

### Phase 2: Perception & Objectives (2 days) — Webhook Integration

- [ ] Generate webhook secret (`crypto.randomBytes(32)`)
- [ ] Set up ngrok for local webhook URL
- [ ] Create `/api/webhooks/tavus` endpoint
- [ ] Implement webhook signature verification
- [ ] Configure perception queries in Tavus dashboard
- [ ] Parse perception analysis text → structured data
- [ ] Configure objectives in Tavus persona
- [ ] Extract and score objectives from webhook
- [ ] Calculate combined engagement score (audio + visual)
- [ ] Console log enriched data

### Phase 3: Persistence (1 day) — Data Storage

- [ ] Create `/api/learning-checks` POST endpoint
- [ ] Store in localStorage (testing)
- [ ] Migrate to database when available
- [ ] Include transcript, objectives, perception data

### Phase 4: Rubric & Feedback (1-2 days) — AI Analysis

- [ ] Integrate GPT-4 mini for transcript analysis
- [ ] Generate rubric with perception + objectives
- [ ] Identify misconceptions
- [ ] Display combined results to learner
- [ ] Show visual engagement insights

### Phase 5: Polish & Analytics (1 day) — UX Enhancement

- [ ] Accessibility features (ARIA, captions, keyboard)
- [ ] Retry flows with data reset
- [ ] Admin dashboard with visual engagement metrics
- [ ] Performance optimization
- [ ] Learner-facing perception summary

**Total Estimated Effort**: 7-10 days

---

## Data Structures

### Learning Check Result Interface

```typescript
interface LearningCheckResult {
	// Identifiers
	id: string;
	userId: string;
	chapterId: string;
	conversationId: string;

	// Timing
	startedAt: Date;
	endedAt: Date;
	duration: number; // seconds

	// Engagement
	engagementTime: number; // seconds of active speaking
	engagementPercent: number; // 0-100
	thresholdMet: boolean; // ≥90s

	// Audio Engagement (Phase 1)
	audioEngagementTime: number;
	audioEngagementPercent: number;

	// Visual Engagement (Phase 2)
	visualEngagementScore?: number; // 0-100
	gazePercentage?: number; // 0-100
	noteTaking?: boolean;
	comprehensionIndicators?: string;

	// Combined Score (Phase 2)
	combinedEngagementScore?: number; // audio*0.6 + visual*0.4

	// Objectives (Phase 2)
	objectivesCompleted: number; // 0-3
	recallScore?: number; // 0-100
	applicationScore?: number; // 0-100
	explanationScore?: number; // 0-100
	overallScore?: number; // average of 3 scores

	// Output Variables
	recallKeyTerms?: string;
	applicationExample?: string;
	explanationSummary?: string;

	// Rubric (Phase 4)
	rubric?: {
		score: number;
		strengths: string[];
		misconceptions: string[];
		nextSteps: string[];
	};

	// Metadata
	transcript: ConversationMessage[];
	endReason:
		| "timeout"
		| "manual"
		| "navigation"
		| "connection_loss"
		| "completed";
	completed: boolean;
}

interface ConversationMessage {
	role: "user" | "assistant";
	content: string;
	timestamp?: string;
}
```

---

## Environment Variables

```bash
# Required
TAVUS_API_KEY=required
TAVUS_PERSONA_ID=required # "8p3p - AI Instructor Assistant"

# Configuration
TAVUS_LEARNING_CHECK_DURATION=180 # 3 minutes in seconds
TAVUS_ENGAGEMENT_THRESHOLD=90 # 50% of duration
TAVUS_MAX_CONCURRENT_SESSIONS=10

# Webhooks (Phase 2)
TAVUS_WEBHOOK_SECRET=required # crypto.randomBytes(32).toString('hex')
TAVUS_WEBHOOK_URL=required # https://your-app.com/api/webhooks/tavus

# Objectives & Guardrails (Phase 2)
NEXT_PUBLIC_TAVUS_LEARNING_CHECK_OBJECTIVES_ID=required
NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID=required

# Features
TAVUS_PERCEPTION_ENABLED=true # Toggle perception analysis
LEARNING_CHECK_PASS_THRESHOLD=70 # Minimum average score %
```

---

## Success Metrics

### Engagement Metrics

- **Average engagement time**: Target ≥120s (67% of 180s)
- **Completion rate**: Target ≥80% of learners who start
- **Retry rate**: Target <20%

### Learning Effectiveness (Phase 2+)

- Correlation between rubric scores and next chapter quiz performance
- Misconception identification accuracy
- Learner satisfaction rating (post-session survey)

### Technical Performance

- **Hair Check success rate**: Target ≥95%
- **Time to conversation start**: Target <3s
- **Session timeout rate**: Target <10%
- **Webhook delivery rate**: Target 99%
- **Perception parsing accuracy**: Target ±5% for gaze tracking

### Objectives Completion (Phase 2+)

- **Average objective completion**: Target >80%
- **Average scores per objective type**: Track recall vs. application vs. explanation
- **Time to complete each objective**: Identify pacing issues

---

## Risk Mitigation

| Risk                                      | Impact                    | Mitigation                                                        |
| ----------------------------------------- | ------------------------- | ----------------------------------------------------------------- |
| Learner avoids speaking (low engagement)  | Can't complete            | Clear instructions, timer visibility, AI prompts                  |
| AI goes off-script / reveals quiz answers | Assessment integrity      | Persona config, context injection, transcript review              |
| Camera/mic permission denied              | Can't start               | Clear permission guides, browser-specific help                    |
| Tavus API downtime                        | Feature unavailable       | Error message, retry button, fallback to "attempted"              |
| Engagement tracking inaccurate            | False positives/negatives | Test multiple audio scenarios, manual review                      |
| Conversation not terminated               | Cost leak                 | Multiple termination triggers, cleanup in useEffect, beforeunload |
| User navigates mid-session                | Lost data + cost          | Auto-save before termination, "Are you sure?" modal               |
| Perception parsing fails                  | Incomplete data           | Regex fallback, manual review queue, audio-only mode              |
| Webhook delivery fails                    | Missing data              | Retry logic, 30s timeout, store partial data                      |
| Privacy concerns with visual tracking     | User discomfort           | Clear consent, opt-out option, anonymize data                     |

---

## Accessibility Requirements

### Visual

- **Focus Management**: Modal traps focus during session
- **Keyboard Navigation**: All controls keyboard accessible (Tab, Enter, Esc)
- **Color Contrast**: WCAG AA compliance (4.5:1 for text)
- **Screen Reader**: ARIA announcements for timer milestones (3:00, 2:00, 1:00, 0:30) and state changes

### Audio

- **Captions**: Closed captions for AI avatar speech (Tavus feature)
- **Transcripts**: Full transcript available post-session

### Interaction

- **Esc Key**: Closes modal (with confirmation if active session)
- **Pause/Resume**: Not available (hard time limit enforced)

---

## Testing Strategy

### Phase 1 Testing (Manual Q&A)

1. **Locked State**: Verify quiz-gating works
2. **Hair Check**: Test AV permissions and device selection
3. **Conversation Start**: Verify timer starts countdown
4. **Active Session**: Monitor timer countdown and engagement logging
5. **Timer Expiration**: Test auto-termination at 0:00
6. **Manual End**: Test "End Session" button
7. **Threshold Not Met**: Verify retry flow
8. **Threshold Met**: Verify completion flow
9. **Navigation**: Test conversation termination on route change
10. **Tab Close**: Test beforeunload handler

### Phase 2 Testing (Webhook Integration)

11. **Webhook Delivery**: Verify all events received
12. **Perception Parsing**: Test regex extraction accuracy
13. **Objectives Extraction**: Verify scoring calculation
14. **Combined Score**: Validate audio + visual formula
15. **Error Handling**: Test webhook failures and retries

### Automated Testing (Post-MVP)

- Unit tests for score calculations
- Integration tests for webhook handling
- E2E tests for complete flow
- Accessibility audits (axe-core)

---

## Open Questions & Decisions Needed

1. **Rubric Scoring**: Real-time or post-session batch processing?
   - **Recommendation**: Post-session batch (avoid latency, allow full analysis)

2. **Retry Behavior**: Immediate retry or 24-hour cooldown?
   - **Recommendation**: Immediate retry for MVP, add cooldown if abuse detected

3. **Chapter Progression**: Is completion required to unlock next chapter?
   - **Recommendation**: Optional for MVP (track completion rate first), required Phase 2+

4. **Device Failure**: Auto-pause or terminate on mid-session device failure?
   - **Recommendation**: Auto-pause, show reconnection UI, resume timer when reconnected

5. **Conversation Quality**: Who reviews transcripts to validate AI behavior?
   - **Recommendation**: Weekly sampling by instructional designer (first 2 weeks), then monthly

6. **Warning Notification**: Implement 30-second warning?
   - **Decision needed**: Yes/No for MVP

---

## MoSCoW Prioritization

### Must Have (MVP — Phase 1)

- ✅ Quiz-gated access
- ✅ Hair Check with AV verification
- ✅ 3-minute timer with hard stop
- ✅ Engagement tracking (≥90s threshold)
- ✅ Tavus persona reference with chapter context
- ✅ All termination triggers
- ✅ Console logging
- ✅ Analytics events

### Should Have (Phase 2)

- 🔄 Perception analysis integration
- 🔄 Objectives tracking and scoring
- 🔄 Combined engagement score (audio + visual)
- 🔄 Webhook infrastructure
- 🔄 Retry flows
- 🔄 Persistence (localStorage → database)

### Could Have (Phase 4+)

- 💡 Rubric generation with AI
- 💡 Transcript review UI with perception insights
- 💡 Admin dashboard with visual engagement metrics
- 💡 Learner-facing perception summary
- 💡 Downloadable PDFs
- 💡 Multi-language support

### Won't Have (Out of Scope)

- ❌ Text-only fallback (AV required)
- ❌ Group learning checks
- ❌ Live instructor takeover
- ❌ Custom avatar selection per learner
- ❌ Adaptive difficulty (future enhancement)

---

## References

### Official Documentation

- [Tavus Objectives](https://docs.tavus.io/sections/conversational-video-interface/persona/objectives.md)
- [Tavus Webhooks](https://docs.tavus.io/sections/webhooks-and-callbacks.md)
- [Tavus Conversation API](https://docs.tavus.io/api-reference/conversations/create-conversation.md)
- [Tavus Perception Layer](https://docs.tavus.io/sections/conversational-video-interface/perception-layer.md)

### Internal Documentation

- [Product Spec](./learning-check-spec.md)
- [Technical Implementation](./learning-check-implementation.md)
- [Objective Tracking](./objective-completion-tracking.md)
- [Testing Guide](./TESTING.md)

---

## Next Steps

1. ✅ Review consolidated brainstorm for alignment
2. ✅ Duration confirmed: 3 minutes (180 seconds)
3. ✅ Engagement threshold: 90 seconds (50%)
4. ⏳ Begin Phase 1 MVP implementation
5. ⏳ Set up development environment (ngrok for webhooks)
6. ⏳ Configure Tavus persona with objectives and perception queries

---

**Status**: Ready for Implementation  
**Last Updated**: 2025-11-01  
**Document Owner**: Development Team
