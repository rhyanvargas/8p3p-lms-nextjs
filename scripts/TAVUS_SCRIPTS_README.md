# Tavus Configuration Scripts

Automatically sync your `src/lib/tavus/config.ts` with Tavus API.

## 🎯 Purpose

These scripts solve the "single source of truth" problem by:
- Reading directly from your TypeScript config file
- Automatically extracting objectives and guardrails
- Syncing changes to Tavus in one command

## 📦 Scripts

### `extract-tavus-config.mjs`
Node.js helper that parses `config.ts` and extracts JSON data.

**Usage:**
```bash
node scripts/extract-tavus-config.mjs objectives
node scripts/extract-tavus-config.mjs guardrails
```

### `update-tavus-objectives.sh`
Syncs `LEARNING_CHECK_OBJECTIVES` to Tavus.

**Usage:**
```bash
./scripts/update-tavus-objectives.sh
```

### `update-tavus-guardrails.sh`
Syncs `LEARNING_CHECK_GUARDRAILS` to Tavus.

**Usage:**
```bash
./scripts/update-tavus-guardrails.sh
```

### `update-tavus-config.sh`
Syncs both objectives and guardrails in one command (recommended!).

**Usage:**
```bash
./scripts/update-tavus-config.sh
```

## 🔄 Workflow

```
1. Edit src/lib/tavus/config.ts
   ↓
2. Run ./scripts/update-tavus-config.sh
   ↓
3. ✅ Tavus updated automatically!
```

## 🛠️ How It Works

```
┌─────────────────────────────────┐
│  src/lib/tavus/config.ts        │
│  ┌─────────────────────────┐   │
│  │ LEARNING_CHECK_         │   │
│  │ OBJECTIVES = {          │   │
│  │   data: [...]           │   │
│  │ }                       │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│  extract-tavus-config.mjs       │
│  (Parses TypeScript → JSON)     │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│  update-tavus-*.sh              │
│  (Sends PATCH to Tavus API)     │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│  Tavus API Updated ✅           │
└─────────────────────────────────┘
```

## ⚙️ Configuration Structure

### Objectives Format
```typescript
export const LEARNING_CHECK_OBJECTIVES = {
  name: "Learning Check Compliance Objectives",
  data: [
    {
      objective_name: "recall_assessment",
      objective_prompt: "Ask at least one recall question...",
      confirmation_mode: "auto",
      modality: "verbal",
      output_variables: ["recall_key_terms", "recall_score"],
      next_required_objectives: ["application_assessment"]
    }
    // ... more objectives
  ]
};
```

### Guardrails Format
```typescript
export const LEARNING_CHECK_GUARDRAILS = {
  name: "Learning Check Compliance Guardrails",
  data: [
    {
      guardrail_name: "quiz_answer_protection",
      guardrail_prompt: "Never reveal quiz answers...",
      modality: "verbal"
    }
    // ... more guardrails
  ]
};
```

## 🔐 Environment Variables Required

Add these to your `.env.local`:

```bash
TAVUS_API_KEY=your_api_key
NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID=g123456
NEXT_PUBLIC_TAVUS_LEARNING_CHECK_OBJECTIVES_ID=o123456
```

## ✅ Success Output

When everything works, you'll see:

```bash
╔═══════════════════════════════════════════╗
║  Tavus Configuration Update (All)        ║
╚═══════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️  Tavus Guardrails Update Script

Guardrails ID: g7771e9a453db

📖 Reading guardrails from src/lib/tavus/config.ts...
✓ Guardrails loaded successfully

📤 Sending PATCH request to Tavus...

✅ Guardrails updated successfully!

Response:
{
  "guardrails_id": "g7771e9a453db",
  "status": "success"
}

🎉 Done!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Tavus Objectives Update Script

Objectives ID: o5d8f3a912cd

📖 Reading objectives from src/lib/tavus/config.ts...
✓ Objectives loaded successfully

📤 Sending PATCH request to Tavus...

✅ Objectives updated successfully!

🎉 Done!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ All Tavus configurations updated successfully!
```

## 🐛 Troubleshooting

### Error: "Could not find LEARNING_CHECK_OBJECTIVES"

**Cause**: Parser can't find the export in `config.ts`

**Solution**: 
- Ensure the constant is exported with `export const`
- Verify the name matches exactly: `LEARNING_CHECK_OBJECTIVES` or `LEARNING_CHECK_GUARDRAILS`

### Error: "TAVUS_API_KEY not found"

**Cause**: Missing environment variable

**Solution**: Add `TAVUS_API_KEY` to `.env.local`

### HTTP 400 or 404 Error

**Cause**: Invalid resource ID

**Solution**: 
- Check IDs in `.env.local` match Tavus dashboard
- Verify objectives/guardrails exist on Tavus first

## 📚 Related Documentation

- [Tavus Config Update Guide](../docs/TAVUS_CONFIG_UPDATE_GUIDE.md)
- [Tavus Implementation](../docs/TAVUS_IMPLEMENTATION_COMPLETE.md)
- [Tavus API Reference](../docs/TAVUS_API_REFERENCE.md)

## 🎉 Benefits

✅ **Single Source of Truth** - Config lives in TypeScript only  
✅ **Type Safety** - TypeScript catches errors before deployment  
✅ **Version Control** - Config changes tracked in git  
✅ **No Manual Sync** - Scripts handle everything automatically  
✅ **Developer Friendly** - Edit code, run script, done!
