import { Link } from "react-router-dom";
import { FaCheck, FaDumbbell, FaArrowRight } from "react-icons/fa";

function Membership() {
  const plans = [
    {
      name: "Basic",
      price: "KSh 3,000",
      featured: false,
      features: [
        "Unlimited Gym Access",
        "Locker Access",
        "Fitness Assessment",
        "Community Support",
        "Changing Rooms",
      ],
    },
    {
      name: "Premium",
      price: "KSh 5,000",
      featured: true,
      features: [
        "Everything in Basic",
        "Personal Trainer",
        "Nutrition Guidance",
        "Unlimited Group Classes",
        "Monthly Progress Review",
      ],
    },
    {
      name: "VIP",
      price: "KSh 8,000",
      featured: false,
      features: [
        "Everything in Premium",
        "Priority Trainer Booking",
        "Private Training Sessions",
        "VIP Lounge Access",
        "Personal Fitness Plan",
      ],
    },
  ];

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
     {/* Hero */}

<section className="mt-20 bg-black text-white">

  <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:py-28 text-center">

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

      {/* Pricing */}

<section className="bg-white py-16 sm:py-20 lg:py-24">

  <div className="mx-auto max-w-7xl px-6 sm:px-8">

    <div className="grid gap-8 lg:grid-cols-3">

      {plans.map((plan, index) => (

        <div
          key={index}
          className={`rounded-3xl p-8 shadow-xl transition duration-300 hover:-translate-y-2 ${
            plan.featured
              ? "bg-pink-600 text-white lg:scale-105"
              : "bg-black text-white"
          }`}
        >

          {plan.featured && (

            <span className="mb-6 inline-block rounded-full bg-white px-4 py-2 font-semibold text-pink-600">

              MOST POPULAR

            </span>

          )}

          <h2 className="text-3xl font-bold lg:text-4xl">

            {plan.name}

          </h2>

          <p className="mt-6 text-4xl font-extrabold lg:text-5xl">

            {plan.price}

            <span className="text-lg font-normal">
              {" "}
              / month
            </span>

          </p>

          <ul className="mt-10 space-y-4">

            {plan.features.map((feature, i) => (

              <li
                key={i}
                className="flex items-start gap-3"
              >

                <FaCheck className="mt-1 shrink-0" />

                <span>{feature}</span>

              </li>

            ))}

          </ul>

          <Link
            to="/register"
            className={`mt-10 block rounded-xl py-4 text-center font-semibold transition ${
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

  </div>

</section>

      {/* Benefits */}

      {/* Benefits */}

<section className="bg-black py-16 sm:py-20 lg:py-24 text-white">

  <div className="max-w-7xl mx-auto px-6 sm:px-8">

    <div className="text-center mb-14">

      <p className="uppercase tracking-widest text-pink-500 font-semibold">
        WHY JOIN US
      </p>

      <h2 className="mt-4 text-4xl sm:text-5xl font-bold">
        Membership Benefits
      </h2>

    </div>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

      {benefits.map((benefit, index) => (

        <div
          key={index}
          className="rounded-2xl bg-zinc-900 p-6 flex items-center gap-4 hover:-translate-y-1 transition"
        >

          <FaDumbbell
            className="text-pink-500 shrink-0"
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

      {/* FAQ */}

<section className="bg-white py-16 sm:py-20 lg:py-24">

  <div className="max-w-5xl mx-auto px-6 sm:px-8">

    <div className="text-center mb-14">

      <p className="uppercase tracking-widest text-pink-500 font-semibold">
        FAQ
      </p>

      <h2 className="mt-4 text-4xl sm:text-5xl font-bold">
        Frequently Asked Questions
      </h2>

    </div>

    <div className="space-y-6">

      {faqs.map((faq, index) => (

        <div
          key={index}
          className="rounded-2xl border border-gray-200 p-6 sm:p-8"
        >

          <h3 className="text-xl sm:text-2xl font-bold">

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

      {/* CTA */}

<section className="bg-pink-600 py-16 sm:py-20 lg:py-24 text-white">

  <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">

    <h2 className="text-4xl sm:text-5xl font-bold">

      Become Part Of

      <br />

      Malkia Fitness

    </h2>

    <p className="mt-6 text-lg sm:text-xl">

      Invest in your health today and start your transformation.

    </p>

    <Link
      to="/register"
      className="inline-flex items-center gap-3 mt-10 rounded-xl bg-black px-8 py-4 font-semibold transition hover:bg-zinc-900"
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