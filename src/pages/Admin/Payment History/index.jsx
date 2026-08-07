import { useEffect, useMemo, useState } from "react";

import {
  FaDownload,
  FaTrash,
  FaSearch,
  FaHistory,
} from "react-icons/fa";

import {
  getPaymentHistory,
  deletePaymentHistory,
} from "../../../services/paymentHistory";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [loading, setLoading] = useState(true);

  /* =====================================================
     LOAD HISTORY
  ===================================================== */

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  async function loadPaymentHistory() {
    setLoading(true);

    const {
      data,
      error,
    } = await getPaymentHistory();

    if (error) {
      console.error(
        "Failed to load payment history:",
        error
      );

      alert(error.message);

      setPayments([]);
      setLoading(false);

      return;
    }

    setPayments(data || []);
    setLoading(false);
  }

  /* =====================================================
     DELETE
  ===================================================== */

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Delete this payment from history?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    const {
      error,
    } = await deletePaymentHistory(id);

    if (error) {
      alert(error.message);
      return;
    }

    setPayments((previous) =>
      previous.filter(
        (payment) => payment.id !== id
      )
    );
  }

  /* =====================================================
     DOWNLOAD
  ===================================================== */

  function handleDownload(payment) {
    const memberName =
      payment.member_name ||
      "Unknown Member";

    const memberEmail =
      payment.member_email ||
      "-";

    const planName =
      payment.plan_name ||
      "Unknown Plan";

    const amount =
      Number(payment.amount || 0)
        .toLocaleString();

    const method =
      payment.payment_method || "-";

    const reference =
      payment.mpesa_code ||
      payment.reference ||
      "-";

    const status =
      payment.status || "-";

    const date = payment.created_at
      ? new Date(
          payment.created_at
        ).toLocaleString("en-KE")
      : "-";

    const receipt = `
MALKIA FITNESS
PAYMENT HISTORY
========================================

Member:
${memberName}

Email:
${memberEmail}

Membership Plan:
${planName}

Amount:
KSh ${amount}

Payment Method:
${method}

Transaction Reference:
${reference}

Status:
${status}

Date:
${date}

========================================
Thank you for choosing Malkia Fitness.
`;

    const blob = new Blob(
      [receipt],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `Malkia-Payment-${payment.id}.txt`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredPayments = useMemo(() => {
    const query =
      search.toLowerCase().trim();

    return payments.filter(
      (payment) => {
        const memberName =
          payment.member_name
            ?.toLowerCase() || "";

        const email =
          payment.member_email
            ?.toLowerCase() || "";

        const plan =
          payment.plan_name
            ?.toLowerCase() || "";

        const mpesaCode =
          payment.mpesa_code
            ?.toLowerCase() || "";

        const reference =
          payment.reference
            ?.toLowerCase() || "";

        const method =
          payment.payment_method
            ?.toLowerCase() || "";

        const matchesSearch =
          memberName.includes(query) ||
          email.includes(query) ||
          plan.includes(query) ||
          mpesaCode.includes(query) ||
          reference.includes(query) ||
          method.includes(query);

        const matchesStatus =
          statusFilter === "All" ||
          payment.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    payments,
    search,
    statusFilter,
  ]);

  /* =====================================================
     SUMMARY
  ===================================================== */

  const approvedCount =
    payments.filter(
      (payment) =>
        payment.status ===
        "Approved"
    ).length;

  const rejectedCount =
    payments.filter(
      (payment) =>
        payment.status ===
        "Rejected"
    ).length;

  const totalAmount =
    payments
      .filter(
        (payment) =>
          payment.status ===
          "Approved"
      )
      .reduce(
        (total, payment) =>
          total +
          Number(
            payment.amount || 0
          ),
        0
      );

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100">

            <FaHistory className="text-2xl text-pink-600" />

          </div>

          <div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Payment History
            </h1>

            <p className="mt-1 text-gray-500">
              View completed payment
              transactions and records.
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={loadPaymentHistory}
          disabled={loading}
          className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Refreshing..."
            : "Refresh History"}
        </button>

      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl bg-white p-6 shadow-lg">

          <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Total Records
          </p>

          <p className="mt-3 text-3xl font-extrabold">
            {payments.length}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Completed history records
          </p>

        </div>

        <div className="rounded-3xl bg-green-50 p-6 shadow-lg">

          <p className="text-sm font-semibold uppercase tracking-wide text-green-600">
            Approved
          </p>

          <p className="mt-3 text-3xl font-extrabold text-green-700">
            {approvedCount}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Successful payments
          </p>

        </div>

        <div className="rounded-3xl bg-red-50 p-6 shadow-lg">

          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Rejected
          </p>

          <p className="mt-3 text-3xl font-extrabold text-red-700">
            {rejectedCount}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Rejected transactions
          </p>

        </div>

        <div className="rounded-3xl bg-black p-6 text-white shadow-lg">

          <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Approved Value
          </p>

          <p className="mt-3 text-3xl font-extrabold text-green-400">
            KSh{" "}
            {totalAmount.toLocaleString()}
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Total approved payments
          </p>

        </div>

      </div>

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="rounded-3xl bg-white p-5 shadow-lg">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-xl">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search member, email, plan, reference..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
            />

          </div>

          <div className="flex flex-wrap gap-2">

            {[
              "All",
              "Approved",
              "Rejected",
            ].map((status) => (

              <button
                key={status}
                type="button"
                onClick={() =>
                  setStatusFilter(
                    status
                  )
                }
                className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  statusFilter ===
                  status
                    ? "bg-pink-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>

            ))}

          </div>

        </div>

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (

        <div className="rounded-3xl bg-white p-12 text-center shadow-lg">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />

          <p className="mt-5 font-semibold text-gray-600">
            Loading payment history...
          </p>

        </div>

      )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        filteredPayments.length ===
          0 && (

          <div className="rounded-3xl bg-white p-12 text-center shadow-lg">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">

              <FaHistory className="text-2xl text-gray-400" />

            </div>

            <h2 className="mt-5 text-2xl font-bold">
              No Payment History
            </h2>

            <p className="mt-2 text-gray-500">
              {payments.length ===
              0
                ? "No completed payment records yet."
                : "No payment records match your current search or filter."}
            </p>

          </div>

        )}

      {/* =================================================
          DESKTOP TABLE
      ================================================= */}

      {!loading &&
        filteredPayments.length >
          0 && (

          <div className="hidden overflow-hidden rounded-3xl bg-white shadow-lg xl:block">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-black text-white">

                  <tr>

                    <th className="p-5 text-left">
                      Member
                    </th>

                    <th className="p-5 text-left">
                      Plan
                    </th>

                    <th className="p-5 text-left">
                      Amount
                    </th>

                    <th className="p-5 text-left">
                      Method
                    </th>

                    <th className="p-5 text-left">
                      Reference
                    </th>

                    <th className="p-5 text-left">
                      Status
                    </th>

                    <th className="p-5 text-left">
                      Date
                    </th>

                    <th className="p-5 text-left">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredPayments.map(
                    (payment) => (

                      <tr
                        key={
                          payment.id
                        }
                        className="border-b border-gray-100 transition hover:bg-gray-50"
                      >

                        {/* MEMBER */}

                        <td className="p-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-600 font-bold text-white">

                              {payment.member_name
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase() ||
                                "?"}

                            </div>

                            <div className="min-w-0">

                              <p className="font-bold">

                                {payment.member_name ||
                                  "Unknown Member"}

                              </p>

                              <p className="max-w-48 truncate text-sm text-gray-500">

                                {payment.member_email ||
                                  "-"}

                              </p>

                            </div>

                          </div>

                        </td>

                        {/* PLAN */}

                        <td className="p-5">

                          <span className="font-semibold">

                            {payment.plan_name ||
                              "Unknown Plan"}

                          </span>

                        </td>

                        {/* AMOUNT */}

                        <td className="p-5">

                          <span className="font-bold">

                            KSh{" "}

                            {Number(
                              payment.amount ||
                                0
                            ).toLocaleString()}

                          </span>

                        </td>

                        {/* METHOD */}

                        <td className="p-5">

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">

                            {payment.payment_method ||
                              "-"}

                          </span>

                        </td>

                        {/* REFERENCE */}

                        <td className="p-5">

                          <div className="text-sm">

                            <p className="font-semibold">

                              {payment.mpesa_code ||
                                payment.reference ||
                                "-"}

                            </p>

                            {payment.mpesa_code &&
                              payment.reference && (

                                <p className="mt-1 text-gray-400">

                                  Ref:{" "}
                                  {
                                    payment.reference
                                  }

                                </p>

                              )}

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="p-5">

                          <span
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                              payment.status ===
                              "Approved"
                                ? "bg-green-100 text-green-700"
                                : payment.status ===
                                  "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >

                            {
                              payment.status
                            }

                          </span>

                        </td>

                        {/* DATE */}

                        <td className="p-5 text-sm text-gray-600">

                          {payment.created_at
                            ? new Date(
                                payment.created_at
                              ).toLocaleDateString(
                                "en-KE"
                              )
                            : "-"}

                        </td>

                        {/* ACTIONS */}

                        <td className="p-5">

                          <div className="flex gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleDownload(
                                  payment
                                )
                              }
                              title="Download"
                              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                            >
                              <FaDownload />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  payment.id
                                )
                              }
                              title="Delete from history"
                              className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 transition hover:bg-red-600 hover:text-white"
                            >
                              <FaTrash />
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      {/* =================================================
          MOBILE / TABLET CARDS
      ================================================= */}

      {!loading &&
        filteredPayments.length >
          0 && (

          <div className="grid gap-5 xl:hidden">

            {filteredPayments.map(
              (payment) => (

                <div
                  key={payment.id}
                  className="rounded-3xl bg-white p-5 shadow-lg"
                >

                  {/* MEMBER */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-600 font-bold text-white">

                        {payment.member_name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "?"}

                      </div>

                      <div className="min-w-0">

                        <h2 className="truncate font-bold">

                          {payment.member_name ||
                            "Unknown Member"}

                        </h2>

                        <p className="truncate text-sm text-gray-500">

                          {payment.member_email ||
                            "-"}

                        </p>

                      </div>

                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        payment.status ===
                        "Approved"
                          ? "bg-green-100 text-green-700"
                          : payment.status ===
                            "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {
                        payment.status
                      }
                    </span>

                  </div>

                  {/* DETAILS */}

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-xs text-gray-400">
                        Plan
                      </p>

                      <p className="mt-1 font-semibold">

                        {payment.plan_name ||
                          "Unknown Plan"}

                      </p>

                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-xs text-gray-400">
                        Amount
                      </p>

                      <p className="mt-1 font-bold">

                        KSh{" "}

                        {Number(
                          payment.amount ||
                            0
                        ).toLocaleString()}

                      </p>

                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-xs text-gray-400">
                        Payment Method
                      </p>

                      <p className="mt-1 font-semibold">

                        {payment.payment_method ||
                          "-"}

                      </p>

                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-xs text-gray-400">
                        Date
                      </p>

                      <p className="mt-1 font-semibold">

                        {payment.created_at
                          ? new Date(
                              payment.created_at
                            ).toLocaleDateString(
                              "en-KE"
                            )
                          : "-"}

                      </p>

                    </div>

                  </div>

                  {/* REFERENCE */}

                  {(payment.mpesa_code ||
                    payment.reference) && (

                    <div className="mt-4 rounded-2xl border p-4">

                      <p className="text-xs text-gray-400">
                        Transaction Reference
                      </p>

                      <p className="mt-1 break-all font-semibold">

                        {payment.mpesa_code ||
                          payment.reference}

                      </p>

                    </div>

                  )}

                  {/* ACTIONS */}

                  <div className="mt-5 flex gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        handleDownload(
                          payment
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      <FaDownload />
                      Download
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          payment.id
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-100 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

    </div>
  );
}

export default PaymentHistory;