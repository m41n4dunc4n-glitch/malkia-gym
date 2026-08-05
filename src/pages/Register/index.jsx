import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../services/auth";
import registerImage from "../../assets/images/pages/register.jpg";

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
    <section
      className="relative mt-20 min-h-[calc(100vh-80px)] bg-cover bg-center"
      style={{
        backgroundImage: `url(${registerImage})`,
      }}
    >
      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/65"></div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-between gap-16 px-6 sm:px-8 lg:px-10">

        {/* LEFT SIDE */}

        <div className="hidden max-w-xl lg:block">

          <p className="mb-4 text-sm font-semibold uppercase tracking-[5px] text-pink-500">
            JOIN MALKIA FITNESS
          </p>

          <h1 className="text-6xl font-extrabold leading-tight text-white">

            Become
            <br />
            A Queen.

          </h1>

          <p className="mt-8 text-xl leading-9 text-gray-300">

            Begin your transformation today.

            <br />
            <br />

            Join a supportive community of women,
            train with experienced coaches,
            and build a healthier, stronger and more confident version of yourself.

          </p>

        </div>

        {/* RIGHT SIDE */}

        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">

          <h2 className="mb-8 text-center text-4xl font-bold text-white">
            Create Account
          </h2>

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
                className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-white placeholder:text-gray-300 outline-none backdrop-blur-md transition focus:border-pink-500"
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
                className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-white placeholder:text-gray-300 outline-none backdrop-blur-md transition focus:border-pink-500"
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
                className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-white placeholder:text-gray-300 outline-none backdrop-blur-md transition focus:border-pink-500"
                required
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-pink-600 py-4 font-bold text-white transition hover:bg-pink-700 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <div className="mt-8 border-t border-white/20 pt-6 text-center">

            <p className="text-gray-200">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="mt-3 inline-block font-semibold text-pink-300 hover:text-pink-400"
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