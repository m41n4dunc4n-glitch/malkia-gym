import { supabase } from "./supabase";

export async function getReportStats() {
  const [
    membersResult,
    activeResult,
    suspendedResult,
    trainersResult,
    bookingsResult,
    pendingBookingsResult,
    plansResult,
    profilesResult,
    membershipPlansResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { head: true, count: "exact" }),

    supabase
      .from("profiles")
      .select("*", { head: true, count: "exact" })
      .eq("status", "Active"),

    supabase
      .from("profiles")
      .select("*", { head: true, count: "exact" })
      .eq("status", "Suspended"),

    supabase
      .from("trainers")
      .select("*", { head: true, count: "exact" }),

    supabase
      .from("bookings")
      .select("*", { head: true, count: "exact" }),

    supabase
      .from("bookings")
      .select("*", { head: true, count: "exact" })
      .eq("status", "Pending"),

    supabase
      .from("membership_plans")
      .select("*", { head: true, count: "exact" }),

    supabase
      .from("profiles")
      .select("membership_id"),

    supabase
      .from("membership_plans")
      .select("id, price"),
  ]);

  const errors = [
    membersResult.error,
    activeResult.error,
    suspendedResult.error,
    trainersResult.error,
    bookingsResult.error,
    pendingBookingsResult.error,
    plansResult.error,
    profilesResult.error,
    membershipPlansResult.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    console.error("Reports error:", errors);
  }

  let revenue = 0;

  const profiles = profilesResult.data || [];
  const membershipPlans = membershipPlansResult.data || [];

  profiles.forEach((member) => {
    const plan = membershipPlans.find(
      (item) => item.id === member.membership_id
    );

    if (plan) {
      revenue += Number(plan.price || 0);
    }
  });

  return {
    revenue,

    members: membersResult.count || 0,

    active: activeResult.count || 0,

    suspended: suspendedResult.count || 0,

    trainers: trainersResult.count || 0,

    bookings: bookingsResult.count || 0,

    pending: pendingBookingsResult.count || 0,

    plans: plansResult.count || 0,
  };
}