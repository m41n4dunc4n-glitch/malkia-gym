import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  getTrainerByUserId,
  getTrainerBookings,
  completeTrainerBooking,
} from "../../../services/trainers";

function TrainerBookings() {
  const { user } = useAuth();

  const [trainer, setTrainer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);

  const loadBookings = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);

    const { data: trainerData, error: trainerError } =
      await getTrainerByUserId(user.id);

    if (trainerError || !trainerData) {
      console.error(
        "Trainer loading error:",
        trainerError
      );

      setLoading(false);
      return;
    }

    setTrainer(trainerData);

    const { data, error } =
      await getTrainerBookings(trainerData.id);

    if (error) {
      console.error(
        "Booking loading error:",
        error
      );

      setBookings([]);
      setLoading(false);
      return;
    }

    setBookings(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    // call asynchronously to avoid synchronous setState inside effect
    const t = setTimeout(() => {
      loadBookings();
    }, 0);

    return () => clearTimeout(t);
  }, [user?.id, loadBookings]);

  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      loadBookings();
    }, 10000);

    return () => clearInterval(interval);
  }, [user?.id, loadBookings]);

  async function handleComplete(id) {
    const confirmed = window.confirm(
      "Mark this training session as completed?"
    );

    if (!confirmed) return;

    setCompleting(id);

    const { error } =
      await completeTrainerBooking(id);

    if (error) {
      console.error(
        "Complete booking error:",
        error
      );

      alert(
        error.message ||
          "Unable to complete this booking."
      );

      setCompleting(null);
      return;
    }

    await loadBookings();

    setCompleting(null);
  }

  function statusClass(status) {
    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "Approved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Completed") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-red-100 text-red-700";
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading your bookings...
        </p>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow">
        <h1 className="text-2xl font-bold">
          Trainer profile not found
        </h1>

        <p className="mt-3 text-gray-500">
          We couldn't find your trainer profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[3px] text-pink-600">
            Training Sessions
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 md:text-4xl">
            My Bookings
          </h1>

          <p className="mt-2 text-gray-500">
            View members assigned to your training sessions.
          </p>
        </div>

        <button
          onClick={loadBookings}
          className="rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Booking count */}

      <div className="rounded-3xl bg-black p-6 text-white shadow-lg">
        <p className="text-sm text-gray-400">
          Total Training Sessions
        </p>

        <p className="mt-1 text-4xl font-extrabold">
          {bookings.length}
        </p>
      </div>

      {/* Empty */}

      {bookings.length === 0 && (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">
            📅
          </div>

          <h2 className="mt-4 text-2xl font-bold">
            No bookings yet
          </h2>

          <p className="mt-2 text-gray-500">
            Member training sessions assigned to you will appear here.
          </p>
        </div>
      )}

      {/* Desktop table */}

      {bookings.length > 0 && (
        <div className="hidden overflow-x-auto rounded-3xl bg-white shadow-sm md:block">
          <table className="w-full min-w-212.5">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-5 text-left">
                  Member
                </th>

                <th className="p-5 text-left">
                  Date
                </th>

                <th className="p-5 text-left">
                  Time
                </th>

                <th className="p-5 text-left">
                  Status
                </th>

                <th className="p-5 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="p-5">
                    <p className="font-bold text-gray-900">
                      {booking.profiles?.full_name ||
                        "Unknown Member"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {booking.profiles?.email ||
                        "No email"}
                    </p>
                  </td>

                  <td className="p-5">
                    {booking.booking_date}
                  </td>

                  <td className="p-5">
                    {booking.booking_time}
                  </td>

                  <td className="p-5">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="p-5">
                    {booking.status === "Approved" && (
                      <button
                        onClick={() =>
                          handleComplete(
                            booking.id
                          )
                        }
                        disabled={
                          completing === booking.id
                        }
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                      >
                        {completing === booking.id
                          ? "Completing..."
                          : "Complete"}
                      </button>
                    )}

                    {booking.status === "Pending" && (
                      <span className="text-sm font-medium text-gray-400">
                        Awaiting admin approval
                      </span>
                    )}

                    {booking.status === "Completed" && (
                      <span className="text-sm font-semibold text-blue-600">
                        ✓ Finished
                      </span>
                    )}

                    {booking.status === "Cancelled" && (
                      <span className="text-sm font-semibold text-red-500">
                        Cancelled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}

      {bookings.length > 0 && (
        <div className="space-y-4 md:hidden">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-3xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold text-gray-900">
                    {booking.profiles?.full_name ||
                      "Unknown Member"}
                  </h2>

                  <p className="mt-1 break-all text-sm text-gray-500">
                    {booking.profiles?.email ||
                      "No email"}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    Date
                  </p>

                  <p className="mt-1 font-semibold">
                    {booking.booking_date}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    Time
                  </p>

                  <p className="mt-1 font-semibold">
                    {booking.booking_time}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                {booking.status === "Approved" && (
                  <button
                    onClick={() =>
                      handleComplete(
                        booking.id
                      )
                    }
                    disabled={
                      completing === booking.id
                    }
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {completing === booking.id
                      ? "Completing..."
                      : "✓ Complete Training"}
                  </button>
                )}

                {booking.status === "Pending" && (
                  <div className="rounded-xl bg-yellow-50 p-3 text-center text-sm font-semibold text-yellow-700">
                    ⏳ Awaiting admin approval
                  </div>
                )}

                {booking.status === "Completed" && (
                  <div className="rounded-xl bg-blue-50 p-3 text-center text-sm font-semibold text-blue-700">
                    ✓ Training completed
                  </div>
                )}

                {booking.status === "Cancelled" && (
                  <div className="rounded-xl bg-red-50 p-3 text-center text-sm font-semibold text-red-700">
                    Training cancelled
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrainerBookings;