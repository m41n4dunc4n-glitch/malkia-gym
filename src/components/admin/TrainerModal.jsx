import { useState } from "react";
import {
  addTrainer,
  updateTrainer,
} from "../../services/trainers";
import { uploadTrainerImage } from "../../services/trainerImages";

function getInitialFormState(trainer) {
  return {
    name: trainer?.name || "",
    specialty: trainer?.specialty || "",
    experience: trainer?.experience || 0,
    phone: trainer?.phone || "",
    email: trainer?.email || "",
    bio: trainer?.bio || "",
    availability: trainer?.availability || "Available",
    image_url: trainer?.image_url || "",
  };
}

function TrainerModal({
  trainer,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(() =>
    getInitialFormState(trainer)
  );

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(
    trainer?.image_url || ""
  );

  const [saving, setSaving] = useState(false);

  function update(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleImageChange(e) {
    const selected = e.target.files?.[0];

    if (!selected) return;

    setImageFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleSave() {
    if (saving) return;

    setSaving(true);

    try {
      let trainerData = {
        ...form,
        experience: Number(form.experience) || 0,
      };

      if (imageFile) {
        const upload = await uploadTrainerImage(imageFile);

        if (upload.error) {
          alert(upload.error.message);
          setSaving(false);
          return;
        }

        trainerData.image_url = upload.data;
      }

      let result;

      if (trainer) {
        result = await updateTrainer(
          trainer.id,
          trainerData
        );
      } else {
        result = await addTrainer(
          trainerData
        );
      }

      if (result.error) {
        alert(result.error.message);
        setSaving(false);
        return;
      }

      alert(
        trainer
          ? "Trainer updated successfully!"
          : "Trainer added successfully!"
      );

      onSaved();

    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">

          <div>

            <h2 className="text-2xl font-bold sm:text-3xl">
              {trainer
                ? "Edit Trainer"
                : "Add Trainer"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {trainer
                ? "Update trainer information."
                : "Create a new trainer profile."}
            </p>

          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-full bg-gray-100 px-4 py-2 text-2xl hover:bg-gray-200"
          >
            ×
          </button>

        </div>

        <div className="space-y-6 p-6">

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-semibold">
                Trainer Name
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  update("name", e.target.value)
                }
                className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold">
                Specialty
              </label>

              <input
                value={form.specialty}
                onChange={(e) =>
                  update("specialty", e.target.value)
                }
                className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold">
                Experience
              </label>

              <input
                type="number"
                value={form.experience}
                onChange={(e) =>
                  update("experience", e.target.value)
                }
                className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold">
                Availability
              </label>

              <select
                value={form.availability}
                onChange={(e) =>
                  update("availability", e.target.value)
                }
                className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
              >
                <option>Available</option>
                <option>Busy</option>
                <option>On Leave</option>
              </select>

            </div>

            <div>

              <label className="mb-2 block font-semibold">
                Phone
              </label>

              <input
                value={form.phone}
                onChange={(e) =>
                  update("phone", e.target.value)
                }
                className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  update("email", e.target.value)
                }
                className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
              />

            </div>

          </div>

          <div>

            <label className="mb-3 block font-semibold">
              Trainer Photo
            </label>

            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="mb-4 h-56 w-full rounded-2xl border object-cover sm:h-72"
              />
            ) : (
              <div className="mb-4 flex h-56 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 sm:h-72">
                No Image Selected
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={saving}
              className="w-full rounded-xl border p-4"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Biography
            </label>

            <textarea
              rows={5}
              value={form.bio}
              onChange={(e) =>
                update("bio", e.target.value)
              }
              className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
            />

          </div>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row">

            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl bg-gray-200 py-4 font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-xl bg-pink-600 py-4 font-bold text-white hover:bg-pink-700"
            >
              {saving
                ? "Saving..."
                : trainer
                ? "Update Trainer"
                : "Save Trainer"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default TrainerModal;