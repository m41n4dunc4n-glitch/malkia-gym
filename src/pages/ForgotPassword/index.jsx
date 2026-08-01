import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "A password reset link has been sent to your email if an account exists."
    );
  }

  return (
    <section className="mt-20 min-h-[calc(100vh-80px)] bg-black flex items-center justify-center px-6 sm:px-8 py-16 sm:py-20">

      <div className="w-full max-w-md">

        <div className="mb-10 text-center">

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Forgot Password
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-400 leading-7">
            Enter your email address and we'll send you a password reset link.
          </p>

        </div>

        <div className="rounded-3xl bg-zinc-900 p-6 sm:p-8 lg:p-10 shadow-2xl">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>

              <label className="block mb-2 font-medium text-white">
                Email Address
              </label>

              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white outline-none transition focus:border-pink-500"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-pink-600 py-4 font-semibold text-white transition hover:bg-pink-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

          </form>

          <div className="mt-8 border-t border-zinc-700 pt-6 text-center">

            <p className="text-gray-400">

              Remember your password?

            </p>

            <Link
              to="/login"
              className="mt-3 inline-block font-semibold text-pink-500 hover:text-pink-400 transition"
            >
              Back to Login
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ForgotPassword;