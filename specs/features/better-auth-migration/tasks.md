# Better Auth Migration – Tasks

This document breaks the Better Auth migration into phases and implementation tasks, with traceability back to the requirements and design.

## Legend

- **Status**: `Pending` | `In Progress` | `Completed` | `Blocked`
- **Estimate**: Rough estimate (S, M, L) or story points.

---

## Phase 1 – Better Auth + Drizzle Foundation

**Goal**: Introduce Better Auth and its database schema without changing runtime behavior.

### Task 1.1 – Install Better Auth Dependencies

- **Status**: Completed
- **Depends on**: None
- **Estimate**: S
- **Description**: Add Better Auth core + Next.js + React client packages to `package.json`.
- **Acceptance**:
  - Dependencies installed.
  - TypeScript recognizes Better Auth imports.

### Task 1.2 – Ensure Postgres + Drizzle Setup

- **Status**: Completed
- **Depends on**: 1.1
- **Estimate**: M
- **Description**: Confirm existing Drizzle + Postgres setup or add `src/lib/db.ts` and base Drizzle configuration.
- **Acceptance**:
  - Drizzle `db` instance available for import.
  - Local and CI builds can connect to Postgres (or at least compile).

### Task 1.3 – Create Better Auth Instance (`auth.ts`)

- **Status**: Completed
- **Depends on**: 1.1, 1.2
- **Estimate**: M
- **Description**: Implement `src/lib/auth.ts` using `betterAuth` with Drizzle adapter and email/password enabled.
- **Acceptance**:
  - `auth` export available and typed.
  - Configuration matches env vars and design doc.

### Task 1.4 – Generate and Apply Better Auth Schema

- **Status**: Completed
- **Depends on**: 1.3
- **Estimate**: M
- **Description**: Run `npx @better-auth/cli generate` and integrate the schema into Drizzle migrations.
- **Acceptance**:
  - Auth-related tables are created in Postgres.
  - Migration can be applied locally without errors.

### Task 1.5 – Add `/api/auth/[...all]` Route

- **Status**: Completed
- **Depends on**: 1.3, 1.4
- **Estimate**: S
- **Description**: Implement `app/api/auth/[...all]/route.ts` using `toNextJsHandler(auth.handler)`.
- **Acceptance**:
  - Hitting `/api/auth/*` routes responds without server errors.

---

## Phase 2 – Auth Flows (Sign Up, Sign In, Verification, Reset)

**Goal**: Implement user-facing auth flows using Better Auth.

### Task 2.1 – Create Auth Client (`auth-client.ts`)

- **Status**: Pending
- **Depends on**: Phase 1
- **Estimate**: S
- **Description**: Implement `src/lib/auth-client.ts` using `createAuthClient`.
- **Acceptance**:
  - Client methods available for sign-up, sign-in, sign-out, verification, and reset flows.

### Task 2.2 – Implement Sign-Up Page

- **Status**: Pending
- **Depends on**: 2.1
- **Estimate**: M
- **Description**: Create `app/sign-up/page.tsx` using shadcn/ui and `authClient`.
- **Acceptance**:
  - User can register with email/password.
  - Verification email is triggered.

### Task 2.3 – Implement Login Page

- **Status**: Pending
- **Depends on**: 2.1
- **Estimate**: M
- **Description**: Create or update `app/login/page.tsx` to use Better Auth for sign-in.
- **Acceptance**:
  - Verified users can sign in and receive a session cookie.
  - Unverified users see a clear message and can request re-verification.

### Task 2.4 – Implement Email Verification Handling

- **Status**: Pending
- **Depends on**: 2.2
- **Estimate**: M
- **Description**: Implement a verification callback route/page that processes Better Auth verification links.
- **Acceptance**:
  - Users can verify their email via the link.
  - Errors for expired/invalid links are handled gracefully.

### Task 2.5 – Implement Forgot Password Flow

- **Status**: Pending
- **Depends on**: 2.1
- **Estimate**: M
- **Description**: Create `app/forgot-password/page.tsx` to request a reset link.
- **Acceptance**:
  - User can submit an email and see a confirmation message.
  - Reset email is sent when account exists.

### Task 2.6 – Implement Reset Password Flow

- **Status**: Pending
- **Depends on**: 2.5
- **Estimate**: M
- **Description**: Create `app/reset-password/page.tsx` to handle reset tokens and set new passwords.
- **Acceptance**:
  - Valid token → password updated, user can log in with new password.
  - Invalid/expired token → user sees appropriate error and can request a new reset.

### Task 2.7 – Configure Email Provider

- **Status**: Pending
- **Depends on**: 1.3, 2.2, 2.5
- **Estimate**: M
- **Description**: Wire Better Auth email sending to SES/SendGrid/SMTP with env vars.
- **Acceptance**:
  - Verification and reset emails are delivered in dev and staging.
  - Failures are logged appropriately.

---

## Phase 3 – Migrate Usage (Middleware, Dashboard, Navbar, Auth Components)

**Goal**: Switch from Amplify to Better Auth for all runtime auth checks.

### Task 3.1 – Update Middleware to Use Better Auth

- **Status**: Pending
- **Depends on**: Phases 1–2
- **Estimate**: M
- **Description**: Replace Amplify-based middleware logic with `getSessionCookie`/`getCookieCache` from Better Auth.
- **Acceptance**:
  - Unauthenticated users are redirected from protected routes to `/login`.
  - Authenticated users are redirected from `/login` to `/dashboard`.

### Task 3.2 – Convert Dashboard Page to Server-Side Session Check

- **Status**: Pending
- **Depends on**: 3.1
- **Estimate**: M
- **Description**: Update `app/dashboard/page.tsx` to call `auth.api.getSession` in a server component.
- **Acceptance**:
  - No session → redirect to `/login`.
  - Session present → page renders with user context from Better Auth.

### Task 3.3 – Update Navbar Auth State & Logout

- **Status**: Pending
- **Depends on**: 2.1, 3.1
- **Estimate**: M
- **Description**: Remove Amplify hooks from navbar and wire to Better Auth client for auth state and sign-out.
- **Acceptance**:
  - Navbar shows correct public vs authenticated nav options.
  - Logout clears session and redirects to a public page.

### Task 3.4 – Migrate/Remove Auth Components

- **Status**: Pending
- **Depends on**: 3.1–3.3
- **Estimate**: M–L
- **Description**: Update or remove:
  - `AuthProvider.tsx`
  - `AuthClient.tsx`
  - `SignIn.tsx`
  - `AuthRedirect.tsx`
  - `EmailVerificationHandler.tsx`
  - `ProtectedRoute.tsx`
  - `SessionHandler.tsx`
- **Acceptance**:
  - No component relies on Amplify APIs.
  - Auth flows use Better Auth end-to-end.

---

## Phase 4 – Amplify Decommissioning & AWS Cleanup

**Goal**: Fully remove Amplify from the codebase, CI, and AWS.

### Task 4.1 – Remove Amplify Runtime Code & Dependencies

- **Status**: Pending
- **Depends on**: Phase 3
- **Estimate**: M
- **Description**: Remove all `aws-amplify`, `@aws-amplify/ui-react`, `@aws-amplify/adapter-nextjs` imports and code paths, and delete any temporary build shims related to Amplify (e.g. prebuild scripts that create `amplify_outputs.json`).
- **Acceptance**:
  - Codebase builds and runs with no Amplify imports.
  - `npm ls aws-amplify` and related packages fail (not installed).

### Task 4.2 – Remove Amplify Backend Artifacts

- **Status**: Pending
- **Depends on**: 4.1
- **Estimate**: M
- **Description**: Delete `amplify/` directory, `amplify_outputs.json`, and any Amplify-specific config.
- **Acceptance**:
  - Repo contains no Amplify backend files.
  - Build and runtime are unaffected.

### Task 4.3 – Clean Up AWS Resources

- **Status**: Pending
- **Depends on**: 4.2
- **Estimate**: M
- **Description**: In AWS, remove now-unused Amplify and Cognito resources associated with this app.
- **Acceptance**:
  - No unused Amplify backend environments remain.
  - No unused Cognito user/identity pools for this app remain.
  - Any auth-only supporting resources (Lambdas, DynamoDB tables, S3 buckets) are decommissioned.

### Task 4.4 – Update CI Configuration

- **Status**: Pending
- **Depends on**: 4.1
- **Estimate**: S
- **Description**: Remove Amplify CLI commands and mock `amplify_outputs.json` steps from CI, and ensure Better Auth + Postgres/Drizzle environment is correctly configured.
- **Acceptance**:
  - PR checks succeed without any Amplify-related steps.

---

## Phase 5 – Documentation & Validation

**Goal**: Align documentation with the new auth system and validate requirements.

### Task 5.1 – Update Specs and README

- **Status**: Pending
- **Depends on**: Phases 1–4
- **Estimate**: M
- **Description**: Update project specs and README to describe Better Auth + Postgres/Drizzle as the auth system.
- **Acceptance**:
  - Specs reference Better Auth instead of Amplify.
  - README includes setup instructions for auth-related env vars and DB.

### Task 5.2 – Manual Q&A Testing

- **Status**: Pending
- **Depends on**: Phases 1–4
- **Estimate**: M
- **Description**: Execute the Gherkin scenarios from `requirements.md` via manual testing.
- **Acceptance**:
  - All core scenarios (sign-up, verification, login, logout, reset, protected routes) pass.
  - Any issues found are documented and fixed.

### Task 5.3 – Final Sign-Off

- **Status**: Pending
- **Depends on**: 5.1, 5.2
- **Estimate**: S
- **Description**: Product/engineering sign off that Better Auth migration meets requirements.
- **Acceptance**:
  - Checklist completed.
  - Feature marked as ready in tracking tools.

### Task 5.4 – Post-Migration Auth Hardening (Middleware + RSC + Client)

- **Status**: Pending
- **Depends on**: Phases 1–4
- **Estimate**: S–M
- **Description**: Refine auth architecture layering between middleware, server components, and client wrappers after Better Auth migration.
- **Acceptance**:
  - A shared server-side helper (for example, `requireAuth`) is used by protected server components to obtain the current user/session and redirect unauthenticated users to `/login`.
  - Protected server components (such as the dashboard page) no longer access `session.user` without going through this helper, and call Better Auth session APIs at most once per render path.
  - Middleware remains responsible for optimistic global redirects, and client auth wrappers (such as `ProtectedRoute`) focus on UX concerns (loading states, redirect-after-login) rather than core authorization rules.
