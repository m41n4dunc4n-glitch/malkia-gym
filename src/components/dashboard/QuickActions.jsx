import { Link } from "react-router-dom";
import {
  FaUser,
  FaDumbbell,
  FaPlusCircle,
  FaCog,
} from "react-icons/fa";

function QuickActions() {
  return (
    <div className="rounded-2xl bg-white p-5 sm:p-6 lg:p-8 shadow">

      <h2 className="text-2xl font-bold">
        Quick Actions
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Link
            to="/member/bookings"
            className="rounded-2xl bg-pink-600 p-6 text-center text-white transition hover:bg-pink-700"
          >
            <FaPlusCircle className="mx-auto mb-4 text-3xl" />
            <p className="font-semibold">Book Trainer</p>
          </Link>

        <Link
            to="/member/profile"
            className="rounded-2xl bg-blue-600 p-6 text-center text-white transition hover:bg-blue-700"
          >
            <FaUser className="mx-auto mb-4 text-3xl" />
            <p className="font-semibold">Edit Profile</p>
          </Link>

        <Link
            to="/member/membership"
            className="rounded-2xl bg-green-600 p-6 text-center text-white transition hover:bg-green-700"
          >
            <FaDumbbell className="mx-auto mb-4 text-3xl" />
            <p className="font-semibold">Membership</p>
          </Link>

          <Link
            to="/member/settings"
            className="rounded-2xl bg-black p-6 text-center text-white transition hover:bg-zinc-800"
          >
            <FaCog className="mx-auto mb-4 text-3xl" />
            <p className="font-semibold">Settings</p>
          </Link>

      </div>

    </div>
  );
}

export default QuickActions;