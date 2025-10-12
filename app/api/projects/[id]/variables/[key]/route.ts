import { auth } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Project from "@/models/Project";
import Team from "@/models/Team";

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

    return NextResponse.json({ message: "Variable deleted successfully" });
  } catch (error) {
    console.error("Error deleting variable:", error);
    return NextResponse.json(
      { error: "Failed to delete variable" },
      { status: 500 }
    );
  }
}
