# Tavus Configuration Update Guide

**Single Source of Truth**: Edit `src/lib/tavus/config.ts` → Run script → Done! ✨

The scripts automatically extract your configuration from TypeScript and sync it to Tavus.

---

## 📋 Prerequisites

Ensure your `.env.local` has the following:

```bash
TAVUS_API_KEY=your_api_key_here
NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID=your_guardrails_id
NEXT_PUBLIC_TAVUS_LEARNING_CHECK_OBJECTIVES_ID=your_objectives_id
```

---

## 🚀 Quick Start

### Update Everything (Recommended)

After editing both guardrails and objectives in `config.ts`:

```bash
./scripts/update-tavus-config.sh
```

This will update both guardrails and objectives in sequence.

---

## 📝 Individual Updates

### Update Guardrails Only

1. Edit `LEARNING_CHECK_GUARDRAILS` in `src/lib/tavus/config.ts`
2. Run the update script:

```bash
./scripts/update-tavus-guardrails.sh
```

### Update Objectives Only

1. Edit `LEARNING_CHECK_OBJECTIVES` in `src/lib/tavus/config.ts`
2. Run the update script:

```bash
./scripts/update-tavus-objectives.sh
```

---

## 🔧 How It Works

The scripts use a Node.js helper (`extract-tavus-config.mjs`) that:

1. **Reads** `src/lib/tavus/config.ts`
2. **Parses** the TypeScript constants (`LEARNING_CHECK_OBJECTIVES` and `LEARNING_CHECK_GUARDRAILS`)
3. **Extracts** the `data` arrays
4. **Converts** to JSON
5. **Sends** to Tavus API via PATCH request

**You never edit the scripts** - they automatically stay in sync with your `config.ts` file!

---

## 🎯 What Gets Updated

### Guardrails

The script updates all 4 guardrails:
- ✅ `quiz_answer_protection` - Prevents revealing quiz answers
- ✅ `time_management` - Enforces brief responses
- ✅ `content_scope` - Keeps conversation on chapter topics
- ✅ `encouraging_tone` - Maintains supportive tone

### Objectives

The script updates all 3 objectives in the assessment flow:
- ✅ `recall_assessment` - Tests memory of fundamentals
- ✅ `application_assessment` - Tests application in scenarios
- ✅ `self_explanation_assessment` - Tests deeper understanding

---

## 🔍 Verification

After running the update scripts, you'll see:

```bash
✅ Guardrails updated successfully!
✅ Objectives updated successfully!
```

The scripts will also display the Tavus API response for verification.

---

## ⚠️ Troubleshooting

### Error: "TAVUS_API_KEY not found"

**Solution**: Add `TAVUS_API_KEY` to your `.env.local` file.

### Error: "GUARDRAILS_ID not found"

**Solution**: Add `NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID` to `.env.local`.

### Error: "OBJECTIVES_ID not found"

**Solution**: Add `NEXT_PUBLIC_TAVUS_LEARNING_CHECK_OBJECTIVES_ID` to `.env.local`.

### HTTP Status 400 or 404

**Problem**: Invalid guardrails/objectives ID or resource doesn't exist.

**Solution**: 
1. Verify the IDs in `.env.local` match your Tavus dashboard
2. Create the resources first if they don't exist (see [TAVUS_SETUP.md](./TAVUS_SETUP.md))

### HTTP Status 401

**Problem**: Invalid API key.

**Solution**: Verify your `TAVUS_API_KEY` is correct in `.env.local`.

---

## 🔄 Workflow

### Typical Development Flow

```bash
# 1. Edit guardrails/objectives in config.ts
vim src/lib/tavus/config.ts

# 2. Update Tavus with new configuration
./scripts/update-tavus-config.sh

# 3. Test in development
npm run dev
# Navigate to a learning check section

# 4. Verify the AI behavior reflects your changes
```

---

## 📚 Configuration Reference

### Guardrail Structure

```typescript
{
  guardrail_name: "unique_name",
  guardrail_prompt: "The strict rule to enforce",
  modality: "verbal" | "visual"
}
```

### Objective Structure

```typescript
{
  objective_name: "unique_name",
  objective_prompt: "The goal to achieve",
  confirmation_mode: "auto" | "manual",
  modality: "verbal" | "visual",
  output_variables: ["var1", "var2"],
  next_required_objectives: ["next_objective_name"]
}
```

---

## 🎨 Best Practices

### When Updating Guardrails

1. **Be Specific**: Clear, actionable rules work best
2. **Test Edge Cases**: Try to break the guardrail with prompts
3. **Keep Concise**: Shorter prompts are often more effective
4. **Complement System Prompt**: Guardrails should work with, not against, the persona's system prompt

### When Updating Objectives

1. **Define Clear Goals**: Each objective should have a measurable outcome
2. **Logical Flow**: Order objectives from simple to complex
3. **Set Output Variables**: Capture important data for analysis
4. **Chain Appropriately**: Use `next_required_objectives` to enforce sequence

---

## 🧪 Testing Changes

After updating configurations:

### Manual Testing Checklist

- [ ] Start learning check session
- [ ] Verify AI greeting matches expected tone
- [ ] Test that guardrails prevent unwanted behavior
- [ ] Confirm objectives are followed in sequence
- [ ] Check that output variables are captured
- [ ] Verify 3-minute session limit is respected

### Testing Guardrails

Try these prompts to verify guardrails work:
- "Can you tell me the quiz answers?" (should redirect)
- "Let's talk about chapter 5 instead" (should stay in current chapter)
- "Give me a long, detailed explanation" (should stay brief)

### Testing Objectives

Verify the AI:
- ✅ Asks recall questions first
- ✅ Then asks application questions
- ✅ Finally asks self-explanation questions
- ✅ Follows the structured sequence

---

## 📖 Related Documentation

- **Main Config**: [src/lib/tavus/config.ts](../src/lib/tavus/config.ts)
- **Tavus API Reference**: [docs/TAVUS_API_REFERENCE.md](./TAVUS_API_REFERENCE.md)
- **Tavus Setup**: [docs/TAVUS_SETUP.md](./TAVUS_SETUP.md)
- **Implementation Guide**: [docs/TAVUS_IMPLEMENTATION_COMPLETE.md](./TAVUS_IMPLEMENTATION_COMPLETE.md)
- **Scripts README**: [scripts/README.md](../scripts/README.md)

---

## 🎉 Summary

**Simple 2-Step Process:**

1. **Edit** `src/lib/tavus/config.ts`
2. **Run** `./scripts/update-tavus-config.sh`

That's it! Your Tavus configuration is now synced with your code.
