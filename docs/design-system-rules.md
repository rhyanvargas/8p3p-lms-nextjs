# Design System Rules: shadcn/ui + Tailwind CSS v4

## Architecture Overview

Our design system is built on a foundation of **shadcn/ui** components with **Tailwind CSS v4** for styling, following official best practices for maximum compatibility and developer experience.

### Core Stack
- **shadcn/ui**: Primary component library
- **Tailwind CSS v4**: Utility-first CSS framework
- **next-themes**: Theme management
- **CSS Variables**: Dynamic theming system

## Configuration Standards

### CSS-First Configuration (Tailwind v4)
- **No config file needed**: Tailwind v4 uses CSS-first configuration
- **Single import**: Use `@import "tailwindcss";` in your main CSS file
- **Theme customization**: Use `@theme` directive with CSS variables
- **Layer organization**: Use `@layer base`, `@layer components`, `@layer utilities`

### Stylesheet Structure and Order
**Proper directive order in globals.css:**
1. **@import statements** (must come first)
   - External fonts: `@import url("https://fonts.googleapis.com/...")`
   - Tailwind: `@import "tailwindcss";`
   - Other libraries: `@import "tw-animate-css";`

2. **@custom-variant directives** (after imports, before theme)
   - Custom variants: `@custom-variant dark (&:is(.dark *));`

3. **CSS variables and theme tokens** (in :root)
   - Brand colors, typography, spacing
   - Light theme variables

4. **Dark theme variables** (in .dark selector)
   - Override light theme variables for dark mode

5. **@theme directive** (if needed for Tailwind theme customization)
   - Custom theme tokens that generate utilities

6. **@layer directives** (in cascade order)
   - `@layer base` - Base styles using CSS variables (NOT @apply)
   - `@layer components` - Component classes
   - `@layer utilities` - Custom utilities

### Base Layer Best Practices
- **Use CSS variables directly** in `@layer base`, NOT `@apply` directives
- **Correct**: `background-color: var(--background);`
- **Incorrect**: `@apply bg-background;`
- **Reason**: Tailwind v4 promotes CSS-first approach with direct variable usage

### CSS Cascade Layer Priority
Based on CSS specification and Tailwind v4 implementation:
- **Layer order**: `base` → `components` → `utilities` (lowest to highest priority)
- **Within layers**: Later declarations override earlier ones
- **Important declarations**: Reverse the normal cascade order
- **Unlayered styles**: Always override layered styles (highest priority)

## PostCSS Configuration

```javascript
// postcss.config.mjs
const config = {
  plugins: ["@tailwindcss/postcss"], // Tailwind v4 plugin
};
```

### 3. CSS-First Configuration Structure

All configuration is done directly in CSS using the `@theme` directive:

```css
/* globals.css */
@import "tailwindcss";

/* Theme configuration using @theme directive */
@theme {
  --color-primary: oklch(28.08% 0.051 260.2);
  --color-accent: oklch(76.65% 0.139 91.06);
  --breakpoint-3xl: 1920px;
  --font-display: "Montserrat", sans-serif;
}

/* CSS Variables for theme switching */
:root { /* ... */ }
.dark { /* ... */ }
```

**Key Points**:
- Use `@theme` directive for theme configuration instead of JavaScript config
- No `tailwind.config.js` file needed
- Automatic content detection eliminates need for `content` array
- Dark mode enabled by default with class-based switching

## Theme System

### CSS Variables Convention

Follow shadcn/ui's background/foreground convention:

```css
:root {
  --background: oklch(100% 0 0);     /* Light background */
  --foreground: oklch(28.08% 0.051 260.2); /* Light text */
  --primary: oklch(28.08% 0.051 260.2);    /* Brand blue */
  --primary-foreground: oklch(100% 0 0);   /* White on blue */
  --accent: oklch(76.65% 0.139 91.06);     /* Brand gold */
  --accent-foreground: oklch(28.08% 0.051 260.2); /* Blue on gold */
}

.dark {
  --background: oklch(28.08% 0.051 260.2); /* Dark background */
  --foreground: oklch(100% 0 0);           /* Dark text */
  /* ... other dark variants */
}
```

### Theme Provider Setup

```tsx
// components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

### 1. shadcn/ui Components

**Always use shadcn/ui components first** for UI elements:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Preferred approach
<Button variant="default" size="lg">Click me</Button>
<Card className="w-full max-w-md">
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### 2. Custom Styling with Tailwind

Use Tailwind utilities for custom styling beyond shadcn/ui:

```tsx
// Layout and spacing
<div className="flex items-center justify-between p-4 gap-4">
  <Button className="bg-accent hover:bg-accent/90">Custom Button</Button>
</div>

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Content */}
</div>
```

### 3. Color Usage

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

## File Organization

### Component Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
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

/* 1. CSS Variables */
:root { /* light theme */ }
.dark { /* dark theme */ }

/* 2. Base layer customizations */
@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}

/* 3. Component customizations */
@layer components {
  /* Custom component styles */
}
```

## Best Practices

### 1. Theme Management
- Always use `cssVariables: true` in `components.json`
- Use semantic color names (`primary`, `accent`, `muted`)
- Test both light and dark themes
- Use `suppressHydrationWarning` on `<html>` tag

### 2. Component Development
- Extend shadcn/ui components rather than creating from scratch
- Use `cn()` utility for conditional classes
- Follow shadcn/ui naming conventions
- Maintain consistent spacing with Tailwind scale

### 3. Performance
- Leverage Tailwind's purging in production builds
- Use semantic tokens to reduce CSS bundle size
- Minimize custom CSS in favor of utilities

### 4. Accessibility
- Use shadcn/ui components for built-in accessibility
- Maintain proper color contrast ratios
- Test keyboard navigation
- Use semantic HTML elements

## Development Workflow

### Adding New Components

1. **Check shadcn/ui first**: `npx shadcn@latest add [component]`
2. **Customize with Tailwind**: Add utility classes for layout/spacing
3. **Use semantic colors**: Apply theme-aware color tokens
4. **Test themes**: Verify component works in light/dark modes

### Theme Customization

1. **Update CSS variables** in `globals.css`
2. **Maintain contrast ratios** for accessibility
3. **Test across components** to ensure consistency
4. **Use OKLCH color space** for better color manipulation

### Build Process

1. **Tailwind purging** automatically removes unused styles
2. **CSS variables** are preserved in production
3. **Theme switching** works without JavaScript in SSR
4. **Component styles** are optimized and bundled

## Troubleshooting

### Common Issues

1. **CSS variables not working**: Check `cssVariables: true` in `components.json`
2. **Dark mode not applying**: Verify ThemeProvider setup and `darkMode: "class"`
3. **Styles not purging**: Check Tailwind content paths include all component files
4. **Hydration errors**: Use `suppressHydrationWarning` on html tag

### Tailwind v4 Production Build Issues

#### CSS Variable Recognition Problems

**Symptoms**: 
- Production builds fail with CSS variable errors
- Variables like `--background`, `--foreground` not recognized
- Build succeeds in development but fails in production

**Root Cause**: 
Custom CSS variables defined in `:root` and `.dark` selectors are not integrated with Tailwind v4's theme system. Tailwind v4 requires colors to be defined in the `--color-*` namespace within the `@theme` directive.

**Solution**:
1. **Define theme colors in `@theme` directive** using proper `--color-*` naming:
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

2. **Update CSS custom properties** to reference Tailwind theme variables:
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

3. **Update base layer styles** to use Tailwind color variables:
   ```css
   @layer base {
     body {
       background-color: var(--color-background);
       color: var(--color-foreground);
     }
   }
   ```

**Key Points**:
- Tailwind v4 colors must use `--color-*` namespace in `@theme` directive
- CSS custom properties can reference theme variables for shadcn/ui compatibility
- This maintains runtime theme switching while ensuring production build compatibility

### Debug Commands

```bash
# Check Tailwind config
npx tailwindcss --help

# Verify component installation
npx shadcn@latest add --help

# Build and check output
npm run build

# Test production build specifically
npm run build && npm start

# Check for CSS variable issues
grep -r "var(--" src/ --include="*.css"
```

## Migration Notes

### From Tailwind v3 to v4
- **Remove `tailwind.config.js`** - No longer needed in v4
- Replace `@tailwind` directives with `@import "tailwindcss"`
- Update PostCSS config to use `@tailwindcss/postcss`
- Move theme configuration to CSS using `@theme` directive
- Use automatic content detection (no `content` array needed)

**Reference**: [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)

### From Other UI Libraries
- Map existing color tokens to shadcn/ui semantic names
- Replace custom components with shadcn/ui equivalents
- Migrate theme switching to next-themes

## Official Documentation References

- **Tailwind CSS v4**: [CSS-first configuration](https://tailwindcss.com/blog/tailwindcss-v4#css-first-configuration)
- **shadcn/ui**: [Tailwind v4 Documentation](https://ui.shadcn.com/docs/tailwind-v4)
- **Upgrade Guide**: [JavaScript config files](https://tailwindcss.com/docs/upgrade-guide#using-a-javascript-config-file)
- **Theme Variables**: [Tailwind CSS Theme Documentation](https://tailwindcss.com/docs/theme)

---

**Remember**: shadcn/ui first, Tailwind for enhancement, semantic tokens always, **no config file needed**.
