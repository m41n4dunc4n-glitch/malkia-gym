// PlanModal.jsx
import { useState } from "react";
import {
  addPlan,
  updatePlan,
} from "../../services/membershipPlans";

function PlanModal({
  plan,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({
    name: plan?.name || "",
    price: plan?.price || "",
    duration: plan?.duration || "",
    description: plan?.description || "",
  });

  function update(key, value) {
    setForm({
      ...form,
      [key]: value,
    });
  }

  async function handleSave() {
    let result;

    if (plan) {
      result = await updatePlan(plan.id, form);
    } else {
      result = await addPlan(form);
    }

    if (result.error) {
      alert(result.error.message);
      return;
    }

    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">

          <div>

            <h2 className="text-2xl font-bold sm:text-3xl">
              {plan ? "Edit Membership Plan" : "Add Membership Plan"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {plan
                ? "Update the selected membership plan."
                : "Create a new membership plan."}
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 px-4 py-2 text-2xl transition hover:bg-gray-200"
          >
            ×
          </button>

        </div>

        <div className="space-y-6 p-6">

          <div>

            <label className="mb-2 block font-semibold">
              Plan Name
            </label>

            <input
              value={form.name}
              onChange={(e)=>update("name",e.target.value)}
              placeholder="Premium Plan"
              className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
            />

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-semibold">
                Price (KSh)
              </label>

              <input
                type="number"
                value={form.price}
                onChange={(e)=>update("price",e.target.value)}
                className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
              />

            </div>

            <div>

              <label className="mb-2 block font-semibold">
                Duration (Days)
              </label>

              <input
                type="number"
                value={form.duration}
                onChange={(e)=>update("duration",e.target.value)}
                className="w-full rounded-xl border p-4 focus:border-pink-500 focus:outline-none"
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Description
            </label>

            <textarea
              rows={5}
              value={form.description}
              onChange={(e)=>update("description",e.target.value)}
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
              Save Plan
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default PlanModal;