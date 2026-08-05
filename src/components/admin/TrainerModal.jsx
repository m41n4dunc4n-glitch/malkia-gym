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
    image_url: trainer?.image_url || "",

    morning_start: trainer?.morning_start || "08:00",
    morning_end: trainer?.morning_end || "12:00",

    lunch_start: trainer?.lunch_start || "12:00",
    lunch_end: trainer?.lunch_end || "14:00",

    evening_start: trainer?.evening_start || "14:00",
    evening_end: trainer?.evening_end || "20:00",

    max_clients: trainer?.max_clients || 5,

    monday: trainer?.monday ?? true,
    tuesday: trainer?.tuesday ?? true,
    wednesday: trainer?.wednesday ?? true,
    thursday: trainer?.thursday ?? true,
    friday: trainer?.friday ?? true,
    saturday: trainer?.saturday ?? true,
    sunday: trainer?.sunday ?? false,
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
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (saving) return;

    setSaving(true);

    try {
      const trainerData = {
        ...form,
        experience: Number(form.experience) || 0,
        max_clients: Number(form.max_clients) || 5,
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

      const result = trainer
        ? await updateTrainer(
            trainer.id,
            trainerData
          )
        : await addTrainer(
            trainerData
          );

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

      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">

          <div>
            <h2 className="text-3xl font-bold">
              {trainer ? "Edit Trainer" : "Add Trainer"}
            </h2>

            <p className="mt-1 text-gray-500">
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

        <div className="space-y-8 p-6">

          {/* BASIC DETAILS */}

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-semibold">
                Trainer Name
              </label>

              <input
                value={form.name}
                onChange={(e)=>update("name",e.target.value)}
                className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Specialty
              </label>

              <input
                value={form.specialty}
                onChange={(e)=>update("specialty",e.target.value)}
                className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Experience (Years)
              </label>

              <input
                type="number"
                value={form.experience}
                onChange={(e)=>update("experience",e.target.value)}
                className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Maximum Members Per Slot
              </label>

              <input
                type="number"
                value={form.max_clients}
                onChange={(e)=>update("max_clients",e.target.value)}
                className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Phone
              </label>

              <input
                value={form.phone}
                onChange={(e)=>update("phone",e.target.value)}
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
                onChange={(e)=>update("email",e.target.value)}
                className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
              />
            </div>

          </div>

          {/* WORKING HOURS */}

          <div className="rounded-2xl border p-6">

            <h3 className="mb-6 text-2xl font-bold">
              Trainer Working Schedule
            </h3>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label className="font-semibold">
                  Morning Starts
                </label>

                <input
                  type="time"
                  value={form.morning_start}
                  onChange={(e)=>update("morning_start",e.target.value)}
                  className="mt-2 w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="font-semibold">
                  Morning Ends
                </label>

                <input
                  type="time"
                  value={form.morning_end}
                  onChange={(e)=>update("morning_end",e.target.value)}
                  className="mt-2 w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="font-semibold">
                  Lunch Starts
                </label>

                <input
                  type="time"
                  value={form.lunch_start}
                  onChange={(e)=>update("lunch_start",e.target.value)}
                  className="mt-2 w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="font-semibold">
                  Lunch Ends
                </label>

                <input
                  type="time"
                  value={form.lunch_end}
                  onChange={(e)=>update("lunch_end",e.target.value)}
                  className="mt-2 w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="font-semibold">
                  Evening Starts
                </label>

                <input
                  type="time"
                  value={form.evening_start}
                  onChange={(e)=>update("evening_start",e.target.value)}
                  className="mt-2 w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="font-semibold">
                  Evening Ends
                </label>

                <input
                  type="time"
                  value={form.evening_end}
                  onChange={(e)=>update("evening_end",e.target.value)}
                  className="mt-2 w-full rounded-xl border p-3"
                />
              </div>

            </div>

          </div>

                    {/* WORKING DAYS */}

          <div className="rounded-2xl border p-6">

            <h3 className="mb-6 text-2xl font-bold">
              Working Days
            </h3>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

              {[
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ].map((day) => (

                <label
                  key={day}
                  className="flex items-center gap-3 rounded-xl border p-3 hover:bg-gray-50"
                >

                  <input
                    type="checkbox"
                    checked={form[day]}
                    onChange={(e) =>
                      update(day, e.target.checked)
                    }
                    className="h-5 w-5 accent-pink-600"
                  />

                  <span className="capitalize font-medium">
                    {day}
                  </span>

                </label>

              ))}

            </div>

          </div>

          {/* PHOTO */}

          <div>

            <label className="mb-3 block text-xl font-bold">
              Trainer Photo
            </label>

            {preview ? (

              <img
                src={preview}
                alt="Preview"
                className="mb-4 h-72 w-full rounded-2xl border object-cover"
              />

            ) : (

              <div className="mb-4 flex h-72 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">

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

          {/* BIO */}

          <div>

            <label className="mb-2 block text-xl font-bold">
              Biography
            </label>

            <textarea
              rows={6}
              value={form.bio}
              onChange={(e)=>update("bio",e.target.value)}
              className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
            />

          </div>

          {/* BUTTONS */}

          <div className="flex flex-col gap-4 pt-4 sm:flex-row">

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