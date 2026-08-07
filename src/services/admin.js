import { supabase } from "./supabase";

/*
|--------------------------------------------------------------------------
| DASHBOARD STATS
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| MEMBERS
|--------------------------------------------------------------------------
*/

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

export async function deleteMember(id) {
  return await supabase
    .from("profiles")
    .delete()
    .eq("id", id);
}

/*
|--------------------------------------------------------------------------
| ACTIVE ADMIN BOOKINGS
|--------------------------------------------------------------------------
|
| Admin sees only Pending + Approved bookings here.
| admin_deleted = false means the booking has not been
| hidden from the admin's side.
|
|--------------------------------------------------------------------------
*/

export async function getAllBookings() {
  return await supabase
    .from("bookings")
    .select(`
      *,
      profiles (
        full_name,
        email
      ),
      trainers (
        name,
        specialty
      )
    `)
    .eq("admin_deleted", false)
    .in("status", ["Pending", "Approved"])
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true });
}

/*
|--------------------------------------------------------------------------
| ADMIN BOOKING HISTORY
|--------------------------------------------------------------------------
|
| Completed + Cancelled bookings appear here.
|
|--------------------------------------------------------------------------
*/

export async function getBookingHistory() {
  return await supabase
    .from("bookings")
    .select(`
      *,
      profiles (
        full_name,
        email
      ),
      trainers (
        name,
        specialty
      )
    `)
    .eq("admin_deleted", false)
    .in("status", ["Completed", "Cancelled"])
    .order("booking_date", { ascending: false })
    .order("booking_time", { ascending: false });
}

/*
|--------------------------------------------------------------------------
| UPDATE BOOKING STATUS
|--------------------------------------------------------------------------
*/

export async function updateBookingStatus(id, status) {
  return await supabase
    .from("bookings")
    .update({
      status,
    })
    .eq("id", id);
}

/*
|--------------------------------------------------------------------------
| ADMIN DELETE / HIDE HISTORY
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This does NOT delete the booking from the database.
| It only hides it from the ADMIN.
|
| The member can still see their own history.
|
|--------------------------------------------------------------------------
*/

export async function deleteAdminHistoryBooking(id) {
  return await supabase
    .from("bookings")
    .update({
      admin_deleted: true,
    })
    .eq("id", id);
}