# Feature Specification: Ask a Question (Tavus AI Integration)

## Feature Overview

### Purpose
Provide learners with an interactive, conversational AI video assistant using Tavus Conversational Video Interface (CVI) for real-time Q&A about course content.

### Goals
- **Natural Interaction**: Face-to-face video conversations with AI instructor
- **Context-Aware Support**: Chapter-specific, contextual question answering
- **Seamless Integration**: Native platform experience with Tavus CVI
- **Engagement Tracking**: Monitor question patterns and interaction effectiveness
- **Time Management**: 4-minute session limits for focused Q&A

## User Stories

### As a Learner
- **US-1**: I want to ask questions about chapter content and receive video responses from an AI instructor
- **US-2**: I want to see my remaining question time during the conversation
- **US-3**: I want the AI to understand the context of the current chapter I'm studying
- **US-4**: I want to easily start and end question sessions from the course interface
- **US-5**: I want to control my camera/microphone during AI conversations

### As an Instructor/Admin
- **US-6**: I want to track which questions learners are asking most frequently
- **US-7**: I want to set appropriate time limits for question sessions
- **US-8**: I want to configure different AI personas for different course topics

## Technical Requirements

### Next.js 15+ Compliance
- **Server Components First**: Conversation triggers and metadata
- **Client Components**: Tavus CVI integration and interactive elements only
- **API Routes**: Next.js API routes for Tavus conversation management

### Tavus Integration Strategy

**Recommended Approach**: `@tavus/cvi-ui` Component Library

**Rationale**:
- Pre-built React components with TypeScript support
- Full UI control (matches shadcn/ui design system)
- Built-in device management and state handling
- Production-ready with error handling

**Documentation**: https://docs.tavus.io/sections/integrations/embedding-cvi.md

### Installation & Setup

```bash
# Initialize Tavus CVI
npx @tavus/cvi-ui@latest init

# Add conversation component
npx @tavus/cvi-ui@latest add conversation
```

**Dependencies**: `@daily-co/daily-react`, `@daily-co/daily-js`, `jotai`

### Environment Variables

```bash
TAVUS_API_KEY=required
TAVUS_REPLICA_ID=required
TAVUS_PERSONA_ID=optional
TAVUS_DEFAULT_CALL_DURATION=240  # Configurable time limit (seconds)
```

**Time Limit Configuration**:
- Default: 240 seconds (4 minutes)
- Easily configurable via environment variable
- No code changes required to adjust duration

## Component Architecture

### Component Structure

```
src/
├── app/
│   └── api/
│       └── tavus/
│           ├── conversation/route.ts    # Create Tavus conversation
│           └── analytics/route.ts       # Track conversation analytics
├── components/
│   ├── cvi/                             # Tavus CVI library (auto-generated)
│   │   ├── components/
│   │   │   ├── cvi-provider.tsx        # CVIProvider from Tavus
│   │   │   └── conversation.tsx        # Conversation component from Tavus
│   │   └── hooks/
│   │       └── use-conversation.ts     # CVI hooks from Tavus
│   └── course/
│       └── chapter-content/
│           ├── ask-question.tsx         # Main Q&A dialog (UPDATE)
│           └── tavus-conversation.tsx   # Tavus wrapper (NEW)
├── lib/
│   ├── services/
│   │   ├── tavus-service.ts            # Tavus API (hot-swappable)
│   │   └── conversation-analytics.ts   # Analytics (hot-swappable)
│   └── utils/
│       ├── tavus-config.ts             # Configuration
│       └── conversation-helpers.ts     # Helper functions
└── types/
    └── tavus.ts                         # Tavus types
```

### Component Props Interface

```typescript
interface AskQuestionProps {
  chapterTitle: string;
  chapterId: string;
  courseId: string;
  timeLimit?: number;  // Default: 240 seconds
  personaId?: string;  // Optional custom AI persona
  onConversationEnd?: (duration: number, questionCount: number) => void;
}
```

## Implementation Details

### 1. Root Provider Setup

**File**: `src/app/layout.tsx` or `src/providers/index.tsx`

```typescript
import { CVIProvider } from '@/components/cvi/components/cvi-provider';

export default function RootLayout({ children }) {
  return (
    <CVIProvider>
      {children}
    </CVIProvider>
  );
}
```

### 2. API Route: Create Conversation

**File**: `src/app/api/tavus/conversation/route.ts`

**Endpoint**: `POST /api/tavus/conversation`

**Request Body**:
```json
{
  "chapterId": "ch-123",
  "courseId": "course-456",
  "chapterTitle": "EMDR Foundations",
  "timeLimit": 240
}
```

**Response**:
```json
{
  "conversationUrl": "https://tavus.io/...",
  "conversationId": "conv-xyz",
  "expiresAt": "2024-..."
}
```

**Tavus API Call**:
- Endpoint: `https://tavusapi.com/v2/conversations`
- Method: POST
- Headers: `x-api-key: process.env.TAVUS_API_KEY`
- Body: `replica_id`, `persona_id`, `conversational_context`, `max_call_duration`

### 3. Conversation Wrapper Component

**File**: `src/components/course/chapter-content/tavus-conversation.tsx`

**Key Features**:
- Fetches conversation URL from API
- Loading state with spinner
- Error handling with retry
- Wraps Tavus `<Conversation>` component
- Handles conversation lifecycle events

### 4. Updated Ask Question Dialog

**File**: `src/components/course/chapter-content/ask-question.tsx`

**Enhancements**:
- Integrates TavusConversation component
- Adds CountdownTimer at top of dialog
- Tracks conversation start/end times
- Full-screen dialog (max-w-5xl, h-[90vh])
- Camera/microphone permission prompts

### 5. Conversational Context (Mock Data Approach)

**Strategy**: Enhance existing mock-data.ts with conversational context fields

**Mock Data Enhancement**:
```typescript
// src/lib/mock-data.ts
interface Chapter {
  id: string;
  title: string;
  learningObjectives: string[];
  // NEW: Conversational context fields
  conversationalContext?: {
    instructorTone: 'professional' | 'conversational' | 'encouraging';
    keyConcepts: string[];
    responseLength: 'brief' | 'moderate' | 'detailed';
    customInstructions?: string;
  };
}
```

**Generated Context String**:
```typescript
const context = `
You are an expert EMDR therapy instructor.
Current Chapter: ${chapter.title}

Learning Objectives:
${chapter.learningObjectives.map(obj => `- ${obj}`).join('\n')}

Key Concepts: ${chapter.conversationalContext?.keyConcepts.join(', ')}

Instruction Style:
- Tone: ${chapter.conversationalContext?.instructorTone || 'conversational'}
- Response Length: ${chapter.conversationalContext?.responseLength || 'moderate'} (30-45 seconds)
- ${chapter.conversationalContext?.customInstructions || 'Use simple language with concrete examples'}
`;
```

**Migration Path**: When database is ready, these fields map directly to database columns

**Benefits**:
- ✅ Minimal effort (extends existing mock structure)
- ✅ Easy to test different contexts
- ✅ Clean migration to DB
- ✅ No new patterns or complexity

## Analytics & Tracking

### Conversation Metrics

```typescript
interface ConversationAnalytics {
  conversationId: string;
  chapterId: string;
  courseId: string;
  userId: string;
  startedAt: Date;
  endedAt: Date;
  duration: number; // seconds
  questionCount: number;
  networkQuality: 'poor' | 'fair' | 'good' | 'excellent';
  deviceIssues: string[];
}
```

### Tracked Events
- Conversation started
- Conversation ended (manual/timeout)
- Question asked (if API supports)
- Device permission denied
- Network quality changes
- Errors encountered

## Error Handling

### Common Scenarios

1. **Camera/Microphone Permission Denied**
   - Display clear permission instructions
   - Show browser-specific guidance
   - Provide "Allow Permissions" button

2. **Network Issues**
   - Connection quality indicator
   - Auto-reconnect with exponential backoff
   - "Reconnecting..." state display

3. **Tavus API Errors**
   - Log to monitoring service
   - User-friendly error messages
   - "Try Again" action button

4. **Time Limit Exceeded**
   - 15-second warning countdown
   - Graceful conversation end
   - Save conversation state

## Acceptance Criteria

### Core Functionality
- [ ] **AC-1**: Ask Question button opens dialog with Tavus conversation interface
- [ ] **AC-2**: Conversation URL generated with proper chapter context
- [ ] **AC-3**: AI responses are contextually relevant to current chapter
- [ ] **AC-4**: Timer displays accurate countdown during conversation
- [ ] **AC-5**: Conversation ends gracefully when time limit reached
- [ ] **AC-6**: User can manually end conversation at any time
- [ ] **AC-7**: Camera and microphone controls work correctly

### Tavus CVI Integration
- [ ] **AC-8**: @tavus/cvi-ui library properly initialized
- [ ] **AC-9**: CVIProvider wraps application at root level
- [ ] **AC-10**: Conversation component renders without errors
- [ ] **AC-11**: Video/audio quality acceptable (min 720p, clear audio)
- [ ] **AC-12**: Device management (camera/mic selection) works

### User Experience
- [ ] **AC-13**: Loading state shows while conversation initializes
- [ ] **AC-14**: Error states display clear, actionable messages
- [ ] **AC-15**: Dialog responsive on desktop/tablet (min 1024px width)
- [ ] **AC-16**: UI matches LMS design system (shadcn/ui)
- [ ] **AC-17**: Time warnings provide adequate notice

### Analytics & Tracking
- [ ] **AC-18**: Conversation duration tracked accurately
- [ ] **AC-19**: Question count logged (if API supports)
- [ ] **AC-20**: Analytics data sent to backend
- [ ] **AC-21**: Failed conversations logged for debugging

### Performance
- [ ] **AC-22**: Conversation initializes in < 5 seconds
- [ ] **AC-23**: Video latency < 500ms
- [ ] **AC-24**: Memory stable during 4-minute session
- [ ] **AC-25**: No memory leaks after closing dialog

### Accessibility
- [ ] **AC-26**: Keyboard navigation works throughout
- [ ] **AC-27**: Screen readers announce state changes
- [ ] **AC-28**: Color contrast meets WCAG AA standards
- [ ] **AC-29**: Focus management correct (trapped in dialog)

## Testing Strategy

### Unit Tests
- Component rendering (AskQuestion, TavusConversation)
- API route logic (conversation creation, error handling)
- Context generation (chapter context formatting)
- Analytics tracking (metric calculation)

### Integration Tests
- Tavus API integration (mock API responses)
- Timer integration (countdown behavior)
- Dialog lifecycle (open, close, flow)
- Error scenarios (permissions, network, API failures)

### Manual Testing
- Device compatibility (different cameras/microphones)
- Browser compatibility (Chrome, Safari, Firefox, Edge)
- Network conditions (Slow 3G, 4G, WiFi)
- Time limit scenarios (normal end, forced end, early exit)

### User Acceptance Tests
- Conversation quality (AI response relevance)
- User experience (ease of use, intuitiveness)
- Performance (video quality, responsiveness)
- Accessibility (screen reader, keyboard navigation)

## MoSCoW Prioritization

### Must Have (MVP)
- ✅ Basic Tavus conversation integration
- ✅ Chapter context injection
- ✅ Timer with 4-minute limit
- ✅ Dialog UI with open/close
- ✅ Camera/microphone controls
- ✅ Basic error handling
- ✅ Conversation duration tracking

### Should Have (Post-MVP)
- 🔄 Advanced analytics (question transcription)
- 🔄 User satisfaction rating
- 🔄 HairCheck pre-call device testing
- 🔄 Network quality indicators
- 🔄 Extended time option (admin configurable)

### Could Have (Future)
- 💡 Text-based fallback (if camera unavailable)
- 💡 Conversation history and playback
- 💡 Multi-language support
- 💡 Screen sharing for visual explanations
- 💡 AI persona customization per course

### Won't Have (Out of Scope)
- ❌ Group conversations (multiple learners)
- ❌ Live instructor override
- ❌ Video recording download
- ❌ Custom AI training on course content

## Dependencies

### Internal Dependencies
- Timer System (CountdownTimer component)
- Dialog Component (shadcn/ui Dialog)
- User Authentication (track user questions)
- Course Data (chapter context)

### External Dependencies
- Tavus API (conversation creation/management)
- @tavus/cvi-ui (React component library)
- @daily-co/daily-react (video infrastructure)
- @daily-co/daily-js (Daily.co SDK)
- jotai (state management)

### Environment Variables Required
```bash
TAVUS_API_KEY=required
TAVUS_REPLICA_ID=required
TAVUS_PERSONA_ID=optional
TAVUS_DEFAULT_CALL_DURATION=240  # Configurable (seconds)
```

## Implementation Strategy

### Stacked PR Approach (Following Release Strategy)

This feature uses **stacked PRs** maintaining 200-400 LOC per PR:

#### Phase 1: Tavus CVI Setup & API Routes
**Branch**: `feature/ask-question-01-setup`
**Size**: ~200-250 LOC
**Files**:
- Initialize: `npx @tavus/cvi-ui@latest init`
- Add component: `npx @tavus/cvi-ui@latest add conversation`
- `src/app/api/tavus/conversation/route.ts`
- `src/types/tavus.ts`
- `.env.local.example` (include TAVUS_DEFAULT_CALL_DURATION)
- Update README with setup instructions
- Update mock-data.ts with conversationalContext fields

**Investigation Items**:
- 🔍 **HairCheck Research**: Determine if HairCheck is included with Conversation component or requires separate installation
  - Test: `npx @tavus/cvi-ui@latest add haircheck`
  - Document: Effort required (LOC impact)
  - Decision: Include in MVP or defer to post-MVP
  - Report findings in Phase 1 PR description

**Dependencies**: None
**Testing**: API route unit tests, mocked Tavus integration

#### Phase 2: Core Conversation Component
**Branch**: `feature/ask-question-02-conversation` (depends on Phase 1)
**Size**: ~300-350 LOC
**Files**:
- `src/components/course/chapter-content/tavus-conversation.tsx`
- `src/lib/utils/tavus-config.ts`
- `src/lib/utils/conversation-helpers.ts`
- `src/lib/services/tavus-service.ts` (hot-swappable)
- Component unit tests

**Dependencies**: Phase 1
**Testing**: Component rendering, loading/error states

#### Phase 3: Dialog Integration & UI
**Branch**: `feature/ask-question-03-dialog` (depends on Phase 2)
**Size**: ~250-300 LOC
**Files**:
- Update `src/components/course/chapter-content/ask-question.tsx`
- Timer integration (CountdownTimer)
- Dialog styling and responsive layout
- Integration tests

**Dependencies**: Phase 2, Timer System
**Testing**: Dialog lifecycle, timer integration, UI responsiveness

#### Phase 4: Analytics & Polish
**Branch**: `feature/ask-question-04-analytics` (depends on Phase 3)
**Size**: ~200-250 LOC
**Files**:
- `src/app/api/tavus/analytics/route.ts`
- `src/lib/services/conversation-analytics.ts` (hot-swappable)
- Analytics tracking implementation
- Error handling improvements
- Accessibility enhancements
- Final documentation

**Dependencies**: Phase 3
**Testing**: Analytics tracking, error scenarios, accessibility

### PR Dependencies
```
Phase 1 (Setup) → Phase 2 (Conversation) → Phase 3 (Dialog) → Phase 4 (Analytics)
```

### Phase Approval Process

**Following Branch Readiness Protocol**:

For each phase:
1. ✅ Complete Phase N implementation
2. ✅ Submit PR for review
3. ⏸️ **WAIT for user review and approval**
4. ✅ Merge Phase N after approval
5. ❓ **ASK**: "Ready to create the branch and start Phase N+1 development? 🚀"
6. ⏸️ **WAIT for explicit user approval**
7. ✅ Only then proceed to Phase N+1

**User Controls**:
- Review and approve each phase independently
- Adjust requirements between phases
- Control development pace
- Request changes before next phase

**Phase 1 Special Note**: HairCheck investigation results will be presented in Phase 1 PR for decision on MVP inclusion.

### Quality Gates
Each PR must pass:
- ✅ ESLint strict validation (0 errors, 0 warnings)
- ✅ TypeScript compilation (strict mode)
- ✅ Build verification (no build errors)
- ✅ Code review (1-2 reviewers)
- ✅ Tavus API key validation (dev environment)

## Cost Considerations

### Tavus Pricing
- Check [Tavus Pricing](https://www.tavus.io/pricing)
- Estimated: ~4 minutes per session
- Calculate based on expected learner count

### Recommendations
1. Monitor conversation usage monthly
2. Set max concurrent conversations limit
3. Implement conversation queueing if needed
4. Consider caching common responses (future)

## Future Enhancements

### Phase 2 Features
- HairCheck pre-call device testing
- Admin-configurable time extensions
- Question history viewer
- Post-conversation satisfaction ratings

### Phase 3 Features
- Text chat fallback (if video unavailable)
- Question topic clustering analytics
- AI persona library (multiple instructors)
- Conversation bookmarks (save moments)

---

**Implementation Priority**: High - Core learning engagement feature for MVP

**Estimated Effort**: 3-4 days (including Tavus setup and testing)

**Risk Level**: Medium (depends on Tavus API reliability and video quality)

