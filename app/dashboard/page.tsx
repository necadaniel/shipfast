import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Project from "@/models/Project";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server component which means you can fetch data (like the user profile) before the page is rendered.
export default async function Dashboard() {
  const session = await auth();

  // Fetch user's projects from database
  await connectMongo();
  const projects = await Project.find({ userId: session?.user?.id })
    .sort({ createdAt: -1 })
    .lean();

  // Convert MongoDB documents to plain objects and serialize dates
  const serializedProjects = projects.map((project) => ({
    _id: project._id.toString(),
    name: project.name,
    description: project.description || "",
    color: project.color,
    variableCount: project.variableCount || 0,
    userId: project.userId.toString(),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    lastSyncedAt: project.lastSyncedAt?.toISOString() || null,
  }));

  return <DashboardClient projects={serializedProjects} />;
}
