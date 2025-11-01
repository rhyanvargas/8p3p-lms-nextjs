# Feature Specification: Learning Check Objective Completion Tracking

> **Product Requirements Document**

---

## Overview

**Purpose**: Track and measure completion of structured learning objectives during Tavus conversational assessments.

**Goals**:

- Validate learner met all required assessment objectives (recall, application, self-explanation)
- Collect structured assessment data (scores, key terms, examples)
- Provide measurable completion criteria beyond time engagement
- Enable data-driven insights into learner comprehension

**Status**: MVP Implementation Phase

---

## User Stories

### As a Learner

- **US-1**: I want to know which assessment objectives I've completed during the conversation
- **US-2**: I want to receive feedback on my performance after the learning check ends
- **US-3**: I want clear criteria for what constitutes successful completion

### As an Instructor

- **US-4**: I want to see which objectives each learner completed
- **US-5**: I want to review collected assessment data (key terms recalled, application examples)
- **US-6**: I want to track learner scores across different assessment dimensions

### As a System

- **US-7**: I need to receive objective completion notifications from Tavus
- **US-8**: I need to store completion data for reporting and analytics

---

## Functional Requirements

### 1. Objectives Structure

**Configuration**: `src/lib/tavus/config.ts`

```typescript
LEARNING_CHECK_OBJECTIVES = {
	data: [
		{
			objective_name: "recall_assessment",
			objective_prompt: "Ask recall question about key concepts",
			output_variables: ["recall_key_terms", "recall_score"],
			confirmation_mode: "auto",
			next_required_objectives: ["application_assessment"],
		},
		{
			objective_name: "application_assessment",
			objective_prompt: "Ask application question about realistic scenarios",
			output_variables: ["application_example", "application_score"],
			confirmation_mode: "auto",
			next_required_objectives: ["self_explanation_assessment"],
		},
		{
			objective_name: "self_explanation_assessment",
			objective_prompt: "Ask self-explanation prompt for deeper understanding",
			output_variables: ["explanation_summary", "explanation_score"],
			confirmation_mode: "auto",
		},
	],
};
```

**Requirements**:

- ✅ All 3 objectives configured in Tavus
- ✅ Sequential flow: recall → application → self-explanation
- ✅ Auto-confirmation mode (AI determines completion)
- ✅ Output variables defined for data collection

**Reference**: [Tavus Objectives Documentation](https://docs.tavus.io/sections/conversational-video-interface/persona/objectives.md)

---

### 2. Webhook Integration

**Tracking Method**: End-of-conversation webhook (MVP approach)

#### Webhook Event: `application.transcription_ready`

**Received After**: Conversation ends (time limit or manual end)

**Payload Structure**:

```json
{
	"conversation_id": "c0b934942640d424",
	"event_type": "application.transcription_ready",
	"properties": {
		"objectives_completed": [
			{
				"objective_name": "recall_assessment",
				"status": "completed",
				"output_variables": {
					"recall_key_terms": "bilateral stimulation, AIP model",
					"recall_score": 85
				}
			}
		],
		"transcript": [
			/* full conversation */
		]
	}
}
```

**Webhook Endpoint**: `/api/webhooks/tavus`

**Requirements**:

- ✅ Webhook URL configured in `.env.local`
- ✅ Secure webhook endpoint (signature verification recommended)
- ✅ Handle multiple webhook event types
- ✅ Extract `objectives_completed` array from payload

**Reference**: [Tavus Webhooks Documentation](https://docs.tavus.io/sections/webhooks-and-callbacks.md)

---

### 3. Data Collection & Storage

**Collected Data Per Objective**:

| Field                 | Type   | Example                                        | Source            |
| --------------------- | ------ | ---------------------------------------------- | ----------------- |
| `objective_name`      | string | "recall_assessment"                            | Tavus             |
| `status`              | string | "completed"                                    | Tavus             |
| `recall_key_terms`    | string | "bilateral stimulation, AIP"                   | Tavus AI analysis |
| `recall_score`        | number | 85                                             | Tavus AI scoring  |
| `application_example` | string | "Using eye movements during trauma processing" | Tavus AI analysis |
| `application_score`   | number | 90                                             | Tavus AI scoring  |
| `explanation_summary` | string | "EMDR helps process traumatic memories..."     | Tavus AI analysis |
| `explanation_score`   | number | 88                                             | Tavus AI scoring  |

**Storage Requirements** (Post-MVP):

```typescript
interface LearningCheckResult {
	id: string;
	userId: string;
	chapterId: string;
	conversationId: string;

	// Objectives completion
	recallScore: number;
	applicationScore: number;
	explanationScore: number;
	overallScore: number;

	// Output variables
	recallKeyTerms: string;
	applicationExample: string;
	explanationSummary: string;

	// Metadata
	transcript: ConversationMessage[];
	duration: number;
	objectivesCompleted: number;
	completedAt: Date;
}
```

---

### 4. Completion Criteria

**Successful Completion Requirements**:

- ✅ All 3 objectives marked as "completed" by Tavus AI
- ✅ Minimum score threshold: 70% average across all objectives (configurable)
- ✅ Time engagement: ≥90 seconds (existing requirement)

**Scoring Calculation**:

```typescript
const averageScore = (recall_score + application_score + explanation_score) / 3;

const passed = averageScore >= 70; // Configurable threshold
```

---

### 5. User Feedback

**After Conversation Ends**:

1. **Processing State** (5-10 seconds)
   - Show loading spinner
   - Message: "Analyzing your learning check..."
   - Wait for webhook to arrive

2. **Results Display**
   - Overall score (0-100)
   - Individual objective scores
   - Key insights collected
   - Pass/Fail status
   - Option to review transcript (Post-MVP)

**Example UI**:

```
┌────────────────────────────────────────┐
│  Learning Check Complete! ✅            │
│                                        │
│  Overall Score: 87%                    │
│                                        │
│  📚 Recall Assessment: 85%             │
│  ✓ Key terms identified                │
│                                        │
│  🎯 Application: 90%                   │
│  ✓ Real-world example provided         │
│                                        │
│  💡 Self-Explanation: 88%              │
│  ✓ Demonstrated understanding          │
│                                        │
│  [Continue to Next Chapter] →         │
└────────────────────────────────────────┘
```

---

## Technical Implementation

### Phase 1: MVP (Current Sprint)

**Scope**: End-of-conversation webhook tracking

**Tasks**:

1. ✅ Configure objectives in `src/lib/tavus/config.ts`
2. ✅ Sync objectives to Tavus API via update scripts
3. ✅ Add webhook URL to conversation creation
4. ⏳ Create webhook endpoint `/api/webhooks/tavus`
5. ⏳ Handle `application.transcription_ready` event
6. ⏳ Extract and calculate objective scores
7. ⏳ Display results to learner
8. ⏳ Store results (in-memory for MVP, database later)

**Files**:

- `src/app/api/webhooks/tavus/route.ts` (new)
- `src/app/api/learning-checks/conversation/route.ts` (updated)
- `src/components/course/chapter-content/learning-check-results.tsx` (new)

---

### Phase 2: Enhanced Tracking (Post-MVP)

**Scope**: Real-time per-objective webhooks + analytics

**Features**:

- Real-time progress indicators during conversation
- Per-objective webhook callbacks
- Database storage with historical analytics
- Instructor dashboard for learner insights
- Transcript review interface

---

## Configuration

### Environment Variables

```bash
# .env.local

# Objectives & Guardrails
NEXT_PUBLIC_TAVUS_LEARNING_CHECK_OBJECTIVES_ID=o078991a2b199
NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID=g7771e9a453db

# Webhooks
TAVUS_WEBHOOK_URL=https://your-app.com/api/webhooks/tavus
TAVUS_WEBHOOK_SECRET=your_webhook_secret  # Optional

# Scoring Thresholds (Optional)
LEARNING_CHECK_PASS_THRESHOLD=70  # Default: 70%
```

---

## Testing Strategy

### Manual Testing

**Test Case 1**: Complete All Objectives

1. Start learning check conversation
2. Respond to recall question with key terms
3. Respond to application question with example
4. Respond to self-explanation with reasoning
5. Wait for conversation to end
6. Verify webhook received with 3 completed objectives
7. Verify scores displayed to learner

**Test Case 2**: Incomplete Objectives

1. Start learning check conversation
2. Only respond to recall question
3. Stay silent or off-topic for remaining time
4. Wait for conversation to end
5. Verify webhook shows only 1 completed objective
6. Verify appropriate feedback to learner

**Test Case 3**: Webhook Failure

1. Temporarily disable webhook endpoint
2. Complete learning check
3. Verify graceful fallback behavior
4. Re-enable webhook and retry

### Automated Testing (Post-MVP)

- Unit tests for score calculation
- Integration tests for webhook handling
- E2E tests for complete flow

---

## Success Metrics

**MVP Success Criteria**:

- ✅ Webhook endpoint receives 100% of conversation completions
- ✅ Objective completion data extracted successfully
- ✅ Scores calculated accurately (verified against sample data)
- ✅ Results displayed to learner within 10 seconds of conversation end
- ✅ Zero missed webhook events (implement retry mechanism if needed)

**Post-MVP Metrics**:

- Average objective completion rate (target: >80%)
- Average scores per objective type
- Time to complete each objective
- Correlation between objective scores and quiz scores

---

## Dependencies

**External**:

- ✅ Tavus API v2 (objectives and webhooks)
- ✅ Tavus persona configured with objectives ID

**Internal**:

- ✅ Learning check conversation creation
- ✅ Time limit enforcement (3 minutes)
- ✅ Tavus config update scripts
- ⏳ Webhook infrastructure

---

## Non-Functional Requirements

**Performance**:

- Webhook processing: <2 seconds
- Results display: <10 seconds after conversation end
- Handle up to 10 concurrent webhooks

**Reliability**:

- 99% webhook delivery success rate
- Retry logic for failed webhook deliveries (Post-MVP)
- Graceful degradation if webhook unavailable

**Security**:

- Webhook signature verification (recommended)
- HTTPS only for webhook endpoint
- No sensitive data in webhook logs

---

## Future Enhancements

**Phase 3+**:

- Visual engagement tracking (Tavus Perception Layer)
- Adaptive difficulty based on learner performance
- Personalized feedback recommendations
- Multi-attempt tracking with improvement trends
- Export capabilities for instructors

---

## References

**Official Documentation**:

- [Tavus Objectives](https://docs.tavus.io/sections/conversational-video-interface/persona/objectives.md)
- [Tavus Webhooks](https://docs.tavus.io/sections/webhooks-and-callbacks.md)
- [Tavus Conversation API](https://docs.tavus.io/api-reference/conversations/create-conversation.md)

**Internal Documentation**:

- [Technical Implementation Guide](../../../docs/TAVUS_OBJECTIVE_COMPLETION_TRACKING.md)
- [Learning Check Spec](./learning-check-spec.md)
- [Learning Check Implementation](./learning-check-implementation.md)
- [Tavus Config](../../../src/lib/tavus/config.ts)

---

## Changelog

| Date       | Version | Changes                                                                     |
| ---------- | ------- | --------------------------------------------------------------------------- |
| 2025-10-31 | 1.0     | Initial specification - MVP scope with end-of-conversation webhook tracking |

---

**Status**: Ready for Implementation  
**Priority**: High (MVP Feature)  
**Estimated Effort**: 1-2 sprints for MVP
