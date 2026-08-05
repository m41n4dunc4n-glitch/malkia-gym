import { supabase } from "./supabase";

export async function getMembershipPlans() {
  return await supabase
    .from("membership_plans")
    .select("*")
    .order("price");
}

export async function chooseMembership(userId, membershipId) {
  return await supabase
    .from("profiles")
    .update({
      membership_id: membershipId,
      membership_started_at: new Date().toISOString(),
    })
    .eq("id", userId);
}

export async function cancelMembership(userId) {
  return await supabase
    .from("profiles")
    .update({
      membership_id: null,
      membership_started_at: null,
      status: "Inactive",
    })
    .eq("id", userId);
}