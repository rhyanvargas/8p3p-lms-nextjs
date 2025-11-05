# Learning Check Feature — Design Specification

> **Feature Name**: Learning Check (Conversational Assessment)  
> **Status**: Ready for Implementation  
> **Last Updated**: 2025-11-04  
> **Version**: 1.0

---

## Architecture Overview

### System Architecture

```
Client (Browser) → Next.js API Routes → Tavus CVI API
       ↓                    ↓
   Analytics          Webhook Handler
```

### Data Flow

1. Quiz Passed → Unlock Learning Check
2. Hair Check → Verify AV → Enable Start Button
3. Create Conversation → Inject Chapter Context + Objectives
4. Active Session → Track Time + Engagement + Objectives
5. Session End → Webhook Callbacks → Parse Results
6. Display Results → Show Scores + Feedback
7. Mark Complete → Update Progress

---

## Component Architecture

### Component Structure

```
src/components/course/chapter-content/
├── learning-check-base.tsx (Main container)
├── learning-check-ready.tsx (Pre-session screen)
└── index.tsx (Export barrel)
```

### LearningCheckBase (Main Component)

**State Management**:
```typescript
const [screen, setScreen] = useState<"ready" | "hairCheck" | "call">("ready");
const [conversation, setConversation] = useState<ConversationResponse | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [engagementTime, setEngagementTime] = useState(0);
```

**Key Methods**:
- `handleStart()`: Navigate to Hair Check
- `handleJoin()`: Create conversation via API
- `handleEnd()`: Terminate conversation and log engagement
- `handleTimerTick()`: Calculate elapsed time

**Component States**:
1. **Locked**: Quiz not passed
2. **Ready**: Quiz passed, show start button
3. **Hair Check**: Camera/mic verification
4. **Active**: Conversation in progress
5. **Results**: Show engagement time and completion button

---

## API Routes

### 1. Create Conversation

**Endpoint**: `POST /api/learning-checks/conversation`

**Request**:
```typescript
{ chapterId: string, chapterTitle: string }
```

**Response**:
```typescript
{ conversationUrl: string, conversationId: string, expiresAt?: string }
```

**Logic**:
1. Build chapter context
2. Create Tavus conversation with 180s max duration
3. Return conversation URL and ID

---

### 2. Terminate Conversation

**Endpoint**: `POST /api/learning-checks/conversation/:id/end`

**Logic**:
1. Call Tavus DELETE endpoint
2. Log termination reason
3. Return success status

**Triggers**: Timer expiration, manual end, navigation, tab close, unmount

---

### 3. Webhook Handler (Phase 2)

**Endpoint**: `POST /api/webhooks/tavus`

**Events**:
- `application.transcription_ready`: Extract transcript + objectives
- `application.perception_analysis`: Parse visual engagement
- `system.shutdown`: Log lifecycle

**Security**: HMAC-SHA256 signature verification

---

## Data Models

### LearningCheckResult

```typescript
interface LearningCheckResult {
  id: string;
  userId: string;
  chapterId: string;
  conversationId: string;
  startedAt: Date;
  endedAt: Date;
  duration: number;
  engagementTime: number;
  engagementPercent: number;
  thresholdMet: boolean;
  transcript: ConversationMessage[];
  endReason: 'timeout' | 'manual' | 'navigation' | 'connection_loss' | 'completed';
  completed: boolean;
  
  // Phase 2
  visualEngagementScore?: number;
  objectivesCompleted?: number;
  recallScore?: number;
  applicationScore?: number;
  explanationScore?: number;
  
  // Phase 4
  rubric?: {
    score: number;
    strengths: string[];
    misconceptions: string[];
    nextSteps: string[];
  };
}
```

---

## Configuration

### Environment Variables

```bash
# Required
TAVUS_API_KEY=<secret>
TAVUS_PERSONA_ID=<uuid>

# Configuration
TAVUS_LEARNING_CHECK_DURATION=180
TAVUS_ENGAGEMENT_THRESHOLD=90
TAVUS_MAX_CONCURRENT_SESSIONS=10

# Phase 2
TAVUS_WEBHOOK_SECRET=<hex>
TAVUS_WEBHOOK_URL=https://your-app.com/api/webhooks/tavus
```

### Tavus Configuration (`src/lib/tavus/config.ts`)

**Defaults**:
```typescript
export const TAVUS_DEFAULTS = {
  LEARNING_CHECK_DURATION: 180,
  ENGAGEMENT_THRESHOLD: 90,
  DEFAULT_REPLICA_ID: "r9fa0878977a"
};
```

**Persona**: "8p3p - AI Instructor Assistant"  
**Objectives**: Recall → Application → Self-Explanation  
**Guardrails**: Quiz answer protection, time management, content scope

---

## Analytics Events

| Event | Trigger | Data |
|-------|---------|------|
| `lc_started` | Start clicked | chapterId, userId, timestamp |
| `lc_hair_check_ok` | Hair Check passed | deviceInfo |
| `lc_timeout` | Timer → 0:00 | engagementTime, thresholdMet |
| `lc_user_end` | Manual end | timeRemaining, engagementTime |
| `lc_completed` | Mark complete | scores, engagementPercent |
| `lc_terminated_navigation` | Page navigation | timeRemaining, reason |
| `lc_terminated_connection` | Connection lost | connectionState |

**Total**: 13 events across all phases

---

## UI/UX Design

### Accessibility

- **Keyboard Navigation**: Tab, Enter, Esc
- **Screen Reader**: ARIA announcements for timer milestones
- **Color Contrast**: WCAG AA (4.5:1)
- **Focus Management**: Modal trap during session

### Timer Visual States

- **Normal** (>30s): Green
- **Warning** (≤30s): Orange
- **Expired** (0:00): Red

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Hair Check Load | <2s |
| Conversation Start | <3s |
| Timer Tick Interval | 1s |
| Webhook Processing | <500ms |

---

## Security

- **API Keys**: Server-side only (never expose to client)
- **Webhook Verification**: HMAC-SHA256 signature
- **Permissions**: Request camera/mic only when needed
- **Privacy**: Never store raw video (only analysis summaries)

---

## Error Handling

### Client-Side Errors

```typescript
try {
  const response = await fetch('/api/learning-checks/conversation', {...});
  if (!response.ok) throw new Error('Failed to create conversation');
  // ... success
} catch (error) {
  setError(error.message);
  setScreen('ready');
}
```

### Recovery Strategies

- **Network Timeout**: Show "Try Again" button
- **Tavus API Down**: Show maintenance message
- **Permission Denied**: Browser-specific help
- **Webhook Failure**: Store partial data, retry

---

## Testing Strategy

### Phase 1 (Manual Q&A)
1. Quiz gating works
2. Hair Check success
3. Timer countdown accurate
4. Auto-termination at 0:00
5. Engagement threshold gate
6. All termination triggers work

### Phase 2 (Webhook Integration)
7. Webhook delivery verified
8. Signature verification works
9. Perception parsing accurate
10. Objectives extracted correctly

---

## Deployment

### Feature Flags

```typescript
LEARNING_CHECK_ENABLED: true/false
PERCEPTION_ENABLED: true/false
WARNING_NOTIFICATION: true/false
```

### Monitoring

- Average engagement time (target: ≥120s)
- Completion rate (target: ≥80%)
- Hair Check success rate (target: ≥95%)
- Webhook delivery rate (target: 99%)
- Unterminated conversations (target: 0)

---

**Document Status**: Ready for Task Breakdown  
**Next Step**: Create tasks.md with implementation checklist
