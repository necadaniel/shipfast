export interface StripePlan {
  /** Stripe price ID. Used to match the plan in the webhook and in <ButtonCheckout />. */
  priceId: string;
  /** Name of the plan, displayed on the pricing page. */
  name: string;
  /** Short description. Tip: explain why this plan and not the others. */
  description?: string;
  /** Price displayed on the pricing page. Must match the Stripe price. */
  price: number;
  /** Optional anchor price shown crossed out (e.g. 149). */
  priceAnchor?: number;
  /** "payment" = one-time, "subscription" = recurring. Must match the Stripe price type. */
  mode: "payment" | "subscription";
  /** Highlights the plan on the pricing page. Only set this on one plan. */
  isFeatured?: boolean;
  features: { name: string }[];
}

export interface ConfigProps {
  appName: string;
  appDescription: string;
  /** Naked domain: no protocol, no trailing slash. */
  domainName: string;
  crisp: {
    id?: string;
    onlyShowOnRoutes?: string[];
  };
  stripe: {
    plans: StripePlan[];
  };
  resend: {
    fromNoReply: string;
    fromAdmin: string;
    supportEmail?: string;
  };
  colors: {
    /** Browser chrome / loading bar color. Must be a HEX value. */
    main: string;
  };
  auth: {
    loginUrl: string;
    callbackUrl: string;
  };
}
