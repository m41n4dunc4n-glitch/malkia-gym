import { supabase } from "./supabase";

/* ===========================
   Upload Trainer Image
=========================== */

export async function uploadTrainerImage(file) {
  if (!file) {
    return {
      data: null,
      error: new Error("No image selected."),
    };
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName = `trainer-${Date.now()}.${extension}`;

  const filePath = fileName;

  /*
    Upload image to the trainers bucket.
  */
  const { error: uploadError } = await supabase.storage
    .from("trainers")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error(
      "Trainer image upload error:",
      uploadError
    );

    return {
      data: null,
      error: uploadError,
    };
  }

  /*
    Get public URL.
  */
  const { data } = supabase.storage
    .from("trainers")
    .getPublicUrl(filePath);

  if (!data?.publicUrl) {
    return {
      data: null,
      error: new Error(
        "Image uploaded but a public URL could not be generated."
      ),
    };
  }

  console.log(
    "Trainer image uploaded:",
    data.publicUrl
  );

  return {
    data: data.publicUrl,
    error: null,
  };
}