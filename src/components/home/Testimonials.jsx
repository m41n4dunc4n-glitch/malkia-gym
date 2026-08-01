import { Link } from "react-router-dom";

function Testimonials() {
  const testimonials = [
    {
      name: "Faith M.",
      message:
        "Joining Malkia has completely transformed my confidence and fitness. The trainers are supportive and the environment is amazing.",
    },
    {
      name: "Sharon K.",
      message:
        "I've never felt stronger. Every workout pushes me to become a better version of myself.",
    },
    {
      name: "Anne W.",
      message:
        "Clean facilities, friendly staff and professional coaching. Highly recommend Malkia Fitness.",
    },
  ];

  return (
    <section className="bg-black py-16 sm:py-20 lg:py-24 text-white">

      <div className="mx-auto max-w-7xl px-6 sm:px-8">

        <div className="mx-auto mb-14 max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[4px] text-pink-500 sm:text-base">
            TESTIMONIALS
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            What Our Members Say
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
            Real stories from women who have transformed their lives at
            Malkia Fitness.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {testimonials.map((testimonial, index) => (

            <div
              key={index}
              className="flex h-full flex-col rounded-3xl bg-zinc-900 p-8 transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-600/10"
            >

              <div className="mb-6 text-3xl text-yellow-400">
                ★★★★★
              </div>

              <p className="grow italic leading-8 text-gray-300">
                "{testimonial.message}"
              </p>

              <h3 className="mt-8 text-xl font-bold text-pink-500">
                {testimonial.name}
              </h3>

            </div>

          ))}

        </div>

        <div className="mt-14 text-center">

          <Link
            to="/register"
            className="inline-block rounded-xl bg-pink-600 px-8 py-4 font-semibold text-white transition hover:bg-pink-700"
          >
            Join Our Community
          </Link>

        </div>

      </div>

    </section>
  );
}

export default Testimonials;