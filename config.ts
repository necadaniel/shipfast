import { ConfigProps } from "./types/config";

const config = {
  // REQUIRED
  appName: "ChangeMe",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten per page)
  appDescription:
    "The Next.js starter with auth, payments and a production-grade UI. Ship your startup in days, not weeks.",
  // REQUIRED: no https://, no trailing slash — just the naked domain
  domainName: "changeme.com",

  crisp: {
    // Crisp website ID. If you don't use Crisp, leave this empty and set resend.supportEmail below,
    // otherwise customer support won't work.
    id: "",
    // Crisp is hidden by default except on the routes listed here. Toggle it with <ButtonSupport />.
    // Remove this key to show Crisp everywhere.
    onlyShowOnRoutes: ["/"],
  },

  stripe: {
    // Create your products/prices in the Stripe dashboard, then paste the price IDs here.
    // `mode` must match the Stripe price type: "payment" for one-time, "subscription" for recurring.
    plans: [
      {
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER ?? "",
        name: "Starter",
        description: "Perfect for small projects",
        price: 99,
        priceAnchor: 149,
        mode: "payment",
        features: [
          { name: "NextJS boilerplate" },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
        ],
      },
      {
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ADVANCED ?? "",
        name: "Advanced",
        description: "You need more power",
        price: 149,
        priceAnchor: 299,
        mode: "payment",
        isFeatured: true,
        features: [
          { name: "NextJS boilerplate" },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
          { name: "1 year of updates" },
          { name: "24/7 support" },
        ],
      },
    ],
  },

  resend: {
    // REQUIRED — 'From' field for magic login links. The domain must be verified in Resend.
    fromNoReply: `ChangeMe <noreply@resend.changeme.com>`,
    // REQUIRED — 'From' field for every other email (receipts, updates, etc.)
    fromAdmin: `Daniel at ChangeMe <daniel@resend.changeme.com>`,
    // Shown to customers who need help. Leave empty only if you set up Crisp above.
    supportEmail: "you@example.com",
  },

  colors: {
    // REQUIRED — used outside the document (loading bar, Chrome tab color, etc.)
    // Must be a HEX value. Keep it in sync with --primary in app/globals.css.
    main: "#2b7fff",
  },

  auth: {
    // REQUIRED — where to send users to log in. Used to protect private routes
    // and by libs/api.ts on 401 responses.
    loginUrl: "/api/auth/signin",
    // REQUIRED — where to send users after a successful login.
    callbackUrl: "/dashboard",
  },
} satisfies ConfigProps;

export default config;
