import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  getTrainerByUserId,
  getTrainerBookings,
} from "../../services/trainers";

function TrainerDashboard() {
  const { user } = useAuth();

  const [trainer, setTrainer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);

    try {
      const { data: trainerData } = await getTrainerByUserId(user.id);

      if (!trainerData) {
        setTrainer(null);
        setBookings([]);
        return;
      }

      setTrainer(trainerData);

      const { data: bookingData } = await getTrainerBookings(
        trainerData.id
      );

      setBookings(bookingData || []);
    } catch (error) {
      console.error("Trainer dashboard error:", error);
      setTrainer(null);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

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

  const total = bookings.length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />

          <p className="font-semibold text-gray-600">
            Loading trainer dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-2xl">
            👤
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-gray-900">
            Trainer Profile Not Found
          </h1>

          <p className="mt-3 leading-7 text-gray-500">
            Your account has not been connected to a trainer profile yet.
            Please contact the gym administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-black px-5 py-7 shadow-sm sm:px-8 sm:py-9">

        {/* Pink decoration */}
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-pink-600/20 blur-2xl" />
        <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-pink-600/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">

            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-pink-500" />

              <p className="text-xs font-bold uppercase tracking-[3px] text-pink-400 sm:text-sm">
                Trainer Dashboard
              </p>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              Welcome,{" "}
              <span className="text-pink-500">
                {trainer.name}
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
              Here's an overview of your training activities,
              bookings and trainer account.
            </p>

          </div>

          <button
            onClick={loadData}
            className="w-full shrink-0 rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700 active:scale-[0.98] sm:w-auto"
          >
            ↻ Refresh
          </button>

        </div>
      </div>


      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">

        {/* Pending */}

        <div className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:rounded-3xl sm:p-6">

          <div className="flex items-start justify-between">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-lg sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
              ⏳
            </div>

            <span className="hidden rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-bold text-yellow-700 sm:block">
              Pending
            </span>

          </div>

          <p className="mt-4 text-xs font-semibold text-gray-500 sm:text-sm">
            Pending
          </p>

          <p className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {pending}
          </p>

          <p className="mt-1 text-[11px] leading-5 text-gray-400 sm:mt-2 sm:text-sm">
            Awaiting admin approval
          </p>

        </div>


        {/* Approved */}

        <div className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:rounded-3xl sm:p-6">

          <div className="flex items-start justify-between">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-lg sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
              ✓
            </div>

            <span className="hidden rounded-full bg-pink-50 px-2.5 py-1 text-xs font-bold text-pink-700 sm:block">
              Approved
            </span>

          </div>

          <p className="mt-4 text-xs font-semibold text-gray-500 sm:text-sm">
            Approved
          </p>

          <p className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {approved}
          </p>

          <p className="mt-1 text-[11px] leading-5 text-gray-400 sm:mt-2 sm:text-sm">
            Upcoming sessions
          </p>

        </div>


        {/* Completed */}

        <div className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:rounded-3xl sm:p-6">

          <div className="flex items-start justify-between">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-lg text-green-600 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
              ✓
            </div>

            <span className="hidden rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 sm:block">
              Done
            </span>

          </div>

          <p className="mt-4 text-xs font-semibold text-gray-500 sm:text-sm">
            Completed
          </p>

          <p className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {completed}
          </p>

          <p className="mt-1 text-[11px] leading-5 text-gray-400 sm:mt-2 sm:text-sm">
            Sessions completed
          </p>

        </div>


        {/* Cancelled */}

        <div className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:rounded-3xl sm:p-6">

          <div className="flex items-start justify-between">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-lg text-red-500 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
              ×
            </div>

            <span className="hidden rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 sm:block">
              Cancelled
            </span>

          </div>

          <p className="mt-4 text-xs font-semibold text-gray-500 sm:text-sm">
            Cancelled
          </p>

          <p className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {cancelled}
          </p>

          <p className="mt-1 text-[11px] leading-5 text-gray-400 sm:mt-2 sm:text-sm">
            Cancelled sessions
          </p>

        </div>

      </div>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-5">


        {/* ===================================================
            TRAINER INFORMATION
        ==================================================== */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm lg:col-span-3">

          {/* Card header */}

          <div className="border-b border-gray-100 px-5 py-5 sm:px-7">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-xl">
                👤
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[2px] text-pink-600">
                  My Trainer Profile
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-gray-900">
                  Profile Overview
                </h2>
              </div>

            </div>

          </div>


          {/* Profile */}

          <div className="p-5 sm:p-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              {/* Image */}

              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100 ring-4 ring-pink-50 sm:h-28 sm:w-28">

                {trainer.image_url ? (
                  <img
                    src={trainer.image_url}
                    alt={trainer.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl text-gray-400">
                    👤
                  </div>
                )}

              </div>


              {/* Name */}

              <div className="min-w-0">

                <h3 className="truncate text-2xl font-extrabold text-gray-900">
                  {trainer.name}
                </h3>

                <p className="mt-1 font-medium text-pink-600">
                  {trainer.specialty || "Fitness Trainer"}
                </p>

                <div className="mt-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  Active Trainer
                </div>

              </div>

            </div>


            {/* Details */}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Experience
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {trainer.experience || 0} years
                </p>
              </div>


              <div className="rounded-2xl bg-gray-50 p-4">

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Phone
                </p>

                <p className="mt-1 break-all font-bold text-gray-900">
                  {trainer.phone || "Not provided"}
                </p>

              </div>


              <div className="rounded-2xl bg-gray-50 p-4">

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Capacity
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {trainer.capacity_per_slot || 10} members
                </p>

              </div>


              <div className="rounded-2xl bg-pink-50 p-4">

                <p className="text-xs font-semibold uppercase tracking-wide text-pink-500">
                  Total Sessions
                </p>

                <p className="mt-1 font-bold text-pink-700">
                  {total}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            ACTIVITY
        ==================================================== */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm lg:col-span-2">

          <div className="border-b border-gray-100 px-5 py-5 sm:px-7">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-xl">
                📊
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-[2px] text-pink-600">
                  Activity
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-gray-900">
                  Training Sessions
                </h2>

              </div>

            </div>

          </div>


          <div className="space-y-3 p-5 sm:p-7">

            {/* Total */}

            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">

              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Total bookings
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  All recorded sessions
                </p>
              </div>

              <span className="text-2xl font-extrabold text-gray-900">
                {total}
              </span>

            </div>


            {/* Pending */}

            <div className="flex items-center justify-between rounded-2xl border border-yellow-100 bg-yellow-50 p-4">

              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  Pending approval
                </p>

                <p className="mt-1 text-xs text-yellow-600">
                  Waiting for administrator
                </p>
              </div>

              <span className="text-2xl font-extrabold text-yellow-700">
                {pending}
              </span>

            </div>


            {/* Approved */}

            <div className="flex items-center justify-between rounded-2xl border border-pink-100 bg-pink-50 p-4">

              <div>
                <p className="text-sm font-semibold text-pink-800">
                  Approved
                </p>

                <p className="mt-1 text-xs text-pink-600">
                  Upcoming sessions
                </p>
              </div>

              <span className="text-2xl font-extrabold text-pink-700">
                {approved}
              </span>

            </div>


            {/* Completed */}

            <div className="flex items-center justify-between rounded-2xl border border-green-100 bg-green-50 p-4">

              <div>
                <p className="text-sm font-semibold text-green-800">
                  Completed
                </p>

                <p className="mt-1 text-xs text-green-600">
                  Finished sessions
                </p>
              </div>

              <span className="text-2xl font-extrabold text-green-700">
                {completed}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          RECENT BOOKINGS
      ====================================================== */}

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

          <div>

            <p className="text-xs font-bold uppercase tracking-[2px] text-pink-600">
              Overview
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-gray-900">
              Recent Training Sessions
            </h2>

          </div>

          <a
            href="/trainer/bookings"
            className="text-sm font-bold text-pink-600 transition hover:text-pink-700"
          >
            View all →
          </a>

        </div>


        {bookings.length === 0 ? (

          <div className="px-5 py-12 text-center sm:px-7">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-xl">
              📅
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              No bookings yet
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Your training sessions will appear here.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-gray-100">

            {bookings.slice(0, 5).map((booking) => (

              <div
                key={booking.id}
                className="flex flex-col gap-4 px-5 py-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-7"
              >

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-lg">
                    📅
                  </div>

                  <div className="min-w-0">

                    <p className="font-bold text-gray-900">
                      Training Session
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {booking.booking_date || "Date unavailable"}
                    </p>

                    <p className="text-xs text-gray-400">
                      {booking.booking_time || "Time unavailable"}
                    </p>

                  </div>

                </div>


                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${
                    booking.status === "Pending"
                      ? "bg-yellow-50 text-yellow-700"
                      : booking.status === "Approved"
                      ? "bg-pink-50 text-pink-700"
                      : booking.status === "Completed"
                      ? "bg-green-50 text-green-700"
                      : booking.status === "Cancelled"
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {booking.status}
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default TrainerDashboard;