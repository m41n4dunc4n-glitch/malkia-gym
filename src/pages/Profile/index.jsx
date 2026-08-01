import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getProfile, updateProfile } from "../../services/profile";

function Profile() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    membership_name: "",
  });

  useEffect(() => {
    if (!user) return;

    async function loadProfile() {
      const { data } = await getProfile(user.id);

      if (data) {
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          gender: data.gender || "",
          date_of_birth: data.date_of_birth || "",
          membership_name: data.membership_name || "",
        });
      }

      setLoading(false);
    }

    loadProfile();
  }, [user]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await updateProfile(user.id, formData);

    if (!error) {
      alert("Profile updated successfully!");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-lg font-semibold">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-5 shadow md:p-8 lg:p-10">

      <h1 className="mb-8 text-3xl font-bold md:text-4xl">
        My Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 md:grid-cols-2"
      >

        <div className="md:col-span-2">
          <label className="mb-2 block font-semibold">
            Full Name
          </label>

          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Email
          </label>

          <input
            value={user?.email || ""}
            disabled
            className="w-full rounded-xl border bg-gray-100 p-4"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Phone
          </label>

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Gender
          </label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          >
            <option value="">Select Gender</option>
            <option>Female</option>
            <option>Male</option>
            <option>Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Date of Birth
          </label>

          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-semibold">
            Membership Plan
          </label>

          <input
            value={formData.membership_name || "No Membership"}
            disabled
            className="w-full rounded-xl border bg-gray-100 p-4"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full rounded-xl bg-pink-600 py-4 text-lg font-bold text-white transition hover:bg-pink-700"
          >
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
}

export default Profile;