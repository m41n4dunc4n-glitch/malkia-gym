import { supabase } from "./supabase";

/* =========================================================
   GET ALL TRAINERS
========================================================= */

export async function getTrainers() {
  return await supabase
    .from("trainers")
    .select("*")
    .order("name");
}


/* =========================================================
   GET TRAINER BY USER ID
   Used when a trainer logs into their account.
========================================================= */



/* =========================================================
   ADD TRAINER
========================================================= */

export async function addTrainer(trainer) {
  return await supabase
    .from("trainers")
    .insert([trainer])
    .select()
    .single();
}


/* =========================================================
   UPDATE TRAINER
========================================================= */

export async function updateTrainer(id, trainer) {
  return await supabase
    .from("trainers")
    .update(trainer)
    .eq("id", id)
    .select()
    .single();
}


/* =========================================================
   DELETE TRAINER
========================================================= */

export async function deleteTrainer(id) {
  return await supabase
    .from("trainers")
    .delete()
    .eq("id", id);
}


/* =========================================================
   LINK TRAINER TO USER ACCOUNT
========================================================= */

export async function linkTrainerToUser(trainerId, userId) {
  return await supabase
    .from("trainers")
    .update({
      user_id: userId,
    })
    .eq("id", trainerId)
    .select()
    .single();
}


/* =========================================================
   REMOVE TRAINER ACCOUNT LINK
========================================================= */

export async function unlinkTrainerFromUser(trainerId) {
  return await supabase
    .from("trainers")
    .update({
      user_id: null,
    })
    .eq("id", trainerId)
    .select()
    .single();
}

/* ===========================
   Promote Member To Trainer
=========================== */

/* ===========================
   Promote Member To Trainer
=========================== */

/* ===========================
   Promote Member To Trainer
=========================== */

export async function promoteMemberToTrainer(member) {
  if (!member?.id) {
    return {
      data: null,
      error: new Error("Member ID is missing."),
    };
  }

  // Check whether this member already has a trainer profile
  const { data: existingTrainer, error: checkError } =
    await supabase
      .from("trainers")
      .select("id, user_id, name")
      .eq("user_id", member.id)
      .maybeSingle();

  if (checkError) {
    console.error(
      "Trainer check failed:",
      checkError
    );

    return {
      data: null,
      error: checkError,
    };
  }

  // Already a trainer
  if (existingTrainer) {
    return {
      data: existingTrainer,
      error: null,
      alreadyTrainer: true,
    };
  }

  const trainerData = {
    user_id: member.id,

    name:
      member.full_name ||
      "New Trainer",

    specialty:
      "Fitness Trainer",

    experience: 0,

    phone:
      member.phone || "",

    email:
      member.email || "",

    bio: "",

    image_url:
      member.avatar_url || "",

    morning_start: "08:00",
    morning_end: "12:00",

    lunch_start: "12:00",
    lunch_end: "14:00",

    evening_start: "14:00",
    evening_end: "20:00",

    max_clients: 1,

    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
  };

  console.log(
    "Creating trainer:",
    trainerData
  );

  // Create trainer profile
  const {
    data: trainer,
    error: trainerError,
  } = await supabase
    .from("trainers")
    .insert([trainerData])
    .select()
    .single();

  if (trainerError) {
    console.error(
      "Trainer creation failed:",
      trainerError
    );

    return {
      data: null,
      error: trainerError,
    };
  }

  // Change member role to trainer
  const {
    error: roleError,
  } = await supabase
    .from("profiles")
    .update({
      role: "trainer",
    })
    .eq("id", member.id);

  if (roleError) {
    console.error(
      "Role update failed:",
      roleError
    );

    // Remove trainer profile if role update failed
    await supabase
      .from("trainers")
      .delete()
      .eq("id", trainer.id);

    return {
      data: null,
      error: roleError,
    };
  }

  console.log(
    "Trainer promotion successful:",
    trainer
  );

  return {
    data: trainer,
    error: null,
    alreadyTrainer: false,
  };
}

export async function updateMyTrainerProfile(
  userId,
  trainerData
) {
  return await supabase
    .from("trainers")
    .update({
      phone: trainerData.phone,
      image_url: trainerData.image_url,
      monday: trainerData.monday,
      tuesday: trainerData.tuesday,
      wednesday: trainerData.wednesday,
      thursday: trainerData.thursday,
      friday: trainerData.friday,
      saturday: trainerData.saturday,
      sunday: trainerData.sunday,
    })
    .eq("user_id", userId)
    .select()
    .single();
}

export async function getTrainerByUserId(userId) {
  return await supabase
    .from("trainers")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
}

export async function updateTrainerSelf(id, updates) {
  return await supabase
    .from("trainers")
    .update({
      phone: updates.phone,
      image_url: updates.image_url,
      working_days: updates.working_days,
    })
    .eq("id", id)
    .select()
    .single();
}

export async function getTrainerBookings(trainerId) {
  return await supabase
    .from("bookings")
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
    .eq("trainer_id", trainerId)
    .eq("admin_deleted", false)
    .order("booking_date", {
      ascending: true,
    })
    .order("booking_time", {
      ascending: true,
    });
}

export async function completeTrainerBooking(id) {
  // First check what Supabase sees for this booking
  const { data: booking, error: checkError } = await supabase
    .from("bookings")
    .select("id, status, trainer_id")
    .eq("id", id)
    .maybeSingle();

  console.log("BOOKING BEFORE COMPLETE:", booking);
  console.log("CHECK ERROR:", checkError);

  if (checkError) {
    return {
      data: null,
      error: checkError,
    };
  }

  if (!booking) {
    return {
      data: null,
      error: new Error("Booking not found."),
    };
  }

  console.log("DATABASE STATUS:", booking.status);

  // Don't require Approved here.
  const { data, error } = await supabase
    .from("bookings")
    .update({
      status: "Completed",
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  console.log("COMPLETE BOOKING RESULT:", {
    data,
    error,
  });

  return {
    data,
    error,
  };
}

export async function updateTrainerProfile(trainerId, updates) {
  const allowedUpdates = {
    phone: updates.phone,
    image_url: updates.image_url,
  };

  const { data, error } = await supabase
    .from("trainers")
    .update(allowedUpdates)
    .eq("id", trainerId)
    .select()
    .single();

  return {
    data,
    error,
  };
}

export async function uploadTrainerProfilePicture(userId, file) {
  const extension = file.name.split(".").pop();

  const filePath = `${userId}/profile.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("trainer-profiles")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return {
      data: null,
      error: uploadError,
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("trainer-profiles")
    .getPublicUrl(filePath);

  return {
    data: {
      publicUrl,
      filePath,
    },
    error: null,
  };
}

export async function deleteCompletedTrainerBooking(bookingId) {
  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId)
    .select()
    .single();

  return {
    data,
    error,
  };
}