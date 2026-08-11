import { supabase } from "./supabase";

/* =========================================================
   GET ALL TRAINERS
========================================================= */

export async function getTrainers() {
  return await supabase
    .from("trainers")
    .select("*")
    .order("name");
}


/* =========================================================
   GET TRAINER BY USER ID
   Used when a trainer logs into their account.
========================================================= */

export async function getTrainerByUserId(userId) {
  return await supabase
    .from("trainers")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
}


/* =========================================================
   ADD TRAINER
========================================================= */

export async function addTrainer(trainer) {
  return await supabase
    .from("trainers")
    .insert([trainer])
    .select()
    .single();
}


/* =========================================================
   UPDATE TRAINER
========================================================= */

export async function updateTrainer(id, trainer) {
  return await supabase
    .from("trainers")
    .update(trainer)
    .eq("id", id)
    .select()
    .single();
}


/* =========================================================
   DELETE TRAINER
========================================================= */

export async function deleteTrainer(id) {
  return await supabase
    .from("trainers")
    .delete()
    .eq("id", id);
}


/* =========================================================
   LINK TRAINER TO USER ACCOUNT
========================================================= */

export async function linkTrainerToUser(trainerId, userId) {
  return await supabase
    .from("trainers")
    .update({
      user_id: userId,
    })
    .eq("id", trainerId)
    .select()
    .single();
}


/* =========================================================
   REMOVE TRAINER ACCOUNT LINK
========================================================= */

export async function unlinkTrainerFromUser(trainerId) {
  return await supabase
    .from("trainers")
    .update({
      user_id: null,
    })
    .eq("id", trainerId)
    .select()
    .single();
}

/* ===========================
   Promote Member To Trainer
=========================== */

export async function promoteMemberToTrainer(member) {
  return await supabase
    .from("trainers")
    .insert([
      {
        user_id: member.id,
        name: member.full_name || "",
        specialty: "Fitness Trainer",
        experience: 0,
        phone: member.phone || "",
        email: member.email || "",
        bio: "",
        image_url: member.avatar_url || "",
        morning_start: "08:00",
        morning_end: "12:00",
        lunch_start: "12:00",
        lunch_end: "14:00",
        evening_start: "14:00",
        evening_end: "20:00",
        max_clients: 1,
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: false,
      },
    ])
    .select()
    .single();
}