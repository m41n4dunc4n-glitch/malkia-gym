import { Link } from "react-router-dom";
import heroVideo from "../../assets/videos/hero/video.mp4";

function Hero() {
  return (
    <section className="relative mt-20 min-h-[calc(100vh-80px)] overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65"></div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="max-w-3xl">

            <p className="mb-4 text-sm font-semibold uppercase tracking-[4px] text-pink-500 sm:text-base">
              Welcome to Malkia Fitness
            </p>

            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Train Like
              <br />
              A Queen.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-300 sm:text-lg md:text-xl">
              Strong. Confident. Unstoppable.
              Join Kenya's premier women-only gym and transform your body,
              mindset and confidence in a supportive environment.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">

              <Link
                to="/register"
                className="rounded-xl bg-pink-600 px-8 py-4 text-center font-semibold text-white transition duration-300 hover:bg-pink-700"
              >
                Join Now
              </Link>

              <Link
                to="/trainers"
                className="rounded-xl border border-white px-8 py-4 text-center font-semibold text-white transition duration-300 hover:bg-white hover:text-black"
              >
                Meet Our Trainers
              </Link>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}

export default Hero;