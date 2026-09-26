import { NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";
import { getUserById } from "@/libs/users";
import { getUserPlan } from "@/libs/plans";

// Returns the signed-in user's access state and current plan.
// The plan is derived from the Stripe price the webhook stored on the user.
export async function GET() {
  try {
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

    const plan = getUserPlan(user);

    return NextResponse.json({
      hasAccess: Boolean(user.hasAccess),
      plan: plan ? { name: plan.name, priceId: plan.priceId } : null,
    });
  } catch (e) {
    console.error("user/plan:", e);
    return NextResponse.json(
      { error: "Failed to fetch user plan" },
      { status: 500 }
    );
  }
}
