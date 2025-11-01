# API Routes Documentation

## Learning Checks API

Server-side API routes for Tavus Conversational Video Interface (CVI) integration.

---

## 🎯 **Overview**

These routes proxy Tavus API calls to keep API keys secure on the server:

```
Client → Next.js API Route → Tavus API
         (has API key)        (requires API key)
```

---

## 📋 **Routes**

### **1. Create Conversation**

**Endpoint:** `POST /api/learning-checks/conversation`

**Purpose:** Create a new Tavus conversation for a learning check.

**Request Body:**
```typescript
{
  chapterId: string;      // Required
  chapterTitle: string;   // Required
  objectivesId?: string;  // Optional
  guardrailsId?: string;  // Optional
}
```

**Response:**
```typescript
{
  conversationUrl: string;  // URL to join conversation
  conversationId: string;   // Unique identifier
  expiresAt: string;        // Expiration timestamp
}
```

**Tavus API Call:**
```
POST https://tavusapi.com/v2/conversations
Header: x-api-key: {TAVUS_API_KEY}
```

**File:** `src/app/api/learning-checks/conversation/route.ts`

---

### **2. End Conversation**

**Endpoint:** `POST /api/learning-checks/conversation/[conversationId]/end`

**Purpose:** End an active Tavus conversation (not delete - conversation remains in system but is terminated).

**Path Parameters:**
- `conversationId` - Unique conversation identifier

**Response:**
```typescript
{
  success: true;
  conversation_id: string;
}
```

**Error Responses:**
- `400` - Invalid conversation_id
- `401` - Invalid access token
- `500` - Internal server error

**Tavus API Call:**
```
POST https://tavusapi.com/v2/conversations/{conversation_id}/end
Header: x-api-key: {TAVUS_API_KEY}
```

**Note:** Both our route and Tavus use POST (not DELETE) because we're ending/terminating the conversation, not deleting it from the system.

**File:** `src/app/api/learning-checks/conversation/[conversationId]/end/route.ts`

**Official Docs:** https://docs.tavus.io/api-reference/conversations/end-conversation

---

## 🔒 **Security**

### **API Key Protection**

```typescript
// ✅ Server-side only (safe)
const apiKey = TAVUS_ENV.getApiKey();

// ❌ NEVER do this (exposed to client)
const apiKey = process.env.NEXT_PUBLIC_TAVUS_API_KEY;
```

### **Environment Variables**

```bash
# .env.local
TAVUS_API_KEY=your_secret_key_here
TAVUS_PERSONA_ID=your_persona_id_here
```

**Access Pattern:**
```typescript
import { TAVUS_ENV } from "@/lib/tavus";

const apiKey = TAVUS_ENV.getApiKey();      // ✅ Safe
const personaId = TAVUS_ENV.getPersonaId(); // ✅ Safe
```

---

## 📊 **Request Flow**

### **Create Conversation**

```
1. Client calls: POST /api/learning-checks/conversation
   Body: { chapterId, chapterTitle }

2. Next.js API Route:
   - Gets TAVUS_API_KEY from environment
   - Builds conversation config
   - Calls Tavus API

3. Tavus API:
   - Creates conversation
   - Returns conversation_url and conversation_id

4. Response to client:
   { conversationUrl, conversationId, expiresAt }
```

### **End Conversation**

```
1. Client calls: DELETE /api/.../[conversationId]/end

2. Next.js API Route:
   - Gets TAVUS_API_KEY from environment
   - Validates conversationId
   - Calls Tavus API

3. Tavus API:
   - Ends conversation
   - Returns success

4. Response to client:
   { success: true, conversation_id }
```

---

## 🧪 **Testing**

### **Manual Testing**

```bash
# 1. Create conversation
curl -X POST http://localhost:3000/api/learning-checks/conversation \
  -H "Content-Type: application/json" \
  -d '{"chapterId":"ch1","chapterTitle":"Introduction"}'

# Response: { conversationUrl, conversationId, expiresAt }

# 2. End conversation (use conversationId from step 1)
curl -X POST http://localhost:3000/api/learning-checks/conversation/c123456/end

# Response: { success: true, conversation_id: "c123456" }
```

### **Client Usage**

```typescript
// Create conversation
const response = await fetch("/api/learning-checks/conversation", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chapterId: "chapter-1",
    chapterTitle: "Chapter 1",
  }),
});
const { conversationUrl, conversationId } = await response.json();

// End conversation
await fetch(`/api/learning-checks/conversation/${conversationId}/end`, {
  method: "POST",
});
```

---

## 📚 **Related Documentation**

- **Tavus API Reference:** `docs/TAVUS_API_REFERENCE.md`
- **Tavus Configuration:** `src/lib/tavus/config.ts`
- **Environment Variables:** `src/lib/tavus/config.ts` (TAVUS_ENV helpers)
- **Official Tavus Docs:** https://docs.tavus.io

---

## ✅ **Quality Checklist**

- ✅ API keys stored server-side only
- ✅ Type-safe TypeScript interfaces
- ✅ Proper error handling (400, 401, 500)
- ✅ Logging for debugging
- ✅ Follows Tavus API specification
- ✅ Secure environment variable access
- ✅ RESTful route naming
- ✅ Clear documentation
