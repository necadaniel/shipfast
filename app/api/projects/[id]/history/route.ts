import { auth } from "@/libs/next-auth";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Project from "@/models/Project";
import Team from "@/models/Team";
import VariableHistory from "@/models/VariableHistory";
import User from "@/models/User";

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

// GET /api/projects/[id]/history - Get change history for a project
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

    // Parse query parameters for filtering
    const { searchParams } = new URL(req.url);
    const actionFilter = searchParams.get("action");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");
    const userIdFilter = searchParams.get("userId");

    await connectMongo();

    const { hasAccess, project } = await checkProjectAccess(
      id,
      session.user.id
    );

    if (!hasAccess || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Build query filter
    const query: any = { projectId: id };

    // Filter by action type
    if (actionFilter && actionFilter !== "all") {
      query.action = actionFilter;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Filter by user
    if (userIdFilter && userIdFilter !== "all") {
      query.userId = userIdFilter;
    }

    // Search by variable name
    if (search && search.trim()) {
      query.variableKey = { $regex: search.trim(), $options: "i" };
    }

    // Fetch history entries with filters applied
    const history = await VariableHistory.find(query as any)
      .sort({ createdAt: -1 })
      .populate("userId", "name email image")
      .lean();

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
