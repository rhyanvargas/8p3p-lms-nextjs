# Tavus Integration Guide

Complete guide for integrating Tavus Conversational Video Interface (CVI) in the 8P3P LMS.

**Quick Links:**
- [Setup](#setup) - Get started quickly
- [Configuration](#configuration) - Constants and environment variables
- [Creating Personas](#creating-personas) - Persona creation workflow
- [API Reference](./TAVUS_API_REFERENCE.md) - Complete API documentation

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Configuration](#configuration)
4. [Creating Personas](#creating-personas)
5. [Troubleshooting](#troubleshooting)

---

## Overview

### What is Tavus?

Tavus provides AI-powered conversational video interfaces for real-time learning support. Our Learning Check feature uses:

- **Objectives** - Structured assessment sequence (recall → application → self-explanation)
- **Guardrails** - Behavioral boundaries (quiz protection, time management, scope)
- **Personas** - AI instructor personality and behavior
- **Context** - Chapter-specific information and learning objectives

### Architecture

```
src/lib/tavus/
├── config.ts          # All Tavus configurations
├── index.ts           # Centralized exports
└── README.md          # Architecture documentation

src/app/api/learning-checks/
├── objectives/        # Create objectives
├── guardrails/        # Create guardrails
├── conversation/      # Start conversations
└── update-persona/    # Update persona

scripts/
└── create-persona.sh  # Persona creation script
```

---

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Required: Tavus API credentials
TAVUS_API_KEY=your_tavus_api_key_here
TAVUS_PERSONA_ID=your_persona_id_here

# Optional: Webhook configuration
TAVUS_WEBHOOK_SECRET=your_webhook_secret_here
TAVUS_WEBHOOK_URL=https://your-domain.com/api/webhooks/tavus

# Learning Check Assets (create these in step 3)
NEXT_PUBLIC_TAVUS_LEARNING_CHECK_OBJECTIVES_ID=o_your_id
NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID=g_your_id
```

**Optional Overrides** (defaults in `src/lib/tavus/config.ts`):
```bash
# TAVUS_LEARNING_CHECK_DURATION=180        # Default: 180 seconds (3 min)
# TAVUS_MAX_CONCURRENT_SESSIONS=10         # Default: 10
```

### 2. Start Development Server

```bash
npm run dev
```

Server should be running on `http://localhost:3000`

### 3. Create Objectives and Guardrails

**Option A: Using API Routes** (Recommended)

```bash
# Create objectives
curl -X POST http://localhost:3000/api/learning-checks/objectives \
  -H "Content-Type: application/json" \
  -d '{}'

# Response: {"objectives_id": "o_abc123"}

# Create guardrails
curl -X POST http://localhost:3000/api/learning-checks/guardrails \
  -H "Content-Type: application/json" \
  -d '{}'

# Response: {"guardrails_id": "g_xyz789"}
```

**Option B: Using Tavus Platform**

1. Go to https://platform.tavus.io/conversations/builder
2. Create objectives and guardrails using visual builder
3. Copy the IDs

**Add IDs to `.env.local`:**
```bash
NEXT_PUBLIC_TAVUS_LEARNING_CHECK_OBJECTIVES_ID=o_abc123
NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID=g_xyz789
```

### 4. Restart Server

```bash
# Stop server (Ctrl+C) and restart
npm run dev
```

✅ **Setup Complete!** Your Learning Check feature is now configured.

---

## Configuration

### Constants vs Environment Variables

**Rule of Thumb:**
- **Constants** → Same across all environments (in code)
- **Environment Variables** → Different per environment or secrets (in `.env.local`)

### Constants (`src/lib/tavus/config.ts`)

Application-level values that don't change:

```typescript
import { TAVUS_DEFAULTS } from '@/lib/tavus';

TAVUS_DEFAULTS.API_BASE_URL              // "https://tavusapi.com/v2"
TAVUS_DEFAULTS.LEARNING_CHECK_DURATION   // 180 seconds (3 minutes)
TAVUS_DEFAULTS.MAX_CONCURRENT_SESSIONS   // 10
TAVUS_DEFAULTS.ENGAGEMENT_THRESHOLD      // 90
TAVUS_DEFAULTS.CONVERSATION_TIMEOUT      // 60 seconds
TAVUS_DEFAULTS.TEST_MODE                 // false
```

### Environment Variables (Type-Safe Access)

Use `TAVUS_ENV` helpers instead of `process.env`:

```typescript
import { TAVUS_ENV, TAVUS_DEFAULTS } from '@/lib/tavus';

// ✅ Type-safe with fallback to default
const duration = TAVUS_ENV.getLearningCheckDuration();
// Returns: env value OR TAVUS_DEFAULTS.LEARNING_CHECK_DURATION

// ✅ Type-safe secret access
const apiKey = TAVUS_ENV.getApiKey();
// Returns: string | undefined

// ✅ All available helpers
TAVUS_ENV.getApiKey()                    // API key
TAVUS_ENV.getPersonaId()                 // Persona ID
TAVUS_ENV.getLearningCheckDuration()     // Duration with fallback
TAVUS_ENV.getMaxConcurrentSessions()     // Max sessions with fallback
TAVUS_ENV.getWebhookSecret()             // Webhook secret
TAVUS_ENV.getWebhookUrl()                // Webhook URL
TAVUS_ENV.getObjectivesId()              // Objectives ID
TAVUS_ENV.getGuardrailsId()              // Guardrails ID
```

### Usage in API Routes

```typescript
import { TAVUS_ENV, TAVUS_DEFAULTS } from '@/lib/tavus';

export async function POST(request: NextRequest) {
  // Get secrets (required)
  const apiKey = TAVUS_ENV.getApiKey();
  const personaId = TAVUS_ENV.getPersonaId();
  
  if (!apiKey || !personaId) {
    return NextResponse.json(
      { error: 'Missing Tavus configuration' },
      { status: 500 }
    );
  }

  // Use constants
  const apiUrl = TAVUS_DEFAULTS.API_BASE_URL;
  const testMode = TAVUS_DEFAULTS.TEST_MODE;
  
  // Get optional values with fallbacks
  const duration = TAVUS_ENV.getLearningCheckDuration();
  
  const response = await fetch(`${apiUrl}/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      persona_id: personaId,
      test_mode: testMode,
      max_call_duration: duration,
    }),
  });
}
```

### What Goes Where?

| Value | Constant? | Env Var? | Why |
|-------|-----------|----------|-----|
| API Base URL | ✅ | ❌ | Same for everyone |
| Session Duration | ✅ | ✅ (optional) | Default constant, can override |
| API Key | ❌ | ✅ | Secret, different per env |
| Persona ID | ❌ | ✅ | Different per env |
| Test Mode | ✅ | ❌ | Application-level setting |
| Webhook URL | ❌ | ✅ | Different per deployment |

---

## Creating Personas

### Quick Start

```bash
# Make script executable (first time only)
chmod +x scripts/create-persona.sh

# Create persona (reads objectives/guardrails from .env.local)
./scripts/create-persona.sh

# Or specify IDs manually
./scripts/create-persona.sh \
  --objectives-id o_abc123 \
  --guardrails-id g_xyz789
```

### What Gets Created

The script creates a persona with:

#### **Core Settings**
- **Name**: "8p3p - AI Instructor Assistant"
- **Pipeline Mode**: Full (recommended)
- **System Prompt**: Knowledgeable, supportive tutor personality
- **Context**: 3-minute learning check conversation guidelines

#### **Layers Configuration**

**Perception (Raven-0)**
- Ambient awareness queries for engagement tracking
- Visual analysis of learner attention and comprehension

**STT (Tavus-advanced)**
- High pause sensitivity
- Medium interrupt sensitivity
- Smart turn detection

**LLM (Tavus-llama)**
- Optimized for conversations
- Speculative inference enabled

**TTS (Sonic-2)**
- Natural voice synthesis
- Emotion control

### Complete Workflow

#### For a Brand New Account

**1. Create Objectives and Guardrails First**
```bash
npm run dev

# Create objectives
curl -X POST http://localhost:3000/api/learning-checks/objectives \
  -H "Content-Type: application/json" \
  -d '{}'

# Create guardrails
curl -X POST http://localhost:3000/api/learning-checks/guardrails \
  -H "Content-Type: application/json" \
  -d '{}'

# Add IDs to .env.local
```

**2. Create Persona**
```bash
# Script automatically reads IDs from .env.local
./scripts/create-persona.sh

# Or specify manually
./scripts/create-persona.sh \
  --objectives-id o_abc123 \
  --guardrails-id g_xyz789
```

**3. Update Environment**
```bash
# Add persona ID to .env.local
TAVUS_PERSONA_ID=p_new_persona_id
```

**4. Restart Server**
```bash
npm run dev
```

### Updating an Existing Persona

If you already have a persona and want to update it with objectives/guardrails:

```bash
# Use the update-persona API route
curl -X PATCH http://localhost:3000/api/learning-checks/update-persona \
  -H "Content-Type: application/json" \
  -d '{
    "persona_id": "p_your_persona_id",
    "objectives_id": "o_your_objectives_id",
    "guardrails_id": "g_your_guardrails_id"
  }'
```

### Saved Configuration

After creation, the script saves the full response to:
```
docs/persona-created-YYYYMMDD-HHMMSS.json
```

This file contains the complete persona configuration for reference.

---

## Troubleshooting

### Missing API Key

```bash
# Check your API key
echo $TAVUS_API_KEY

# Or check .env.local
grep TAVUS_API_KEY .env.local
```

**Solution**: Add `TAVUS_API_KEY` to `.env.local`

### Persona Created but Missing Objectives/Guardrails

```bash
# Create objectives and guardrails
curl -X POST http://localhost:3000/api/learning-checks/objectives \
  -H "Content-Type: application/json" \
  -d '{}'

curl -X POST http://localhost:3000/api/learning-checks/guardrails \
  -H "Content-Type: application/json" \
  -d '{}'

# Update the persona
curl -X PATCH http://localhost:3000/api/learning-checks/update-persona \
  -H "Content-Type: application/json" \
  -d '{
    "persona_id": "p_your_id",
    "objectives_id": "o_your_id",
    "guardrails_id": "g_your_id"
  }'
```

### Need to Recreate Persona

```bash
# Just run the script again
./scripts/create-persona.sh

# It creates a NEW persona (doesn't update existing)
# Update TAVUS_PERSONA_ID in .env.local with the new ID
```

### Script Permission Denied

```bash
chmod +x scripts/create-persona.sh
```

### Environment Variables Not Loading

```bash
# Restart your development server
npm run dev
```

Environment variables are loaded at server startup.

### Conversation Not Starting

**Check:**
1. ✅ `TAVUS_API_KEY` is set
2. ✅ `TAVUS_PERSONA_ID` is set
3. ✅ `NEXT_PUBLIC_TAVUS_LEARNING_CHECK_OBJECTIVES_ID` is set
4. ✅ `NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID` is set
5. ✅ Server is running on `http://localhost:3000`

**Verify in console:**
```bash
# Check all Tavus env vars
grep TAVUS .env.local
```

---

## 📚 Additional Resources

- **API Reference**: [TAVUS_API_REFERENCE.md](./TAVUS_API_REFERENCE.md)
- **Architecture**: `src/lib/tavus/README.md`
- **Tavus Docs**: https://docs.tavus.io
- **Tavus Platform**: https://platform.tavus.io

---

## 🎯 Quick Reference

### Common Commands

```bash
# Create objectives
curl -X POST http://localhost:3000/api/learning-checks/objectives \
  -H "Content-Type: application/json" -d '{}'

# Create guardrails
curl -X POST http://localhost:3000/api/learning-checks/guardrails \
  -H "Content-Type: application/json" -d '{}'

# Create persona
./scripts/create-persona.sh

# Update persona
curl -X PATCH http://localhost:3000/api/learning-checks/update-persona \
  -H "Content-Type: application/json" \
  -d '{"persona_id": "p_id", "objectives_id": "o_id", "guardrails_id": "g_id"}'
```

### Import Examples

```typescript
// Import configurations
import {
  LEARNING_CHECK_OBJECTIVES,
  LEARNING_CHECK_GUARDRAILS,
  PERSONA_CONFIG,
  buildChapterContext,
  buildGreeting,
  TAVUS_DEFAULTS,
  TAVUS_ENV,
} from '@/lib/tavus';

// Use in code
const apiKey = TAVUS_ENV.getApiKey();
const duration = TAVUS_ENV.getLearningCheckDuration();
const apiUrl = TAVUS_DEFAULTS.API_BASE_URL;
const context = buildChapterContext('ch1', 'Introduction to EMDR');
const greeting = buildGreeting('Introduction to EMDR');
```

---

**Last Updated**: October 30, 2025
