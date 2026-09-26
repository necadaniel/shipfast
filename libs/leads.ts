import "server-only";
import { getSupabase } from "@/libs/supabase";

// Waitlist emails from <ButtonLead />. A repeat signup is a no-op so the
// form doesn't error when someone submits twice.
export const saveLead = async (email: string): Promise<void> => {
  const { error } = await getSupabase()
    .from("leads")
    .upsert(
      { email: email.toLowerCase() },
      { onConflict: "email", ignoreDuplicates: true }
    );

  if (error) throw error;
};
