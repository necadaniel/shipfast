import { NextResponse } from "next/server";
import meta from "@/libs/version";

// Public build info — handy for confirming what's actually deployed, and as a
// lightweight health check for uptime monitors.
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(meta);
}
