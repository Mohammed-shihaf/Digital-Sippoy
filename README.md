# Digital-Sippoy — DS-A4

**Architecture note:** Event-driven — this app represents one participant in a larger
event-driven system (e.g. it would react to and emit domain events elsewhere in the platform);
the app itself is intentionally kept simple.

| | |
|---|---|
| Bundler | Webpack (default — no `--turbo` flag) |
| Package manager | bun |
| Router | App Router |
| Node.js | 20.x |
| React | 19.1.0 |
| Next.js | 15.5.12 |

## Fixture

Identical to DS-A1: `app/api/items/route.ts`, `app/page.tsx`, `app/items-form.tsx`, `lib/db.ts` + `data/items.json`.

## Run it

```bash
curl -fsSL https://bun.sh/install | bash   # or the Windows PowerShell installer
bun install
bun run build     # next build (webpack)
bun run start      # or: bun run dev
```

## Package-manager notes

`bun install` and `next build` (webpack) both work with no source changes. Bun's install produced
`bun.lock` (the text lockfile format bun 1.1+ uses by default). One caveat worth flagging honestly:
Bun installs Next.js's own `node_modules/.bin` shims correctly, but `next dev`'s server runtime is
Node.js-based (not Bun's own JS runtime) — `next build`/`next start` here run under Node.js 20 as
invoked by the `next` CLI, same as every other branch. Bun is only acting as package manager +
script runner here (`bun run <script>`), not replacing the Next.js server runtime, which matches
what the task calls for.

## Build status

Built and verified locally with Bun 1.3.14 on a portable Node.js 20.19.0 runtime.
`bun install` and `bun run build` (Webpack) both completed successfully.
See the root `README.md` for the full 6-branch matrix.