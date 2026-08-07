import { useCallback, useEffect, useState } from "react";

import {
  getAllBookings,
  updateBookingStatus,
} from "../../../services/admin";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  const loadBookings = useCallback(async () => {
    const { data, error } = await getAllBookings();

    if (error) {
      console.error("Failed to load bookings:", error);
      setBookings([]);
      return;
    }

    setBookings(data || []);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchBookings() {
      if (!mounted) return;

      await loadBookings();
    }

    fetchBookings();

    const interval = setInterval(fetchBookings, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [loadBookings]);

  async function changeStatus(id, status) {
    const confirmed = window.confirm(
      `Change booking status to "${status}"?`
    );

    if (!confirmed) return;

    const { error } = await updateBookingStatus(
      id,
      status
    );

    if (error) {
      console.error(
        "Failed to update booking status:",
        error
      );

      alert(error.message);
      return;
    }

    await loadBookings();
  }

  function formatDate(date) {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">
          Booking Management
        </h1>

        <p className="mt-2 text-gray-500">
          Approve, reject and complete gym
          trainer bookings.
        </p>

      </div>

      {/* Booking Table */}

      <div className="overflow-x-auto rounded-3xl bg-white shadow">

        <table className="min-w-300 w-full">

          <thead className="bg-black text-white">

            <tr>

              <th className="p-4 text-left">
                Member
              </th>

              <th className="p-4 text-left">
                Trainer
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Time
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {bookings.map((booking) => (

              <tr
                key={booking.id}
                className="border-b transition hover:bg-gray-50"
              >

                {/* Member */}

                <td className="p-4">

                  <div className="min-w-0">

                    <h3 className="wrap-break-word font-semibold">
                      {booking.profiles?.full_name ||
                        "Unknown Member"}
                    </h3>

                    <p className="break-all text-sm text-gray-500">
                      {booking.profiles?.email ||
                        "No email"}
                    </p>

                  </div>

                </td>

                {/* Trainer */}

                <td className="p-4">

                  <div className="min-w-0">

                    <h3 className="wrap-break-word font-semibold">
                      {booking.trainers?.name ||
                        "Unknown Trainer"}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {booking.trainers?.specialty ||
                        "Fitness Trainer"}
                    </p>

                  </div>

                </td>

                {/* Date */}

                <td className="whitespace-nowrap p-4">
                  {formatDate(
                    booking.booking_date
                  )}
                </td>

                {/* Time */}

                <td className="whitespace-nowrap p-4">
                  {booking.booking_time || "—"}
                </td>

                {/* Status */}

                <td className="p-4">

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
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

                </td>

                {/* Actions */}

                <td className="p-4">

                  <div className="flex flex-wrap gap-2">

                    {/* Approve */}

                    <button
                      type="button"
                      disabled={
                        booking.status !== "Pending"
                      }
                      onClick={() =>
                        changeStatus(
                          booking.id,
                          "Approved"
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-sm font-semibold text-white ${
                        booking.status === "Pending"
                          ? "bg-green-600 hover:bg-green-700"
                          : "cursor-not-allowed bg-gray-400"
                      }`}
                    >
                      Approve
                    </button>

                    {/* Reject */}

                    <button
                      type="button"
                      disabled={
                        booking.status !== "Pending"
                      }
                      onClick={() =>
                        changeStatus(
                          booking.id,
                          "Cancelled"
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-sm font-semibold text-white ${
                        booking.status === "Pending"
                          ? "bg-red-600 hover:bg-red-700"
                          : "cursor-not-allowed bg-gray-400"
                      }`}
                    >
                      Reject
                    </button>

                    {/* Complete */}

                    <button
                      type="button"
                      disabled={
                        booking.status !== "Approved"
                      }
                      onClick={() =>
                        changeStatus(
                          booking.id,
                          "Completed"
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-sm font-semibold text-white ${
                        booking.status === "Approved"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "cursor-not-allowed bg-gray-400"
                      }`}
                    >
                      Complete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

            {/* Empty */}

            {bookings.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="p-10 text-center text-gray-500"
                >
                  No active bookings available.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* History Notice */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h3 className="font-bold">
              Looking for completed or cancelled
              bookings?
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              They are automatically moved to Booking
              History.
            </p>

          </div>

          <a
            href="/admin/history"
            className="w-fit rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            View History
          </a>

        </div>

      </div>

    </div>
  );
}

export default Bookings;