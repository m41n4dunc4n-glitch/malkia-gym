import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardCard from "../../components/dashboard/DashboardCard";
import QuickActions from "../../components/dashboard/QuickActions";

import { useAuth } from "../../hooks/useAuth";
import { getProfile } from "../../services/profile";

import {
  FaCreditCard,
  FaArrowRight,
  FaUser,
  FaCheckCircle,
  FaExclamationCircle,
  FaHistory,
  FaCommentDots,
} from "react-icons/fa";

function Member() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      const { data } = await getProfile(user.id);

      setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-pink-600 border-t-transparent" />

          <p className="mt-5 text-lg font-semibold text-gray-600">
            Loading your dashboard...
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Please wait a moment
          </p>
        </div>
      </div>
    );
  }

  let remainingDays = 0;
  let expiryDate = "-";

  if (
    profile?.membership_plans &&
    profile?.membership_started_at
  ) {
    const start = new Date(
      profile.membership_started_at
    );

    const expiry = new Date(start);

    expiry.setDate(
      expiry.getDate() +
        profile.membership_plans.duration
    );

    expiryDate = expiry.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    remainingDays = Math.max(
      0,
      Math.ceil(
        (expiry - new Date()) /
          (1000 * 60 * 60 * 24)
      )
    );
  }

  const hasMembership =
    !!profile?.membership_plans;

  const membershipActive =
    hasMembership && remainingDays > 0;

  const profileImage =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

  const firstName =
    profile?.full_name?.split(" ")[0] ||
    "Member";

  return (
    <div className="space-y-8">

      {/* =====================================
          WELCOME HERO
      ====================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-black p-6 text-white shadow-xl md:p-8 lg:p-10">

        {/* Background decoration */}

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          {/* User */}

          <div className="flex items-center gap-5">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-pink-500 bg-zinc-800 text-3xl font-bold">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt={profile?.full_name || "Member"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUser className="text-gray-400" />
              )}

            </div>

            <div>

              <p className="text-sm font-medium text-pink-400">
                MEMBER DASHBOARD
              </p>

              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                Welcome back, {firstName}! 👋
              </h1>

              <p className="mt-2 max-w-xl text-gray-400">
                Here's your fitness overview. Keep showing
                up and keep getting stronger.
              </p>

            </div>

          </div>

          {/* Membership status */}

          <div
            className={`w-fit rounded-2xl border px-5 py-4 ${
              membershipActive
                ? "border-green-500/30 bg-green-500/10"
                : "border-red-500/30 bg-red-500/10"
            }`}
          >

            <div className="flex items-center gap-3">

              {membershipActive ? (
                <FaCheckCircle className="text-green-400" />
              ) : (
                <FaExclamationCircle className="text-red-400" />
              )}

              <div>

                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Membership
                </p>

                <p
                  className={`font-bold ${
                    membershipActive
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {membershipActive
                    ? "Active"
                    : hasMembership
                    ? "Expired"
                    : "No Membership"}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          STAT CARDS
      ====================================== */}

      <section>

        <div className="mb-5">

          <h2 className="text-2xl font-bold text-gray-900">
            Your Membership
          </h2>

          <p className="mt-1 text-gray-500">
            A quick look at your current membership.
          </p>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <DashboardCard
            title="Membership"
            value={
              profile?.membership_plans?.name ||
              "No Membership"
            }
          />

          <DashboardCard
            title="Days Remaining"
            value={
              profile?.membership_plans
                ? `${remainingDays} Days`
                : "-"
            }
          />

          <DashboardCard
            title="Membership Status"
            value={
              profile?.membership_plans
                ? remainingDays > 0
                  ? "Active"
                  : "Expired"
                : "No Membership"
            }
          />

          <DashboardCard
            title="Next Expiry"
            value={expiryDate}
          />

        </div>

      </section>

      {/* =====================================
          MEMBERSHIP PROGRESS
      ====================================== */}

      {hasMembership && (
        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wide text-pink-600">
                Current Plan
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {profile.membership_plans.name}
              </h2>

            </div>

            <Link
              to="/member/membership"
              className="flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700"
            >
              View Membership
              <FaArrowRight />
            </Link>

          </div>

          <div className="mt-6">

            <div className="mb-2 flex justify-between text-sm">

              <span className="text-gray-500">
                Membership progress
              </span>

              <span className="font-semibold">
                {remainingDays} days left
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">

              <div
                className="h-full rounded-full bg-pink-600 transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      5,
                      profile.membership_plans
                        .duration
                        ? (remainingDays /
                            profile.membership_plans
                              .duration) *
                            100
                        : 0
                    )
                  )}%`,
                }}
              />

            </div>

            <div className="mt-3 flex justify-between text-xs text-gray-400">

              <span>
                Started{" "}
                {profile.membership_started_at
                  ? new Date(
                      profile.membership_started_at
                    ).toLocaleDateString("en-GB")
                  : "-"}
              </span>

              <span>
                Expires {expiryDate}
              </span>

            </div>

          </div>

        </section>
      )}

      {/* =====================================
          QUICK ACTIONS
      ====================================== */}

      <section>

        <div className="mb-5">

          <h2 className="text-2xl font-bold">
            Quick Actions
          </h2>

          <p className="mt-1 text-gray-500">
            Everything you need, right at your fingertips.
          </p>

        </div>

        <QuickActions />

      </section>

      {/* =====================================
          BOTTOM ACTIONS
      ====================================== */}

      <section className="grid gap-5 md:grid-cols-3">

        <Link
          to="/member/feedback"
          className="group rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >

          <div className="flex items-center justify-between">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
              <FaCommentDots className="text-xl" />
            </div>

            <FaArrowRight className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-pink-600" />

          </div>

          <h3 className="mt-5 text-xl font-bold">
            Feedback
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Feedback your experience with our trainers and services.
          </p>

        </Link>

        <Link
          to="/member/payments"
          className="group rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >

          <div className="flex items-center justify-between">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <FaCreditCard className="text-xl" />
            </div>

            <FaArrowRight className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-purple-600" />

          </div>

          <h3 className="mt-5 text-xl font-bold">
            Payments
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            View your membership payments and transactions.
          </p>

        </Link>

        <Link
          to="/member/history"
          className="group rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >

          <div className="flex items-center justify-between">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <FaHistory className="text-xl" />
            </div>

            <FaArrowRight className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />

          </div>

          <h3 className="mt-5 text-xl font-bold">
            Booking History
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            View your booking history and details.
          </p>

        </Link>

      </section>

    </div>
  );
}

export default Member;