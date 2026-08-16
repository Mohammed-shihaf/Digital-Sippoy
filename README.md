# Digital-Sippoy — DS-A2

**Architecture note:** Full-stack (single Next.js app serving both the API route and the UI).

| | |
|---|---|
| Bundler | Webpack (default — no `--turbo` flag) |
| Package manager | yarn (Berry) |
| Router | App Router |
| Node.js | 20.x |
| React | 19.1.0 |
| Next.js | 15.5.12 |

## Fixture

Identical to DS-A1: `app/api/items/route.ts`, `app/page.tsx`, `app/items-form.tsx`, `lib/db.ts` + `data/items.json`.

## Run it

```bash
corepack enable            # or: npm i -g yarn (any Yarn 4.x works)
yarn install                # nodeLinker: node-modules (see .yarnrc.yml)
yarn build                  # next build (webpack)
yarn start                  # or: yarn dev
```

## Package-manager notes

Yarn Berry defaults to Plug'n'Play (PnP), which Next.js does not support out of the box.
`.yarnrc.yml` pins `nodeLinker: node-modules` so `node_modules` is laid out the classic way and
Next.js resolves normally. With that one setting, install and build both work with no other
changes to the DS-A1 fixture.

## Build status

Built and verified locally with Yarn 4.18.0 (via Corepack) on a portable Node.js 20.19.0 runtime.
`yarn install` and `yarn build` (Webpack) both completed successfully — no incompatibilities found.
See the root `README.md` for the full 6-branch matrix.