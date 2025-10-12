import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/libs/next-auth";
import config from "@/config";
import DashboardSidebar from "@/components/DashboardSidebar";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Team from "@/models/Team";

// This is a server-side component to ensure the user is logged in.
// If not, it will redirect to the login page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
export default async function LayoutPrivate({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect(config.auth.loginUrl);
  }

  await connectMongo();

  // Fetch user to check plan
  const user: any = await User.findById(session.user.id).lean();

  // Check if user is in any team (owner or member)
  const isInAnyTeam = await Team.exists({
    $or: [{ ownerId: user._id }, { "members.userId": user._id }],
  });

  const showTeamNav = user?.plan === "team" || !!isInAnyTeam;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <DashboardSidebar showTeamNav={showTeamNav} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-16 lg:pt-0">
        <div className="min-h-full">{children}</div>
      </main>
    </div>
  );
}
