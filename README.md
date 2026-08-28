# Digital-Sippoy

Digital-Sippoy is a testbed reference repository used to validate the **Testable** code-scanning platform against a specific frontend/full-stack JavaScript tech stack. It is not a production product — every branch implements the same small real feature (a CRUD "items" list) so that the *only* variables between branches are the package manager, the bundler, the router, and an architecture-note label. Every branch has real, working dependencies and real, working code; nothing is stubbed out.

## Locked technology baseline (identical on every branch)

- **Runtime:** Node.js 20
- **Frontend framework:** React 19.1.0
- **Meta-framework:** Next.js 15.5.12

## Core fixture (identical feature on every branch)

A small "items" CRUD feature:

- `GET /api/items` and `POST /api/items` — an App Router Route Handler (`app/api/items/route.ts`) or a Pages Router API route (`pages/api/items.ts`), depending on the branch's router
- A JSON-file-backed store (`lib/db.ts` + `data/items.json`) — dependency-light, no database engine required
- One list page (App Router: `app/page.tsx` Server Component; Pages Router: `pages/index.tsx` via `getServerSideProps`)
- One create form (App Router: `app/items-form.tsx`; Pages Router: `components/items-form.tsx`), a Client Component that POSTs to the API route and refreshes the list

This same feature is reimplemented (functionally identical) on every branch. Only the bundler flag, package manager, router, lockfile, and architecture-note label differ.

## Branches

### Original six-branch set (`DS-A1`..`DS-A6`)

| Branch | Bundler | Package Manager | Router | Architecture note |
|---|---|---|---|---|
| `DS-A1` | Turbopack (`next dev --turbo` / `next build --turbo`) | npm | App Router | Full-stack |
| `DS-A2` | Webpack (default, no `--turbo`) | yarn (Berry) | App Router | Full-stack |
| `DS-A3` | Turbopack | pnpm | App Router | Microservices — this app represents one service in a larger system; the app itself is kept simple |
| `DS-A4` | Webpack | bun | App Router | Event-driven — this app represents one participant in a larger event-driven system; the app itself is kept simple |
| `DS-A5` | Turbopack | yarn (Berry) | App Router | Microservices (variant) |
| `DS-A6` | Webpack | npm | App Router | Event-driven (variant) |

### Full combination matrix (`DS-001`..`DS-064`)

`DS-A1`..`DS-A6` above were the original validation set. `DS-001` through `DS-048` extend the same repo to the cross-product of bundler (Turbopack / Webpack) x package manager (npm / yarn Berry / pnpm / bun) x router (App Router / Pages Router) x architecture-note label (Full-stack / Microservices / Event-driven) — 2 x 4 x 2 x 3 = 48 branches. `DS-049` through `DS-064` add a fourth architecture-note label, **Monolith**, across the same 16 bundler x package-manager x router combinations (2 x 4 x 2 = 16 branches), bringing the matrix to 64. Every branch in the matrix reuses the already-verified code+dependency tree of its bundler+package-manager+router sibling and only changes its own README's architecture-note label and `package.json` description — the "Monolith" branches are code-identical to their "Full-stack" siblings, distinguished purely by that label (single deployable unit with no internal service or module boundaries, as opposed to the Microservices/Event-driven "participant in a larger system" framing used elsewhere in this matrix).

| Branch | Bundler | Package Manager | Router | Architecture note |
|---|---|---|---|---|
| `DS-001` | Turbopack | npm | App Router | Full-stack |
| `DS-002` | Turbopack | npm | App Router | Microservices |
| `DS-003` | Turbopack | npm | App Router | Event-driven |
| `DS-004` | Turbopack | npm | Pages Router | Full-stack |
| `DS-005` | Turbopack | npm | Pages Router | Microservices |
| `DS-006` | Turbopack | npm | Pages Router | Event-driven |
| `DS-007` | Turbopack | yarn (Berry) | App Router | Full-stack |
| `DS-008` | Turbopack | yarn (Berry) | App Router | Microservices |
| `DS-009` | Turbopack | yarn (Berry) | App Router | Event-driven |
| `DS-010` | Turbopack | yarn (Berry) | Pages Router | Full-stack |
| `DS-011` | Turbopack | yarn (Berry) | Pages Router | Microservices |
| `DS-012` | Turbopack | yarn (Berry) | Pages Router | Event-driven |
| `DS-013` | Turbopack | pnpm | App Router | Full-stack |
| `DS-014` | Turbopack | pnpm | App Router | Microservices |
| `DS-015` | Turbopack | pnpm | App Router | Event-driven |
| `DS-016` | Turbopack | pnpm | Pages Router | Full-stack |
| `DS-017` | Turbopack | pnpm | Pages Router | Microservices |
| `DS-018` | Turbopack | pnpm | Pages Router | Event-driven |
| `DS-019` | Turbopack | bun | App Router | Full-stack |
| `DS-020` | Turbopack | bun | App Router | Microservices |
| `DS-021` | Turbopack | bun | App Router | Event-driven |
| `DS-022` | Turbopack | bun | Pages Router | Full-stack |
| `DS-023` | Turbopack | bun | Pages Router | Microservices |
| `DS-024` | Turbopack | bun | Pages Router | Event-driven |
| `DS-025` | Webpack | npm | App Router | Full-stack |
| `DS-026` | Webpack | npm | App Router | Microservices |
| `DS-027` | Webpack | npm | App Router | Event-driven |
| `DS-028` | Webpack | npm | Pages Router | Full-stack |
| `DS-029` | Webpack | npm | Pages Router | Microservices |
| `DS-030` | Webpack | npm | Pages Router | Event-driven |
| `DS-031` | Webpack | yarn (Berry) | App Router | Full-stack |
| `DS-032` | Webpack | yarn (Berry) | App Router | Microservices |
| `DS-033` | Webpack | yarn (Berry) | App Router | Event-driven |
| `DS-034` | Webpack | yarn (Berry) | Pages Router | Full-stack |
| `DS-035` | Webpack | yarn (Berry) | Pages Router | Microservices |
| `DS-036` | Webpack | yarn (Berry) | Pages Router | Event-driven |
| `DS-037` | Webpack | pnpm | App Router | Full-stack |
| `DS-038` | Webpack | pnpm | App Router | Microservices |
| `DS-039` | Webpack | pnpm | App Router | Event-driven |
| `DS-040` | Webpack | pnpm | Pages Router | Full-stack |
| `DS-041` | Webpack | pnpm | Pages Router | Microservices |
| `DS-042` | Webpack | pnpm | Pages Router | Event-driven |
| `DS-043` | Webpack | bun | App Router | Full-stack |
| `DS-044` | Webpack | bun | App Router | Microservices |
| `DS-045` | Webpack | bun | App Router | Event-driven |
| `DS-046` | Webpack | bun | Pages Router | Full-stack |
| `DS-047` | Webpack | bun | Pages Router | Microservices |
| `DS-048` | Webpack | bun | Pages Router | Event-driven |
| `DS-049` | Turbopack | npm | App Router | Monolith |
| `DS-050` | Turbopack | npm | Pages Router | Monolith |
| `DS-051` | Turbopack | yarn (Berry) | App Router | Monolith |
| `DS-052` | Turbopack | yarn (Berry) | Pages Router | Monolith |
| `DS-053` | Turbopack | pnpm | App Router | Monolith |
| `DS-054` | Turbopack | pnpm | Pages Router | Monolith |
| `DS-055` | Turbopack | bun | App Router | Monolith |
| `DS-056` | Turbopack | bun | Pages Router | Monolith |
| `DS-057` | Webpack | npm | App Router | Monolith |
| `DS-058` | Webpack | npm | Pages Router | Monolith |
| `DS-059` | Webpack | yarn (Berry) | App Router | Monolith |
| `DS-060` | Webpack | yarn (Berry) | Pages Router | Monolith |
| `DS-061` | Webpack | pnpm | App Router | Monolith |
| `DS-062` | Webpack | pnpm | Pages Router | Monolith |
| `DS-063` | Webpack | bun | App Router | Monolith |
| `DS-064` | Webpack | bun | Pages Router | Monolith |

Each branch's own `README.md` documents the exact install/build/run commands for that branch and notes any package-manager-specific quirks encountered while building it.

## Repo layout

```
Digital-Sippoy/
├── README.md                        <- this file (only present, in this form, on main)
├── app/ or pages/ + components/     <- Next.js pages + API route, per-branch, depending on router
├── lib/db.ts                        <- JSON-file-backed data store (per-branch)
├── data/items.json                  <- seed data (per-branch)
├── package.json                     <- deps + scripts (bundler flag / packageManager differ per branch)
└── <lockfile>                       <- package-lock.json / yarn.lock / pnpm-lock.yaml / bun.lock depending on branch
```

`main` holds only this README — the buildable application lives on each `DS-A*` and `DS-0*` branch. Check out the branch you need and read its own README for exact run commands and any caveats specific to that combination.

## Status

See each branch's README for the exact commands used to install and build it, and for an honest note on anything that did not build cleanly.
