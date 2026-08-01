import { useState } from "react";

function Settings() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold md:text-4xl">
          Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your account preferences.
        </p>

      </div>

      {/* Account */}

      <div className="rounded-3xl bg-white p-5 shadow md:p-8">

        <h2 className="mb-6 text-xl font-bold md:text-2xl">
          Account
        </h2>

        <div className="space-y-6">

          <div>

            <label className="mb-2 block font-semibold">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              className="w-full rounded-xl border p-4 outline-none focus:border-pink-500"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full rounded-xl border p-4 outline-none focus:border-pink-500"
            />

          </div>

          <button className="w-full rounded-xl bg-pink-600 py-4 font-semibold text-white transition hover:bg-pink-700 md:w-auto md:px-10">

            Change Password

          </button>

        </div>

      </div>

      {/* Notifications */}

      <div className="rounded-3xl bg-white p-5 shadow md:p-8">

        <h2 className="mb-6 text-xl font-bold md:text-2xl">
          Notifications
        </h2>

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <h3 className="font-semibold">
              Email Notifications
            </h3>

            <p className="text-gray-500">
              Receive booking updates and reminders.
            </p>

          </div>

          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="h-6 w-6 accent-pink-600"
          />

        </div>

      </div>

      {/* Danger Zone */}

      <div className="rounded-3xl border-2 border-red-300 bg-red-50 p-5 md:p-8">

        <h2 className="mb-4 text-xl font-bold text-red-700 md:text-2xl">
          Danger Zone
        </h2>

        <p className="mb-6 text-gray-600">
          Permanently delete your account. This action cannot be undone.
        </p>

        <button className="w-full rounded-xl bg-red-600 py-4 font-semibold text-white transition hover:bg-red-700 md:w-auto md:px-10">

          Delete Account

        </button>

      </div>

    </div>
  );
}

export default Settings;