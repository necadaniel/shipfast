import { auth } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Project from "@/models/Project";

// GET /api/projects/[id]/variables - Get all variables for a project
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectMongo();

    const project = await Project.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const variables = JSON.parse(project.variables || "[]");

    return NextResponse.json({ variables });
  } catch (error) {
    console.error("Error fetching variables:", error);
    return NextResponse.json(
      { error: "Failed to fetch variables" },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/variables - Add a new variable
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await req.json();
    const { key, value } = body;

    if (!key || !value) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    await connectMongo();

    const project = await Project.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const variables = JSON.parse(project.variables || "[]");

    // Check for duplicate keys
    if (variables.some((v: any) => v.key === key)) {
      return NextResponse.json(
        { error: "Variable with this key already exists" },
        { status: 400 }
      );
    }

    // Add new variable
    variables.push({ key, value });

    // Update project
    project.variables = JSON.stringify(variables);
    project.variableCount = variables.length;
    project.lastSyncedAt = new Date();
    await project.save();

    return NextResponse.json({ key, value }, { status: 201 });
  } catch (error) {
    console.error("Error adding variable:", error);
    return NextResponse.json(
      { error: "Failed to add variable" },
      { status: 500 }
    );
  }
}
