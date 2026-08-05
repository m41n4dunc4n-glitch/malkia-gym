import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaDumbbell,
  FaArrowRight,
} from "react-icons/fa";

import { getTrainers } from "../../services/trainers";
import PageHero from "../../components/common/PageHero";
import trainersImage from "../../assets/images/pages/trainers.jpg";

function Trainers() {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadTrainers() {
      const { data } = await getTrainers();

      if (mounted) {
        setTrainers(data || []);
      }
    }

    loadTrainers();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>

      {/* Hero */}

      <PageHero
  label="OUR TRAINERS"
  title={`Meet The Experts`}
  subtitle="Our certified trainers are committed to helping every member achieve her fitness goals safely, confidently and effectively."
  image={trainersImage}
/>
      {/* Intro */}

      <section className="bg-white py-16 sm:py-20">

        <div className="mx-auto max-w-6xl px-6 text-center sm:px-8">

          <h2 className="text-4xl font-bold sm:text-5xl">
            Professional Guidance
          </h2>

          <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-gray-600 sm:text-lg">

            Every trainer at Malkia Fitness brings experience,
            passion and dedication to ensure every workout moves
            you closer to your goals.

            Whether you're beginning your fitness journey or looking
            to reach the next level, we're here to support you.

          </p>

        </div>

      </section>

      {/* Trainers */}

      <section className="bg-gray-100 py-16 sm:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-6 sm:px-8">

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {trainers.map((trainer) => (

              <div
                key={trainer.id}
                className="overflow-hidden rounded-3xl bg-white shadow-xl transition duration-300 hover:-translate-y-2"
              >

                <img
                  src={
                    trainer.image_url ||
                    "https://placehold.co/600x700?text=Trainer"
                  }
                  alt={trainer.name}
                  className="h-80 w-full object-cover lg:h-96"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/600x700?text=Trainer";
                  }}
                />

                <div className="p-8">

                  <div className="mb-4 flex items-center gap-3 text-pink-600">

                    <FaDumbbell />

                    <span className="font-semibold">

                      {trainer.specialty || "Fitness Trainer"}

                    </span>

                  </div>

                  <h3 className="text-3xl font-bold">

                    {trainer.name}

                  </h3>

                  <p className="mt-2 font-semibold text-pink-600">

                    {(trainer.experience || 0)} Years Experience

                  </p>

                  <p className="mt-6 leading-7 text-gray-600">

                    {trainer.bio}

                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

            {/* Why Personal Training */}

      <section className="bg-black py-16 text-white sm:py-20 lg:py-24">

        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-20">

          <div>

            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
              Why Train
              <br />
              With Us?
            </h2>

            <p className="mt-6 text-base leading-8 text-gray-300 sm:text-lg">

              Personal training provides accountability,
              motivation and structured workout plans designed
              around your individual fitness goals.

            </p>

            <ul className="mt-8 space-y-4 text-base sm:text-lg">

              <li>✔ Customized Workout Programs</li>

              <li>✔ Nutrition Advice</li>

              <li>✔ Injury Prevention</li>

              <li>✔ Faster Results</li>

              <li>✔ Continuous Progress Tracking</li>

            </ul>

          </div>

          <div className="flex flex-col justify-center rounded-3xl bg-zinc-900 p-8 sm:p-10 lg:p-12">

            <h3 className="text-3xl font-bold sm:text-4xl">

              One-On-One Coaching

            </h3>

            <p className="mt-6 text-base leading-8 text-gray-400 sm:text-lg">

              Train with certified professionals who understand
              your strengths, challenges and personal fitness
              ambitions.

            </p>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="bg-pink-600 py-16 text-white sm:py-20 lg:py-24">

        <div className="mx-auto max-w-5xl px-6 text-center sm:px-8">

          <h2 className="text-4xl font-bold leading-tight sm:text-5xl">

            Ready To Train

            <br />

            With The Best?

          </h2>

          <p className="mt-6 text-lg sm:text-xl">

            Register today and start your fitness journey
            with our experienced trainers.

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

export default Trainers;