import { Link } from "react-router-dom";
import {
  FaDumbbell,
  FaBullseye,
  FaEye,
  FaHeart,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import PageHero from "../../components/common/PageHero";
import aboutImage from "../../assets/images/pages/about.jpg";

function About() {
  const values = [
    {
      icon: <FaBullseye size={35} />,
      title: "Our Mission",
      text: "To empower women through fitness by providing a safe, supportive and motivating environment where every member can achieve her goals.",
    },
    {
      icon: <FaEye size={35} />,
      title: "Our Vision",
      text: "To become Kenya's leading women-only fitness community known for transforming lives through health and wellness.",
    },
    {
      icon: <FaHeart size={35} />,
      title: "Our Values",
      text: "Respect, Discipline, Strength, Community and Confidence guide everything we do at Malkia Fitness.",
    },
  ];

  const stats = [
    { number: "500+", label: "Happy Members" },
    { number: "15+", label: "Professional Trainers" },
    { number: "30+", label: "Weekly Classes" },
    { number: "5★", label: "Customer Rating" },
  ];

  return (
    <>
      {/* Hero */}
      {/* Hero */}

<PageHero
  label="ABOUT MALKIA FITNESS"
  title={`More Than
          Just A Gym.`}
  subtitle="Malkia Fitness is a women-only fitness centre dedicated to helping every woman become stronger, healthier and more confident through professional coaching and a supportive community."
  image={aboutImage}
/>

      {/* Story */}

      {/* Story */}

<section className="bg-white py-16 sm:py-20 lg:py-24">

  <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-20">

    <div>

      <span className="font-semibold uppercase tracking-widest text-pink-500">

        OUR STORY

      </span>

      <h2 className="mt-5 text-3xl font-bold sm:text-4xl lg:text-5xl">

        Built By Women,

        <br />

        For Women.

      </h2>

      <p className="mt-8 leading-8 text-gray-600">

        We created Malkia Fitness because every woman deserves a place where she feels confident, respected and motivated.

      </p>

      <p className="mt-6 leading-8 text-gray-600">

        From beginners taking their first steps into fitness to athletes pushing their limits, we provide the guidance, facilities and encouragement needed for lasting transformation.

      </p>

    </div>

    <div className="flex flex-col justify-center rounded-3xl bg-black p-8 text-white sm:p-12">

      <FaDumbbell
        size={65}
        className="text-pink-500"
      />

      <h3 className="mt-8 text-3xl font-bold lg:text-4xl">

        Every Queen

        <br />

        Deserves Her Crown.

      </h3>

      <p className="mt-6 leading-8 text-gray-300">

        Fitness is not about perfection.
        It's about becoming the strongest version of yourself.

      </p>

    </div>

  </div>

</section>

      {/* Mission */}

      {/* Mission */}

<section className="bg-black py-16 sm:py-20 lg:py-24 text-white">

  <div className="mx-auto max-w-7xl px-6 sm:px-8">

    <div className="mb-16 text-center">

      <p className="font-semibold uppercase tracking-widest text-pink-500">

        WHAT WE BELIEVE

      </p>

      <h2 className="mt-5 text-3xl font-bold sm:text-4xl lg:text-5xl">

        Our Foundation

      </h2>

    </div>

    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

      {values.map((item, index) => (

        <div
          key={index}
          className="rounded-3xl bg-zinc-900 p-8 transition hover:-translate-y-2"
        >

          <div className="mb-6 text-pink-500">

            {item.icon}

          </div>

          <h3 className="text-2xl font-bold">

            {item.title}

          </h3>

          <p className="mt-5 leading-8 text-gray-400">

            {item.text}

          </p>

        </div>

      ))}

    </div>

  </div>

</section>

      {/* Stats */}

      {/* Stats */}

<section className="bg-white py-16 sm:py-20 lg:py-24">

  <div className="mx-auto max-w-7xl px-6 sm:px-8">

    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-10">

      {stats.map((stat, index) => (

        <div
          key={index}
          className="text-center"
        >

          <h2 className="text-4xl font-extrabold text-pink-600 sm:text-5xl lg:text-6xl">

            {stat.number}

          </h2>

          <p className="mt-4 text-base text-gray-700 sm:text-lg lg:text-xl">

            {stat.label}

          </p>

        </div>

      ))}

    </div>

  </div>

</section>

      {/* CTA */}

      {/* CTA */}

<section className="bg-pink-600 py-16 sm:py-20 lg:py-24 text-white">

  <div className="mx-auto max-w-5xl px-6 sm:px-8 text-center">

    <FaUsers
      size={50}
      className="mx-auto mb-8"
    />

    <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">

      Ready To Start

      <br />

      Your Fitness Journey?

    </h2>

    <p className="mx-auto mt-8 max-w-3xl text-lg">

      Join hundreds of women transforming their lives with Malkia Fitness.

    </p>

    <Link
      to="/register"
      className="mt-10 inline-flex items-center gap-3 rounded-xl bg-black px-8 py-4 font-semibold transition hover:bg-zinc-900"
    >

      Join Today

      <FaArrowRight />

    </Link>

  </div>

</section>

    </>
  );
}

export default About;