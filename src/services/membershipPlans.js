import { supabase } from "./supabase";

export async function getPlans() {
  return await supabase
    .from("membership_plans")
    .select("*")
    .order("price");
}

export async function addPlan(plan) {
  return await supabase
    .from("membership_plans")
    .insert(plan)
    .select()
    .single();
}

export async function updatePlan(id, plan) {
  return await supabase
    .from("membership_plans")
    .update(plan)
    .eq("id", id)
    .select()
    .single();
}

export async function deletePlan(id) {
  return await supabase
    .from("membership_plans")
    .delete()
    .eq("id", id);
}