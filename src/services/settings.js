/* eslint-disable no-unused-vars */
import { supabase } from "./supabase";

export async function getGymSettings() {
  return await supabase
    .from("gym_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
}

export async function updateGymSettings(settings) {
  const {
    id,
    created_at,
    ...updateData
  } = settings;

  return await supabase
    .from("gym_settings")
    .update(updateData)
    .eq("id", 1)
    .select()
    .maybeSingle();
}