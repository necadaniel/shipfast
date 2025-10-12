import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/libs/next-auth";
import { createCheckout } from "@/libs/stripe";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import config from "@/config";

// This function is used to create a Stripe Checkout Session (one-time payment or subscription)
// It's called by the <ButtonCheckout /> component
// Requires users to be authenticated to proceed with checkout
// Enforces plan upgrade/downgrade rules:
// - Users with Solo plan can upgrade to Team plan
// - Users with Team plan cannot buy anything (already have highest tier)
// - Users cannot re-purchase their current plan
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.priceId) {
    return NextResponse.json(
      { error: "Price ID is required" },
      { status: 400 }
    );
  } else if (!body.successUrl || !body.cancelUrl) {
    return NextResponse.json(
      { error: "Success and cancel URLs are required" },
      { status: 400 }
    );
  } else if (!body.mode) {
    return NextResponse.json(
      {
        error:
          "Mode is required (either 'payment' for one-time payments or 'subscription' for recurring subscription)",
      },
      { status: 400 }
    );
  }

  try {
    const session = await auth();

    // Require authentication
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectMongo();

    const { priceId, mode, successUrl, cancelUrl } = body;

    const { id } = session.user;
    const user = await User.findById(String(id));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get plan names from config
    const soloPlan = config.stripe.plans.find((p) => p.name === "Solo Developer");
    const teamPlan = config.stripe.plans.find((p) => p.name === "Team");

    // Determine which plan is being purchased
    const isPurchasingSolo = priceId === soloPlan?.priceId;
    const isPurchasingTeam = priceId === teamPlan?.priceId;

    // Check current user plan and enforce rules
    if (user.plan === "team") {
      // Users with Team plan cannot purchase anything (highest tier)
      return NextResponse.json(
        { error: "You already have the Team plan. To downgrade, please contact support." },
        { status: 403 }
      );
    }

    if (user.plan === "solo") {
      if (isPurchasingSolo) {
        // Cannot re-purchase Solo plan
        return NextResponse.json(
          { error: "You already have the Solo plan." },
          { status: 403 }
        );
      }
      // Allow upgrading to Team plan (isPurchasingTeam will be true)
    }

    if (user.plan === "free") {
      // Free users can purchase either plan
      // No restrictions
    }

    const stripeSessionURL = await createCheckout({
      priceId,
      mode,
      successUrl,
      cancelUrl,
      // Pass the user ID to the Stripe Session so it can be retrieved in the webhook later
      clientReferenceId: user._id.toString(),
      // Automatically prefill Checkout data like email and/or credit card for faster checkout
      user,
      // If you send coupons from the frontend, you can pass it here
      // couponId: body.couponId,
    });

    return NextResponse.json({ url: stripeSessionURL });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
