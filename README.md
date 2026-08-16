# Digital-Sippoy — DS-A1

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

## Run it

```bash
npm install
npm run build     # next build --turbo
npm start         # or: npm run dev  (next dev --turbo)
```

## Build status

Built and verified locally with npm 10.8.2 on a portable Node.js 20.19.0 runtime.
`npm install` and `npm run build` (Turbopack) both completed successfully.
See the root `README.md` for the full 6-branch matrix.