import { supabase } from "./supabase";

/* =====================================================
   GET PAYMENT HISTORY
===================================================== */

export async function getPaymentHistory() {
  const {
    data,
    error,
  } = await supabase
    .from("payment_history")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  console.log(
    "PAYMENT HISTORY DATA:",
    data
  );

  console.log(
    "PAYMENT HISTORY ERROR:",
    error
  );

  return {
    data: data || [],
    error,
  };
}

/* =====================================================
   DELETE PAYMENT HISTORY
===================================================== */

export async function deletePaymentHistory(id) {
  if (!id) {
    return {
      error: new Error(
        "Payment history ID is missing."
      ),
    };
  }

  const {
    error,
  } = await supabase
    .from("payment_history")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "DELETE PAYMENT HISTORY ERROR:",
      error
    );
  }

  return {
    error,
  };
}