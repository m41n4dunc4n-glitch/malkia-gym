import { supabase } from "./supabase";

export async function getPlans() {
  return await supabase
    .from("membership_plans")
    .select("*")
    .order("price");
}

export async function createPlan(plan) {
  return await supabase
    .from("membership_plans")
    .insert([plan]);
}

export async function updatePlan(id, plan) {
  return await supabase
    .from("membership_plans")
    .update(plan)
    .eq("id", id);
}

export async function deletePlan(id) {
  return await supabase
    .from("membership_plans")
    .delete()
    .eq("id", id);
}