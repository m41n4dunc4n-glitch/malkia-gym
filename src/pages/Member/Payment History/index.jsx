import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaReceipt,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";
import { supabase } from "../../../services/supabase";

function PaymentHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPaymentHistory = async () => {
    if (!user?.id) {
      setPayments([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: historyError } = await supabase
        .from("payment_history")
        .select("*")
        .eq("member_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      console.log("MEMBER PAYMENT HISTORY DATA:", data);
      console.log("MEMBER PAYMENT HISTORY ERROR:", historyError);

      if (historyError) {
        throw historyError;
      }

      setPayments(data || []);
    } catch (err) {
      console.error(
        "MEMBER PAYMENT HISTORY LOAD ERROR:",
        err
      );

      setError(err.message || "Failed to load payment history.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD MEMBER PAYMENT HISTORY
  ===================================================== */

  useEffect(() => {
    let isMounted = true;

    const fetchPaymentHistory = async () => {
      if (!user?.id) {
        if (!isMounted) return;

        setPayments([]);
        setLoading(false);
        setError(null);
        return;
      }

      if (!isMounted) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error: historyError } = await supabase
          .from("payment_history")
          .select("*")
          .eq("member_id", user.id)
          .order("created_at", {
            ascending: false,
          });

        console.log("MEMBER PAYMENT HISTORY DATA:", data);
        console.log("MEMBER PAYMENT HISTORY ERROR:", historyError);

        if (historyError) {
          throw historyError;
        }

        if (!isMounted) return;
        setPayments(data || []);
      } catch (err) {
        console.error(
          "MEMBER PAYMENT HISTORY LOAD ERROR:",
          err
        );

        if (!isMounted) return;

        setError(err.message || "Failed to load payment history.");
        setPayments([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPaymentHistory();

    return () => {
      isMounted = false;
    };
  }, [user]);

  /* =====================================================
     STATUS STYLE
  ===================================================== */

  function getStatusStyle(status) {
    if (status === "Approved") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }

  /* =====================================================
     STATUS ICON
  ===================================================== */

  function getStatusIcon(status) {
    if (status === "Approved") {
      return <FaCheckCircle />;
    }

    if (status === "Rejected") {
      return <FaTimesCircle />;
    }

    return <FaClock />;
  }

  /* =====================================================
     DOWNLOAD / PRINT RECEIPT
  ===================================================== */

  function downloadReceipt(payment) {
    const memberName =
      payment.member_name ||
      "Member";

    const memberEmail =
      payment.member_email ||
      user?.email ||
      "-";

    const planName =
      payment.plan_name ||
      "Membership";

    const amount = Number(
      payment.amount || 0
    ).toLocaleString();

    const date = payment.created_at
      ? new Date(
          payment.created_at
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "-";

    const receiptWindow = window.open(
      "",
      "_blank",
      "width=800,height=900"
    );

    if (!receiptWindow) {
      alert(
        "Please allow pop-ups to download your receipt."
      );
      return;
    }

    receiptWindow.document.write(`
      <!DOCTYPE html>

      <html>

        <head>

          <title>Malkia Fitness Receipt</title>

          <style>

            body {
              margin: 0;
              padding: 40px;
              background: #f4f4f5;
              font-family: Arial, sans-serif;
              color: #111827;
            }

            .receipt {
              max-width: 650px;
              margin: auto;
              background: white;
              padding: 45px;
              border-radius: 24px;
              box-shadow:
                0 10px 30px rgba(0,0,0,.08);
            }

            .brand {
              text-align: center;
              margin-bottom: 35px;
            }

            .brand h1 {
              margin: 0;
              font-size: 32px;
              font-weight: 800;
            }

            .brand p {
              color: #ec008c;
              font-weight: bold;
              letter-spacing: 2px;
              margin-top: 8px;
            }

            .paid {
              margin: 30px 0;
              padding: 18px;
              text-align: center;
              background: #dcfce7;
              color: #15803d;
              border-radius: 14px;
              font-weight: bold;
              font-size: 20px;
            }

            .row {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              padding: 16px 0;
              border-bottom:
                1px solid #e5e7eb;
            }

            .label {
              color: #6b7280;
            }

            .value {
              font-weight: bold;
              text-align: right;
            }

            .amount {
              margin-top: 30px;
              padding: 22px;
              border-radius: 16px;
              background: #fdf2f8;
              display: flex;
              justify-content: space-between;
              font-size: 22px;
              font-weight: 800;
            }

            .footer {
              margin-top: 40px;
              text-align: center;
              color: #6b7280;
              font-size: 13px;
            }

            .print {
              margin-top: 25px;
              width: 100%;
              padding: 14px;
              border: none;
              border-radius: 12px;
              background: #ec008c;
              color: white;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
            }

            @media print {

              body {
                background: white;
                padding: 0;
              }

              .receipt {
                box-shadow: none;
              }

              .print {
                display: none;
              }

            }

          </style>

        </head>

        <body>

          <div class="receipt">

            <div class="brand">

              <h1>MALKIA FITNESS</h1>

              <p>PAYMENT RECEIPT</p>

            </div>

            <div class="paid">

              ✓ PAYMENT RECEIVED

            </div>

            <div class="row">

              <span class="label">
                Member
              </span>

              <span class="value">
                ${memberName}
              </span>

            </div>

            <div class="row">

              <span class="label">
                Email
              </span>

              <span class="value">
                ${memberEmail}
              </span>

            </div>

            <div class="row">

              <span class="label">
                Membership
              </span>

              <span class="value">
                ${planName}
              </span>

            </div>

            <div class="row">

              <span class="label">
                Payment Method
              </span>

              <span class="value">
                ${payment.payment_method || "-"}
              </span>

            </div>

            <div class="row">

              <span class="label">
                Transaction Reference
              </span>

              <span class="value">
                ${payment.reference || "Cash Payment"}
              </span>

            </div>

            <div class="row">

              <span class="label">
                Payment Date
              </span>

              <span class="value">
                ${date}
              </span>

            </div>

            <div class="amount">

              <span>
                Total Paid
              </span>

              <span>
                KSh ${amount}
              </span>

            </div>

            <div class="footer">

              <p>
                Thank you for choosing
                Malkia Fitness.
              </p>

              <p>
                Keep this receipt for your records.
              </p>

              <button
                class="print"
                onclick="window.print()"
              >
                Print / Save as PDF
              </button>

            </div>

          </div>

        </body>

      </html>
    `);

    receiptWindow.document.close();
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-125 items-center justify-center">
        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">

            <FaSpinner className="animate-spin text-2xl" />

          </div>

          <h2 className="mt-5 text-xl font-bold">
            Loading Payment History...
          </h2>

          <p className="mt-2 text-gray-500">
            Getting your payment records.
          </p>

        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-600">
            Malkia Fitness
          </p>

          <h1 className="mt-2 text-3xl font-black text-gray-900 md:text-4xl">
            Payment History
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            View your previous membership payment records.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/member/payments")
          }
          className="flex w-fit items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm transition hover:border-pink-300 hover:text-pink-600"
        >

          <FaArrowLeft />

          Back to Payments

        </button>

      </div>

      {/* ERROR */}

      {error && (

        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">

          <div className="flex items-start gap-4">

            <FaTimesCircle className="mt-1 shrink-0 text-xl text-red-600" />

            <div>

              <h2 className="font-bold text-red-800">
                Could not load payment history
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={loadPaymentHistory}
                className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                Try Again
              </button>

            </div>

          </div>

        </div>

      )}

      {/* EMPTY */}

      {!error && payments.length === 0 && (

        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">

            <FaReceipt className="text-2xl" />

          </div>

          <h2 className="mt-5 text-xl font-bold">
            No Payment History
          </h2>

          <p className="mt-2 text-gray-500">
            Your approved and rejected payment records
            will appear here.
          </p>

        </div>

      )}

      {/* PAYMENT RECORDS */}

      {!error && payments.length > 0 && (

        <div className="space-y-4">

          {payments.map((payment) => (

            <div
              key={payment.id}
              className="rounded-3xl bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
            >

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                {/* PAYMENT INFO */}

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">

                    <FaReceipt />

                  </div>

                  <div>

                    <h3 className="text-lg font-black text-gray-900">

                      {payment.plan_name ||
                        "Membership"}

                    </h3>

                    <p className="mt-1 text-sm text-gray-500">

                      {payment.created_at
                        ? new Date(
                            payment.created_at
                          ).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "-"}

                      <span className="mx-2">
                        •
                      </span>

                      {payment.payment_method ||
                        "-"}

                    </p>

                    {payment.member_name && (

                      <p className="mt-1 text-xs text-gray-400">
                        {payment.member_name}
                      </p>

                    )}

                  </div>

                </div>

                {/* AMOUNT / STATUS / RECEIPT */}

                <div className="flex flex-wrap items-center gap-4">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Amount
                    </p>

                    <p className="mt-1 text-xl font-black text-gray-900">

                      KSh{" "}

                      {Number(
                        payment.amount || 0
                      ).toLocaleString()}

                    </p>

                  </div>

                  <span
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${getStatusStyle(
                      payment.status
                    )}`}
                  >

                    {getStatusIcon(
                      payment.status
                    )}

                    {payment.status}

                  </span>

                  {payment.status ===
                    "Approved" && (

                    <button
                      type="button"
                      onClick={() =>
                        downloadReceipt(
                          payment
                        )
                      }
                      className="flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-pink-700"
                    >

                      <FaDownload />

                      Receipt

                    </button>

                  )}

                </div>

              </div>

              {/* REFERENCE */}

              {payment.reference && (

                <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm">

                  <span className="text-gray-500">
                    Reference:
                  </span>

                  <span className="ml-2 font-bold text-gray-900">
                    {payment.reference}
                  </span>

                </div>

              )}

              {/* NOTES */}

              {payment.notes && (

                <div className="mt-3 rounded-xl bg-gray-50 p-4 text-sm">

                  <span className="text-gray-500">
                    Notes:
                  </span>

                  <span className="ml-2 text-gray-700">
                    {payment.notes}
                  </span>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default PaymentHistory;