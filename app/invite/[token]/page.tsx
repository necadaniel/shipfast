import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import InviteClient from "./InviteClient";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const session = await auth();

  await connectMongo();

  // Fetch invitation details
  const team: any = await Team.findOne({
    "pendingInvitations.token": token,
  })
    .populate("owner", "name email image")
    .lean();

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 rounded-xl p-8 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)]">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Invitation Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This invitation link is invalid or has already been used.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const invitation = (team as any).pendingInvitations.find(
    (inv: any) => inv.token === token
  );

  if (!invitation) {
    return redirect("/");
  }

  // Check if invitation has expired
  if (new Date(invitation.expiresAt) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 rounded-xl p-8 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)]">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Invitation Expired</h1>
            <p className="text-muted-foreground mb-6">
              This invitation link has expired. Please request a new invitation
              from the team owner.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Populate invitedBy user
  await Team.populate(team, {
    path: "pendingInvitations.invitedBy",
    select: "name email image",
  });

  const invitedByUser = invitation.invitedBy;

  const invitationData = {
    team: {
      id: (team as any)._id.toString(),
      name: team.name,
      owner: {
        name: (team as any).owner.name,
        email: (team as any).owner.email,
        image: (team as any).owner.image,
      },
      memberCount: (team as any).members.length + 1, // +1 for owner
    },
    invitation: {
      email: invitation.email,
      role: invitation.role,
      invitedBy: {
        name: invitedByUser?.name || "Unknown",
        email: invitedByUser?.email || "",
        image: invitedByUser?.image || null,
      },
      sentAt: invitation.sentAt.toISOString(),
      expiresAt: invitation.expiresAt.toISOString(),
    },
    token,
    isAuthenticated: !!session,
    userEmail: session?.user?.email || null,
  };

  return <InviteClient data={invitationData} />;
}
