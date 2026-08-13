import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  getTrainerByUserId,
  updateTrainerProfile,
} from "../../../services/trainers";

function TrainerProfile() {
  const { user } = useAuth();

  const [trainer, setTrainer] = useState(null);

  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [workingDays, setWorkingDays] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const loadProfile = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);

    const { data, error } = await getTrainerByUserId(user.id);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setTrainer(data);

    setPhone(data?.phone || "");
    setImageUrl(data?.image_url || "");
    setWorkingDays(data?.working_days || []);

    setLoading(false);
  }, [user]);

  useEffect(() => {
    // call loadProfile asynchronously to avoid synchronous setState within effect
    (async () => {
      await loadProfile();
    })();
  }, [loadProfile]);

  function toggleDay(day) {
    setWorkingDays((current) => {
      if (current.includes(day)) {
        return current.filter((item) => item !== day);
      }

      return [...current, day];
    });
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!trainer?.id) return;

    setSaving(true);

    const { error } = await updateTrainerProfile(
      trainer.id,
      {
        phone,
        image_url: imageUrl,
        working_days: workingDays,
      }
    );

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    alert("Profile updated successfully.");

    await loadProfile();

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow">
        <h1 className="text-2xl font-bold">
          Trainer profile not found
        </h1>

        <p className="mt-3 text-gray-500">
          Your trainer profile has not been created yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <p className="text-sm font-semibold uppercase tracking-[3px] text-pink-600">
          Trainer Profile
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
          My Profile
        </h1>

        <p className="mt-2 text-gray-500">
          Manage the information you are allowed to change.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-8"
      >

        {/* PROFILE CARD */}

        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

          <div className="flex flex-col gap-8 md:flex-row">

            {/* IMAGE */}

            <div className="shrink-0">

              <div className="h-36 w-36 overflow-hidden rounded-3xl bg-gray-100">

                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={trainer.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl">
                    👤
                  </div>
                )}

              </div>

            </div>

            {/* INFORMATION */}

            <div className="flex-1 space-y-5">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={trainer.name || ""}
                  disabled
                  className="w-full rounded-xl border bg-gray-100 px-4 py-3 text-gray-500"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Contact an administrator if your name needs to be changed.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full rounded-xl border bg-gray-100 px-4 py-3 text-gray-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Specialty
                </label>

                <input
                  type="text"
                  value={trainer.specialty || ""}
                  disabled
                  className="w-full rounded-xl border bg-gray-100 px-4 py-3 text-gray-500"
                />
              </div>

            </div>

          </div>

        </div>

        {/* EDITABLE INFORMATION */}

        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

          <h2 className="text-2xl font-bold text-gray-900">
            Editable Information
          </h2>

          <p className="mt-1 text-gray-500">
            You can update your phone number, profile picture and working days.
          </p>

          <div className="mt-6 space-y-6">

            {/* PHONE */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />

            </div>

            {/* IMAGE URL */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Profile Picture URL
              </label>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />

              <p className="mt-2 text-xs text-gray-400">
                Paste the URL of your profile picture.
              </p>

            </div>

            {/* WORKING DAYS */}

            <div>

              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Available Working Days
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

                {days.map((day) => {

                  const selected =
                    workingDays.includes(day);

                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        selected
                          ? "border-pink-600 bg-pink-600 text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-pink-300"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}

              </div>

            </div>

          </div>

        </div>

        {/* SAVE */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-pink-600 px-7 py-3 font-bold text-white transition hover:bg-pink-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default TrainerProfile;