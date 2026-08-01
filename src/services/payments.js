import { supabase } from "./supabase";

/* Member */

export async function createPayment(payment) {
  return await supabase
    .from("payments")
    .insert([payment]);
}

export async function getMyPayments(userId) {
  return await supabase
    .from("payments")
    .select(`
      *,
      membership_plans(
        name,
        price
      )
    `)
    .eq("member_id", userId)
    .order("created_at", { ascending: false });
}

/* Admin */

export async function getAllPayments() {
  return await supabase
    .from("payments")
    .select(`
      *,
      profiles(
        full_name,
        email
      ),
      membership_plans(
        name,
        price
      )
    `)
    .order("created_at", { ascending: false });
}

export async function approvePayment(payment) {

  // Approve payment
  await supabase
    .from("payments")
    .update({
      status: "Approved",
    })
    .eq("id", payment.id);

  // Activate member membership
  await supabase
    .from("profiles")
    .update({
      membership_id: payment.membership_id,
      status: "Active",
    })
    .eq("id", payment.member_id);
}

export async function rejectPayment(id) {
  return await supabase
    .from("payments")
    .update({
      status: "Rejected",
    })
    .eq("id", id);
}