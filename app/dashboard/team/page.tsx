import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import TeamClient from "@/components/TeamClient";

async function DashboardTeamPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  await connectMongo();

  const user = await User.findById(session.user.id).lean();

  if (!user) {
    redirect("/");
  }

  // Access control: Only allow Team plan users or users who are part of a team
  const hasTeamPlan = user.plan === "team";
  const isTeamMember = !!user.teamId;

  if (!hasTeamPlan && !isTeamMember) {
    redirect("/dashboard");
  }

  // Pass user data to client component
  return (
    <TeamClient
      user={{
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        plan: user.plan,
        teamId: user.teamId?.toString() || null,
        teamRole: user.teamRole || null,
      }}
    />
  );
}

export default DashboardTeamPage;
