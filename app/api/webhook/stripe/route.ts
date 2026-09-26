import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { isSupabaseConfigured } from "@/libs/supabase";
import {
  createUser,
  getUserByCustomerId,
  getUserByEmail,
  getUserById,
  updateUser,
} from "@/libs/users";
import { getStripe, findCheckoutSession } from "@/libs/stripe";
import { getPlanByPriceId } from "@/libs/plans";

// Stripe sends either a bare ID or an expanded object depending on the event
// and your API settings. Always normalise before querying the database.
const toId = (
  value: string | { id: string } | null | undefined
): string | undefined => (typeof value === "string" ? value : value?.id);

// Stripe webhook receiver. This is what actually grants and revokes access.
//
// Local testing:
//   stripe listen --forward-to localhost:3000/api/webhook/stripe
// Production: add https://<your-domain>/api/webhook/stripe in the Stripe dashboard.
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is missing — see .env.example");
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  let event: Stripe.Event;

  // Verify the event really came from Stripe
  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    console.error("Supabase is not configured — see .env.example");
    return NextResponse.json(
      { error: "Database is not configured" },
      { status: 500 }
    );
  }

  try {
    switch (event.type) {
      // Payment succeeded (or a subscription started) — grant access
      case "checkout.session.completed": {
        const stripeObject = event.data.object as Stripe.Checkout.Session;
        const session = await findCheckoutSession(stripeObject.id);

        const customerId = toId(session?.customer);
        const priceId = session?.line_items?.data[0]?.price?.id;
        const userId = stripeObject.client_reference_id;

        if (!priceId || !getPlanByPriceId(priceId)) {
          console.warn(`Ignoring checkout for unknown price: ${priceId}`);
          break;
        }

        let user = userId ? await getUserById(userId) : null;

        // Fall back to matching by email (e.g. a payment link used outside the app)
        if (!user && customerId) {
          const customer = await stripe.customers.retrieve(customerId);

          if (!customer.deleted && customer.email) {
            user =
              (await getUserByEmail(customer.email)) ??
              (await createUser({
                email: customer.email,
                name: customer.name,
              }));
          }
        }

        if (!user) {
          console.error("checkout.session.completed: no user found");
          break;
        }

        await updateUser(user.id, {
          priceId,
          ...(customerId ? { customerId } : {}),
          hasAccess: true,
        });

        // Optional: send a welcome email here with libs/resend.ts
        break;
      }

      // Recurring payment succeeded — keep access on
      case "invoice.paid": {
        const stripeObject = event.data.object as Stripe.Invoice;
        const lineItem = stripeObject.lines.data[0] as
          | (Stripe.InvoiceLineItem & {
              price?: { id?: string };
              pricing?: { price_details?: { price?: string } };
            })
          | undefined;

        const priceId =
          lineItem?.price?.id ?? lineItem?.pricing?.price_details?.price;
        if (!priceId) break;

        const customerId = toId(stripeObject.customer);
        if (!customerId) break;

        const user = await getUserByCustomerId(customerId);
        if (!user) break;

        // Only extend access for the plan the user actually subscribed to
        if (user.priceId !== priceId) break;

        await updateUser(user.id, { hasAccess: true });
        break;
      }

      // Subscription ended for good — revoke access
      case "customer.subscription.deleted": {
        const stripeObject = event.data.object as Stripe.Subscription;
        const customerId = toId(stripeObject.customer);
        if (!customerId) break;

        const user = await getUserByCustomerId(customerId);
        if (!user) break;

        await updateUser(user.id, { hasAccess: false });
        break;
      }

      // Nothing to do, but handy hooks if you want them:
      // - checkout.session.expired    → remind the user to finish checking out
      // - customer.subscription.updated → plan changed / cancels at period end
      // - invoice.payment_failed      → Stripe retries automatically, then sends
      //                                 customer.subscription.deleted
      default:
        break;
    }
  } catch (e) {
    // Return 200 so Stripe doesn't retry a bug forever; the error is logged.
    console.error(`Stripe webhook error on ${event.type}:`, e);
  }

  return NextResponse.json({ received: true });
}
