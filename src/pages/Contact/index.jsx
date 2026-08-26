import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import { useGymSettings } from "../../hooks/useGymSettings";
import PageHero from "../../components/common/PageHero";
import contactImage from "../../assets/images/pages/contact.jpg";

function Contact() {
  const { settings } = useGymSettings();

  return (
    <>
      {/* Hero */}

      {/* Hero */}

<PageHero
  label="CONTACT US"
  title={`We'd Love
          To Hear From You`}
  subtitle="Have questions? Need more information? Our team is always ready to help you begin your fitness journey."
  image={contactImage}
/>

      {/* Contact Section */}

      {/* Contact Section */}

<section className="bg-white py-16 sm:py-20 lg:py-24">

  <div className="max-w-7xl mx-auto px-6 sm:px-8 grid gap-10 lg:grid-cols-2">

    {/* Contact Form */}

    <div>

      <h2 className="text-3xl sm:text-4xl font-bold">

        Send Us A Message

      </h2>

      <p className="mt-4 text-gray-600">

        Fill in the form below and we'll get back to you as soon as possible.

      </p>

      <form className="mt-8 space-y-5">

        <input
          type="text"
          placeholder="Full Name"
          className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:border-pink-500 focus:outline-none"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:border-pink-500 focus:outline-none"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:border-pink-500 focus:outline-none"
        />

        <textarea
          rows="6"
          placeholder="Your Message"
          className="w-full rounded-xl border border-gray-300 px-5 py-4 resize-none focus:border-pink-500 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-pink-600 py-4 font-semibold text-white hover:bg-pink-700 transition"
        >

          Send Message

        </button>

      </form>

    </div>

    {/* Contact Card */}

    <div className="bg-black rounded-3xl p-6 sm:p-8 lg:p-10 text-white">

      <h2 className="text-3xl sm:text-4xl font-bold">

        Contact Information

      </h2>

      <div className="mt-8 space-y-8">

        <div className="flex gap-4">

          <FaPhoneAlt className="text-pink-500 mt-1" size={22} />

          <div>

            <h3 className="font-bold">

              Phone

            </h3>

            <p className="text-gray-300 mt-2">

              {settings.phone}

            </p>

          </div>

        </div>

        <div className="flex gap-4">

          <FaEnvelope className="text-pink-500 mt-1" size={22} />

          <div>

            <h3 className="font-bold">

              Email

            </h3>

            <p className="text-gray-300 mt-2">

              {settings.email}

            </p>

          </div>

        </div>

        <div className="flex gap-4">

          <FaMapMarkerAlt className="text-pink-500 mt-1" size={22} />

          <div>

            <h3 className="font-bold">

              Location

            </h3>

            <p className="text-gray-300 mt-2">

              {settings.address}

            </p>

          </div>

        </div>

        <div className="flex gap-4">

  <FaClock
    size={22}
    className="text-pink-500 mt-1 shrink-0"
  />

  <div>

    <h3 className="font-bold text-lg">

      Working Hours

    </h3>

    <div className="mt-3 space-y-3 text-gray-300">

      <div>

        <p className="font-semibold text-white">

          Monday - Friday

        </p>

        <p>

          {settings.opening_time} - {settings.closing_time}

        </p>

      </div>

      <div>

        <p className="font-semibold text-white">

          Saturday

        </p>

        <p>

          6:00 AM - 6:00 PM

        </p>

      </div>

      <div>

        <p className="font-semibold text-white">

          Sunday

        </p>

        <p>

          8:00 AM - 2:00 PM

        </p>

      </div>

    </div>

  </div>

</div>

      </div>

    </div>

  </div>

</section>

      {/* Google Map Placeholder */}

      {/* Google Map */}

<section className="bg-gray-100 py-16 sm:py-20 lg:py-24">

  <div className="max-w-7xl mx-auto px-6 sm:px-8">

    <div className="overflow-hidden rounded-3xl shadow-xl">

      <iframe
        title="Malkia Fitness Location"
        src="https://www.google.com/maps?q=Galana+Plaza,+Galana+Road,+Nairobi,+Kenya&output=embed"
        className="w-full h-87.5 sm:h-112.5 lg:h-137.5"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />

    </div>

  </div>

</section>

      {/* CTA */}

      {/* CTA */}

<section className="bg-pink-600 py-16 sm:py-20 lg:py-24 text-white">

  <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">

    <h2 className="text-4xl sm:text-5xl font-bold leading-tight">

      Ready To Join

      <br />

      Malkia Fitness?

    </h2>

    <p className="mt-6 text-lg sm:text-xl">

      Start your fitness journey today with Kenya's leading women-only gym.

    </p>

    <Link
      to="/register"
      className="inline-flex items-center gap-3 mt-10 rounded-xl bg-black px-8 py-4 font-semibold hover:bg-zinc-900 transition"
    >

      Register Today

      <FaArrowRight />

    </Link>

  </div>

</section>
    </>
  );
}

export default Contact;