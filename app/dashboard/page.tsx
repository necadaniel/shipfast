import { auth } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server component which means you can fetch data (like the user profile) before the page is rendered.
export default async function Dashboard() {
  return <div>Protected Page</div>;
}
