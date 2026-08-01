import { supabase } from "./supabase";

/* ===========================
   Get Trainers
=========================== */

export async function getTrainers() {
  return await supabase
    .from("trainers")
    .select("*")
    .order("name");
}

/* ===========================
   Add Trainer
=========================== */

export async function addTrainer(trainer) {
  return await supabase
    .from("trainers")
    .insert([trainer])
    .select()
    .single();
}

/* ===========================
   Update Trainer
=========================== */

export async function updateTrainer(id, trainer) {
  return await supabase
    .from("trainers")
    .update(trainer)
    .eq("id", id)
    .select()
    .single();
}

/* ===========================
   Delete Trainer
=========================== */

export async function deleteTrainer(id) {
  return await supabase
    .from("trainers")
    .delete()
    .eq("id", id);
}