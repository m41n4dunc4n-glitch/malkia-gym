import { useState } from "react";

import {
  FaLock,
  FaBell,
  FaShieldAlt,
  FaTrash,
  FaKey,
  FaExclamationTriangle,
  FaCheck,
} from "react-icons/fa";

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
      "Type DELETE to permanently deactivate your account."
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

      {/* ================= HEADER ================= */}

      <div className="relative overflow-hidden rounded-3xl bg-black p-7 text-white shadow-xl md:p-10">

        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="relative">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-600">
              <FaShieldAlt />
            </div>

            <span className="text-sm font-bold uppercase tracking-widest text-pink-400">
              Account
            </span>

          </div>

          <h1 className="text-3xl font-black md:text-5xl">
            Settings
          </h1>

          <p className="mt-3 max-w-2xl text-gray-300 md:text-lg">
            Manage your security, notifications and account preferences.
          </p>

        </div>

      </div>

      {/* ================= SECURITY ================= */}

      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg">

        <div className="border-b border-gray-100 p-6 md:p-8">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
              <FaLock />
            </div>

            <div>

              <h2 className="text-xl font-black md:text-2xl">
                Security
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Keep your account protected.
              </p>

            </div>

          </div>

        </div>

        <div className="space-y-6 p-6 md:p-8">

          <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
              <FaKey className="text-pink-600" />
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-bold text-gray-700">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10"
            />

          </div>

          <button
            type="button"
            onClick={handleChangePassword}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-pink-600 px-8 py-4 font-bold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Updating...
              </>
            ) : (
              <>
                <FaCheck />
                Change Password
              </>
            )}

          </button>

        </div>

      </section>

      {/* ================= NOTIFICATIONS ================= */}

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg md:p-8">

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
              <FaBell />
            </div>

            <div>

              <h2 className="text-xl font-black md:text-2xl">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Receive booking updates and important reminders.
              </p>

            </div>

          </div>

          {/* Toggle */}

          <button
            type="button"
            onClick={() =>
              setNotifications(!notifications)
            }
            className={`relative h-8 w-14 shrink-0 rounded-full transition ${
              notifications
                ? "bg-pink-600"
                : "bg-gray-300"
            }`}
          >

            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                notifications
                  ? "left-7"
                  : "left-1"
              }`}
            />

          </button>

        </div>

        <div className="mt-6 rounded-2xl bg-gray-50 p-4">

          <p className="text-sm text-gray-600">

            Notifications are currently{" "}

            <span className="font-bold text-gray-900">
              {notifications
                ? "enabled"
                : "disabled"}
            </span>

            .

          </p>

        </div>

      </section>

      {/* ================= DANGER ZONE ================= */}

      <section className="overflow-hidden rounded-3xl border-2 border-red-200 bg-white shadow-lg">

        <div className="border-b border-red-100 bg-red-50 p-6 md:p-8">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <FaExclamationTriangle />
            </div>

            <div>

              <h2 className="text-xl font-black text-red-700 md:text-2xl">
                Danger Zone
              </h2>

              <p className="mt-1 text-sm text-red-600/80">
                Actions here can permanently affect your account.
              </p>

            </div>

          </div>

        </div>

        <div className="p-6 md:p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <h3 className="font-bold text-gray-900">
                Delete Account
              </h3>

              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your account will be deactivated immediately.
                This action should only be used if you no longer
                want to use Malkia Fitness.
              </p>

            </div>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-red-600 px-7 py-4 font-bold text-white transition hover:bg-red-700"
            >
              <FaTrash />
              Delete Account
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Settings;