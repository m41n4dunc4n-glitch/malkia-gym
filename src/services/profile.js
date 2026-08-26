import { supabase } from "./supabase";

/* =====================================================
   GET ONE PROFILE
===================================================== */

export async function getProfile(id) {
  if (!id) {
    return {
      data: null,
      error: new Error("User ID is missing."),
    };
  }

  return await supabase
    .from("profiles")
    .select(`
      *,
      membership_plans (
        id,
        name,
        price,
        duration,
        description
      )
    `)
    .eq("id", id)
    .single();
}

/* =====================================================
   UPDATE PROFILE
===================================================== */

export async function updateProfile(id, updates) {
  if (!id) {
    return {
      data: null,
      error: new Error("User ID is missing."),
    };
  }

  return await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select(`
      *,
      membership_plans (
        id,
        name,
        price,
        duration,
        description
      )
    `)
    .single();
}