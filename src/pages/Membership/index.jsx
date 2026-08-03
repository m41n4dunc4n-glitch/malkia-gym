import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheck, FaDumbbell, FaArrowRight } from "react-icons/fa";
import { getPlans } from "../../services/membershipPlans";

function Membership() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadPlans() {
      const { data } = await getPlans();

      if (mounted) {
        setPlans(data || []);
      }
    }

    loadPlans();

    return () => {
      mounted = false;
    };
  }, []);

  function getFeatures(description) {
    if (!description) return [];

    return description
      .split(/[\n•,]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  const benefits = [
    "Women-only environment",
    "Certified professional trainers",
    "Modern gym equipment",
    "Flexible membership options",
    "Safe and welcoming atmosphere",
    "Personalized fitness programs",
  ];

  const faqs = [
    {
      question: "Can I cancel my membership?",
      answer:
        "Yes. Memberships can be cancelled according to our membership policy.",
    },
    {
      question: "Do I need gym experience?",
      answer:
        "No. Our trainers work with beginners and experienced members alike.",
    },
    {
      question: "Do memberships include classes?",
      answer:
        "Premium and VIP memberships include unlimited fitness classes.",
    },
  ];

  return (
    <>
      {/* Hero */}

      <section className="mt-20 bg-black text-white">

        <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:px-8 sm:py-20 lg:py-28">

          <p className="text-sm font-semibold uppercase tracking-[4px] text-pink-500 sm:text-base lg:tracking-[6px]">
            MEMBERSHIP
          </p>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Choose Your
            <br />
            Membership Plan
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg text-gray-300 lg:text-xl">
            Flexible plans designed for every stage of your fitness journey.
          </p>

        </div>

      </section>

      {/* Pricing */}

      <section className="bg-white py-16 sm:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-6 sm:px-8">

          <div className="grid gap-8 lg:grid-cols-3">

            {plans.map((plan, index) => {

              const features = getFeatures(plan.description);

              return (

                <div
                  key={plan.id}
                  className={`rounded-3xl p-8 shadow-xl transition duration-300 hover:-translate-y-2 ${
                    index === 1
                      ? "bg-pink-600 text-white lg:scale-105"
                      : "bg-black text-white"
                  }`}
                >

                  {index === 1 && (
                    <span className="mb-6 inline-block rounded-full bg-white px-4 py-2 font-semibold text-pink-600">
                      MOST POPULAR
                    </span>
                  )}

                  <h2 className="text-3xl font-bold lg:text-4xl">
                    {plan.name}
                  </h2>

                  <p className="mt-6 text-4xl font-extrabold lg:text-5xl">
                    KSh {Number(plan.price).toLocaleString()}
                  </p>

                  <span className="mt-2 block text-lg opacity-80">
                    {plan.duration} Days
                  </span>

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

                </div>

              );

            })}

          </div>

        </div>

      </section>
            {/* Benefits */}

      <section className="bg-black py-16 text-white sm:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-6 sm:px-8">

          <div className="mb-14 text-center">

            <p className="font-semibold uppercase tracking-widest text-pink-500">
              WHY JOIN US
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              Membership Benefits
            </h2>

          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {benefits.map((benefit, index) => (

              <div
                key={index}
                className="flex items-center gap-4 rounded-2xl bg-zinc-900 p-6 transition hover:-translate-y-1"
              >

                <FaDumbbell
                  className="shrink-0 text-pink-500"
                  size={26}
                />

                <span className="text-base sm:text-lg">
                  {benefit}
                </span>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FAQ */}

      <section className="bg-white py-16 sm:py-20 lg:py-24">

        <div className="mx-auto max-w-5xl px-6 sm:px-8">

          <div className="mb-14 text-center">

            <p className="font-semibold uppercase tracking-widest text-pink-500">
              FAQ
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              Frequently Asked Questions
            </h2>

          </div>

          <div className="space-y-6">

            {faqs.map((faq, index) => (

              <div
                key={index}
                className="rounded-2xl border border-gray-200 p-6 sm:p-8"
              >

                <h3 className="text-xl font-bold sm:text-2xl">
                  {faq.question}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {faq.answer}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="bg-pink-600 py-16 text-white sm:py-20 lg:py-24">

        <div className="mx-auto max-w-5xl px-6 text-center sm:px-8">

          <h2 className="text-4xl font-bold sm:text-5xl">
            Become Part Of
            <br />
            Malkia Fitness
          </h2>

          <p className="mt-6 text-lg sm:text-xl">
            Invest in your health today and start your transformation.
          </p>

          <Link
            to="/register"
            className="mt-10 inline-flex items-center gap-3 rounded-xl bg-black px-8 py-4 font-semibold transition hover:bg-zinc-900"
          >
            Register Today
            <FaArrowRight />
          </Link>

        </div>

      </section>

    </>
  );
}

export default Membership;