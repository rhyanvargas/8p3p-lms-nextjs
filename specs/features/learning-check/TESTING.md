# Learning Check - Phase 1 Testing Guide

## Setup Instructions

### 1. Environment Variables
Add to your `.env.local`:

```bash
# Required: Your Tavus API credentials
TAVUS_API_KEY=your_tavus_api_key_here
TAVUS_PERSONA_ID=your_persona_id_here

# Optional: Configuration
TAVUS_LEARNING_CHECK_DURATION=240
TAVUS_MAX_CONCURRENT_SESSIONS=10
```

**Get your credentials**:
1. Go to https://platform.tavus.io/api-keys
2. Create an API key
3. Go to https://platform.tavus.io/personas
4. Copy your "8p3p - AI Instructor Assistant" persona ID

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser Console
Press `F12` or `Cmd+Option+I` to open DevTools and view the Console tab.

---

## Test Scenarios

### Scenario 1: Locked State (Quiz Not Passed)
**Goal**: Verify Learning Check is locked when quiz not passed

**Steps**:
1. Navigate to a chapter with a quiz
2. Don't complete the quiz (or fail it)
3. Scroll to Learning Check section

**Expected**:
- ✅ Shows "Learning Check Locked" card
- ✅ Displays lock icon
- ✅ Shows message about needing to pass quiz
- ✅ Shows current quiz score if available

**Console Output**:
```
📊 Analytics: lc_blocked_not_passed
{
  chapterId: "ch-1",
  userId: "user-123",
  quizScore: 60
}
```

---

### Scenario 2: Ready State (Quiz Passed)
**Goal**: Verify Learning Check is accessible after passing quiz

**Steps**:
1. Complete and pass the chapter quiz (≥70%)
2. Scroll to Learning Check section

**Expected**:
- ✅ Shows "Learning Check — [Chapter Title]" card
- ✅ Displays "Start Learning Check" button
- ✅ Shows feature description and requirements
- ✅ Lists what to expect (4 minutes, questions, engagement threshold)

---

### Scenario 3: Start Conversation
**Goal**: Verify Tavus conversation creation and initialization

**Steps**:
1. From Ready state, click "Start Learning Check"
2. Allow camera and microphone permissions when prompted

**Expected**:
- ✅ Button shows "Starting..." loading state
- ✅ Conversation loads with AI avatar
- ✅ Timer starts counting down from 4:00
- ✅ Engagement progress bar appears (0s / 120s)
- ✅ Hair Check component appears (if Tavus configured)

**Console Output**:
```
📊 Analytics: lc_started
{
  chapterId: "ch-1",
  userId: "user-123",
  timestamp: "2025-01-29T..."
}
```

---

### Scenario 4: Active Conversation
**Goal**: Verify engagement tracking and timer functionality

**Steps**:
1. Start a conversation
2. Speak with the AI avatar for 2+ minutes
3. Watch engagement progress bar

**Expected**:
- ✅ Timer counts down: 4:00 → 3:59 → ... → 0:00
- ✅ Engagement time increments (mock: +1s every 2 seconds)
- ✅ Progress bar fills up toward 120s threshold
- ✅ Threshold indicator shows "✓" when ≥120s reached
- ✅ "End Session" button always available

**Console Monitoring**:
- Watch engagement time increment in component state
- No errors in console

---

### Scenario 5: Timer Expiration (Threshold Met)
**Goal**: Verify automatic termination at 4:00 with sufficient engagement

**Steps**:
1. Start conversation
2. Let timer run to 0:00 (or wait ~2 minutes for mock engagement to reach 120s)

**Expected**:
- ✅ Conversation automatically terminates
- ✅ Shows "Session Complete" card with green checkmark
- ✅ Displays engagement stats (e.g., "156s / 120s")
- ✅ Shows "Mark Learning Check Complete" button
- ✅ Progress bar shows completion

**Console Output**:
```
📊 Analytics: lc_timeout
{
  chapterId: "ch-1",
  userId: "user-123",
  engagementTime: 156,
  thresholdMet: true
}

💾 Learning Check Data:
{
  chapterId: "ch-1",
  userId: "user-123",
  conversationId: "conv_abc123",
  startedAt: "2025-01-29T...",
  endedAt: "2025-01-29T...",
  duration: 240,
  engagementTime: 156,
  engagementPercent: 65,
  completed: false,
  transcript: "",
  endReason: "timeout",
  thresholdMet: true
}

✅ Conversation terminated: conv_abc123
```

---

### Scenario 6: Timer Expiration (Threshold NOT Met)
**Goal**: Verify handling when engagement threshold not reached

**Steps**:
1. Start conversation
2. Immediately click "End Session" (before reaching 120s)

**Expected**:
- ✅ Shows "Engagement Threshold Not Met" card with warning icon
- ✅ Displays engagement stats (e.g., "45s / 120s")
- ✅ Shows error message explaining need for 120s
- ✅ Shows "Try Again" button
- ✅ No "Mark Complete" button

**Console Output**:
```
📊 Analytics: lc_user_end
{
  chapterId: "ch-1",
  userId: "user-123",
  engagementTime: 45,
  thresholdMet: false
}

💾 Learning Check Data:
{
  ...
  engagementTime: 45,
  engagementPercent: 19,
  completed: false,
  endReason: "manual",
  thresholdMet: false
}
```

---

### Scenario 7: Manual End Session
**Goal**: Verify manual termination works correctly

**Steps**:
1. Start conversation
2. After 2+ minutes, click "End Session" button

**Expected**:
- ✅ Conversation terminates immediately
- ✅ Shows appropriate end state (complete/incomplete based on engagement)
- ✅ Logs termination analytics

**Console Output**:
```
📊 Analytics: lc_terminated
{
  chapterId: "ch-1",
  conversationId: "conv_abc123",
  reason: "manual",
  engagementTime: 130
}

✅ Conversation terminated: conv_abc123
```

---

### Scenario 8: Mark Complete
**Goal**: Verify completion flow

**Steps**:
1. Complete conversation with ≥120s engagement
2. Click "Mark Learning Check Complete"

**Expected**:
- ✅ Shows "Learning Check Completed" card with green checkmark
- ✅ Displays success message
- ✅ Calls `onComplete` callback (if provided)

**Console Output**:
```
📊 Analytics: lc_completed
{
  chapterId: "ch-1",
  userId: "user-123",
  engagementTime: 156,
  engagementPercent: 65
}

💾 Learning Check Data:
{
  ...
  completed: true,
  endReason: "completed"
}
```

---

### Scenario 9: Page Navigation (Termination)
**Goal**: Verify conversation terminates when user navigates away

**Steps**:
1. Start conversation
2. Click browser back button or navigate to different page

**Expected**:
- ✅ Browser shows "Are you sure you want to leave?" confirmation
- ✅ If confirmed, conversation terminates via `sendBeacon`
- ✅ No errors in console

**Console Output**:
```
📊 Analytics: lc_terminated
{
  chapterId: "ch-1",
  conversationId: "conv_abc123",
  reason: "component_unmount"
}
```

---

### Scenario 10: Tab Close (Termination)
**Goal**: Verify conversation terminates when tab/window closes

**Steps**:
1. Start conversation
2. Close browser tab

**Expected**:
- ✅ Browser shows "Are you sure?" confirmation
- ✅ Conversation terminates via `beforeunload` handler
- ✅ Uses `sendBeacon` for reliability

---

## Error Scenarios

### Error 1: Missing Environment Variables
**Steps**:
1. Remove `TAVUS_API_KEY` from `.env.local`
2. Try to start conversation

**Expected**:
- ✅ Shows error message: "Tavus configuration missing"
- ✅ Console error with details

### Error 2: Invalid API Key
**Steps**:
1. Set invalid `TAVUS_API_KEY`
2. Try to start conversation

**Expected**:
- ✅ Shows error message: "Failed to start session"
- ✅ Console error with Tavus API response

### Error 3: Network Failure
**Steps**:
1. Disable network in DevTools
2. Try to start conversation

**Expected**:
- ✅ Shows error message
- ✅ Graceful error handling (no crashes)

---

## Success Criteria

### Phase 1 MVP Complete When:
- ✅ All 10 test scenarios pass
- ✅ Console logging shows complete data capture
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ Conversation terminates reliably on all triggers
- ✅ Engagement tracking works (even if mocked)
- ✅ Timer enforces 4-minute hard stop
- ✅ Quiz-gating works correctly

---

## Next Steps (Phase 2)

After Phase 1 testing complete:
1. Set up ngrok for webhook testing
2. Configure perception queries in Tavus dashboard
3. Create perception webhook endpoint
4. Test perception analysis data capture
5. Verify enriched console logging with visual engagement

---

## Troubleshooting

### Issue: Conversation doesn't start
**Check**:
- Environment variables set correctly
- Tavus API key valid
- Persona ID exists in Tavus dashboard
- Network connectivity
- Browser console for errors

### Issue: Engagement not tracking
**Note**: Phase 1 uses mock engagement (increments every 2 seconds)
- This is expected behavior
- Phase 2 will use real Daily.co audio levels

### Issue: Timer doesn't stop at 0:00
**Check**:
- `onExpire` callback firing
- `handleTimerExpire` function called
- Console for termination logs

### Issue: Conversation doesn't terminate
**Check**:
- `/api/learning-checks/terminate` endpoint working
- Tavus API responding
- Console for termination errors
- Network tab in DevTools

---

## Demo Preparation

### Before Demo:
1. ✅ Test all scenarios
2. ✅ Clear browser console
3. ✅ Have valid Tavus credentials
4. ✅ Prepare chapter with passed quiz
5. ✅ Open DevTools console for data visibility

### During Demo:
1. Show locked state (quiz not passed)
2. Pass quiz
3. Show ready state
4. Start conversation
5. Show engagement tracking
6. Let timer run or manually end
7. Show completion data in console
8. Explain Phase 2 enhancements (perception, persistence)

---

**Questions?** See [Implementation Guide](./learning-check-implementation.md) for technical details.
