import { NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Team from "@/models/Team";
import { wrapTeamKey } from "@/libs/encryption";

// POST /api/invite/[token]/accept - Accept team invitation
export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { token } = await params;

    await connectMongo();

    const user: any = await User.findById(session.user.id).select(
      "+encryptionKey"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const team: any = await Team.findOne({
      "pendingInvitations.token": token,
    }).select("+teamEncryptionKey");

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

    // Check if user's email matches the invitation email
    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return NextResponse.json(
        {
          error: `This invitation was sent to ${invitation.email}. Please sign in with that email address.`,
        },
        { status: 403 }
      );
    }

    // Check if user is already a member
    if (team.isMember(user._id.toString())) {
      return NextResponse.json(
        { error: "You are already a member of this team" },
        { status: 400 }
      );
    }

    // Add user to team
    team.members.push({
      userId: user._id,
      email: user.email,
      role: invitation.role,
      joinedAt: new Date(),
    });

    // Remove the invitation
    team.pendingInvitations = team.pendingInvitations.filter(
      (inv: any) => inv.token !== token
    );

    // If team has encryption key, wrap it for the new member
    if (team.teamEncryptionKey && user.encryptionKey) {
      try {
        const wrappedKey = await wrapTeamKey(
          team.teamEncryptionKey,
          user.encryptionKey
        );
        team.wrappedTeamKeys.push({
          userId: user._id,
          wrappedKey,
          wrappedAt: new Date(),
        });
      } catch (error) {
        console.error("Error wrapping team key for new member:", error);
        // Continue anyway - they can get the key when accessing team projects
      }
    }

    await team.save();

    // Update user's team info
    user.teamId = team._id;
    user.teamRole = invitation.role;
    await user.save();

    return NextResponse.json({
      message: "Successfully joined the team",
      team: {
        id: team._id.toString(),
        name: team.name,
        role: invitation.role,
      },
    });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}
