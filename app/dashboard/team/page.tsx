import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Team from "@/models/Team";
import TeamsListClient from "@/components/TeamsListClient";

async function DashboardTeamPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  await connectMongo();

  const user: any = await User.findById(session.user.id).lean();

  if (!user) {
    redirect("/");
  }

  // Fetch all teams user owns or is a member of
  const teams = await Team.find({
    $or: [{ ownerId: user._id }, { "members.userId": user._id }],
  })
    .select("name ownerId members memberCount createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();

  // Access control: Allow if user has Team plan OR is a member of any team
  const hasTeamPlan = user.plan === "team";
  const isMemberOfAnyTeam = teams.length > 0;

  if (!hasTeamPlan && !isMemberOfAnyTeam) {
    redirect("/dashboard");
  }

  // Fetch project counts for each team
  const Project = (await import("@/models/Project")).default;
  const teamIds = teams.map((team) => team._id);

  const projectCounts = await Project.aggregate([
    {
      $match: {
        isTeamProject: true,
        teamId: { $in: teamIds },
      },
    },
    {
      $group: {
        _id: "$teamId",
        count: { $sum: 1 },
      },
    },
  ]);

  // Create a map for quick lookup
  const projectCountMap = new Map(
    projectCounts.map((pc) => [pc._id.toString(), pc.count])
  );

  // Add user's role and project count to each team
  const teamsWithRole = teams.map((team) => {
    let role = "member";

    if (team.ownerId.toString() === user._id.toString()) {
      role = "owner";
    } else {
      const member = team.members.find(
        (m: any) => m.userId.toString() === user._id.toString()
      );
      if (member) {
        role = member.role;
      }
    }

    return {
      id: team._id.toString(),
      name: team.name,
      ownerId: team.ownerId.toString(),
      memberCount: team.memberCount || team.members.length + 1,
      projectCount: projectCountMap.get(team._id.toString()) || 0,
      userRole: role,
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt.toISOString(),
    };
  });

  // Pass user and teams data to client component
  return (
    <TeamsListClient
      user={{
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        plan: user.plan,
      }}
      teams={teamsWithRole}
    />
  );
}

export default DashboardTeamPage;
