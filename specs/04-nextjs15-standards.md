# Next.js 15 Development Standards

## Core Architecture Principles

### App Router First

- **Default**: Use App Router architecture for all new projects
- **Server Components**: Default choice for better performance and SEO
- **Client Components**: Only when interactivity is required
- **File-based Routing**: Leverage `app/` directory structure

### Component Strategy

- **Server Components by default** - No "use client" unless needed
- **Client Components only for**:
  - State management (useState, useReducer)
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage, window)
  - React hooks requiring client-side execution

## Route Parameters & Navigation

### Server Components

```tsx
// app/posts/[id]/page.tsx
export default async function PostPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params; // Next.js 15+ requires await
	return <div>Post {id}</div>;
}
```

### Client Components

```tsx
// Use custom hook for client-side params
"use client";
import { useParams } from "@/hooks/use-params";

export default function ClientComponent({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = useParams(params);
	return <div>Post {id}</div>;
}
```

### Navigation Patterns

```tsx
// Prefer Link over useRouter for navigation
import Link from "next/link";

// ✅ Preferred - Server-friendly
<Link href="/dashboard">Dashboard</Link>;

// ✅ Client-side navigation when needed
("use client");
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/dashboard");
```

## Data Fetching Patterns

### Server-Side Data Fetching

```tsx
// app/posts/page.tsx - Server Component
async function getPosts() {
	const res = await fetch("https://api.example.com/posts", {
		next: { revalidate: 3600 }, // ISR with 1 hour cache
	});
	return res.json();
}

export default async function PostsPage() {
	const posts = await getPosts();
	return (
		<div>
			{posts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</div>
	);
}
```

### Client-Side Data Fetching

```tsx
// Only when server-side isn't suitable
"use client";
import { useEffect, useState } from "react";

export default function ClientDataComponent() {
	const [data, setData] = useState(null);

	useEffect(() => {
		fetch("/api/data")
			.then((res) => res.json())
			.then(setData);
	}, []);

	return <div>{data ? <DataDisplay data={data} /> : <Loading />}</div>;
}
```

## Server Actions

### Form Handling

```tsx
// app/contact/page.tsx
import { redirect } from "next/navigation";

async function submitContact(formData: FormData) {
	"use server";

	const name = formData.get("name") as string;
	const email = formData.get("email") as string;

	// Process form data
	await saveContact({ name, email });

	redirect("/thank-you");
}

export default function ContactPage() {
	return (
		<form action={submitContact}>
			<input name="name" required />
			<input name="email" type="email" required />
			<button type="submit">Submit</button>
		</form>
	);
}
```

### Progressive Enhancement

```tsx
// Client component with Server Action
"use client";
import { useFormStatus } from "react-dom";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button type="submit" disabled={pending}>
			{pending ? "Submitting..." : "Submit"}
		</button>
	);
}
```

## Performance Optimization

### Caching Strategies

```tsx
// Static Generation
export default async function StaticPage() {
	const data = await fetch("https://api.example.com/static-data");
	return <div>{/* Static content */}</div>;
}

// Incremental Static Regeneration
async function getData() {
	const res = await fetch("https://api.example.com/data", {
		next: { revalidate: 60 }, // Revalidate every 60 seconds
	});
	return res.json();
}

// Dynamic with caching
async function getCachedData() {
	const res = await fetch("https://api.example.com/data", {
		cache: "force-cache", // Cache indefinitely
	});
	return res.json();
}
```

### Loading States

```tsx
// app/posts/loading.tsx - Automatic loading UI
export default function Loading() {
	return <div className="animate-pulse">Loading posts...</div>;
}

// app/posts/error.tsx - Error boundary
("use client");
export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div>
			<h2>Something went wrong!</h2>
			<button onClick={reset}>Try again</button>
		</div>
	);
}
```

## TypeScript Integration

### Strict Type Safety

```tsx
// Define proper interfaces
interface PageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
	const { id } = await params;
	const search = await searchParams;

	return <div>Page {id}</div>;
}
```

### Component Props

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary";
	size?: "sm" | "md" | "lg";
}

export function Button({
	variant = "primary",
	size = "md",
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(
				"rounded-md font-medium",
				variant === "primary" && "bg-blue-600 text-white",
				size === "md" && "px-4 py-2"
			)}
			{...props}
		/>
	);
}
```

## Code Quality Standards

### Function Declarations

```tsx
// ✅ Preferred - const declarations
const handleClick = () => {
	// Handle click logic
};

const fetchUserData = async (id: string) => {
	const response = await fetch(`/api/users/${id}`);
	return response.json();
};

// ✅ Early returns for readability
const processUser = (user: User | null) => {
	if (!user) return null;
	if (!user.isActive) return <InactiveUser />;

	return <ActiveUser user={user} />;
};
```

### Event Handler Naming

```tsx
// ✅ Consistent naming with "handle" prefix
const handleSubmit = (e: FormEvent) => {
	e.preventDefault();
	// Submit logic
};

const handleKeyDown = (e: KeyboardEvent) => {
	if (e.key === "Enter") {
		handleSubmit(e);
	}
};
```

### Accessibility Implementation

```tsx
export function AccessibleButton({ children, ...props }: ButtonProps) {
	return (
		<button
			{...props}
			className="focus:outline-none focus:ring-2 focus:ring-blue-500"
			tabIndex={0}
			aria-label={props["aria-label"] || "Button"}
		>
			{children}
		</button>
	);
}
```

## File Organization

### App Directory Structure

```
app/
├── (auth)/              # Route groups
│   ├── login/
│   └── register/
├── dashboard/
│   ├── page.tsx         # Dashboard page
│   ├── loading.tsx      # Loading UI
│   └── error.tsx        # Error boundary
├── api/                 # API routes
│   └── users/
│       └── route.ts
├── globals.css          # Global styles
└── layout.tsx           # Root layout
```

### Component Organization

```
components/
├── ui/                  # shadcn/ui components
├── forms/               # Form components
├── layout/              # Layout components
└── features/            # Feature-specific components
```

## AI SDK v5 Integration

### Streaming Responses

```tsx
// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
	const { messages } = await req.json();

	const result = await streamText({
		model: openai("gpt-4"),
		messages,
	});

	return result.toDataStreamResponse();
}
```

### Client-Side Integration

```tsx
"use client";
import { useChat } from "ai/react";

export default function ChatComponent() {
	const { messages, input, handleInputChange, handleSubmit } = useChat();

	return (
		<div>
			{messages.map((m) => (
				<div key={m.id}>
					<strong>{m.role}:</strong> {m.content}
				</div>
			))}

			<form onSubmit={handleSubmit}>
				<input
					value={input}
					onChange={handleInputChange}
					placeholder="Type your message..."
				/>
				<button type="submit">Send</button>
			</form>
		</div>
	);
}
```

## Development Workflow

### Pre-commit Validation

```bash
# Type checking
npm run type-check

# Linting with Next.js 15 rules
npm run lint

# Build verification
npm run build
```

### Environment Configuration

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		typedRoutes: true, // Enable typed routes
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "example.com",
			},
		],
	},
};

export default nextConfig;
```

## Best Practices Checklist

- [ ] Uses Server Components by default
- [ ] Implements proper route parameter handling
- [ ] Leverages Server Actions for form handling
- [ ] Includes proper TypeScript interfaces
- [ ] Implements accessibility features
- [ ] Uses early returns for readability
- [ ] Follows consistent naming conventions
- [ ] Includes proper error boundaries
- [ ] Implements loading states
- [ ] Uses Next.js 15 caching strategies

---

**Remember**: Server Components first, Client Components only when needed, proper TypeScript, accessibility always.
