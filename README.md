# DigitalSippoy — FE TypeScript

**Stack:** TypeScript · Node 20.x · npm · Next.js 15.5.24 · React 19.1.0 · App Router · Turbopack

> Created from analysis of [`Digital-Sippoy/DS-002`](https://github.com/Mohammed-shihaf/Digital-Sippoy/tree/DS-002).
> Resolves the `UNRESOLVED shell version` error by pinning `node: "20.x"` in `engines` + `.nvmrc` + `setup-node@v4` in all CI jobs.

| | |
|---|---|
| Language | TypeScript `^5.6.0` |
| Node.js | **20.x** (`engines.node`, `.nvmrc`) |
| Package manager | **npm** |
| Bundler | **Turbopack** (`next dev --turbo`) |
| Router | App Router |
| React | 19.1.0 |
| Next.js | 15.5.24 |
| Auth | NextAuth.js (Credentials, JWT) |
| Validation | zod |

## Quick Start

```bash
npm install
npm run dev     # http://localhost:3000 (Turbopack)
```

Default credentials: `admin` / `changeme`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint (security + sonarjs + complexity) |
| `npm run lint:report` | ESLint JSON report → `lint-report.json` |
| `npm run lint:density` | Violation density → `violation-density-report.json` |
| `npm run dup` | jscpd duplication scan |
| `npm test` | Mocha unit tests |
| `npm run test:coverage` | nyc coverage (mocha) |
| `npm run test:coverage:gate` | nyc with thresholds (CI gate) |
| `npm run test:vitest` | Vitest (TypeScript tool column) |
| `npm run test:vitest:coverage` | Vitest + v8 coverage |
| `npm run mutation` | StrykerJS mutation testing |
| `npm run coverage:delta` | Coverage delta vs baseline |
| `npm run churn` | Code churn report |

## Coverage Thresholds

| Metric | Gate |
|---|---|
| Statements | ≥ 65% |
| Functions | ≥ 60% |
| Lines | ≥ 70% |
| Branches | ≥ 55% |

## Project Structure

```
app/                     # Next.js App Router
├── api/items/route.ts   # GET/POST (session-protected)
├── api/auth/[...nextauth]/route.ts
├── login/page.tsx
├── page.tsx             # Server Component (list)
├── items-form.tsx       # Client Component (create)
└── providers.tsx
lib/
├── db.ts                # Filesystem JSON store (sole FS access point)
├── validate.ts          # zod item name validation
├── auth.ts              # NextAuth config
├── require-session.ts   # Session guard (getToken)
├── coverage-fixtures.ts # Deliberate coverage fixture
└── lint-fixtures.ts     # Deliberate lint fixture
test/lib/                # Mocha tests
data/items.json          # Seed data
scripts/                 # Analysis scripts (.mjs)
.github/workflows/ci.yml # CI (all jobs pin node-version: "20.x")
.nvmrc                   # Node 20 version pin
```

## CI Pipeline

All GitHub Actions jobs use `actions/setup-node@v4` with `node-version: "20.x"` — this resolves the `state=UNRESOLVED` shell version error.

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "20.x"
    cache: "npm"
```

Jobs: **Lint** · **Vitest Coverage** · **jscpd Duplication** · **nyc/Mocha Coverage** · **Code Churn** · **StrykerJS Mutation** · **Build**
