import { supabase } from "./supabase";

/*
|--------------------------------------------------------------------------
| TRAINERS
|--------------------------------------------------------------------------
*/

export async function getTrainers() {
  return await supabase
    .from("trainers")
    .select("*")
    .order("name");
}

/*
|--------------------------------------------------------------------------
| CREATE BOOKING
|--------------------------------------------------------------------------
*/

export async function createBooking(booking) {
  return await supabase
    .from("bookings")
    .insert([
      {
        ...booking,
        status: "Pending",
        member_deleted: false,
        admin_deleted: false,
      },
    ])
    .select();
}

/*
|--------------------------------------------------------------------------
| MEMBER ACTIVE BOOKINGS
|--------------------------------------------------------------------------
|
| Only Pending and Approved bookings appear here.
| Completed and Cancelled bookings belong in History.
|
*/

export async function getMyBookings(userId) {
  return await supabase
    .from("bookings")
    .select(`
      *,
      trainers (
        name,
        specialty,
        image_url
      )
    `)
    .eq("member_id", userId)
    .eq("member_deleted", false)
    .in("status", ["Pending", "Approved"])
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true });
}

/*
|--------------------------------------------------------------------------
| MEMBER BOOKING HISTORY
|--------------------------------------------------------------------------
|
| Completed + Cancelled only.
|
*/

export default async function getMyBookingHistory(userId) {
  return await supabase
    .from("bookings")
    .select(`
      *,
      trainers (
        name,
        specialty
      )
    `)
    .eq("member_id", userId)
    .eq("member_deleted", false)
    .in("status", ["Completed", "Cancelled"])
    .order("booking_date", {
      ascending: false,
    });
}

export async function deleteMemberHistoryBooking(id) {
  return await supabase
    .from("bookings")
    .update({
      member_deleted: true,
    })
    .eq("id", id);
}
/*
|--------------------------------------------------------------------------
| MEMBER CANCEL BOOKING
|--------------------------------------------------------------------------
|
| We keep the booking record because it becomes history.
|
*/

export async function cancelBooking(id) {
  return await supabase
    .from("bookings")
    .update({
      status: "Cancelled",
    })
    .eq("id", id);
}

/*
|--------------------------------------------------------------------------
| CHECK TRAINER AVAILABILITY
|--------------------------------------------------------------------------
*/

export async function checkTrainerAvailability(
  trainerId,
  bookingDate,
  bookingTime
) {
  return await supabase
    .from("bookings")
    .select("id")
    .eq("trainer_id", trainerId)
    .eq("booking_date", bookingDate)
    .eq("booking_time", bookingTime)
    .neq("status", "Cancelled")
    .eq("member_deleted", false);
}