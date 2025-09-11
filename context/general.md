# AMPLIFYRULES

1. ALWAYS MENTION WHICH FILE PATH THE USER NEED TO PASTE THE CODE IN.
2. MAKE SURE IF IT IS IN TWO DIFFERENT FILES, YOU DIVIDE THE CODE SNIPPET AND MENTION THE FILE PATH
3. IF THE FILE DOESN'T ALREADY EXIST, GIVE THE STEPS TO GENERATE THE FILES.
4. COMMENT ON EVERY PIECE OF CODE THAT CAN HELP IMPROVE CODE QUALITY THAT EXPLAINS WHAT THE LINE DOES

# DATA ORGANIZATION BEST PRACTICES

## Organization Structure
- **Centralized Location**: `src/lib/mock-data.ts` - keeps all mock data in one place
- **Typed Data**: Export with proper TypeScript interfaces
- **Organized by Feature**: Group related data together
- **Easy to Replace**: When ready for real APIs, just change the import

## Alternative Structures
- `src/data/` - for larger projects
- `src/mocks/` - when using MSW or similar tools
- `src/lib/data/` - for more granular organization

## Implementation Example
```typescript
// src/lib/mock-data.ts
export const courseTranscript = [
  {
    id: 1,
    time: "00:15",
    text: "Welcome to EMDR Therapy Fundamentals...",
  },
];

export const mockCourses = [
  {
    id: "1",
    title: "EMDR Therapy Fundamentals",
    progress: 65,
  },
];
```

## Usage
```typescript
// In components
import { courseTranscript, mockCourses } from "@/lib/mock-data";
```

# SOFTWARE ARCHITECTURE PATTERNS

## Separation of Concerns (SoC)
- **Data Layer**: `src/lib/*-data.ts` - Pure data only
- **Business Logic**: `src/lib/*-utils.ts` - Functions and calculations
- **Components**: UI logic only

## File Organization Rules
1. **Data files** (`*-data.ts`): Export only interfaces and raw data
2. **Utility files** (`*-utils.ts`): Export pure functions that operate on data
3. **Component files**: Import data and utils separately

## Implementation Example
```typescript
// src/lib/course-data.ts - Data only
export const courses = [...];

// src/lib/course-utils.ts - Business logic
import { courses } from "./course-data";
export const getCourseProgress = (id: string) => {...};

// components/Course.tsx - UI logic
import { courses } from "@/lib/course-data";
import { getCourseProgress } from "@/lib/course-utils";
```

## Benefits
- **Testable**: Utils can be unit tested independently
- **Maintainable**: Change logic without touching data
- **Replaceable**: Easy to swap data sources
- **Scalable**: Clear structure for growing applications
