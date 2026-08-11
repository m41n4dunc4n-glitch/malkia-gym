import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../hooks/useAuth";

function Trainer() {
  const { user } = useAuth();

  const [trainer, setTrainer] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTrainerData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError("");

    try {
      // --------------------------------------------------
      // FIND THE TRAINER CONNECTED TO THE LOGGED-IN USER
      // --------------------------------------------------

      const {
        data: trainerData,
        error: trainerError,
      } = await supabase
        .from("trainers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (trainerError) {
        console.error("Trainer lookup error:", trainerError);

        setError(
          "Your trainer account has not been linked yet. Please contact the administrator."
        );

        setLoading(false);
        return;
      }

      setTrainer(trainerData);

      // --------------------------------------------------
      // LOAD TRAINER BOOKINGS
      // --------------------------------------------------

      const {
        data: bookingData,
        error: bookingError,
      } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles (
            full_name,
            email,
            phone
          )
        `)
        .eq("trainer_id", trainerData.id)
        .order("booking_date", {
          ascending: true,
        })
        .order("booking_time", {
          ascending: true,
        });

      if (bookingError) {
        console.error(
          "Booking loading error:",
          bookingError
        );
      }

      setBookings(bookingData || []);
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong while loading your trainer dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    let isActive = true;

    const runLoad = async () => {
      if (!isActive) return;
      await loadTrainerData();
    };

    void runLoad();

    return () => {
      isActive = false;
    };
  }, [user?.id, loadTrainerData]);

  // --------------------------------------------------
  // BOOKING STATUS
  // --------------------------------------------------

  function getStatusClass(status) {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Approved":
        return "bg-green-100 text-green-700";

      case "Completed":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />

          <p className="text-lg font-semibold">
            Loading trainer dashboard...
          </p>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR / NOT LINKED
  // --------------------------------------------------

  if (error || !trainer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">

        <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-lg">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
            ⚠️
          </div>

          <h1 className="text-2xl font-bold">
            Trainer Account Not Linked
          </h1>

          <p className="mt-3 text-gray-500">
            {error ||
              "Your account is not currently connected to a trainer profile."}
          </p>

          <button
            onClick={loadTrainerData}
            className="mt-6 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // --------------------------------------------------
  // BOOKING COUNTS
  // --------------------------------------------------

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  );

  const approvedBookings = bookings.filter(
    (booking) => booking.status === "Approved"
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  );

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled"
  );

  // --------------------------------------------------
  // DASHBOARD
  // --------------------------------------------------

  return (
    <div className="space-y-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="rounded-3xl bg-black p-6 text-white shadow-lg md:p-8">

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-5">

            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-pink-600 bg-gray-800">

              {trainer.image_url ? (
                <img
                  src={trainer.image_url}
                  alt={trainer.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold">
                  {trainer.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>
              )}

            </div>

            <div>

              <p className="text-sm font-medium text-pink-400">
                Trainer Dashboard
              </p>

              <h1 className="text-3xl font-bold md:text-4xl">
                Welcome, {trainer.name}
              </h1>

              <p className="mt-1 text-gray-300">
                {trainer.specialty ||
                  "Fitness Trainer"}
              </p>

            </div>

          </div>

          <button
            onClick={loadTrainerData}
            className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20"
          >
            ↻ Refresh
          </button>

        </div>

      </div>

      {/* ==================================================
          STATISTICS
      ================================================== */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Pending */}

        <div className="rounded-3xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Pending
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {pendingBookings.length}
              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-xl">
              ⏳
            </div>

          </div>

        </div>

        {/* Approved */}

        <div className="rounded-3xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Approved
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {approvedBookings.length}
              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl">
              ✓
            </div>

          </div>

        </div>

        {/* Completed */}

        <div className="rounded-3xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Completed
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {completedBookings.length}
              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl">
              ✓
            </div>

          </div>

        </div>

        {/* Cancelled */}

        <div className="rounded-3xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Cancelled
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {cancelledBookings.length}
              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-xl">
              ×
            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          TRAINER PROFILE
      ================================================== */}

      <div className="rounded-3xl bg-white p-6 shadow md:p-8">

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              My Trainer Profile
            </h2>

            <p className="mt-1 text-gray-500">
              Your information as displayed by Malkia Gym.
            </p>

          </div>

          <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            Trainer Account
          </span>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl bg-gray-50 p-5">

            <p className="text-sm text-gray-500">
              Full Name
            </p>

            <p className="mt-1 text-lg font-bold">
              {trainer.name || "-"}
            </p>

          </div>

          <div className="rounded-2xl bg-gray-50 p-5">

            <p className="text-sm text-gray-500">
              Specialty
            </p>

            <p className="mt-1 text-lg font-bold">
              {trainer.specialty || "-"}
            </p>

          </div>

          <div className="rounded-2xl bg-gray-50 p-5">

            <p className="text-sm text-gray-500">
              Experience
            </p>

            <p className="mt-1 text-lg font-bold">
              {trainer.experience || 0} Years
            </p>

          </div>

          <div className="rounded-2xl bg-gray-50 p-5">

            <p className="text-sm text-gray-500">
              Phone
            </p>

            <p className="mt-1 text-lg font-bold">
              {trainer.phone || "-"}
            </p>

          </div>

          <div className="rounded-2xl bg-gray-50 p-5">

            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="mt-1 break-all text-lg font-bold">
              {trainer.email || user?.email || "-"}
            </p>

          </div>

          <div className="rounded-2xl bg-gray-50 p-5">

            <p className="text-sm text-gray-500">
              Capacity Per Slot
            </p>

            <p className="mt-1 text-lg font-bold">
              {trainer.capacity_per_slot ||
                trainer.max_clients ||
                1}{" "}
              Members
            </p>

          </div>

        </div>

        {trainer.bio && (
          <div className="mt-5 rounded-2xl bg-gray-50 p-5">

            <p className="text-sm text-gray-500">
              Biography
            </p>

            <p className="mt-2 leading-relaxed text-gray-700">
              {trainer.bio}
            </p>

          </div>
        )}

      </div>

      {/* ==================================================
          WORKING SCHEDULE
      ================================================== */}

      <div className="rounded-3xl bg-white p-6 shadow md:p-8">

        <h2 className="text-2xl font-bold">
          My Working Schedule
        </h2>

        <p className="mt-1 text-gray-500">
          Your current working hours and availability.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

            <div className="text-2xl">
              🌅
            </div>

            <h3 className="mt-3 font-bold">
              Morning
            </h3>

            <p className="mt-2 text-gray-600">
              {trainer.morning_start ||
                "08:00"}{" "}
              —{" "}
              {trainer.morning_end ||
                "12:00"}
            </p>

          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

            <div className="text-2xl">
              🍽️
            </div>

            <h3 className="mt-3 font-bold">
              Lunch Break
            </h3>

            <p className="mt-2 text-gray-600">
              {trainer.lunch_start ||
                "12:00"}{" "}
              —{" "}
              {trainer.lunch_end ||
                "13:00"}
            </p>

          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

            <div className="text-2xl">
              🌙
            </div>

            <h3 className="mt-3 font-bold">
              Evening
            </h3>

            <p className="mt-2 text-gray-600">
              {trainer.evening_start ||
                "13:00"}{" "}
              —{" "}
              {trainer.evening_end ||
                "20:00"}
            </p>

          </div>

        </div>

        <div className="mt-6">

          <h3 className="font-bold">
            Working Days
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">

            {[
              ["monday", "Mon"],
              ["tuesday", "Tue"],
              ["wednesday", "Wed"],
              ["thursday", "Thu"],
              ["friday", "Fri"],
              ["saturday", "Sat"],
              ["sunday", "Sun"],
            ].map(([key, label]) => (

              <span
                key={key}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  trainer[key]
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-400 line-through"
                }`}
              >
                {label}
              </span>

            ))}

          </div>

        </div>

      </div>

      {/* ==================================================
          BOOKINGS
      ================================================== */}

      <div className="rounded-3xl bg-white p-6 shadow md:p-8">

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              My Training Bookings
            </h2>

            <p className="mt-1 text-gray-500">
              Members currently assigned to your training sessions.
            </p>

          </div>

          <span className="w-fit rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700">
            {bookings.length} Total
          </span>

        </div>

        {bookings.length === 0 ? (

          <div className="rounded-2xl bg-gray-50 p-10 text-center">

            <div className="text-4xl">
              📅
            </div>

            <h3 className="mt-4 text-xl font-bold">
              No bookings yet
            </h3>

            <p className="mt-2 text-gray-500">
              Member bookings assigned to you will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {bookings.map((booking) => (

              <div
                key={booking.id}
                className="rounded-2xl border border-gray-100 p-5 transition hover:shadow-md"
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  {/* MEMBER */}

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pink-600 text-lg font-bold text-white">

                      {booking.profiles?.full_name
                        ?.charAt(0)
                        ?.toUpperCase() || "M"}

                    </div>

                    <div className="min-w-0">

                      <h3 className="font-bold">
                        {booking.profiles?.full_name ||
                          "Member"}
                      </h3>

                      <p className="break-all text-sm text-gray-500">
                        {booking.profiles?.email ||
                          ""}
                      </p>

                      {booking.profiles?.phone && (
                        <p className="text-sm text-gray-500">
                          {booking.profiles.phone}
                        </p>
                      )}

                    </div>

                  </div>

                  {/* DATE / TIME */}

                  <div className="flex flex-col gap-2 text-gray-700 sm:flex-row sm:gap-6">

                    <div>
                      <span className="text-sm text-gray-400">
                        Date
                      </span>

                      <p className="font-semibold">
                        {booking.booking_date}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm text-gray-400">
                        Time
                      </span>

                      <p className="font-semibold">
                        {booking.booking_time}
                      </p>
                    </div>

                  </div>

                  {/* STATUS */}

                  <span
                    className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Trainer;