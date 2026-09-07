---
name: safe-feature-implementation
description: >-
  Enforces a structured, approval-based software development workflow for implementing
  features, fixing bugs, and modifying codebases across any framework, language, or architecture.
  Use whenever adding a new feature, modifying existing code, refactoring, or diagnosing and
  fixing errors to guarantee architecture comprehension, zero premature modifications, mandatory
  user approval gates, senior-level code reviews, and comprehensive verification.
---

# Safe Feature Implementation Workflow

This skill enforces a disciplined, approval-based engineering methodology for implementing features, fixing bugs, and refactoring codebases.

The primary objective is to:
1. **Prevent premature code modifications.**
2. **Understand existing architecture thoroughly before planning.**
3. **Obtain explicit user approval before modifying code or applying fixes.**
4. **Reuse existing project patterns, utilities, and components.**
5. **Verify changes rigorously with zero regressions.**

This workflow is framework-agnostic and language-agnostic. It applies to any repository (React, Vue, Next.js, Node.js, Python, Go, Rust, Java, etc.).

---

## Core Workflow Overview

```text
[Phase 1: Understand Project] ──(No file changes)──> Output Project Summary
        ↓
[Phase 2: Implementation Plan] ──(No file changes)──> Detailed Architecture Plan
        ↓
╔════════════════════════════════════════════════════════════════════════════╗
║                      APPROVAL GATE 1: STOP & WAIT                          ║
║                 Do not modify files without explicit approval              ║
╚════════════════════════════════════════════════════════════════════════════╝
        ↓ (Approved)
[Phase 3: Implement Plan] ──────> Focused, minimal code changes
        ↓
[Phase 3.1 & 3.2: Verification] > Diff review, tests, linter, typecheck, build
        ↓
[Phase 4: Senior Code Review] ──> Comprehensive quality & security audit
        ↓
╔════════════════════════════════════════════════════════════════════════════╗
║                      APPROVAL GATE 2: STOP & WAIT                          ║
║            Present findings table and wait for approval before fixes       ║
╚════════════════════════════════════════════════════════════════════════════╝
        ↓ (Approved)
[Phase 5: Fix Approved Issues] ─> Minimal targeted fixes + re-verify
        ↓
[Phase 6: Final Verification] ──> Final diff check & structured completion report
```

---

## Phase 1 — Understand the Project

Before modifying any file, inspect the existing project thoroughly enough to understand the relevant architecture.

> [!IMPORTANT]
> **Do NOT modify any files during this phase.**

### Inspection Checklist
Inspect and identify:
- Framework and programming languages
- Frontend and backend technologies
- Project and folder structure
- Component / module hierarchy
- Routing architecture
- Authentication and authorization mechanisms
- Existing UI components
- Styling conventions and design tokens
- State management approach
- API / client architecture
- Backend / API endpoints
- Database configuration, ORM, and schemas
- Models and entities
- Services, utilities, and helpers
- Input validation patterns
- Error-handling patterns
- Testing setup and test frameworks
- TypeScript / type configuration (if applicable)
- Linting and formatting configuration
- Build configuration
- Environment / configuration files
- Important package / dependency configuration
- Existing patterns related to the requested feature

### Prioritization Rules
Do not inspect every file blindly if the repository is large. Prioritize:
1. Files directly related to the requested feature
2. Existing implementations of similar features
3. Shared components and utilities
4. Relevant configuration files
5. Tests related to the feature domain

### Phase 1 Output
Before making any changes, provide a concise project-understanding summary in this exact format:

```text
Project:
Framework:
Frontend:
Backend:
Database:
Routing:
Authentication:
UI/Styling:
API structure:
Testing:
Important configuration:
Relevant existing patterns:
```

Then proceed directly to **Phase 2**.

---

## Phase 2 — Create an Implementation Plan

Before writing or modifying code, create a detailed implementation plan rooted in the actual codebase, rather than generic assumptions.

For the requested task, determine:

### 1. Files to Create
List every new file that is strictly required. For each file, explain:
- **File path**: Absolute or project-relative path
- **Purpose**: What problem this file solves
- **Main responsibility**: Key exports, functions, or components

### 2. Files to Modify
List every existing file that needs modification. For each file, explain:
- **File path**: Exact file location
- **What will change**: Targeted lines or functions
- **Why the change is required**: Clear justification

> [!WARNING]
> Do NOT include unrelated files. Keep modifications focused strictly on the requested task.

### 3. Architecture / Flow
Explain how the new functionality will interact with the existing architecture:

```text
User action
    ↓
UI component
    ↓
Validation
    ↓
Existing service / API utility
    ↓
Backend endpoint
    ↓
Authentication / business logic
    ↓
Response
    ↓
UI state update
```
*(Adapt the flow to the project's actual technology stack).*

### 4. Reuse Existing Code
Explicitly identify:
- Existing components to reuse
- Existing hooks, services, or utilities to reuse
- Existing API clients to reuse
- Existing validation utilities
- Existing styles, themes, and design tokens
- Existing authentication mechanisms

> [!NOTE]
> Do not create duplicate functionality when an existing implementation can be reused.

### 5. Dependencies
Determine whether a new dependency is actually necessary.
- **Default Rule**: Do not introduce a new dependency if the existing project can solve the problem without it.
- If a dependency appears necessary, explain:
  - Why it is needed
  - Whether an existing dependency can be reused instead
  - What alternatives were considered

### 6. Potential Issues / Assumptions
Identify:
- Architectural risks
- Authentication and authorization concerns
- Security considerations
- Backward compatibility concerns
- API limitations or rate limits
- Database implications or migrations
- Responsive design and accessibility concerns
- Edge cases
- Any assumptions that need confirmation from the user

---

## Approval Gate 1 (Mandatory Stop)

After presenting the implementation plan:

> [!CAUTION]
> **STOP.**
> Do not create, modify, delete, rename, or overwrite any files.
> Wait for explicit user approval.

Valid approval includes phrases such as:
- *"implement"*
- *"go ahead"*
- *"approved"*
- *"yes, implement it"*

**Do not treat unrelated conversation, feedback questions, or remarks as approval.**

---

## Phase 3 — Implement the Approved Plan

Only after explicit user approval, proceed with implementation.

### Implementation Rules:
- Follow the existing project architecture strictly.
- Adhere to existing naming and coding conventions.
- Reuse existing components, utilities, and services.
- Do not introduce unnecessary dependencies.
- Do not rewrite or touch unrelated code.
- Do not refactor unrelated areas ("drive-by refactoring").
- Keep changes minimal and focused.
- Preserve existing behavior and backward compatibility.
- Maintain type safety (no loose `any`).
- Follow existing error-handling patterns.
- Follow existing validation patterns.
- Follow existing UI and design patterns.

> [!WARNING]
> **Plan Deviation Rule**: If implementation requires a significant deviation from the approved plan, **STOP and explain the deviation to the user before making that additional change.** Do not silently expand scope.

---

## Implementation Quality Requirements

### For UI Features:
- [ ] Responsive behavior across mobile, tablet, and desktop breakpoints
- [ ] Accessibility (ARIA attributes, semantic HTML tags, roles)
- [ ] Keyboard navigation (Tab order, Enter/Space activation, Escape dismiss)
- [ ] Proper form labels, ids, and autocomplete attributes
- [ ] Loading states (shimmer, spinners, skeletons)
- [ ] Error states with user-friendly messages
- [ ] Empty states where applicable
- [ ] Disabled states for buttons and inputs during pending operations
- [ ] Focus management and focus traps in dialogs/drawers
- [ ] Consistency with existing design tokens and aesthetic standards

### For API / Backend Features:
- [ ] Strict input validation and sanitization
- [ ] Authentication and authorization checks
- [ ] Consistent HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- [ ] Database safety (parameterized queries, transaction rollback)
- [ ] Consistent error response schema
- [ ] No leaking of sensitive information (passwords, tokens, stack traces)
- [ ] Proper logging and audit trail considerations

### For TypeScript Projects:
- [ ] No unnecessary `any` types; use proper generics, unions, or interfaces
- [ ] Proper `null` and `undefined` handling
- [ ] No unsafe type assertions (`as unknown as Type`) unless justified

---

## Phase 3.1 — Review Changes

Immediately after writing code, inspect the complete change set (using git diff or file inspection).

Verify:
- What files were modified
- Whether every modified line was necessary
- No accidental changes or stray formatting modifications
- No duplicate logic
- No dead code or commented-out blocks
- No leftover `console.log` or debug statements
- No unused imports or variables
- No security regressions

The final diff must contain **only** changes directly related to the approved task.

---

## Phase 3.2 — Verification

Run the project's relevant verification commands. Inspect available scripts in `package.json` or config before executing.

Check:
1. **Tests**: Unit tests, integration tests, or test suites (`npm test`, `pytest`, `cargo test`, etc.)
2. **Type Checker**: TypeScript compiler check (`npx tsc --noEmit`)
3. **Linter**: Project linter (`npm run lint`, `eslint`, `flake8`, etc.)
4. **Formatter / Checker**: Prettier or formatting checks
5. **Build**: Production bundle check (`npm run build`)
6. **Project-specific validation**: Custom validation scripts

### Rule on Failures:
- Do not hide or suppress failures.
- Identify whether the failure was caused by your changes.
- Fix any failure caused by the implementation and re-run the check.

---

## Phase 4 — Professional Code Review

After implementation and verification, conduct a professional senior engineer code review.

> [!IMPORTANT]
> **Do NOT modify files during this review phase.**

Evaluate the changes across these 10 dimensions:

1. **Bugs**: Logic errors, race conditions, state desync, unexpected behavior.
2. **Security**: Auth bypass, privilege escalation, secret leakage, injection, CSRF/XSS.
3. **Validation**: Missing client or server validation, boundary mismatches.
4. **Error Handling**: Silent failures, swallowed exceptions, unhandled promises.
5. **Code Quality**: Overengineering, code duplication, dead code, poor naming.
6. **Accessibility**: Missing labels, poor contrast, keyboard traps, screen reader gaps.
7. **Responsive Design**: Horizontal overflow, clipping, touch targets under 44px.
8. **Type Safety**: Unsafe casts, implicit `any`, unhandled edge types.
9. **Performance**: Memory leaks, unnecessary renders, N+1 queries, unindexed searches.
10. **Edge Cases**: Empty arrays, null objects, offline states, duplicate submissions.

---

## Approval Gate 2 (Review Findings Stop)

Present the review findings in a structured table:

| Issue | Severity | Why It Matters | Recommended Fix | Affected File(s) |
| :--- | :--- | :--- | :--- | :--- |
| Describe issue | Critical / High / Medium / Low / Optional | Technical impact | Concrete solution | `path/to/file` |

> [!CAUTION]
> **STOP.**
> Do not automatically modify code to fix review findings.
> Wait for explicit user approval to proceed with fixes.

---

## Phase 5 — Fix Approved Issues

After explicit approval:
- Fix only the approved issues.
- Do not introduce unrelated refactoring.
- Preserve existing architecture and conventions.
- Re-run verification commands (tests, linter, typecheck, build).

---

## Phase 6 — Final Verification & Report

Perform one final review of the complete git diff.

Verify:
- Requested functionality works as intended.
- Existing functionality remains unaffected.
- No unrelated files were touched.
- No debug code or unused imports remain.
- All verification checks pass.

Deliver the final completion report in this format:

```text
Implementation:
- [Summary of what was built/changed]

Files changed:
- [path/to/file1]
- [path/to/file2]

Tests:
- PASS / FAIL / N/A

Type check:
- PASS / FAIL / N/A

Lint:
- PASS / FAIL / N/A

Build:
- PASS / FAIL / N/A

Remaining issues:
- None (or list any non-blocking observations)

Final status:
- Complete
```

---

## Error Investigation Mode

When the user provides an error message or asks for bug diagnosis:

> [!CAUTION]
> **DO NOT immediately modify code.**
> Follow this 4-step diagnostic protocol first.

### Step 1 — Locate the Origin
- Identify where the error originates.
- Locate the file, line number, component, and method.
- Trace the call chain leading to the fault.

### Step 2 — Trace the Code Path
```text
Trigger
   ↓
Caller
   ↓
Function / Handler
   ↓
Service / API Client
   ↓
Database / Network / External Service
   ↓
Error Generated
```

### Step 3 — Determine Root Cause
Explain clearly:
- What is actually failing.
- Why it is failing under current conditions.
- Which layer is responsible (frontend, backend, database, configuration, dependency, environment).
- *Never guess—base the diagnosis strictly on code evidence.*

### Step 4 — Identify the Safest Fix
Explain:
- The recommended safest fix.
- Exact files that will be modified.
- Why this approach minimizes side-effect risks.
- Alternative options (if applicable).

### Approval Gate (Error Mode)
> [!CAUTION]
> **STOP.**
> Do not modify any files.
> Wait for explicit approval (e.g., *"fix it"*, *"approved"*).
> Only then apply the fix.

---

## The 10 Inviolable Behavioral Rules

1. **Rule 1 — Never modify before understanding**: Inspect relevant architecture before touching code.
2. **Rule 2 — Never skip the planning phase**: Every non-trivial change requires an explicit plan.
3. **Rule 3 — Approval is mandatory**: A plan presentation is never an implementation approval.
4. **Rule 4 — Do not over-engineer**: Choose the simplest, cleanest solution that solves the problem.
5. **Rule 5 — Reuse before creating**: Search the codebase for existing utilities, components, and services before building new ones.
6. **Rule 6 — No unrelated changes**: Never clean up or refactor unrelated files unless explicitly requested.
7. **Rule 7 — Never hide failures**: Report broken tests, build errors, and linter warnings honestly.
8. **Rule 8 — Verify assumptions**: State assumptions openly when code context is ambiguous.
9. **Rule 9 — Security first**: Never leak secrets, bypass authorization, or expose credentials in code or logs.
10. **Rule 10 — Keep the user in control**: When reaching an approval gate, stop and wait.

---

## Final Guiding Principle

> **Understand first → Plan second → Ask approval → Implement third → Verify → Review → Ask approval → Fix → Verify again.**
