# Digital-Sippoy

Digital-Sippoy is a testbed reference repository used to validate the **Testable** code-scanning platform against a specific frontend/full-stack JavaScript tech stack. It is not a production product — every branch implements the same small real feature (a CRUD "items" list) so that the *only* variables between branches are the package manager and the bundler. Every branch has real, working dependencies and real, working code; nothing is stubbed out.

## Locked technology baseline (identical on every branch)

- **Runtime:** Node.js 20
- **Frontend framework:** React 19.1.0
- **Meta-framework:** Next.js 15.5.12
- **Router:** App Router (Next.js `app/` directory) on every branch

Pages Router was considered early on but App Router was locked in as the actual build target, since these exact Next.js/React versions are designed around it. All 6 branches below use App Router.

## Core fixture (identical feature on every branch)

A small "items" CRUD feature:

- `GET /api/items` and `POST /api/items` — a Next.js App Router Route Handler
- A JSON-file-backed store (`lib/db.ts` + `data/items.json`) — dependency-light, no database engine required
- One list page (`app/page.tsx`, a Server Component that reads the store directly)
- One create form (`app/items-form.tsx`, a Client Component that POSTs to the API route and refreshes the list)

This same feature is reimplemented (really: copied byte-for-byte) on every branch. Only the bundler flag, package manager, and lockfile differ.

## Branches

| Branch | Bundler | Package Manager | Router | Architecture note |
|---|---|---|---|---|
| `DS-A1` | Turbopack (`next dev --turbo` / `next build --turbo`) | npm | App Router | Full-stack |
| `DS-A2` | Webpack (default, no `--turbo`) | yarn (Berry) | App Router | Full-stack |
| `DS-A3` | Turbopack | pnpm | App Router | Microservices — this app represents one service in a larger system; the app itself is kept simple |
| `DS-A4` | Webpack | bun | App Router | Event-driven — this app represents one participant in a larger event-driven system; the app itself is kept simple |
| `DS-A5` | Turbopack | yarn (Berry) | App Router | Microservices (variant) |
| `DS-A6` | Webpack | npm | App Router | Event-driven (variant) |

Each branch's own `README.md` documents the exact install/build/run commands for that branch and notes any package-manager-specific quirks encountered while building it.

## Repo layout

```
Digital-Sippoy/
├── README.md            <- this file (only present, in this form, on main)
├── app/                  <- Next.js App Router pages + API route (per-branch)
├── lib/db.ts             <- JSON-file-backed data store (per-branch)
├── data/items.json       <- seed data (per-branch)
├── package.json          <- deps + scripts (bundler flag / packageManager differ per branch)
└── <lockfile>             <- package-lock.json / yarn.lock / pnpm-lock.yaml / bun.lock depending on branch
```

`main` holds only this README — the buildable application lives on each `DS-A*` branch, branched from `DS-A1` (the first branch built).

## Status

See each branch's README for the exact commands used to install and build it, and for an honest note on anything that did not build cleanly.
