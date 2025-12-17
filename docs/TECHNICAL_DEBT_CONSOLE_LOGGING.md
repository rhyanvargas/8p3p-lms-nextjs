# Technical Debt: Console Logging Cleanup

**Status**: 🟡 Tracking  
**Priority**: Medium  
**Target**: Before Production Launch  
**Created**: October 31, 2025  
**Estimated Effort**: 1-2 hours

---

## Issue Description

The codebase currently contains **63 console.log/warn/error statements** that are not wrapped in environment conditionals. These logs will execute in production, potentially exposing debugging information and impacting performance.

---

## Impact Assessment

### **Current State**
- 63 console statements across 16 files
- All logs execute regardless of environment
- No structured logging mechanism in place

### **Production Impact**
- **Performance**: Minimal but measurable overhead
- **Security**: Potential exposure of internal state/data
- **Debugging**: Cluttered browser console for end users
- **Monitoring**: No structured log aggregation

### **Priority Justification**
- ✅ Not blocking for MVP/development
- ⚠️ Should be resolved before production launch
- 🎯 Improves production quality and debugging experience

---

## Affected Files

### **High Concentration** (Priority 1)
1. `src/components/course/chapter-content/learning-check.tsx` - **19 logs**
   - Analytics tracking
   - State transitions
   - Engagement tracking
   - Timer events

2. `src/app/dashboard/page.tsx` - **9 logs**
   - Course data logging
   - User state debugging

### **API Routes** (Priority 2)
3. `src/app/api/learning-checks/conversation/[conversationId]/end/route.ts` - **5 logs**
4. `src/app/api/learning-checks/conversation/route.ts` - **3 logs**
5. `src/app/api/learning-checks/update-persona/route.ts` - **3 logs**
6. `src/app/api/learning-checks/guardrails/route.ts` - **2 logs**
7. `src/app/api/learning-checks/objectives/route.ts` - **2 logs**
8. `src/app/api/learning-checks/terminate/route.ts` - **4 logs**

### **Components & Hooks** (Priority 3)
9. `src/components/cvi/hooks/use-cvi-call.tsx` - **5 logs**
10. `src/components/course/chapter-content/learning-check-base.tsx` - **2 logs**
11. `src/components/course/chapter-content/index.tsx` - **1 log**
12. `src/components/course/layout-breadcrumbs.tsx` - **2 logs**
13. `src/components/auth/EmailVerificationHandler.tsx` - **1 log**
14. `src/components/ui/navbar.tsx` - **1 log**
15. `src/components/video/video-player.tsx` - **1 log**
16. `src/lib/tavus/README.md` - **3 logs** (documentation examples)

---

## Proposed Solution

### **Implementation Plan**

#### **Phase 1: Create Logger Utility**

Create `src/lib/logger.ts`:

```typescript
/**
 * Conditional logger that only outputs in development
 * Structured for future enhancement with log aggregation
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Development-only logging
   */
  log(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(message, context || '');
    }
  }

  /**
   * Development-only warnings
   */
  warn(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.warn(message, context || '');
    }
  }

  /**
   * Always log errors (including production)
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    console.error(message, error, context || '');
    
    // TODO: Future - Send to error monitoring service (Sentry, etc.)
    // if (!this.isDevelopment) {
    //   sendToErrorMonitoring(message, error, context);
    // }
  }

  /**
   * Development-only info logs
   */
  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.info(message, context || '');
    }
  }

  /**
   * Analytics/metrics logging
   * These should be sent to analytics service in production
   */
  analytics(event: string, data?: Record<string, unknown>) {
    if (this.isDevelopment) {
      console.log(`📊 Analytics: ${event}`, data);
    }
    
    // TODO: Future - Send to analytics service
    // sendToAnalytics(event, data);
  }
}

export const logger = new Logger();
```

#### **Phase 2: Replace Console Statements**

**Example Migration Pattern**:

```typescript
// BEFORE
console.log("🎯 Creating conversation with structured assets:", {
  objectivesId: objectivesId || "fallback to context-only",
  guardrailsId: guardrailsId || "fallback to context-only"
});

// AFTER
logger.log("Creating conversation with structured assets", {
  component: "LearningCheck",
  action: "createConversation",
  objectivesId: objectivesId || "fallback",
  guardrailsId: guardrailsId || "fallback"
});
```

**Analytics Events**:

```typescript
// BEFORE
console.log("📊 Analytics: lc_started", { ... });

// AFTER
logger.analytics("lc_started", { ... });
```

**Error Handling**:

```typescript
// BEFORE
console.error('Error creating conversation:', error);

// AFTER
logger.error('Failed to create conversation', error, {
  component: "LearningCheck",
  chapterId,
});
```

#### **Phase 3: Verify Changes**

```bash
# Should find 0 direct console.log calls
grep -r "console\\.log" src/ --exclude-dir=node_modules

# Should find logger usage instead
grep -r "logger\\." src/ --exclude-dir=node_modules
```

---

## Migration Checklist

### **Phase 1: Setup** (15 minutes)
- [ ] Create `src/lib/logger.ts` utility
- [ ] Add logger export to `src/lib/index.ts` (if exists)
- [ ] Test logger in development and production modes
- [ ] Add TypeScript types for structured logging

### **Phase 2: Component Migration** (30 minutes)
- [ ] `learning-check.tsx` (19 logs)
- [ ] `dashboard/page.tsx` (9 logs)
- [ ] `use-cvi-call.tsx` (5 logs)
- [ ] `learning-check-base.tsx` (2 logs)
- [ ] Other components (5 logs)

### **Phase 3: API Route Migration** (20 minutes)
- [ ] `conversation/route.ts` (3 logs)
- [ ] `conversation/[id]/end/route.ts` (5 logs)
- [ ] `update-persona/route.ts` (3 logs)
- [ ] `terminate/route.ts` (4 logs)
- [ ] `guardrails/route.ts` (2 logs)
- [ ] `objectives/route.ts` (2 logs)

### **Phase 4: Verification** (10 minutes)
- [ ] Run grep to verify no direct console.log calls
- [ ] Test development logging works
- [ ] Test production build has no logs
- [ ] Verify error logs still work in production
- [ ] Update linting rules to disallow direct console usage

---

## Future Enhancements

### **Production Logging** (Post-Launch)
1. **Error Monitoring Integration**
   - Sentry, Rollbar, or similar
   - Automatic error reporting with stack traces
   - User context and session info

2. **Analytics Integration**
   - Google Analytics, Mixpanel, or Amplitude
   - Convert console analytics to real tracking
   - User journey and conversion tracking

3. **Server-Side Logging**
   - Winston, Pino, or Bunyan for API routes
   - Log aggregation (CloudWatch, DataDog)
   - Structured JSON logging

### **ESLint Rule** (Recommended)
Add to `eslint.config.mjs`:

```javascript
rules: {
  'no-console': ['error', { 
    allow: [] // Disallow all console usage
  }],
  // Or use a custom rule that only allows logger
}
```

---

## Testing Strategy

### **Development Environment**
- ✅ Logs should appear in console
- ✅ All log levels should work
- ✅ Structured context should display

### **Production Build**
```bash
# Build and check bundle
npm run build

# Verify no development logs in production JS
grep -r "console\.log" .next/static/chunks/

# Should only find logger.error calls (production-safe)
```

### **Manual Testing**
1. Start learning check conversation
2. Open browser console (production mode)
3. Verify no debug logs appear
4. Trigger an error
5. Verify error IS logged (with context)

---

## Success Criteria

- [ ] **Zero direct console statements** in src/ (except errors)
- [ ] **Logger utility implemented** with environment conditionals
- [ ] **All 63 logs migrated** to structured logger
- [ ] **Development logs work** as expected
- [ ] **Production build clean** - no debug logs in bundle
- [ ] **ESLint rule added** to prevent future console usage
- [ ] **Documentation updated** with logging standards

---

## Related Documentation

- [ESLint Configuration](./eslint-rules.md) - Update with console rules
- [Development Standards](../specs/01-development-standards.md) - Add logging section
- [Production Deployment](./DEPLOYMENT.md) - Pre-launch checklist

---

## Timeline

**Recommended**: Before production launch  
**Estimated**: 1-2 hours for full migration  
**Blocking**: No (can ship with console logs for MVP)  
**Technical Debt**: Yes (should be resolved before scale)

---

## Notes

- Console.error statements can remain in production for critical errors
- Analytics logs should eventually connect to real analytics service
- Structured logging provides better debugging in production
- This is a common pattern in production Next.js applications

---

**Last Updated**: October 31, 2025  
**Tracking Issue**: #TBD (Create GitHub issue when ready)  
**Milestone**: Production Hardening
