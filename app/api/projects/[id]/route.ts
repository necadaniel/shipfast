import { NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Project from "@/models/Project";
import Team from "@/models/Team";
import User from "@/models/User";

export const dynamic = "force-dynamic";

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
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

    // Find the project first
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check access control
    let hasDeletePermission = false;

    if (project.isTeamProject && project.teamId) {
      // For team projects: check if user is team owner or admin
      const team = await Team.findById(project.teamId);

      if (team) {
        const userRole = team.getUserRole(session.user.id);
        hasDeletePermission = userRole === "owner" || userRole === "admin";
      }
    } else {
      // For personal projects: check if user is the owner
      hasDeletePermission = project.userId?.toString() === session.user.id;
    }

    if (!hasDeletePermission) {
      return NextResponse.json(
        { error: "You don't have permission to delete this project" },
        { status: 403 }
      );
    }

    // Delete the project
    await Project.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
