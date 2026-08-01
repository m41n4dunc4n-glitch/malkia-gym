import { Link } from "react-router-dom";

function CallToAction() {
  return (
    <section className="bg-pink-600 py-16 sm:py-20 lg:py-24 text-white">

      <div className="mx-auto max-w-5xl px-6 sm:px-8 text-center">

        <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          Ready To Begin Your
          <br />
          Fitness Journey?
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-pink-100">
          Join hundreds of women building strength, confidence and healthier lives at Malkia Fitness.
        </p>

        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:justify-center">

          <Link
            to="/register"
            className="rounded-xl bg-white px-8 py-4 font-semibold text-pink-600 transition hover:bg-gray-100"
          >
            Join Today
          </Link>

          <Link
            to="/contact"
            className="rounded-xl border-2 border-white px-8 py-4 font-semibold transition hover:bg-white hover:text-pink-600"
          >
            Contact Us
          </Link>

        </div>

      </div>

    </section>
  );
}

export default CallToAction;