import { useCallback, useEffect, useState } from "react";

import {
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUser,
  FaDumbbell,
  FaArrowRight,
} from "react-icons/fa";

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

    const { error } = await updateBookingStatus(id, status);

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

    return new Date(date).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const approvedCount = bookings.filter(
    (booking) => booking.status === "Approved"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  return (
    <div className="space-y-8">

      {/* =====================================================
          HERO HEADER
      ===================================================== */}

      <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-black via-zinc-900 to-pink-700 p-7 text-white shadow-xl sm:p-10">

        {/* Decorative glow */}

        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-pink-500/20 blur-3xl" />

        <div className="absolute -bottom-24 left-1/3 h-60 w-60 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">

              <FaCalendarCheck className="text-2xl text-pink-400" />

            </div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-300">
              Malkia Fitness
            </p>

            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              Booking Management
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
              Manage member training sessions, approve requests
              and keep every booking organised.
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">

            <p className="text-sm text-gray-300">
              Total Bookings
            </p>

            <p className="mt-1 text-4xl font-extrabold">
              {bookings.length}
            </p>

            <div className="mt-3 flex items-center gap-2 text-sm text-pink-300">

              <FaClock />

              <span>
                {pendingCount} awaiting review
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}

        <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-500">
                Total Bookings
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-gray-900">
                {bookings.length}
              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white">

              <FaCalendarCheck />

            </div>

          </div>

          <p className="mt-4 text-xs font-medium text-gray-400">
            All recorded bookings
          </p>

        </div>


        {/* Pending */}

        <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-500">
                Pending
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-yellow-600">
                {pendingCount}
              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600 transition group-hover:bg-yellow-500 group-hover:text-white">

              <FaClock />

            </div>

          </div>

          <p className="mt-4 text-xs font-medium text-gray-400">
            Awaiting approval
          </p>

        </div>


        {/* Approved */}

        <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-500">
                Approved
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-green-600">
                {approvedCount}
              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">

              <FaCheckCircle />

            </div>

          </div>

          <p className="mt-4 text-xs font-medium text-gray-400">
            Upcoming sessions
          </p>

        </div>


        {/* Completed */}

        <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-500">
                Completed
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-blue-600">
                {completedCount}
              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

              <FaCheckCircle />

            </div>

          </div>

          <p className="mt-4 text-xs font-medium text-gray-400">
            Finished sessions
          </p>

        </div>

      </div>


      {/* =====================================================
          BOOKINGS SECTION
      ===================================================== */}

      <div className="overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-lg">

        {/* Section Header */}

        <div className="border-b border-gray-100 p-6 sm:p-7">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">

                  <FaCalendarCheck />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    Booking Requests
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Review and manage member training sessions.
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-full bg-pink-50 px-4 py-2 text-sm font-bold text-pink-600">

              {bookings.length}{" "}
              {bookings.length === 1
                ? "Transaction"
                : "Transactions"}

            </div>

          </div>

        </div>


        {/* =====================================================
            DESKTOP TABLE
        ===================================================== */}

        <div className="hidden overflow-x-auto lg:block">

          <table className="min-w-300 w-full">

            <thead>

              <tr className="bg-black text-white">

                <th className="p-5 text-left text-sm font-semibold">
                  Member
                </th>

                <th className="p-5 text-left text-sm font-semibold">
                  Trainer
                </th>

                <th className="p-5 text-left text-sm font-semibold">
                  Date
                </th>

                <th className="p-5 text-left text-sm font-semibold">
                  Time
                </th>

                <th className="p-5 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="p-5 text-left text-sm font-semibold">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {bookings.map((booking) => (

                <tr
                  key={booking.id}
                  className="border-b border-gray-100 transition hover:bg-pink-50/40"
                >

                  {/* MEMBER */}

                  <td className="p-5">

                    <div className="flex min-w-50 items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600">

                        <FaUser />

                      </div>

                      <div className="min-w-0">

                        <h3 className="wrap-break-word font-bold text-gray-900">
                          {booking.profiles?.full_name ||
                            "Unknown Member"}
                        </h3>

                        <p className="break-all text-xs text-gray-500">
                          {booking.profiles?.email ||
                            "No email"}
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* TRAINER */}

                  <td className="p-5">

                    <div className="flex min-w-45 items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-white">

                        <FaDumbbell />

                      </div>

                      <div className="min-w-0">

                        <h3 className="wrap-break-word font-bold text-gray-900">
                          {booking.trainers?.name ||
                            "Unknown Trainer"}
                        </h3>

                        <p className="text-xs text-gray-500">
                          {booking.trainers?.specialty ||
                            "Fitness Trainer"}
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* DATE */}

                  <td className="whitespace-nowrap p-5">

                    <div>

                      <p className="font-semibold text-gray-900">
                        {formatDate(
                          booking.booking_date
                        )}
                      </p>

                    </div>

                  </td>


                  {/* TIME */}

                  <td className="whitespace-nowrap p-5">

                    <span className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">

                      {booking.booking_time || "—"}

                    </span>

                  </td>


                  {/* STATUS */}

                  <td className="p-5">

                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
                        booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : booking.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >

                      {booking.status === "Pending" && (
                        <FaClock />
                      )}

                      {booking.status === "Approved" && (
                        <FaCheckCircle />
                      )}

                      {booking.status === "Completed" && (
                        <FaCheckCircle />
                      )}

                      {booking.status === "Cancelled" && (
                        <FaTimesCircle />
                      )}

                      {booking.status}

                    </span>

                  </td>


                  {/* ACTIONS */}

                  <td className="p-5">

                    <div className="flex flex-wrap gap-2">

                      {/* APPROVE */}

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
                        className={`rounded-xl px-4 py-2.5 text-xs font-bold text-white transition ${
                          booking.status === "Pending"
                            ? "bg-green-600 hover:bg-green-700"
                            : "cursor-not-allowed bg-gray-200 text-gray-400"
                        }`}
                      >
                        Approve
                      </button>


                      {/* REJECT */}

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
                        className={`rounded-xl px-4 py-2.5 text-xs font-bold text-white transition ${
                          booking.status === "Pending"
                            ? "bg-red-600 hover:bg-red-700"
                            : "cursor-not-allowed bg-gray-200 text-gray-400"
                        }`}
                      >
                        Reject
                      </button>


                      {/* COMPLETE */}

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
                        className={`rounded-xl px-4 py-2.5 text-xs font-bold text-white transition ${
                          booking.status === "Approved"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "cursor-not-allowed bg-gray-200 text-gray-400"
                        }`}
                      >
                        Complete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}


              {/* EMPTY */}

              {bookings.length === 0 && (

                <tr>

                  <td
                    colSpan={6}
                    className="p-16 text-center"
                  >

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-2xl text-pink-500">

                      <FaCalendarCheck />

                    </div>

                    <h3 className="mt-5 text-xl font-bold text-gray-900">
                      No bookings yet
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      New member booking requests will appear here.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* =====================================================
            MOBILE CARDS
        ===================================================== */}

        <div className="space-y-4 p-5 lg:hidden">

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="rounded-3xl border border-gray-100 bg-gray-50 p-5 shadow-sm"
            >

              {/* Member */}

              <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600">

                    <FaUser />

                  </div>

                  <div className="min-w-0">

                    <h3 className="wrap-break-word font-bold text-gray-900">
                      {booking.profiles?.full_name ||
                        "Unknown Member"}
                    </h3>

                    <p className="break-all text-xs text-gray-500">
                      {booking.profiles?.email ||
                        "No email"}
                    </p>

                  </div>

                </div>


                {/* Status */}

                <span
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
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


              {/* Trainer */}

              <div className="mt-5 rounded-2xl bg-white p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">

                    <FaDumbbell />

                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Trainer
                    </p>

                    <p className="font-bold text-gray-900">
                      {booking.trainers?.name ||
                        "Unknown Trainer"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {booking.trainers?.specialty ||
                        "Fitness Trainer"}
                    </p>

                  </div>

                </div>

              </div>


              {/* Date + Time */}

              <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-white p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Date
                  </p>

                  <p className="mt-2 text-sm font-bold text-gray-900">
                    {formatDate(
                      booking.booking_date
                    )}
                  </p>

                </div>


                <div className="rounded-2xl bg-white p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Time
                  </p>

                  <p className="mt-2 text-sm font-bold text-gray-900">
                    {booking.booking_time || "—"}
                  </p>

                </div>

              </div>


              {/* Actions */}

              <div className="mt-5 grid gap-2 sm:grid-cols-3">

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
                  className={`rounded-xl py-3 text-sm font-bold text-white transition ${
                    booking.status === "Pending"
                      ? "bg-green-600 hover:bg-green-700"
                      : "cursor-not-allowed bg-gray-200 text-gray-400"
                  }`}
                >
                  Approve
                </button>


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
                  className={`rounded-xl py-3 text-sm font-bold text-white transition ${
                    booking.status === "Pending"
                      ? "bg-red-600 hover:bg-red-700"
                      : "cursor-not-allowed bg-gray-200 text-gray-400"
                  }`}
                >
                  Reject
                </button>


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
                  className={`rounded-xl py-3 text-sm font-bold text-white transition ${
                    booking.status === "Approved"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "cursor-not-allowed bg-gray-200 text-gray-400"
                  }`}
                >
                  Complete
                </button>

              </div>

            </div>

          ))}


          {/* Empty */}

          {bookings.length === 0 && (

            <div className="rounded-3xl bg-white p-10 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-2xl text-pink-500">

                <FaCalendarCheck />

              </div>

              <h3 className="mt-5 text-xl font-bold">
                No bookings yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                New member booking requests will appear here.
              </p>

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          HISTORY NOTICE
      ===================================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-black p-6 text-white shadow-lg sm:p-7">

        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-600">

                <FaClock />

              </div>

              <h3 className="text-lg font-bold">
                Booking History
              </h3>

            </div>

            <p className="mt-3 max-w-xl text-sm text-gray-400">
              Completed and cancelled bookings can be reviewed
              from the booking history page.
            </p>

          </div>


          <a
            href="/admin/history"
            className="flex w-fit items-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-pink-100"
          >
            View History

            <FaArrowRight className="text-pink-600" />

          </a>

        </div>

      </div>

    </div>
  );
}

export default Bookings;