import { auth } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Project from "@/models/Project";
import Team from "@/models/Team";
import VariableHistory from "@/models/VariableHistory";

// Helper function to log variable changes
async function logVariableChange(data: {
  projectId: string;
  teamId?: string;
  userId: string;
  action: "created" | "updated" | "deleted" | "bulk_import";
  variableKey: string;
  oldValue?: string;
  newValue?: string;
  bulkChanges?: Array<{
    key: string;
    action: string;
    oldValue?: string;
    newValue?: string;
  }>;
  metadata?: {
    source?: "web" | "cli" | "api";
    ipAddress?: string;
    userAgent?: string;
  };
}) {
  try {
    const historyEntry = new VariableHistory({
      projectId: data.projectId,
      teamId: data.teamId,
      userId: data.userId,
      action: data.action,
      variableKey: data.variableKey,
      oldValue: data.oldValue,
      newValue: data.newValue,
      bulkChanges: data.bulkChanges,
      metadata: {
        source: data.metadata?.source || "web",
        ipAddress: data.metadata?.ipAddress,
        userAgent: data.metadata?.userAgent,
      },
      canRollback: true,
    });
    await historyEntry.save();
  } catch (error) {
    console.error("Error logging variable change:", error);
    // Don't throw - logging failure shouldn't break the main operation
  }
}

// Helper function to check project access (personal or team)
async function checkProjectAccess(projectId: string, userId: string) {
  const project = await Project.findById(projectId);

  if (!project) {
    return { hasAccess: false, project: null };
  }

  // Check personal project access
  if (project.userId && project.userId.toString() === userId) {
    return { hasAccess: true, project };
  }

  // Check team project access
  if (project.isTeamProject && project.teamId) {
    const team: any = await Team.findById(project.teamId).lean();
    if (team) {
      const isOwner = team.ownerId.toString() === userId;
      const isMember = team.members.some(
        (m: any) => m.userId.toString() === userId
      );
      if (isOwner || isMember) {
        return { hasAccess: true, project };
      }
    }
  }

  return { hasAccess: false, project: null };
}

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

    const { hasAccess, project } = await checkProjectAccess(
      id,
      session.user.id
    );

    if (!hasAccess || !project) {
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

    const { hasAccess, project } = await checkProjectAccess(
      id,
      session.user.id
    );

    if (!hasAccess || !project) {
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

    // Log the change
    await logVariableChange({
      projectId: id,
      teamId: project.teamId?.toString(),
      userId: session.user.id,
      action: "created",
      variableKey: key,
      newValue: value, // Already encrypted by client
    });

    return NextResponse.json({ key, value }, { status: 201 });
  } catch (error) {
    console.error("Error adding variable:", error);
    return NextResponse.json(
      { error: "Failed to add variable" },
      { status: 500 }
    );
  }
}
