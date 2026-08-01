import { useEffect, useState } from "react";
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
      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />

          <p className="mt-4 text-lg font-semibold text-gray-600">
            Loading Settings...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold md:text-4xl">
          Gym Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your gym information, contact details and social media.
        </p>

      </div>

      <form
        onSubmit={handleSave}
        className="space-y-8 rounded-3xl bg-white p-5 shadow-lg md:p-8"
      >

        {/* Gym Information */}

        <div>

          <h2 className="mb-5 text-2xl font-bold">
            Gym Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <input
              name="gym_name"
              value={form.gym_name}
              onChange={handleChange}
              placeholder="Gym Name"
              className="rounded-xl border p-4"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="rounded-xl border p-4"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="rounded-xl border p-4"
            />

            <input
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="WhatsApp Number"
              className="rounded-xl border p-4"
            />

          </div>

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Gym Address"
            className="mt-5 w-full rounded-xl border p-4"
          />

        </div>

        {/* Opening Hours */}

        <div>

          <h2 className="mb-5 text-2xl font-bold">
            Operating Hours
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-semibold">
                Opening Time
              </label>

              <input
                type="time"
                name="opening_time"
                value={form.opening_time}
                onChange={handleChange}
                className="w-full rounded-xl border p-4"
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold">
                Closing Time
              </label>

              <input
                type="time"
                name="closing_time"
                value={form.closing_time}
                onChange={handleChange}
                className="w-full rounded-xl border p-4"
              />

            </div>

          </div>

        </div>

        {/* Payment Details */}

        <div>

          <h2 className="mb-5 text-2xl font-bold">
            Payment Details
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <input
              name="mpesa_paybill"
              value={form.mpesa_paybill}
              onChange={handleChange}
              placeholder="M-Pesa Paybill Number"
              className="rounded-xl border p-4"
            />

            <input
              name="mpesa_till"
              value={form.mpesa_till}
              onChange={handleChange}
              placeholder="M-Pesa Till Number"
              className="rounded-xl border p-4"
            />

          </div>

        </div>

        {/* Social Media */}

        <div>

          <h2 className="mb-5 text-2xl font-bold">
            Social Media
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <input
              name="facebook"
              value={form.facebook}
              onChange={handleChange}
              placeholder="Facebook URL"
              className="rounded-xl border p-4"
            />

            <input
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="Instagram URL"
              className="rounded-xl border p-4"
            />

            <input
              name="tiktok"
              value={form.tiktok}
              onChange={handleChange}
              placeholder="TikTok URL"
              className="rounded-xl border p-4"
            />

            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="Website URL"
              className="rounded-xl border p-4"
            />

          </div>

        </div>

        {/* Save */}

        <button
          type="submit"
          className="w-full rounded-xl bg-pink-600 py-4 text-lg font-bold text-white transition hover:bg-pink-700"
        >
          Save Settings
        </button>

      </form>

    </div>
  );
}

export default Settings;