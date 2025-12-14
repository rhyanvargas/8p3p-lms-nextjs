# Better Auth Migration – Requirements

## 1. Business Context

The current LMS uses **AWS Amplify (Cognito)** for authentication. This introduces:

- Tight coupling to a proprietary backend
- Higher operational complexity (Amplify environments, Cognito pools, auth adapters)
- Friction for local development and future auth customization

The goal is to migrate to **Better Auth + Postgres/Drizzle**, aligning with our Next.js 15, server-first architecture and simplifying auth while maintaining strong security guarantees.

## 2. Goals & Non-Goals

### 2.1 Goals (Must)

- Replace **all AWS Amplify-based authentication** with Better Auth.
- Use **Postgres + Drizzle** as the backing store for auth data.
- Support:
  - Email/password sign-up and sign-in
  - Email verification
  - Password reset
- Enforce authentication via:
  - Next.js middleware for optimistic redirects
  - Server components (RSC) / server actions for actual session validation
- Fully remove unused Amplify code, configuration, and AWS resources.

### 2.2 Non-Goals (Won't/MVP)

- Social login (Google, GitHub, etc.).
- 2FA, passkeys, magic links, or SSO.
- Migration of existing users (assume **0 users** / clean slate).

## 3. Scope & Assumptions

### 3.1 In Scope

- Better Auth installation and configuration with Postgres/Drizzle.
- New auth API route: `app/api/auth/[...all]/route.ts`.
- New client auth helper (Better Auth React client).
- New or updated auth pages:
  - Login / Sign In
  - Sign Up
  - Forgot Password
  - Reset Password
  - Email Verification callback/handling
- Middleware and protected route logic for `/dashboard` and `/courses`.
- Dashboard and nav updates to use Better Auth sessions instead of Amplify.
- Removal of all Amplify dependencies, backend artifacts, and AWS resources tied to this app.

### 3.2 Out of Scope (for this feature)

- Redesign of the dashboard or course experience.
- Non-auth AWS resources that are still needed for other features (e.g., storage, video, etc.).

### 3.3 Assumptions

- We can access and manage the Postgres instance used by Drizzle.
- Email provider (e.g. SES, SendGrid, or similar) is available or can be configured.
- There are **no production users** that need to be migrated from Amplify.

## 4. User Stories & Acceptance Criteria

### 4.1 Sign Up (Email & Password)

**Story**: As a new therapist, I want to create an account using my email and a password so that I can access the LMS dashboard.

```gherkin
Scenario: Successful sign-up with email and password
  Given I am on the sign-up page
  And I provide a valid email and strong password
  When I submit the sign-up form
  Then I should see a confirmation that my account was created
  And I should be prompted to verify my email address
```

```gherkin
Scenario: Sign-up fails with existing email
  Given an account already exists for my email
  When I submit the sign-up form with the same email
  Then I should see a clear error that the email is already in use
  And my password field should be cleared or masked
```

```gherkin
Scenario: Sign-up fails with invalid input
  Given I am on the sign-up page
  When I submit the form with an invalid email or weak password
  Then I should see validation errors explaining what needs to be fixed
```

### 4.2 Email Verification

**Story**: As a new user, I want to verify my email so that my account can be activated securely.

```gherkin
Scenario: Successful email verification
  Given I have received a verification email from the system
  When I click the verification link within its valid time window
  Then my account should be marked as verified
  And I should be able to sign in successfully
```

```gherkin
Scenario: Verification link expired or invalid
  Given I click an email verification link that is expired or invalid
  When the system processes the link
  Then I should see a message that the link is invalid or expired
  And I should be offered a way to request a new verification email
```

### 4.3 Sign In (Email & Password)

**Story**: As a returning therapist, I want to sign in using my email and password so that I can access my dashboard.

```gherkin
Scenario: Successful sign-in for verified user
  Given my account exists and my email is verified
  And I am on the login page
  When I enter valid credentials
  Then I should be redirected to the dashboard
  And a secure session cookie should be created
```

```gherkin
Scenario: Sign-in fails for unverified email
  Given my account exists but my email is not verified
  When I attempt to sign in
  Then I should see a message that my email is not verified
  And I should be offered a way to resend the verification email
```

```gherkin
Scenario: Sign-in fails with wrong credentials
  Given my account exists
  When I enter an incorrect email or password
  Then I should see a generic error that the credentials are invalid
  And no information about which field is incorrect should be leaked
```

### 4.4 Sign Out

**Story**: As an authenticated user, I want to sign out so that no one else can use my session.

```gherkin
Scenario: Successful sign-out
  Given I am currently signed in
  When I click the sign-out button in the navbar
  Then my session cookie should be invalidated
  And I should be redirected to a public page (e.g. home or login)
```

### 4.5 Password Reset

**Story**: As a user who has forgotten my password, I want to reset it securely so that I can regain access to my account.

```gherkin
Scenario: Request password reset
  Given I am on the "Forgot Password" page
  When I submit my email address
  Then I should see a confirmation message regardless of whether an account exists
  And if my account exists, a reset email should be sent
```

```gherkin
Scenario: Complete password reset
  Given I have received a password reset email with a valid token
  When I visit the reset link and enter a new valid password
  Then my password should be updated
  And I should be able to sign in with the new password
```

```gherkin
Scenario: Password reset link invalid or expired
  Given I visit a password reset link that is invalid or expired
  When the system processes the token
  Then I should see an error that the link is invalid or expired
  And I should be offered a way to request a new reset email
```

### 4.6 Protected Routes & Session Handling

**Story**: As the system, I want to ensure that only authenticated users can access protected pages so that sensitive data is not exposed.

```gherkin
Scenario: Unauthenticated user accessing protected route
  Given I am not authenticated
  When I navigate directly to "/dashboard"
  Then I should be redirected to the login page
```

```gherkin
Scenario: Authenticated user accessing login page
  Given I am authenticated
  When I navigate to the login page
  Then I should be redirected to the dashboard
```

```gherkin
Scenario: Authenticated user session is validated in server components
  Given I am authenticated
  When the dashboard server component renders
  Then it should obtain my session using Better Auth
  And it should render personalized information such as my name or email
```

### 4.7 Amplify Decommissioning & AWS Cleanup

**Story**: As an engineer, I want Amplify removed so that the codebase and infrastructure are simpler and cheaper to operate.

```gherkin
Scenario: Amplify code removed from frontend
  Given the Better Auth migration is complete
  When I search the codebase for aws-amplify or @aws-amplify
  Then I should find no remaining runtime dependencies or imports
```

```gherkin
Scenario: Amplify backend resources removed
  Given Better Auth is the only auth system in use
  When I inspect AWS resources for this project
  Then no unused Cognito pools, Amplify backend environments, or related auth resources should remain
```

```gherkin
Scenario: CI no longer depends on Amplify
  Given the migration is complete
  When CI runs for pull requests
  Then no Amplify CLI commands should be executed
  And the build should rely only on Better Auth, Postgres, and Drizzle
```

## 5. Non-Functional Requirements

### 5.1 Security

- Use **HttpOnly, secure cookies** for sessions.
- Do not expose raw tokens or secrets to the client.
- All auth endpoints must be CSRF-safe per Better Auth guidance.
- Rate-limit auth-related endpoints (sign-in, sign-up, reset) as recommended by Better Auth.
- Error messages must avoid leaking whether an email exists.

### 5.2 Performance

- Auth flows should complete within **500ms p95** in typical conditions (excluding email-delivery latency).
- Middleware must avoid DB round trips (optimistic cookie checks only).
- Server components should call `auth.api.getSession` at most once per render path.

### 5.3 Reliability & Operability

- Misconfiguration of env vars should fail fast with clear errors in logs.
- If email delivery fails, the user should receive a generic error and we should log the root cause.
- Feature must work locally with minimal setup (dockerized Postgres or local Postgres instance).

## 6. MoSCoW Prioritization

- **Must**
  - Better Auth + Postgres/Drizzle configured and working.
  - Email/password sign-up, sign-in, email verification, password reset.
  - Protected routes for `/dashboard` and `/courses` using Better Auth.
  - Complete removal of Amplify auth code and unused AWS auth resources.

- **Should**
  - Clean UX with clear error messages and success states.
  - Centralized error logging for auth failures.

- **Could**
  - Basic security telemetry (counts of failed login attempts, etc.).
  - Hooks for future social login.

- **Won't (for now)**
  - Social providers, 2FA, passkeys, and SSO.

## 7. Dependencies

- Postgres database reachable from the app.
- Drizzle ORM configured for the app.
- Email provider (service + credentials) for verification and reset emails.
- Better Auth library and CLI.
- Next.js 15 app router and middleware.

## 8. Success Criteria

- All acceptance scenarios above can be exercised and pass via manual Q&A.
- No Amplify runtime code, config, or AWS resources remain for auth.
- CI passes (lint, type-check, build) without Amplify.
- Onboarding instructions in README explain how to configure Better Auth + Postgres and run the app locally.
