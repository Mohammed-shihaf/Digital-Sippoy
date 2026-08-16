# Digital-Sippoy — DS-040

**Architecture note:** Full-stack (single Next.js app serving both the API route and the UI).

| | |
|---|---|
| Bundler | Webpack (default — no `--turbo` flag) |
| Package manager | pnpm |
| Router | Pages Router |
| Node.js | 20.x |
| React | 19.1.0 |
| Next.js | 15.5.12 |

## Fixture

- `GET /api/items`, `POST /api/items` — `pages/api/items.ts`
- List page — `pages/index.tsx` (`getServerSideProps`)
- Create form — `components/items-form.tsx` (Client Component, `useRouter`)
- Store — `lib/db.ts` reading/writing `data/items.json`

## Build status

Builds successfully with `pnpm` + Webpack on Node.js 20.x.
