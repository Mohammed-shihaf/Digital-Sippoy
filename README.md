# Digital-Sippoy — DS-002

**Architecture note:** Microservices — this app represents one service in a larger system, so the app itself is intentionally kept simple (a single "items" resource, no cross-service orchestration implemented in this fixture).

| | |
|---|---|
| Bundler | Turbopack (`next dev --turbo` / `next build --turbo`) |
| Package manager | npm |
| Router | App Router |
| Node.js | 20.x |
| React | 19.1.0 |
| Next.js | 15.5.12 |

## Fixture

- `GET /api/items`, `POST /api/items` — `app/api/items/route.ts`, session-protected (401 without a valid login)
- List page — `app/page.tsx` (Server Component, redirects to `/login` if unauthenticated)
- Create form — `app/items-form.tsx` (Client Component)
- Store — `lib/db.ts` reading/writing `data/items.json`
- Validation — `lib/validate.ts` (zod: required, non-empty, 200-char max)

## Auth

Real session auth via NextAuth.js (Credentials provider, JWT sessions), added as Phase 6 of the
[quality remediation plan](https://github.com/Mohammed-shihaf/Digital-Sippoy) after this fixture's
API was flagged as intentionally open with no authentication.

- Sign in at `/login`. Default demo credentials: `admin` / `changeme` (override via `DEMO_USERNAME`
  / `DEMO_PASSWORD` env vars).
- Set `NEXTAUTH_SECRET` in any real deployment — a documented, insecure-by-design default is used
  otherwise so the fixture keeps building and running out of the box, matching every other branch
  in this repo.
- `lib/require-session.ts` checks the session via `next-auth/jwt`'s `getToken()` rather than
  `getServerSession()`, so the API route handlers stay directly callable from tests the same way
  Phase 3 already called them.

See [COMPLIANCE.md](COMPLIANCE.md) for the full security/compliance mapping.

## Quality tooling (remediation plan Phases 1–6)

- **Lint** — `npm run lint` (ESLint flat config, `eslint-plugin-security`, a project rule barring
  filesystem access outside `lib/db.ts`)
- **Duplication** — `npm run dup` (jscpd; `lib/db-clone.ts` is the one deliberate exception, a
  labeled, unimported fixture for the scanner to detect)
- **Tests** — `npm test` (mocha + ts-node, 31 tests) / `npm run test:coverage` (nyc,
  `nyc-mocha/coverage-summary.json`) / `npm run test:coverage:gate` (CI threshold gate)
- **Mutation testing** — `npm run mutation` (StrykerJS, nightly in CI — see
  `.github/workflows/mutation.yml`)
- **CI** — `.github/workflows/ci.yml`, `codeql.yml`, `semgrep.yml`; `.github/dependabot.yml`

## Build status

Builds successfully with `npm` + Turbopack on Node.js 20.x.
