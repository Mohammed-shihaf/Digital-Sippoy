# Digital-Sippoy — DS-A5

**Architecture note:** Microservices (variant) — this app represents one service in a larger
system; the app itself is intentionally kept simple.

| | |
|---|---|
| Bundler | Turbopack (`next dev --turbo` / `next build --turbo`) |
| Package manager | yarn (Berry) |
| Router | App Router |
| Node.js | 20.x |
| React | 19.1.0 |
| Next.js | 15.5.12 |

## Fixture

Identical to DS-A1: `app/api/items/route.ts`, `app/page.tsx`, `app/items-form.tsx`, `lib/db.ts` + `data/items.json`.

## Run it

```bash
corepack enable
yarn install                # nodeLinker: node-modules (see .yarnrc.yml)
yarn build                  # next build --turbo
yarn start                  # or: yarn dev
```

## Package-manager notes

Same as DS-A2: `.yarnrc.yml` pins `nodeLinker: node-modules` since Next.js does not support Yarn's
default PnP mode out of the box. With that set, Turbopack works fine under Yarn Berry.

## Build status

Built and verified locally with Yarn 4.18.0 (via Corepack) on a portable Node.js 20.19.0 runtime.
`yarn install` and `yarn build` (Turbopack) both completed successfully.
See the root `README.md` for the full 6-branch matrix.