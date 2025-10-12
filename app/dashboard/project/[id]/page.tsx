import { auth } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongo from "@/libs/mongoose";
import Project from "@/models/Project";
import Team from "@/models/Team";
import ProjectDetailClient from "@/components/ProjectDetailClient";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  // Await params in Next.js 15+
  const { id } = await params;

  await connectMongo();

  // Fetch the project
  const project: any = await Project.findById(id).lean();

  if (!project) {
    redirect("/dashboard");
  }

  // Check access: either personal project or team member
  let hasAccess = false;

  if (project.isTeamProject && project.teamId) {
    // For team projects, check if user is a team member
    const team: any = await Team.findById(project.teamId).lean();
    if (team) {
      const isOwner = team.ownerId.toString() === session.user.id;
      const isMember = team.members.some(
        (m: any) => m.userId.toString() === session.user.id
      );
      hasAccess = isOwner || isMember;
    }
  } else if (project.userId) {
    // For personal projects, check if user is the owner
    hasAccess = project.userId.toString() === session.user.id;
  }

  if (!hasAccess) {
    redirect("/dashboard");
  }

  // Parse variables from JSON string
  const variables = JSON.parse(project.variables || "[]");

  // Serialize for client component
  const serializedProject = {
    id: project._id.toString(),
    name: project.name,
    description: project.description || "",
    color: project.color,
    variables,
    variableCount: project.variableCount,
    lastSyncedAt: project.lastSyncedAt?.toISOString() || null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    isTeamProject: project.isTeamProject || false,
    teamId: project.teamId?.toString() || null,
  };

  return <ProjectDetailClient project={serializedProject} />;
}
