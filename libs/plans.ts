import config from "@/config";
import type { StripePlan } from "@/types/config";

// A user's plan is derived from the Stripe price they paid for, which the webhook
// stores on the user row. There is no separate `plan` column to keep in sync.

/** Find the configured plan matching a Stripe price ID. */
export const getPlanByPriceId = (
  priceId?: string | null
): StripePlan | undefined => {
  if (!priceId) return undefined;
  return config.stripe.plans.find((plan) => plan.priceId === priceId);
};

/** The plan a user currently has, or undefined if they haven't paid. */
export const getUserPlan = (
  user?: { priceId?: string | null; hasAccess?: boolean } | null
): StripePlan | undefined => {
  if (!user?.hasAccess) return undefined;
  return getPlanByPriceId(user.priceId);
};

/** True if the user already owns this exact plan. */
export const hasPlan = (
  user: { priceId?: string | null; hasAccess?: boolean } | null | undefined,
  priceId: string
): boolean => getUserPlan(user)?.priceId === priceId;
