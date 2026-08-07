import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaUniversity,
  FaCheckCircle,
  FaClock,
  // eslint-disable-next-line no-unused-vars
  FaCloudUploadAlt,
  FaCreditCard,
  FaDownload,
  FaMoneyBillWave,
  FaReceipt,
  FaShieldAlt,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";

import { useAuth } from "../../../hooks/useAuth";

import {
  createPayment,
  uploadReceipt,
  getMyPayments,
  getPendingPayment,
} from "../../../services/payments";

import { getMembershipPlans } from "../../../services/membership";

import { getProfile } from "../../../services/profile";

function Payments() {
  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [profile, setProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [pendingPayment, setPendingPayment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [receiptFile, setReceiptFile] = useState(null);

  const [form, setForm] = useState({
    membership_id: "",
    payment_method: "M-Pesa",
    reference: "",
    notes: "",
  });

  /*
  =====================================================
  LOAD PAYMENT DATA
  =====================================================
  */

  const loadData = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    try {
      const [
        plansRes,
        profileRes,
        paymentsRes,
        pendingRes,
      ] = await Promise.all([
        getMembershipPlans(),
        getProfile(user.id),
        getMyPayments(user.id),
        getPendingPayment(user.id),
      ]);

      setPlans(plansRes.data || []);
      setProfile(profileRes.data || null);
      setPayments(paymentsRes.data || []);
      setPendingPayment(pendingRes.data || null);
    } catch (error) {
      console.error("Failed to load payment data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Call loadData inside an async IIFE to avoid synchronous setState inside the effect
    (async () => {
      await loadData();
    })();
  }, [loadData]);

  /*
  =====================================================
  SELECTED PLAN
  =====================================================
  */

  const selectedPlan = useMemo(() => {
    return plans.find(
      (plan) =>
        String(plan.id) === String(form.membership_id)
    );
  }, [plans, form.membership_id]);

  /*
  =====================================================
  PICK PLAN FROM MEMBERSHIP PAGE
  =====================================================
  */

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const planId =
      params.get("plan") ||
      location.state?.membershipId;

    if (!planId || plans.length === 0) return;

    const exists = plans.some(
      (plan) => String(plan.id) === String(planId)
    );

    if (exists && form.membership_id !== String(planId)) {
      // Defer state update to avoid synchronous setState within effect which
      // can cause cascading renders. Using setTimeout defers the update to
      // the next macrotask.
      setTimeout(() => {
        setForm((prev) => ({
          ...prev,
          membership_id: String(planId),
        }));
      }, 0);
    }
  }, [
    location.search,
    location.state,
    plans,
    form.membership_id,
  ]);

  /*
  =====================================================
  FORM CHANGE
  =====================================================
  */

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /*
  =====================================================
  RECEIPT FILE
  =====================================================
  */

  // eslint-disable-next-line no-unused-vars
  function handleReceiptChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setReceiptFile(file);
  }

  /*
  =====================================================
  PAYMENT SUBMISSION
  =====================================================
  */

  async function handleSubmit(e) {
    e.preventDefault();

    if (submitting) return;

    if (!form.membership_id) {
      alert("Please select a membership plan.");
      return;
    }

    if (!selectedPlan) {
      alert("Selected membership plan could not be found.");
      return;
    }

    if (pendingPayment) {
      alert(
        "You already have a payment awaiting admin approval."
      );
      return;
    }

    /*
      M-Pesa and Bank require a transaction/reference
      number.

      Cash does NOT require a reference.
    */

    if (
      form.payment_method !== "Cash" &&
      !form.reference.trim()
    ) {
      alert(
        `Please enter your ${
          form.payment_method === "M-Pesa"
            ? "M-Pesa transaction code"
            : "bank transaction/reference number"
        }.`
      );

      return;
    }

    setSubmitting(true);

    try {
      let receiptUrl = null;

      /*
      =================================================
      UPLOAD RECEIPT IF PROVIDED
      =================================================
      */

      if (receiptFile) {
        const {
          data,
          error,
        } = await uploadReceipt(
          receiptFile,
          user.id
        );

        if (error) {
          alert(error.message);
          setSubmitting(false);
          return;
        }

        receiptUrl = data;
      }

      /*
      =================================================
      CREATE PAYMENT
      =================================================
      */

      const { error } = await createPayment({
        member_id: user.id,
        membership_id: selectedPlan.id,
        amount: Number(selectedPlan.price),
        payment_method: form.payment_method,
        reference: form.reference.trim() || null,
        receipt_url: receiptUrl,
        notes: form.notes.trim() || null,

        /*
          ALL payments start as Pending.

          CASH:
          Admin confirms cash physically.

          M-PESA:
          Admin verifies transaction code.

          BANK:
          Admin verifies bank reference.
        */

        status: "Pending",
      });

      if (error) {
        alert(error.message);
        setSubmitting(false);
        return;
      }

      alert(
        form.payment_method === "Cash"
          ? "Cash payment request submitted. Please wait for admin approval."
          : "Payment submitted successfully. Please wait for admin verification."
      );

      setForm({
        membership_id: "",
        payment_method: "M-Pesa",
        reference: "",
        notes: "",
      });

      setReceiptFile(null);

      await loadData();

    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong while submitting your payment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
  =====================================================
  PAYMENT STATUS
  =====================================================
  */

  function getStatusStyle(status) {
    if (status === "Approved") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }

  /*
  =====================================================
  PAYMENT STATUS ICON
  =====================================================
  */

  function getStatusIcon(status) {
    if (status === "Approved") {
      return <FaCheckCircle />;
    }

    if (status === "Rejected") {
      return <FaTimesCircle />;
    }

    return <FaClock />;
  }

  /*
  =====================================================
  DOWNLOAD / PRINT RECEIPT
  =====================================================
  */

  function downloadReceipt(payment) {
    const planName =
      payment.membership_plans?.name ||
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

    const receiptWindow =
      window.open(
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
              box-shadow: 0 10px 30px rgba(0,0,0,.08);
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
              border-bottom: 1px solid #e5e7eb;
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
              <span class="label">Member</span>
              <span class="value">
                ${profile?.full_name || "Member"}
              </span>
            </div>

            <div class="row">
              <span class="label">Email</span>
              <span class="value">
                ${user?.email || "-"}
              </span>
            </div>

            <div class="row">
              <span class="label">Membership</span>
              <span class="value">
                ${planName}
              </span>
            </div>

            <div class="row">
              <span class="label">Payment Method</span>
              <span class="value">
                ${payment.payment_method || "-"}
              </span>
            </div>

            <div class="row">
              <span class="label">Transaction Reference</span>
              <span class="value">
                ${payment.reference || "Cash Payment"}
              </span>
            </div>

            <div class="row">
              <span class="label">Payment Date</span>
              <span class="value">
                ${date}
              </span>
            </div>

            <div class="amount">
              <span>Total Paid</span>
              <span>KSh ${amount}</span>
            </div>

            <div class="footer">

              <p>
                Thank you for choosing Malkia Fitness.
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

  /*
  =====================================================
  LOADING
  =====================================================
  */

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">

            <FaSpinner className="animate-spin text-2xl" />

          </div>

          <h2 className="mt-5 text-xl font-bold">
            Loading Payments...
          </h2>

          <p className="mt-2 text-gray-500">
            Getting your payment information.
          </p>

        </div>

      </div>
    );
  }

  /*
  =====================================================
  PAGE
  =====================================================
  */

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">

      {/* ==============================================
          HEADER
      ============================================== */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-600">
            Malkia Fitness
          </p>

          <h1 className="mt-2 text-3xl font-black text-gray-900 md:text-4xl">
            Payments
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Choose your membership, select a payment
            method and submit your payment for verification.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/member/membership")
          }
          className="flex w-fit items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm transition hover:border-pink-300 hover:text-pink-600"
        >
          <FaArrowLeft />

          Membership Plans

        </button>

      </div>

      {/* ==============================================
          SUMMARY CARDS
      ============================================== */}

      <div className="grid gap-5 md:grid-cols-3">

        {/* Current Membership */}

        <div className="relative overflow-hidden rounded-3xl bg-black p-6 text-white shadow-lg">

          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink-600/20 blur-2xl" />

          <div className="relative">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-600">

                <FaCreditCard />

              </div>

              <p className="text-sm font-semibold text-gray-400">
                Current Membership
              </p>

            </div>

            <h2 className="mt-5 text-2xl font-black">
              {profile?.membership_plans?.name ||
                "No Membership"}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              {profile?.membership_plans
                ? `KSh ${Number(
                    profile.membership_plans.price
                  ).toLocaleString()}`
                : "Choose a plan to get started"}
            </p>

          </div>

        </div>

        {/* Pending */}

        <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">

              <FaClock />

            </div>

            <p className="text-sm font-semibold text-yellow-700">
              Payment Status
            </p>

          </div>

          <h2 className="mt-5 text-2xl font-black text-gray-900">

            {pendingPayment
              ? "Pending Approval"
              : "Ready to Pay"}

          </h2>

          <p className="mt-2 text-sm text-gray-600">

            {pendingPayment
              ? "Your payment is being reviewed."
              : "No payment awaiting approval."}

          </p>

        </div>

        {/* Transactions */}

        <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-pink-600">

              <FaReceipt />

            </div>

            <p className="text-sm font-semibold text-gray-500">
              Transactions
            </p>

          </div>

          <h2 className="mt-5 text-2xl font-black">
            {payments.length}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Payment records on your account.
          </p>

        </div>

      </div>

      {/* ==============================================
          PENDING PAYMENT
      ============================================== */}

      {pendingPayment && (

        <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600">

              <FaClock />

            </div>

            <div>

              <h2 className="text-xl font-bold text-yellow-800">
                Payment Awaiting Approval
              </h2>

              <p className="mt-2 text-sm leading-6 text-yellow-700">

                You already have a payment request awaiting
                administrator approval. Please wait until it has
                been approved or rejected before submitting another
                payment.

              </p>

            </div>

          </div>

        </div>

      )}

      {/* ==============================================
          PAYMENT FORM
      ============================================== */}

      <div className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">

        {/* FORM */}

        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

          <div className="mb-8">

            <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
              Payment
            </p>

            <h2 className="mt-1 text-2xl font-black md:text-3xl">
              Complete Your Payment
            </h2>

            <p className="mt-2 text-gray-500">
              Submit your payment details for verification.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >

            {/* ========================================
                MEMBERSHIP
            ======================================== */}

            <div>

              <label className="mb-3 block text-sm font-bold text-gray-700">
                Membership Plan
              </label>

              <div className="grid gap-3 sm:grid-cols-2">

                {plans.map((plan) => {

                  const active =
                    String(
                      form.membership_id
                    ) === String(plan.id);

                  return (

                    <button
                      key={plan.id}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          membership_id:
                            String(plan.id),
                        }))
                      }
                      className={`rounded-2xl border-2 p-5 text-left transition ${
                        active
                          ? "border-pink-600 bg-pink-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50/40"
                      }`}
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="text-lg font-black">
                            {plan.name}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {plan.duration} days
                          </p>

                        </div>

                        {active && (

                          <FaCheckCircle className="text-xl text-pink-600" />

                        )}

                      </div>

                      <p className="mt-4 text-2xl font-black text-pink-600">

                        KSh{" "}
                        {Number(
                          plan.price
                        ).toLocaleString()}

                      </p>

                    </button>

                  );

                })}

              </div>

            </div>

            {/* ========================================
                SELECTED PLAN
            ======================================== */}

            {selectedPlan && (

              <div className="rounded-2xl border border-pink-200 bg-pink-50 p-5">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-pink-600">
                      Selected Plan
                    </p>

                    <h3 className="mt-1 text-xl font-black">
                      {selectedPlan.name}
                    </h3>

                  </div>

                  <p className="text-2xl font-black text-pink-600">

                    KSh{" "}
                    {Number(
                      selectedPlan.price
                    ).toLocaleString()}

                  </p>

                </div>

              </div>

            )}

            {/* ========================================
                PAYMENT METHOD
            ======================================== */}

            <div>

              <label className="mb-3 block text-sm font-bold text-gray-700">
                Payment Method
              </label>

              <div className="grid gap-3 sm:grid-cols-3">

                {/* MPESA */}

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      payment_method: "M-Pesa",
                      reference: "",
                    }))
                  }
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    form.payment_method === "M-Pesa"
                      ? "border-pink-600 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300"
                  }`}
                >

                  <FaCreditCard className="text-2xl text-green-600" />

                  <p className="mt-3 font-black">
                    M-Pesa
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Transaction code required
                  </p>

                </button>

                {/* CASH */}

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      payment_method: "Cash",
                      reference: "",
                    }))
                  }
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    form.payment_method === "Cash"
                      ? "border-pink-600 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300"
                  }`}
                >

                  <FaMoneyBillWave className="text-2xl text-green-600" />

                  <p className="mt-3 font-black">
                    Cash
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Admin approval required
                  </p>

                </button>

                {/* BANK */}

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      payment_method: "Bank",
                      reference: "",
                    }))
                  }
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    form.payment_method === "Bank"
                      ? "border-pink-600 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300"
                  }`}
                >

                  <FaUniversity className="text-2xl text-blue-600" />

                  <p className="mt-3 font-black">
                    Bank
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Reference required
                  </p>

                </button>

              </div>

            </div>

            {/* ========================================
                TRANSACTION CODE
            ======================================== */}

            {form.payment_method !== "Cash" && (

              <div>

                <label className="mb-2 block text-sm font-bold text-gray-700">

                  {form.payment_method === "M-Pesa"
                    ? "M-Pesa Transaction Code"
                    : "Bank Transaction Reference"}

                </label>

                <input
                  type="text"
                  name="reference"
                  value={form.reference}
                  onChange={handleChange}
                  placeholder={
                    form.payment_method === "M-Pesa"
                      ? "e.g. QGH7K8L2MN"
                      : "Enter bank reference number"
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10"
                  required
                />

                <p className="mt-2 text-xs text-gray-500">

                  This reference will be checked by an
                  administrator before your membership is activated.

                </p>

              </div>

            )}

            {/* ========================================
                RECEIPT
            ======================================== */}

            
            {/* ========================================
                NOTES
            ======================================== */}

            <div>

              <label className="mb-2 block text-sm font-bold text-gray-700">
                Notes
                <span className="ml-2 font-normal text-gray-400">
                  Optional
                </span>
              </label>

              <textarea
                rows={4}
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any additional information..."
                className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10"
              />

            </div>

            {/* ========================================
                SUBMIT
            ======================================== */}

            <button
              type="submit"
              disabled={
                submitting ||
                !!pendingPayment
              }
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-pink-600 py-5 text-lg font-black text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" />

                  Submitting Payment...

                </>
              ) : (
                <>
                  <FaShieldAlt />

                  Submit Payment for Approval

                </>
              )}

            </button>

          </form>

        </div>

        {/* ==========================================
            PAYMENT INFORMATION
        =========================================== */}

        <div className="space-y-6">

          {/* How it works */}

          <div className="rounded-3xl bg-black p-7 text-white shadow-lg">

            <p className="text-sm font-bold uppercase tracking-widest text-pink-500">
              How it works
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Simple & Secure
            </h2>

            <div className="mt-7 space-y-6">

              <div className="flex gap-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-600 font-black">
                  1
                </div>

                <div>

                  <p className="font-bold">
                    Choose your plan
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Select the membership you want.
                  </p>

                </div>

              </div>

              <div className="flex gap-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-600 font-black">
                  2
                </div>

                <div>

                  <p className="font-bold">
                    Make payment
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Use M-Pesa, cash or bank payment.
                  </p>

                </div>

              </div>

              <div className="flex gap-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-600 font-black">
                  3
                </div>

                <div>

                  <p className="font-bold">
                    Admin verifies
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Your membership becomes active after
                    approval.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Cash */}

          <div className="rounded-3xl border border-green-200 bg-green-50 p-6">

            <div className="flex gap-4">

              <FaMoneyBillWave className="mt-1 text-2xl text-green-600" />

              <div>

                <h3 className="font-black text-green-800">
                  Paying by Cash?
                </h3>

                <p className="mt-2 text-sm leading-6 text-green-700">

                  No transaction code is required.
                  Submit the request and an administrator
                  will confirm the cash payment before
                  activating your membership.

                </p>

              </div>

            </div>

          </div>

          {/* Security */}

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600">

                <FaShieldAlt />

              </div>

              <div>

                <h3 className="font-bold">
                  Payment Verification
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">

                  M-Pesa and bank payments require a
                  transaction/reference number so the
                  administrator can verify the payment.

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ==============================================
          PAYMENT HISTORY
      ============================================== */}

      <section>

        <div className="mb-5">

          <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
            Records
          </p>

          <h2 className="mt-1 text-2xl font-black md:text-3xl">
            Payment History
          </h2>

          <p className="mt-1 text-gray-500">
            Your previous membership payment requests.
          </p>

        </div>

        {payments.length === 0 ? (

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">

              <FaReceipt className="text-2xl" />

            </div>

            <h3 className="mt-5 text-xl font-bold">
              No payment history
            </h3>

            <p className="mt-2 text-gray-500">
              Your payment records will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {payments.map((payment) => (

              <div
                key={payment.id}
                className="rounded-3xl bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">

                      <FaReceipt />

                    </div>

                    <div>

                      <h3 className="text-lg font-black">
                        {payment.membership_plans?.name ||
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

                        {payment.payment_method}

                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap items-center gap-4">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Amount
                      </p>

                      <p className="mt-1 text-xl font-black">
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

                {payment.reference && (

                  <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm">

                    <span className="text-gray-500">
                      Reference:
                    </span>

                    <span className="ml-2 font-bold">
                      {payment.reference}
                    </span>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Payments;