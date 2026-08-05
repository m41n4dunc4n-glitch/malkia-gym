import { useCallback, useEffect, useState } from "react";

import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "../../../services/admin";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  const loadBookings = useCallback(async () => {
    const { data } = await getAllBookings();
    setBookings(data || []);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchBookings() {
      await loadBookings();

      if (!mounted) return;
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

    const { error } = await updateBookingStatus(id, status);

    if (!error) {
      loadBookings();
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Delete this completed booking permanently?"
    );

    if (!confirmed) return;

    const { error } = await deleteBooking(id);

    if (!error) {
      loadBookings();
    }
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Booking Management
        </h1>

        <p className="mt-2 text-gray-500">
          Approve, reject, complete and manage all gym bookings.
        </p>

      </div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow">

        <table className="min-w-[1200px] w-full">

          <thead className="bg-black text-white">

            <tr>

              <th className="p-4 text-left">Member</th>

              <th className="p-4 text-left">Trainer</th>

              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-left">Time</th>

              <th className="p-4 text-left">Status</th>

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

                <td className="p-4">

                  <div>

                    <h3 className="font-semibold">
                      {booking.profiles?.full_name}
                    </h3>

                    <p className="text-sm text-gray-500 break-all">
                      {booking.profiles?.email}
                    </p>

                  </div>

                </td>

                <td className="p-4">

                  <div>

                    <h3 className="font-semibold">
                      {booking.trainers?.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {booking.trainers?.specialty}
                    </p>

                  </div>

                </td>

                <td className="p-4 whitespace-nowrap">
                  {formatDate(booking.booking_date)}
                </td>

                <td className="p-4 whitespace-nowrap">
                  {booking.booking_time}
                </td>

                <td className="p-4">

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${booking.status === "Pending"
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

                <td className="p-4">

                  <div className="flex flex-wrap gap-2">

                    <button
                      disabled={booking.status !== "Pending"}
                      onClick={() =>
                        changeStatus(
                          booking.id,
                          "Approved"
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-sm font-semibold text-white ${booking.status === "Pending"
                          ? "bg-green-600 hover:bg-green-700"
                          : "cursor-not-allowed bg-gray-400"
                        }`}
                    >
                      Approve
                    </button>

                    <button
                      disabled={booking.status !== "Pending"}
                      onClick={() =>
                        changeStatus(
                          booking.id,
                          "Cancelled"
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-sm font-semibold text-white ${booking.status === "Pending"
                          ? "bg-red-600 hover:bg-red-700"
                          : "cursor-not-allowed bg-gray-400"
                        }`}
                    >
                      Reject
                    </button>

                    <button
                      disabled={booking.status !== "Approved"}
                      onClick={() =>
                        changeStatus(
                          booking.id,
                          "Completed"
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-sm font-semibold text-white ${booking.status === "Approved"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "cursor-not-allowed bg-gray-400"
                        }`}
                    >
                      Complete
                    </button>

                    {booking.status === "Completed" && (
                      <button
                        onClick={() =>
                          handleDelete(booking.id)
                        }
                        className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-black"
                      >
                        Delete
                      </button>
                    )}

                  </div>

                </td>

              </tr>

            ))}

            {bookings.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="p-10 text-center text-gray-500"
                >
                  No bookings available.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Bookings;