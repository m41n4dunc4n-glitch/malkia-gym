import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

import {
  FaStar,
  FaPaperPlane,
  FaCommentDots,
  FaHeart,
} from "react-icons/fa";

import { submitFeedback } from "../../../services/feedback";

function Feedback() {

  const { user } = useAuth();

  const [rating, setRating] =
    useState(5);

  const [subject, setSubject] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(e) {

    e.preventDefault();

    setLoading(true);

    const { error } =
      await submitFeedback({

        user_id: user.id,

        rating,

        subject,

        message,

      });

    setLoading(false);

    if (error) {

      alert(error.message);

      return;
    }

    alert(
      "Thank you for your feedback ❤️"
    );

    setRating(5);

    setSubject("");

    setMessage("");
  }

  return (

    <div className="mx-auto w-full max-w-5xl space-y-8">

      {/* =====================================
          HERO
      ====================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-black px-6 py-10 text-white shadow-xl md:px-10">

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-600 shadow-lg shadow-pink-600/30">

              <FaCommentDots className="text-xl" />

            </div>

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-400">
                Your Voice Matters
              </p>

              <h1 className="mt-1 text-3xl font-black md:text-4xl">
                Member Feedback
              </h1>

            </div>

          </div>

          <p className="mt-6 max-w-2xl leading-7 text-gray-300">
            Tell us how we're doing. Your feedback helps
            us make Malkia Fitness a better place for
            every member.
          </p>

        </div>

      </div>

      {/* =====================================
          FORM
      ====================================== */}

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl"
      >

        {/* Form header */}

        <div className="border-b border-gray-100 bg-gray-50/70 px-6 py-6 md:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-600">

              <FaHeart />

            </div>

            <div>

              <h2 className="font-bold text-gray-900">
                Share your experience
              </h2>

              <p className="text-sm text-gray-500">
                We'd love to hear from you.
              </p>

            </div>

          </div>

        </div>

        <div className="space-y-7 p-6 md:p-8">

          {/* =====================================
              RATING
          ====================================== */}

          <div>

            <label className="mb-3 block text-sm font-bold text-gray-800">
              How would you rate your experience?
            </label>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">

              <div className="flex flex-wrap items-center gap-2">

                {[0, 1, 2, 3, 4, 5].map(
                  (star) => (

                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setRating(star)
                      }
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl transition ${
                        star <= rating
                          ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20"
                          : "bg-white text-gray-300 hover:bg-pink-50 hover:text-pink-400"
                      }`}
                      aria-label={`Rate ${star} stars`}
                    >

                      <FaStar />

                    </button>

                  )
                )}

                <div className="ml-2">

                  <p className="font-bold text-gray-900">
                    {rating === 5
                      ? "Excellent"
                      : rating === 4
                      ? "Very Good"
                      : rating === 3
                      ? "Good"
                      : rating === 2
                      ? "Fair"
                      : "Poor"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {rating}/5 rating
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =====================================
              SUBJECT
          ====================================== */}

          <div>

            <label
              htmlFor="feedback-subject"
              className="mb-2 block text-sm font-bold text-gray-800"
            >
              Subject
            </label>

            <input
              id="feedback-subject"
              value={subject}
              onChange={(e) =>
                setSubject(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition placeholder:text-gray-400 focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10"
              placeholder="What would you like to tell us about?"
              required
            />

          </div>

          {/* =====================================
              MESSAGE
          ====================================== */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <label
                htmlFor="feedback-message"
                className="text-sm font-bold text-gray-800"
              >
                Message
              </label>

              <span className="text-xs text-gray-400">
                Be honest — we appreciate it.
              </span>

            </div>

            <textarea
              id="feedback-message"
              rows={7}
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition placeholder:text-gray-400 focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10"
              placeholder="Write your feedback, suggestion or experience..."
              required
            />

          </div>

          {/* =====================================
              SUBMIT
          ====================================== */}

          <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-gray-500">
              Your feedback helps us improve.
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-3 rounded-2xl px-7 py-4 font-bold text-white shadow-lg transition ${
                loading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-pink-600 shadow-pink-600/20 hover:bg-pink-700 hover:shadow-xl"
              }`}
            >

              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane />

                  Submit Feedback
                </>
              )}

            </button>

          </div>

        </div>

      </form>

      {/* =====================================
          FOOTER NOTE
      ====================================== */}

      <div className="rounded-3xl border border-pink-100 bg-pink-50 p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-pink-600 shadow-sm">

            <FaHeart />

          </div>

          <div>

            <h3 className="font-bold text-gray-900">
              Thank you for helping us grow ❤️
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Every suggestion and review helps us
              create a stronger, better fitness community.
            </p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Feedback;