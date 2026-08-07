import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
import getMyBookingHistory, {
  deleteMemberHistoryBooking,
} from "../../../services/booking";

import {
  FaHistory,
  FaDumbbell,
  FaCalendarAlt,
  FaClock,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

function History() {
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await getMyBookingHistory(user.id);

    if (error) {
      console.error("Failed to load booking history:", error);
      setLoading(false);
      return;
    }

    setHistory(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      loadHistory();
    }, 0);

    return () => clearTimeout(timer);
  }, [user, loadHistory]);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Remove this booking from your history?"
    );

    if (!confirmed) return;

    const { error } = await deleteMemberHistoryBooking(id);

    if (error) {
      alert(error.message);
      return;
    }

    setHistory((prev) =>
      prev.filter((booking) => booking.id !== id)
    );
  }

  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function statusStyle(status) {
    if (status === "Completed") {
      return {
        badge: "bg-blue-100 text-blue-700",
        icon: <FaCheckCircle />,
        label: "Completed",
      };
    }

    if (status === "Cancelled") {
      return {
        badge: "bg-red-100 text-red-700",
        icon: <FaTimesCircle />,
        label: "Cancelled",
      };
    }

    return {
      badge: "bg-gray-100 text-gray-700",
      icon: <FaHistory />,
      label: status,
    };
  }

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}

      <div className="relative overflow-hidden rounded-3xl bg-black p-7 text-white shadow-xl md:p-10">

        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="relative">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-600">
              <FaHistory />
            </div>

            <span className="text-sm font-bold uppercase tracking-widest text-pink-400">
              Activity
            </span>

          </div>

          <h1 className="text-3xl font-black md:text-5xl">
            Booking History
          </h1>

          <p className="mt-3 max-w-2xl text-gray-300 md:text-lg">
            Keep track of your completed and cancelled training sessions.
          </p>

        </div>

      </div>

      {/* ================= LOADING ================= */}

      {loading && (

        <div className="rounded-3xl bg-white p-12 text-center shadow-lg">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-50">

            <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-600 border-t-transparent" />

          </div>

          <h2 className="mt-5 text-lg font-bold">
            Loading your history...
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Please wait a moment.
          </p>

        </div>

      )}

      {/* ================= EMPTY ================= */}

      {!loading && history.length === 0 && (

        <div className="rounded-3xl bg-white p-10 text-center shadow-lg md:p-16">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-pink-50 text-3xl text-pink-600">
            <FaHistory />
          </div>

          <h2 className="mt-6 text-2xl font-black">
            No Booking History
          </h2>

          <p className="mx-auto mt-3 max-w-md text-gray-500">
            Completed and cancelled training sessions will appear here.
          </p>

        </div>

      )}

      {/* ================= HISTORY ================= */}

      {!loading && history.length > 0 && (

        <div className="space-y-5">

          {history.map((booking) => {

            const status = statusStyle(booking.status);

            return (

              <div
                key={booking.id}
                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Top accent */}

                <div
                  className={`h-1.5 ${
                    booking.status === "Completed"
                      ? "bg-blue-500"
                      : "bg-red-500"
                  }`}
                />

                <div className="p-5 md:p-7">

                  {/* Header */}

                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-xl text-pink-600">
                        <FaDumbbell />
                      </div>

                      <div>

                        <h2 className="text-xl font-black md:text-2xl">
                          {booking.trainers?.name || "Trainer"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {booking.trainers?.specialty ||
                            "Fitness Trainer"}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${status.badge}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>

                  </div>

                  {/* Details */}

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">

                    <div className="rounded-2xl bg-gray-50 p-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
                          <FaCalendarAlt />
                        </div>

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Date
                          </p>

                          <p className="mt-1 font-bold text-gray-800">
                            {formatDate(booking.booking_date)}
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="rounded-2xl bg-gray-50 p-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">
                          <FaClock />
                        </div>

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Time
                          </p>

                          <p className="mt-1 font-bold text-gray-800">
                            {booking.booking_time}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Delete */}

                  <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(booking.id)
                      }
                      className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                    >
                      <FaTrash />
                      Delete from History
                    </button>

                  </div>

                </div>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}

export default History;