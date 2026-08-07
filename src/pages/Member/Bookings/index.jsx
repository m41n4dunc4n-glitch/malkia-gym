import { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../../hooks/useAuth";
import { generateTimeSlots } from "../../../utils/generateTimeSlots";

import {
  getTrainers,
  createBooking,
  getMyBookings,
  cancelBooking,
  deleteMemberHistoryBooking,
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

    const { error } =
      await deleteMemberHistoryBooking(id);

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
    <div className="space-y-10 pb-10">

      {/* =====================================================
          BOOKING HEADER
      ====================================================== */}

      <div className="relative overflow-hidden rounded-4xl bg-black px-6 py-8 text-white shadow-xl md:px-10 md:py-10">

        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="absolute -bottom-20 left-20 h-48 w-48 rounded-full bg-pink-600/10 blur-3xl" />

        <div className="relative">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-pink-600/20 px-4 py-2 text-sm font-semibold text-pink-400">
            <span>💪</span>
            Personal Training
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            Book Your Training Session
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300 md:text-base">
            Choose your trainer, find a suitable date and select
            an available training time that fits your schedule.
          </p>

        </div>

      </div>


      {/* =====================================================
          BOOK SESSION
      ====================================================== */}

      <div className="overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-xl">

        {/* Section Header */}

        <div className="border-b border-gray-100 bg-gray-50/70 px-6 py-6 md:px-8">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-2xl font-black text-gray-900 md:text-3xl">
                Schedule a Session
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Follow the steps below to request your training.
              </p>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-xl">
              📅
            </div>

          </div>

        </div>


        <form
          onSubmit={handleBooking}
          className="space-y-10 p-6 md:p-8"
        >

          {/* =====================================================
              TRAINER
          ====================================================== */}

          <div>

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
                01
              </div>

              <div>
                <h3 className="font-bold text-gray-900">
                  Choose Your Trainer
                </h3>

                <p className="text-sm text-gray-500">
                  Select the trainer you'd like to work with.
                </p>
              </div>

            </div>

            <select
              value={selectedTrainer}
              onChange={(e) => {
                setSelectedTrainer(e.target.value);
                setBookingTime("");
              }}
              className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 font-medium text-gray-700 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10"
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


          {/* =====================================================
              TRAINER DETAILS
          ====================================================== */}

          {trainer && (

            <div className="overflow-hidden rounded-4xl border border-gray-200 bg-gray-50">

              <div className="grid gap-7 p-5 md:grid-cols-[240px_1fr] md:p-7">

                <div className="relative">

                  <img
                    src={
                      trainer.image_url ||
                      "https://placehold.co/400x500?text=Trainer"
                    }
                    alt={trainer.name}
                    className="h-72 w-full rounded-2xl object-cover shadow-lg md:h-full md:min-h-90"
                  />

                  <div className="absolute bottom-4 left-4 rounded-xl bg-black/80 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                    ⭐ Professional Trainer
                  </div>

                </div>


                <div className="flex flex-col justify-center">

                  <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
                    Your Trainer
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-gray-900">
                    {trainer.name}
                  </h2>

                  <p className="mt-1 text-lg font-bold text-pink-600">
                    {trainer.specialty}
                  </p>

                  <p className="mt-4 leading-7 text-gray-600">
                    {trainer.bio}
                  </p>


                  {/* Trainer Stats */}

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">

                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                        Experience
                      </p>

                      <p className="mt-2 font-bold text-gray-900">
                        🏆 {trainer.experience} Years
                      </p>

                    </div>


                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                        Session Capacity
                      </p>

                      <p className="mt-2 font-bold text-gray-900">
                        👥 {trainer.max_clients} Members
                      </p>

                    </div>

                  </div>


                  {/* Schedule */}

                  <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                    <h3 className="font-bold text-gray-900">
                      Working Schedule
                    </h3>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">

                      <div>
                        <p className="text-xs font-bold uppercase text-gray-400">
                          Morning
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {trainer.morning_start} - {trainer.morning_end}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase text-gray-400">
                          Lunch
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {trainer.lunch_start} - {trainer.lunch_end}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase text-gray-400">
                          Evening
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {trainer.evening_start} - {trainer.evening_end}
                        </p>
                      </div>

                    </div>

                  </div>


                  {/* Working Days */}

                  <div className="mt-5">

                    <h3 className="mb-3 font-bold text-gray-900">
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
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${active
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


          {/* =====================================================
              DATE + TIME
          ====================================================== */}

          <div className="grid gap-6 lg:grid-cols-2">

            {/* DATE */}

            <div className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 font-bold text-pink-600">
                  02
                </div>

                <div>

                  <h3 className="font-bold text-gray-900">
                    Select Date
                  </h3>

                  <p className="text-sm text-gray-500">
                    Choose an available training day.
                  </p>

                </div>

              </div>

              <div className="w-full">
                <DatePicker
                  selected={bookingDate}
                  onChange={(date) => setBookingDate(date)}
                  filterDate={filterDate}
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select booking date"
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10"
                />
              </div>

              <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                ℹ️ Your booking will remain pending until an
                admin approves it.
              </div>

            </div>


            {/* TIME */}

            <div className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 font-bold text-pink-600">
                  03
                </div>

                <div>

                  <h3 className="font-bold text-gray-900">
                    Select Time
                  </h3>

                  <p className="text-sm text-gray-500">
                    Pick one of the available slots.
                  </p>

                </div>

              </div>


              {!selectedTrainer && (

                <div className="flex min-h-40 items-center justify-center rounded-2xl bg-gray-50 text-center text-sm font-medium text-gray-500">
                  <div>
                    <div className="text-3xl">👤</div>
                    <p className="mt-2">
                      Select a trainer first.
                    </p>
                  </div>
                </div>

              )}


              {selectedTrainer &&
                availableTimes.length === 0 && (

                  <div className="flex min-h-40 items-center justify-center rounded-2xl bg-yellow-50 text-center text-sm font-medium text-yellow-700">
                    <div>
                      <div className="text-3xl">⏰</div>
                      <p className="mt-2">
                        No available time slots.
                      </p>
                    </div>
                  </div>

                )}


              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                {availableTimes.map((time) => (

                  <button
                    key={time}
                    type="button"
                    onClick={() => setBookingTime(time)}
                    className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${bookingTime === time
                        ? "border-pink-600 bg-pink-600 text-white shadow-lg shadow-pink-600/20"
                        : "border-gray-200 bg-white text-gray-700 hover:border-pink-500 hover:bg-pink-50 hover:text-pink-600"
                      }`}
                  >
                    {time}
                  </button>

                ))}

              </div>

            </div>

          </div>


          {/* =====================================================
              SUMMARY
          ====================================================== */}

          {selectedTrainer &&
            bookingDate &&
            bookingTime && (

              <div className="overflow-hidden rounded-4xl border border-pink-200 bg-linear-to-br from-pink-50 to-white shadow-sm">

                <div className="border-b border-pink-100 bg-pink-100/50 px-6 py-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600 text-white">
                      ✓
                    </div>

                    <div>

                      <h3 className="font-black text-gray-900">
                        Booking Summary
                      </h3>

                      <p className="text-sm text-gray-500">
                        Review your session before submitting.
                      </p>

                    </div>

                  </div>

                </div>


                <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      Trainer
                    </p>

                    <p className="mt-1 font-bold">
                      {trainer.name}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      Specialty
                    </p>

                    <p className="mt-1 font-bold">
                      {trainer.specialty}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      Date
                    </p>

                    <p className="mt-1 font-bold">
                      {bookingDate.toLocaleDateString()}
                    </p>
                  </div>


                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      Time
                    </p>

                    <p className="mt-1 font-bold">
                      {bookingTime}
                    </p>
                  </div>

                </div>


                <div className="border-t border-pink-100 px-6 py-4">

                  <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-700">
                    ⏳ Pending Admin Approval
                  </span>

                </div>

              </div>

            )}


          {/* SUBMIT */}

          <div className="flex justify-end">

            <button
              type="submit"
              className="w-full rounded-2xl bg-pink-600 px-10 py-4 text-lg font-black text-white shadow-lg shadow-pink-600/20 transition hover:-translate-y-0.5 hover:bg-pink-700 sm:w-auto"
            >
              Submit Booking Request →
            </button>

          </div>

        </form>

      </div>


      {/* =====================================================
          MY BOOKINGS
      ====================================================== */}

      <div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-bold text-white">
              📋 My Sessions
            </div>

            <h2 className="text-3xl font-black text-gray-900 md:text-4xl">
              My Bookings
            </h2>

            <p className="mt-2 text-gray-500">
              Track your upcoming training sessions and booking status.
            </p>

          </div>

          <div className="rounded-2xl bg-pink-50 px-5 py-3 text-sm font-bold text-pink-700">
            {bookings.length} Booking{bookings.length === 1 ? "" : "s"}
          </div>

        </div>


        <div className="space-y-5">

          {/* LOADING */}

          {loading && (

            <div className="rounded-4xl border border-gray-100 bg-white p-12 text-center shadow-lg">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-100 border-t-pink-600" />

              <p className="mt-5 font-semibold text-gray-600">
                Loading your bookings...
              </p>

            </div>

          )}


          {/* EMPTY */}

          {!loading && bookings.length === 0 && (

            <div className="rounded-4xl border border-gray-100 bg-white p-12 text-center shadow-lg">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-3xl">
                📅
              </div>

              <h3 className="mt-5 text-2xl font-black">
                No Bookings Yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-gray-500">
                Once you request a training session,
                it will appear here for you to track.
              </p>

            </div>

          )}


          {/* BOOKINGS */}

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >

              <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[120px_1fr_auto]">

                {/* TRAINER IMAGE */}

                <img
                  src={
                    booking.trainers.image_url ||
                    "https://placehold.co/300x300?text=Trainer"
                  }
                  alt={booking.trainers.name}
                  className="h-28 w-28 rounded-2xl object-cover shadow-sm"
                />


                {/* DETAILS */}

                <div>

                  <div className="flex flex-col gap-1">

                    <h3 className="text-2xl font-black text-gray-900">
                      {booking.trainers.name}
                    </h3>

                    <p className="font-bold text-pink-600">
                      {booking.trainers.specialty}
                    </p>

                  </div>


                  <div className="mt-5 grid gap-3 sm:grid-cols-2">

                    <div className="rounded-xl bg-gray-50 p-3">

                      <p className="text-xs font-bold uppercase text-gray-400">
                        Date
                      </p>

                      <p className="mt-1 font-semibold">
                        📅 {booking.booking_date}
                      </p>

                    </div>


                    <div className="rounded-xl bg-gray-50 p-3">

                      <p className="text-xs font-bold uppercase text-gray-400">
                        Time
                      </p>

                      <p className="mt-1 font-semibold">
                        🕒 {booking.booking_time}
                      </p>

                    </div>


                    <div className="rounded-xl bg-gray-50 p-3">

                      <p className="text-xs font-bold uppercase text-gray-400">
                        Booking ID
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold">
                        {booking.id}
                      </p>

                    </div>


                    <div className="rounded-xl bg-gray-50 p-3">

                      <p className="text-xs font-bold uppercase text-gray-400">
                        Member
                      </p>

                      <p className="mt-1 font-semibold">
                        👤 You
                      </p>

                    </div>

                  </div>

                </div>


                {/* STATUS + ACTIONS */}

                <div className="flex flex-row items-center justify-between gap-4 border-t border-gray-100 pt-5 lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-black ${booking.status === "Pending"
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


                  <div className="flex flex-wrap justify-end gap-2">

                    {booking.status === "Pending" && (

                      <button
                        onClick={() =>
                          handleCancel(booking.id)
                        }
                        className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                      >
                        Cancel Booking
                      </button>

                    )}


                    {(booking.status === "Completed" ||
                      booking.status === "Cancelled") && (

                        <button
                          onClick={() =>
                            handleDelete(booking.id)
                          }
                          className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
                        >
                          Delete
                        </button>

                      )}

                  </div>

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