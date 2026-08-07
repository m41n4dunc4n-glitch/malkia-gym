import { useEffect, useState } from "react";
import {
  FaCog,
  FaBuilding,
  // eslint-disable-next-line no-unused-vars
  FaPhone,
  FaClock,
  FaMoneyBillWave,
  FaShareAlt,
  FaSave,
} from "react-icons/fa";

import {
  getGymSettings,
  updateGymSettings,
} from "../../../services/settings";

function Settings() {
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    gym_name: "",
    phone: "",
    email: "",
    address: "",
    opening_time: "",
    closing_time: "",
    mpesa_paybill: "",
    mpesa_till: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    website: "",
    whatsapp: "",
  });

  useEffect(() => {
    async function loadSettings() {
      const { data } = await getGymSettings();

      if (data) {
        setForm({
          gym_name: data.gym_name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          opening_time: data.opening_time || "",
          closing_time: data.closing_time || "",
          mpesa_paybill: data.mpesa_paybill || "",
          mpesa_till: data.mpesa_till || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          tiktok: data.tiktok || "",
          website: data.website || "",
          whatsapp: data.whatsapp || "",
        });
      }

      setLoading(false);
    }

    loadSettings();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSave(e) {
    e.preventDefault();

    const { error } = await updateGymSettings(form);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Settings updated successfully!");
  }

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">

        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100">

            <div className="h-9 w-9 animate-spin rounded-full border-4 border-pink-100 border-t-pink-600" />

          </div>

          <p className="mt-5 text-lg font-bold text-gray-700">
            Loading Settings...
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Preparing your gym configuration.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-black via-zinc-900 to-pink-700 p-7 text-white shadow-xl md:p-10">

        {/* Decorative glow */}

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />

        <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-pink-600/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-center">

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-pink-600 shadow-lg shadow-pink-600/30">

            <FaCog className="text-2xl" />

          </div>

          <div>

            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Gym Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300 md:text-base">
              Manage your gym information, contact details,
              operating hours, payment information and social media.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          FORM
      ===================================================== */}

      <form
        onSubmit={handleSave}
        className="space-y-8"
      >

        {/* =====================================================
            GYM INFORMATION
        ===================================================== */}

        <section className="overflow-hidden rounded-3xl bg-white shadow-lg">

          <div className="h-2 bg-linear-to-r from-black via-pink-600 to-pink-400" />

          <div className="p-6 md:p-8">

            <div className="mb-7 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">

                <FaBuilding className="text-xl text-pink-600" />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Gym Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Basic information about your gym.
                </p>

              </div>

            </div>


            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Gym Name
                </label>

                <input
                  name="gym_name"
                  value={form.gym_name}
                  onChange={handleChange}
                  placeholder="Gym Name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  WhatsApp Number
                </label>

                <input
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="WhatsApp Number"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
                />

              </div>

            </div>


            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Gym Address
              </label>

              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Gym Address"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
              />

            </div>

          </div>

        </section>


        {/* =====================================================
            OPERATING HOURS
        ===================================================== */}

        <section className="overflow-hidden rounded-3xl bg-white shadow-lg">

          <div className="h-2 bg-linear-to-r from-black via-pink-600 to-pink-400" />

          <div className="p-6 md:p-8">

            <div className="mb-7 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">

                <FaClock className="text-xl text-pink-600" />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Operating Hours
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Set when the gym opens and closes.
                </p>

              </div>

            </div>


            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Opening Time
                </label>

                <input
                  type="time"
                  name="opening_time"
                  value={form.opening_time}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Closing Time
                </label>

                <input
                  type="time"
                  name="closing_time"
                  value={form.closing_time}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
                />

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            PAYMENT DETAILS
        ===================================================== */}

        <section className="overflow-hidden rounded-3xl bg-white shadow-lg">

          <div className="h-2 bg-linear-to-r from-black via-pink-600 to-pink-400" />

          <div className="p-6 md:p-8">

            <div className="mb-7 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">

                <FaMoneyBillWave className="text-xl text-pink-600" />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Payment Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Configure the M-Pesa payment information used by the gym.
                </p>

              </div>

            </div>


            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  M-Pesa Paybill
                </label>

                <input
                  name="mpesa_paybill"
                  value={form.mpesa_paybill}
                  onChange={handleChange}
                  placeholder="M-Pesa Paybill Number"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  M-Pesa Till
                </label>

                <input
                  name="mpesa_till"
                  value={form.mpesa_till}
                  onChange={handleChange}
                  placeholder="M-Pesa Till Number"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
                />

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            SOCIAL MEDIA
        ===================================================== */}

        <section className="overflow-hidden rounded-3xl bg-white shadow-lg">

          <div className="h-2 bg-linear-to-r from-black via-pink-600 to-pink-400" />

          <div className="p-6 md:p-8">

            <div className="mb-7 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">

                <FaShareAlt className="text-xl text-pink-600" />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Social Media
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add the social links displayed around the website.
                </p>

              </div>

            </div>


            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Facebook
                </label>

                <input
                  name="facebook"
                  value={form.facebook}
                  onChange={handleChange}
                  placeholder="Facebook URL"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Instagram
                </label>

                <input
                  name="instagram"
                  value={form.instagram}
                  onChange={handleChange}
                  placeholder="Instagram URL"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  TikTok
                </label>

                <input
                  name="tiktok"
                  value={form.tiktok}
                  onChange={handleChange}
                  placeholder="TikTok URL"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Website
                </label>

                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="Website URL"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
                />

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            SAVE
        ===================================================== */}

        <div className="sticky bottom-4 z-20">

          <div className="rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-xl backdrop-blur">

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-black to-pink-600 py-4 text-lg font-bold text-white shadow-lg transition duration-300 hover:from-zinc-900 hover:to-pink-500"
            >

              <FaSave />

              Save Settings

            </button>

          </div>

        </div>

      </form>

    </div>
  );
}

export default Settings;