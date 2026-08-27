import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  getTrainerByUserId,
  getTrainerBookings,
  completeTrainerBooking,
  deleteCompletedTrainerBooking,
} from "../../../services/trainers";

function TrainerBookings() {
  const { user } = useAuth();

  const [trainer, setTrainer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [completing, setCompleting] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const loadBookings = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);

    const {
      data: trainerData,
      error: trainerError,
    } = await getTrainerByUserId(user.id);

    if (trainerError || !trainerData) {
      console.error("Trainer loading error:", trainerError);
      setLoading(false);
      return;
    }

    setTrainer(trainerData);

    const {
      data,
      error,
    } = await getTrainerBookings(trainerData.id);

    if (error) {
      console.error("Booking loading error:", error);
      setBookings([]);
      setLoading(false);
      return;
    }

    setBookings(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const run = async () => {
      await loadBookings();
    };

    run();
  }, [user?.id, loadBookings]);

  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      loadBookings();
    }, 100000);

    return () => clearInterval(interval);
  }, [user?.id, loadBookings]);

  async function handleComplete(id) {
    const confirmed = window.confirm(
      "Mark this training session as completed?"
    );

    if (!confirmed) return;

    setCompleting(id);

    const { error } = await completeTrainerBooking(id);

    if (error) {
      console.error("Complete booking error:", error);

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

  async function handleDelete(id) {
  const confirmed = window.confirm(
    "Delete this completed training from your booking history?\n\nThis action cannot be undone."
  );

  if (!confirmed) return;

  setDeleting(id);

  const { error } =
    await deleteCompletedTrainerBooking(id);

  if (error) {
    console.error("Delete booking error:", error);

    alert(
      error.message ||
        "Unable to delete this completed training."
    );

    setDeleting(null);
    return;
  }

  await loadBookings();

  setDeleting(null);
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
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />

          <p className="mt-4 font-semibold text-gray-600">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-3xl">
          👤
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Trainer profile not found
        </h1>

        <p className="mt-3 text-gray-500">
          We couldn't find your trainer profile.
        </p>
      </div>
    );
  }

  const pending = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const approved = bookings.filter(
    (booking) => booking.status === "Approved"
  ).length;

  const completed = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const cancelled = bookings.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <div className="inline-flex items-center rounded-full bg-pink-50 px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-pink-600">
            Training Sessions
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            My Bookings
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            View and manage members assigned to your training sessions.
          </p>
        </div>

        <button
          onClick={loadBookings}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 font-bold text-white transition hover:bg-pink-600 sm:w-auto"
        >
          <span>↻</span>
          Refresh
        </button>

      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="rounded-3xl border border-yellow-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-50 text-xl">
              ⏳
            </div>

            <span className="text-2xl font-extrabold text-gray-900">
              {pending}
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-gray-500">
            Pending
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Awaiting approval
          </p>
        </div>

        <div className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-xl">
              ✓
            </div>

            <span className="text-2xl font-extrabold text-gray-900">
              {approved}
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-gray-500">
            Approved
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Ready for training
          </p>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-xl">
              ✓
            </div>

            <span className="text-2xl font-extrabold text-gray-900">
              {completed}
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-gray-500">
            Completed
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Finished sessions
          </p>
        </div>

        <div className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-xl">
              ×
            </div>

            <span className="text-2xl font-extrabold text-gray-900">
              {cancelled}
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-gray-500">
            Cancelled
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Cancelled sessions
          </p>
        </div>

      </div>

      {/* TOTAL BANNER */}

      <div className="relative overflow-hidden rounded-3xl bg-black p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink-600/20 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[2px] text-pink-400">
              My Training Schedule
            </p>

            <h2 className="mt-2 text-2xl font-extrabold">
              {bookings.length} Total Sessions
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Sessions currently assigned to you.
            </p>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-600 text-2xl font-extrabold">
            {bookings.length}
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}

      {bookings.length === 0 && (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-pink-50 text-4xl">
            📅
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            No bookings yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Member training sessions assigned to you will appear here.
          </p>
        </div>
      )}

      {/* DESKTOP TABLE */}

      {bookings.length > 0 && (
        <div className="hidden overflow-hidden rounded-3xl bg-white shadow-sm md:block">

          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="text-xl font-bold text-gray-900">
              Assigned Sessions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your assigned training sessions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5">

              <thead className="bg-black text-white">
                <tr>
                  <th className="p-5 text-left text-sm font-semibold">
                    Member
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
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 transition last:border-0 hover:bg-pink-50/30"
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

                    <td className="p-5 font-medium text-gray-700">
                      {booking.booking_date}
                    </td>

                    <td className="p-5 font-medium text-gray-700">
                      {booking.booking_time}
                    </td>

                    <td className="p-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClass(
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
                            handleComplete(booking.id)
                          }
                          disabled={
                            completing === booking.id
                          }
                          className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {completing === booking.id
                            ? "Completing..."
                            : "✓ Complete"}
                        </button>
                      )}

                      {booking.status === "Pending" && (
                        <span className="text-sm font-medium text-gray-400">
                          Awaiting admin approval
                        </span>
                      )}

                      {booking.status === "Completed" && (
                        <div className="flex items-center gap-3">

                          <span className="text-sm font-semibold text-blue-600">
                            ✓ Finished
                          </span>

                          <button
                            onClick={() =>
                              handleDelete(booking.id)
                            }
                            disabled={
                              deleting === booking.id
                            }
                            className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deleting === booking.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>
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
        </div>
      )}

      {/* MOBILE CARDS */}

      {bookings.length > 0 && (
        <div className="space-y-4 md:hidden">

          <div className="px-1">
            <h2 className="text-xl font-bold text-gray-900">
              Assigned Sessions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your training sessions.
            </p>
          </div>

          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm"
            >

              <div className="h-1.5 bg-pink-600" />

              <div className="p-5">

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">
                    <h2 className="truncate font-bold text-gray-900">
                      {booking.profiles?.full_name ||
                        "Unknown Member"}
                    </h2>

                    <p className="mt-1 break-all text-sm text-gray-500">
                      {booking.profiles?.email ||
                        "No email"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {booking.booking_date}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                      Time
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {booking.booking_time}
                    </p>
                  </div>

                </div>

                <div className="mt-5">

                  {booking.status === "Approved" && (
                    <button
                      onClick={() =>
                        handleComplete(booking.id)
                      }
                      disabled={
                        completing === booking.id
                      }
                      className="w-full rounded-2xl bg-pink-600 px-4 py-3 font-bold text-white transition hover:bg-pink-700 disabled:opacity-50"
                    >
                      {completing === booking.id
                        ? "Completing..."
                        : "✓ Complete Training"}
                    </button>
                  )}

                  {booking.status === "Pending" && (
                    <div className="rounded-2xl bg-yellow-50 p-4 text-center text-sm font-semibold text-yellow-700">
                      ⏳ Awaiting admin approval
                    </div>
                  )}

                  {booking.status === "Completed" && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                      <div className="flex flex-1 items-center justify-center rounded-2xl bg-blue-50 p-3 text-sm font-bold text-blue-700">
                        ✓ Training completed
                      </div>

                      <button
                        onClick={() =>
                          handleDelete(booking.id)
                        }
                        disabled={
                          deleting === booking.id
                        }
                        className="rounded-2xl bg-red-50 px-5 py-3 font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                      >
                        {deleting === booking.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>
                  )}

                  {booking.status === "Cancelled" && (
                    <div className="rounded-2xl bg-red-50 p-3 text-center text-sm font-semibold text-red-600">
                      Training cancelled
                    </div>
                  )}

                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default TrainerBookings;