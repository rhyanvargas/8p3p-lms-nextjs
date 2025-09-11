# Next.js 15+ Route Parameters Guide

## Overview

In Next.js 15+, route parameters (`params` and `searchParams`) are now Promises that need to be unwrapped before accessing their properties. This guide explains how to handle this change properly.

## The Change

Previously in Next.js 14 and earlier:
```tsx
// Next.js 14 and earlier
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params; // Direct access was fine
  // ...
}
```

Now in Next.js 15+:
```tsx
// Next.js 15+
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  // Direct access will cause warnings and eventually errors
  // const { id } = params; ❌
  
  // Correct approach
  const resolvedParams = use(params);
  const { id } = resolvedParams; ✅
}
```

## Our Solution: useParams Hook

We've created a reusable hook to handle this pattern consistently across the application:

```tsx
// src/hooks/use-params.ts
"use client";

import { use } from "react";

export function useParams<T>(params: Promise<T>): T {
  return use(params);
}
```

## Usage

```tsx
// In any page component
import { useParams } from "@/hooks/use-params";

interface PageProps {
  params: Promise<{
    id: string;
    // any other route params...
  }>;
}

export default function Page({ params }: PageProps) {
  const { id } = useParams(params);
  // Now use id safely...
}
```

## Benefits

1. **Type Safety**: The hook is generic, preserving the type of your params
2. **Consistency**: Provides a standard way to handle params across the application
3. **Readability**: Makes the code more readable and self-documenting
4. **Future-Proof**: Already follows the pattern that will be required in future Next.js versions

## Additional Resources

- [Next.js Documentation on Route Parameters](https://nextjs.org/docs)
- [React.use() API Reference](https://react.dev/reference/react/use)
