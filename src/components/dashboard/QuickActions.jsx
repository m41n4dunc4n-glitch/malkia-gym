import { Link } from "react-router-dom";

function QuickActions() {
  return (
    <div className="rounded-2xl bg-white p-5 sm:p-6 lg:p-8 shadow">

      <h2 className="text-2xl font-bold">
        Quick Actions
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Link
          to="/member/bookings"
          className="rounded-xl bg-pink-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-pink-700"
        >
          Book Trainer
        </Link>

        <Link
          to="/member/profile"
          className="rounded-xl border border-pink-600 px-6 py-4 text-center font-semibold text-pink-600 transition hover:bg-pink-50"
        >
          Edit Profile
        </Link>

        <Link
          to="/member/membership"
          className="rounded-xl border border-pink-600 px-6 py-4 text-center font-semibold text-pink-600 transition hover:bg-pink-50"
        >
          Membership
        </Link>

        <Link
          to="/member/settings"
          className="rounded-xl border border-pink-600 px-6 py-4 text-center font-semibold text-pink-600 transition hover:bg-pink-50"
        >
          Settings
        </Link>

      </div>

    </div>
  );
}

export default QuickActions;