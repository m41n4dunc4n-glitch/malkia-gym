import { useEffect, useMemo, useState } from "react";
import {
  FaCrown,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaClock,
  FaMoneyBillWave,
  FaLayerGroup,
} from "react-icons/fa";

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
    if (!window.confirm("Delete this membership plan?")) return;

    await deletePlan(id);

    loadPlans();
  }

  const filtered = useMemo(() => {
    return plans.filter((plan) =>
      plan.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [plans, search]);

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-black via-zinc-900 to-pink-700 p-7 text-white shadow-xl md:p-10">

        {/* Decorative glow */}

        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-pink-500/20 blur-3xl" />

        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-pink-600/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-600 shadow-lg shadow-pink-600/30">

              <FaCrown className="text-2xl text-white" />

            </div>

            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">

              Membership Plans

            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300 md:text-base">

              Create, edit and manage the membership packages
              available to Malkia Fitness members.

            </p>

          </div>

          {/* Add Plan */}

          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="flex items-center justify-center gap-3 rounded-2xl bg-pink-600 px-6 py-4 font-bold text-white shadow-lg shadow-pink-600/20 transition duration-300 hover:bg-pink-500 hover:shadow-pink-500/30"
          >

            <FaPlus />

            Add Membership Plan

          </button>

        </div>

      </div>


      {/* =====================================================
          SEARCH + SUMMARY
      ===================================================== */}

      <div className="grid gap-5 lg:grid-cols-[1fr_auto]">

        {/* Search */}

        <div className="rounded-3xl bg-white p-5 shadow-lg">

          <label className="mb-3 block text-sm font-bold uppercase tracking-wide text-gray-400">

            Search Plans

          </label>

          <div className="relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search membership plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-11 pr-4 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
            />

          </div>

        </div>


        {/* Total Plans */}

        <div className="flex items-center gap-4 rounded-3xl bg-black p-5 text-white shadow-lg">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-600">

            <FaLayerGroup className="text-xl" />

          </div>

          <div>

            <p className="text-sm text-gray-400">
              Total Plans
            </p>

            <p className="text-3xl font-extrabold">
              {plans.length}
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {filtered.length === 0 && (

        <div className="rounded-3xl bg-white p-12 text-center shadow-lg">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">

            <FaLayerGroup className="text-3xl text-pink-600" />

          </div>

          <h2 className="mt-6 text-2xl font-bold text-gray-900">

            No Membership Plans

          </h2>

          <p className="mx-auto mt-2 max-w-md text-gray-500">

            {search
              ? "No membership plans match your search."
              : "Create your first membership plan to get started."
            }

          </p>

          {!search && (

            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setOpen(true);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700"
            >

              <FaPlus />

              Add Plan

            </button>

          )}

        </div>

      )}


      {/* =====================================================
          PLANS
      ===================================================== */}

      {filtered.length > 0 && (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filtered.map((plan) => (

            <div
              key={plan.id}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >

              {/* Top gradient */}

              <div className="h-2 bg-linear-to-r from-black via-pink-600 to-pink-400" />


              <div className="p-6 md:p-7">

                {/* Plan Header */}

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">

                      <FaCrown className="text-xl text-pink-600" />

                    </div>

                    <h2 className="text-2xl font-extrabold text-gray-900">

                      {plan.name}

                    </h2>

                  </div>

                </div>


                {/* Price */}

                <div className="mt-6 rounded-2xl bg-black p-5 text-white">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600">

                      <FaMoneyBillWave />

                    </div>

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">

                        Membership Price

                      </p>

                      <p className="mt-1 text-3xl font-extrabold">

                        KSh{" "}

                        {Number(plan.price).toLocaleString()}

                      </p>

                    </div>

                  </div>

                </div>


                {/* Duration */}

                <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gray-50 p-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100">

                    <FaClock className="text-pink-600" />

                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">

                      Duration

                    </p>

                    <p className="mt-1 font-bold text-gray-900">

                      {plan.duration} Days

                    </p>

                  </div>

                </div>


                {/* Description */}

                <div className="mt-6">

                  <p className="text-sm font-bold uppercase tracking-wide text-gray-400">

                    Description

                  </p>

                  <p className="mt-2 min-h-20 text-sm leading-6 text-gray-600">

                    {plan.description ||
                      "No description provided."
                    }

                  </p>

                </div>


                {/* Actions */}

                <div className="mt-7 grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => {
                      setSelected(plan);
                      setOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-zinc-800"
                  >

                    <FaEdit />

                    Edit

                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(plan.id)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                  >

                    <FaTrash />

                    Delete

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* =====================================================
          MODAL
      ===================================================== */}

      {open && (

        <PlanModal
          plan={selected}
          onClose={() => {
            setOpen(false);
            setSelected(null);
          }}
          onSaved={() => {
            loadPlans();
            setOpen(false);
            setSelected(null);
          }}
        />

      )}

    </div>
  );
}

export default MembershipPlans;