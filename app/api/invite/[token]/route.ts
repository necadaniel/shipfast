import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";

// GET /api/invite/[token] - Get invitation details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    await connectMongo();

    const team = await Team.findOne({
      "pendingInvitations.token": token,
    }).populate("owner", "name email image");

    if (!team) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    const invitation = team.pendingInvitations.find(
      (inv: any) => inv.token === token
    );

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Check if invitation has expired
    if (new Date(invitation.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This invitation has expired" },
        { status: 410 }
      );
    }

    // Populate invitedBy user
    await team.populate("pendingInvitations.invitedBy", "name email image");

    const invitedByUser = invitation.invitedBy;

    return NextResponse.json({
      team: {
        id: team._id.toString(),
        name: team.name,
        owner: {
          name: team.owner.name,
          email: team.owner.email,
          image: team.owner.image,
        },
        memberCount: team.members.length + 1, // +1 for owner
      },
      invitation: {
        email: invitation.email,
        role: invitation.role,
        invitedBy: {
          name: invitedByUser?.name || "Unknown",
          email: invitedByUser?.email || "",
          image: invitedByUser?.image || null,
        },
        sentAt: invitation.sentAt,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitation" },
      { status: 500 }
    );
  }
}
