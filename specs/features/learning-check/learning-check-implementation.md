# Learning Check — Technical Implementation Guide

> **Technical Documentation**  
> For product requirements, see [Feature Spec](./learning-check-spec.md)

---

## Table of Contents

1. [Perception Analysis Integration](#perception-analysis-integration)
2. [Webhook Setup & Configuration](#webhook-setup--configuration)
3. [Data Structures](#data-structures)
4. [Technical Requirements](#technical-requirements)
5. [Implementation Phases](#implementation-phases)
6. [Acceptance Criteria](#acceptance-criteria)

---

## Perception Analysis Integration (Tavus Raven)

**Purpose**: Enhance learning check assessment with visual engagement data

### Perception Queries Configuration

Configure in Tavus dashboard persona:

**Perception Analysis Queries** (End-of-call summary):

```json
"perception_analysis_queries": [
  "On a scale of 1-100, how often was the learner looking at the screen during the conversation?",
  "What was the learner's overall engagement level? (e.g., attentive, distracted, thoughtful, confused)",
  "Were there any visual indicators of comprehension struggles? (e.g., confusion, frustration)",
  "Did the learner appear to be taking notes or referencing materials?",
  "Was there any indication of multiple people present or distractions in the environment?",
  "How would you rate the learner's body language and facial expressions? (e.g., engaged, neutral, disengaged)"
]
```

**Rationale**:

- **Screen Gaze**: Measures visual attention and focus
- **Engagement Level**: Holistic assessment of learner presence
- **Comprehension Indicators**: Identifies when learner struggles
- **Note-Taking**: Positive signal of active learning
- **Distractions**: Environmental factors affecting performance
- **Body Language**: Non-verbal communication cues

---

## Webhook Setup & Configuration

**Critical**: Webhooks are required for perception analysis and conversation lifecycle tracking

### Webhook URL Generation

**Development Environment**:

```bash
# Step 1: Generate webhook secret (store in .env.local)
node -e "console.log('TAVUS_WEBHOOK_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
# Output: TAVUS_WEBHOOK_SECRET=abc123def456...

# Step 2: Expose local development server using ngrok
npx ngrok http 3000
# Output: https://abc123.ngrok.io -> http://localhost:3000

# Step 3: Set webhook URL in environment
TAVUS_WEBHOOK_URL=https://abc123.ngrok.io/api/learning-checks/perception-analysis
```

**Production Environment**:

```bash
# Use your deployed domain
TAVUS_WEBHOOK_URL=https://your-app.vercel.app/api/learning-checks/perception-analysis
```

### Webhook Registration

**Method**: Pass `callback_url` parameter when creating conversation (recommended)

```typescript
// In conversation creation API call
const conversationResponse = await fetch(
	"https://tavusapi.com/v2/conversations",
	{
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": process.env.TAVUS_API_KEY!,
		},
		body: JSON.stringify({
			replica_id: replicaId, // from persona configuration
			persona_id: process.env.TAVUS_PERSONA_ID!,
			callback_url: process.env.TAVUS_WEBHOOK_URL!, // Register webhook
			conversational_context: chapterContext,
			max_call_duration: 240,
		}),
	}
);
```

### Webhook Endpoint Implementation

**File**: `src/app/api/learning-checks/perception-analysis/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
	try {
		// Step 1: Verify webhook signature (security)
		const signature = request.headers.get("x-tavus-signature");
		const payload = await request.text();

		if (!verifyWebhookSignature(payload, signature)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Step 2: Parse webhook payload
		const webhookData = JSON.parse(payload);
		const { event_type, conversation_id, properties } = webhookData;

		// Step 3: Handle different event types
		switch (event_type) {
			case "application.perception_analysis":
				await handlePerceptionAnalysis(conversation_id, properties.analysis);
				break;
			case "application.transcription_ready":
				await handleTranscriptionReady(conversation_id, properties.transcript);
				break;
			case "system.shutdown":
				await handleConversationEnd(
					conversation_id,
					properties.shutdown_reason
				);
				break;
			default:
				console.log(`Unhandled event type: ${event_type}`);
		}

		return NextResponse.json({ status: "success" });
	} catch (error) {
		console.error("Webhook processing error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

function verifyWebhookSignature(
	payload: string,
	signature: string | null
): boolean {
	if (!signature || !process.env.TAVUS_WEBHOOK_SECRET) return false;

	const expectedSignature = crypto
		.createHmac("sha256", process.env.TAVUS_WEBHOOK_SECRET)
		.update(payload)
		.digest("hex");

	return signature === `sha256=${expectedSignature}`;
}
```

### Webhook Event Types

**System Events** (conversation lifecycle):

- `system.replica_joined`: AI avatar ready for conversation
- `system.shutdown`: Conversation ended (various reasons)

**Application Events** (data ready):

- `application.transcription_ready`: Full conversation transcript available
- `application.perception_analysis`: Visual engagement analysis complete
- `application.recording_ready`: Video recording available (if enabled)

### Webhook Payload Structure

**Perception Analysis Event**:

```json
{
	"properties": {
		"analysis": "Here's a summary of visual observations:\n\n* **Learner Gaze:** The learner was looking at the screen approximately 85% of the time...\n* **Engagement Level:** The learner appeared attentive and engaged throughout...\n* **Comprehension Indicators:** No significant signs of confusion were observed...\n* **Note-Taking:** The learner was observed taking notes during key explanations...\n* **Distractions:** No major environmental distractions were detected...\n* **Body Language:** The learner maintained positive body language with frequent nodding..."
	},
	"conversation_id": "<conversation_id>",
	"webhook_url": "<webhook_url>",
	"message_type": "application",
	"event_type": "application.perception_analysis",
	"timestamp": "2025-07-11T09:13:35.361736Z"
}
```

**Transcription Ready Event**:

```json
{
	"properties": {
		"replica_id": "<replica_id>",
		"transcript": [
			{
				"role": "user",
				"content": "Can you explain what bilateral stimulation means?"
			},
			{
				"role": "assistant",
				"content": "Bilateral stimulation refers to..."
			}
		]
	},
	"conversation_id": "<conversation_id>",
	"webhook_url": "<webhook_url>",
	"event_type": "application.transcription_ready",
	"message_type": "application",
	"timestamp": "2025-07-11T09:13:35.361736Z"
}
```

### Error Handling & Reliability

**Webhook Delivery**:

- Tavus retries failed webhooks with exponential backoff
- Implement idempotency using `conversation_id` + `event_type` as key
- Return 200 status for successful processing
- Return 4xx/5xx for errors (triggers Tavus retry)

**Timeout Handling**:

```typescript
// Set 30-second timeout for webhook processing
const WEBHOOK_TIMEOUT = 30000;

const timeoutPromise = new Promise((_, reject) => {
	setTimeout(() => reject(new Error("Webhook timeout")), WEBHOOK_TIMEOUT);
});

const processingPromise = processWebhookData(webhookData);

try {
	await Promise.race([processingPromise, timeoutPromise]);
} catch (error) {
	// Log error and return 500 (Tavus will retry)
	console.error("Webhook processing failed:", error);
	return NextResponse.json({ error: "Processing timeout" }, { status: 500 });
}
```

### Security Best Practices

1. **Signature Verification**: Always verify `x-tavus-signature` header
2. **HTTPS Only**: Webhook URLs must use HTTPS in production
3. **Rate Limiting**: Implement rate limiting on webhook endpoint
4. **Input Validation**: Validate all webhook payload data
5. **Secret Rotation**: Rotate webhook secrets periodically

### Development Workflow

1. **Local Development**: Use ngrok to expose localhost
2. **Testing**: Use Tavus webhook testing tools or manual conversation creation
3. **Staging**: Deploy to staging environment with proper webhook URL
4. **Production**: Use production domain with SSL certificate

### Webhook URL Configuration

**Environment-Specific URLs**:

```bash
# Development
TAVUS_WEBHOOK_URL=https://abc123.ngrok.io/api/learning-checks/perception-analysis

# Staging
TAVUS_WEBHOOK_URL=https://staging.your-app.com/api/learning-checks/perception-analysis

# Production
TAVUS_WEBHOOK_URL=https://your-app.com/api/learning-checks/perception-analysis
```

---

## Data Structures

### Enhanced Data Captured (With Perception Analysis)

```typescript
interface LearningCheckData {
	// Core session data
	chapterId: string;
	userId: string;
	conversationId: string; // Tavus conversation ID for correlation
	startedAt: timestamp;
	endedAt: timestamp;
	duration: number; // seconds
	engagementTime: number; // seconds of active speech
	engagementPercent: number; // 0-100
	completed: boolean;

	// Conversation data
	transcript: string; // full conversation transcript

	// AI-generated rubric (Phase 2+)
	rubric: {
		recallScore: number; // 0-10
		applicationScore: number; // 0-10
		selfExplanationScore: number; // 0-10
		misconceptions: string[]; // identified gaps
		nextSteps: string; // recommendations
	};

	// Perception analysis (enriched data)
	perceptionAnalysis: {
		rawAnalysis: string; // full Tavus Raven analysis text
		screenGazePercent: number; // 0-100, extracted from analysis
		engagementLevel: "high" | "medium" | "low"; // parsed from analysis
		comprehensionIndicators: {
			confusionDetected: boolean;
			frustrationDetected: boolean;
			confidenceLevel: "high" | "medium" | "low";
		};
		noteTaking: boolean; // detected from analysis
		distractionsPresent: boolean;
		bodyLanguageRating: "positive" | "neutral" | "negative";
		visualEngagementScore: number; // 0-100 composite score
	};

	// Combined assessment
	overallAssessment: {
		audioEngagement: number; // from speech detection (0-100)
		visualEngagement: number; // from perception analysis (0-100)
		combinedEngagementScore: number; // weighted average (0-100)
		passedThreshold: boolean; // >=50% combined engagement
	};
}
```

### Rubric Generation (Phase 2+)

- **Input**: Tavus conversation transcript + perception analysis + AI scoring (GPT-4 mini)
- **Scores**: 0-10 scale for each prompt type (recall, application, self-explanation)
- **Misconceptions**: Extract unclear or incorrect statements from transcript
- **Next Steps**: Generate recommendations considering both verbal and visual engagement

### Perception Analysis Parsing

**Strategy**: Parse Tavus Raven text analysis into structured data

**Parsing Logic**:

1. **Screen Gaze**: Extract percentage from "looking at the screen approximately X%" pattern
2. **Engagement Level**: Map keywords (attentive, engaged → high; neutral → medium; distracted → low)
3. **Comprehension**: Detect keywords (confusion, frustration, struggle)
4. **Note-Taking**: Boolean detection from "taking notes" or "referencing materials"
5. **Distractions**: Boolean from "distractions" or "multiple people present"
6. **Body Language**: Map positive/negative keywords to rating

**Visual Engagement Score Calculation**:

```typescript
visualEngagementScore =
	screenGazePercent * 0.4 +
	engagementLevelScore * 0.3 +
	bodyLanguageScore * 0.2 +
	comprehensionBonus * 0.1;
```

**Combined Engagement Score**:

```typescript
combinedEngagementScore = audioEngagement * 0.6 + visualEngagement * 0.4;
```

### Storage Strategy

- **Phase 1 (MVP)**: Console log conversation data + basic engagement tracking
- **Phase 2**: Add perception webhook endpoint + parsing logic + console log enriched data
- **Phase 3**: Store enriched data in localStorage for testing
- **Phase 4**: POST to backend API endpoint `/api/learning-checks` when database available
- **Phase 5**: Add rubric generation with AI analysis

---

## Technical Requirements

### Tavus Integration

- **CVI Library**: Use existing `@tavus/cvi-ui` components (already installed)
- **Persona Reference**: Use dashboard-configured persona ("8p3p - AI Instructor Assistant") via `persona_id` parameter
- **Replica**: "Olivia - Office" replica configured in dashboard
- **Conversation API**: Create conversation referencing persona + inject chapter-specific context
- **Hair Check**: Use Tavus Hair Check component for AV verification
- **Engagement Detection**: Leverage Daily.co audio levels or speaking events
- **Termination API**: Call Tavus conversation end endpoint on all termination triggers

### Persona Configuration (Managed in Tavus Dashboard)

**Base Configuration** (Team can update without code changes):

- **System Prompt**: "You are a knowledgeable and patient AI tutor who helps students understand course material..."
- **Persona Role**: "8p3p - AI Instructor Assistant"
- **Knowledge Base**: Tag "8p3p-cth-demo" with uploaded course materials
- **Language Model**: Configured with speculative response and tool integrations
- **Speech Settings**: Text-to-Speech (TTS) engine and voice configured
- **Perception Model**: `raven-0` enabled for visual analysis

### Chapter-Specific Context (Injected at Conversation Creation)

**Dynamic Context** (Passed via `conversational_context` parameter):

```
Current Learning Check Context:
Chapter: {chapterTitle}
Chapter ID: {chapterId}

Learning Objectives for This Chapter:
{chapter.learningObjectives.map(obj => `- ${obj}`).join('\n')}

Key Topics Covered:
{chapter.sections.map(section => section.title).join(', ')}

Assessment Focus:
- Ask at least 1 recall question about key concepts from this chapter
- Ask at least 1 application question about real-world usage
- Ask at least 1 self-explanation question to check understanding
- Duration: 3 minutes for this learning check
- IMPORTANT: Never reveal quiz answers or discuss specific quiz questions
- Keep conversation focused on this chapter's content
- Politely redirect if student asks about topics outside this chapter's scope
```

**Conversation Creation Flow**:

1. Fetch `TAVUS_PERSONA_ID` from environment variables
2. Build chapter-specific context string from chapter data
3. Call Tavus API: `POST /v2/conversations`
   - `replica_id`: from persona configuration
   - `persona_id`: dashboard persona ID
   - `conversational_context`: chapter-specific context (above)
   - `callback_url`: webhook URL for perception analysis
   - `max_call_duration`: 240 seconds
4. Receive `conversation_url` and `conversation_id`
5. Store `conversation_id` for termination tracking

### Implementation Strategy for Termination

```typescript
// React useEffect cleanup
useEffect(() => {
	return () => {
		// Cleanup: terminate conversation
		if (conversationId) {
			terminateConversation(conversationId);
		}
	};
}, [conversationId]);

// beforeunload event
useEffect(() => {
	const handleBeforeUnload = () => {
		if (conversationId) {
			// Use sendBeacon for reliability
			navigator.sendBeacon(
				"/api/learning-checks/terminate",
				JSON.stringify({ conversationId })
			);
		}
	};

	window.addEventListener("beforeunload", handleBeforeUnload);
	return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [conversationId]);

// Router events (Next.js)
useEffect(() => {
	const handleRouteChange = () => {
		if (conversationId) {
			terminateConversation(conversationId);
		}
	};

	router.events.on("routeChangeStart", handleRouteChange);
	return () => router.events.off("routeChangeStart", handleRouteChange);
}, [conversationId]);
```

### Dependencies

- **Internal**:
  - Chapter quiz completion status
  - Timer component (existing reusable component)
  - CVIProvider (already in layout.tsx)
  - Tavus CVI components (existing)
- **External**:
  - Tavus API (conversation creation)
  - Daily.co (audio/video infrastructure)
  - Optional: GPT-4 mini for rubric generation (Assumption)

### Environment Variables

```bash
TAVUS_API_KEY=required
TAVUS_PERSONA_ID=required # Dashboard persona ID (e.g., "pd8#1eb0d8e")
TAVUS_LEARNING_CHECK_DURATION=180 # configurable (seconds)
TAVUS_MAX_CONCURRENT_SESSIONS=10 # cost management
TAVUS_WEBHOOK_SECRET=required # Webhook signature verification
TAVUS_WEBHOOK_URL=required # Public URL for perception analysis webhook
TAVUS_PERCEPTION_ENABLED=true # Toggle perception analysis on/off
```

---

## Implementation Phases

### Phase 1: MVP (Console Logging)

**Estimated Effort**: 2-3 days

- Build locked/unlocked states based on quiz status
- Integrate Hair Check component
- Wire up Tavus conversation with chapter context and persona reference
- Implement dual progress bars (time + engagement)
- Add button state logic
- Console log basic completion data (no perception yet)
- Implement conversation termination on all triggers

### Phase 2: Perception Webhook & Parsing

**Estimated Effort**: 2 days

**Day 1: Webhook Infrastructure**

- Generate webhook secret using crypto.randomBytes(32)
- Set up ngrok for local development webhook URL exposure
- Create webhook endpoint `/api/learning-checks/perception-analysis/route.ts`
- Implement webhook signature verification with HMAC-SHA256
- Handle multiple event types (perception_analysis, transcription_ready, system.shutdown)
- Add error handling, timeouts, and idempotency
- Test webhook delivery with manual conversation creation

**Day 2: Perception Analysis & Parsing**

- Configure perception queries in Tavus dashboard persona
- Build perception analysis parser (text → structured data)
- Implement regex patterns for extracting gaze percentage, engagement level
- Calculate visual engagement score with weighted formula
- Combine audio + visual engagement scores
- Console log enriched data with perception analysis
- Test end-to-end flow: conversation → webhook → parsing → storage

### Phase 3: Data Persistence

**Estimated Effort**: 1 day

- Create API route `/api/learning-checks` (POST)
- Store enriched data in localStorage for testing
- Update to POST to backend when database available
- Include perception analysis in stored data

### Phase 4: Rubric Generation

**Estimated Effort**: 1-2 days

- Integrate AI analysis (GPT-4 mini) for transcript scoring
- Incorporate perception data into rubric generation
- Generate misconceptions and next steps
- Display combined rubric to learner after completion

### Phase 5: Polish & Analytics

**Estimated Effort**: 1 day

- Enhance accessibility features
- Add retry flows with perception data reset
- Build admin analytics dashboard with visual engagement metrics
- Performance optimization
- Add perception insights to learner completion summary

---

## Acceptance Criteria

### Core Functionality

- [ ] **AC-1**: Learning Check only accessible after passing chapter quiz
- [ ] **AC-2**: Hair Check required before Start button enables
- [ ] **AC-3**: 4-minute countdown timer displays and enforces hard stop
- [ ] **AC-4**: Engagement progress bar updates in real-time during conversation
- [ ] **AC-5**: "Mark Complete" button only appears after ≥120s engagement AND session end
- [ ] **AC-6**: AI avatar asks at least 1 recall, 1 application, 1 self-explanation question
- [ ] **AC-7**: AI never reveals quiz answers during conversation
- [ ] **AC-8**: AI redirects off-scope questions back to chapter content
- [ ] **AC-9**: Conversation references dashboard persona ("8p3p - AI Instructor Assistant")
- [ ] **AC-10**: Chapter-specific context injected at conversation creation
- [ ] **AC-11**: Conversation terminates on page navigation
- [ ] **AC-12**: Conversation terminates on tab/window close
- [ ] **AC-13**: Conversation terminates on connection loss
- [ ] **AC-14**: Conversation terminates on timer expiration

### UI/UX

- [ ] **AC-15**: Locked state shows clear message when quiz not passed
- [ ] **AC-16**: Hair Check component allows device selection
- [ ] **AC-17**: Timer shows minutes:seconds format (e.g., 3:45)
- [ ] **AC-18**: Engagement bar visually distinct from time remaining
- [ ] **AC-19**: "End Session" button always available during active session
- [ ] **AC-20**: Completion state shows success message with next steps

### Data & Analytics

- [ ] **AC-21**: Console logs full learning check data on completion
- [ ] **AC-22**: Transcript captured and included in data object
- [ ] **AC-23**: Rubric generated with scores and misconceptions
- [ ] **AC-24**: All 11 analytics events tracked correctly (including 3 termination + 2 perception events)
- [ ] **AC-25**: Conversation duration logged for cost monitoring
- [ ] **AC-26**: Perception webhook endpoint receives and validates payloads
- [ ] **AC-27**: Perception analysis text parsed into structured data correctly
- [ ] **AC-28**: Visual engagement score calculated accurately
- [ ] **AC-29**: Combined engagement score (audio + visual) displayed to learner
- [ ] **AC-30**: Perception data included in completion data storage

### Accessibility

- [ ] **AC-31**: Focus trapped in modal during session
- [ ] **AC-32**: Screen reader announces timer at key intervals
- [ ] **AC-33**: Captions available for AI avatar speech
- [ ] **AC-34**: All controls keyboard accessible
- [ ] **AC-35**: Color contrast meets WCAG AA standards

### Performance

- [ ] **AC-36**: Hair Check completes in <5 seconds
- [ ] **AC-37**: Conversation starts in <3 seconds after clicking Start
- [ ] **AC-38**: Engagement tracking accurate within ±2 seconds
- [ ] **AC-39**: No memory leaks during or after session
- [ ] **AC-40**: Conversation termination completes within 2 seconds
- [ ] **AC-41**: Perception webhook processing completes within 5 seconds
- [ ] **AC-42**: Perception parsing accurate within ±5% for gaze tracking

---

## Perception Analysis Implementation Summary

### What Gets Captured

**Visual Engagement Metrics**:

- Screen gaze percentage (0-100%)
- Overall engagement level (high/medium/low)
- Comprehension indicators (confusion, frustration, confidence)
- Note-taking behavior (boolean)
- Environmental distractions (boolean)
- Body language rating (positive/neutral/negative)

### How It Works

1. **Configuration**: Add 6 perception queries to Tavus dashboard persona
2. **During Conversation**: Raven model analyzes visual frames in real-time
3. **End of Conversation**: Tavus generates comprehensive visual summary
4. **Webhook Delivery**: Backend receives perception analysis payload
5. **Parsing**: Text analysis parsed into structured data
6. **Scoring**: Visual engagement score calculated (0-100)
7. **Combination**: Audio (60%) + Visual (40%) = Combined engagement score
8. **Storage**: Enriched data stored with transcript and rubric

### Benefits for Learning Assessment

- **Holistic Evaluation**: Combines verbal and non-verbal engagement
- **Early Intervention**: Identifies struggling learners (confusion, disengagement)
- **Quality Insights**: Detects note-taking and active learning behaviors
- **Fairness**: Accounts for quiet but visually engaged learners
- **Data-Driven**: Objective metrics supplement subjective assessments

### Technical Requirements

- **Tavus Persona**: `raven-0` perception model enabled
- **Webhook Endpoint**: Public URL accessible by Tavus
- **Signature Verification**: Validate webhook authenticity
- **Parsing Logic**: Regex/NLP to extract structured data from text
- **Error Handling**: Graceful degradation if perception fails (audio-only mode)

### Privacy & Consent

- Inform learners that visual engagement is tracked
- Provide opt-out option (audio-only mode)
- Anonymize perception data (remove PII from analysis)
- 90-day retention policy for visual data
- Never store raw video frames (only analysis summaries)

---

**Implementation Status**: Ready for Phase 1 development

**Next Steps**:

1. Review [Feature Spec](./learning-check-spec.md) for product requirements
2. Begin Phase 1 implementation with quiz-gated access and Hair Check integration
3. Set up development environment with ngrok for webhook testing
