# Tavus API Reference

Complete reference documentation for Tavus Conversational Video Interface (CVI) APIs.

**Source**: https://docs.tavus.io/llms-full.txt  
**Last Updated**: October 30, 2025

---

## 📚 **Table of Contents**

1. [Personas](#personas)
2. [Objectives](#objectives)
3. [Guardrails](#guardrails)
4. [Conversations](#conversations)
5. [Replicas](#replicas)
6. [Documents (Knowledge Base)](#documents)
7. [Layers Configuration](#layers-configuration)

---

## 🎭 **Personas**

### **Create Persona**
```http
POST /v2/personas
```

Creates and customizes a digital replica's behavior and capabilities for CVI.

**Core Components:**
- **Replica** - Audio/visual appearance
- **Context** - Contextual information for LLM
- **System Prompt** - System-level instructions for LLM
- **Layers** - Perception, STT, LLM, TTS configuration

**Required Fields** (full pipeline mode):
- `system_prompt` - Required for full pipeline mode

**Example:**
```bash
curl --request POST \
  --url https://tavusapi.com/v2/personas \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '{
    "persona_name": "AI Instructor",
    "system_prompt": "You are a knowledgeable tutor...",
    "context": "You are having a conversation with a student...",
    "default_replica_id": "r12345",
    "objectives_id": "o12345",
    "guardrails_id": "g12345",
    "pipeline_mode": "full"
  }'
```

---

### **Patch Persona**
```http
PATCH /v2/personas/{persona_id}
```

Updates a persona using JSON Patch (RFC 6902).

**Supported Operations:**
- `add` - Add new field
- `remove` - Remove field
- `replace` - Replace field value
- `copy` - Copy field value
- `move` - Move field
- `test` - Test field value

**Example:**
```bash
curl --request PATCH \
  --url https://tavusapi.com/v2/personas/{persona_id} \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '[
    {"op": "replace", "path": "/system_prompt", "value": "Updated prompt"},
    {"op": "replace", "path": "/context", "value": "Updated context"},
    {"op": "add", "path": "/objectives_id", "value": "o12345"},
    {"op": "add", "path": "/guardrails_id", "value": "g12345"}
  ]'
```

**Important Notes:**
- Ensure `path` matches current persona schema
- For `remove` operation, `value` parameter not required
- Can modify **any field** within the persona

---

### **Get Persona**
```http
GET /v2/personas/{persona_id}
```

Returns a single persona by its unique identifier.

---

### **List Personas**
```http
GET /v2/personas
```

Returns all personas created by the account.

---

### **Delete Persona**
```http
DELETE /v2/personas/{persona_id}
```

Deletes a persona by its unique identifier.

---

## 🎯 **Objectives**

Objectives are goal-oriented instructions that define desired outcomes and conversation flow.

### **Key Concepts**
- Work alongside system prompt for structured conversations
- Best for purposeful conversations (sales, education, customer journeys)
- Provide flexible approach while maintaining natural interactions

### **Create Objectives**
```http
POST /v2/objectives
```

**Example:**
```bash
curl --request POST \
  --url https://tavusapi.com/v2/objectives \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '{
    "data": [
      {
        "objective_name": "recall_assessment",
        "objective_prompt": "Ask recall questions about key concepts",
        "confirmation_mode": "auto",
        "modality": "verbal",
        "next_required_objectives": ["application_assessment"]
      }
    ]
  }'
```

### **Parameters**
- `objective_name` - Unique identifier for the objective
- `objective_prompt` - Instructions for the objective
- `confirmation_mode` - `auto` or `manual`
- `modality` - `verbal` or `visual`
- `next_required_objectives` - Array of next objectives
- `next_conditional_objectives` - Conditional branching
- `output_variables` - Optional variables to extract
- `callback_url` - Optional webhook URL

### **Attaching to Persona**

**During Creation:**
```bash
curl --request POST \
  --url https://tavusapi.com/v2/personas \
  --data '{"objectives_id": "o12345"}'
```

**By Editing:**
```bash
curl --request PATCH \
  --url https://tavusapi.com/v2/personas/{persona_id} \
  --data '[{"op": "add", "path": "/objectives_id", "value": "o12345"}]'
```

### **Best Practices**
- ✅ Plan entire workflow before creating objectives
- ✅ Think through possible participant answers
- ✅ Ensure system prompt doesn't conflict with objectives
- ✅ Create branching structure for different paths

---

## 🛡️ **Guardrails**

Guardrails provide strict behavioral guidelines enforced throughout conversations.

### **Key Concepts**
- Act as safety layer alongside system prompt
- Enforce rules, restrictions, and behavioral patterns
- Prevent unwanted topics or responses
- Complement persona's intended functionality

### **Create Guardrails**
```http
POST /v2/guardrails
```

**Example:**
```bash
curl --request POST \
  --url https://tavusapi.com/v2/guardrails \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '{
    "name": "Learning Check Guardrails",
    "data": [
      {
        "guardrail_name": "quiz_protection",
        "guardrail_prompt": "Never reveal quiz answers",
        "modality": "verbal"
      },
      {
        "guardrail_name": "time_management",
        "guardrail_prompt": "Keep responses brief (1-2 sentences)",
        "modality": "verbal"
      }
    ]
  }'
```

### **Parameters**
- `guardrails_name` - Unique identifier
- `guardrails_prompt` - Strict behavioral rule
- `modality` - `verbal` or `visual`
- `callback_url` - Optional webhook URL

### **Attaching to Persona**

**During Creation:**
```bash
curl --request POST \
  --url https://tavusapi.com/v2/personas \
  --data '{"guardrails_id": "g12345"}'
```

**By Editing:**
```bash
curl --request PATCH \
  --url https://tavusapi.com/v2/personas/{persona_id} \
  --data '[{"op": "add", "path": "/guardrails_id", "value": "g12345"}]'
```

### **Best Practices**
- ✅ Be specific about restricted topics/behaviors
- ✅ Consider edge cases and creative prompting
- ✅ Ensure guardrails complement system prompt
- ✅ Test with various scenarios
- ✅ Create specific guardrails for different contexts

---

## 💬 **Conversations**

### **Create Conversation**
```http
POST /v2/conversations
```

**Example:**
```bash
curl --request POST \
  --url https://tavusapi.com/v2/conversations \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '{
    "persona_id": "p12345",
    "conversational_context": "Chapter-specific context...",
    "custom_greeting": "Hi! Ready to discuss this chapter?",
    "conversation_name": "Learning Check: Chapter 1",
    "objectives_id": "o12345",
    "guardrails_id": "g12345",
    "test_mode": true
  }'
```

**Response:**
```json
{
  "conversation_url": "https://...",
  "conversation_id": "c12345",
  "expires_at": "2025-10-30T12:00:00Z"
}
```

---

### **End Conversation**
```http
POST /v2/conversations/{conversation_id}/end
```

Terminates an active conversation.

---

### **Get Conversation**
```http
GET /v2/conversations/{conversation_id}
```

Returns conversation details and status.

---

### **List Conversations**
```http
GET /v2/conversations
```

Returns all conversations for the account.

---

### **Delete Conversation**
```http
DELETE /v2/conversations/{conversation_id}
```

Deletes a conversation by ID.

---

## 🎨 **Replicas**

### **Create Replica**
```http
POST /v2/replicas
```

Creates a new replica using `phoenix-3` model (default).

**Required Parameters:**

**Personal Replica:**
- `train_video_url` - Publicly accessible URL
- `consent_video_url` - Publicly accessible URL

**Non-Human Replica:**
- `train_video_url` - Publicly accessible URL

**Example:**
```bash
curl --request POST \
  --url https://tavusapi.com/v2/replicas \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '{
    "replica_name": "AI Instructor",
    "train_video_url": "https://...",
    "consent_video_url": "https://...",
    "model_name": "phoenix-3"
  }'
```

---

### **Get Replica**
```http
GET /v2/replicas/{replica_id}
```

Returns replica details including `training_progress` and `status`.

---

### **List Replicas**
```http
GET /v2/replicas
```

Returns all replicas for the account.

---

### **Delete Replica**
```http
DELETE /v2/replicas/{replica_id}
```

Deletes a replica (cannot be used in conversations after deletion).

---

## 📚 **Documents (Knowledge Base)**

### **Create Document**
```http
POST /v2/documents
```

Adds documents to the knowledge base for persona reference.

---

### **Get Document**
```http
GET /v2/documents/{document_id}
```

Returns document details.

---

### **List Documents**
```http
GET /v2/documents
```

Returns all documents.

---

### **Update Document**
```http
PATCH /v2/documents/{document_id}
```

Updates document content or metadata.

---

### **Delete Document**
```http
DELETE /v2/documents/{document_id}
```

Removes document from knowledge base.

---

## ⚙️ **Layers Configuration**

### **Perception Layer (Raven)**

Multimodal vision and understanding.

```json
{
  "perception": {
    "perception_model": "raven-0",
    "ambient_awareness_queries": [
      "How engaged is the learner?",
      "Are there signs of confusion?"
    ],
    "perception_analysis_queries": [],
    "perception_tool_prompt": "",
    "perception_tools": []
  }
}
```

**Parameters:**
- `perception_model` - Model version (e.g., `raven-0`)
- `ambient_awareness_queries` - Real-time visual analysis questions
- `perception_analysis_queries` - End-of-call analysis questions
- `perception_tool_prompt` - Tool usage instructions
- `perception_tools` - Array of tool definitions

---

### **STT Layer (Sparrow)**

Speech-to-text and turn-taking.

```json
{
  "stt": {
    "stt_engine": "tavus-advanced",
    "participant_pause_sensitivity": "high",
    "participant_interrupt_sensitivity": "medium",
    "smart_turn_detection": true,
    "hotwords": ""
  }
}
```

**Parameters:**
- `stt_engine` - Engine choice (`tavus-advanced`, etc.)
- `participant_pause_sensitivity` - `low`, `medium`, `high`
- `participant_interrupt_sensitivity` - `low`, `medium`, `high`
- `smart_turn_detection` - Boolean for turn-taking model
- `hotwords` - Comma-separated keywords for better recognition

---

### **LLM Layer**

Language model configuration.

```json
{
  "llm": {
    "model": "tavus-llama",
    "speculative_inference": true,
    "tools": [],
    "headers": {},
    "extra_body": {},
    "base_url": "",
    "api_key": ""
  }
}
```

**Tavus-Hosted Models:**
- `tavus-llama` - Default, optimized for conversations
- `tavus-gpt-4o` - GPT-4 powered

**Custom LLM:**
- Set `base_url`, `api_key`, and `model` for external LLMs

**Parameters:**
- `model` - Model identifier
- `speculative_inference` - Boolean for faster responses
- `tools` - Array of tool definitions
- `base_url` - Custom LLM endpoint (optional)
- `api_key` - Custom LLM API key (optional)

---

### **TTS Layer**

Text-to-speech configuration.

```json
{
  "tts": {
    "tts_model_name": "sonic-2",
    "tts_engine": "",
    "api_key": "",
    "external_voice_id": "",
    "tts_emotion_control": null,
    "voice_settings": {}
  }
}
```

**Parameters:**
- `tts_model_name` - Model version (e.g., `sonic-2`)
- `tts_engine` - Engine choice (optional)
- `external_voice_id` - Custom voice ID (optional)
- `tts_emotion_control` - Boolean for emotion control
- `voice_settings` - Custom voice parameters

---

## 🔗 **Related Documentation**

- **Tavus Full Docs**: https://docs.tavus.io/llms-full.txt
- **Developer Guide**: `docs/TAVUS.md`
- **Our Config**: `src/lib/tavus/config.ts`
- **Architecture**: `src/lib/tavus/README.md`

---

## 💡 **Quick Reference**

### **Common Operations**

**Create Complete Persona:**
```bash
# 1. Create objectives
POST /v2/objectives

# 2. Create guardrails
POST /v2/guardrails

# 3. Create persona with IDs
POST /v2/personas
{
  "objectives_id": "o12345",
  "guardrails_id": "g12345"
}
```

**Update Existing Persona:**
```bash
PATCH /v2/personas/{persona_id}
[
  {"op": "add", "path": "/objectives_id", "value": "o12345"},
  {"op": "add", "path": "/guardrails_id", "value": "g12345"}
]
```

**Start Conversation:**
```bash
POST /v2/conversations
{
  "persona_id": "p12345",
  "conversational_context": "...",
  "custom_greeting": "..."
}
```

---

## 📞 **Support**

- **Documentation**: https://docs.tavus.io
- **API Reference**: https://docs.tavus.io/api-reference
- **Platform**: https://platform.tavus.io
