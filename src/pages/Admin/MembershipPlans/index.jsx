import { useEffect, useMemo, useState } from "react";
import PlanModal from "../../../components/admin/PlanModal";

import {
  getPlans,
  deletePlan,
} from "../../../services/membershipPlans";

function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    const { data } = await getPlans();
    setPlans(data || []);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete plan?")) return;

    await deletePlan(id);

    loadPlans();
  }

  const filtered = useMemo(() => {
    return plans.filter((plan) =>
      plan.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [plans, search]);

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-3xl font-bold md:text-4xl">
            Membership Plans
          </h1>

          <p className="mt-2 text-gray-500">
            Create, edit and manage membership packages.
          </p>

        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          <input
            placeholder="Search plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500"
          />

          <button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700"
          >
            + Add Plan
          </button>

        </div>

      </div>

      {/* Empty State */}

      {filtered.length === 0 && (

        <div className="rounded-3xl bg-white p-12 text-center shadow">

          <h2 className="text-2xl font-bold">
            No Membership Plans
          </h2>

          <p className="mt-2 text-gray-500">
            Create your first membership plan.
          </p>

        </div>

      )}

      {/* Plans */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

        {filtered.map((plan) => (

          <div
            key={plan.id}
            className="rounded-3xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-2xl font-bold">
                  {plan.name}
                </h2>

                <p className="mt-2 text-3xl font-extrabold text-pink-600">
                  KSh {Number(plan.price).toLocaleString()}
                </p>

              </div>

            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">

              <p className="text-sm text-gray-500">
                Duration
              </p>

              <p className="mt-1 text-lg font-semibold">
                {plan.duration} Days
              </p>

            </div>

            <div className="mt-5">

              <p className="font-semibold">
                Description
              </p>

              <p className="mt-2 min-h-17.5 text-gray-600">
                {plan.description || "No description provided."}
              </p>

            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={() => {
                  setSelected(plan);
                  setOpen(true);
                }}
                className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(plan.id)}
                className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      {open && (
        <PlanModal
          plan={selected}
          onClose={() => setOpen(false)}
          onSaved={() => {
            loadPlans();
            setOpen(false);
          }}
        />
      )}

    </div>
  );
}

export default MembershipPlans;