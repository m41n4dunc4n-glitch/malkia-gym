import { useEffect, useMemo, useState } from "react";

import {
  getTrainers,
  deleteTrainer,
} from "../../../services/trainers";

import TrainerModal from "../../../components/admin/TrainerModal";

function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainers();
  }, []);

  async function loadTrainers() {
    setLoading(true);

    const { data, error } = await getTrainers();

    if (error) {
      console.error("Failed to load trainers:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    console.log("Trainers loaded:", data);

    setTrainers(data || []);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this trainer?")) {
      return;
    }

    const { error } = await deleteTrainer(id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadTrainers();
  }

  const filtered = useMemo(() => {
    return trainers.filter((trainer) =>
      (trainer.name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [trainers, search]);

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Trainer Management
          </h1>

          <p className="mt-2 text-gray-500">
            Manage trainers, profiles and trainer photos.
          </p>

        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">

          <input
            type="text"
            placeholder="Search trainer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500 sm:w-72"
          />

          <button
            type="button"
            onClick={() => {
              setSelectedTrainer(null);
              setOpen(true);
            }}
            className="w-full rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700 sm:w-auto"
          >
            + Add Trainer
          </button>

        </div>

      </div>

      {/* Loading */}

      {loading && (
        <div className="rounded-3xl bg-white p-8 text-center shadow sm:p-12">
          <p className="text-lg font-semibold">
            Loading trainers...
          </p>
        </div>
      )}
            {/* Empty */}

      {!loading && filtered.length === 0 && (
        <div className="rounded-3xl bg-white p-8 text-center shadow sm:p-12">

          <h2 className="text-2xl font-bold">
            No trainers found
          </h2>

          <p className="mt-2 text-gray-500">
            Add a trainer or change your search.
          </p>

        </div>
      )}

      {/* Trainers */}

      {!loading && filtered.length > 0 && (

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

          {filtered.map((trainer) => (

            <div
              key={trainer.id}
              className="overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              {/* Image */}

              <div className="bg-gray-100">

                <img
                  src={
                    trainer.image_url ||
                    "https://placehold.co/600x600?text=Trainer"
                  }
                  alt={trainer.name || "Trainer"}
                  className="h-60 w-full object-cover sm:h-72"
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://placehold.co/600x600?text=Trainer";
                  }}
                />

              </div>

              {/* Details */}

              <div className="p-5 sm:p-6">

                <h2 className="text-xl font-bold sm:text-2xl">
                  {trainer.name}
                </h2>

                <p className="mt-2 font-medium text-pink-600">
                  {trainer.specialty || "Fitness Trainer"}
                </p>

                <p className="mt-3 text-gray-600">
                  {trainer.experience || 0} Years Experience
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {trainer.availability || "Available"}
                </p>

                <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">

                  {trainer.image_url
                    ? "✓ Trainer photo saved"
                    : "No trainer photo saved"}

                </div>

                {/* Buttons */}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTrainer(trainer);
                      setOpen(true);
                    }}
                    className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(trainer.id)
                    }
                    className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}
            {/* Modal */}

      {open && (
        <TrainerModal
          trainer={selectedTrainer}
          onClose={() => {
            setOpen(false);
            setSelectedTrainer(null);
          }}
          onSaved={async () => {
            await loadTrainers();

            setOpen(false);
            setSelectedTrainer(null);
          }}
        />
      )}

    </div>
  );
}

export default Trainers;