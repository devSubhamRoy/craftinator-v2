# Safe Feature Implementation Workflow Examples

## Example 1: New Feature Request Workflow

### 1. User Prompt
> "I want to add a login page."

### 2. Phase 1 — Project Understanding (Zero file changes)
The agent performs an architectural audit and outputs:
```text
Project: Acme Dashboard
Framework: React 18 + Vite
Frontend: React, TypeScript, TailwindCSS
Backend: Node.js / Express (REST API at /api/v1)
Database: PostgreSQL with Prisma ORM
Routing: React Router v6
Authentication: JWT stored in HttpOnly cookies, session context in src/context/AuthContext.tsx
UI/Styling: TailwindCSS + custom Button/Input in src/components/ui/
API structure: Axios client configured with interceptors at src/api/client.ts
Testing: Vitest configured with React Testing Library
Important configuration: vite.config.ts, tsconfig.json, .env.example
Relevant existing patterns: ProtectedRoute wrapper in src/routes/ProtectedRoute.tsx
```

### 3. Phase 2 — Implementation Plan
The agent produces a detailed plan:
- **Files to create**: `src/pages/LoginPage.tsx`
- **Files to modify**: `src/routes/AppRoutes.tsx`, `src/services/authService.ts`
- **Reuse existing code**:
  - `src/components/ui/Button.tsx`
  - `src/components/ui/InputField.tsx`
  - `src/api/client.ts`
  - `src/context/AuthContext.tsx`
- **Architecture flow**:
  ```text
  User fills form in LoginPage.tsx
       ↓
  Local validation (email/password non-empty)
       ↓
  Calls authService.login(credentials) via Axios client
       ↓
  POST /api/v1/auth/login
       ↓
  On success: AuthContext updates state + navigate('/dashboard')
  On failure: Display error toast using useToast()
  ```
- **Dependencies**: None required.
- **Potential risks & assumptions**: Assumption that session cookie is set by server automatically with `credentials: 'include'`.

### 4. Approval Gate 1 (Stop)
The agent **STOPS** and waits for the user's explicit approval:
> *"I have prepared the plan above. Awaiting your approval before making any file changes."*

### 5. Implementation Phase (Only after "Approved" or "Implement it")
- The agent implements `LoginPage.tsx` and updates route definitions.
- Runs `npm run lint`, `npx tsc --noEmit`, and `npm test`.

### 6. Phase 4 & Approval Gate 2 (Senior Code Review)
The agent reviews the diff and reports:
| Issue | Severity | Why It Matters | Recommended Fix | Affected File(s) |
| :--- | :--- | :--- | :--- | :--- |
| Missing `aria-live` on form error alert | Low | Screen readers may not announce error | Add `role="alert"` | `src/pages/LoginPage.tsx` |

The agent **STOPS** and asks if the user wants to apply the fix.

### 7. Phase 5 & 6 — Fix & Final Verification Report
```text
Implementation:
- Created responsive LoginPage with form validation and AuthContext integration.
- Registered /login route in AppRoutes.tsx.

Files changed:
- src/pages/LoginPage.tsx
- src/routes/AppRoutes.tsx

Tests:
- PASS (12 tests)

Type check:
- PASS

Lint:
- PASS

Build:
- PASS

Remaining issues:
- None

Final status:
- Complete
```

---

## Example 2: Error Investigation Mode

### 1. User Prompt
> "I am getting `401 Unauthorized` when submitting the login form."

### 2. Diagnosis Protocol (Zero file changes)
The agent traces the fault without changing any code:

```text
Root Cause Investigation:

1. Origin:
   src/services/authService.ts at line 42 (`login` function).

2. Code Path:
   LoginPage.tsx (form submit)
      ↓
   authService.login()
      ↓
   apiClient.post('/auth/login')
      ↓
   Backend returns 401 Unauthorized

3. Root Cause:
   The Axios instance in `src/api/client.ts` was initialized without `{ withCredentials: true }`,
   so CSRF tokens / session cookies are not transmitted with the request headers.

4. Safest Fix:
   Enable `withCredentials: true` in the login request config in `src/services/authService.ts`
   rather than modifying the global Axios client which could affect public endpoints.

5. Affected Files:
   - src/services/authService.ts
```

### 3. Approval Gate (Stop)
The agent **STOPS** and waits:
> *"Would you like me to apply this fix to `src/services/authService.ts`?"*
