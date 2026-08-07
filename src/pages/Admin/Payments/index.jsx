import { useEffect, useMemo, useState } from "react";

import {
  getAllPayments,
  approvePayment,
  rejectPayment,
} from "../../../services/payments";

import {
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaMobileAlt,
  FaUniversity,
  FaCashRegister,
  FaCheck,
  FaTimes,
  FaSyncAlt,
  FaReceipt,
} from "react-icons/fa";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    setLoading(true);

    const { data, error } = await getAllPayments();

    if (error) {
      console.error("Failed to load payments:", error);
      alert(error.message);
      setPayments([]);
      setLoading(false);
      return;
    }

    setPayments(data || []);
    setLoading(false);
  }

  async function handleApprove(payment) {
    const confirmed = window.confirm(
      `Approve payment for ${
        payment.profiles?.full_name || "this member"
      }?`
    );

    if (!confirmed) return;

    const { error } = await approvePayment(payment);

    if (error) {
      console.error("Approval error:", error);
      alert(`Failed to approve payment:\n\n${error.message}`);
      return;
    }

    alert("Payment approved successfully.");

    await loadPayments();
  }

  async function handleReject(payment) {
    const confirmed = window.confirm(
      `Reject payment for ${
        payment.profiles?.full_name || "this member"
      }?`
    );

    if (!confirmed) return;

    const { error } = await rejectPayment(payment.id);

    if (error) {
      console.error("Rejection error:", error);
      alert(`Failed to reject payment:\n\n${error.message}`);
      return;
    }

    alert("Payment rejected successfully.");

    await loadPayments();
  }

  const pendingCount = payments.filter(
    (payment) => payment.status === "Pending"
  ).length;

  const approvedCount = payments.filter(
    (payment) => payment.status === "Approved"
  ).length;

  const rejectedCount = payments.filter(
    (payment) => payment.status === "Rejected"
  ).length;

  const totalAmount = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  const filteredPayments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return payments.filter((payment) => {
      const matchesSearch =
        payment.profiles?.full_name
          ?.toLowerCase()
          .includes(query) ||
        payment.profiles?.email
          ?.toLowerCase()
          .includes(query) ||
        payment.membership_plans?.name
          ?.toLowerCase()
          .includes(query) ||
        payment.reference
          ?.toLowerCase()
          .includes(query) ||
        payment.mpesa_code
          ?.toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "All" || payment.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [payments, search, filter]);

  function getMethodIcon(method) {
    const value = String(method || "").toLowerCase();

    if (value.includes("mpesa")) {
      return <FaMobileAlt />;
    }

    if (value.includes("bank")) {
      return <FaUniversity />;
    }

    if (value.includes("cash")) {
      return <FaCashRegister />;
    }

    return <FaMoneyBillWave />;
  }

  function getMethodStyle(method) {
    const value = String(method || "").toLowerCase();

    if (value.includes("mpesa")) {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (value.includes("bank")) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (value.includes("cash")) {
      return "bg-orange-50 text-orange-700 border-orange-200";
    }

    return "bg-gray-50 text-gray-700 border-gray-200";
  }

  function getStatusStyle(status) {
    if (status === "Approved") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (status === "Rejected") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }

  function getStatusIcon(status) {
    if (status === "Approved") {
      return <FaCheckCircle />;
    }

    if (status === "Rejected") {
      return <FaTimesCircle />;
    }

    return <FaClock />;
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-9 w-64 animate-pulse rounded-xl bg-gray-200" />
          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded-lg bg-gray-100" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-3xl bg-white shadow"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-3xl bg-white shadow" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div>
          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-2xl text-pink-600">
              <FaMoneyBillWave />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Payment Management
              </h1>

              <p className="mt-1 text-gray-500">
                Review and verify member payment submissions.
              </p>
            </div>

          </div>
        </div>

        <button
          type="button"
          onClick={loadPayments}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-black px-6 py-3.5 font-semibold text-white transition hover:bg-zinc-800 sm:w-auto"
        >
          <FaSyncAlt />
          Refresh Payments
        </button>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Total Payments
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-gray-900">
                {payments.length}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-xl text-pink-600">
              <FaMoneyBillWave />
            </div>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            KSh {totalAmount.toLocaleString()} submitted
          </p>

        </div>


        {/* Pending */}

        <div className="rounded-3xl border border-yellow-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Pending
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-yellow-600">
                {pendingCount}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-xl text-yellow-600">
              <FaClock />
            </div>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            Awaiting admin verification
          </p>

        </div>


        {/* Approved */}

        <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Approved
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-green-600">
                {approvedCount}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl text-green-600">
              <FaCheckCircle />
            </div>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            Successfully verified
          </p>

        </div>


        {/* Rejected */}

        <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Rejected
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-red-600">
                {rejectedCount}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-xl text-red-600">
              <FaTimesCircle />
            </div>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            Declined payment submissions
          </p>

        </div>

      </div>


      {/* =====================================================
          PAYMENT SECTION
      ====================================================== */}

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg">

        {/* Section Header */}

        <div className="border-b border-gray-100 p-6 md:p-8">

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

            <div>
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                  <FaReceipt />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                    Payment Transactions
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Review member payment submissions before approval.
                  </p>
                </div>

              </div>
            </div>

            {/* Search */}

            <div className="flex w-full flex-col gap-3 md:flex-row xl:w-auto">

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search member, plan or reference..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-pink-500 focus:bg-white md:w-80"
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-medium outline-none transition focus:border-pink-500"
              >
                <option value="All">All Payments</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

            </div>

          </div>

        </div>


        {/* Results Bar */}

        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4 md:px-8">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-900">
              {filteredPayments.length}
            </span>{" "}
            payment
            {filteredPayments.length === 1 ? "" : "s"}
          </p>

          {filter !== "All" && (
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                filter
              )}`}
            >
              {filter}
            </span>
          )}

        </div>


        {/* =================================================
            DESKTOP TABLE
        ================================================== */}

        <div className="hidden overflow-x-auto lg:block">

          <table className="w-full">

            <thead className="bg-black text-white">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Member
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Plan
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Method
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Reference
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPayments.map((payment) => (

                <tr
                  key={payment.id}
                  className="border-b border-gray-100 transition hover:bg-pink-50/30"
                >

                  {/* Member */}

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-100 font-bold text-pink-600">
                        {payment.profiles?.full_name
                          ?.charAt(0)
                          ?.toUpperCase() || <FaUser />}
                      </div>

                      <div className="min-w-0">

                        <p className="font-bold text-gray-900">
                          {payment.profiles?.full_name ||
                            "Unknown Member"}
                        </p>

                        <p className="max-w-48 truncate text-sm text-gray-500">
                          {payment.profiles?.email ||
                            "No email"}
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* Plan */}

                  <td className="px-6 py-5">

                    <span className="font-semibold text-gray-900">
                      {payment.membership_plans?.name ||
                        "Membership"}
                    </span>

                  </td>


                  {/* Amount */}

                  <td className="px-6 py-5">

                    <span className="font-extrabold text-gray-900">
                      KSh{" "}
                      {Number(
                        payment.amount || 0
                      ).toLocaleString()}
                    </span>

                  </td>


                  {/* Method */}

                  <td className="px-6 py-5">

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold ${getMethodStyle(
                        payment.payment_method
                      )}`}
                    >
                      {getMethodIcon(
                        payment.payment_method
                      )}

                      {payment.payment_method ||
                        "Unknown"}
                    </span>

                  </td>


                  {/* Reference */}

                  <td className="px-6 py-5">

                    <span className="block max-w-36 break-all rounded-lg bg-gray-50 px-3 py-2 font-mono text-xs font-bold text-gray-600">
                      {payment.mpesa_code ||
                        payment.reference ||
                        "—"}
                    </span>

                  </td>


                  {/* Date */}

                  <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500">
                    {formatDate(payment.created_at)}
                  </td>


                  {/* Status */}

                  <td className="px-6 py-5">

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold ${getStatusStyle(
                        payment.status
                      )}`}
                    >
                      {getStatusIcon(payment.status)}

                      {payment.status}
                    </span>

                  </td>


                  {/* Actions */}

                  <td className="px-6 py-5">

                    {payment.status === "Pending" ? (

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleApprove(payment)
                          }
                          className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
                        >
                          <FaCheck />
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleReject(payment)
                          }
                          className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                        >
                          <FaTimes />
                          Reject
                        </button>

                      </div>

                    ) : (

                      <span className="text-sm font-medium text-gray-400">
                        Completed
                      </span>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* =================================================
            MOBILE / TABLET
        ================================================== */}

        <div className="space-y-5 p-5 lg:hidden">

          {filteredPayments.map((payment) => (

            <div
              key={payment.id}
              className="rounded-3xl border border-gray-100 bg-gray-50 p-5 shadow-sm"
            >

              {/* Member Header */}

              <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 font-bold text-pink-600">
                    {payment.profiles?.full_name
                      ?.charAt(0)
                      ?.toUpperCase() || <FaUser />}
                  </div>

                  <div className="min-w-0">

                    <h3 className="truncate font-bold text-gray-900">
                      {payment.profiles?.full_name ||
                        "Unknown Member"}
                    </h3>

                    <p className="truncate text-sm text-gray-500">
                      {payment.profiles?.email ||
                        "No email"}
                    </p>

                  </div>

                </div>

                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                    payment.status
                  )}`}
                >
                  {getStatusIcon(payment.status)}
                  {payment.status}
                </span>

              </div>


              {/* Payment Details */}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                <div className="rounded-2xl bg-white p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Membership
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    {payment.membership_plans?.name ||
                      "Membership"}
                  </p>

                </div>


                <div className="rounded-2xl bg-white p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Amount
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-pink-600">
                    KSh{" "}
                    {Number(
                      payment.amount || 0
                    ).toLocaleString()}
                  </p>

                </div>


                <div className="rounded-2xl bg-white p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Payment Method
                  </p>

                  <span
                    className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${getMethodStyle(
                      payment.payment_method
                    )}`}
                  >
                    {getMethodIcon(
                      payment.payment_method
                    )}

                    {payment.payment_method ||
                      "Unknown"}
                  </span>

                </div>


                <div className="rounded-2xl bg-white p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Reference
                  </p>

                  <p className="mt-2 break-all font-mono text-sm font-bold text-gray-700">
                    {payment.mpesa_code ||
                      payment.reference ||
                      "—"}
                  </p>

                </div>


                <div className="rounded-2xl bg-white p-4 sm:col-span-2">

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Submitted
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {formatDate(payment.created_at)}
                  </p>

                </div>

              </div>


              {/* Actions */}

              {payment.status === "Pending" && (

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      handleApprove(payment)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-bold text-white transition hover:bg-green-700"
                  >
                    <FaCheck />
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleReject(payment)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-700"
                  >
                    <FaTimes />
                    Reject
                  </button>

                </div>

              )}

            </div>

          ))}

        </div>


        {/* =================================================
            EMPTY / NO SEARCH RESULTS
        ================================================== */}

        {filteredPayments.length === 0 && (

          <div className="p-12 text-center md:p-16">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl text-gray-400">
              <FaMoneyBillWave />
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              {payments.length === 0
                ? "No payments yet"
                : "No payments found"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              {payments.length === 0
                ? "Member payment submissions will appear here."
                : "Try changing your search or payment status filter."}
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default Payments;