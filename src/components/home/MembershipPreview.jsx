import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlans } from "../../services/membershipPlans";

function MembershipPreview() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadPlans() {
      const { data } = await getPlans();

      if (isMounted) {
        setPlans(data || []);
      }
    }

    loadPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  function getFeatures(description) {
    if (!description) return [];

    return description
      .split(/[\n•,]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">

      <div className="mx-auto max-w-7xl px-6 sm:px-8">

        <div className="mb-14 text-center">

          <p className="text-sm font-semibold uppercase tracking-[4px] text-pink-500 sm:text-base">
            MEMBERSHIP PLANS
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Choose Your Fitness Journey
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
            Flexible membership packages designed to suit every fitness goal and budget.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {plans.slice(0, 3).map((plan, index) => {

            const features = getFeatures(plan.description);

            return (

              <div
                key={plan.id}
                className={`flex flex-col rounded-3xl p-8 shadow-xl transition duration-300 hover:-translate-y-2 ${
                  index === Math.min(1, plans.length - 1)
                    ? "bg-pink-600 text-white xl:scale-105"
                    : "bg-black text-white"
                }`}
              >

                <h3 className="text-3xl font-bold">
                  {plan.name}
                </h3>

                <p className="mt-5 text-4xl font-extrabold lg:text-5xl">
                  KSh {Number(plan.price).toLocaleString()}
                </p>

                <span className="text-sm opacity-80">
                  {plan.duration} Days
                </span>

                <ul className="mt-8 grow space-y-3">

                  {features.map((feature, i) => (

                    <li
                      key={i}
                      className="flex items-start gap-3"
                    >

                      <span className="mt-1">
                        ✔
                      </span>

                      <span>
                        {feature}
                      </span>

                    </li>

                  ))}

                </ul>

                <Link
                  to="/membership"
                  className={`mt-10 rounded-xl py-4 text-center font-semibold transition ${
                    index === Math.min(1, plans.length - 1)
                      ? "bg-white text-pink-600 hover:bg-gray-100"
                      : "bg-pink-600 text-white hover:bg-pink-700"
                  }`}
                >
                  View Plan
                </Link>

              </div>

            );
          })}

        </div>

        <div className="mt-14 text-center">

          <Link
            to="/membership"
            className="inline-block rounded-xl border-2 border-pink-600 px-8 py-4 font-semibold text-pink-600 transition hover:bg-pink-600 hover:text-white"
          >
            View All Membership Plans
          </Link>

        </div>

      </div>

    </section>
  );
}

export default MembershipPreview;