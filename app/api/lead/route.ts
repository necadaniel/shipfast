import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { saveLead } from "@/libs/leads";

const bodySchema = z.object({
  email: z.email("A valid email is required"),
});

// Stores an email from <ButtonLead />. Use this for a waitlist or a lead magnet
// before your product is ready.
export async function POST(req: NextRequest) {
  try {
    const parsed = bodySchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.prettifyError(parsed.error) },
        { status: 400 }
      );
    }

    await saveLead(parsed.data.email);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("lead:", e);
    return NextResponse.json(
      { error: "Could not save your email" },
      { status: 500 }
    );
  }
}
