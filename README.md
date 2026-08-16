# Digital-Sippoy — DS-001

**Architecture note:** Full-stack (single Next.js app serving both the API route and the UI).

| | |
|---|---|
| Bundler | Turbopack (`next dev --turbo` / `next build --turbo`) |
| Package manager | npm |
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

Builds successfully with `npm` + Turbopack on Node.js 20.x.
