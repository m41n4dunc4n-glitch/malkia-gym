import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { submitFeedback } from "../../../services/feedback";

function Feedback() {

  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {

    e.preventDefault();

    setLoading(true);

    const { error } = await submitFeedback({

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

    alert("Thank you for your feedback ❤️");

    setRating(5);
    setSubject("");
    setMessage("");
  }

  return (

    <div className="max-w-4xl">

      <h1 className="text-4xl font-bold">
        Member Feedback
      </h1>

      <p className="mt-2 text-gray-500">
        Tell us how we're doing. Your feedback helps improve Malkia Fitness.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 rounded-3xl bg-white p-8 shadow-lg space-y-6"
      >

        <div>

          <label className="mb-2 block font-semibold">
            Rating
          </label>

          <select

            value={rating}

            onChange={(e)=>setRating(Number(e.target.value))}

            className="w-full rounded-xl border p-4"

          >

            <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
            <option value={4}>⭐⭐⭐⭐ Very Good</option>
            <option value={3}>⭐⭐⭐ Good</option>
            <option value={2}>⭐⭐ Fair</option>
            <option value={1}>⭐ Poor</option>

          </select>

        </div>

        <div>

          <label className="mb-2 block font-semibold">
            Subject
          </label>

          <input

            value={subject}

            onChange={(e)=>setSubject(e.target.value)}

            className="w-full rounded-xl border p-4"

            placeholder="Enter subject"

            required

          />

        </div>

        <div>

          <label className="mb-2 block font-semibold">
            Message
          </label>

          <textarea

            rows={6}

            value={message}

            onChange={(e)=>setMessage(e.target.value)}

            className="w-full rounded-xl border p-4"

            placeholder="Write your feedback..."

            required

          />

        </div>

        <button

          disabled={loading}

          className="rounded-xl bg-pink-600 px-8 py-4 font-semibold text-white hover:bg-pink-700"

        >

          {loading ? "Submitting..." : "Submit Feedback"}

        </button>

      </form>

    </div>

  );

}

export default Feedback;