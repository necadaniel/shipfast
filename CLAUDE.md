# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js 16 SaaS starter — auth, Stripe billing, transactional email, a
protected dashboard and a shadcn/ui component library. It is **cloned as the
starting point for new products**, so everything here stays generic; no
product-specific business logic belongs in this repo.

`scripts/new-repo-fresh-history.sh` (and the `.ps1` twin) re-inits git with a
single commit — that's step 1 of starting a new project from this template.

## Commands

```bash
npm run dev           # Turbopack dev server
npm run build         # production build (Turbopack) + sitemap via postbuild
npm run lint
npm run typecheck
npm run format        # prettier --write . (prettier-plugin-tailwindcss sorts classes)
```

There is no test framework wired up.

Dev and build both run on Turbopack. Historical note: on Next 16.1.6 `next build`
panicked with `Dependency tracking is disabled so invalidation is not allowed`,
so `build` was pinned to `--webpack`. Fixed in 16.3.2; the pin has been removed.

**Two dependencies are deliberately held back from `latest`** — see
"Version constraints" below before running `npm update`.

CI (`.github/workflows/ci.yml`) runs lint → typecheck → build **with no secrets**.

## Architecture

### `config.ts` is the single source of truth

App name, description, domain, Stripe plans, sender emails, brand color, auth
URLs. Typed by `types/config.ts`. Change this first in a new project — the
landing page, SEO tags, emails and OG image all read from it.

It is imported by **client** components, so anything secret must not live here.
Stripe price IDs come from `NEXT_PUBLIC_STRIPE_PRICE_*` for that reason (price
IDs aren't secret and already ship in the client bundle).

### Billing: plan is derived, never stored

The Stripe webhook (`app/api/webhook/stripe/route.ts`) writes only
`customerId`, `priceId` and `hasAccess` to the user. **There is deliberately no
`plan` column** — a duplicated field drifts out of sync with Stripe. Use
`getUserPlan(user)` / `getPlanByPriceId()` / `hasPlan()` from `libs/plans.ts`.

`hasAccess` is the single boolean gate for paid features:

| Event | Effect |
|---|---|
| `checkout.session.completed` | grant access, store `priceId` + `customerId` |
| `invoice.paid` | keep access (only if `priceId` still matches) |
| `customer.subscription.deleted` | revoke access |

Checkout **mode** (`"payment"` vs `"subscription"`) is read server-side from
`config.stripe.plans`, not accepted from the client, so a caller can't turn a
subscription price into a one-time payment.

Stripe returns `customer` as either a bare ID string *or* an expanded object
depending on the event. The webhook's `toId()` helper normalises this before
querying Supabase — querying with the raw value silently matches nothing.

### Supabase is the database

The database is Supabase (Postgres). `getSupabase()` in `libs/supabase.ts`
creates one server-side client with the service role key, lazily, so importing
the module never throws. The app still boots when `NEXT_PUBLIC_SUPABASE_URL` or
`SUPABASE_SERVICE_ROLE_KEY` is unset.

Auth.js (`@auth/supabase-adapter`) stores users, OAuth accounts, sessions, and
magic-link tokens in the **`next_auth` schema**. That schema name is hardcoded
by the adapter. Billing columns (`customerId`, `priceId`, `hasAccess`) are extra
columns on `next_auth.users`, queried through `libs/users.ts`. Waitlist emails
are `public.leads`, queried through `libs/leads.ts`.

Two setup steps are easy to miss, and sign-in fails without both:

1. Run `supabase/migrations/20260926120000_init.sql` in the Supabase SQL editor.
2. Project Settings → Data API → Exposed schemas → add `next_auth`.

Row level security is enabled with no policies for the anon key. All access goes
through the service role, which bypasses RLS. `libs/supabase.ts` imports
`server-only` so a client component cannot pull that key into the browser bundle.
Never put the service role key in `config.ts` or behind `NEXT_PUBLIC_`.

New tables belong in a new file under `supabase/migrations/` and in
`types/database.ts`. PostgREST rejects writes to columns that aren't in the
schema.

### Versioning

`version.json` at the repo root is the source of truth — **never hand-edit it**,
and don't bump `package.json` directly. `scripts/release.mjs` (`npm run release`,
zero dependencies) owns all four files that carry the version: `version.json`,
`package.json`, `package-lock.json` and `CHANGELOG.md`.

Read the version through `libs/version.ts`, not from `package.json` — importing
package.json into a client component would pull the whole manifest into the
bundle. `libs/version.ts` exports `version`, `build`, `commit`, `displayVersion`,
`fullVersion` and `detailedVersion`; `<VersionBadge />` renders them and
`GET /api/version` serves the raw JSON.

Changelog entries are grouped by an `added:` / `changed:` / `fixed:` / `removed:`
prefix on each `-m` message; unprefixed entries fall under "Changed".

### `lib/` vs `libs/`

`lib/utils.ts` holds `cn()` only, because shadcn's CLI writes to `@/lib/utils`.
`libs/` holds the integrations. **Don't merge these directories** or
`npx shadcn add` breaks.

### Graceful degradation is a hard contract

Every integration is optional at build *and* boot time. A fresh clone with no
`.env.local` must run:

- auth providers are pushed into the array conditionally on their env vars
- `getStripe()` / `getResend()` construct lazily and throw a readable error at
  call time, never at import time
- `resolveSecret()` in `libs/next-auth.ts` falls back to a dev-only constant when
  `AUTH_SECRET` is missing — but returns `undefined` in production so it fails
  loudly rather than signing sessions with a public value

Breaking this shows up as CI failing (it builds with no secrets) or as every
page 500ing on a fresh clone.

## Styling

Tailwind v4 + shadcn/ui (new-york, neutral base). `app/globals.css` owns the
tokens. Three lines there are load-bearing and silently break things if removed:

- `@custom-variant dark (&:is(.dark *));` — makes `dark:` utilities follow the
  `.dark` class from next-themes. Without it they compile to
  `@media (prefers-color-scheme: dark)` and the theme toggle stops affecting them.
- `@plugin "@toolwind/corner-shape";` — registers `corner-squircle`, used across
  `components/ui/`. Without it every one of those classes is a no-op.
- the `@layer base` block setting `body { @apply bg-background text-foreground }`
  — without it nothing consumes the theme variables at page level and dark mode
  leaves the page white.

Use semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`)
so both themes work for free.

## Conventions

- Server components by default; `"use client"` only for state, effects or
  browser APIs.
- Validate every API route body with Zod (v4: `z.url()`, `z.email()`,
  `z.prettifyError()`). Return `{ error: string }` with a real status code, and
  **log** exceptions rather than echoing them to the client.
- Call your own API from the browser through `libs/api.ts` — it unwraps JSON,
  toasts errors and redirects on 401.
- TypeScript is strict. Don't reach for `any` to silence an error. User and lead
  rows are typed in `types/database.ts` (`User`, `Lead`) and the lint config
  forbids `any`.
- `components/` — landing sections and buttons (PascalCase).
  `components/ui/` — shadcn primitives (kebab-case); regenerate with the CLI
  rather than hand-editing.

## Gotchas

- **Converted from daisyUI to shadcn.** If you copy code from ShipFast docs or
  older components, strip daisyUI classes (`btn`, `card-body`, `base-100`,
  `text-error`…) — they render completely unstyled here.
- **Unknown columns are rejected**, not dropped. Add the column in a migration
  and in `types/database.ts` before writing it. A `plan` column is still
  deliberately absent — derive the plan from `priceId`.
- User ids are UUIDs from Auth.js. `session.user.id` matches `next_auth.users.id`.
- `types/next-auth.d.ts` augments `Session` with `user.id`; that value is
  populated by the `jwt`/`session` callbacks in `libs/next-auth.ts`.
- The social preview card is generated by `app/opengraph-image.tsx` via
  `next/og` from `config.ts`. To use a static image instead, delete that file and
  drop in `app/opengraph-image.png` (1200x630).
- `app/icon.png` is both the favicon and the header/footer logo (imported as a
  static asset), so it needs to work at 24px.
- New remote image hosts must be whitelisted in `next.config.js` `remotePatterns`.

`AGENTS.md` carries a condensed version of these rules for other coding agents —
keep the two in sync when the rules change.

## Version constraints

Two packages are intentionally *not* on their latest version. Bumping them
breaks the build; check whether upstream has caught up before trying again.

- **`typescript` is pinned to `~6.0.3`, not 7.x.** `typescript-eslint` (via
  `eslint-config-next`) declares `typescript >=4.8.4 <6.1.0` and hard-throws
  "typescript-eslint does not support TS 7.0" at lint time. `tsc` and `next
  build` are both fine on TS 7 — only linting breaks. The `~` keeps us inside
  6.0.x.
- **`eslint` stays on 9.x, not 10.** `eslint-config-next@16.3.2` bundles an
  `eslint-plugin-react` that still calls the `context.getFilename()` API removed
  in ESLint 10, so every lint run dies with
  `contextOrFilename.getFilename is not a function`.

`next-auth` is also worth care: `npm outdated` reports "latest" as **4.24.15**
because v5 is still published under a beta tag. Track `5.0.0-beta.*`; taking
"latest" would silently downgrade to the v4 API.
