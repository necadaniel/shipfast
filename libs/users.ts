import "server-only";
import { getSupabase } from "@/libs/supabase";
import type { Database, User } from "@/types/database";

// Auth.js owns next_auth.users (the schema name is fixed by
// @auth/supabase-adapter). Billing fields are extra columns on that table.

type UserUpdate = Pick<
  Database["next_auth"]["Tables"]["users"]["Update"],
  "name" | "email" | "image" | "customerId" | "priceId" | "hasAccess"
>;

const users = () => getSupabase().schema("next_auth").from("users");

export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await users().select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return data;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await users()
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getUserByCustomerId = async (
  customerId: string
): Promise<User | null> => {
  const { data, error } = await users()
    .select("*")
    .eq("customerId", customerId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

/** Inserts a user who paid before they had an account (payment link, etc.). */
export const createUser = async (input: {
  email: string;
  name?: string | null;
}): Promise<User> => {
  const { data, error } = await users()
    .insert({
      email: input.email.toLowerCase(),
      name: input.name ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
};

export const updateUser = async (
  id: string,
  patch: UserUpdate
): Promise<User> => {
  const { data, error } = await users()
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
};
