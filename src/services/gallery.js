import { supabase } from "./supabase";

/* ===========================
   Upload Gallery Image
=========================== */

export async function uploadGalleryImage(file) {
  if (!file) {
    return {
      data: null,
      error: null,
    };
  }

  const extension = file.name.split(".").pop();

  const fileName = `gallery-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from("gallery")
    .upload(fileName, file);

  if (error) {
    return {
      data: null,
      error,
    };
  }

  const { data } = supabase.storage
    .from("gallery")
    .getPublicUrl(fileName);

  return {
    data: data.publicUrl,
    error: null,
  };
}

/* ===========================
   Get Images
=========================== */

export async function getGalleryImages() {
  return await supabase
    .from("gallery")
    .select("*")
    .order("created_at", {
      ascending: false,
    });
}

/* ===========================
   Add Image
=========================== */

export async function addGalleryImage(image) {
  return await supabase
    .from("gallery")
    .insert([image])
    .select()
    .single();
}

/* ===========================
   Delete Image
=========================== */

export async function deleteGalleryImage(id) {
  return await supabase
    .from("gallery")
    .delete()
    .eq("id", id);
}