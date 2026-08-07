import { supabase } from "./supabase";

/* =====================================================
   MEMBER
===================================================== */

export async function createPayment(payment) {
  return await supabase
    .from("payments")
    .insert([payment])
    .select();
}


/* =====================================================
   GET MEMBER PAYMENTS
===================================================== */

export async function getMyPayments(userId) {
  return await supabase
    .from("payments")
    .select(`
      *,
      membership_plans(
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
  return await supabase
    .from("payments")
    .select(`
      *,
      membership_plans(
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
   ADMIN
===================================================== */

export async function getAllPayments() {
  return await supabase
    .from("payments")
    .select(`
      *,
      profiles(
        full_name,
        email,
        phone
      ),
      membership_plans(
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
   APPROVE PAYMENT
===================================================== */

export async function approvePayment(payment) {
  // 1. Update payment status
  const { error: paymentError } = await supabase
    .from("payments")
    .update({
      status: "Approved",
    })
    .eq("id", payment.id);

  if (paymentError) {
    console.error("Payment approval failed:", paymentError);

    return {
      data: null,
      error: paymentError,
    };
  }

  // 2. Activate the member
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      membership_id: payment.membership_id,
      status: "Active",
      membership_started_at: new Date().toISOString(),
    })
    .eq("id", payment.member_id);

  if (profileError) {
    console.error("Member activation failed:", profileError);

    return {
      data: null,
      error: profileError,
    };
  }

  return {
    data: {
      paymentId: payment.id,
      memberId: payment.member_id,
    },
    error: null,
  };
}

/* =====================================================
   REJECT PAYMENT
===================================================== */

export async function rejectPayment(id) {

  if (!id) {
    return {
      data: null,
      error: new Error("Payment ID is missing."),
    };
  }

  return await supabase
    .from("payments")
    .update({
      status: "Rejected",
    })
    .eq("id", id)
    .select();
}


/* =====================================================
   GET ONE PAYMENT
===================================================== */

export async function getPayment(id) {

  return await supabase
    .from("payments")
    .select(`
      *,
      membership_plans(
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
      error: new Error("No receipt file selected."),
    };
  }

  if (!userId) {
    return {
      data: null,
      error: new Error("User ID is missing."),
    };
  }


  const fileExt =
    file.name.split(".").pop()?.toLowerCase() || "file";

  const fileName =
    `${userId}-${Date.now()}.${fileExt}`;


  const {
    data,
    error,
  } = await supabase.storage
    .from("payment-receipts")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });


  if (error) {

    console.error(
      "Receipt upload failed:",
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