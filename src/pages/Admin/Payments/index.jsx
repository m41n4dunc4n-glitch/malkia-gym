import { useEffect, useState } from "react";

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
} from "react-icons/fa";

function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    const { data } = await getAllPayments();
    setPayments(data || []);
  }

 async function handleApprove(payment) {
  const confirmed = window.confirm(
    `Approve payment for ${payment.profiles?.full_name}?`
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

  async function handleReject(id) {
    const confirmed = window.confirm("Reject this payment?");

    if (!confirmed) return;

    const { error } = await rejectPayment(id);

    if (error) {
      console.error("Rejection error:", error);
      alert(`Failed to reject payment:\n\n${error.message}`);
      return;
    }

    alert("Payment rejected successfully.");
    loadPayments();
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
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-xl text-pink-600">
                <FaMoneyBillWave />
              </div>

              <div>

                <h1 className="text-3xl font-bold text-gray-900 lg:text-4xl">
                  Payment Management
                </h1>

                <p className="mt-1 text-gray-500">
                  Review, verify and manage member payments.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* SUMMARY CARDS */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL */}

        <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Payments
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                {payments.length}
              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-xl text-pink-600">
              <FaMoneyBillWave />
            </div>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            KSh{" "}
            {totalAmount.toLocaleString()}
            {" "}processed
          </p>

        </div>


        {/* PENDING */}

        <div className="group rounded-3xl border border-yellow-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Pending
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-yellow-600">
                {pendingCount}
              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-xl text-yellow-600">
              <FaClock />
            </div>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            Awaiting verification
          </p>

        </div>


        {/* APPROVED */}

        <div className="group rounded-3xl border border-green-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Approved
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-green-600">
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


        {/* REJECTED */}

        <div className="group rounded-3xl border border-red-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Rejected
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-red-600">
                {rejectedCount}
              </h2>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-xl text-red-600">
              <FaTimesCircle />
            </div>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            Declined payments
          </p>

        </div>

      </div>


      {/* PAYMENT LIST */}

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

        {/* SECTION HEADER */}

        <div className="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Payment Transactions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review member payment submissions.
            </p>

          </div>

          <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
            {payments.length} Transactions
          </div>

        </div>


        {/* DESKTOP TABLE */}

        <div className="hidden overflow-x-auto lg:block">

          <table className="w-full">

            <thead className="bg-black text-white">

              <tr>

                <th className="p-5 text-left text-sm font-semibold">
                  Member
                </th>

                <th className="p-5 text-left text-sm font-semibold">
                  Plan
                </th>

                <th className="p-5 text-left text-sm font-semibold">
                  Amount
                </th>

                <th className="p-5 text-left text-sm font-semibold">
                  Method
                </th>

                <th className="p-5 text-left text-sm font-semibold">
                  Reference
                </th>

                <th className="p-5 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="p-5 text-left text-sm font-semibold">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {payments.map((payment) => (

                <tr
                  key={payment.id}
                  className="border-b border-gray-100 transition hover:bg-pink-50/30"
                >

                  {/* MEMBER */}

                  <td className="p-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                        <FaUser />
                      </div>

                      <div className="min-w-0">

                        <p className="font-bold text-gray-900">
                          {payment.profiles?.full_name ||
                            "Unknown Member"}
                        </p>

                        <p className="max-w-48 truncate text-sm text-gray-500">
                          {payment.profiles?.email}
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* PLAN */}

                  <td className="p-5">

                    <p className="font-semibold text-gray-900">
                      {payment.membership_plans?.name ||
                        "Membership"}
                    </p>

                  </td>


                  {/* AMOUNT */}

                  <td className="p-5">

                    <p className="font-extrabold text-gray-900">
                      KSh{" "}
                      {Number(
                        payment.amount || 0
                      ).toLocaleString()}
                    </p>

                  </td>


                  {/* METHOD */}

                  <td className="p-5">

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold ${getMethodStyle(
                        payment.method
                      )}`}
                    >

                      {getMethodIcon(payment.method)}

                      {payment.method || "Unknown"}

                    </span>

                  </td>


                  {/* REFERENCE */}

                  <td className="p-5">

                    <div className="rounded-xl bg-gray-50 px-3 py-2 font-mono text-sm font-bold text-gray-700">

                      {payment.mpesa_code ||
                        payment.reference ||
                        "—"}

                    </div>

                  </td>


                  {/* STATUS */}

                  <td className="p-5">

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold ${getStatusStyle(
                        payment.status
                      )}`}
                    >

                      {payment.status === "Approved" && (
                        <FaCheck />
                      )}

                      {payment.status === "Rejected" && (
                        <FaTimes />
                      )}

                      {payment.status === "Pending" && (
                        <FaClock />
                      )}

                      {payment.status}

                    </span>

                  </td>


                  {/* ACTIONS */}

                  <td className="p-5">

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleApprove(payment)
                        }
                        className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
                      >

                        <FaCheck />

                        Approve

                      </button>


                      <button
                        onClick={() =>
                          handleReject(payment.id)
                        }
                        className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                      >

                        <FaTimes />

                        Reject

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* MOBILE / TABLET CARDS */}

        <div className="space-y-5 p-5 lg:hidden">

          {payments.map((payment) => (

            <div
              key={payment.id}
              className="rounded-3xl border border-gray-100 bg-gray-50 p-5 shadow-sm transition hover:shadow-md"
            >

              {/* TOP */}

              <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                    <FaUser />
                  </div>

                  <div className="min-w-0">

                    <h3 className="truncate font-bold text-gray-900">
                      {payment.profiles?.full_name ||
                        "Unknown Member"}
                    </h3>

                    <p className="truncate text-sm text-gray-500">
                      {payment.profiles?.email}
                    </p>

                  </div>

                </div>


                <span
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                    payment.status
                  )}`}
                >
                  {payment.status}
                </span>

              </div>


              {/* DETAILS */}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                <div className="rounded-2xl bg-white p-4">

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Membership
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    {payment.membership_plans?.name ||
                      "Membership"}
                  </p>

                </div>


                <div className="rounded-2xl bg-white p-4">

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
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

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Payment Method
                  </p>

                  <div
                    className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${getMethodStyle(
                      payment.method
                    )}`}
                  >

                    {getMethodIcon(payment.method)}

                    {payment.method || "Unknown"}

                  </div>

                </div>


                <div className="rounded-2xl bg-white p-4">

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Reference
                  </p>

                  <p className="mt-2 break-all font-mono text-sm font-bold text-gray-700">
                    {payment.mpesa_code ||
                      payment.reference ||
                      "—"}
                  </p>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="mt-5 grid grid-cols-2 gap-3">

                <button
                  onClick={() =>
                    handleApprove(payment)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-bold text-white transition hover:bg-green-700"
                >

                  <FaCheck />

                  Approve

                </button>


                <button
                  onClick={() =>
                    handleReject(payment.id)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-700"
                >

                  <FaTimes />

                  Reject

                </button>

              </div>

            </div>

          ))}

        </div>


        {/* EMPTY */}

        {payments.length === 0 && (

          <div className="p-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl text-gray-400">
              <FaMoneyBillWave />
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              No payments yet
            </h3>

            <p className="mt-2 text-gray-500">
              Member payment submissions will appear here.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default Payments;