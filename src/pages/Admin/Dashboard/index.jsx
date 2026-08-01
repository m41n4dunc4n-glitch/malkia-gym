import { useEffect, useState } from "react";
import {
  FaUsers,
  FaDumbbell,
  FaCalendarCheck,
  FaClock,
  FaPlusCircle,
  FaChartBar,
} from "react-icons/fa";
import { useGymSettings } from "../../../hooks/useGymSettings";

import { Link } from "react-router-dom";
import {
  getDashboardStats,
  getAllBookings,
} from "../../../services/admin";

function Dashboard() {
  const [stats, setStats] = useState({
    members: 0,
    trainers: 0,
    bookings: 0,
    pending: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);

  const { settings } = useGymSettings();

  useEffect(() => {
    const loadDashboard = async () => {
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);

      const { data } = await getAllBookings();
      setRecentBookings((data || []).slice(0, 5));
    };

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Members",
      value: stats.members,
      icon: <FaUsers />,
      color: "bg-pink-600",
    },
    {
      title: "Trainers",
      value: stats.trainers,
      icon: <FaDumbbell />,
      color: "bg-blue-600",
    },
    {
      title: "Bookings",
      value: stats.bookings,
      icon: <FaCalendarCheck />,
      color: "bg-green-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: <FaClock />,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold md:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-500 text-sm md:text-base">
            Welcome to {settings?.gym_name}. Here's what's happening today.
          </p>

        </div>

        <div className="text-left md:text-right">

          <p className="text-gray-500">
            {new Date().toLocaleDateString()}
          </p>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        {cards.map((card) => (

          <div
            key={card.title}
            className="rounded-3xl bg-white p-5 shadow"
          >

            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white md:h-14 md:w-14 md:text-2xl ${card.color}`}
            >
              {card.icon}
            </div>

            <p className="text-sm text-gray-500">
              {card.title}
            </p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              {card.value}
            </h2>

          </div>

        ))}

      </div>

      {/* Recent Bookings */}

      <div className="rounded-3xl bg-white p-5 md:p-8 shadow">

        <h2 className="mb-6 text-xl md:text-2xl font-bold">
          Recent Bookings
        </h2>

        <div className="space-y-4">

          {recentBookings.length === 0 && (
            <p>No bookings yet.</p>
          )}

          {recentBookings.map((booking) => (

            <div
              key={booking.id}
              className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-xl border p-4"
            >

              <div>

                <h3 className="font-semibold">
                  {booking.profiles?.full_name}
                </h3>

                <p className="text-gray-500 text-sm">
                  {booking.trainers?.name}
                </p>

              </div>

              <span className="w-fit rounded-full bg-pink-100 px-4 py-2 text-pink-700">
                {booking.status}
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Gym Info */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl bg-white p-6 shadow">
          <h3 className="font-bold">Gym</h3>
          <p className="mt-2 text-gray-600 wrap-break-word">
            {settings?.gym_name}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <h3 className="font-bold">Phone</h3>
          <p className="mt-2 text-gray-600">
            {settings?.phone}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <h3 className="font-bold">Email</h3>
          <p className="mt-2 break-all text-gray-600">
            {settings?.email}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <h3 className="font-bold">Hours</h3>
          <p className="mt-2 text-gray-600">
            {settings?.opening_time} - {settings?.closing_time}
          </p>
        </div>

      </div>

      {/* Quick Actions */}

      <div className="rounded-3xl bg-white p-5 md:p-8 shadow">

        <h2 className="mb-6 text-xl md:text-2xl font-bold">
          Quick Actions
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <Link
            to="/admin/trainers"
            className="rounded-2xl bg-pink-600 p-6 text-center text-white transition hover:bg-pink-700"
          >
            <FaPlusCircle className="mx-auto mb-4 text-3xl" />
            <p className="font-semibold">Add Trainer</p>
          </Link>

          <Link
            to="/admin/plans"
            className="rounded-2xl bg-blue-600 p-6 text-center text-white transition hover:bg-blue-700"
          >
            <FaPlusCircle className="mx-auto mb-4 text-3xl" />
            <p className="font-semibold">Membership Plans</p>
          </Link>

          <Link
            to="/admin/reports"
            className="rounded-2xl bg-green-600 p-6 text-center text-white transition hover:bg-green-700"
          >
            <FaChartBar className="mx-auto mb-4 text-3xl" />
            <p className="font-semibold">Reports</p>
          </Link>

          <Link
            to="/admin/members"
            className="rounded-2xl bg-black p-6 text-center text-white transition hover:bg-zinc-800"
          >
            <FaUsers className="mx-auto mb-4 text-3xl" />
            <p className="font-semibold">Manage Members</p>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;