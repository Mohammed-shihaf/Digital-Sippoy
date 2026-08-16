# Digital-Sippoy — DS-033

**Architecture note:** Event-driven — this app represents one participant in a larger event-driven system (e.g. it would react to and emit domain events elsewhere in the platform); the app itself is intentionally kept simple.

| | |
|---|---|
| Bundler | Webpack (default — no `--turbo` flag) |
| Package manager | yarn |
| Router | App Router |
| Node.js | 20.x |
| React | 19.1.0 |
| Next.js | 15.5.12 |

## Fixture

- `GET /api/items`, `POST /api/items` — `app/api/items/route.ts`
- List page — `app/page.tsx` (Server Component)
- Create form — `app/items-form.tsx` (Client Component)
- Store — `lib/db.ts` reading/writing `data/items.json`

## Build status

Builds successfully with `yarn` + Webpack on Node.js 20.x.
