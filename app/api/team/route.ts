import { NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Team from "@/models/Team";

// GET /api/team - Get user's team details
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectMongo();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has a team
    if (!user.teamId) {
      return NextResponse.json({ team: null }, { status: 200 });
    }

    // Fetch team details
    const team = await Team.findById(user.teamId)
      .populate("ownerId", "name email image")
      .populate("members.userId", "name email image");

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ team }, { status: 200 });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

// POST /api/team - Create a new team
export async function POST(req: Request) {
  try {
    const session = await auth();

    console.log("=== CREATE TEAM DEBUG ===");
    console.log("Session:", JSON.stringify(session, null, 2));

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectMongo();

    console.log("Looking up user with ID:", session.user.id);
    // Fetch user with explicit select to ensure we get the plan field
    const user = await User.findById(session.user.id).select('+plan +teamId +teamRole');

    console.log("User found:", !!user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User data:", {
      id: user._id,
      email: user.email,
      plan: user.plan,
      teamId: user.teamId,
      hasTeamId: !!user.teamId,
      planType: typeof user.plan,
    });

    // Check if user has team plan (always fetch from DB, not session)
    if (!user.plan || user.plan !== "team") {
      console.error("Plan check failed:", {
        userPlan: user.plan,
        expectedPlan: "team",
        planType: typeof user.plan,
        planIsNull: user.plan === null,
        planIsUndefined: user.plan === undefined,
      });
      return NextResponse.json(
        { error: "Team plan required to create a team. Please upgrade your plan." },
        { status: 403 }
      );
    }

    // Check if user already has a team
    if (user.teamId) {
      return NextResponse.json(
        { error: "User already belongs to a team" },
        { status: 400 }
      );
    }

    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    // Create team
    const team = await Team.create({
      name: name.trim(),
      ownerId: user._id,
      members: [],
      pendingInvitations: [],
    });

    // Update user with team info
    user.teamId = team._id;
    user.teamRole = "owner";
    await user.save();

    return NextResponse.json(
      { team, message: "Team created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}

// PATCH /api/team - Update team details
export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectMongo();

    const user = await User.findById(session.user.id);

    if (!user || !user.teamId) {
      return NextResponse.json(
        { error: "User does not belong to a team" },
        { status: 404 }
      );
    }

    const team = await Team.findById(user.teamId);

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

// DELETE /api/team - Delete team (owner only)
export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectMongo();

    const user = await User.findById(session.user.id);

    if (!user || !user.teamId) {
      return NextResponse.json(
        { error: "User does not belong to a team" },
        { status: 404 }
      );
    }

    const team = await Team.findById(user.teamId);

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

    // Remove team reference from all members
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
