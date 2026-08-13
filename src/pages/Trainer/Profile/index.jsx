import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  getTrainerByUserId,
  updateTrainerProfile,
} from "../../../services/trainers";

function TrainerProfile() {
  const { user } = useAuth();

  const fileInputRef = useRef(null);

  const [trainer, setTrainer] = useState(null);

  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);

    try {
      const { data, error } = await getTrainerByUserId(user.id);

      if (error) {
        console.error("Trainer profile error:", error);
        setTrainer(null);
        return;
      }

      setTrainer(data);
      setPhone(data?.phone || "");
      setImageUrl(data?.image_url || "");
    } catch (error) {
      console.error("Profile loading error:", error);
      setTrainer(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Defer calling loadProfile to avoid synchronous setState during effect
    (async () => {
      // yield to the event loop so setState inside loadProfile isn't called synchronously
      await Promise.resolve();
      await loadProfile();
    })();
  }, [loadProfile]);

  /*
   * Choose profile picture
   */
  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    // Only allow images
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5MB.");
      return;
    }

    // Keep only preview URL; we don't need the File object elsewhere

    // Preview image
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
  }

  /*
   * Remove selected/current image
   */
  function removeImage() {
    setImageUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  /*
   * Save only allowed trainer information
   */
  async function handleSave(event) {
    event.preventDefault();

    if (!trainer?.id) return;

    setSaving(true);

    try {
      /*
       * IMPORTANT:
       * For now this sends only:
       * - phone
       * - image_url
       *
       * We are deliberately NOT sending:
       * - name
       * - email
       * - specialty
       * - experience
       * - working_days
       * - capacity
       */

      const { error } = await updateTrainerProfile(trainer.id, {
        phone,
        image_url: imageUrl,
      });

      if (error) {
        console.error("Profile update error:", error);
        alert(error.message);
        return;
      }

      alert("Profile updated successfully.");

      await loadProfile();
    } catch (error) {
      console.error("Profile save error:", error);
      alert("Something went wrong while saving your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />

          <p className="font-semibold text-gray-600">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm sm:p-10">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-2xl">
            👤
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-gray-900">
            Trainer Profile Not Found
          </h1>

          <p className="mt-3 leading-7 text-gray-500">
            Your account has not been connected to a trainer profile yet.
            Please contact the gym administrator.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-black px-5 py-7 shadow-sm sm:px-8 sm:py-9">

        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-pink-600/10 blur-3xl" />

        <div className="relative">

          <div className="mb-3 flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-pink-500" />

            <p className="text-xs font-bold uppercase tracking-[3px] text-pink-400 sm:text-sm">
              Trainer Profile
            </p>

          </div>

          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
            View your trainer information and update the details
            available to you.
          </p>

        </div>
      </div>


      {/* =====================================================
          PROFILE
      ====================================================== */}

      <form onSubmit={handleSave} className="space-y-6">


        {/* ===================================================
            PROFILE CARD
        ==================================================== */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

          {/* Card header */}

          <div className="border-b border-gray-100 px-5 py-5 sm:px-7">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-xl">
                👤
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-[2px] text-pink-600">
                  Personal Information
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-gray-900">
                  Trainer Details
                </h2>

              </div>

            </div>

          </div>


          {/* Card body */}

          <div className="p-5 sm:p-7">

            <div className="grid gap-8 lg:grid-cols-[auto_1fr]">


              {/* =================================================
                  PROFILE IMAGE
              ================================================== */}

              <div className="flex flex-col items-center">

                <div className="relative">

                  <div className="h-36 w-36 overflow-hidden rounded-3xl bg-gray-100 ring-4 ring-pink-50 sm:h-44 sm:w-44">

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={trainer.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-5xl text-gray-400">
                        👤
                      </div>
                    )}

                  </div>

                  {/* Pink camera button */}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-xl bg-pink-600 text-lg text-white shadow-lg transition hover:bg-pink-700"
                    title="Change profile picture"
                  >
                    📷
                  </button>

                </div>


                {/* Hidden file input */}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />


                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:border-pink-300 hover:text-pink-600"
                >
                  Change Photo
                </button>


                {imageUrl && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="mt-2 text-xs font-semibold text-red-500 transition hover:text-red-700"
                  >
                    Remove Photo
                  </button>
                )}

                <p className="mt-3 max-w-55 text-center text-xs leading-5 text-gray-400">
                  JPG, PNG or WEBP. Maximum size 5MB.
                </p>

              </div>


              {/* =================================================
                  LOCKED INFORMATION
              ================================================== */}

              <div className="grid gap-5 sm:grid-cols-2">


                {/* Full Name */}

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Full Name
                  </label>

                  <div className="relative">

                    <input
                      type="text"
                      value={trainer.name || ""}
                      disabled
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-500 outline-none"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      🔒
                    </span>

                  </div>

                  <p className="mt-1.5 text-xs text-gray-400">
                    Managed by the administrator.
                  </p>

                </div>


                {/* Email */}

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Email
                  </label>

                  <div className="relative">

                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-500 outline-none"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      🔒
                    </span>

                  </div>

                  <p className="mt-1.5 text-xs text-gray-400">
                    Managed by the administrator.
                  </p>

                </div>


                {/* Specialty */}

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Specialty
                  </label>

                  <div className="relative">

                    <input
                      type="text"
                      value={trainer.specialty || "Fitness Trainer"}
                      disabled
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-500 outline-none"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      🔒
                    </span>

                  </div>

                </div>


                {/* Experience */}

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Experience
                  </label>

                  <div className="relative">

                    <input
                      type="text"
                      value={`${trainer.experience || 0} years`}
                      disabled
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-500 outline-none"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      🔒
                    </span>

                  </div>

                </div>


                {/* Working Days */}

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Working Days
                  </label>

                  <div className="min-h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

                    {trainer.working_days?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">

                        {trainer.working_days.map((day) => (
                          <span
                            key={day}
                            className="rounded-full bg-pink-50 px-2.5 py-1 text-xs font-bold text-pink-700"
                          >
                            {day}
                          </span>
                        ))}

                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">
                        No working days set
                      </span>
                    )}

                  </div>

                  <p className="mt-1.5 text-xs text-gray-400">
                    Working days can only be changed by an administrator.
                  </p>

                </div>


                {/* Capacity */}

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Capacity Per Slot
                  </label>

                  <div className="relative">

                    <input
                      type="text"
                      value={`${trainer.capacity_per_slot || 10} members`}
                      disabled
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-500 outline-none"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      🔒
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            EDITABLE INFORMATION
        ====================================================== */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

          <div className="border-b border-gray-100 px-5 py-5 sm:px-7">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-xl">
                ✎
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-[2px] text-pink-600">
                  Account Settings
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-gray-900">
                  Editable Information
                </h2>

              </div>

            </div>

          </div>


          <div className="p-5 sm:p-7">

            <div className="grid gap-6 md:grid-cols-2">


              {/* Phone */}

              <div>

                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                />

                <p className="mt-2 text-xs text-gray-400">
                  This is the phone number members can use to contact you.
                </p>

              </div>


              {/* Profile Picture status */}

              <div className="rounded-2xl border border-pink-100 bg-pink-50 p-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg">
                    📷
                  </div>

                  <div>

                    <h3 className="font-bold text-pink-900">
                      Profile Picture
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-pink-700">
                      Your profile picture can be changed using the
                      gallery button above.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="mt-3 text-sm font-extrabold text-pink-700 hover:text-pink-900"
                    >
                      Choose another photo →
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            SAVE BAR
        ====================================================== */}

        <div className="sticky bottom-4 z-10">

          <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl sm:px-6">

            <div>

              <p className="text-sm font-bold text-gray-900">
                Profile changes
              </p>

              <p className="mt-0.5 text-xs text-gray-400">
                Only your phone number and profile picture can be changed.
              </p>

            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-pink-600 px-7 py-3 font-bold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>

          </div>

        </div>

      </form>

    </div>
  );
}

export default TrainerProfile;