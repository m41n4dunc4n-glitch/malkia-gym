import { supabase } from "./supabase";
// eslint-disable-next-line no-unused-vars
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export async function getTrainers() {
  return await supabase
    .from("trainers")
    .select("*")
    .order("name");
}

export async function createBooking(booking) {
  const response = await supabase
    .from("bookings")
    .insert([
      {
        ...booking,
        status: "Pending",
      },
    ])
    .select();

  console.log("Booking Insert:", response);

  return response;
}

export async function deleteBooking(id) {

  return await supabase
    .from("bookings")
    .delete()
    .eq("id", id);

}

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
    .order("booking_date");
}

export async function cancelBooking(id) {
  const response = await supabase
    .from("bookings")
    .delete()
    .eq("id", id)
    .select();

  console.log(response);

  return response;
}

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
    .neq("status", "Cancelled");
}