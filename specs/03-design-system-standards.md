# Design System Standards: shadcn/ui + Tailwind CSS v4

## Architecture Overview

Our design system is built on **shadcn/ui** components with **Tailwind CSS v4** for styling, following official best practices for maximum compatibility and developer experience.

### Core Stack

- **shadcn/ui**: Primary component library
- **Tailwind CSS v4**: Utility-first CSS framework (CSS-first configuration)
- **next-themes**: Theme management
- **CSS Variables**: Dynamic theming system

## Configuration Standards

### CSS-First Configuration (Tailwind v4)

- **No config file needed**: Tailwind v4 uses CSS-first configuration
- **Single import**: Use `@import "tailwindcss";` in your main CSS file
- **Theme customization**: Use `@theme` directive with CSS variables
- **Layer organization**: Use `@layer base`, `@layer components`, `@layer utilities`

### PostCSS Configuration

```javascript
// postcss.config.mjs
const config = {
	plugins: ["@tailwindcss/postcss"], // Tailwind v4 plugin
};
```

### Stylesheet Structure and Order

**Proper directive order in globals.css:**

1. **@import statements** (must come first)

   ```css
   @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800&display=swap");
   @import "tailwindcss";
   ```

2. **@theme directive** (for Tailwind theme customization)

   ```css
   @theme {
   	--color-primary: oklch(28.08% 0.051 260.2);
   	--color-accent: oklch(76.65% 0.139 91.06);
   	--font-display: "Montserrat", sans-serif;
   }
   ```

3. **CSS variables** (in :root and .dark)

   ```css
   :root {
   	--background: oklch(100% 0 0);
   	--foreground: oklch(28.08% 0.051 260.2);
   }

   .dark {
   	--background: oklch(28.08% 0.051 260.2);
   	--foreground: oklch(100% 0 0);
   }
   ```

4. **@layer directives** (in cascade order)
   ```css
   @layer base {
   	* {
   		border-color: var(--border);
   	}
   	body {
   		background-color: var(--background);
   		color: var(--foreground);
   	}
   }
   ```

### Base Layer Best Practices

- **Use CSS variables directly** in `@layer base`, NOT `@apply` directives
- **Correct**: `background-color: var(--background);`
- **Incorrect**: `@apply bg-background;`
- **Reason**: Tailwind v4 promotes CSS-first approach with direct variable usage

## Theme System

### CSS Variables Convention

Follow shadcn/ui's background/foreground convention:

```css
:root {
	--background: oklch(100% 0 0);
	--foreground: oklch(28.08% 0.051 260.2);
	--primary: oklch(28.08% 0.051 260.2);
	--primary-foreground: oklch(100% 0 0);
	--accent: oklch(76.65% 0.139 91.06);
	--accent-foreground: oklch(28.08% 0.051 260.2);
}

.dark {
	--background: oklch(28.08% 0.051 260.2);
	--foreground: oklch(100% 0 0);
	/* ... other dark variants */
}
```

### Theme Provider Setup

```tsx
// components/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-screen bg-background text-foreground">
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
```

## Component Standards

### shadcn/ui Components First

Always use shadcn/ui components as the foundation:

```bash
# Add components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Preferred approach
<Button variant="default" size="lg">Click me</Button>
<Card className="w-full max-w-md">
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### Color Usage Standards

**Use semantic color tokens**, not direct colors:

```tsx
// ✅ Correct - semantic tokens
<div className="bg-background text-foreground border-border">
<Button className="bg-primary text-primary-foreground">
<div className="text-muted-foreground">

// ❌ Avoid - direct colors
<div className="bg-blue-900 text-white">
<Button className="bg-[#1a2942]">
```

### CSS Variable Syntax in Arbitrary Values

Tailwind v4 provides shorthand syntax for CSS variables:

```tsx
// ✅ Shorthand syntax (recommended)
<div className="fill-(--my-brand-color)">
<div className="bg-(--sidebar-accent)">
<div className="text-(--primary-foreground)">

// ✅ Full syntax (also valid)
<div className="fill-[var(--my-brand-color)]">
<div className="bg-[var(--sidebar-accent)]">

// ✅ Use with modifiers
<div className="hover:bg-(--accent) lg:text-(--foreground)">
```

## File Organization

### Component Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── dialog.tsx
│   ├── theme-provider.tsx
│   └── [feature-components]/
├── lib/
│   ├── utils.ts         # cn() utility and helpers
│   └── ...
└── app/
    ├── globals.css      # Theme variables and Tailwind imports
    └── ...
```

### CSS Organization

```css
/* globals.css structure */
@import "tailwindcss";

@theme {
	--color-primary: oklch(28.08% 0.051 260.2);
	--color-accent: oklch(76.65% 0.139 91.06);
}

:root {
	/* light theme variables */
}
.dark {
	/* dark theme variables */
}

@layer base {
	* {
		border-color: var(--border);
	}
	body {
		background-color: var(--background);
		color: var(--foreground);
	}
}
```

## Accessibility Standards

### Required Features

- **ARIA Labels**: Use `aria-label`, `aria-describedby` for screen readers
- **Focus Management**: Proper `tabindex` and focus trapping in modals
- **Keyboard Navigation**: Support Enter, Escape, Arrow keys
- **Color Contrast**: Ensure WCAG AA compliance
- **Screen Reader**: Test with screen reader software

### Implementation Example

```tsx
<button
	aria-label="Close dialog"
	aria-describedby="dialog-description"
	onClick={handleClose}
	className="focus:outline-none focus:ring-2 focus:ring-primary"
>
	<X className="h-4 w-4" />
	<span className="sr-only">Close</span>
</button>
```

## Best Practices

### Theme Management

- Always use `cssVariables: true` in `components.json`
- Use semantic color names (`primary`, `accent`, `muted`)
- Test both light and dark themes
- Use `suppressHydrationWarning` on `<html>` tag

### Component Development

- Extend shadcn/ui components rather than creating from scratch
- Use `cn()` utility for conditional classes
- Follow shadcn/ui naming conventions
- Maintain consistent spacing with Tailwind scale

### Performance

- Leverage Tailwind's automatic purging in production builds
- Use semantic tokens to reduce CSS bundle size
- Minimize custom CSS in favor of utilities

## Troubleshooting

### Common Issues

#### CSS Variables Not Working

- **Check**: `cssVariables: true` in `components.json`
- **Verify**: ThemeProvider setup with `attribute="class"`

#### Dark Mode Not Applying

- **Check**: ThemeProvider configuration
- **Verify**: CSS variables defined in both `:root` and `.dark`

#### Production Build Failures

**Symptoms**: CSS variable errors in production builds

**Solution**: Define theme colors in `@theme` directive:

```css
@theme {
	/* Core theme colors */
	--color-background: oklch(100% 0 0);
	--color-foreground: oklch(28.08% 0.051 260.2);
	--color-primary: oklch(28.08% 0.051 260.2);
	/* Dark mode variants */
	--color-background-dark: oklch(28.08% 0.051 260.2);
	--color-foreground-dark: oklch(100% 0 0);
}
```

Then reference in CSS custom properties:

```css
:root {
	--background: var(--color-background);
	--foreground: var(--color-foreground);
}

.dark {
	--background: var(--color-background-dark);
	--foreground: var(--color-foreground-dark);
}
```

## Development Workflow

### Adding New Components

1. **Check shadcn/ui first**: `npx shadcn@latest add [component]`
2. **Customize with Tailwind**: Add utility classes for layout/spacing
3. **Use semantic colors**: Apply theme-aware color tokens
4. **Test themes**: Verify component works in light/dark modes

### Migration from Tailwind v3

- **Remove `tailwind.config.js`** - No longer needed in v4
- Replace `@tailwind` directives with `@import "tailwindcss"`
- Update PostCSS config to use `@tailwindcss/postcss`
- Move theme configuration to CSS using `@theme` directive

## Implementation Checklist

- [ ] Uses proper shadcn/ui components as foundation
- [ ] Follows CSS-first configuration (no tailwind.config.js)
- [ ] Implements semantic color tokens
- [ ] Includes accessibility attributes
- [ ] Supports both light and dark themes
- [ ] Uses CSS variables directly in @layer base
- [ ] Tests keyboard navigation and focus states
- [ ] Validates production build compatibility

---

**Remember**: shadcn/ui first, Tailwind v4 CSS-first configuration, semantic tokens always, no config file needed.
