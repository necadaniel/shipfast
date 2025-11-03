import { auth } from "@/libs/next-auth";
import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Project from "@/models/Project";
import mongoose from "mongoose";

/**
 * GET /api/team/[id]/projects
 * List all projects for a team
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId } = await params;

    await connectMongo();

    // Check if user has access to this team
    const team: any = await Team.findById(teamId).lean();

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const isOwner = team.ownerId.toString() === session.user.id;
    const isMember = team.members.some(
      (m: any) => m.userId.toString() === session.user.id
    );

    if (!isOwner && !isMember) {
      return NextResponse.json(
        { error: "You don't have access to this team" },
        { status: 403 }
      );
    }

    // Fetch all team projects - convert teamId to ObjectId explicitly
    const projects = await Project.find({
      teamId: new mongoose.Types.ObjectId(teamId),
      isTeamProject: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${projects.length} projects for team ${teamId}`);

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching team projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch team projects" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/team/[id]/projects
 * Create a new project for the team
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId } = await params;
    const body = await req.json();

    await connectMongo();

    // Check if user has access to this team
    const team: any = await Team.findById(teamId).lean();

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const isOwner = team.ownerId.toString() === session.user.id;
    const isMember = team.members.some(
      (m: any) => m.userId.toString() === session.user.id
    );

    if (!isOwner && !isMember) {
      return NextResponse.json(
        { error: "You don't have access to this team" },
        { status: 403 }
      );
    }

    // Check permissions - only owner and admin can create projects
    const userRole = team.getUserRole
      ? team.getUserRole(session.user.id)
      : isOwner
      ? "owner"
      : team.members.find((m: any) => m.userId.toString() === session.user.id)
          ?.role || "member";

    if (userRole !== "owner" && userRole !== "admin") {
      return NextResponse.json(
        { error: "Only team owners and admins can create projects" },
        { status: 403 }
      );
    }

    const { name, description, color } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Create new team project
    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || "",
      color: color || "#2b7fff",
      teamId,
      userId: undefined, // Explicitly set to undefined for team projects
      isTeamProject: true,
      variables: "[]",
      variableCount: 0,
      lastSyncedAt: null,
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating team project:", error);
    return NextResponse.json(
      { error: "Failed to create team project" },
      { status: 500 }
    );
  }
}
