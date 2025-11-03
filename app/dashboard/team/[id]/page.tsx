import { auth } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Team from "@/models/Team";
import TeamDetailClient from "@/components/TeamDetailClient";

export const dynamic = "force-dynamic";

export default async function TeamDetailPage({
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

  const user: any = await User.findById(session.user.id).lean();

  if (!user) {
    redirect("/");
  }

  // Fetch team
  const team: any = await Team.findById(id)
    .populate("owner", "name email image")
    .populate("members.userId", "name email image")
    .populate("pendingInvitations.invitedBy", "name email")
    .lean();

  if (!team) {
    redirect("/dashboard/team");
  }

  // Check if user has access (is owner or member)
  const isOwner = team.owner._id.toString() === user._id.toString();
  const isMember = team.members.some(
    (m: any) =>
      m.userId &&
      m.userId._id &&
      m.userId._id.toString() === user._id.toString()
  );

  if (!isOwner && !isMember) {
    redirect("/dashboard/team");
  }

  // Determine user's role
  let userRole = "member";
  if (isOwner) {
    userRole = "owner";
  } else {
    const member = team.members.find(
      (m: any) =>
        m.userId &&
        m.userId._id &&
        m.userId._id.toString() === user._id.toString()
    );
    if (member) {
      userRole = member.role;
    }
  }

  // Serialize team data
  const serializedTeam = {
    id: team._id.toString(),
    name: team.name,
    ownerId: team.ownerId.toString(),
    owner: {
      id: team.owner._id.toString(),
      name: team.owner.name || "Unknown",
      email: team.owner.email || "",
      image: team.owner.image || null,
    },
    members: team.members
      .filter((m: any) => m.userId && m.userId._id)
      .map((m: any) => ({
        userId: m.userId._id.toString(),
        name: m.userId.name || m.email || "Unknown User",
        email: m.userId.email || m.email || "",
        image: m.userId.image || null,
        role: m.role,
        joinedAt: m.joinedAt.toISOString(),
      })),
    pendingInvitations: team.pendingInvitations.map((inv: any) => ({
      email: inv.email,
      role: inv.role,
      token: inv.token,
      invitedBy: {
        id: inv.invitedBy._id.toString(),
        name: inv.invitedBy.name,
        email: inv.invitedBy.email,
      },
      sentAt: inv.sentAt.toISOString(),
      expiresAt: inv.expiresAt.toISOString(),
    })),
    memberCount: team.memberCount || team.members.length + 1,
    createdAt: team.createdAt.toISOString(),
    updatedAt: team.updatedAt.toISOString(),
  };

  return (
    <TeamDetailClient
      team={serializedTeam}
      userRole={userRole}
      currentUserId={user._id.toString()}
    />
  );
}
