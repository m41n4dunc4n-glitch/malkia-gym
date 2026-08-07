import { useEffect, useState } from "react";
import {
  FaComments,
  FaStar,
  FaTrash,
  FaUser,
  FaEnvelope,
  FaQuoteLeft,
} from "react-icons/fa";

import { getFeedback } from "../../../services/feedback";
import { supabase } from "../../../services/supabase";

function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchFeedback() {
      setLoading(true);

      const { data, error } = await getFeedback();

      if (error) {
        console.error("Failed to load feedback:", error);
      }

      if (isMounted) {
        setFeedback(data || []);
        setLoading(false);
      }
    }

    fetchFeedback();

    return () => {
      isMounted = false;
    };
  }, []);

  async function loadFeedback() {
    const { data, error } = await getFeedback();

    if (error) {
      console.error("Failed to load feedback:", error);
      return;
    }

    setFeedback(data || []);
  }

  async function deleteFeedback(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this feedback?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("feedback")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete feedback:", error);
      alert(error.message);
      return;
    }

    await loadFeedback();
  }

  function renderStars(rating) {
    const stars = Math.max(0, Math.min(5, Number(rating) || 0));

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={
              star <= stars
                ? "text-pink-500"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="overflow-hidden rounded-3xl bg-linear-to-r from-black via-zinc-900 to-pink-700 p-6 text-white shadow-xl md:p-8">

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-5">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-pink-600 shadow-lg shadow-pink-900/30">

              <FaComments className="text-2xl" />

            </div>

            <div>

              <h1 className="text-3xl font-extrabold md:text-4xl">
                Member Feedback
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-gray-300 md:text-base">
                Review feedback and experiences shared by Malkia Fitness members.
              </p>

            </div>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 backdrop-blur-sm">

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Total Feedback
            </p>

            <p className="mt-1 text-3xl font-extrabold">
              {feedback.length}
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="rounded-3xl bg-white p-12 text-center shadow-lg">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />

          <p className="mt-5 font-semibold text-gray-600">
            Loading member feedback...
          </p>

        </div>
      )}


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {!loading && feedback.length === 0 && (
        <div className="rounded-3xl bg-white p-12 text-center shadow-lg">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-pink-100">

            <FaComments className="text-3xl text-pink-600" />

          </div>

          <h2 className="mt-6 text-2xl font-bold">
            No Feedback Yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Member feedback will appear here once members start sharing
            their experiences.
          </p>

        </div>
      )}


      {/* =====================================================
          FEEDBACK GRID
      ===================================================== */}

      {!loading && feedback.length > 0 && (

        <div className="grid gap-6 lg:grid-cols-2">

          {feedback.map((item) => (

            <div
              key={item.id}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              {/* Pink top accent */}

              <div className="h-2 bg-linear-to-r from-black via-pink-600 to-pink-400" />


              <div className="p-6 md:p-7">

                {/* =================================================
                    TOP SECTION
                ================================================= */}

                <div className="flex items-start justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100">

                      <FaUser className="text-pink-600" />

                    </div>

                    <div className="min-w-0">

                      <h2 className="truncate font-bold text-gray-900">
                        {item.profiles?.full_name || "Unknown Member"}
                      </h2>

                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">

                        <FaEnvelope className="shrink-0 text-xs" />

                        <span className="break-all">
                          {item.profiles?.email || "No email"}
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* Delete */}

                  <button
                    type="button"
                    onClick={() => deleteFeedback(item.id)}
                    title="Delete feedback"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
                  >
                    <FaTrash />
                  </button>

                </div>


                {/* =================================================
                    RATING
                ================================================= */}

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-gray-50 p-4">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Rating
                    </p>

                    <div className="mt-2">
                      {renderStars(item.rating)}
                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-2xl font-extrabold text-pink-600">
                      {item.rating || 0}/5
                    </p>

                  </div>

                </div>


                {/* =================================================
                    FEEDBACK CONTENT
                ================================================= */}

                <div className="relative mt-6 rounded-2xl border border-gray-100 bg-white p-5">

                  <FaQuoteLeft className="absolute right-5 top-5 text-2xl text-pink-100" />

                  <h3 className="relative pr-8 text-xl font-bold text-gray-900">
                    {item.subject || "Member Feedback"}
                  </h3>

                  <p className="relative mt-4 whitespace-pre-wrap leading-7 text-gray-600">
                    {item.message || "No message provided."}
                  </p>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Member Review
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-600">
                      Malkia Fitness
                    </p>

                  </div>

                  <div className="rounded-full bg-pink-100 px-4 py-2 text-xs font-bold text-pink-700">
                    Feedback
                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Feedback;