import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import {
  FaCheck,
  FaCrown,
  FaCalendarAlt,
  FaArrowRight,
  FaTimesCircle,
  FaStar,
} from "react-icons/fa";

import {
  getMembershipPlans,
  cancelMembership,
} from "../../../services/membership";

import { getProfile } from "../../../services/profile";

function getFeatures(description) {
  if (!description) return [];

  return description
    .split(/[\n•,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function Membership() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [currentMembership, setCurrentMembership] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembershipData() {
      if (!user) return;

      setLoading(true);

      const { data: plansData } =
        await getMembershipPlans();

      const { data: profile } =
        await getProfile(user.id);

      setPlans(plansData || []);
      setCurrentMembership(
        profile?.membership_id || null
      );

      setLoading(false);
    }

    fetchMembershipData();
  }, [user]);

  async function handleChoose(planId) {
  navigate(`/member/payments?plan=${planId}`);
}

  async function handleCancelMembership() {
    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel your membership?"
      );

    if (!confirmCancel) return;

    const { error } =
      await cancelMembership(user.id);

    if (error) {
      alert(error.message);
      return;
    }

    setCurrentMembership(null);

    alert(
      "Membership cancelled successfully."
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">

            <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-600 border-t-transparent" />

          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-800">
            Loading Membership Plans
          </h2>

          <p className="mt-2 text-gray-500">
            Finding the perfect plan for you...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-black px-6 py-10 text-white shadow-xl md:px-10">

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-600 shadow-lg shadow-pink-600/30">

              <FaCrown className="text-xl" />

            </div>

            <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm font-semibold text-pink-400">
              Malkia Membership
            </span>

          </div>

          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            Choose Your
            <span className="text-pink-500">
              {" "}Perfect Plan
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
            Invest in yourself and choose a membership
            designed to help you reach your fitness goals.
          </p>

        </div>

      </div>

      {/* =====================================
          CURRENT MEMBERSHIP
      ====================================== */}

      {currentMembership && (

        <div className="overflow-hidden rounded-3xl border border-green-200 bg-linear-to-r from-green-50 to-emerald-50 shadow-sm">

          <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-7">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/20">

                <FaCheck />

              </div>

              <div>

                <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
                  Active Membership
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  You're currently subscribed
                </h2>

              </div>

            </div>

            <button
              onClick={handleCancelMembership}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
            >
              <FaTimesCircle />

              Cancel Membership
            </button>

          </div>

        </div>

      )}

      {/* =====================================
          PLANS
      ====================================== */}

      <div>

        <div className="mb-7">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-600">
            Membership Options
          </p>

          <h2 className="mt-2 text-2xl font-black text-gray-900 md:text-3xl">
            Find the plan that fits you
          </h2>

          <p className="mt-2 text-gray-500">
            Simple pricing. Powerful results.
          </p>

        </div>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">

          {plans.map((plan, index) => {

            const active =
              currentMembership === plan.id;

            const features =
              getFeatures(
                plan.description
              );

            const featured =
              index === 1 &&
              plans.length >= 3;

            return (

              <div
                key={plan.id}
                className={`relative flex flex-col overflow-hidden rounded-3xl border bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  active
                    ? "border-pink-500 ring-2 ring-pink-500/20"
                    : "border-gray-100"
                }`}
              >

                {/* Featured badge */}

                {featured && !active && (

                  <div className="absolute right-5 top-5 z-10">

                    <span className="flex items-center gap-2 rounded-full bg-pink-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-pink-600/20">

                      <FaStar />

                      POPULAR

                    </span>

                  </div>

                )}

                {/* Current badge */}

                {active && (

                  <div className="absolute right-5 top-5 z-10">

                    <span className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-green-600/20">

                      <FaCheck />

                      CURRENT

                    </span>

                  </div>

                )}

                {/* Top section */}

                <div
                  className={`p-7 md:p-8 ${
                    active
                      ? "bg-linear-to-br from-pink-50 to-white"
                      : featured
                      ? "bg-linear-to-br from-gray-50 to-white"
                      : ""
                  }`}
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-pink-500 shadow-lg">

                    <FaCrown />

                  </div>

                  <h2 className="mt-6 text-2xl font-black text-gray-900 md:text-3xl">
                    {plan.name}
                  </h2>

                  <p className="mt-5 flex items-end gap-2">

                    <span className="text-4xl font-black tracking-tight text-pink-600 md:text-5xl">
                      KSh{" "}
                      {Number(
                        plan.price
                      ).toLocaleString()}
                    </span>

                  </p>

                  <div className="mt-3 flex items-center gap-2 text-gray-500">

                    <FaCalendarAlt className="text-pink-500" />

                    <span>
                      {plan.duration} days
                    </span>

                  </div>

                </div>

                {/* Divider */}

                <div className="mx-7 border-t border-gray-100 md:mx-8" />

                {/* Features */}

                <div className="flex flex-1 flex-col p-7 md:p-8">

                  <p className="mb-5 text-sm font-bold uppercase tracking-wider text-gray-400">
                    What's included
                  </p>

                  <ul className="flex-1 space-y-4">

                    {features.length > 0 ? (

                      features.map(
                        (feature, i) => (

                          <li
                            key={i}
                            className="flex items-start gap-3 text-gray-700"
                          >

                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs text-pink-600">

                              <FaCheck />

                            </span>

                            <span className="leading-6">
                              {feature}
                            </span>

                          </li>

                        )
                      )

                    ) : (

                      <li className="text-gray-500">
                        Standard gym access
                      </li>

                    )}

                  </ul>

                  {/* Button */}

                  <button
                    onClick={() =>
                      handleChoose(
                        plan.id
                      )
                    }
                    disabled={active}
                    className={`mt-8 flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-bold transition ${
                      active
                        ? "cursor-not-allowed bg-green-600 text-white"
                        : "bg-black text-white hover:bg-pink-600"
                    }`}
                  >

                    {active ? (
                      <>
                        <FaCheck />

                        Current Plan
                      </>
                    ) : (
                      <>
                        Choose Plan

                        <FaArrowRight />
                      </>
                    )}

                  </button>

                </div>

              </div>

            );
          })}

        </div>

      </div>

      {/* =====================================
          BOTTOM NOTE
      ====================================== */}

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-7">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">

            <FaStar />

          </div>

          <div>

            <h3 className="font-bold text-gray-900">
              Ready to level up?
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Choose a membership that matches your goals
              and start making progress at Malkia Fitness.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Membership;