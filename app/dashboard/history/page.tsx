import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Project from "@/models/Project";
import Team from "@/models/Team";
import VariableHistory from "@/models/VariableHistory";
import HistoryClient from "@/components/HistoryClient";

async function DashboardHistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  await connectMongo();

  // Fetch all projects the user has access to
  const personalProjects = await Project.find({ userId: session.user.id })
    .select("_id name description color variableCount")
    .lean();

  // Fetch team projects
  const teams: any[] = await Team.find({
    $or: [{ ownerId: session.user.id }, { "members.userId": session.user.id }],
  })
    .select("_id")
    .lean();

  const teamIds = teams.map((t) => t._id);
  const teamProjects = await Project.find({
    isTeamProject: true,
    teamId: { $in: teamIds },
  })
    .select("_id name description color variableCount isTeamProject teamId")
    .lean();

  // Combine all projects
  const allProjects = [...personalProjects, ...teamProjects];

  // For each project, get the count of changes and last change time
  const projectsWithStats = await Promise.all(
    allProjects.map(async (project) => {
      const historyCount = await VariableHistory.countDocuments({
        projectId: project._id,
      } as any);

      const lastChange = await VariableHistory.findOne({
        projectId: project._id,
      } as any)
        .sort({ createdAt: -1 })
        .select("createdAt")
        .lean();

      return {
        ...project,
        _id: project._id.toString(),
        teamId: project.teamId?.toString(),
        historyCount,
        lastChangeAt: lastChange?.createdAt || project.createdAt || null,
      };
    })
  );

  // Sort by most recent change
  projectsWithStats.sort((a, b) => {
    if (!a.lastChangeAt) return 1;
    if (!b.lastChangeAt) return -1;
    return (
      new Date(b.lastChangeAt).getTime() - new Date(a.lastChangeAt).getTime()
    );
  });

  return <HistoryClient projects={projectsWithStats} />;
}

export default DashboardHistoryPage;
