import React from "react";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Project from "@/models/Project";
import Team from "@/models/Team";
import VariableHistory from "@/models/VariableHistory";
import ProjectHistoryClient from "@/components/ProjectHistoryClient";

async function ProjectHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const { id } = await params;

  await connectMongo();

  // Fetch the project
  const project: any = await Project.findById(id).lean();

  if (!project) {
    notFound();
  }

  // Check access
  let hasAccess = false;

  if (project.userId && project.userId.toString() === session.user.id) {
    hasAccess = true;
  } else if (project.isTeamProject && project.teamId) {
    const team: any = await Team.findById(project.teamId).lean();
    if (team) {
      const isOwner = team.ownerId.toString() === session.user.id;
      const isMember = team.members.some(
        (m: any) => m.userId.toString() === session.user.id
      );
      hasAccess = isOwner || isMember;
    }
  }

  if (!hasAccess) {
    notFound();
  }

  // Fetch history entries for this project
  const history: any[] = await VariableHistory.find({
    projectId: id,
  } as any)
    .sort({ createdAt: -1 })
    .populate("userId", "name email image")
    .lean();

  // Format the data for the client
  const formattedHistory = history.map((entry) => ({
    _id: entry._id.toString(),
    action: entry.action,
    variableKey: entry.variableKey,
    oldValue: entry.oldValue,
    newValue: entry.newValue,
    createdAt: entry.createdAt,
    user: {
      id: entry.userId?._id?.toString() || "",
      name: entry.userId?.name || "Unknown User",
      email: entry.userId?.email,
      image: entry.userId?.image,
    },
    metadata: entry.metadata,
  }));

  const projectData = {
    _id: project._id.toString(),
    name: project.name,
    description: project.description,
    color: project.color,
    isTeamProject: project.isTeamProject || false,
  };

  return (
    <ProjectHistoryClient project={projectData} history={formattedHistory} />
  );
}

export default ProjectHistoryPage;
