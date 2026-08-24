import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import { createCustomerPortal } from "@/libs/stripe";
import User from "@/models/User";

const bodySchema = z.object({
  returnUrl: z.url("A valid return URL is required"),
});

// Opens the Stripe Customer Portal so users can manage their subscription,
// payment methods and invoices. Called by <ButtonAccount />.
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const parsed = bodySchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.prettifyError(parsed.error) },
        { status: 400 }
      );
    }

    await connectMongo();
    const user = await User.findById(String(session.user.id));

    if (!user?.customerId) {
      return NextResponse.json(
        {
          error: "You don't have a billing account yet. Make a purchase first.",
        },
        { status: 400 }
      );
    }

    const url = await createCustomerPortal({
      customerId: user.customerId,
      returnUrl: parsed.data.returnUrl,
    });

    return NextResponse.json({ url });
  } catch (e) {
    console.error("create-portal:", e);
    return NextResponse.json(
      { error: "Could not open the billing portal" },
      { status: 500 }
    );
  }
}
