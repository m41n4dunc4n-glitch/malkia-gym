import { useEffect, useState } from "react";

import {
  FaUsers,
  FaDumbbell,
  FaCalendarCheck,
  FaClock,
  FaPlusCircle,
  FaChartBar,
  FaArrowRight,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaChartLine,
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
      light: "bg-pink-50",
      text: "text-pink-600",
      description: "Registered members",
    },
    {
      title: "Trainers",
      value: stats.trainers,
      icon: <FaDumbbell />,
      color: "bg-black",
      light: "bg-gray-100",
      text: "text-gray-900",
      description: "Active trainers",
    },
    {
      title: "Bookings",
      value: stats.bookings,
      icon: <FaCalendarCheck />,
      color: "bg-pink-600",
      light: "bg-pink-50",
      text: "text-pink-600",
      description: "Total bookings",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: <FaClock />,
      color: "bg-yellow-500",
      light: "bg-yellow-50",
      text: "text-yellow-600",
      description: "Awaiting attention",
    },
  ];

  return (
    <div className="space-y-8">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-black via-zinc-900 to-pink-700 p-7 text-white shadow-xl sm:p-10">

        {/* Decorative background */}

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur">

              <FaChartLine className="text-2xl text-pink-400" />

            </div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-300">
              Malkia Fitness
            </p>

            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
              Welcome to {settings?.gym_name || "Malkia Fitness"}.
              Here's what's happening across the gym today.
            </p>

          </div>


          {/* Date */}

          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Today
            </p>

            <p className="mt-2 text-xl font-bold">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
              })}
            </p>

            <p className="mt-1 text-sm text-pink-300">
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">

        {cards.map((card) => (

          <div
            key={card.title}
            className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6"
          >

            <div className="flex items-start justify-between">

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg text-white transition duration-300 group-hover:scale-110 ${card.color}`}
              >
                {card.icon}
              </div>

              <div
                className={`rounded-full px-3 py-1 text-xs font-bold ${card.light} ${card.text}`}
              >
                Live
              </div>

            </div>

            <p className="mt-5 text-sm font-semibold text-gray-500">
              {card.title}
            </p>

            <h2 className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {card.value}
            </h2>

            <p className="mt-2 text-xs text-gray-400">
              {card.description}
            </p>

          </div>

        ))}

      </div>


      {/* =====================================================
          RECENT BOOKINGS
      ===================================================== */}

      <div className="overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-lg">

        {/* Header */}

        <div className="border-b border-gray-100 p-6 sm:p-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">

                  <FaCalendarCheck />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    Recent Bookings
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Latest training session requests.
                  </p>

                </div>

              </div>

            </div>

            <Link
              to="/admin/bookings"
              className="flex w-fit items-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-pink-700"
            >
              View All
              <FaArrowRight />
            </Link>

          </div>

        </div>


        {/* Booking list */}

        <div className="space-y-3 p-5 sm:p-7">

          {recentBookings.length === 0 && (

            <div className="rounded-2xl bg-gray-50 p-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-xl text-pink-600">

                <FaCalendarCheck />

              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                No bookings yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                New member bookings will appear here.
              </p>

            </div>

          )}


          {recentBookings.map((booking) => (

            <div
              key={booking.id}
              className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-pink-200 hover:bg-pink-50/40 sm:flex-row sm:items-center sm:justify-between"
            >

              {/* Member */}

              <div className="flex min-w-0 items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white">

                  <FaUsers />

                </div>

                <div className="min-w-0">

                  <h3 className="wrap-break-word font-bold text-gray-900">
                    {booking.profiles?.full_name ||
                      "Unknown Member"}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">

                    <span>
                      {booking.trainers?.name ||
                        "Unknown Trainer"}
                    </span>

                    <span className="text-gray-300">
                      •
                    </span>

                    <span>
                      {booking.booking_time || "—"}
                    </span>

                  </div>

                </div>

              </div>


              {/* Status */}

              <span
                className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${
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

          ))}

        </div>

      </div>


      {/* =====================================================
          GYM INFORMATION
      ===================================================== */}

      <div>

        <div className="mb-5">

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
            Gym Overview
          </p>

          <h2 className="mt-1 text-2xl font-extrabold text-gray-900">
            Gym Information
          </h2>

        </div>


        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Gym */}

          <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white">

              <FaBuilding />

            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-gray-400">
              Gym
            </p>

            <p className="mt-2 wrap-break-word font-bold text-gray-900">
              {settings?.gym_name || "—"}
            </p>

          </div>


          {/* Phone */}

          <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 transition group-hover:bg-green-600 group-hover:text-white">

              <FaPhone />

            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-gray-400">
              Phone
            </p>

            <p className="mt-2 break-all font-bold text-gray-900">
              {settings?.phone || "—"}
            </p>

          </div>


          {/* Email */}

          <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

              <FaEnvelope />

            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-gray-400">
              Email
            </p>

            <p className="mt-2 break-all font-bold text-gray-900">
              {settings?.email || "—"}
            </p>

          </div>


          {/* Hours */}

          <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 transition group-hover:bg-yellow-500 group-hover:text-white">

              <FaClock />

            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-gray-400">
              Hours
            </p>

            <p className="mt-2 font-bold text-gray-900">
              {settings?.opening_time || "—"}{" "}
              -{" "}
              {settings?.closing_time || "—"}
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <div className="relative overflow-hidden rounded-4xl bg-black p-6 text-white shadow-xl sm:p-8">

        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="relative">

          <div className="mb-7">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-400">
              Administration
            </p>

            <h2 className="mt-2 text-2xl font-extrabold">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Jump directly to the areas you manage most.
            </p>

          </div>


          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Add Trainer */}

            <Link
              to="/admin/trainers"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition duration-300 hover:-translate-y-1 hover:bg-pink-600"
            >

              <FaPlusCircle className="mx-auto mb-4 text-3xl text-pink-400 transition group-hover:text-white" />

              <p className="font-bold">
                Add Trainer
              </p>

              <p className="mt-1 text-xs text-gray-400 group-hover:text-pink-100">
                Manage your trainers
              </p>

            </Link>


            {/* Membership Plans */}

            <Link
              to="/admin/plans"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition duration-300 hover:-translate-y-1 hover:bg-pink-600"
            >

              <FaPlusCircle className="mx-auto mb-4 text-3xl text-pink-400 transition group-hover:text-white" />

              <p className="font-bold">
                Membership Plans
              </p>

              <p className="mt-1 text-xs text-gray-400 group-hover:text-pink-100">
                Manage membership options
              </p>

            </Link>


            {/* Reports */}

            <Link
              to="/admin/reports"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition duration-300 hover:-translate-y-1 hover:bg-pink-600"
            >

              <FaChartBar className="mx-auto mb-4 text-3xl text-pink-400 transition group-hover:text-white" />

              <p className="font-bold">
                Reports
              </p>

              <p className="mt-1 text-xs text-gray-400 group-hover:text-pink-100">
                View gym analytics
              </p>

            </Link>


            {/* Members */}

            <Link
              to="/admin/members"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition duration-300 hover:-translate-y-1 hover:bg-pink-600"
            >

              <FaUsers className="mx-auto mb-4 text-3xl text-pink-400 transition group-hover:text-white" />

              <p className="font-bold">
                Manage Members
              </p>

              <p className="mt-1 text-xs text-gray-400 group-hover:text-pink-100">
                View member accounts
              </p>

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;