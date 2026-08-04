import { supabase } from "./supabase";

/* Get one profile */
export async function getProfile(id) {
  return await supabase
    .from("profiles")
    .select(`
      *,
      membership_plans(
        id,
        name,
        price,
        duration
      )
    `)
    .eq("id", id)
    .single();
}

/* Update profile */
export async function updateProfile(id, updates) {
  return await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id);
}