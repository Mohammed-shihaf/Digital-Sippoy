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
| V4 — Access Control | **Open** | No authentication or authorization exists on `GET`/`POST /api/items` — see the remediation plan's flagged decision. This fixture is intentionally an open CRUD demo today; closing this requires an explicit choice (accept as-is / add an optional guard / implement real auth), not a silent code change. |
| V3 — Session Management | N/A | No sessions exist because there is no authentication (see V4). Revisit together if V4 changes. |
| Known-vulnerable dependencies | **Open** | `npm audit` currently reports 3 real high-severity advisories against the pinned `next@15.5.12` and its transitive `postcss`/`sharp`. The fix (`next@15.5.24`) changes the locked technology baseline shared by all 71 branches in this repo, so it's tracked here as an open decision rather than patched silently. CI's `audit` job (`.github/workflows/ci.yml`) reports this on every run without blocking merges until that decision is made. |

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
- The two **Open** rows above are the only unresolved items; they're
  intentionally left for the repo owner to decide rather than closed by
  an automated change.
