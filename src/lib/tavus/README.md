# Tavus Configuration Architecture

## 📁 **Recommended Structure**

```
src/lib/tavus/
├── index.ts          # Centralized exports
├── config.ts         # All Tavus configurations
└── README.md         # Configuration documentation
```

---

## 🎯 **Why This Location?**

### **1. Follows Next.js Best Practices**
- ✅ `src/lib/` is the standard location for shared utilities
- ✅ Aligns with existing project structure (`src/lib/mock-data.ts`, `src/lib/course-utils.ts`)
- ✅ Accessible from both API routes and client components

### **2. Centralized Configuration**
- ✅ **Single source of truth** for all Tavus configs
- ✅ **Easy to update** - change once, applies everywhere
- ✅ **Version controlled** - track configuration changes over time
- ✅ **Environment agnostic** - works in dev, staging, production

### **3. Developer Experience**
- ✅ **Easy imports** - `import { LEARNING_CHECK_OBJECTIVES } from '@/lib/tavus'`
- ✅ **Type safety** - Full TypeScript support
- ✅ **Discoverability** - Developers know where to find configs
- ✅ **Maintainability** - Clear separation of concerns

### **4. Accessibility**
- ✅ **API routes** - Can import directly
- ✅ **Scripts** - Can import via TypeScript
- ✅ **Components** - Can import for client-side logic
- ✅ **Tests** - Can import for testing

---

## 📊 **Configuration Structure**

### **`src/lib/tavus/config.ts`**

Contains all Tavus-related configurations:

#### **1. Objectives Configuration**
```typescript
export const LEARNING_CHECK_OBJECTIVES = [
  {
    objective_name: 'recall_assessment',
    objective_prompt: '...',
    confirmation_mode: 'auto',
    modality: 'verbal',
    next_required_objectives: ['application_assessment']
  },
  // ... more objectives
];
```

#### **2. Guardrails Configuration**
```typescript
export const LEARNING_CHECK_GUARDRAILS = {
  name: 'Learning Check Compliance Guardrails',
  data: [
    {
      guardrail_name: 'quiz_answer_protection',
      guardrail_prompt: '...',
      modality: 'verbal'
    },
    // ... more guardrails
  ]
};
```

#### **3. Persona Configuration**
```typescript
export const PERSONA_CONFIG = {
  persona_name: '8p3p - AI Instructor Assistant',
  pipeline_mode: 'full',
  system_prompt: '...',
  context: '...',
  layers: {
    perception: { ... },
    tts: { ... },
    llm: { ... },
    stt: { ... }
  }
};
```

#### **4. Helper Functions**
```typescript
export function buildChapterContext(chapterId: string, chapterTitle: string): string;
export function buildGreeting(chapterTitle: string): string;
```

#### **5. Default Values**
```typescript
export const TAVUS_DEFAULTS = {
  DEFAULT_REPLICA_ID: 'r9fa0878977a',
  SESSION_DURATION: 180,
  ENGAGEMENT_THRESHOLD: 90,
  API_BASE_URL: 'https://tavusapi.com/v2'
};
```

---

## 🔧 **Usage Examples**

### **In API Routes**

```typescript
// src/app/api/learning-checks/objectives/route.ts
import { LEARNING_CHECK_OBJECTIVES } from '@/lib/tavus';

export async function POST(request: NextRequest) {
  const tavusResponse = await fetch('https://tavusapi.com/v2/objectives', {
    method: 'POST',
    headers: { 'x-api-key': apiKey },
    body: JSON.stringify({ data: LEARNING_CHECK_OBJECTIVES })
  });
}
```

### **In Scripts**

```bash
# scripts/create-persona.sh
node -e "
  const { PERSONA_CONFIG } = require('./src/lib/tavus/config.ts');
  console.log(JSON.stringify(PERSONA_CONFIG));
"
```

Or use a TypeScript helper:

```typescript
// scripts/helpers/get-config.ts
import { PERSONA_CONFIG } from '@/lib/tavus';
console.log(JSON.stringify(PERSONA_CONFIG, null, 2));
```

### **In Components**

```typescript
// src/components/course/chapter-content/learning-check.tsx
import { buildGreeting, TAVUS_DEFAULTS } from '@/lib/tavus';

const greeting = buildGreeting(chapterTitle);
const duration = TAVUS_DEFAULTS.SESSION_DURATION;
```

---

## 🔄 **Migration Path**

### **Step 1: Update API Routes**

**Before:**
```typescript
// Objectives hardcoded in route
const objectives = [
  { objective_name: 'recall_assessment', ... }
];
```

**After:**
```typescript
import { LEARNING_CHECK_OBJECTIVES } from '@/lib/tavus';

const objectives = LEARNING_CHECK_OBJECTIVES;
```

### **Step 2: Update Scripts**

**Before:**
```bash
# Config embedded in shell script
SYSTEM_PROMPT="You are a knowledgeable..."
```

**After:**
```typescript
// scripts/helpers/get-persona-config.ts
import { PERSONA_CONFIG } from '@/lib/tavus';
console.log(JSON.stringify(PERSONA_CONFIG, null, 2));
```

```bash
# scripts/create-persona.sh
PERSONA_CONFIG=$(tsx scripts/helpers/get-persona-config.ts)
```

### **Step 3: Update Documentation**

Update all docs to reference the new location:
- `docs/TAVUS.md` - Main developer guide
- `docs/TAVUS_API_REFERENCE.md` - Complete API reference
- API route documentation

---

## ✅ **Benefits**

### **1. Maintainability**
| Before | After |
|--------|-------|
| Update 5+ files | Update 1 file |
| Risk of inconsistency | Always consistent |
| Hard to track changes | Git history clear |

### **2. Developer Experience**
| Before | After |
|--------|-------|
| Search for configs | Import from known location |
| Copy/paste configs | Reuse typed configs |
| Manual sync | Automatic sync |

### **3. Type Safety**
```typescript
// TypeScript catches errors at compile time
const objectives: typeof LEARNING_CHECK_OBJECTIVES = [
  { objective_name: 'typo_here' } // ❌ Type error!
];
```

### **4. Testing**
```typescript
import { LEARNING_CHECK_OBJECTIVES } from '@/lib/tavus';

describe('Tavus Objectives', () => {
  it('should have 3 objectives', () => {
    expect(LEARNING_CHECK_OBJECTIVES).toHaveLength(3);
  });
});
```

---

## 🚀 **Next Steps**

1. ✅ **Created** - `src/lib/tavus/config.ts` with all configurations
2. ✅ **Created** - `src/lib/tavus/index.ts` for easy imports
3. ⏳ **Update** - API routes to import from `@/lib/tavus`
4. ⏳ **Update** - Scripts to use TypeScript helpers
5. ⏳ **Update** - Documentation to reference new location
6. ⏳ **Test** - Verify all imports work correctly

---

## 📚 **Related Files**

- **Configuration**: `src/lib/tavus/config.ts`
- **Exports**: `src/lib/tavus/index.ts`
- **Types**: `src/types/tavus.ts`
- **API Routes**: `src/app/api/learning-checks/*/route.ts`
- **Scripts**: `scripts/create-persona.sh`

---

## 🎯 **Summary**

**Location**: `src/lib/tavus/`

**Why?**
- ✅ Follows Next.js conventions
- ✅ Centralized configuration
- ✅ Easy to maintain and update
- ✅ Accessible from routes, scripts, and components
- ✅ Type-safe and testable

**Impact:**
- 🔄 Update once, applies everywhere
- 📝 Clear documentation and discoverability
- 🧪 Easy to test and validate
- 🚀 Faster development and onboarding
