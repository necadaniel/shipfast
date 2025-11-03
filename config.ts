import { ConfigProps } from "./types/config";

// Theme colors from globals.css
const themes = {
  light: {
    primary: "oklch(0.205 0 0)", // --primary from globals.css
  }
};

const config = {
  // REQUIRED
  appName: "EnvSync",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Securely sync your environment variables across all devices with end-to-end encryption. Never share secrets through Slack or email again.",
  // REQUIRED (no https://, not trailing slash at the end, just the naked domain)
  domainName: "envsync.app",
  // Plan limits
  plans: {
    free: {
      maxProjects: 5,
      maxDevices: 1,
      maxVariablesPerProject: 50,
      features: ["Basic encryption", "Web access", "Version history (7 days)"],
    },
    solo: {
      maxProjects: 30,
      maxDevices: 3,
      maxVariablesPerProject: 200,
      features: [
        "End-to-end encryption",
        "Real-time sync",
        "CLI & Web access",
        "Version history (30 days)",
      ],
    },
    team: {
      maxProjects: -1, // unlimited
      maxDevices: -1, // unlimited
      maxVariablesPerProject: -1, // unlimited
      features: [
        "Everything in Solo",
        "Team collaboration",
        "Role-based permissions",
        "Unlimited version history",
        "Priority support",
      ],
    },
  },
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1SHAkbGfnyRtJEjpzyvT4N9S"
            : "price_456",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Solo Developer",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Perfect for individual developers",
        // The price you want to display, the one user will be charged on Stripe.
        price: 29,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: 49,
        features: [
          {
            name: "Up to 5 projects",
          },
          { name: "3 devices" },
          { name: "End-to-end encryption" },
          { name: "Real-time sync" },
          { name: "Version history (30 days)" },
          { name: "CLI & Web access" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1SHAksGfnyRtJEjpM7fUgXsY"
            : "price_456",
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        name: "Team",
        description: "For growing teams and agencies",
        price: 79,
        priceAnchor: 129,
        features: [
          {
            name: "Unlimited projects",
          },
          { name: "Unlimited devices" },
          { name: "End-to-end encryption" },
          { name: "Real-time sync" },
          { name: "Unlimited version history" },
          { name: "CLI & Web access" },
          { name: "Team collaboration" },
          { name: "Role-based permissions" },
          { name: "Priority support" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `EnvSync <noreply@resend.envsync.app>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Daniel at EnvSync <daniel@resend.envsync.app>`,
    // Email shown to customer if they need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "neca.danii@gmail.com",
  },
  colors: {
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..)
    // Using the primary color from globals.css converted to HEX for browser compatibility
    main: "#2b7fff", // Converted from oklch(0.205 0 0) to HEX
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/api/auth/signin",
    // REQUIRED — the path you want to redirect users to after a successful login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
} as ConfigProps;

export default config;
