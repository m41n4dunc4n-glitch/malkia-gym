import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  getMembershipPlans,
  chooseMembership,
} from "../../../services/membership";
import { getProfile } from "../../../services/profile";

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

              <p className="mt-6 min-h-22.5 leading-7 text-gray-700">
                {plan.description}
              </p>

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

    </div>
  );
}

export default Membership;