# Craftinator-v2 Workspace Guidelines & Agent Instructions

This repository contains **Craftinator-v2**, a curated artisan and handcrafted goods e-commerce platform built with React and Vite.

## Available Skills
- **`craftinator-guide`**: Located at `.agents/skills/craftinator-guide/SKILL.md`. Activate this skill for comprehensive architecture breakdowns, project structure maps, design tokens, and the step-by-step project inspection runbook.
- **`safe-feature-implementation`**: Located at `.agents/skills/safe-feature-implementation/SKILL.md`. Enforces a disciplined, approval-based development workflow: Understand first (Phase 1) → Plan second (Phase 2) → Mandatory User Approval Gate 1 → Implement (Phase 3) → Verify (Phase 3.1-3.2) → Senior Code Review (Phase 4) → Approval Gate 2 → Fix & Final Verification.

## Core Architectural Rules & Standards
1. **Framework & Stack**: React 18.2.0 + Vite 5.1.6 + `lucide-react`. Use functional components and modern React hooks.
2. **Styling Philosophy**: 
   - Use **Pure Vanilla CSS** with CSS custom properties from `src/index.css`.
   - **Do not introduce Tailwind CSS or external CSS utility libraries** unless explicitly requested.
   - Component styles live in `src/styles/<ComponentName>.css` and are imported centrally in `src/App.jsx`.
   - Always honor the earthy artisan palette: Terracotta (`--accent-terracotta`), Cream/Sand (`--bg-primary`), Dark Charcoal (`--text-primary`), and Sage (`--accent-sage`).
3. **Routing**:
   - Custom client-side routing via Browser History API (`window.location.pathname`, `pushState`, `popstate`) in `src/App.jsx`.
   - Ensure SPA rewrites are maintained in `vercel.json`.
4. **Data Management**:
   - Data is stored in static JS modules in `src/data/` (`products.js`, `artisans.js`, etc.).
   - Cart and wishlist operations are managed via React state in `src/App.jsx`.
5. **Drawers & Modals**:
   - Always manage background scrolling using `src/hooks/useBodyScrollLock.js`.
   - Ensure accessible modal behavior: backdrop click dismiss, escape key dismiss, and focus trap containment where applicable.
6. **Internationalization (i18n)**:
   - Always wrap user-facing text with `t('key', 'Default Text')`.
   - Run `npm run i18n:sync` whenever new UI sections, components, or pages are introduced to automatically synchronize translation keys across all languages.
