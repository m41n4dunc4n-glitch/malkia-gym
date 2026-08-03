import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrainers } from "../../services/trainers";

function TrainersPreview() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadTrainers = async () => {
      setLoading(true);

      const { data, error } = await getTrainers();

      if (!isActive) {
        return;
      }

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      // Only show first 3 trainers on the home page
      setTrainers((data || []).slice(0, 3));
      setLoading(false);
    };

    loadTrainers();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="bg-black py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">

        <div className="mb-14 text-center">

          <p className="text-sm font-semibold uppercase tracking-[4px] text-pink-500 sm:text-base">
            OUR TRAINERS
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Meet Our Experts
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
            Passionate professionals committed to helping every woman achieve
            her fitness goals.
          </p>

        </div>

        {loading ? (
          <div className="py-20 text-center">
            <p className="text-lg">Loading trainers...</p>
          </div>
        ) : trainers.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-400">
              No trainers available.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">

            {trainers.map((trainer) => (

              <div
                key={trainer.id}
                className="overflow-hidden rounded-3xl bg-zinc-900 shadow-xl transition duration-300 hover:-translate-y-2"
              >

                <img
                  src={
                    trainer.image_url ||
                    "https://placehold.co/600x700?text=Trainer"
                  }
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

                  <p className="mt-4 text-gray-400">
                    {trainer.experience} Years Experience
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
        )}

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