# New SaaS Repo Setup (Post-Clone)

This checklist is for turning this project into a **new, independent repo** and shipping quickly.

Note: ShipFast docs sometimes mention daisyUI classes in component examples. This codebase is now standardized to Tailwind + shadcn/Radix.

## 0) Define project context for AI-first build flow

Before coding, fill:

- `AI_PROJECT_KICKOFF.md`

Use the prompt in that file to generate a build-ready plan directly in chat.

## 1) Disconnect from template repo

Run from project root.

### Recommended: use the bootstrap script (fresh history)

```bash
bash scripts/new-repo-fresh-history.sh --yes
```

This guarantees a brand-new git history with a single initial commit.

### One-command fresh history + new remote + push

```bash
bash scripts/new-repo-fresh-history.sh \
  --remote git@github.com:<your-user>/<your-new-repo>.git \
  --yes
```

### Legacy/manual alternative (not recommended)

```bash
rm -rf .git
git init -b main
git add .
git commit -m "chore: bootstrap new SaaS project from starter"
```

## 2) Create and connect your new GitHub repo

Create an empty private repo on GitHub, then connect:

```bash
git remote add origin git@github.com:<your-user>/<your-new-repo>.git
git push -u origin main
```

## 3) Rebrand core app config first

Update `/config.ts`:

- `appName`
- `appDescription`
- `domainName`
- `resend.fromNoReply`
- `resend.fromAdmin`
- `resend.supportEmail`
- `colors.main`
- `stripe.plans` (`name`, `description`, `price`, `priceId`, `features`)
- `auth.callbackUrl` (if not `/dashboard`)

## 4) Configure environment variables (`.env.local`)

Create `.env.local` and fill at least:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `SITE_URL`
- `MONGODB_URI`
- `GOOGLE_ID`
- `GOOGLE_SECRET`
- `RESEND_API_KEY`
- `STRIPE_PUBLIC_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Tip: use `.env.test` as a field reference only.

## 5) Stripe setup (local + prod)

1. Create products/prices in Stripe.
2. Copy `price_...` IDs into `/config.ts` (`stripe.plans`).
3. For local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

If your local app runs on a different port, change `3000` accordingly.

4. Copy signing secret into `STRIPE_WEBHOOK_SECRET`.
5. In production, create webhook endpoint:
   `https://<your-domain>/api/webhook/stripe`

Docs: [Payments](https://shipfa.st/docs/features/payments)

## 6) Auth setup (Google + NextAuth)

In Google Cloud OAuth config, add:

- JS Origins:
  - `http://localhost:3000`
  - `https://<your-domain>`
- Redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://<your-domain>/api/auth/callback/google`

Then set `GOOGLE_ID` + `GOOGLE_SECRET`.

Docs: [Google OAuth](https://shipfa.st/docs/features/google-oauth)

## 7) Database setup (MongoDB)

1. Create MongoDB Atlas project/cluster.
2. Set network access + DB user.
3. Put connection string in `MONGODB_URI`.

Docs: [Database](https://shipfa.st/docs/features/database)

## 8) Email setup (Resend)

1. Add and verify your sending domain/subdomain in Resend.
2. Create API key and set `RESEND_API_KEY`.
3. Ensure `/config.ts` sender emails match verified domain.

Docs: [Emails](https://shipfa.st/docs/features/emails)

## 9) Update legal + SEO content

Update:

- `/app/privacy-policy/page.tsx`
- `/app/tos/page.tsx`
- `/config.ts` SEO values (`appName`, `appDescription`, `domainName`)

Optional: customize structured data in `/libs/seo.tsx`.

Docs: [SEO](https://shipfa.st/docs/features/seo)

## 10) Verify before you start building features

```bash
npm install
npm run dev
npm run build
```

Manual checks:

- Sign in works (Google/email)
- Dashboard route protection works
- Stripe checkout starts
- Webhook updates user plan/access
- Sitemap generates during build

## 11) Deploy

On your host (Vercel/Render/etc):

1. Connect the new GitHub repo.
2. Add all env vars from `.env.local`.
3. Set `NEXTAUTH_URL` + `SITE_URL` to production domain.
4. Add Stripe production webhook endpoint.
5. Run first production payment test.

Docs: [ShipFast Docs](https://shipfa.st/docs)
