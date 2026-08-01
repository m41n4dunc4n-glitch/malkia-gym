import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  getTrainers,
  createBooking,
  getMyBookings,
  cancelBooking,
  checkTrainerAvailability,
} from "../../../services/booking";

function Bookings() {
  const { user } = useAuth();

  const [trainers, setTrainers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  useEffect(() => {
    if (user) {
      loadData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function loadData() {
    const { data: trainerData } = await getTrainers();
    const { data: bookingData } = await getMyBookings(user.id);

    setTrainers(trainerData || []);
    setBookings(bookingData || []);
  }

  async function handleBooking(e) {
    e.preventDefault();

    const { data: existing } =
      await checkTrainerAvailability(
        selectedTrainer,
        bookingDate,
        bookingTime
      );

    if (existing.length > 0) {
      alert("This trainer is already booked at that time.");
      return;
    }

    const { error } = await createBooking({
      member_id: user.id,
      trainer_id: selectedTrainer,
      booking_date: bookingDate,
      booking_time: bookingTime,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Booking created successfully!");

    setSelectedTrainer("");
    setBookingDate("");
    setBookingTime("");

    loadData();
  }

  async function handleCancel(id) {
    const confirmed = window.confirm("Cancel this booking?");

    if (!confirmed) return;

    const { error } = await cancelBooking(id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Booking cancelled.");

    loadData();
  }

  return (
    <div className="space-y-10">

      {/* Booking Form */}

      <div className="rounded-3xl bg-white p-5 shadow md:p-8">

        <h1 className="mb-8 text-3xl font-bold md:text-4xl">
          Book a Session
        </h1>

        <form
          onSubmit={handleBooking}
          className="space-y-5"
        >

          <select
            value={selectedTrainer}
            onChange={(e) => setSelectedTrainer(e.target.value)}
            className="w-full rounded-xl border p-4 outline-none focus:border-pink-500"
          >
            <option value="">
              Select Trainer
            </option>

            {trainers.map((trainer) => (
              <option
                key={trainer.id}
                value={trainer.id}
              >
                {trainer.name}
              </option>
            ))}

          </select>

          <div className="grid gap-5 md:grid-cols-2">

            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full rounded-xl border p-4 outline-none focus:border-pink-500"
            />

            <input
              type="time"
              min="06:00"
              max="21:00"
              step="1800"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              className="w-full rounded-xl border p-4 outline-none focus:border-pink-500"
            />

          </div>

          <button
            className="w-full rounded-xl bg-pink-600 py-4 font-semibold text-white transition hover:bg-pink-700 md:w-auto md:px-10"
          >
            Book Session
          </button>

        </form>

      </div>

      {/* My Bookings */}

      <div>

        <h2 className="mb-6 text-3xl font-bold">
          My Bookings
        </h2>

        <div className="space-y-5">

          {bookings.length === 0 && (

            <div className="rounded-2xl bg-white p-8 text-center shadow">
              No bookings yet.
            </div>

          )}

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="rounded-2xl bg-white p-5 shadow md:p-6"
            >

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                  <h3 className="text-2xl font-bold">
                    {booking.trainers.name}
                  </h3>

                  <p className="text-gray-500">
                    {booking.trainers.specialty}
                  </p>

                </div>

                <span
                  className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                    booking.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : booking.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "Completed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.status}
                </span>

              </div>

              <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div className="flex flex-col gap-2 text-gray-700 sm:flex-row sm:gap-8">

                  <p>
                    📅 {booking.booking_date}
                  </p>

                  <p>
                    🕒 {booking.booking_time}
                  </p>

                </div>

                <button
                  onClick={() => handleCancel(booking.id)}
                  className="w-full rounded-xl bg-red-600 px-6 py-3 text-white transition hover:bg-red-700 md:w-auto"
                >
                  Cancel Booking
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Bookings;