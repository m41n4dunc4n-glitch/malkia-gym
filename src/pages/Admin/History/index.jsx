import { useEffect, useMemo, useState } from "react";

import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaHistory,
  FaSearch,
  FaTimesCircle,
  FaTrash,
  FaUser,
  FaDumbbell,
} from "react-icons/fa";

import {
  getBookingHistory,
  deleteAdminHistoryBooking,
} from "../../../services/admin";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

    const { error } = await deleteAdminHistoryBooking(id);

    if (error) {
      alert(error.message);
      return;
    }

    setHistory((previous) =>
      previous.filter((booking) => booking.id !== id)
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

  function getStatusIcon(status) {
    if (status === "Completed") {
      return <FaCheckCircle />;
    }

    if (status === "Cancelled") {
      return <FaTimesCircle />;
    }

    return <FaClock />;
  }

  const completedCount = history.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const cancelledCount = history.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  const filteredHistory = useMemo(() => {
    const query = search.toLowerCase().trim();

    return history.filter((booking) => {
      const memberName =
        booking.profiles?.full_name?.toLowerCase() || "";

      const memberEmail =
        booking.profiles?.email?.toLowerCase() || "";

      const trainerName =
        booking.trainers?.name?.toLowerCase() || "";

      const matchesSearch =
        memberName.includes(query) ||
        memberEmail.includes(query) ||
        trainerName.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [history, search, statusFilter]);

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-100">
            <FaHistory className="text-2xl text-pink-600" />
          </div>

          <div>

            <h1 className="text-3xl font-bold md:text-4xl">
              Booking History
            </h1>

            <p className="mt-2 text-gray-500">
              View completed and cancelled trainer sessions.
            </p>

          </div>

        </div>

      </div>

      {/* Summary Cards */}

      {!loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Total */}

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Total History
                </p>

                <h2 className="mt-2 text-3xl font-extrabold">
                  {history.length}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                <FaHistory className="text-xl text-gray-700" />
              </div>

            </div>

          </div>

          {/* Completed */}

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Completed
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-blue-600">
                  {completedCount}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                <FaCheckCircle className="text-xl text-blue-600" />
              </div>

            </div>

          </div>

          {/* Cancelled */}

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Cancelled
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-red-600">
                  {cancelledCount}
                </h2>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
                <FaTimesCircle className="text-xl text-red-600" />
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Search + Filter */}

      {!loading && history.length > 0 && (

        <div className="rounded-3xl bg-white p-5 shadow-sm md:p-6">

          <div className="flex flex-col gap-4 md:flex-row">

            {/* Search */}

            <div className="relative flex-1">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search member, email or trainer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
              />

            </div>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100 md:w-52"
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>

          </div>

          <div className="mt-4 text-sm text-gray-500">

            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredHistory.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {history.length}
            </span>{" "}
            bookings

          </div>

        </div>

      )}

      {/* Loading */}

      {loading && (

        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-50">

            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />

          </div>

          <h2 className="mt-5 text-xl font-bold">
            Loading booking history...
          </h2>

          <p className="mt-2 text-gray-500">
            Please wait while we retrieve the records.
          </p>

        </div>

      )}

      {/* Empty */}

      {!loading && history.length === 0 && (

        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">

            <FaHistory className="text-3xl text-gray-400" />

          </div>

          <h2 className="mt-6 text-2xl font-bold">
            No Booking History
          </h2>

          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Completed and cancelled trainer bookings will
            automatically appear here.
          </p>

        </div>

      )}

      {/* No Search Results */}

      {!loading &&
        history.length > 0 &&
        filteredHistory.length === 0 && (

          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">

              <FaSearch className="text-2xl text-gray-400" />

            </div>

            <h2 className="mt-5 text-xl font-bold">
              No bookings found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your search or status filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="mt-5 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-zinc-800"
            >
              Clear Filters
            </button>

          </div>

        )}

      {/* History Cards */}

      {!loading && filteredHistory.length > 0 && (

        <div className="space-y-5">

          {filteredHistory.map((booking) => (

            <div
              key={booking.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >

              {/* Top accent */}

              <div
                className={`h-1 ${
                  booking.status === "Completed"
                    ? "bg-blue-600"
                    : booking.status === "Cancelled"
                    ? "bg-red-600"
                    : "bg-gray-400"
                }`}
              />

              <div className="p-5 md:p-7">

                {/* Header */}

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  {/* Member */}

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pink-100 text-lg font-bold text-pink-600">

                      {booking.profiles?.full_name
                        ?.charAt(0)
                        ?.toUpperCase() || <FaUser />}

                    </div>

                    <div className="min-w-0">

                      <h2 className="truncate text-xl font-bold">
                        {booking.profiles?.full_name ||
                          "Unknown Member"}
                      </h2>

                      <p className="truncate text-sm text-gray-500">
                        {booking.profiles?.email ||
                          "No email"}
                      </p>

                    </div>

                  </div>

                  {/* Status */}

                  <span
                    className={`flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {getStatusIcon(booking.status)}

                    {booking.status}
                  </span>

                </div>

                {/* Divider */}

                <div className="my-6 border-t border-gray-100" />

                {/* Trainer */}

                <div className="rounded-2xl bg-gray-50 p-5">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-white">

                      <FaDumbbell />

                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Trainer
                      </p>

                      <h3 className="mt-1 truncate text-lg font-bold">
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

                {/* Booking Details */}

                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                  {/* Date */}

                  <div className="rounded-2xl border border-gray-100 bg-white p-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100">
                        <FaCalendarAlt className="text-pink-600" />
                      </div>

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Training Date
                        </p>

                        <p className="mt-1 font-bold text-gray-800">
                          {booking.booking_date}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Time */}

                  <div className="rounded-2xl border border-gray-100 bg-white p-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                        <FaClock className="text-blue-600" />
                      </div>

                      <div>

                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Training Time
                        </p>

                        <p className="mt-1 font-bold text-gray-800">
                          {booking.booking_time}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* Footer */}

                <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-sm text-gray-400">
                    Booking ID:{" "}
                    <span className="font-medium text-gray-600">
                      {booking.id}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(booking.id)
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white sm:w-auto"
                  >
                    <FaTrash />

                    Delete from History
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default History;