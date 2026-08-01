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
    })
    .eq("id", userId);
}