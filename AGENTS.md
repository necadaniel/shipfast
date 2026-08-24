# AGENTS.md

Shared instructions for coding agents (Cursor, Copilot, Codex, Zed…).
Claude Code reads `CLAUDE.md`, which contains the same guidance in more detail.

## Project

A Next.js 16 SaaS starter — auth, Stripe billing, email, protected dashboard,
shadcn/ui. It gets cloned per product, so keep everything here generic.

## Commands

- `npm run dev` — Turbopack dev server
- `npm run build` — production build (Turbopack)
- `npm run lint` / `npm run typecheck` / `npm run format`

## Rules

- TypeScript is strict. Don't add `any` to silence an error.
- Server components by default; `"use client"` only for state/effects/browser APIs.
- Validate API route bodies with Zod. Return `{ error }` plus a real status code,
  and log exceptions instead of returning them.
- Call your own API from the browser via `libs/api.ts`.
- `config.ts` is the single source of truth for app metadata and Stripe plans.
  It reaches the client bundle — never put secrets in it.
- A user's plan derives from `user.priceId` via `libs/plans.ts`. Don't add a
  `plan` column.
- Missing env vars must degrade gracefully, never break the build. CI builds
  with no secrets.
- This repo uses Tailwind v4 + shadcn, **not daisyUI**. Classes like `btn`,
  `base-100` or `text-error` render unstyled — use semantic tokens instead.
- `lib/utils.ts` (shadcn's `cn`) and `libs/` (integrations) are intentionally
  separate directories. Don't merge them.
- Versions: never hand-edit `version.json` or bump `package.json`. Run
  `npm run release`. Read the version from `libs/version.ts`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Version constraints

Don't blindly `npm update` these — each breaks the build:

- `typescript` pinned `~6.0.3`: typescript-eslint hard-rejects TS 7.
- `eslint` stays 9.x: eslint-config-next bundles a plugin incompatible with ESLint 10.
- `mongodb` stays `^6`: `@auth/mongodb-adapter` peer-requires it.
- `next-auth`: "latest" on npm is v4; this project tracks `5.0.0-beta.*`.
