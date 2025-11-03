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
      metadata: {
        source: "web",
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

// PATCH /api/projects/[id]/variables/[key] - Update a variable
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; key: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, key } = await params;
    const body = await req.json();
    const { newKey, value } = body;

    if (!value) {
      return NextResponse.json({ error: "Value is required" }, { status: 400 });
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

    // Find the variable to update
    const variableIndex = variables.findIndex((v: any) => v.key === key);

    if (variableIndex === -1) {
      return NextResponse.json(
        { error: "Variable not found" },
        { status: 404 }
      );
    }

    const oldVariable = variables[variableIndex];
    const finalKey = newKey || key;

    // If key is changing, check for duplicates
    if (newKey && newKey !== key) {
      if (variables.some((v: any) => v.key === newKey)) {
        return NextResponse.json(
          { error: "A variable with this key already exists" },
          { status: 400 }
        );
      }
    }

    // Update the variable
    variables[variableIndex] = {
      key: finalKey,
      value: value,
    };

    // Update project
    project.variables = JSON.stringify(variables);
    project.lastSyncedAt = new Date();
    await project.save();

    // Log the update
    await logVariableChange({
      projectId: id,
      teamId: project.teamId?.toString(),
      userId: session.user.id,
      action: "updated",
      variableKey: finalKey,
      oldValue: oldVariable.value,
      newValue: value,
    });

    return NextResponse.json({
      key: finalKey,
      value: value,
    });
  } catch (error) {
    console.error("Error updating variable:", error);
    return NextResponse.json(
      { error: "Failed to update variable" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]/variables/[key] - Delete a variable
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; key: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, key } = await params;

    await connectMongo();

    const { hasAccess, project } = await checkProjectAccess(
      id,
      session.user.id
    );

    if (!hasAccess || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const variables = JSON.parse(project.variables || "[]");

    // Find the variable to delete (save old value for history)
    const variableToDelete = variables.find((v: any) => v.key === key);

    // Find and remove the variable
    const filteredVariables = variables.filter((v: any) => v.key !== key);

    if (filteredVariables.length === variables.length) {
      return NextResponse.json(
        { error: "Variable not found" },
        { status: 404 }
      );
    }

    // Update project
    project.variables = JSON.stringify(filteredVariables);
    project.variableCount = filteredVariables.length;
    project.lastSyncedAt = new Date();
    await project.save();

    // Log the deletion
    if (variableToDelete) {
      await logVariableChange({
        projectId: id,
        teamId: project.teamId?.toString(),
        userId: session.user.id,
        action: "deleted",
        variableKey: key,
        oldValue: variableToDelete.value, // Save encrypted old value for potential rollback
      });
    }

    return NextResponse.json({ message: "Variable deleted successfully" });
  } catch (error) {
    console.error("Error deleting variable:", error);
    return NextResponse.json(
      { error: "Failed to delete variable" },
      { status: 500 }
    );
  }
}
