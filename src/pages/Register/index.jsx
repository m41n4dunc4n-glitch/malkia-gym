import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../services/auth";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const { error } = await signUp(
      fullName,
      email,
      password
    );

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Account created successfully!\n\nPlease check your email to verify your account."
    );

    navigate("/login");
  }

  return (
    <section className="mt-20 min-h-[calc(100vh-80px)] bg-black flex items-center justify-center px-6 sm:px-8 py-16 sm:py-20">

      <div className="w-full max-w-md">

        {/* Heading */}

        <div className="mb-10 text-center">

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">

            Create Account

          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-400 leading-7">

            Join Malkia Fitness and begin your journey to becoming stronger,
            healthier and more confident.

          </p>

        </div>

        {/* Card */}

        <div className="rounded-3xl bg-zinc-900 p-6 sm:p-8 lg:p-10 shadow-2xl">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>

              <label className="mb-2 block font-medium text-white">

                Full Name

              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none transition focus:border-pink-500"
                required
              />

            </div>

            <div>

              <label className="mb-2 block font-medium text-white">

                Email Address

              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none transition focus:border-pink-500"
                required
              />

            </div>

            <div>

              <label className="mb-2 block font-medium text-white">

                Password

              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none transition focus:border-pink-500"
                required
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-pink-600 py-4 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading ? "Creating Account..." : "Create Account"}

            </button>

          </form>

          <div className="mt-8 border-t border-zinc-700 pt-6 text-center">

            <p className="text-gray-400">

              Already have an account?

            </p>

            <Link
              to="/login"
              className="mt-3 inline-block font-semibold text-pink-500 transition hover:text-pink-400"
            >

              Login

            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Register;