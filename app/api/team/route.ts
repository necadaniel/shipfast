import { NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Team from "@/models/Team";

// GET /api/team - Get all teams user has access to (owns or is member of)
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

    // Find all teams where user is owner OR a member
    const teams = await Team.find({
      $or: [{ ownerId: user._id }, { "members.userId": user._id }],
    })
      .select("name ownerId members memberCount createdAt updatedAt")
      .sort({ createdAt: -1 });

    // Add user's role to each team for display
    const teamsWithRole = teams.map((team) => {
      const teamObj = team.toObject();
      let role = "member";

      if (team.ownerId.toString() === user._id.toString()) {
        role = "owner";
      } else {
        const member = team.members.find(
          (m: any) => m.userId.toString() === user._id.toString()
        );
        if (member) {
          role = member.role;
        }
      }

      return {
        ...teamObj,
        userRole: role,
      };
    });

    return NextResponse.json({ teams: teamsWithRole }, { status: 200 });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
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
    const user = await User.findById(session.user.id).select(
      "+plan +teamId +teamRole"
    );

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
        {
          error:
            "Team plan required to create a team. Please upgrade your plan.",
        },
        { status: 403 }
      );
    }

    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    // Create team (users with Team plan can create multiple teams)
    const team = await Team.create({
      name: name.trim(),
      ownerId: user._id,
      members: [],
      pendingInvitations: [],
    });

    // Note: We don't update user.teamId anymore since users can have multiple teams
    // The teamId field in User model will be deprecated in favor of the Team.members array

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
