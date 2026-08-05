import { supabase } from "./supabase";

export async function submitFeedback(feedback) {
  return await supabase
    .from("feedback")
    .insert(feedback);
}

export async function getFeedback() {
  return await supabase
    .from("feedback")
    .select(`
      *,
      profiles(
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });
}