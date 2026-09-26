import { auth } from "@/libs/next-auth";
import { isSupabaseConfigured } from "@/libs/supabase";
import { getUserById } from "@/libs/users";
import { getUserPlan } from "@/libs/plans";
import { Badge } from "@/components/ui/badge";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({ title: "Dashboard" });

// Private page — the layout already guarantees there's a session.
// It's a server component, so you can query the database directly here.
export default async function Dashboard() {
  const session = await auth();

  const user =
    isSupabaseConfigured && session?.user?.id
      ? await getUserById(session.user.id)
      : null;
  const plan = getUserPlan(user);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Welcome{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        {plan ? (
          <Badge>{plan.name}</Badge>
        ) : (
          <Badge variant="secondary">Free</Badge>
        )}
      </div>

      <div className="border-border bg-background corner-squircle rounded-2xl border p-6">
        <h2 className="mb-1 font-semibold">This is your private area</h2>
        <p className="text-muted-foreground text-sm">
          Start building here. The signed-in user is available server-side via{" "}
          <code className="bg-muted rounded px-1 py-0.5">auth()</code> and
          client-side via{" "}
          <code className="bg-muted rounded px-1 py-0.5">useSession()</code>.
        </p>
      </div>
    </section>
  );
}
