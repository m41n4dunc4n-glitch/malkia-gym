import { supabase } from "./supabase";

export async function deleteAccount(userId) {
  return await supabase
    .from("profiles")
    .update({
      status: "Deleted",
      membership_id: null,
      membership_started_at: null,
    })
    .eq("id", userId);
}