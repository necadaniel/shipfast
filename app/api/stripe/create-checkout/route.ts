import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/libs/next-auth";
import { createCheckout } from "@/libs/stripe";
import { getPlanByPriceId, hasPlan } from "@/libs/plans";
import { getUserById } from "@/libs/users";

const bodySchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
  successUrl: z.url("A valid success URL is required"),
  cancelUrl: z.url("A valid cancel URL is required"),
  couponId: z.string().optional(),
});

// Creates a Stripe Checkout session. Called by <ButtonCheckout />.
// Users must be signed in so the webhook can match the payment back to them.
export async function POST(req: NextRequest) {
  try {
    const parsed = bodySchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.prettifyError(parsed.error) },
        { status: 400 }
      );
    }

    const { priceId, successUrl, cancelUrl, couponId } = parsed.data;

    // The checkout mode comes from config, not the client, so a caller can't
    // turn a subscription price into a one-time payment.
    const plan = getPlanByPriceId(priceId);
    if (!plan) {
      return NextResponse.json(
        { error: "Unknown plan. Check config.stripe.plans." },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await getUserById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (hasPlan(user, priceId)) {
      return NextResponse.json(
        { error: `You already have the ${plan.name} plan.` },
        { status: 403 }
      );
    }

    const url = await createCheckout({
      priceId,
      mode: plan.mode,
      successUrl,
      cancelUrl,
      couponId,
      // Lets the webhook identify the user from the Stripe event
      clientReferenceId: user.id,
      // Prefills email / saved cards for a faster checkout
      user,
    });

    return NextResponse.json({ url });
  } catch (e) {
    console.error("create-checkout:", e);
    return NextResponse.json(
      { error: "Could not start checkout" },
      { status: 500 }
    );
  }
}
