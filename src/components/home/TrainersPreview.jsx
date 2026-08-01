import { Link } from "react-router-dom";

function TrainersPreview() {
  const trainers = [
    {
      name: "Sarah Wanjiku",
      specialty: "Strength Coach",
      image:
        "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=500",
    },
    {
      name: "Mercy Achieng",
      specialty: "Weight Loss Specialist",
      image:
        "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=500",
    },
    {
      name: "Grace Njeri",
      specialty: "Yoga & Wellness",
      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500",
    },
  ];

  return (
    <section className="bg-black py-16 sm:py-20 lg:py-24 text-white">

      <div className="mx-auto max-w-7xl px-6 sm:px-8">

        <div className="mb-14 text-center">

          <p className="text-sm font-semibold uppercase tracking-[4px] text-pink-500 sm:text-base">
            OUR TRAINERS
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Meet Our Experts
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
            Passionate professionals committed to helping every woman achieve her fitness goals.
          </p>

        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">

          {trainers.map((trainer, index) => (

            <div
              key={index}
              className="overflow-hidden rounded-3xl bg-zinc-900 shadow-xl transition duration-300 hover:-translate-y-2"
            >

              <img
                src={trainer.image}
                alt={trainer.name}
                className="h-72 w-full object-cover sm:h-80 lg:h-96"
              />

              <div className="p-8">

                <h3 className="text-2xl font-bold">
                  {trainer.name}
                </h3>

                <p className="mt-3 text-pink-500">
                  {trainer.specialty}
                </p>

                <Link
                  to="/trainers"
                  className="mt-8 inline-block rounded-xl bg-pink-600 px-6 py-3 font-semibold transition hover:bg-pink-700"
                >
                  View Profile
                </Link>

              </div>

            </div>

          ))}

        </div>

        <div className="mt-14 text-center">

          <Link
            to="/trainers"
            className="inline-block rounded-xl border-2 border-pink-600 px-8 py-4 font-semibold transition hover:bg-pink-600"
          >
            Meet All Trainers
          </Link>

        </div>

      </div>

    </section>
  );
}

export default TrainersPreview;