# Digital-Sippoy — DS-A6

**Architecture note:** Event-driven (variant) — this app represents one participant in a larger
event-driven system; the app itself is intentionally kept simple.

| | |
|---|---|
| Bundler | Webpack (default — no `--turbo` flag) |
| Package manager | npm |
| Router | App Router |
| Node.js | 20.x |
| React | 19.1.0 |
| Next.js | 15.5.12 |

## Fixture

Identical to DS-A1: `app/api/items/route.ts`, `app/page.tsx`, `app/items-form.tsx`, `lib/db.ts` + `data/items.json`.

## Run it

```bash
npm install
npm run build     # next build (webpack)
npm start          # or: npm run dev
```

## Build status

Built and verified locally with npm 10.8.2 on a portable Node.js 20.19.0 runtime.
`npm install` and `npm run build` (Webpack) both completed successfully — no incompatibilities found.
See the root `README.md` for the full 6-branch matrix.