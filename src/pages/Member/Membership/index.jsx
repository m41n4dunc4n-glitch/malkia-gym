import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { FaCheck } from "react-icons/fa";
import {
  getMembershipPlans,
  chooseMembership,
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
      setCurrentMembership(profile?.membership_id || null);

      setLoading(false);
    }

    fetchMembershipData();
  }, [user]);

  async function handleChoose(planId) {
    const { error } = await chooseMembership(user.id, planId);

    if (error) {
      alert(error.message);
      return;
    }

    setCurrentMembership(planId);

    alert("Membership updated successfully!");
  }

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <h2 className="text-xl font-semibold md:text-2xl">
          Loading Membership Plans...
        </h2>
      </div>
    );
  }

  async function handleCancelMembership() {
  const confirmCancel = window.confirm(
    "Are you sure you want to cancel your membership?"
  );

  if (!confirmCancel) return;

  const { error } = await cancelMembership(user.id);

  if (error) {
    alert(error.message);
    return;
  }

  setCurrentMembership(null);
  window.location.reload();
  alert("Membership cancelled successfully.");
}

  return (
    <div>

      <div className="mb-10">

        <h1 className="text-3xl font-bold md:text-4xl">
          Membership Plans
        </h1>

        <p className="mt-2 text-gray-500">
          Select the plan that best suits your fitness goals.
        </p>

      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

        {plans.map((plan) => {

          const active = currentMembership === plan.id;
          const features = getFeatures(plan.description);

          return (

            <div
              key={plan.id}
              className={`rounded-3xl p-6 md:p-8 shadow-lg transition duration-300 ${
                active
                  ? "border-4 border-pink-600 bg-pink-50"
                  : "bg-white hover:-translate-y-2 hover:shadow-xl"
              }`}
            >

              <h2 className="text-2xl font-bold md:text-3xl">
                {plan.name}
              </h2>

              <p className="mt-5 wrap-break-word text-4xl font-extrabold text-pink-600 md:text-5xl">
                KSh {Number(plan.price).toLocaleString()}
              </p>

              <p className="mt-2 text-gray-500">
                {plan.duration} Days
              </p>

              <ul className="mt-10 space-y-4">

                    {features.map((feature, i) => (

                      <li
                        key={i}
                        className="flex items-start gap-3"
                      >

                        <FaCheck className="mt-1 shrink-0" />

                        <span>{feature}</span>

                      </li>

                    ))}

                  </ul>

              <button
                onClick={() => handleChoose(plan.id)}
                disabled={active}
                className={`mt-8 w-full rounded-xl py-4 font-semibold transition ${
                  active
                    ? "cursor-not-allowed bg-green-600 text-white"
                    : "bg-pink-600 text-white hover:bg-pink-700"
                }`}
              >
                {active ? "Current Plan ✓" : "Choose Plan"}
              </button>

            </div>

          );

        })}

      </div>

        {currentMembership && (
  <div className="mt-10 flex justify-center">

    <button
      onClick={handleCancelMembership}
      className="rounded-xl bg-red-600 px-8 py-4 font-semibold text-white transition hover:bg-red-700"
    >
      Cancel Membership
    </button>

  </div>
)}

    </div>
  );
}

export default Membership;