import { useState } from "react";
import { updateProfile } from "../../services/profile";

function MemberModal({ member, onClose, onUpdated }) {
  const [form, setForm] = useState({
    full_name: member.full_name || "",
    phone: member.phone || "",
    gender: member.gender || "",
    date_of_birth: member.date_of_birth || "",
  });

  async function handleSave() {
    const { error } = await updateProfile(member.id, form);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Member updated successfully!");

    onUpdated();
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
                value={new Date(
                  member.created_at
                ).toLocaleDateString()}
              />

            </div>

          </div>

          {/* Edit */}

          <div>

            <h3 className="mb-6 text-2xl font-bold">
              Edit Profile
            </h3>

            <div className="space-y-5">

              <div>

                <label className="mb-2 block font-semibold">
                  Full Name
                </label>

                <input
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      full_name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
                />

              </div>

              <div>

                <label className="mb-2 block font-semibold">
                  Phone Number
                </label>

                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
                />

              </div>

              <div>

                <label className="mb-2 block font-semibold">
                  Gender
                </label>

                <select
                  value={form.gender}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      gender: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option>
                    Male
                  </option>

                  <option>
                    Female
                  </option>

                  <option>
                    Prefer not to say
                  </option>

                </select>

              </div>

              <div>

                <label className="mb-2 block font-semibold">
                  Date of Birth
                </label>

                <input
                  type="date"
                  value={form.date_of_birth}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date_of_birth: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
                />

              </div>

              <div className="flex flex-col gap-4 pt-2 sm:flex-row">

                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-gray-200 py-4 font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex-1 rounded-xl bg-pink-600 py-4 font-bold text-white transition hover:bg-pink-700"
                >
                  Save Changes
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