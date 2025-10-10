import { auth } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongo from "@/libs/mongoose";
import Project from "@/models/Project";
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

  // Fetch the project and ensure it belongs to the current user
  const project = await Project.findOne({
    _id: id,
    userId: session.user.id,
  });

  if (!project) {
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
  };

  return <ProjectDetailClient project={serializedProject} />;
}
