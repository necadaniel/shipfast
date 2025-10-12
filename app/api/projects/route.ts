import { NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Project from "@/models/Project";
import User from "@/models/User";
import { canCreateProject, getPlanLimitError } from "@/libs/plans";

// GET /api/projects - Get all projects for the authenticated user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const projects = await Project.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, color } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Get user's plan
    const user = await User.findById(session.user.id).select("plan");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check current project count
    const currentProjectCount = await Project.countDocuments({
      userId: session.user.id,
    });

    // Check if user can create more projects
    if (!canCreateProject(currentProjectCount, user.plan)) {
      return NextResponse.json(
        { error: getPlanLimitError(user.plan, "projects") },
        { status: 403 }
      );
    }

    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || "",
      color: color || "#2b7fff",
      userId: session.user.id,
      variables: "[]",
      variableCount: 0,
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
