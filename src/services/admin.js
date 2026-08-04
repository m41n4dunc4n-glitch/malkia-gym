import { supabase } from "./supabase";

export async function getDashboardStats() {
  const [members, trainers, bookings, pending] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("trainers")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "Pending"),
    ]);

  return {
    members: members.count || 0,
    trainers: trainers.count || 0,
    bookings: bookings.count || 0,
    pending: pending.count || 0,
  };
}

export async function getMembers() {
  return await supabase
    .from("profiles")
    .select(`
      *,
      membership_plans (
        name
      )
    `)
    .order("created_at", { ascending: false });
}

export async function updateMemberRole(id, role) {
  return await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id);
}

export async function getAllBookings() {
  const today = new Date().toISOString().split("T")[0];

  const response = await supabase
    .from("bookings")
    .select(`
      *,
      profiles!bookings_member_id_fkey(
        id,
        full_name,
        email
      ),
      trainers!bookings_trainer_id_fkey(
        id,
        name,
        specialty
      )
    `)
    .gte("booking_date", today)
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true });

  return response;
}

export async function updateBookingStatus(id, status) {
  return await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);
}

// Suspend / Activate
export async function updateMemberStatus(id, status) {
  return await supabase
    .from("profiles")
    .update({ status })
    .eq("id", id)
    .select();
}

export async function changeRole(id, role) {
  return await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select();
}