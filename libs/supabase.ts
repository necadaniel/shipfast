import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Server-only Supabase client. The service role key bypasses row level
// security, so this module must never be imported from a client component —
// the `server-only` import fails the build if that happens.
//
// NextAuth uses the same project through @auth/supabase-adapter. App queries
// go through this client (libs/users.ts, libs/leads.ts).
//
// Missing env vars leave the client uncreated so a fresh clone still boots.
// CI builds with no secrets.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && serviceRoleKey);

/** Passed straight to SupabaseAdapter. Undefined when env vars are missing. */
export const getSupabaseAuthConfig = ():
  { url: string; secret: string } | undefined => {
  if (!url || !serviceRoleKey) return undefined;
  return { url, secret: serviceRoleKey };
};

if (!isSupabaseConfigured) {
  console.warn(
    "⚠️  Supabase is not configured — user accounts and magic links are disabled.\n" +
      "   Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local\n" +
      "   (see .env.example), run supabase/migrations, and expose the next_auth schema."
  );
}

let client: SupabaseClient<Database> | undefined;

/**
 * Returns the service-role client. Throws a readable error at call time when
 * the env vars are missing — never at import time.
 */
export const getSupabase = (): SupabaseClient<Database> => {
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local — see .env.example."
    );
  }

  if (!client) {
    client = createClient<Database>(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return client;
};
