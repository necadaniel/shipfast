# SaaS Starter

A Next.js starter with authentication, Stripe billing, transactional email and a
shadcn/ui component library already wired together — so a new product starts at
"build the feature" instead of "set up the plumbing".

Originally based on [ShipFast](https://shipfa.st), converted from daisyUI to
Tailwind v4 + shadcn/ui.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind v4, shadcn/ui, Radix, next-themes |
| Auth | NextAuth v5 — Google OAuth + email magic links |
| Database | MongoDB + Mongoose |
| Payments | Stripe Checkout, Customer Portal, webhooks |
| Email | Resend |
| Validation | Zod v4 |

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev
```

The app boots with **no environment variables at all** — every integration is
optional and degrades gracefully, so you can start on the UI immediately and add
services as you need them.

## Scripts

| Command | |
|---|---|
| `npm run dev` | Turbopack dev server |
| `npm run build` | production build (+ sitemap via `postbuild`) |
| `npm run start` | serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier, with Tailwind class sorting |

Both dev and build run on Turbopack. (Builds were pinned to `--webpack` on Next
16.1.6, which panicked; that was fixed by 16.3.2 and the flag is gone.)

## Starting a new project

1. **Fresh git history**

   ```bash
   bash scripts/new-repo-fresh-history.sh --remote git@github.com:you/your-repo.git --yes
   ```

   Windows: `scripts/new-repo-fresh-history.ps1`. Until you run this, the
   template's full history is still in the repo.

2. **Rebrand** — edit `config.ts`: `appName`, `appDescription`, `domainName`,
   `resend.*`, `colors.main`, `auth.callbackUrl`, and the `stripe.plans` entries.
   Everything else reads from this file, including the social preview card.

3. **Environment** — copy `.env.example` to `.env.local`. `AUTH_SECRET`
   (`openssl rand -base64 32`) and `MONGODB_URI` are enough to get sign-in
   working.

4. **Auth** — in Google Cloud, add the redirect URI
   `http://localhost:3000/api/auth/callback/google` plus your production domain.
   Magic links additionally need `RESEND_API_KEY` and a verified sending domain.

5. **Stripe** — create your prices, put the IDs in `NEXT_PUBLIC_STRIPE_PRICE_*`,
   and set each plan's `mode` in `config.ts` (`"payment"` for one-time,
   `"subscription"` for recurring). For local webhooks:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```

   In production, add `https://<your-domain>/api/webhook/stripe` as an endpoint.

6. **Legal** — `app/tos/page.tsx` and `app/privacy-policy/page.tsx` are
   placeholders containing prompts to generate a draft. Replace them, and have a
   lawyer review, before launching.

7. **Icons** — replace `app/icon.png` (used as the favicon *and* as the logo in
   the header and footer, so it must work at 24px) and `app/apple-icon.png`.

   The social preview card is generated from `config.ts` by
   `app/opengraph-image.tsx`, so it rebrands itself — nothing to redesign. Want a
   hand-made one? Delete that file and drop in `app/opengraph-image.png` at
   1200x630.

## Versioning

`version.json` is the source of truth. `npm run release` bumps it, increments the
build number, records what changed, and keeps `package.json` and the lockfile in
sync — no dependencies, just Node.

```bash
npm run release                  # interactive: pick a bump, type the changes
npm run release -- patch         # bump, then prompt for changes
npm run release -- minor -m "added: dark mode" -m "fixed: webhook crash"
npm run release -- 2.0.0         # set an exact version
npm run release -- patch --commit  # also git commit + tag
```

Prefix an entry with `added:`, `changed:`, `fixed:` or `removed:` to group it in
`CHANGELOG.md`. Anything unprefixed lands under "Changed".

Display it anywhere:

```tsx
import VersionBadge from "@/components/VersionBadge";

<VersionBadge />                  // v0.2.0
<VersionBadge detail="build" />   // v0.2.0+1
<VersionBadge detail="full" />    // v0.2.0+1 (a1b2c3d)
```

Or import the values directly from `libs/version.ts` (`version`, `build`,
`commit`, `fullVersion`, `detailedVersion`). It ships in the footer and the
dashboard header already, and `GET /api/version` returns the same JSON — useful
for confirming what's actually deployed.

## Layout

```
app/
  api/
    auth/[...nextauth]/   NextAuth handlers
    lead/                 Waitlist email capture (<ButtonLead />)
    stripe/               Checkout + Customer Portal
    user/plan/            Current access state
    webhook/stripe/       Grants and revokes access
  dashboard/              Protected area (server-side auth gate)
  opengraph-image.tsx     Social card, generated from config.ts
components/               Landing sections and buttons
components/ui/            shadcn primitives — regenerate with the CLI
libs/                     Integrations: auth, stripe, resend, mongo, seo, plans, api
lib/utils.ts              cn() — kept separate for shadcn's CLI
models/                   Mongoose schemas
config.ts                 Single source of truth for app metadata + plans
```

## How billing works

The Stripe webhook stores `customerId`, `priceId` and `hasAccess` on the user. A
user's plan is *derived* from `priceId` via `libs/plans.ts` rather than stored
separately, so it can never drift out of sync with Stripe.

- `checkout.session.completed` → grant access
- `invoice.paid` → keep access (recurring payments)
- `customer.subscription.deleted` → revoke access

Gate features on `user.hasAccess`, and use `getUserPlan(user)` when you need to
know which tier someone is on.

## Notes

- Agent instructions live in `CLAUDE.md` (Claude Code) and `AGENTS.md` (other
  coding agents).
- `AI_PROJECT_KICKOFF.md` is a fill-in brief plus a prompt for turning a product
  idea into an implementation plan against this codebase.
- CI (`.github/workflows/ci.yml`) runs lint, typecheck and build on every push
  and PR, with no secrets configured.
