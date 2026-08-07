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
  FaArrowUp,
  FaArrowDown,
  FaSyncAlt,
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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setRefreshing(true);

    try {
      const data = await getReportStats();

      setStats({
        revenue: data?.revenue || 0,
        members: data?.members || 0,
        active: data?.active || 0,
        suspended: data?.suspended || 0,
        trainers: data?.trainers || 0,
        bookings: data?.bookings || 0,
        pending: data?.pending || 0,
        plans: data?.plans || 0,
      });
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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

  const completedBookingPercentage =
    stats.bookings > 0
      ? Math.max(
          0,
          Math.round(
            ((stats.bookings - stats.pending) / stats.bookings) * 100
          )
        )
      : 0;

  const cards = [
    {
      title: "Estimated Revenue",
      value: `KSh ${Number(stats.revenue).toLocaleString()}`,
      description: "Current membership value",
      icon: <FaMoneyBillWave />,
      iconBg: "bg-green-600",
      softBg: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "Total Members",
      value: stats.members,
      description: `${activePercentage}% currently active`,
      icon: <FaUsers />,
      iconBg: "bg-pink-600",
      softBg: "bg-pink-50",
      text: "text-pink-600",
    },
    {
      title: "Total Bookings",
      value: stats.bookings,
      description: `${stats.pending} currently pending`,
      icon: <FaCalendarCheck />,
      iconBg: "bg-blue-600",
      softBg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Membership Plans",
      value: stats.plans,
      description: "Available plans",
      icon: <FaLayerGroup />,
      iconBg: "bg-yellow-500",
      softBg: "bg-yellow-50",
      text: "text-yellow-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50">
            <FaChartLine className="animate-pulse text-2xl text-pink-600" />
          </div>

          <p className="mt-5 text-lg font-bold text-gray-800">
            Loading reports...
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Gathering your gym statistics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div>
          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-600 text-white shadow-lg shadow-pink-100">
              <FaChartLine className="text-2xl" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-pink-600">
                Analytics
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Reports & Analytics
              </h1>
            </div>

          </div>

          <p className="mt-4 max-w-2xl text-gray-500">
            Monitor members, bookings, trainers, memberships and estimated
            revenue from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={loadReports}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-black px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaSyncAlt
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh Reports"}
        </button>

      </div>

      {/* =========================================================
          KPI CARDS
      ========================================================= */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => (
          <div
            key={card.title}
            className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="flex items-start justify-between">

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl text-white shadow-sm ${card.iconBg}`}
              >
                {card.icon}
              </div>

              <div
                className={`rounded-full px-3 py-1 text-xs font-bold ${card.softBg} ${card.text}`}
              >
                Overview
              </div>

            </div>

            <p className="mt-6 text-sm font-semibold text-gray-400">
              {card.title}
            </p>

            <h2 className="mt-2 wrap-break-word text-3xl font-black tracking-tight text-gray-900">
              {card.value}
            </h2>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${card.softBg} ${card.text}`}
              >
                <FaArrowUp className="text-[10px]" />
              </span>

              {card.description}
            </div>

          </div>
        ))}

      </div>

      {/* =========================================================
          REVENUE HERO
      ========================================================= */}

      <div className="relative overflow-hidden rounded-3xl bg-black p-7 text-white shadow-xl sm:p-9">

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-xl">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 shadow-lg shadow-green-900/30">
                <FaMoneyBillWave className="text-2xl" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Estimated Revenue
                </p>

                <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                  Membership Value
                </h2>
              </div>

            </div>

            <p className="mt-6 leading-7 text-gray-400">
              This estimate represents the membership value currently
              associated with members who have a membership plan assigned
              to their profile.
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:min-w-70">

            <p className="text-sm font-medium text-gray-400">
              Current Estimated Value
            </p>

            <p className="mt-2 wrap-break-word text-3xl font-black text-green-400 sm:text-4xl">
              KSh {Number(stats.revenue).toLocaleString()}
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                <FaArrowUp className="text-[10px]" />
              </span>

              Based on assigned memberships
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================
          MEMBER + BOOKING STATISTICS
      ========================================================= */}

      <div className="grid gap-6 xl:grid-cols-2">

        {/* MEMBERS */}

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-2xl font-black text-gray-900">
                Member Statistics
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Current membership status across the gym.
              </p>
            </div>

            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 sm:flex">
              <FaUsers />
            </div>

          </div>

          {/* Active */}

          <div className="mt-8 rounded-2xl border border-green-100 bg-green-50/70 p-5">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
                  <FaUserCheck />
                </div>

                <div>
                  <p className="font-bold text-gray-900">
                    Active Members
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {activePercentage}% of all members
                  </p>
                </div>

              </div>

              <span className="text-3xl font-black text-green-600">
                {stats.active}
              </span>

            </div>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-green-100">
              <div
                className="h-full rounded-full bg-green-600 transition-all duration-700"
                style={{
                  width: `${Math.min(activePercentage, 100)}%`,
                }}
              />
            </div>

          </div>

          {/* Suspended */}

          <div className="mt-4 rounded-2xl border border-red-100 bg-red-50/70 p-5">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">
                  <FaUserSlash />
                </div>

                <div>
                  <p className="font-bold text-gray-900">
                    Suspended Members
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {suspendedPercentage}% of all members
                  </p>
                </div>

              </div>

              <span className="text-3xl font-black text-red-600">
                {stats.suspended}
              </span>

            </div>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-red-100">
              <div
                className="h-full rounded-full bg-red-600 transition-all duration-700"
                style={{
                  width: `${Math.min(suspendedPercentage, 100)}%`,
                }}
              />
            </div>

          </div>

          {/* Total */}

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-gray-50 p-5">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-600 text-white">
                <FaUsers />
              </div>

              <div>
                <p className="font-bold text-gray-900">
                  Total Members
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Registered members
                </p>
              </div>

            </div>

            <span className="text-3xl font-black text-pink-600">
              {stats.members}
            </span>

          </div>

        </div>

        {/* BOOKINGS */}

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-2xl font-black text-gray-900">
                Booking Statistics
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Overview of gym training bookings.
              </p>
            </div>

            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:flex">
              <FaCalendarCheck />
            </div>

          </div>

          {/* Total Bookings */}

          <div className="mt-8 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/70 p-5">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <FaCalendarCheck />
              </div>

              <div>
                <p className="font-bold text-gray-900">
                  Total Bookings
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  All recorded bookings
                </p>
              </div>

            </div>

            <span className="text-3xl font-black text-blue-600">
              {stats.bookings}
            </span>

          </div>

          {/* Pending */}

          <div className="mt-4 rounded-2xl border border-yellow-100 bg-yellow-50/70 p-5">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500 text-white">
                  <FaClock />
                </div>

                <div>
                  <p className="font-bold text-gray-900">
                    Pending Bookings
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {pendingBookingPercentage}% of all bookings
                  </p>
                </div>

              </div>

              <span className="text-3xl font-black text-yellow-600">
                {stats.pending}
              </span>

            </div>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-yellow-100">
              <div
                className="h-full rounded-full bg-yellow-500 transition-all duration-700"
                style={{
                  width: `${Math.min(pendingBookingPercentage, 100)}%`,
                }}
              />
            </div>

          </div>

          {/* Completed */}

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-green-100 bg-green-50/70 p-5">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white">
                <FaUserCheck />
              </div>

              <div>
                <p className="font-bold text-gray-900">
                  Non-Pending Bookings
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {completedBookingPercentage}% of bookings
                </p>
              </div>

            </div>

            <span className="text-3xl font-black text-green-600">
              {Math.max(stats.bookings - stats.pending, 0)}
            </span>

          </div>

          {/* Trainers */}

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-purple-50 p-5">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-white">
                <FaDumbbell />
              </div>

              <div>
                <p className="font-bold text-gray-900">
                  Trainers
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Registered gym trainers
                </p>
              </div>

            </div>

            <span className="text-3xl font-black text-purple-600">
              {stats.trainers}
            </span>

          </div>

        </div>

      </div>

      {/* =========================================================
          QUICK SUMMARY
      ========================================================= */}

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600">
              <FaLayerGroup className="text-xl" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-gray-900">
                Membership Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Quick overview of your gym's membership setup.
              </p>
            </div>

          </div>

          <div className="rounded-full bg-pink-50 px-4 py-2 text-sm font-bold text-pink-600">
            {stats.plans} Available Plans
          </div>

        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <p className="text-sm font-semibold text-gray-500">
              Available Plans
            </p>

            <p className="mt-3 text-4xl font-black text-gray-900">
              {stats.plans}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Membership packages
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <p className="text-sm font-semibold text-gray-500">
              Active Members
            </p>

            <p className="mt-3 text-4xl font-black text-green-600">
              {stats.active}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Currently active
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <p className="text-sm font-semibold text-gray-500">
              Trainers
            </p>

            <p className="mt-3 text-4xl font-black text-purple-600">
              {stats.trainers}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Registered trainers
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <p className="text-sm font-semibold text-gray-500">
              Pending Bookings
            </p>

            <p className="mt-3 text-4xl font-black text-yellow-600">
              {stats.pending}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Require attention
            </p>
          </div>

        </div>

      </div>

      {/* =========================================================
          FOOTER INSIGHT
      ========================================================= */}

      <div className="rounded-3xl bg-linear-to-r from-pink-600 to-pink-700 p-6 text-white shadow-lg sm:p-8">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-pink-200">
              Dashboard Insight
            </p>

            <h3 className="mt-2 text-2xl font-black">
              {stats.active > stats.suspended
                ? "Your active membership base is looking strong."
                : "Your membership status needs some attention."}
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-pink-100">
              You currently have {stats.active} active members,
              {` `}
              {stats.suspended} suspended members and {stats.pending}
              pending bookings.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            {stats.active >= stats.suspended ? (
              <FaArrowUp className="text-2xl" />
            ) : (
              <FaArrowDown className="text-2xl" />
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

export default Reports;