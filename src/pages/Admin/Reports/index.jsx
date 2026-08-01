import { useEffect, useState } from "react";

import {
  FaMoneyBillWave,
  FaUsers,
  FaCalendarCheck,
  FaLayerGroup,
  FaDumbbell,
  FaUserCheck,
  FaUserSlash,
  FaClock,
  FaChartLine,
} from "react-icons/fa";

import { getReportStats } from "../../../services/reports";

function Reports() {
  const [stats, setStats] = useState({
    revenue: 0,
    members: 0,
    active: 0,
    suspended: 0,
    trainers: 0,
    bookings: 0,
    pending: 0,
    plans: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);

    const data = await getReportStats();

    setStats(data);

    setLoading(false);
  }

  const activePercentage =
    stats.members > 0
      ? Math.round((stats.active / stats.members) * 100)
      : 0;

  const suspendedPercentage =
    stats.members > 0
      ? Math.round((stats.suspended / stats.members) * 100)
      : 0;

  const pendingBookingPercentage =
    stats.bookings > 0
      ? Math.round((stats.pending / stats.bookings) * 100)
      : 0;

  const cards = [
    {
      title: "Estimated Revenue",
      value: `KSh ${stats.revenue.toLocaleString()}`,
      icon: <FaMoneyBillWave />,
      description: "Estimated membership value",
      bg: "bg-green-100",
      iconBg: "bg-green-600",
    },
    {
      title: "Total Members",
      value: stats.members,
      icon: <FaUsers />,
      description: `${activePercentage}% currently active`,
      bg: "bg-pink-100",
      iconBg: "bg-pink-600",
    },
    {
      title: "Total Bookings",
      value: stats.bookings,
      icon: <FaCalendarCheck />,
      description: `${stats.pending} pending`,
      bg: "bg-blue-100",
      iconBg: "bg-blue-600",
    },
    {
      title: "Membership Plans",
      value: stats.plans,
      icon: <FaLayerGroup />,
      description: "Available plans",
      bg: "bg-yellow-100",
      iconBg: "bg-yellow-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />

          <p className="mt-5 text-lg font-semibold text-gray-600">
            Loading reports...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-pink-100 p-4">
              <FaChartLine className="text-2xl text-pink-600" />
            </div>

            <div>

              <h1 className="text-4xl font-bold">
                Reports & Analytics
              </h1>

              <p className="mt-1 text-gray-500">
                Monitor the overall performance of Malkia Fitness.
              </p>

            </div>

          </div>

        </div>

        <button
          onClick={loadReports}
          className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-zinc-800"
        >
          Refresh Reports
        </button>

      </div>

      {/* KPI Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => (

          <div
            key={card.title}
            className="rounded-3xl bg-white p-7 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                  {card.title}
                </p>

                <h2 className="mt-4 text-3xl font-extrabold">
                  {card.value}
                </h2>

              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl text-white ${card.iconBg}`}
              >
                {card.icon}
              </div>

            </div>

            <p className="mt-5 text-sm text-gray-500">
              {card.description}
            </p>

          </div>

        ))}

      </div>

      {/* Revenue */}

      <div className="rounded-3xl bg-black p-8 text-white shadow-xl">

        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-green-600 p-4">

                <FaMoneyBillWave className="text-2xl" />

              </div>

              <div>

                <p className="text-sm uppercase tracking-wider text-gray-400">
                  Estimated Revenue
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Membership Value
                </h2>

              </div>

            </div>

            <p className="mt-6 max-w-xl text-gray-400">
              This estimate is calculated from members who currently
              have a membership plan assigned to their profile.
            </p>

          </div>

          <div className="text-left md:text-right">

            <p className="text-5xl font-extrabold text-green-500">
              KSh {stats.revenue.toLocaleString()}
            </p>

            <p className="mt-2 text-gray-400">
              Current estimated value
            </p>

          </div>

        </div>

      </div>

      {/* Member + Booking Statistics */}

      <div className="grid gap-8 lg:grid-cols-2">

        {/* Members */}

        <div className="rounded-3xl bg-white p-8 shadow-lg">

          <div className="mb-8">

            <h2 className="text-2xl font-bold">
              Member Statistics
            </h2>

            <p className="mt-2 text-gray-500">
              Current membership status across the gym.
            </p>

          </div>

          {/* Active */}

          <div className="mb-5 rounded-2xl bg-green-50 p-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-green-600 p-3 text-white">
                  <FaUserCheck />
                </div>

                <div>

                  <p className="font-semibold">
                    Active Members
                  </p>

                  <p className="text-sm text-gray-500">
                    {activePercentage}% of all members
                  </p>

                </div>

              </div>

              <span className="text-3xl font-bold text-green-600">
                {stats.active}
              </span>

            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-green-100">

              <div
                className="h-full rounded-full bg-green-600 transition-all duration-700"
                style={{
                  width: `${activePercentage}%`,
                }}
              />

            </div>

          </div>

          {/* Suspended */}

          <div className="mb-5 rounded-2xl bg-red-50 p-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-red-600 p-3 text-white">
                  <FaUserSlash />
                </div>

                <div>

                  <p className="font-semibold">
                    Suspended Members
                  </p>

                  <p className="text-sm text-gray-500">
                    {suspendedPercentage}% of all members
                  </p>

                </div>

              </div>

              <span className="text-3xl font-bold text-red-600">
                {stats.suspended}
              </span>

            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-red-100">

              <div
                className="h-full rounded-full bg-red-600 transition-all duration-700"
                style={{
                  width: `${suspendedPercentage}%`,
                }}
              />

            </div>

          </div>

          {/* Total */}

          <div className="rounded-2xl bg-pink-50 p-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-pink-600 p-3 text-white">
                  <FaUsers />
                </div>

                <div>

                  <p className="font-semibold">
                    Total Members
                  </p>

                  <p className="text-sm text-gray-500">
                    Registered members
                  </p>

                </div>

              </div>

              <span className="text-3xl font-bold text-pink-600">
                {stats.members}
              </span>

            </div>

          </div>

        </div>

        {/* Bookings */}

        <div className="rounded-3xl bg-white p-8 shadow-lg">

          <div className="mb-8">

            <h2 className="text-2xl font-bold">
              Booking Statistics
            </h2>

            <p className="mt-2 text-gray-500">
              Overview of gym training bookings.
            </p>

          </div>

          {/* Total */}

          <div className="mb-5 rounded-2xl bg-blue-50 p-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-blue-600 p-3 text-white">
                  <FaCalendarCheck />
                </div>

                <div>

                  <p className="font-semibold">
                    Total Bookings
                  </p>

                  <p className="text-sm text-gray-500">
                    All recorded bookings
                  </p>

                </div>

              </div>

              <span className="text-3xl font-bold text-blue-600">
                {stats.bookings}
              </span>

            </div>

          </div>

          {/* Pending */}

          <div className="mb-5 rounded-2xl bg-yellow-50 p-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-yellow-500 p-3 text-white">
                  <FaClock />
                </div>

                <div>

                  <p className="font-semibold">
                    Pending Bookings
                  </p>

                  <p className="text-sm text-gray-500">
                    {pendingBookingPercentage}% of all bookings
                  </p>

                </div>

              </div>

              <span className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </span>

            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-yellow-100">

              <div
                className="h-full rounded-full bg-yellow-500 transition-all duration-700"
                style={{
                  width: `${pendingBookingPercentage}%`,
                }}
              />

            </div>

          </div>

          {/* Trainers */}

          <div className="rounded-2xl bg-purple-50 p-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-purple-600 p-3 text-white">
                  <FaDumbbell />
                </div>

                <div>

                  <p className="font-semibold">
                    Trainers
                  </p>

                  <p className="text-sm text-gray-500">
                    Registered gym trainers
                  </p>

                </div>

              </div>

              <span className="text-3xl font-bold text-purple-600">
                {stats.trainers}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Membership Overview */}

      <div className="rounded-3xl bg-white p-8 shadow-lg">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-yellow-100 p-4">

            <FaLayerGroup className="text-2xl text-yellow-600" />

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              Membership Overview
            </h2>

            <p className="text-gray-500">
              Current plans available to members.
            </p>

          </div>

        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border p-6">

            <p className="text-gray-500">
              Available Plans
            </p>

            <p className="mt-2 text-4xl font-bold">
              {stats.plans}
            </p>

          </div>

          <div className="rounded-2xl border p-6">

            <p className="text-gray-500">
              Members With Plans
            </p>

            <p className="mt-2 text-4xl font-bold">
              {stats.active}
            </p>

          </div>

          <div className="rounded-2xl border p-6">

            <p className="text-gray-500">
              Trainers
            </p>

            <p className="mt-2 text-4xl font-bold">
              {stats.trainers}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Reports;