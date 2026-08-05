import { useState } from "react";
import { deleteAccount } from "../../../services/deleteAccount";
import { supabase } from "../../../services/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { changePassword } from "../../../services/memberSettings";

function Settings() {

  const { user } = useAuth();

const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChangePassword() {
    if (!password || !confirmPassword) {
      alert("Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await changePassword(password);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password changed successfully!");

    setPassword("");
    setConfirmPassword("");
  }

  async function handleDeleteAccount() {

  const confirmDelete = prompt(
    'Type DELETE to permanently deactivate your account.'
  );

  if (confirmDelete !== "DELETE") {
    alert("Account deletion cancelled.");
    return;
  }

  const { error } = await deleteAccount(user.id);

  if (error) {
    alert(error.message);
    return;
  }

  await supabase.auth.signOut();

  alert("Your account has been deleted.");

  navigate("/");
}

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
          Change Password
        </h2>

        <div className="space-y-6">

          <div>

            <label className="mb-2 block font-semibold">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border p-4 outline-none focus:border-pink-500"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border p-4 outline-none focus:border-pink-500"
            />

          </div>

          <button
            type="button"
            onClick={handleChangePassword}
            disabled={loading}
            className="w-full rounded-xl bg-pink-600 py-4 font-semibold text-white transition hover:bg-pink-700 disabled:opacity-50 md:w-auto md:px-10"
          >
            {loading ? "Updating..." : "Change Password"}
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
          Deleting your account will deactivate it immediately.
        </p>

        <button
  onClick={handleDeleteAccount}
  className="w-full rounded-xl bg-red-600 py-4 font-semibold text-white transition hover:bg-red-700 md:w-auto md:px-10"
>
  Delete Account
</button>

      </div>

    </div>
  );
}

export default Settings;