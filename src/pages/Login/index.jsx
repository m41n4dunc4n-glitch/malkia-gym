import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../../services/auth";
import { supabase } from "../../services/supabase";
import { getProfile } from "../../services/profile";
import loginImage from "../../assets/images/pages/login.jpg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        alert(error.message);
        return;
      }

      const { data: profile, error: profileError } = await getProfile(
        data.user.id
      );

      if (profile?.status === "Suspended") {
        await supabase.auth.signOut();

        alert(
          "Your account has been suspended.\nPlease contact the gym administrator."
        );

        return;
      }

      if (profileError) {
        alert(profileError.message);
        return;
      }

      if (profile.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/member");
      }
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="relative mt-20 min-h-[calc(100vh-80px)] bg-cover bg-center"
      style={{
        backgroundImage: `url(${loginImage})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65"></div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-between gap-16 px-6 sm:px-8 lg:px-10">

        {/* LEFT SIDE */}

        <div className="hidden max-w-xl lg:block">

          <p className="mb-4 text-sm font-semibold uppercase tracking-[5px] text-pink-500">
            MEMBER ACCESS
          </p>

          <h1 className="text-6xl font-extrabold leading-tight text-white">

            Welcome
            <br />
            Back.

          </h1>

          <p className="mt-8 text-xl leading-9 text-gray-300">

            Continue your fitness journey with
            <span className="font-semibold text-white">
              {" "}Malkia Fitness
            </span>.

            <br />
            <br />

            Train with professional coaches,
            achieve your goals,
            and become the strongest version of yourself.

          </p>

        </div>

        {/* RIGHT SIDE */}

        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">

          <h2 className="mb-8 text-center text-4xl font-bold text-white">
            Login
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-white placeholder:text-gray-300 outline-none backdrop-blur-md transition focus:border-pink-500"
                required
              />

            </div>

            <div className="text-right">

              <Link
                to="/forgot-password"
                className="text-sm text-pink-300 hover:text-pink-400"
              >
                Forgot Password?
              </Link>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-pink-600 py-4 font-bold text-white transition hover:bg-pink-700 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="mt-8 border-t border-white/20 pt-6 text-center">

            <p className="text-gray-200">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="mt-3 inline-block font-semibold text-pink-300 hover:text-pink-400"
            >
              Create Account
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Login;