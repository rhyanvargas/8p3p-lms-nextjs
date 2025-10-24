# Technical Debt

This document tracks technical debt items requiring future attention, following the established specification numbering system.

## Styling System Consistency

### Tavus CVI Components - CSS Modules to Tailwind v4 Migration

**Status**: Phase 1 - Deferred to Post-MVP

**Issue**: Tavus CVI components use CSS modules, while the rest of the project uses TailwindCSS v4 + shadcn/ui (as defined in `specs/03-design-system-standards.md`).

**Impact**: 
- Two styling systems in codebase
- Inconsistent with design system standards
- Harder to theme/customize Tavus components
- Potential maintenance complexity

**Affected Files**:
- `src/components/cvi/components/conversation/conversation.module.css`
- `src/components/cvi/components/audio-wave/audio-wave.module.css`
- `src/components/cvi/components/device-select/device-select.module.css`
- All other auto-generated CVI component styles

**Recommended Action**:
1. Create Phase 2+ task to refactor Tavus components to Tailwind
2. Replicate video UI styles using Tailwind utility classes
3. Ensure responsive design and dark mode compatibility
4. Remove CSS module files after migration
5. Update component library to use shadcn/ui patterns

**Priority**: Medium (post-MVP feature validation)

**Estimated Effort**: 4-6 hours

**Created**: 2025-10-21 (Phase 1: Ask a Question feature)

**Related Specs**:
- `specs/03-design-system-standards.md` - Tailwind v4 + shadcn/ui standards
- `specs/features/ask-question-tavus.md` - Feature specification

---

## Future Debt Items

Add new technical debt items below following the same format:
- Clear status and priority
- Impact assessment
- Recommended action
- Time estimates
- Related specifications
