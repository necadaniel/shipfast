import { NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Team from "@/models/Team";

// GET /api/team/[id] - Get specific team details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectMongo();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch team details
    const team = await Team.findById(id)
      .populate("owner", "name email image")
      .populate("members.userId", "name email image")
      .populate("pendingInvitations.invitedBy", "name email");

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if user has access to this team (is owner or member)
    if (!team.isMember(user._id.toString())) {
      return NextResponse.json(
        { error: "Access denied. You are not a member of this team." },
        { status: 403 }
      );
    }

    // Get user's role in team
    const userRole = team.getUserRole(user._id.toString());

    return NextResponse.json({ team, userRole }, { status: 200 });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

// PATCH /api/team/[id] - Update team details
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectMongo();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const team = await Team.findById(id);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if user is owner or admin
    if (!team.canInvite(user._id.toString())) {
      return NextResponse.json(
        { error: "Only owner or admin can update team" },
        { status: 403 }
      );
    }

    const { name } = await req.json();

    if (name && name.trim()) {
      team.name = name.trim();
      await team.save();
    }

    return NextResponse.json(
      { team, message: "Team updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

// DELETE /api/team/[id] - Delete team (owner only)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectMongo();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const team = await Team.findById(id);

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if user is owner
    if (team.ownerId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Only team owner can delete team" },
        { status: 403 }
      );
    }

    // Import Project model
    const Project = (await import("@/models/Project")).default;

    // Delete all team projects
    await Project.deleteMany({ teamId: team._id, isTeamProject: true });

    // Remove team reference from owner and all members (if they have this as their active team)
    await User.updateMany(
      { teamId: team._id },
      { $unset: { teamId: "", teamRole: "" } }
    );

    // Delete team
    await Team.findByIdAndDelete(team._id);

    return NextResponse.json(
      { message: "Team deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
