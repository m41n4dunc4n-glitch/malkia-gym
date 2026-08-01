import { supabase } from "./supabase";

export async function getMemberDashboard(userId) {
  const [
    profile,
    bookings,
    pending,
    completed,
    nextBooking,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(`
        *,
        membership_plans(
          name,
          duration
        )
      `)
      .eq("id", userId)
      .single(),

    supabase
      .from("bookings")
      .select(`
        *,
        trainers(name)
      `)
      .eq("member_id", userId)
      .order("booking_date", { ascending: false }),

    supabase
      .from("bookings")
      .select("*", { head: true, count: "exact" })
      .eq("member_id", userId)
      .eq("status", "Pending"),

    supabase
      .from("bookings")
      .select("*", { head: true, count: "exact" })
      .eq("member_id", userId)
      .eq("status", "Completed"),

    supabase
      .from("bookings")
      .select(`
        *,
        trainers(name)
      `)
      .eq("member_id", userId)
      .gte("booking_date", new Date().toISOString().split("T")[0])
      .order("booking_date")
      .limit(1)
      .single(),
  ]);

  return {
    profile: profile.data,
    bookings: bookings.data || [],
    pending: pending.count || 0,
    completed: completed.count || 0,
    nextBooking: nextBooking.data,
  };
}