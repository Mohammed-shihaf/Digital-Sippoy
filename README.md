# Digital-Sippoy — DS-007

**Architecture note:** Full-stack (single Next.js app serving both the API route and the UI).

| | |
|---|---|
| Bundler | Turbopack (`next dev --turbo` / `next build --turbo`) |
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

**Build did NOT succeed.** Command `yarn install" exited non-zero.

Tail of log:
```
➤ YN0000: · Yarn 4.18.0 ➤ YN0000: ┌ Resolution step ➤ YN0085: │ + @types/node@npm:20.19.43, @types/react-dom@npm:19.2.4, @types/react@npm:19.2.18, next@npm:15.5.12, react-dom@npm:19.1.0, react@npm:19.1.0, and 52 more. ➤ YN0000: └ Completed in 0s 791ms ➤ YN0000: ┌ Fetch step ➤ YN0000: └ Completed in 0s 524ms ➤ YN0000: ┌ Link step ➤ YN0001: │ Error: While persisting /C:/Users/moham/AppData/Local/Yarn/Berry/cache/next-npm-15.5.12-df7bf2a12d-10c0.zip/node_modules/next/
```

This branch is committed as-is (attempted config, honest failure) per the DS-A* spec: a documented failure is preferred over a faked pass.
