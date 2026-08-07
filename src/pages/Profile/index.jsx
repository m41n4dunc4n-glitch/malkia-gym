import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaDumbbell,
  FaSave,
  FaCamera,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import {
  getProfile,
  updateProfile,
} from "../../services/profile";

function Profile() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    date_of_birth: "",
    membership_name: "",
  });

  const [profileImage, setProfileImage] =
    useState(null);

  useEffect(() => {
    if (!user) return;

    async function loadProfile() {
      const { data } = await getProfile(user.id);

      if (data) {
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          date_of_birth:
            data.date_of_birth || "",
          membership_name:
            data.membership_plans?.name ||
            "No Membership",
        });
      }

      setProfileImage(
        user?.user_metadata?.avatar_url ||
        user?.user_metadata?.picture ||
        null
      );

      setLoading(false);
    }

    loadProfile();
  }, [user]);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file || !user) return;

    try {
      setSaving(true);

      const fileExt = file.name.split(".").pop();

      const fileName = `${user.id}.${fileExt}`;

      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from("profile-images")
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type,
          });

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data } =
        await supabase.storage
          .from("profile-images")
          .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;

      const { error: metadataError } =
        await supabase.auth.updateUser({
          data: {
            avatar_url: imageUrl,
          },
        });

      if (metadataError) {
        alert(metadataError.message);
        return;
      }

      setProfileImage(imageUrl);

      alert("Profile picture updated successfully!");

    } catch (error) {
      console.error(error);
      alert("Failed to update profile picture.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (saving) return;

    setSaving(true);

    const updates = {
      full_name: formData.full_name,
      phone: formData.phone,
      date_of_birth:
        formData.date_of_birth,
    };

    const { error } =
      await updateProfile(
        user.id,
        updates
      );

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    alert(
      "Profile updated successfully!"
    );

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-pink-600 border-t-transparent" />

          <p className="mt-5 font-semibold text-gray-600">
            Loading your profile...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">

      {/* =====================================
          HEADER
      ====================================== */}

      <div>

        <p className="text-sm font-semibold uppercase tracking-wider text-pink-600">
          Account
        </p>

        <h1 className="mt-1 text-3xl font-bold md:text-4xl">
          My Profile
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your personal information and
          membership details.
        </p>

      </div>

      {/* =====================================
          PROFILE HERO
      ====================================== */}

      <section className="relative overflow-hidden rounded-3xl bg-black p-6 text-white shadow-xl md:p-8">

        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="relative flex flex-col items-center gap-6 sm:flex-row">

          {/* Avatar */}

          <div className="relative">

            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-pink-500 bg-zinc-800 shadow-xl">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt={formData.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUser className="text-4xl text-gray-400" />
              )}

            </div>

            {/* Camera */}

            <label
              htmlFor="profile-image"
              className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-pink-600 text-white shadow-lg transition hover:bg-pink-700"
            >

              <FaCamera />

            </label>

            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

          </div>

          {/* Information */}

          <div className="text-center sm:text-left">

            <p className="text-sm font-medium text-pink-400">
              MALKIA FITNESS MEMBER
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              {formData.full_name ||
                "Your Name"}
            </h2>

            <p className="mt-2 flex items-center justify-center gap-2 text-gray-400 sm:justify-start">
              <FaEnvelope />
              {user?.email}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Click the camera icon to change your
              profile picture.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================
          FORM
      ====================================== */}

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-3xl bg-white shadow-sm"
      >

        {/* Personal Information */}

        <div className="border-b border-gray-100 p-6 md:p-8">

          <div className="mb-7">

            <h2 className="text-2xl font-bold">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your personal details below.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* Full Name */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <div className="relative">

                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-11 pr-4 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10"
                />

              </div>

            </div>

            {/* Email */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <div className="relative">

                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  value={user?.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 py-4 pl-11 pr-4 text-gray-500 outline-none"
                />

              </div>

              <p className="mt-2 text-xs text-gray-400">
                Your login email cannot be changed here.
              </p>

            </div>

            {/* Phone */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Phone Number
              </label>

              <div className="relative">

                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-11 pr-4 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10"
                />

              </div>

            </div>

            {/* Date of Birth */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Date of Birth
              </label>

              <div className="relative">

                <FaBirthdayCake className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-4 pl-11 pr-4 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10"
                />

              </div>

            </div>

          </div>

        </div>

        {/* Membership */}

        <div className="border-b border-gray-100 bg-gray-50/50 p-6 md:p-8">

          <div className="mb-5">

            <h2 className="text-2xl font-bold">
              Membership
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your current membership plan.
            </p>

          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-pink-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                <FaDumbbell />
              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Current Plan
                </p>

                <p className="text-xl font-bold">
                  {formData.membership_name ||
                    "No Membership"}
                </p>

              </div>

            </div>

            <span className="w-fit rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700">
              Membership Plan
            </span>

          </div>

        </div>

        {/* Save */}

        <div className="flex flex-col gap-3 p-6 sm:flex-row sm:justify-end md:p-8">

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-3 rounded-xl bg-pink-600 px-8 py-4 font-bold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <FaSave />

            {saving
              ? "Saving Changes..."
              : "Save Changes"}

          </button>

        </div>

      </form>

    </div>
  );
}

export default Profile;