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

    const { data: trainerData } =
      await getTrainerByUserId(user.id);

    if (!trainerData) {
      setTrainer(null);
      setBookings([]);
      setLoading(false);
      return;
    }

    setTrainer(trainerData);

    const { data: bookingData } =
      await getTrainerBookings(trainerData.id);

    setBookings(bookingData || []);

    setLoading(false);
  }, [user]);

  useEffect(() => {
    // call loadData from an async inner function to avoid
    // calling setState synchronously inside the effect body
    const run = async () => {
      await loadData();
    };

    run();
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

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading trainer dashboard...
        </p>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow">
        <h1 className="text-2xl font-bold text-gray-900">
          Trainer profile not found
        </h1>

        <p className="mt-3 text-gray-500">
          Your account has not been connected to a trainer profile yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[3px] text-pink-600">
            Trainer Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-extrab800 text-gray-900 md:text-4xl">
            Welcome, {trainer.name}
          </h1>

          <p className="mt-2 text-gray-500">
            Here's an overview of your training activities.
          </p>
        </div>

        <button
          onClick={loadData}
          className="rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          ↻ Refresh
        </button>

      </div>

      {/* STATISTICS */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Pending */}

        <div className="rounded-3xl bg-white p-6 shadow-sm">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-xl">
            ⏳
          </div>

          <p className="text-sm font-medium text-gray-500">
            Pending
          </p>

          <p className="mt-1 text-3xl font-extrabold text-gray-900">
            {pending}
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Awaiting admin approval
          </p>

        </div>

        {/* Approved */}

        <div className="rounded-3xl bg-white p-6 shadow-sm">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl">
            ✓
          </div>

          <p className="text-sm font-medium text-gray-500">
            Approved
          </p>

          <p className="mt-1 text-3xl font-extrabold text-gray-900">
            {approved}
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Upcoming sessions
          </p>

        </div>

        {/* Completed */}

        <div className="rounded-3xl bg-white p-6 shadow-sm">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl">
            ✓
          </div>

          <p className="text-sm font-medium text-gray-500">
            Completed
          </p>

          <p className="mt-1 text-3xl font-extrabold text-gray-900">
            {completed}
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Sessions completed
          </p>

        </div>

        {/* Cancelled */}

        <div className="rounded-3xl bg-white p-6 shadow-sm">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-xl">
            ×
          </div>

          <p className="text-sm font-medium text-gray-500">
            Cancelled
          </p>

          <p className="mt-1 text-3xl font-extrabold text-gray-900">
            {cancelled}
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Cancelled sessions
          </p>

        </div>

      </div>

      {/* QUICK OVERVIEW */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Trainer */}

        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

          <p className="text-sm font-semibold uppercase tracking-[2px] text-pink-600">
            Trainer
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {trainer.name}
          </h2>

          <p className="mt-1 text-gray-500">
            {trainer.specialty}
          </p>

          <div className="mt-6 space-y-4">

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">
                Experience
              </span>

              <span className="font-semibold">
                {trainer.experience || 0} years
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-500">
                Phone
              </span>

              <span className="font-semibold">
                {trainer.phone || "Not provided"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Capacity
              </span>

              <span className="font-semibold">
                {trainer.capacity_per_slot || 10} members
              </span>
            </div>

          </div>

        </div>

        {/* Today's activity */}

        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

          <p className="text-sm font-semibold uppercase tracking-[2px] text-pink-600">
            Activity
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Training Sessions
          </h2>

          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">

              <span className="text-gray-600">
                Total bookings
              </span>

              <span className="text-xl font-bold">
                {bookings.length}
              </span>

            </div>

            <div className="flex items-center justify-between rounded-2xl bg-yellow-50 p-4">

              <span className="text-gray-600">
                Pending approval
              </span>

              <span className="text-xl font-bold text-yellow-700">
                {pending}
              </span>

            </div>

            <div className="flex items-center justify-between rounded-2xl bg-green-50 p-4">

              <span className="text-gray-600">
                Approved
              </span>

              <span className="text-xl font-bold text-green-700">
                {approved}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default TrainerDashboard;