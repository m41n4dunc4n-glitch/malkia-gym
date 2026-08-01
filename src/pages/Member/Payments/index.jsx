import { FaReceipt, FaCheckCircle, FaClock } from "react-icons/fa";

function Payments() {
  const payments = [
    {
      id: 1,
      plan: "VIP Membership",
      amount: 8000,
      method: "M-Pesa",
      date: "2026-07-01",
      status: "Paid",
    },
    {
      id: 2,
      plan: "Protein Package",
      amount: 2500,
      method: "Cash",
      date: "2026-06-18",
      status: "Paid",
    },
    {
      id: 3,
      plan: "August Membership",
      amount: 8000,
      method: "Pending",
      date: "2026-08-01",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-3xl font-bold md:text-4xl">
            Payments
          </h1>

          <p className="mt-2 text-gray-500">
            View your payment history and upcoming dues.
          </p>

        </div>

      </div>

      {/* Summary */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-3xl bg-white p-6 shadow">

          <FaCheckCircle className="mb-4 text-4xl text-green-600" />

          <p className="text-gray-500">
            Total Paid
          </p>

          <h2 className="mt-2 text-2xl font-bold md:text-3xl">
            KSh 18,500
          </h2>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow">

          <FaClock className="mb-4 text-4xl text-yellow-500" />

          <p className="text-gray-500">
            Outstanding
          </p>

          <h2 className="mt-2 text-2xl font-bold md:text-3xl">
            KSh 8,000
          </h2>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow">

          <FaReceipt className="mb-4 text-4xl text-pink-600" />

          <p className="text-gray-500">
            Transactions
          </p>

          <h2 className="mt-2 text-2xl font-bold md:text-3xl">
            {payments.length}
          </h2>

        </div>

      </div>

      {/* Desktop Table */}

      <div className="hidden overflow-x-auto rounded-3xl bg-white shadow lg:block">

        <table className="min-w-full">

          <thead className="bg-black text-white">

            <tr>

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
                Date
              </th>

              <th className="p-5 text-left">
                Status
              </th>

              <th className="p-5 text-left">
                Receipt
              </th>

            </tr>

          </thead>

          <tbody>

            {payments.map((payment) => (

              <tr
                key={payment.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-5 font-semibold">
                  {payment.plan}
                </td>

                <td className="p-5">
                  KSh {payment.amount.toLocaleString()}
                </td>

                <td className="p-5">
                  {payment.method}
                </td>

                <td className="p-5">
                  {payment.date}
                </td>

                <td className="p-5">

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      payment.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>

                </td>

                <td className="p-5">

                  <button className="rounded-xl bg-pink-600 px-4 py-2 text-white transition hover:bg-pink-700">
                    Download
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Mobile Cards */}

      <div className="space-y-5 lg:hidden">

        {payments.map((payment) => (

          <div
            key={payment.id}
            className="rounded-3xl bg-white p-6 shadow"
          >

            <div className="flex items-start justify-between gap-4">

              <div>

                <h3 className="text-xl font-bold">
                  {payment.plan}
                </h3>

                <p className="mt-1 text-gray-500">
                  {payment.date}
                </p>

              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  payment.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {payment.status}
              </span>

            </div>

            <div className="mt-6 space-y-3 text-gray-700">

              <div className="flex justify-between">
                <span>Amount</span>
                <span className="font-semibold">
                  KSh {payment.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-semibold">
                  {payment.method}
                </span>
              </div>

            </div>

            <button className="mt-6 w-full rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700">
              Download Receipt
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Payments;