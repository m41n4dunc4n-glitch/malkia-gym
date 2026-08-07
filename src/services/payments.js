import { supabase } from "./supabase";

/* =====================================================
   CREATE PAYMENT
===================================================== */

export async function createPayment(payment) {
  if (!payment) {
    return {
      data: null,
      error: new Error("Payment data is missing."),
    };
  }

  return await supabase
    .from("payments")
    .insert([
      {
        ...payment,
        status: payment.status || "Pending",
      },
    ])
    .select()
    .single();
}

/* =====================================================
   GET MEMBER PAYMENTS
===================================================== */

export async function getMyPayments(userId) {
  if (!userId) {
    return {
      data: [],
      error: new Error("User ID is missing."),
    };
  }

  return await supabase
    .from("payments")
    .select(`
      *,
      membership_plans (
        name,
        price,
        duration
      )
    `)
    .eq("member_id", userId)
    .order("created_at", {
      ascending: false,
    });
}

/* =====================================================
   GET PENDING MEMBER PAYMENT
===================================================== */

export async function getPendingPayment(userId) {
  if (!userId) {
    return {
      data: null,
      error: new Error("User ID is missing."),
    };
  }

  return await supabase
    .from("payments")
    .select(`
      *,
      membership_plans (
        name,
        price,
        duration
      )
    `)
    .eq("member_id", userId)
    .eq("status", "Pending")
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();
}

/* =====================================================
   GET ALL PAYMENTS - ADMIN
===================================================== */

export async function getAllPayments() {
  return await supabase
    .from("payments")
    .select(`
      *,
      profiles (
        full_name,
        email,
        phone
      ),
      membership_plans (
        name,
        price,
        duration
      )
    `)
    .order("created_at", {
      ascending: false,
    });
}

/* =====================================================
   ARCHIVE PAYMENT
===================================================== */

async function archivePayment(payment, finalStatus) {
  if (!payment?.id) {
    return {
      data: null,
      error: new Error("Payment ID is missing."),
    };
  }

  const historyRecord = {
    id: payment.id,

    member_id: payment.member_id,
    membership_id: payment.membership_id,

    amount: payment.amount,

    phone:
      payment.phone ||
      payment.profiles?.phone ||
      null,

    mpesa_code: payment.mpesa_code || null,

    status: finalStatus,

    payment_method:
      payment.payment_method || null,

    reference:
      payment.reference || null,

    receipt_url:
      payment.receipt_url || null,

    notes:
      payment.notes || null,

    created_at:
      payment.created_at || new Date().toISOString(),

    /* ================================================
       STORED DIRECTLY IN PAYMENT HISTORY
    ================================================ */

    member_name:
      payment.profiles?.full_name || null,

    member_email:
      payment.profiles?.email || null,

    plan_name:
      payment.membership_plans?.name || null,
  };

  console.log(
    "ARCHIVING PAYMENT:",
    historyRecord
  );

  const {
    data,
    error,
  } = await supabase
    .from("payment_history")
    .insert([historyRecord])
    .select()
    .single();

  if (error) {
    console.error(
      "PAYMENT HISTORY INSERT ERROR:",
      error
    );

    return {
      data: null,
      error,
    };
  }

  console.log(
    "PAYMENT SUCCESSFULLY ARCHIVED:",
    data
  );

  return {
    data,
    error: null,
  };
}

/* =====================================================
   REMOVE ACTIVE PAYMENT
===================================================== */

async function removeActivePayment(paymentId) {
  if (!paymentId) {
    return {
      data: null,
      error: new Error("Payment ID is missing."),
    };
  }

  const {
    data,
    error,
  } = await supabase
    .from("payments")
    .delete()
    .eq("id", paymentId)
    .select();

  if (error) {
    console.error(
      "ACTIVE PAYMENT DELETE ERROR:",
      error
    );

    return {
      data: null,
      error,
    };
  }

  if (!data || data.length === 0) {
    return {
      data: null,
      error: new Error(
        "Payment could not be removed from active payments."
      ),
    };
  }

  return {
    data,
    error: null,
  };
}

/* =====================================================
   APPROVE PAYMENT
===================================================== */

export async function approvePayment(payment) {
  if (!payment?.id) {
    return {
      data: null,
      error: new Error("Payment ID is missing."),
    };
  }

  if (!payment?.member_id) {
    return {
      data: null,
      error: new Error("Member ID is missing."),
    };
  }

  if (!payment?.membership_id) {
    return {
      data: null,
      error: new Error("Membership ID is missing."),
    };
  }

  /* ===================================================
     1. GET COMPLETE PAYMENT INFORMATION
  =================================================== */

  const {
    data: existingPayment,
    error: fetchError,
  } = await supabase
    .from("payments")
    .select(`
      *,
      profiles (
        full_name,
        email,
        phone
      ),
      membership_plans (
        name,
        price,
        duration
      )
    `)
    .eq("id", payment.id)
    .single();

  if (fetchError) {
    console.error(
      "PAYMENT FETCH ERROR:",
      fetchError
    );

    return {
      data: null,
      error: fetchError,
    };
  }

  /* ===================================================
     2. UPDATE PAYMENT STATUS
  =================================================== */

  const {
    data: approvedPayment,
    error: paymentError,
  } = await supabase
    .from("payments")
    .update({
      status: "Approved",
    })
    .eq("id", payment.id)
    .select(`
      *,
      profiles (
        full_name,
        email,
        phone
      ),
      membership_plans (
        name,
        price,
        duration
      )
    `)
    .single();

  if (paymentError) {
    console.error(
      "PAYMENT STATUS UPDATE ERROR:",
      paymentError
    );

    return {
      data: null,
      error: paymentError,
    };
  }

  /* ===================================================
     3. ACTIVATE MEMBER
  =================================================== */

  const {
    data: activatedProfile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .update({
      membership_id:
        existingPayment.membership_id,

      status: "Active",

      membership_started_at:
        new Date().toISOString(),
    })
    .eq("id", existingPayment.member_id)
    .select()
    .single();

  if (profileError) {
    console.error(
      "PROFILE ACTIVATION ERROR:",
      profileError
    );

    return {
      data: null,
      error: new Error(
        `Payment was approved, but the member could not be activated: ${profileError.message}`
      ),
    };
  }

  /* ===================================================
     4. ARCHIVE PAYMENT
  =================================================== */

  const {
    data: historyPayment,
    error: historyError,
  } = await archivePayment(
    approvedPayment,
    "Approved"
  );

  if (historyError) {
    console.error(
      "PAYMENT ARCHIVE ERROR:",
      historyError
    );

    return {
      data: null,
      error: new Error(
        `Payment was approved but could not be moved to payment history: ${historyError.message}`
      ),
    };
  }

  /* ===================================================
     5. REMOVE FROM ACTIVE PAYMENTS
  =================================================== */

  const {
    error: deleteError,
  } = await removeActivePayment(payment.id);

  if (deleteError) {
    console.error(
      "PAYMENT REMOVAL ERROR:",
      deleteError
    );

    return {
      data: null,
      error: new Error(
        `Payment was archived successfully, but could not be removed from active payments: ${deleteError.message}`
      ),
    };
  }

  /* ===================================================
     6. SUCCESS
  =================================================== */

  return {
    data: {
      payment: approvedPayment,
      profile: activatedProfile,
      history: historyPayment,
    },
    error: null,
  };
}

/* =====================================================
   REJECT PAYMENT
===================================================== */

export async function rejectPayment(payment) {
  const paymentId =
    typeof payment === "string"
      ? payment
      : payment?.id;

  if (!paymentId) {
    return {
      data: null,
      error: new Error("Payment ID is missing."),
    };
  }

  /* ===================================================
     1. GET COMPLETE PAYMENT
  =================================================== */

  const {
    data: existingPayment,
    error: fetchError,
  } = await supabase
    .from("payments")
    .select(`
      *,
      profiles (
        full_name,
        email,
        phone
      ),
      membership_plans (
        name,
        price,
        duration
      )
    `)
    .eq("id", paymentId)
    .single();

  if (fetchError) {
    console.error(
      "PAYMENT FETCH ERROR:",
      fetchError
    );

    return {
      data: null,
      error: fetchError,
    };
  }

  /* ===================================================
     2. ARCHIVE AS REJECTED
  =================================================== */

  const {
    data: historyPayment,
    error: historyError,
  } = await archivePayment(
    existingPayment,
    "Rejected"
  );

  if (historyError) {
    console.error(
      "REJECTED PAYMENT ARCHIVE ERROR:",
      historyError
    );

    return {
      data: null,
      error: new Error(
        `Payment could not be moved to payment history: ${historyError.message}`
      ),
    };
  }

  /* ===================================================
     3. REMOVE ACTIVE PAYMENT
  =================================================== */

  const {
    error: deleteError,
  } = await removeActivePayment(
    paymentId
  );

  if (deleteError) {
    console.error(
      "REJECTED PAYMENT DELETE ERROR:",
      deleteError
    );

    return {
      data: null,
      error: new Error(
        `Payment was saved to history, but could not be removed from active payments: ${deleteError.message}`
      ),
    };
  }

  /* ===================================================
     4. SUCCESS
  =================================================== */

  return {
    data: historyPayment,
    error: null,
  };
}

/* =====================================================
   GET ONE PAYMENT
===================================================== */

export async function getPayment(id) {
  if (!id) {
    return {
      data: null,
      error: new Error("Payment ID is missing."),
    };
  }

  return await supabase
    .from("payments")
    .select(`
      *,
      membership_plans (
        name,
        price,
        duration
      )
    `)
    .eq("id", id)
    .maybeSingle();
}

/* =====================================================
   UPLOAD PAYMENT RECEIPT
===================================================== */

export async function uploadReceipt(file, userId) {
  if (!file) {
    return {
      data: null,
      error: new Error(
        "No receipt file selected."
      ),
    };
  }

  if (!userId) {
    return {
      data: null,
      error: new Error(
        "User ID is missing."
      ),
    };
  }

  const fileExt =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() || "file";

  const fileName =
    `${userId}-${Date.now()}.${fileExt}`;

  const {
    data,
    error,
  } = await supabase.storage
    .from("payment-receipts")
    .upload(
      fileName,
      file,
      {
        cacheControl: "3600",
        upsert: false,
      }
    );

  if (error) {
    console.error(
      "RECEIPT UPLOAD ERROR:",
      error
    );

    return {
      data: null,
      error,
    };
  }

  const {
    data: publicUrlData,
  } = supabase.storage
    .from("payment-receipts")
    .getPublicUrl(data.path);

  return {
    data: {
      path: data.path,
      url: publicUrlData.publicUrl,
    },
    error: null,
  };
}