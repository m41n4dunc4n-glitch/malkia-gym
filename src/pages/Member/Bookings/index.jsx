import { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useAuth } from "../../../hooks/useAuth";
import { generateTimeSlots } from "../../../utils/generateTimeSlots";

import {
  getTrainers,
  createBooking,
  getMyBookings,
  cancelBooking,
  deleteBooking,
  checkTrainerAvailability,
} from "../../../services/booking";

function Bookings() {
  const { user } = useAuth();

  const [trainers, setTrainers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState("");

  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    const { data: trainerData } = await getTrainers();
    const { data: bookingData } = await getMyBookings(user.id);

    setTrainers(trainerData || []);
    setBookings(bookingData || []);

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;

    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadData, user]);

  const trainer = trainers.find(
    (item) => item.id === selectedTrainer
  );

  const availableTimes = trainer
    ? generateTimeSlots(trainer)
    : [];

  const filterDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return false;
    }

    if (!trainer) {
      return true;
    }

    const selectedDay = date
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();

    return Boolean(trainer[selectedDay]);
  };

  async function handleBooking(e) {
    e.preventDefault();

    if (!selectedTrainer) {
      alert("Please choose a trainer.");
      return;
    }

    if (!bookingDate) {
      alert("Select a booking date.");
      return;
    }

    if (!bookingTime) {
      alert("Select a booking time.");
      return;
    }

    const selectedDay = new Date(bookingDate)
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();

    if (!trainer[selectedDay]) {
      alert(
        `${trainer.name} does not work on ${selectedDay.charAt(0).toUpperCase() +
        selectedDay.slice(1)
        }.`
      );
      return;
    }

    const { data: existing } =
      await checkTrainerAvailability(
        selectedTrainer,
        bookingDate.toISOString().split("T")[0],
        bookingTime
      );

    if (
      existing.length >=
      (trainer.max_clients || 1)
    ) {
      alert(
        "This trainer is fully booked at that time."
      );
      return;
    }

    const { error } = await createBooking({
      member_id: user.id,
      trainer_id: selectedTrainer,
      booking_date: bookingDate
        .toISOString()
        .split("T")[0],
      booking_time: bookingTime,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Booking request sent successfully. Waiting for admin approval."
    );

    setSelectedTrainer("");
    setBookingDate(null);
    setBookingTime("");

    loadData();
  }

async function handleDelete(id) {

  const confirmed = window.confirm(
    "Remove this completed training from your history?"
  );

  if (!confirmed) return;


  const { error } = await deleteBooking(id);


  if (error) {
    alert(error.message);
    return;
  }


  alert("Training removed from history.");

  loadData();

}

  async function handleCancel(id) {
    if (
      !window.confirm(
        "Cancel this booking?"
      )
    )
      return;

    const { error } =
      await cancelBooking(id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Booking cancelled.");

    loadData();
  }

  return (
    <div className="space-y-10">

      {/* BOOK SESSION */}

      <div className="rounded-3xl bg-white p-8 shadow">

        <h1 className="text-4xl font-bold">
          Book a Training Session
        </h1>

        <p className="mt-2 text-gray-500">
          Choose your trainer, select an
          available date and pick an available
          time slot.
        </p>

        <form
          onSubmit={handleBooking}
          className="mt-8 space-y-8"
        >
          {/* TRAINER */}

          <div>

            <label className="mb-3 block text-xl font-bold">
              Select Trainer
            </label>

            <select
              value={selectedTrainer}
              onChange={(e) => {
                setSelectedTrainer(e.target.value);
                setBookingTime("");
              }}
              className="w-full rounded-xl border p-4 outline-none focus:border-pink-600"
            >
              <option value="">
                Choose a Trainer
              </option>

              {trainers.map((trainer) => (
                <option
                  key={trainer.id}
                  value={trainer.id}
                >
                  {trainer.name} • {trainer.specialty}
                </option>
              ))}

            </select>

          </div>

          {/* TRAINER DETAILS */}

          {trainer && (

            <div className="overflow-hidden rounded-3xl border bg-gray-50">

              <div className="grid gap-6 p-6 md:grid-cols-[250px_1fr]">

                <img
                  src={
                    trainer.image_url ||
                    "https://placehold.co/400x500?text=Trainer"
                  }
                  alt={trainer.name}
                  className="h-72 w-full rounded-2xl object-cover"
                />

                <div>

                  <h2 className="text-3xl font-bold">
                    {trainer.name}
                  </h2>

                  <p className="mt-2 text-lg font-semibold text-pink-600">
                    {trainer.specialty}
                  </p>

                  <p className="mt-3 text-gray-600">
                    {trainer.bio}
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">

                    <div className="rounded-xl bg-white p-4 shadow-sm">

                      <h3 className="font-bold">
                        Experience
                      </h3>

                      <p className="mt-2">
                        🏆 {trainer.experience} Years
                      </p>

                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm">

                      <h3 className="font-bold">
                        Capacity
                      </h3>

                      <p className="mt-2">
                        👥 Up to {trainer.max_clients} members per session
                      </p>

                    </div>

                  </div>

                  <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">

                    <h3 className="mb-4 text-lg font-bold">
                      Working Schedule
                    </h3>

                    <div className="grid gap-3 md:grid-cols-3">

                      <div>
                        <p className="font-semibold">
                          🌅 Morning
                        </p>

                        <p>
                          {trainer.morning_start} - {trainer.morning_end}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold">
                          🍽 Lunch
                        </p>

                        <p>
                          {trainer.lunch_start} - {trainer.lunch_end}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold">
                          🌙 Evening
                        </p>

                        <p>
                          {trainer.evening_start} - {trainer.evening_end}
                        </p>
                      </div>

                    </div>

                  </div>

                  <div className="mt-6">

                    <h3 className="mb-3 text-lg font-bold">
                      Working Days
                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {[
                        ["Monday", trainer.monday],
                        ["Tuesday", trainer.tuesday],
                        ["Wednesday", trainer.wednesday],
                        ["Thursday", trainer.thursday],
                        ["Friday", trainer.friday],
                        ["Saturday", trainer.saturday],
                        ["Sunday", trainer.sunday],
                      ].map(([day, active]) => (

                        <span
                          key={day}
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-500"
                            }`}
                        >
                          {day}
                        </span>

                      ))}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          )}
          {/* DATE & TIME */}

          <div className="grid gap-8 lg:grid-cols-2">

            {/* DATE */}

            <div className="rounded-3xl border p-6">

              <h3 className="mb-5 text-2xl font-bold">
                Select Date
              </h3>

              <DatePicker
                selected={bookingDate}
                onChange={(date) => setBookingDate(date)}
                filterDate={filterDate}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select booking date"
                className="w-full rounded-xl border p-4 outline-none focus:border-pink-500"
              />

              <p className="mt-4 text-sm text-gray-500">
                Bookings require admin approval before becoming active.
              </p>

            </div>

            {/* TIME */}

            <div className="rounded-3xl border p-6">

              <h3 className="mb-5 text-2xl font-bold">
                Select Time
              </h3>

              {!selectedTrainer && (

                <div className="rounded-xl bg-gray-100 p-8 text-center text-gray-500">

                  Select a trainer first.

                </div>

              )}

              {selectedTrainer && availableTimes.length === 0 && (

                <div className="rounded-xl bg-yellow-100 p-8 text-center text-yellow-700">

                  No available time slots.

                </div>

              )}

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">

                {availableTimes.map((time) => (

                  <button
                    key={time}
                    type="button"
                    onClick={() => setBookingTime(time)}
                    className={`rounded-xl border py-3 font-semibold transition ${bookingTime === time
                        ? "border-pink-600 bg-pink-600 text-white"
                        : "hover:border-pink-500 hover:bg-pink-50"
                      }`}
                  >
                    {time}
                  </button>

                ))}

              </div>

            </div>

          </div>

          {/* SUMMARY */}

          {selectedTrainer &&
            bookingDate &&
            bookingTime && (

              <div className="rounded-3xl border-l-8 border-pink-600 bg-pink-50 p-6">

                <h3 className="mb-4 text-2xl font-bold">

                  Booking Summary

                </h3>

                <div className="space-y-2 text-lg">

                  <p>

                    👤 <strong>Trainer:</strong>{" "}
                    {trainer.name}

                  </p>

                  <p>

                    💪 <strong>Specialty:</strong>{" "}
                    {trainer.specialty}

                  </p>

                  <p>
                    📅 <strong>Date:</strong>{" "}
                    {bookingDate
                      ? bookingDate.toLocaleDateString()
                      : "-"}
                  </p>
                  <p>

                    🕒 <strong>Time:</strong>{" "}
                    {bookingTime}

                  </p>

                  <p>

                    ⏳ <strong>Status:</strong> Pending Approval

                  </p>

                </div>

              </div>

            )}

          <button
            type="submit"
            className="rounded-xl bg-pink-600 px-10 py-4 text-lg font-bold text-white transition hover:bg-pink-700"
          >
            Submit Booking Request
          </button>

        </form>

      </div>

      {/* MY BOOKINGS */}

      <div>

        <h2 className="mb-8 text-4xl font-bold">
          My Bookings
        </h2>

        <div className="space-y-6">

          {loading && (

            <div className="rounded-3xl bg-white p-10 text-center shadow">

              Loading your bookings...

            </div>

          )}

          {!loading && bookings.length === 0 && (

            <div className="rounded-3xl bg-white p-10 text-center shadow">

              <h3 className="text-2xl font-bold">
                No Bookings Yet
              </h3>

              <p className="mt-3 text-gray-500">
                Once you request a training session it will appear here.
              </p>

            </div>

          )}

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="overflow-hidden rounded-3xl bg-white shadow-lg"
            >

              <div className="grid gap-6 p-6 lg:grid-cols-[130px_1fr_auto]">

                {/* Trainer Image */}

                <img
                  src={
                    booking.trainers.image_url ||
                    "https://placehold.co/300x300?text=Trainer"
                  }
                  alt={booking.trainers.name}
                  className="h-32 w-32 rounded-2xl object-cover"
                />

                {/* Details */}

                <div>

                  <h3 className="text-2xl font-bold">
                    {booking.trainers.name}
                  </h3>

                  <p className="font-semibold text-pink-600">
                    {booking.trainers.specialty}
                  </p>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">

                    <p>
                      📅 <strong>Date:</strong>{" "}
                      {booking.booking_date}
                    </p>

                    <p>
                      🕒 <strong>Time:</strong>{" "}
                      {booking.booking_time}
                    </p>

                    <p>
                      📝 <strong>Booking ID:</strong>{" "}
                      {booking.id}
                    </p>

                    <p>
                      👤 <strong>Member:</strong> You
                    </p>

                  </div>

                </div>

                {/* Status */}

                <div className="flex flex-col items-end justify-between">

                  <span
                    className={`rounded-full px-5 py-2 font-bold ${booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : booking.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Completed"
                            ? "bg-blue-100 text-blue-700"
                            : booking.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {booking.status}
                  </span>

                  {booking.status === "Pending" && (

<button
  onClick={() => handleCancel(booking.id)}
  className="w-full rounded-xl bg-red-600 px-6 py-3 text-white transition hover:bg-red-700 md:w-auto"
>
  Cancel Booking
</button>

)}


{booking.status === "Completed" && (

<button
  onClick={() => handleDelete(booking.id)}
  className="w-full rounded-xl bg-gray-900 px-6 py-3 text-white transition hover:bg-black md:w-auto"
>
  Remove History
</button>

)}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}

export default Bookings;