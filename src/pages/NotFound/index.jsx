import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="mt-20 min-h-[calc(100vh-80px)] bg-black flex items-center justify-center px-6 sm:px-8 py-16">

      <div className="max-w-2xl text-center">

        <h1 className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-pink-600">
          404
        </h1>

        <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Oops! Page Not Found
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg leading-8 text-gray-400">
          The page you're looking for doesn't exist, may have been moved,
          or the link you followed is incorrect.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

          <Link
            to="/"
            className="rounded-xl bg-pink-600 px-8 py-4 font-semibold text-white transition hover:bg-pink-700"
          >
            Back Home
          </Link>

          <Link
            to="/contact"
            className="rounded-xl border border-pink-600 px-8 py-4 font-semibold text-pink-500 transition hover:bg-pink-600 hover:text-white"
          >
            Contact Us
          </Link>

        </div>

      </div>

    </section>
  );
}

export default NotFound;