import {
  FaDumbbell,
  FaUsers,
  FaHeartbeat,
  FaShieldAlt,
} from "react-icons/fa";

function WhyChoose() {
  const features = [
    {
      icon: <FaDumbbell size={40} />,
      title: "Modern Equipment",
      description:
        "Train using high-quality machines and free weights designed for every fitness level.",
    },
    {
      icon: <FaUsers size={40} />,
      title: "Expert Trainers",
      description:
        "Certified female trainers dedicated to helping you reach your goals safely.",
    },
    {
      icon: <FaHeartbeat size={40} />,
      title: "Healthy Lifestyle",
      description:
        "Fitness, nutrition and wellness guidance that supports lasting transformation.",
    },
    {
      icon: <FaShieldAlt size={40} />,
      title: "Women Only",
      description:
        "A private, comfortable and motivating environment where every woman belongs.",
    },
  ];

  return (
    <section className="bg-black py-16 sm:py-20 lg:py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">

        <div className="mx-auto mb-14 max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[4px] text-pink-500 sm:text-base">
            WHY MALKIA FITNESS
          </p>

          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Built For Women.
            <br />
            Designed For Results.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
            We provide a supportive environment, expert coaching and modern
            facilities that help every member become stronger, healthier and
            more confident.
          </p>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          {features.map((feature, index) => (

            <div
              key={index}
              className="flex h-full flex-col rounded-3xl border border-zinc-800 bg-zinc-900 p-8 transition duration-300 hover:-translate-y-2 hover:border-pink-500 hover:shadow-xl hover:shadow-pink-600/10"
            >

              <div className="mb-6 text-pink-500">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-5 grow leading-8 text-gray-400">
                {feature.description}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default WhyChoose;