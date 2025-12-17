# Tavus Objective Completion Tracking

How to track when learners complete learning objectives during Tavus conversations.

---

## 🎯 Overview

Tavus provides two ways to track objective completion:

1. **Real-Time Callbacks** - Per-objective webhooks notify when each objective is completed
2. **End-of-Conversation Transcript** - Full conversation history with all collected data

---

## 📊 Method 1: Real-Time Objective Callbacks

### **How It Works**

Each objective in your objectives configuration can have its own `callback_url` that gets notified when that specific objective is completed.

### **Objective Configuration**

```typescript
// src/lib/tavus/config.ts
export const LEARNING_CHECK_OBJECTIVES = {
  name: "Learning Check Compliance Objectives",
  data: [
    {
      objective_name: "recall_assessment",
      objective_prompt: "Ask at least one recall question...",
      confirmation_mode: "auto", // or "manual"
      modality: "verbal",
      output_variables: ["recall_key_terms", "recall_score"],
      next_required_objectives: ["application_assessment"],
      callback_url: "https://your-app.com/api/webhooks/objectives/recall" // ← Per-objective webhook
    }
  ]
};
```

### **Webhook Payload Structure**

When an objective is completed, Tavus sends a POST request to the `callback_url`:

```json
{
  "conversation_id": "c0b934942640d424",
  "objective_name": "recall_assessment",
  "objective_status": "completed",
  "output_variables": {
    "recall_key_terms": "bilateral stimulation, adaptive information processing",
    "recall_score": 85
  },
  "timestamp": "2025-10-31T21:30:00.000Z"
}
```

### **Implementation Example**

```typescript
// src/app/api/webhooks/objectives/[objectiveName]/route.ts
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ objectiveName: string }> }
) {
  const { objectiveName } = await params;
  const payload = await request.json();
  
  console.log(`Objective ${objectiveName} completed!`, payload);
  
  // Store completion data
  await database.learningCheckObjectives.create({
    conversationId: payload.conversation_id,
    objectiveName: payload.objective_name,
    status: payload.objective_status,
    outputVariables: payload.output_variables,
    completedAt: new Date(payload.timestamp)
  });
  
  return NextResponse.json({ received: true });
}
```

---

## 📝 Method 2: End-of-Conversation Transcript

### **How It Works**

After a conversation ends, Tavus sends an `application.transcription_ready` webhook to your main `callback_url` with the complete conversation transcript and all collected objective data.

### **Webhook Configuration**

```typescript
// Set callback_url when creating conversation
const conversationBody = {
  persona_id: personaId,
  objectives_id: objectivesId,
  callback_url: "https://your-app.com/api/webhooks/tavus" // ← Main webhook
  // ...
};
```

### **Webhook Payload Structure**

```json
{
  "conversation_id": "c0b934942640d424",
  "event_type": "application.transcription_ready",
  "message_type": "application",
  "timestamp": "2025-10-31T21:35:00.000Z",
  "properties": {
    "replica_id": "r9fa0878977a",
    "transcript": [
      {
        "role": "assistant",
        "content": "Hi! I'm excited to chat with you about EMDR Foundations..."
      },
      {
        "role": "user",
        "content": "Hi! I'm ready to discuss what I learned."
      },
      // ... full conversation
    ],
    "objectives_completed": [
      {
        "objective_name": "recall_assessment",
        "status": "completed",
        "output_variables": {
          "recall_key_terms": "bilateral stimulation, adaptive information processing",
          "recall_score": 85
        }
      },
      {
        "objective_name": "application_assessment",
        "status": "completed",
        "output_variables": {
          "application_example": "Using eye movements during trauma processing",
          "application_score": 90
        }
      },
      {
        "objective_name": "self_explanation_assessment",
        "status": "completed",
        "output_variables": {
          "explanation_summary": "EMDR helps process traumatic memories by...",
          "explanation_score": 88
        }
      }
    ]
  }
}
```

### **Implementation Example**

```typescript
// src/app/api/webhooks/tavus/route.ts
export async function POST(request: NextRequest) {
  const payload = await request.json();
  
  if (payload.event_type === "application.transcription_ready") {
    const { conversation_id, properties } = payload;
    
    // Extract objectives completion data
    const objectivesData = properties.objectives_completed || [];
    
    // Calculate overall learning check score
    const scores = objectivesData.map(obj => 
      obj.output_variables?.score || 0
    );
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // Store learning check results
    await database.learningCheckResults.create({
      conversationId: conversation_id,
      overallScore: averageScore,
      objectivesCompleted: objectivesData.length,
      transcript: properties.transcript,
      completedAt: new Date(payload.timestamp)
    });
    
    // Send completion notification to learner
    await notifyLearner(conversation_id, averageScore);
  }
  
  return NextResponse.json({ received: true });
}
```

---

## 🔄 Complete Flow

```
1. Learner joins conversation
   ↓
2. AI asks recall question (objective 1)
   ↓ (if callback_url set on objective)
3. Webhook: "recall_assessment completed" → /api/webhooks/objectives/recall
   ↓
4. AI asks application question (objective 2)
   ↓ (if callback_url set on objective)
5. Webhook: "application_assessment completed" → /api/webhooks/objectives/application
   ↓
6. AI asks self-explanation question (objective 3)
   ↓ (if callback_url set on objective)
7. Webhook: "self_explanation_assessment completed" → /api/webhooks/objectives/explanation
   ↓
8. Conversation ends (3 minutes elapsed)
   ↓
9. Webhook: "transcription_ready" → /api/webhooks/tavus
   ↓ (includes all objectives + transcript)
10. Display results to learner ✅
```

---

## ⚙️ Configuration Options

### **Option 1: Per-Objective Webhooks** (Real-Time)

**Pros:**
- Real-time notifications as each objective completes
- Can update UI progressively
- Granular control per objective

**Cons:**
- More webhook endpoints to manage
- Multiple requests per conversation

**Best For:** Live progress indicators, real-time feedback

### **Option 2: End-of-Conversation Webhook** (Batch)

**Pros:**
- Single webhook handles everything
- Complete context with full transcript
- Simpler implementation

**Cons:**
- Only get data after conversation ends
- Can't show real-time progress

**Best For:** Post-conversation analysis, final scoring

### **Option 3: Hybrid** (Recommended for MVP)

Use end-of-conversation webhook only to keep it simple, then add per-objective webhooks later if you need real-time progress.

---

## 🛠️ Implementation Steps for MVP

### **Step 1: Create Webhook Endpoint**

```typescript
// src/app/api/webhooks/tavus/route.ts
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    console.log("Tavus webhook received:", payload.event_type);
    
    // Handle different webhook types
    switch (payload.event_type) {
      case "system.replica_joined":
        console.log("Replica joined conversation");
        break;
        
      case "system.shutdown":
        console.log("Conversation ended");
        break;
        
      case "application.transcription_ready":
        // This is where we get objectives completion data
        await handleTranscriptionReady(payload);
        break;
        
      case "application.perception_analysis":
        // Visual engagement data (if Raven enabled)
        await handlePerceptionAnalysis(payload);
        break;
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

async function handleTranscriptionReady(payload: any) {
  const { conversation_id, properties } = payload;
  
  // Extract objectives data
  const objectivesCompleted = properties.objectives_completed || [];
  
  console.log(`Conversation ${conversation_id} objectives:`, objectivesCompleted);
  
  // TODO: Store in database
  // TODO: Calculate scores
  // TODO: Update learner's progress
}
```

### **Step 2: Add Webhook URL to Environment**

```bash
# .env.local
TAVUS_WEBHOOK_URL=https://your-app.com/api/webhooks/tavus
```

### **Step 3: Test with ngrok (Development)**

```bash
# Start ngrok
ngrok http 3000

# Update .env.local with ngrok URL
TAVUS_WEBHOOK_URL=https://abc123.ngrok.io/api/webhooks/tavus

# Test conversation and watch webhook logs
npm run dev
```

### **Step 4: Deploy Webhook (Production)**

```bash
# Production webhook URL
TAVUS_WEBHOOK_URL=https://8p3p-lms.com/api/webhooks/tavus
```

---

## 🔐 Security Best Practices

### **Validate Webhook Authenticity**

```typescript
// Verify webhook is from Tavus
export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-tavus-signature");
  const payload = await request.text();
  
  // Verify signature if Tavus provides one
  if (!verifySignature(signature, payload)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  
  // Process webhook...
}
```

### **Store Webhook Secret**

```bash
# .env.local
TAVUS_WEBHOOK_SECRET=your_webhook_secret_here
```

---

## 📊 Data Schema Example

```typescript
// Database schema for learning check results
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
  duration: number; // seconds
  objectivesCompleted: number;
  completedAt: Date;
}
```

---

## 📚 Related Documentation

- [Tavus Webhooks Guide](https://docs.tavus.io/sections/webhooks-and-callbacks)
- [Tavus Objectives](https://docs.tavus.io/sections/conversational-video-interface/persona/objectives)
- [Conversation API Route](../src/app/api/learning-checks/conversation/route.ts)
- [Tavus Config](../src/lib/tavus/config.ts)

---

## 🎉 Summary

**For MVP:**
1. ✅ Use `callback_url` on conversation creation
2. ✅ Handle `application.transcription_ready` webhook
3. ✅ Extract `objectives_completed` from payload
4. ✅ Calculate scores from `output_variables`
5. ✅ Display results to learner

**Post-MVP Enhancements:**
- Add per-objective webhooks for real-time progress
- Implement perception analysis for engagement metrics
- Add database storage for historical analysis
- Create analytics dashboard for instructors
