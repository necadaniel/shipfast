import Stripe from "stripe";

// Pinned so Stripe's behaviour can't shift under you (important for webhooks).
// Typed as LatestApiVersion on purpose: bumping the SDK to a major that moved on
// will fail `npm run typecheck` here, prompting a deliberate review of the
// changelog rather than a silent behaviour change.
const STRIPE_API_VERSION: Stripe.LatestApiVersion = "2026-07-29.dahlia";

let cachedStripe: Stripe | null = null;

/**
 * Lazily creates the Stripe client so importing this file never throws at build
 * time when STRIPE_SECRET_KEY isn't set yet.
 */
export const getStripe = (): Stripe => {
  if (cachedStripe) return cachedStripe;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is missing. Add it to .env.local — see .env.example."
    );
  }

  cachedStripe = new Stripe(secretKey, {
    apiVersion: STRIPE_API_VERSION,
    typescript: true,
  });
  return cachedStripe;
};

interface CreateCheckoutParams {
  priceId: string;
  mode: "payment" | "subscription";
  successUrl: string;
  cancelUrl: string;
  couponId?: string | null;
  clientReferenceId?: string;
  user?: {
    customerId?: string;
    email?: string;
  };
}

interface CreateCustomerPortalParams {
  customerId: string;
  returnUrl: string;
}

// Creates a Stripe Checkout session (one-time payment or subscription).
// Usually triggered by <ButtonCheckout />. The webhook updates the user afterwards.
export const createCheckout = async ({
  user,
  mode,
  clientReferenceId,
  successUrl,
  cancelUrl,
  priceId,
  couponId,
}: CreateCheckoutParams): Promise<string> => {
  const stripe = getStripe();

  const extraParams: {
    customer?: string;
    customer_creation?: "always";
    customer_email?: string;
    invoice_creation?: { enabled: boolean };
    payment_intent_data?: { setup_future_usage: "on_session" };
    tax_id_collection?: { enabled: boolean };
  } = {};

  if (user?.customerId) {
    extraParams.customer = user.customerId;
  } else {
    if (mode === "payment") {
      extraParams.customer_creation = "always";
      // Enabling invoices costs 0.4% (up to $2) per invoice.
      // extraParams.invoice_creation = { enabled: true };
      extraParams.payment_intent_data = { setup_future_usage: "on_session" };
    }
    if (user?.email) {
      extraParams.customer_email = user.email;
    }
    extraParams.tax_id_collection = { enabled: true };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode,
    allow_promotion_codes: true,
    client_reference_id: clientReferenceId,
    line_items: [{ price: priceId, quantity: 1 }],
    discounts: couponId ? [{ coupon: couponId }] : [],
    success_url: successUrl,
    cancel_url: cancelUrl,
    ...extraParams,
  });

  if (!stripeSession.url) {
    throw new Error("Stripe did not return a Checkout URL");
  }

  return stripeSession.url;
};

// Creates a Customer Portal session so users can manage their subscription,
// payment methods, invoices and cancellations.
export const createCustomerPortal = async ({
  customerId,
  returnUrl,
}: CreateCustomerPortalParams): Promise<string> => {
  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return portalSession.url;
};

// Retrieves a checkout session with its line items expanded, so the webhook can
// read which price the customer actually paid for.
export const findCheckoutSession = async (sessionId: string) => {
  return getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });
};
