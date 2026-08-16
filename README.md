# Digital-Sippoy — DS-A3

**Architecture note:** Microservices — this app represents one service in a larger system, so the
app itself is intentionally kept simple (a single "items" resource, no cross-service orchestration
implemented in this fixture).

| | |
|---|---|
| Bundler | Turbopack (`next dev --turbo` / `next build --turbo`) |
| Package manager | pnpm |
| Router | App Router |
| Node.js | 20.x |
| React | 19.1.0 |
| Next.js | 15.5.12 |

## Fixture

Identical to DS-A1: `app/api/items/route.ts`, `app/page.tsx`, `app/items-form.tsx`, `lib/db.ts` + `data/items.json`.

## Run it

```bash
npm i -g pnpm       # or use corepack
pnpm install
pnpm run build       # next build --turbo
pnpm start            # or: pnpm dev
```

## Package-manager notes

pnpm's default (hard-linked, content-addressable `node_modules`) works with Next.js/Turbopack with
no extra configuration. `sharp`'s postinstall build script is ignored by pnpm's default script
policy; this is harmless here since the fixture doesn't use `next/image` optimization that would
need it.

## Build status

Built and verified locally with pnpm 10.24.0 on a portable Node.js 20.19.0 runtime.
`pnpm install` and `pnpm run build` (Turbopack) both completed successfully.
See the root `README.md` for the full 6-branch matrix.