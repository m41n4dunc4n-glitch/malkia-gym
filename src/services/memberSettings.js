import { supabase } from "./supabase";

export async function changePassword(password) {
  return await supabase.auth.updateUser({
    password,
  });
}