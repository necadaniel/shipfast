import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Project from "@/models/Project";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server component which means you can fetch data (like the user profile) before the page is rendered.
export default async function Dashboard() {
  const session = await auth();

  await connectMongo();

  // Fetch user's personal projects
  const personalProjects = await Project.find({ userId: session?.user?.id })
    .sort({ createdAt: -1 })
    .lean();

  // Fetch all teams user is part of
  const Team = (await import("@/models/Team")).default;
  const teams = await Team.find({
    $or: [
      { ownerId: session?.user?.id },
      { "members.userId": session?.user?.id },
    ],
  })
    .select("_id name")
    .lean();

  const teamIds = teams.map((team) => team._id);

  // Fetch all team projects
  const teamProjects = await Project.find({
    isTeamProject: true,
    teamId: { $in: teamIds },
  })
    .sort({ createdAt: -1 })
    .lean();

  // Serialize personal projects
  const serializedPersonalProjects = personalProjects.map((project) => ({
    _id: project._id.toString(),
    name: project.name,
    description: project.description || "",
    color: project.color,
    variableCount: project.variableCount || 0,
    userId: project.userId?.toString() || null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    lastSyncedAt: project.lastSyncedAt?.toISOString() || null,
    isTeamProject: false,
  }));

  // Serialize team projects with team info
  const serializedTeamProjects = teamProjects.map((project) => {
    const team = teams.find(
      (t) => t._id.toString() === project.teamId?.toString()
    );
    return {
      _id: project._id.toString(),
      name: project.name,
      description: project.description || "",
      color: project.color,
      variableCount: project.variableCount || 0,
      teamId: project.teamId?.toString() || null,
      teamName: team?.name || "Unknown Team",
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      lastSyncedAt: project.lastSyncedAt?.toISOString() || null,
      isTeamProject: true,
    };
  });

  return (
    <DashboardClient
      personalProjects={serializedPersonalProjects}
      teamProjects={serializedTeamProjects}
    />
  );
}
