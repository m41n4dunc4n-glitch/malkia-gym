import { Link } from "react-router-dom";
import {
  FaDumbbell,
  FaHeartbeat,
  FaRunning,
  FaAppleAlt,
  FaArrowRight,
} from "react-icons/fa";

function Trainers() {
  const trainers = [
    {
      name: "Sarah Wanjiku",
      specialty: "Strength & Conditioning",
      experience: "8 Years Experience",
      image:
        "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600",
      icon: <FaDumbbell size={24} />,
      bio: "Helping women build strength, confidence and healthy habits through personalized strength training.",
    },
    {
      name: "Mercy Achieng",
      specialty: "Weight Loss Coach",
      experience: "6 Years Experience",
      image:
        "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=600",
      icon: <FaRunning size={24} />,
      bio: "Specializes in sustainable weight loss, HIIT programs and body transformation coaching.",
    },
    {
      name: "Grace Njeri",
      specialty: "Yoga & Wellness",
      experience: "7 Years Experience",
      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600",
      icon: <FaHeartbeat size={24} />,
      bio: "Passionate about flexibility, mobility, mindfulness and holistic wellness.",
    },
    {
      name: "Faith Mutiso",
      specialty: "Nutrition Coach",
      experience: "5 Years Experience",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600",
      icon: <FaAppleAlt size={24} />,
      bio: "Designs nutrition plans that complement every fitness goal and lifestyle.",
    },
  ];

  return (
    <>
      {/* Hero */}

      {/* Hero */}

<section className="mt-20 bg-black text-white">

  <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-24 lg:py-28 text-center">

    <p className="uppercase tracking-[4px] sm:tracking-[6px] text-pink-500 font-semibold">
      OUR TRAINERS
    </p>

    <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
      Meet The Experts
    </h1>

    <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-gray-300 leading-8">
      Our certified trainers are committed to helping every member achieve her
      fitness goals safely, confidently and effectively.
    </p>

  </div>

</section>

      {/* Intro */}

      {/* Intro */}

<section className="bg-white py-16 sm:py-20">

  <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center">

    <h2 className="text-4xl sm:text-5xl font-bold">
      Professional Guidance
    </h2>

    <p className="mt-6 text-base sm:text-lg text-gray-600 leading-8 max-w-4xl mx-auto">

      Every trainer at Malkia Fitness brings experience, passion and
      dedication to ensure every workout moves you closer to your goals.

      Whether you're beginning your fitness journey or looking to reach
      the next level, we're here to support you.

    </p>

  </div>

</section>

      {/* Trainers Grid */}

     {/* Trainers Grid */}

<section className="bg-gray-100 py-16 sm:py-20 lg:py-24">

  <div className="max-w-7xl mx-auto px-6 sm:px-8">

    <div className="grid gap-8 md:grid-cols-2">

      {trainers.map((trainer, index) => (

        <div
          key={index}
          className="bg-white rounded-3xl overflow-hidden shadow-xl hover:-translate-y-2 transition duration-300"
        >

          <img
            src={trainer.image}
            alt={trainer.name}
            className="w-full h-72 sm:h-80 lg:h-96 object-cover"
          />

          <div className="p-6 sm:p-8">

            <div className="flex items-center gap-3 text-pink-600 mb-4">

              {trainer.icon}

              <span className="font-semibold text-sm sm:text-base">

                {trainer.specialty}

              </span>

            </div>

            <h3 className="text-2xl sm:text-3xl font-bold">

              {trainer.name}

            </h3>

            <p className="mt-2 font-semibold text-pink-600">

              {trainer.experience}

            </p>

            <p className="mt-5 text-gray-600 leading-7">

              {trainer.bio}

            </p>

          </div>

        </div>

      ))}

    </div>

  </div>

</section>
      {/* Why Personal Training */}

      {/* Why Personal Training */}

<section className="bg-black py-16 sm:py-20 lg:py-24 text-white">

  <div className="max-w-7xl mx-auto px-6 sm:px-8 grid gap-12 lg:grid-cols-2 lg:gap-20">

    <div>

      <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
        Why Train
        <br />
        With Us?
      </h2>

      <p className="mt-6 text-gray-300 leading-8 text-base sm:text-lg">
        Personal training provides accountability, motivation and structured
        workout plans designed around your individual fitness goals.
      </p>

      <ul className="mt-8 space-y-4 text-base sm:text-lg">

        <li>✔ Customized Workout Programs</li>

        <li>✔ Nutrition Advice</li>

        <li>✔ Injury Prevention</li>

        <li>✔ Faster Results</li>

        <li>✔ Continuous Progress Tracking</li>

      </ul>

    </div>

    <div className="bg-zinc-900 rounded-3xl p-8 sm:p-10 lg:p-12 flex flex-col justify-center">

      <h3 className="text-3xl sm:text-4xl font-bold">
        One-On-One Coaching
      </h3>

      <p className="mt-6 text-gray-400 leading-8 text-base sm:text-lg">
        Train with certified professionals who understand your strengths,
        challenges and personal fitness ambitions.
      </p>

    </div>

  </div>

</section>

      {/* CTA */}

      {/* CTA */}

<section className="bg-pink-600 py-16 sm:py-20 lg:py-24 text-white">

  <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">

    <h2 className="text-4xl sm:text-5xl font-bold leading-tight">

      Ready To Train

      <br />

      With The Best?

    </h2>

    <p className="mt-6 text-lg sm:text-xl">

      Register today and start your fitness journey with our experienced trainers.

    </p>

    <Link
      to="/register"
      className="inline-flex items-center gap-3 mt-10 bg-black px-8 py-4 rounded-xl font-semibold hover:bg-zinc-900 transition"
    >

      Join Today

      <FaArrowRight />

    </Link>

  </div>

</section>
    </>
  );
}

export default Trainers;