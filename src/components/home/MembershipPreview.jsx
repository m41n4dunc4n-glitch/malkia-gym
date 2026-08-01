import { Link } from "react-router-dom";

function MembershipPreview() {
  const plans = [
    {
      name: "Basic",
      price: "KSh 3,000",
      features: [
        "Gym Access",
        "Locker Access",
        "Basic Fitness Assessment",
        "Community Support",
      ],
      featured: false,
    },
    {
      name: "Premium",
      price: "KSh 5,000",
      features: [
        "Everything in Basic",
        "Personal Trainer",
        "Nutrition Guidance",
        "Unlimited Classes",
      ],
      featured: true,
    },
    {
      name: "VIP",
      price: "KSh 8,000",
      features: [
        "Everything in Premium",
        "Priority Booking",
        "Private Sessions",
        "VIP Lounge Access",
      ],
      featured: false,
    },
  ];

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

          {plans.map((plan, index) => (

            <div
              key={index}
              className={`flex h-full flex-col rounded-3xl p-8 shadow-xl transition duration-300 hover:-translate-y-2 ${
                plan.featured
                  ? "bg-pink-600 text-white xl:scale-105"
                  : "bg-black text-white"
              }`}
            >

              <h3 className="text-3xl font-bold">
                {plan.name}
              </h3>

              <p className="mt-5 text-4xl font-extrabold lg:text-5xl">
                {plan.price}
              </p>

              <span className="text-sm opacity-80">
                Per Month
              </span>

              <ul className="mt-8 grow space-y-4">

                {plan.features.map((feature, i) => (

                  <li
                    key={i}
                    className="flex items-start gap-3"
                  >
                    <span>✔</span>

                    <span>{feature}</span>

                  </li>

                ))}

              </ul>

              <Link
                to="/register"
                className={`mt-10 rounded-xl py-4 text-center font-semibold transition ${
                  plan.featured
                    ? "bg-white text-pink-600 hover:bg-gray-100"
                    : "bg-pink-600 text-white hover:bg-pink-700"
                }`}
              >
                Join Now
              </Link>

            </div>

          ))}

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