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

      {/* =========================
          HEADER
      ========================== */}

      <div className="overflow-hidden rounded-3xl bg-linear-to-r from-black via-zinc-900 to-pink-600 p-6 text-white shadow-xl md:p-8">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-3 inline-flex items-center rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-pink-300">
              Admin Panel
            </div>

            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Trainer Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-300 md:text-base">
              Manage trainers, profiles, availability and trainer photos.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl shadow-lg backdrop-blur-sm">
            🏋️
          </div>

        </div>

      </div>

      {/* =========================
          SEARCH + ADD
      ========================== */}

      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg md:p-6">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              All Trainers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {trainers.length} trainer
              {trainers.length !== 1 ? "s" : ""} registered
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

            <div className="relative w-full sm:w-72">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search trainer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
              />

            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedTrainer(null);
                setOpen(true);
              }}
              className="rounded-xl bg-linear-to-r from-black to-pink-600 px-6 py-3 font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg"
            >
              + Add Trainer
            </button>

          </div>

        </div>

      </div>

      {/* =========================
          LOADING
      ========================== */}

      {loading && (
        <div className="rounded-3xl bg-white p-12 text-center shadow-lg">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50">

            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />

          </div>

          <p className="mt-5 text-lg font-bold text-gray-900">
            Loading trainers...
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Please wait while we fetch the trainer list.
          </p>

        </div>
      )}

      {/* =========================
          EMPTY STATE
      ========================== */}

      {!loading && filtered.length === 0 && (
        <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-lg">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-black to-pink-600 text-3xl shadow-lg">
            🏋️
          </div>

          <h2 className="mt-6 text-2xl font-black text-gray-900">
            {search ? "No Trainers Found" : "No Trainers Yet"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-gray-500">
            {search
              ? "Try searching with a different trainer name."
              : "Add your first trainer to start managing your gym's training team."}
          </p>

          {!search && (
            <button
              type="button"
              onClick={() => {
                setSelectedTrainer(null);
                setOpen(true);
              }}
              className="mt-6 rounded-xl bg-pink-600 px-6 py-3 font-bold text-white transition hover:bg-pink-700"
            >
              + Add Trainer
            </button>
          )}

        </div>
      )}

      {/* =========================
          TRAINERS GRID
      ========================== */}

      {!loading && filtered.length > 0 && (

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

          {filtered.map((trainer) => (

            <div
              key={trainer.id}
              className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >

              {/* IMAGE */}

              <div className="relative overflow-hidden bg-gray-100">

                <img
                  src={
                    trainer.image_url ||
                    "https://placehold.co/600x600?text=Trainer"
                  }
                  alt={trainer.name || "Trainer"}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://placehold.co/600x600?text=Trainer";
                  }}
                />

                {/* Image overlay */}

                <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/70 to-transparent" />

                {/* Specialty */}

                <div className="absolute bottom-4 left-4 rounded-full bg-pink-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                  {trainer.specialty || "Fitness Trainer"}
                </div>

              </div>

              {/* DETAILS */}

              <div className="p-5 md:p-6">

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
                      {trainer.name}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-pink-600">
                      {trainer.specialty || "Fitness Trainer"}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-lg">
                    💪
                  </div>

                </div>

                {/* Stats */}

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl bg-gray-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Experience
                    </p>

                    <p className="mt-1 text-lg font-black text-gray-900">
                      {trainer.experience || 0}
                      <span className="ml-1 text-sm font-semibold text-gray-500">
                        Years
                      </span>
                    </p>

                  </div>

                  <div className="rounded-2xl bg-pink-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-pink-500">
                      Capacity
                    </p>

                    <p className="mt-1 text-lg font-black text-pink-700">
                      {trainer.capacity_per_slot || 0}
                      <span className="ml-1 text-sm font-semibold">
                        Members
                      </span>
                    </p>

                  </div>

                </div>

                {/* Availability */}

                <div className="mt-4 rounded-2xl border border-gray-100 p-4">

                  <div className="flex items-center justify-between">

                    <p className="text-sm font-bold text-gray-800">
                      Availability
                    </p>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      Available
                    </span>

                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    🕒 {trainer.available_from || "—"} -{" "}
                    {trainer.available_to || "—"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    🍽 Lunch {trainer.lunch_start || "—"} -{" "}
                    {trainer.lunch_end || "—"}
                  </p>

                </div>

                {/* DAYS */}

                <div className="mt-5">

                  <p className="mb-2 text-sm font-bold text-gray-800">
                    Working Days
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {[
                      ["Mon", trainer.monday],
                      ["Tue", trainer.tuesday],
                      ["Wed", trainer.wednesday],
                      ["Thu", trainer.thursday],
                      ["Fri", trainer.friday],
                      ["Sat", trainer.saturday],
                      ["Sun", trainer.sunday],
                    ].map(([day, enabled]) => (

                      <span
                        key={day}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          enabled
                            ? "bg-pink-100 text-pink-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {day}
                      </span>

                    ))}

                  </div>

                </div>

                {/* PHOTO STATUS */}

                <div
                  className={`mt-5 rounded-xl px-4 py-3 text-xs font-semibold ${
                    trainer.image_url
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {trainer.image_url
                    ? "✓ Trainer photo saved"
                    : "○ No trainer photo saved"}
                </div>

                {/* BUTTONS */}

                <div className="mt-6 grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTrainer(trainer);
                      setOpen(true);
                    }}
                    className="rounded-xl bg-black py-3 font-bold text-white transition hover:bg-zinc-800"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(trainer.id)}
                    className="rounded-xl bg-pink-600 py-3 font-bold text-white transition hover:bg-pink-700"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* =========================
          MODAL
      ========================== */}

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