# Compliance mapping — DS-002

Short, honest mapping of this branch against **OWASP ASVS** (Application
Security Verification Standard), the natural fit for a web app. Scope is
this branch's small "items" CRUD fixture, not a production system — see
[README.md](README.md) for what the fixture actually does. This document
gets copied and re-verified per-branch as Phase 6 of the [remediation
plan](https://github.com/Mohammed-shihaf/Digital-Sippoy) rolls out, the
same way `eslint.config.mjs`, `.nycrc.json`, and the rest of the tooling
added in Phases 1–5 does.

Target: **ASVS Level 1** (the baseline level, appropriate for a reference
fixture with no real user data). Status values: **Met**, **Accepted gap**
(deliberately not addressed, with a reason), **Open** (needs an owner
decision before it can be closed).

| ASVS area | Status | Notes |
|---|---|---|
| V5 — Validation, Sanitization | Met | `lib/validate.ts` (zod schema): required, non-empty after trim, 200-char max. Applied at the one entry point (`POST /api/items`). |
| V7 — Error Handling, Logging | Met | Errors return structured JSON with a specific status code; no stack traces or internals leak to the client. |
| V10 — Malicious/Dead Code | Met | `lib/db-clone.ts` is the one intentional exception — a clearly-labeled, unimported duplication-scanner fixture (Phase 2), not reachable app code. |
| V14 — Configuration | Met | `.gitignore` keeps every generated report (lint, coverage, mutation, duplication) out of the repo; dependency versions are pinned in `package.json` + lockfile. |
| V1 — Architecture, Threat Modeling | Accepted gap | No formal threat model exists for a fixture this small; the attack surface is one API route over a JSON file, documented in the README instead of a separate model. |
| V4 — Access Control | Met | `GET`/`POST /api/items` require a valid session (`lib/require-session.ts`, checked via `next-auth/jwt`'s `getToken()`); unauthenticated requests get 401 and the store is never touched. Verified with real signed JWTs in tests and a live end-to-end smoke test (login → cookie → 200; no cookie → 401; wrong password → rejected). |
| V3 — Session Management | Met | NextAuth.js, JWT strategy, `httpOnly` session cookie. Single demo user (Credentials provider) — a real user store/sign-up flow is out of scope for a minimal CRUD fixture; see README.md's Auth section for how to override the demo credentials and secret. |
| Known-vulnerable dependencies | Partially met, one item still **Open** | Bumped `next@15.5.12` → `15.5.24` repo-wide per the repo owner's decision, fixing the 3 direct Next.js advisories (SSRF via rewrites, image-optimization DoS, internal Server Function disclosure). `npm audit` now reports 3 *different*, smaller findings (1 moderate, 2 high) against transitive `postcss`/`sharp` that `next@15.5.24` still pulls in — full resolution needs **Next.js 16**, a major version jump well beyond the approved patch bump, so that's a separate open decision, not folded into this one silently. |

## Deliberately accepted, not tracked as gaps

A few findings from the team's gap-analysis reports describe the *absence*
of a flaw, not a missing control — "fixing" them would mean introducing a
bug on purpose:

- **Data-flow "Not Covered" metrics** (Partial Uses Coverage, Multiple
  Definitions Handling, Unreachable Use Detection) — the fixture has no
  data-flow gap, redundant reassignment, or dead code for these detectors
  to find. Documented in the remediation plan's flagged decisions.
- **A few mutation-testing survivors** (documented in each phase's commit
  message) — file-encoding string literals with no observable effect on
  ASCII JSON content, and defensive `undefined`-guard branches (e.g.
  `issue?.code` in `lib/validate.ts`) that zod's own contract makes
  unreachable in practice.

## How this file is used

- CI (`.github/workflows/ci.yml`, `codeql.yml`, `semgrep.yml`) supplies
  the automated half of V5/V7/V10/V14 verification on every push.
- The remaining **Open** item — `postcss`/`sharp`'s transitive CVEs,
  which need Next.js 16 — is intentionally left for a future decision
  rather than a silent major-version jump.
