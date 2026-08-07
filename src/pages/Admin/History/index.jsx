import { useEffect, useState } from "react";

import {
  getBookingHistory,
  deleteAdminHistoryBooking,
} from "../../../services/admin";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);

      const { data, error } = await getBookingHistory();

      if (error) {
        console.error(
          "Failed to load admin booking history:",
          error
        );

        setHistory([]);
        setLoading(false);
        return;
      }

      setHistory(data || []);
      setLoading(false);
    };

    void Promise.resolve().then(fetchHistory);
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Remove this booking from admin history?"
    );

    if (!confirmed) {
      return;
    }

    const { error } =
      await deleteAdminHistoryBooking(id);

    if (error) {
      alert(error.message);
      return;
    }

    setHistory((previous) =>
      previous.filter(
        (booking) => booking.id !== id
      )
    );
  }

  function getStatusStyle(status) {
    if (status === "Completed") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold md:text-4xl">
          Booking History
        </h1>

        <p className="mt-2 text-gray-500">
          View completed and cancelled trainer
          sessions.
        </p>

      </div>

      {/* Loading */}

      {loading && (
        <div className="rounded-3xl bg-white p-10 text-center shadow">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
            ⏳
          </div>

          <p className="font-semibold text-gray-600">
            Loading booking history...
          </p>

        </div>
      )}

      {/* Empty */}

      {!loading && history.length === 0 && (
        <div className="rounded-3xl bg-white p-10 text-center shadow">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
            📋
          </div>

          <h2 className="mt-5 text-2xl font-bold">
            No booking history
          </h2>

          <p className="mt-2 text-gray-500">
            Completed and cancelled bookings will
            appear here.
          </p>

        </div>
      )}

      {/* History */}

      {!loading && history.length > 0 && (
        <div className="space-y-5">

          {history.map((booking) => (

            <div
              key={booking.id}
              className="rounded-3xl bg-white p-5 shadow transition hover:shadow-lg md:p-7"
            >

              {/* Top section */}

              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                {/* Member */}

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pink-100 text-2xl">
                    👤
                  </div>

                  <div className="min-w-0">

                    <h2 className="wrap-break-word text-xl font-bold">
                      {booking.profiles?.full_name ||
                        "Unknown Member"}
                    </h2>

                    <p className="break-all text-sm text-gray-500">
                      {booking.profiles?.email ||
                        "No email"}
                    </p>

                  </div>

                </div>

                {/* Status */}

                <span
                  className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>

              </div>

              {/* Trainer */}

              <div className="mt-6 rounded-2xl bg-gray-50 p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-xl text-white">
                    🏋️
                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Trainer
                    </p>

                    <h3 className="text-lg font-bold">
                      {booking.trainers?.name ||
                        "Unknown Trainer"}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {booking.trainers?.specialty ||
                        "Fitness Trainer"}
                    </p>

                  </div>

                </div>

              </div>

              {/* Booking details */}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border p-5">

                  <p className="text-sm text-gray-500">
                    Training Date
                  </p>

                  <p className="mt-1 font-semibold">
                    📅 {booking.booking_date}
                  </p>

                </div>

                <div className="rounded-2xl border p-5">

                  <p className="text-sm text-gray-500">
                    Training Time
                  </p>

                  <p className="mt-1 font-semibold">
                    🕒 {booking.booking_time}
                  </p>

                </div>

              </div>

              {/* Delete */}

              <div className="mt-6 flex justify-end">

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(booking.id)
                  }
                  className="w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 sm:w-auto"
                >
                  Delete from History
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default History;