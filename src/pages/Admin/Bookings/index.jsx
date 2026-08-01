import { useEffect, useState } from "react";

import {
  getAllBookings,
  updateBookingStatus,
} from "../../../services/admin";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  async function loadBookings() {
    const { data } = await getAllBookings();
    setBookings(data || []);
  }

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await getAllBookings();

      if (mounted) {
        setBookings(data || []);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function changeStatus(id, status) {
    const { error } = await updateBookingStatus(id, status);

    if (!error) {
      loadBookings();
    }
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold lg:text-4xl">
          Booking Management
        </h1>

        <p className="mt-2 text-gray-500">
          Approve, reject and manage trainer bookings.
        </p>

      </div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow">

        <table className="min-w-275 w-full">

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
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4">

                  <div className="min-w-0">

                    <h3 className="font-semibold wrap-break-word">
                      {booking.profiles?.full_name}
                    </h3>

                    <p className="break-all text-sm text-gray-500">
                      {booking.profiles?.email}
                    </p>

                  </div>

                </td>

                <td className="p-4">

                  <div className="min-w-0">

                    <h3 className="font-semibold wrap-break-word">
                      {booking.trainers?.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {booking.trainers?.specialty}
                    </p>

                  </div>

                </td>

                <td className="whitespace-nowrap p-4">
                  {booking.booking_date}
                </td>

                <td className="whitespace-nowrap p-4">
                  {booking.booking_time}
                </td>

                <td className="p-4">

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
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

                <td className="p-4">

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() =>
                        changeStatus(
                          booking.id,
                          "Approved"
                        )
                      }
                      className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white transition hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        changeStatus(
                          booking.id,
                          "Cancelled"
                        )
                      }
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-700"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        changeStatus(
                          booking.id,
                          "Completed"
                        )
                      }
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700"
                    >
                      Complete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Bookings;