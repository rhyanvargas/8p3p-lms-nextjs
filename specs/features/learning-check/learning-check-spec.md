# Feature Specification: Learning Check — Chapter-End Conversational Assessment

> **Product Requirements Document**  
> For technical implementation details, see [Implementation Guide](./learning-check-implementation.md)

---

## Overview

**Purpose**: Provide a conversational assessment at the end of each chapter using Tavus CVI to reinforce learning through natural dialogue with an AI avatar instructor.

**Goals**: 
- Validate learner comprehension through conversation vs. traditional testing
- Encourage self-explanation and application of concepts
- Track engagement quality and completion
- Gate chapter progression on meaningful interaction

---

## User Stories

### As a Learner
- **US-1**: I want to engage in a natural conversation about chapter content to demonstrate my understanding
- **US-2**: I want to see my remaining time and engagement progress during the session
- **US-3**: I want to verify my camera and microphone work before starting
- **US-4**: I want clear feedback on whether I've engaged enough to complete the learning check
- **US-5**: I want to AI to stay focused on the chapter content and redirect me if I go off-topic

### As an Instructor/Admin
- **US-6**: I want to ensure learners have passed the quiz before accessing the learning check
- **US-7**: I want to track engagement quality and session completion
- **US-8**: I want transcripts and rubric scores to identify learner misconceptions

---

## Functional Requirements

### 1. Placement & Triggering
- **Location**: Appears at the end of every chapter, after all video sections and the chapter quiz
- **Unlock Condition**: Learner must pass the current chapter quiz (≥ passing score) to access
- **Visual State**: Show locked state with clear message if quiz not passed

### 2. Time Management
- **Duration**: 3 minutes (180 seconds) hard limit
- **Timer Display**: Visible countdown timer showing minutes:seconds remaining
- **Hard Stop**: Session automatically ends at 0:00, no extensions
- **Warning**: Visual/audio notification at 30 seconds remaining (Assumption)

### 3. Audio/Video Gating
- **Hair Check**: Required camera and microphone verification before Start button enables
- **Permissions**: Handle browser permission denied states with clear instructions
- **Device Selection**: Allow learner to select camera/microphone if multiple available
- **Start Button**: Only enabled after successful Hair Check completion

### 4. Engagement Tracking
- **Threshold**: Minimum 90 seconds (50%) of active speaking/engagement out of 180 seconds
- **Calculation**: Track time when learner's microphone detects speech activity (Assumption: use Tavus/Daily.co audio level detection)
- **Progress Indicator**: Visual bar showing engagement progress toward 90s threshold
- **Completion Button**: "Mark Learning Check Complete" only visible after threshold met AND session ended

### 5. Conversation Behavior (AI Instructor Persona)
- **Persona Configuration**: Use Tavus dashboard persona ("8p3p - AI Instructor Assistant") with Olivia replica
- **Persona Context**: Base system prompt and knowledge base managed in Tavus dashboard for easy team updates
- **Chapter-Specific Context**: Inject dynamic context at conversation creation:
  - Current chapter title and learning objectives
  - Specific topics covered in this chapter
  - Emphasis on recall, application, and self-explanation prompts
- **Dialogue Style**: Natural, conversational, encouraging tone (configured in persona)
- **Prompt Types**: Must include at least:
  - 1 recall prompt (e.g., "Can you explain what bilateral stimulation means?")
  - 1 application prompt (e.g., "How would you apply this with a trauma client?")
  - 1 self-explanation prompt (e.g., "Why do you think this technique works?")
- **Quiz Protection**: Never reveal quiz answers or discuss specific quiz questions
- **Scope Enforcement**: Stay within current chapter content; politely redirect off-scope questions
- **Example Redirect**: "That's a great question about [topic], but let's focus on [chapter topic] for now."

### 6. Conversation Termination & Cost Management
**Critical**: Always end Tavus conversations to prevent unnecessary charges

#### Termination Triggers
1. **Timer Expiration**: Auto-terminate when 4-minute timer reaches 0:00
2. **User Action**: Manual "End Session" button click
3. **Page Navigation**: User navigates to different route/page
4. **Tab/Window Close**: User closes browser tab or window
5. **Connection Loss**: Network disconnection or Tavus connection failure
6. **Component Unmount**: React component cleanup when user leaves section

#### Cost Optimization
- Track conversation duration and log to analytics for cost monitoring
- Implement conversation pooling/queueing if multiple learners start simultaneously
- Set max concurrent sessions per account (Assumption: 10 concurrent for MVP)
- Monitor average session duration and adjust if learners consistently time out

### 7. UI Components (Modular)
**Location**: `src/components/course/chapter-content/`

#### Component Structure
- **LearningCheckContainer**: Main wrapper component
  - **Header**: Chapter title, "Learning Check" label
  - **ProgressBar**: Dual-purpose showing:
    - Time remaining (countdown)
    - Engagement progress (toward 120s threshold)
  - **HairCheck**: Camera/microphone verification component (from Tavus CVI library)
  - **ConversationView**: Tavus AI Avatar component
  - **ControlButtons**:
    - **Start**: Enabled after Hair Check passes
    - **End Session**: Always available during active session
    - **Mark Complete**: Visible only after engagement threshold met AND session ended

#### States
- **Locked**: Quiz not passed
- **Pre-session**: Hair Check in progress
- **Active**: Conversation in progress with timer
- **Ended (threshold not met)**: Session over, retry available
- **Ended (threshold met)**: Session over, complete button available
- **Completed**: Learning check marked complete

### 8. Analytics Events
**Minimal tracking for essential metrics**

| Event | Trigger | Data |
|-------|---------|------|
| `lc_started` | Start button clicked | chapterId, userId, timestamp |
| `lc_hair_check_ok` | Hair Check passes | chapterId, userId, deviceInfo |
| `lc_timeout` | Timer reaches 0:00 | chapterId, userId, engagementTime |
| `lc_user_end` | User clicks End Session | chapterId, userId, timeRemaining, engagementTime |
| `lc_completed` | Mark Complete clicked | chapterId, userId, engagementTime, rubric |
| `lc_blocked_not_passed` | Locked state shown | chapterId, userId, quizScore |
| `lc_terminated_navigation` | User navigated away | chapterId, userId, timeRemaining, terminationReason |
| `lc_terminated_connection` | Connection lost | chapterId, userId, timeRemaining, connectionState |
| `lc_terminated_manual` | Manual end (not timeout) | chapterId, userId, timeRemaining |
| `lc_perception_received` | Perception webhook received | conversationId, userId, perceptionDataSize |
| `lc_perception_parsed` | Perception data parsed successfully | conversationId, visualEngagementScore |

### 9. Accessibility & Privacy

#### Accessibility
- **Focus Management**: Modal traps focus, Esc key closes
- **Captions**: Enable closed captions for AI avatar speech (Tavus feature)
- **ARIA Announcements**: Screen reader alerts for:
  - Timer milestones (3:00, 2:00, 1:00, 0:30 remaining)
  - State changes (started, ended, completed)
  - Engagement threshold reached
- **Keyboard Navigation**: All controls accessible via keyboard
- **Color Contrast**: WCAG AA compliance for all text/UI

#### Privacy
- **Data Minimization**: Collect only essential data (transcript, engagement time, scores)
- **No Quiz Leakage**: AI never reveals quiz answers in conversation or transcript
- **Consent**: Inform learner that session is recorded for educational purposes (Assumption: add consent notice)
- **Data Retention**: Define retention policy for transcripts (Assumption: 90 days, then anonymize)
- **Visual Tracking Consent**: Inform learners that visual engagement is tracked
- **Opt-Out Option**: Provide audio-only mode for privacy concerns
- **Data Anonymization**: Remove PII from perception analysis
- **No Video Storage**: Never store raw video frames (only analysis summaries)

---

## MoSCoW Prioritization

### Must Have (MVP)
- ✅ Quiz-gated access
- ✅ Hair Check with AV verification
- ✅ 4-minute timer with hard stop
- ✅ Engagement tracking (≥120s threshold)
- ✅ Tavus persona reference with chapter context injection
- ✅ Conversation termination on all triggers (navigation, close, disconnect, timeout)
- ✅ Console logging of completion data
- ✅ Analytics events including termination tracking
- ✅ Mark Complete button gating

### Should Have (Post-MVP)
- 🔄 Rubric generation with AI analysis (incorporating perception data)
- 🔄 Retry option if engagement threshold not met
- 🔄 Transcript review UI for learners with perception insights
- 🔄 Admin dashboard for viewing rubrics and visual engagement metrics
- 🔄 Persistence to database/localStorage
- 🔄 Learner-facing perception summary ("You maintained 85% screen focus!")

### Could Have (Future)
- 💡 Adaptive conversation difficulty based on quiz performance and perception data
- 💡 Multi-language support
- 💡 Downloadable transcript and rubric PDF with perception insights
- 💡 Conversation history across all chapters with engagement trends
- 💡 Peer comparison analytics (visual vs. audio engagement patterns)
- 💡 Real-time perception feedback during conversation ("I notice you seem distracted...")
- 💡 Heatmap visualization of engagement over time

### Won't Have (Out of Scope)
- ❌ Text-only fallback (AV required for this feature)
- ❌ Group learning checks
- ❌ Live instructor takeover
- ❌ Custom avatar selection per learner

---

## Success Metrics

**Engagement**
- Average engagement time per session (target: ≥150s)
- Completion rate (target: ≥80% of learners who start)
- Retry rate (target: <20%)

**Learning Effectiveness** (Phase 2+)
- Correlation between rubric scores and next chapter quiz performance
- Misconception identification accuracy
- Learner satisfaction rating (post-session survey)

**Technical Performance**
- Hair Check success rate (target: ≥95%)
- Average time to conversation start (target: <3s)
- Session timeout rate (target: <10%)

---

## Open Questions

1. **Rubric Scoring**: Should rubric generation be real-time (during conversation) or post-session batch processing?
   - **Recommendation**: Post-session batch to avoid latency and allow full transcript analysis

2. **Retry Behavior**: If learner doesn't meet engagement threshold, can they retry immediately or wait 24 hours?
   - **Recommendation**: Immediate retry for MVP, add cooldown in Phase 2 if abuse detected

3. **Chapter Progression**: Does learner need to complete Learning Check to unlock next chapter, or is it optional?
   - **Recommendation**: Optional for MVP, required for Phase 2 (track completion rate first)

4. **Device Failure**: What if learner's camera/microphone fails mid-session?
   - **Recommendation**: Auto-pause session, show reconnection UI, resume timer when reconnected

5. **Conversation Quality**: Who reviews transcripts to validate AI instructor behavior?
   - **Recommendation**: Weekly sampling by instructional designer for first 2 weeks, then monthly

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Learner avoids speaking (low engagement) | Can't complete learning check | Clear instructions, progress bar, AI prompts "I'd love to hear your thoughts..." |
| AI goes off-script / reveals quiz answers | Compromises assessment integrity | Persona configuration in dashboard, chapter context injection, post-launch transcript review |
| Camera/mic permission denied | Can't start session | Clear permission instructions, browser-specific guides |
| Tavus API downtime | Learning check unavailable | Graceful error message, retry button, fallback to "mark as attempted" |
| Engagement tracking inaccurate | False positives/negatives | Test with multiple audio scenarios, manual review of edge cases |
| Conversation not terminated (cost leak) | Unnecessary Tavus charges | Multiple termination triggers, cleanup in useEffect, beforeunload listener, connection monitoring |
| User navigates mid-session | Lost session data + cost leak | Auto-save engagement data before termination, prompt "Are you sure?" modal |
| Perception analysis parsing fails | Incomplete engagement data | Regex fallback patterns, manual review queue, default to audio-only engagement |
| Webhook delivery fails/delays | Missing perception data | Implement retry logic, timeout after 30s, store partial data without perception |
| Privacy concerns with visual tracking | User discomfort/legal issues | Clear consent messaging, allow opt-out (audio-only mode), anonymize perception data |

---

**Implementation Priority**: High — Core learning engagement feature for MVP

**Estimated Total Effort**: 7-10 days (MVP through Phase 2 with Perception)
- Phase 1 (MVP): 2-3 days
- Phase 2 (Perception): 2 days
- Phase 3 (Persistence): 1 day
- Phase 4 (Rubric): 1-2 days
- Phase 5 (Polish): 1 day

**Risk Level**: Medium (depends on Tavus perception accuracy, engagement detection, and webhook reliability)

---

**Next Steps**: Review [Implementation Guide](./learning-check-implementation.md) for technical details and development phases
