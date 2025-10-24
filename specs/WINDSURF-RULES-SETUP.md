# Windsurf Rules Setup Guide

**Quick start guide for integrating consolidated project standards with Windsurf AI**

---

## TL;DR

**Consolidated Rules**: `specs/WINDSURF-RULES.md` (11,566 chars / 12,000 limit)
**Activation**: Copy to `.windsurf/rules/project-standards.md` → Set "Always On"
**Status**: ✅ Ready for integration

---

## Setup Instructions

### Option 1: Workspace Rules (Recommended)

**Copy the rules file**:
```bash
# From project root
cp specs/WINDSURF-RULES.md .windsurf/rules/project-standards.md
```

**Activate in Windsurf**:
1. Open Windsurf IDE
2. Click **Customizations** icon (top-right slider menu)
3. Navigate to **Rules** tab
4. Find `project-standards.md` in workspace rules
5. Set activation mode: **Always On**
6. Confirm rules appear in active rules list

**Verify Integration**:
1. Start new Cascade conversation
2. Ask: "What are the Next.js 15 route parameter standards?"
3. Cascade should reference the rules automatically

---

## What's Included

### Mandatory Protocols
- ✅ Branch Readiness Protocol (requires user confirmation before feature work)
- ✅ LOC Verification (verify actual line counts before every commit)
- ✅ Codebase Analysis Protocol (check existing implementations before creating new)

### Architecture Standards
- ✅ Next.js 15: Server Components first, route parameters handling
- ✅ AWS Amplify Gen2: Authentication, data schema patterns
- ✅ Tailwind v4 + shadcn/ui: CSS-first configuration, theme system

### Code Quality
- ✅ Quality Gates: ESLint, TypeScript, build validation
- ✅ Component Reusability Protocol
- ✅ Comment and documentation standards

### Workflow Standards
- ✅ PR size limits (200-400 LOC)
- ✅ Stacked PRs for complex features
- ✅ Bug resolution and user confirmation
- ✅ Clarifying questions framework

---

## Usage Examples

### Before Creating a Component

Cascade will automatically:
1. Search for existing similar components
2. Check shadcn/ui for base components
3. Recommend reuse/composition over creation
4. Follow project styling standards (Tailwind v4)

### Before Starting a Feature

Cascade will automatically:
1. Present branch readiness plan
2. Ask for explicit confirmation
3. Wait for your approval before creating branches
4. Document the decision

### Before Every Commit

Cascade will automatically:
1. Run `git diff --cached --shortstat`
2. Verify actual line counts
3. Report LOC in commit messages
4. Flag if exceeding PR size limits

---

## Testing the Integration

### Test 1: Architecture Standards
**Ask Cascade**: "How should I handle route parameters in a Next.js 15 page?"

**Expected Response**: 
- Server Components: Use `await params`
- Client Components: Use `useParams` hook
- Never use manual `use()` unwrapping

### Test 2: Component Creation
**Ask Cascade**: "Create a new button component with hover effects"

**Expected Behavior**:
1. Search existing button components
2. Check shadcn/ui Button component
3. Recommend using/extending shadcn/ui Button
4. Only create new if justified

### Test 3: Branch Readiness
**Ask Cascade**: "Start implementing the user profile feature"

**Expected Behavior**:
1. Present feature specification
2. Show branch strategy
3. Ask: "Ready to create the branch and start user-profile development? 🚀"
4. Wait for your confirmation

---

## Maintenance

### When to Update Rules

**Immediate**:
- Framework version upgrades (Next.js, React, Amplify)
- New mandatory protocols or workflows
- Breaking changes to patterns

**Periodic** (after each sprint):
- Emerging patterns from multiple PRs
- Team feedback and retrospective insights

### Update Process

1. **Update source specs** first (`specs/*.md`)
2. **Regenerate rules**: Re-run consolidation process
3. **Copy to Windsurf**: Update `.windsurf/rules/project-standards.md`
4. **Test**: Verify with sample Cascade conversation
5. **Notify team**: Communicate updated standards

---

## Troubleshooting

### Rules Not Appearing

**Check**:
1. File exists: `.windsurf/rules/project-standards.md`
2. File size: Under 12,000 characters
3. Windsurf UI: Rules tab shows the file
4. Activation: Set to "Always On" or appropriate mode

**Fix**:
```bash
# Verify file exists
ls -la .windsurf/rules/project-standards.md

# Check character count
wc -c .windsurf/rules/project-standards.md

# Reload Windsurf window
# Cmd+Shift+P → "Developer: Reload Window"
```

### Rules Not Being Applied

**Symptoms**:
- Cascade doesn't follow project patterns
- No mention of mandatory protocols
- Generic responses instead of project-specific

**Fix**:
1. Verify activation mode is "Always On"
2. Check Rules tab shows active status
3. Start **new** Cascade conversation (old conversations may not reload rules)
4. Explicitly @mention the rule if needed: `@project-standards`

### Character Limit Exceeded

**Symptoms**:
- Rule file won't load
- Error message about size

**Fix**:
1. Check current size: `wc -c .windsurf/rules/project-standards.md`
2. If over 12,000, split into multiple rule files:
   - `architecture-standards.md` (Next.js, Amplify, Design System)
   - `workflow-standards.md` (Branch readiness, LOC, PRs)
   - `code-quality-standards.md` (ESLint, TypeScript, Comments)
3. Use glob patterns or model decision for targeted activation

---

## Benefits Checklist

After setup, you should experience:

### Immediate Benefits
- ✅ Cascade enforces Server Components first rule
- ✅ Automatic codebase analysis before creating new files
- ✅ Branch readiness confirmation prevents premature feature work
- ✅ LOC verification catches oversized PRs early

### Quality Improvements
- ✅ Fewer ESLint errors in AI-generated code
- ✅ Consistent component patterns
- ✅ Proper TypeScript strict mode compliance
- ✅ Correct Amplify Gen2 patterns (e.g., `.guest()` not `.public()`)

### Efficiency Gains
- ✅ Less time fixing AI code
- ✅ Faster PR reviews (code follows standards)
- ✅ Fewer back-and-forth clarifications
- ✅ Better first-time code quality

---

## Advanced Configuration

### Multiple Rule Files

If rules grow beyond 12,000 characters:

```
.windsurf/rules/
├── project-standards.md          # Core standards (Always On)
├── architecture-patterns.md      # Detailed patterns (Model Decision)
├── component-library.md          # Component examples (Manual)
└── troubleshooting-guide.md      # Debug patterns (Manual)
```

**Activation Strategy**:
- `project-standards.md`: Always On
- `architecture-patterns.md`: Model Decision (when working on architecture)
- `component-library.md`: Manual (@mention when needed)
- `troubleshooting-guide.md`: Manual (@mention when debugging)

### Glob Pattern Activation

For file-type specific rules:

**TypeScript/React Files**:
```
Pattern: **/*.{ts,tsx}
Activation: Automatic
```

**Amplify Backend**:
```
Pattern: amplify/**/*
Activation: Automatic
```

**Styling Files**:
```
Pattern: **/*.css
Activation: Automatic
```

---

## Team Onboarding

### For New Developers

**Setup Steps**:
1. Clone repository
2. Run: `cp specs/WINDSURF-RULES.md .windsurf/rules/project-standards.md`
3. Open Windsurf → Customizations → Rules
4. Verify `project-standards.md` is active
5. Start first Cascade conversation to test

**Learning Path**:
1. Read `specs/WINDSURF-RULES.md` once (10-15 minutes)
2. Reference during development as needed
3. Let Cascade enforce automatically
4. Gradually internalize patterns

### For Existing Developers

**Migration**:
1. Review consolidated rules vs old spec documents
2. Note any new mandatory protocols
3. Update local workflows if needed
4. Continue referencing full specs for deep dives

---

## Support Resources

### Documentation
- **Full Specs**: `specs/*.md` (detailed explanations)
- **Consolidated Rules**: `specs/WINDSURF-RULES.md` (quick reference)
- **Analysis**: `specs/WINDSURF-RULES-ANALYSIS.md` (consolidation process)
- **This Guide**: `specs/WINDSURF-RULES-SETUP.md` (setup instructions)

### Windsurf Resources
- **Rules Directory**: https://windsurf.com/editor/directory
- **Documentation**: https://docs.windsurf.com/windsurf/cascade/memories
- **Best Practices**: Included in rules directory examples

### Project Resources
- **CONTRIBUTING.md**: Development workflow and PR guidelines
- **README.md**: Project overview and setup instructions
- **specs/**: Complete specification documents

---

## Next Steps

1. ✅ **Review**: Read through `specs/WINDSURF-RULES.md`
2. ✅ **Integrate**: Copy to `.windsurf/rules/project-standards.md`
3. ✅ **Activate**: Set to "Always On" in Windsurf UI
4. ✅ **Test**: Run the 3 test scenarios above
5. ✅ **Validate**: Confirm Cascade follows project standards
6. ✅ **Proceed**: Move forward with Phase 2 development

---

## Success Criteria

Rules are successfully integrated when:

✅ Cascade automatically enforces Server Components first
✅ Branch readiness confirmation happens before feature work
✅ Codebase analysis occurs before creating new files
✅ LOC verification runs before commits
✅ Amplify Gen2 patterns are correct (`.guest()`, relationships, etc.)
✅ Tailwind v4 + shadcn/ui standards are followed
✅ Quality gates are enforced before feature completion

**Status**: Ready for integration and testing 🚀
