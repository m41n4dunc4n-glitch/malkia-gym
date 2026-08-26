import { useEffect, useState } from "react";
import { getMembershipPlans } from "../../services/membership";
import { updateProfile } from "../../services/profile";

function MemberModal({ member, onClose, onUpdated }) {
  const [plans, setPlans] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: member.full_name || "",
    phone: member.phone || "",
    gender: member.gender || "",
    date_of_birth: member.date_of_birth || "",
    membership_id: member.membership_id
      ? String(member.membership_id)
      : "",
  });

  useEffect(() => {
    async function loadPlans() {
      const { data, error } = await getMembershipPlans();

      if (error) {
        console.error("Failed to load membership plans:", error);
        return;
      }

      setPlans(data || []);
    }

    loadPlans();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave() {
    setSaving(true);

    const updates = {
      full_name: form.full_name,
      phone: form.phone,
      gender: form.gender,
      date_of_birth: form.date_of_birth,
      membership_id: form.membership_id
        ? Number(form.membership_id)
        : null,

      // If membership is selected, start it now.
      // If membership is removed, clear the start date.
      membership_started_at: form.membership_id
        ? member.membership_started_at ||
          new Date().toISOString()
        : null,
    };

    const { error } = await updateProfile(
      member.id,
      updates
    );

    setSaving(false);

    if (error) {
      console.error("MEMBER UPDATE ERROR:", error);
      alert(error.message);
      return;
    }

    alert("Member updated successfully!");

    await onUpdated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex flex-col gap-6 border-b p-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-600 text-3xl font-bold text-white">
              {member.full_name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                {member.full_name}
              </h2>

              <p className="mt-1 break-all text-gray-500">
                {member.email}
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="self-center rounded-full bg-gray-100 px-4 py-2 text-3xl transition hover:bg-gray-200 sm:self-auto"
          >
            ×
          </button>

        </div>

        {/* Body */}

        <div className="grid gap-8 p-6 lg:grid-cols-2">

          {/* Information */}

          <div>

            <h3 className="mb-6 text-2xl font-bold">
              Member Information
            </h3>

            <div className="space-y-4">

              <Info
                label="Role"
                value={member.role}
              />

              <Info
                label="Status"
                value={member.status}
              />

              <Info
                label="Membership"
                value={
                  member.membership_plans?.name || "None"
                }
              />

              <Info
                label="Phone"
                value={member.phone || "-"}
              />

              <Info
                label="Gender"
                value={member.gender || "-"}
              />

              <Info
                label="Date of Birth"
                value={member.date_of_birth || "-"}
              />

              <Info
                label="Joined"
                value={
                  member.created_at
                    ? new Date(
                        member.created_at
                      ).toLocaleDateString()
                    : "-"
                }
              />

            </div>

          </div>

          {/* Edit */}

          <div>

            <h3 className="mb-6 text-2xl font-bold">
              Edit Profile
            </h3>

            <div className="space-y-5">

              {/* Full Name */}

              <div>
                <label className="mb-2 block font-semibold">
                  Full Name
                </label>

                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="mb-2 block font-semibold">
                  Phone Number
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
                />
              </div>

              {/* Gender */}

              <div>
                <label className="mb-2 block font-semibold">
                  Gender
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </div>

              {/* Date of Birth */}

              <div>
                <label className="mb-2 block font-semibold">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
                />
              </div>

              {/* MEMBERSHIP */}

              <div>
                <label className="mb-2 block font-semibold">
                  Membership Plan
                </label>

                <select
                  name="membership_id"
                  value={form.membership_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
                >

                  <option value="">
                    No Membership
                  </option>

                  {plans.map((plan) => (
                    <option
                      key={plan.id}
                      value={plan.id}
                    >
                      {plan.name} — KSh{" "}
                      {Number(plan.price).toLocaleString()} /{" "}
                      {plan.duration} days
                    </option>
                  ))}

                </select>
              </div>

              {/* Buttons */}

              <div className="flex flex-col gap-4 pt-2 sm:flex-row">

                <button
                  onClick={onClose}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-gray-200 py-4 font-semibold hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-pink-600 py-4 font-bold text-white transition hover:bg-pink-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">

      <span className="font-semibold">
        {label}
      </span>

      <span className="break-all text-gray-600">
        {value}
      </span>

    </div>
  );
}

export default MemberModal;