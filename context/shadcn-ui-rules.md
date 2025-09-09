# SHADCNUIRULES

## PURPOSE  
This file is the **single source of truth** for using **shadcn/ui** across all frontend projects. It defines how to install, configure, implement, and troubleshoot UI components.  
Always follow these rules strictly. This file overrides any other references unless the official [shadcn/ui docs](https://ui.shadcn.com/docs) specify otherwise.  

---

## GENERAL RULES  

1. **Project-Aware Setup**  
   - Always use the project’s current **package manager** (npm, pnpm, bun, yarn). Do not hardcode.  
   - Respect the project’s framework version (Next.js, Vite, Remix, etc.). Use dynamic imports where applicable.  

2. **Installation & Configuration**  
   - Ensure `tailwindcss`, `postcss`, and `autoprefixer` are already configured in the workspace.  
   - Run `npx shadcn@latest init` with the active package manager.  
   - Components are added via:  
     ```bash
     npx shadcn@latest add [component-name]
     ```  

3. **Component Usage**  
   - Always import from the project-local `@/components/ui/[component]`.  
   - Do not import directly from `shadcn/ui` package root.  

4. **Styling**  
   - Use **Tailwind CSS tokens** (`bg-background`, `text-foreground`, etc.) for consistent theming.  
   - Follow project theme settings in `tailwind.config.ts`.  

5. **Accessibility & Best Practices**  
   - All components must maintain **ARIA compliance**.  
   - Validate focus states, keyboard navigation, and dark mode behavior.  

---

## FILE MANAGEMENT RULES  

- If a component file does not exist, generate it using `npx shadcn@latest add`.  
- For shared layouts or wrappers, store them in `@/components/layout`.  
- Always include comments explaining non-trivial logic inside component files.  

---

## TROUBLESHOOTING BEST PRACTICES  

1. **Component Not Rendering**  
   - Check import path: must be `@/components/ui/[component]`.  
   - Confirm component exists under `/components/ui`.  

2. **Styling Issues**  
   - Ensure `tailwind.config.ts` includes the correct `content` paths (`app/**/*.{ts,tsx}`, `components/**/*.{ts,tsx}`).  
   - Run `npx tailwindcss -i ./input.css -o ./output.css --watch` if styles don’t apply.  

3. **Theme Colors Not Applying**  
   - Verify `globals.css` includes `@tailwind base; @tailwind components; @tailwind utilities;`.  
   - Confirm design tokens (`--background`, `--primary`, etc.) are defined in `:root`.  

4. **Accessibility Errors**  
   - Check `role` and `aria-*` props in interactive components.  
   - Run automated tests (`axe-core`, `lighthouse`) to validate compliance.  

---

## EXAMPLES  

### Button  
```tsx
// File: components/ui/button.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-sm hover:bg-primary/90",
        className
      )}
      {...props}
    />
  )
}
```

### Dialog  
```tsx
// File: components/ui/dialog.tsx
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <p>Dialog Content</p>
  </DialogContent>
</Dialog>
```

---

## IMPLEMENTATION WORKFLOW  

1. Initialize shadcn in your project.  
2. Add required components (`button`, `dialog`, `form`, etc.).  
3. Import and compose components inside feature modules.  
4. Apply project theming via Tailwind tokens.  
5. Test rendering, styling, and accessibility before merging.  

---

📌 **Reminder:** This rules file is reusable across **all frontend projects**. Do not reference static framework versions or package managers—always defer to **project settings**.  
