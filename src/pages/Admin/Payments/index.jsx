import { useEffect, useState } from "react";

import {
  getAllPayments,
  approvePayment,
  rejectPayment,
} from "../../../services/payments";

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
    await approvePayment(payment);

    alert("Payment Approved");

    loadPayments();
  }

  async function handleReject(id) {
    await rejectPayment(id);

    alert("Payment Rejected");

    loadPayments();
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold lg:text-4xl">
          Payment Management
        </h1>

        <p className="mt-2 text-gray-500">
          Review and approve member payments.
        </p>

      </div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow">

        <table className="min-w-275 w-full">

          <thead className="bg-black text-white">

            <tr>

              <th className="p-4 text-left">
                Member
              </th>

              <th className="p-4 text-left">
                Plan
              </th>

              <th className="p-4 text-left">
                Amount
              </th>

              <th className="p-4 text-left">
                Phone
              </th>

              <th className="p-4 text-left">
                M-Pesa Code
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {payments.map((payment) => (

              <tr
                key={payment.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4">

                  <div className="min-w-0">

                    <h3 className="font-semibold wrap-break-word">
                      {payment.profiles?.full_name}
                    </h3>

                  </div>

                </td>

                <td className="p-4 whitespace-nowrap">
                  {payment.membership_plans?.name}
                </td>

                <td className="p-4 whitespace-nowrap">
                  KSh {payment.amount}
                </td>

                <td className="p-4 whitespace-nowrap">
                  {payment.phone}
                </td>

                <td className="p-4 font-bold whitespace-nowrap">
                  {payment.mpesa_code}
                </td>

                <td className="p-4">

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      payment.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : payment.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>

                </td>

                <td className="p-4">

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() => handleApprove(payment)}
                      className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white transition hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(payment.id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-700"
                    >
                      Reject
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Payments;