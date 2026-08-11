import { useEffect, useMemo, useState } from "react";
import {
  FaUsers,
  FaSearch,
  FaUserShield,
  FaUserCheck,
  FaUserSlash,
  FaTrash,
  FaEye,
  FaUserCog,
  FaCalendarAlt,
  FaPhone,
  FaVenusMars,
  FaCrown,
  FaDumbbell,
} from "react-icons/fa";

import MemberModal from "../../../components/admin/MemberModal";

import {
  getMembers,
  updateMemberStatus,
  changeRole,
  deleteMember,
} from "../../../services/admin";

import {
  promoteMemberToTrainer,
} from "../../../services/trainers";

function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

 async function handlePromoteToTrainer(member) {
  if (!member?.id) {
    alert("Member ID is missing.");
    return;
  }

  const confirmed = window.confirm(
    `Promote ${member.full_name || "this member"} to trainer?`
  );

  if (!confirmed) {
    return;
  }

  try {
    const result =
      await promoteMemberToTrainer(member);

    console.log(
      "Promotion result:",
      result
    );

    if (result.error) {
      console.error(
        "Trainer promotion failed:",
        result.error
      );

      alert(
        `Could not promote trainer:\n\n${result.error.message}`
      );

      return;
    }

    if (result.alreadyTrainer) {
      alert(
        `${member.full_name || "This member"} is already a trainer.`
      );

      await loadMembers();
      return;
    }

    alert(
      `${member.full_name || "Member"} has been promoted to trainer successfully!`
    );

    await loadMembers();

  } catch (error) {
    console.error(
      "Unexpected promotion error:",
      error
    );

    alert(
      `Something went wrong:\n\n${error.message}`
    );
  }
}

  async function loadMembers() {
    setLoading(true);

    const { data, error } = await getMembers();

    if (error) {
      console.error("Failed to load members:", error);
      setMembers([]);
      setLoading(false);
      return;
    }

    setMembers(data || []);
    setLoading(false);
  }

  async function handleSuspend(member) {
    if (member.status === "Deleted") {
      alert("Deleted accounts cannot be suspended.");
      return;
    }

    const newStatus =
      member.status === "Active"
        ? "Suspended"
        : "Active";

    const confirmed = window.confirm(
      member.status === "Active"
        ? `Suspend ${member.full_name}?`
        : `Activate ${member.full_name}?`
    );

    if (!confirmed) return;

    const { error } = await updateMemberStatus(
      member.id,
      newStatus
    );

    if (error) {
      alert(error.message);
      return;
    }

    await loadMembers();
  }

  async function handleRole(member) {
    const newRole =
      member.role === "admin"
        ? "member"
        : "admin";

    const confirmed = window.confirm(
      member.role === "admin"
        ? `Change ${member.full_name}'s role to Member?`
        : `Promote ${member.full_name} to Admin?`
    );

    if (!confirmed) return;

    const { error } = await changeRole(
      member.id,
      newRole
    );

    if (error) {
      alert(error.message);
      return;
    }

    await loadMembers();
  }

  async function handleDelete(member) {
    const confirmed = window.confirm(
      `Permanently delete ${member.full_name}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    const { error } = await deleteMember(member.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Member deleted successfully.");

    await loadMembers();
  }

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return members;

    return members.filter(
      (member) =>
        member.full_name
          ?.toLowerCase()
          .includes(query) ||
        member.email
          ?.toLowerCase()
          .includes(query) ||
        member.phone
          ?.toLowerCase()
          .includes(query) ||
        member.role
          ?.toLowerCase()
          .includes(query) ||
        member.status
          ?.toLowerCase()
          .includes(query) ||
        member.membership_plans?.name
          ?.toLowerCase()
          .includes(query)
    );
  }, [members, search]);

  const totalMembers = members.length;

  const activeMembers = members.filter(
    (member) => member.status === "Active"
  ).length;

  const suspendedMembers = members.filter(
    (member) => member.status === "Suspended"
  ).length;

  const adminMembers = members.filter(
    (member) => member.role === "admin"
  ).length;

  function getInitials(name) {
    if (!name) return "?";

    const words = name.trim().split(" ");

    if (words.length >= 2) {
      return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
      ).toUpperCase();
    }

    return name.charAt(0).toUpperCase();
  }

  function getStatusStyle(status) {
    if (status === "Active") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (status === "Suspended") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (status === "Deleted") {
      return "bg-gray-100 text-gray-600 border-gray-200";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }

  return (
    <div className="space-y-8 pb-10">

      {/* =====================================================
          HERO HEADER
      ===================================================== */}

      <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-black via-zinc-900 to-pink-700 p-7 text-white shadow-xl md:p-10">

        {/* Decorative circles */}

        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-pink-500/20 blur-2xl" />

        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-pink-600/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">

              <FaUsers className="text-2xl text-pink-300" />

            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-300">
              Malkia Fitness
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Member Management
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              Manage members, memberships, account status and
              administrator access from one place.
            </p>

          </div>

          <div className="hidden rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur md:block">

            <p className="text-sm text-white/60">
              Total Members
            </p>

            <p className="mt-1 text-4xl font-black">
              {totalMembers}
            </p>

            <p className="mt-1 text-xs text-pink-200">
              Registered accounts
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}

        <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-400">
                Total Members
              </p>

              <h2 className="mt-2 text-3xl font-black text-gray-900">
                {totalMembers}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                All registered accounts
              </p>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-lg transition group-hover:bg-pink-600">

              <FaUsers />

            </div>

          </div>

        </div>


        {/* Active */}

        <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-400">
                Active Members
              </p>

              <h2 className="mt-2 text-3xl font-black text-green-600">
                {activeMembers}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                Currently active
              </p>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">

              <FaUserCheck />

            </div>

          </div>

        </div>


        {/* Suspended */}

        <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-400">
                Suspended
              </p>

              <h2 className="mt-2 text-3xl font-black text-red-600">
                {suspendedMembers}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                Restricted accounts
              </p>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">

              <FaUserSlash />

            </div>

          </div>

        </div>


        {/* Admins */}

        <div className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold text-gray-400">
                Administrators
              </p>

              <h2 className="mt-2 text-3xl font-black text-pink-600">
                {adminMembers}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                Admin accounts
              </p>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">

              <FaUserShield />

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SEARCH / TOOLBAR
      ===================================================== */}

      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-xl font-black text-gray-900">
              All Members
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredMembers.length} member
              {filteredMembers.length !== 1 ? "s" : ""} displayed
            </p>

          </div>

          <div className="relative w-full lg:w-96">

            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search name, email, phone, plan..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10"
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

        {/* Table Header */}

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 md:px-7">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-600">

              <FaUsers />

            </div>

            <div>

              <h2 className="font-black text-gray-900">
                Member Directory
              </h2>

              <p className="text-xs text-gray-500">
                Manage registered members
              </p>

            </div>

          </div>

          <span className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white">
            {filteredMembers.length} Results
          </span>

        </div>


        {/* Loading */}

        {loading && (

          <div className="flex min-h-80 flex-col items-center justify-center px-6">

            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />

            <p className="mt-5 font-semibold text-gray-700">
              Loading members...
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Fetching member information
            </p>

          </div>

        )}


        {/* Empty */}

        {!loading && filteredMembers.length === 0 && (

          <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-pink-50 text-pink-500">

              <FaUsers className="text-3xl" />

            </div>

            <h3 className="mt-5 text-xl font-black text-gray-900">
              No members found
            </h3>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              {search
                ? "Try changing your search terms."
                : "There are currently no registered members."}
            </p>

          </div>

        )}


        {/* Desktop / Tablet Table */}

        {!loading && filteredMembers.length > 0 && (

          <div className="overflow-x-auto">

            <table className="min-w-287.5 w-full">

              <thead>

                <tr className="bg-black text-left text-xs uppercase tracking-wider text-white">

                  <th className="px-6 py-5 font-bold">
                    Member
                  </th>

                  <th className="px-5 py-5 font-bold">
                    Contact
                  </th>

                  <th className="px-5 py-5 font-bold">
                    Gender
                  </th>

                  <th className="px-5 py-5 font-bold">
                    Membership
                  </th>

                  <th className="px-5 py-5 font-bold">
                    Role
                  </th>

                  <th className="px-5 py-5 font-bold">
                    Status
                  </th>

                  <th className="px-5 py-5 font-bold">
                    Joined
                  </th>

                  <th className="px-6 py-5 text-right font-bold">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredMembers.map((member) => (

                  <tr
                    key={member.id}
                    className="border-b border-gray-100 transition hover:bg-pink-50/30"
                  >

                    {/* Member */}

                    <td className="px-6 py-5">

                      <div className="flex min-w-60 items-center gap-4">

                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-black to-pink-600 font-black text-white shadow-md">

                          {getInitials(
                            member.full_name
                          )}

                          {member.status ===
                            "Active" && (

                              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />

                            )}

                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate font-bold text-gray-900">
                            {member.full_name ||
                              "Unnamed Member"}
                          </h3>

                          <p className="max-w-55 truncate text-xs text-gray-500">
                            {member.email ||
                              "No email"}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Contact */}

                    <td className="px-5 py-5">

                      <div className="flex items-center gap-2 text-sm text-gray-600">

                        <FaPhone className="text-xs text-pink-500" />

                        <span>
                          {member.phone || "—"}
                        </span>

                      </div>

                    </td>


                    {/* Gender */}

                    <td className="px-5 py-5">

                      <div className="flex items-center gap-2 text-sm text-gray-600">

                        <FaVenusMars className="text-xs text-pink-500" />

                        <span>
                          {member.gender || "—"}
                        </span>

                      </div>

                    </td>


                    {/* Membership */}

                    <td className="px-5 py-5">

                      {member.membership_plans?.name ? (

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-pink-600">

                            <FaCrown className="text-xs" />

                          </div>

                          <div>

                            <p className="font-semibold text-gray-900">
                              {member.membership_plans.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              Membership
                            </p>

                          </div>

                        </div>

                      ) : (

                        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
                          No Plan
                        </span>

                      )}

                    </td>


                    {/* Role */}

                    <td className="px-5 py-5">

                      <span
  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
    member.role === "admin"
      ? "bg-blue-100 text-blue-700"
      : member.role === "trainer"
      ? "bg-pink-100 text-pink-700"
      : "bg-gray-100 text-gray-700"
  }`}
>
  {member.role === "admin" && "🛡️"}
  {member.role === "trainer" && "🏋️"}
  {member.role === "member" && "👥"}

  {member.role === "admin"
    ? "admin"
    : member.role === "trainer"
    ? "trainer"
    : "member"}
</span>

                    </td>


                    {/* Status */}

                    <td className="px-5 py-5">

                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                          member.status
                        )}`}
                      >

                        <span className="h-1.5 w-1.5 rounded-full bg-current" />

                        {member.status || "Unknown"}

                      </span>

                    </td>


                    {/* Joined */}

                    <td className="px-5 py-5">

                      <div className="flex items-center gap-2 text-sm text-gray-500">

                        <FaCalendarAlt className="text-xs text-pink-500" />

                        {member.created_at
                          ? new Date(
                            member.created_at
                          ).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                          : "—"}

                      </div>

                    </td>


                    {/* Actions */}

                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        {/* View */}

                        <button
                          type="button"
                          title="View member"
                          onClick={() =>
                            setSelectedMember(member)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600 transition hover:bg-green-600 hover:text-white"
                        >

                          <FaEye />

                        </button>


                        {/* Role */}

                        <button
                          type="button"
                          title={
                            member.role === "admin"
                              ? "Change to member"
                              : "Promote to admin"
                          }
                          onClick={() =>
                            handleRole(member)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                        >

                          <FaUserCog />

                        </button>

                        {/* Trainer */}

                        <button
                          type="button"
                          title="Promote to trainer"
                          onClick={() =>
                            handlePromoteToTrainer(member)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600 transition hover:bg-pink-600 hover:text-white"
                        >
                          <FaDumbbell />
                        </button>


                        {/* Suspend / Activate */}

                        {member.status !==
                          "Deleted" && (

                            <button
                              type="button"
                              title={
                                member.status ===
                                  "Active"
                                  ? "Suspend member"
                                  : "Activate member"
                              }
                              onClick={() =>
                                handleSuspend(member)
                              }
                              className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${member.status ===
                                  "Active"
                                  ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                                  : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                                }`}
                            >

                              {member.status ===
                                "Active" ? (
                                <FaUserSlash />
                              ) : (
                                <FaUserCheck />
                              )}

                            </button>

                          )}


                        {/* Delete */}

                        <button
                          type="button"
                          title="Delete member"
                          onClick={() =>
                            handleDelete(member)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
                        >

                          <FaTrash />

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =====================================================
          FOOTER INFO
      ===================================================== */}

      <div className="rounded-3xl bg-linear-to-r from-black to-pink-700 p-6 text-white shadow-lg md:p-7">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">

                <FaUserShield className="text-pink-300" />

              </div>

              <h3 className="font-black">
                Member Administration
              </h3>

            </div>

            <p className="mt-2 max-w-2xl text-sm text-white/60">
              Use member actions carefully. Role changes,
              suspensions and account deletion affect the
              member's access to Malkia Fitness.
            </p>

          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-3 text-center backdrop-blur">

            <p className="text-xs text-white/50">
              Active Rate
            </p>

            <p className="text-xl font-black text-pink-200">

              {totalMembers > 0
                ? Math.round(
                  (activeMembers /
                    totalMembers) *
                  100
                )
                : 0}
              %

            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          MEMBER MODAL
      ===================================================== */}

      {selectedMember && (

        <MemberModal
          member={selectedMember}
          onClose={() =>
            setSelectedMember(null)
          }
          onUpdated={async () => {
            await loadMembers();
            setSelectedMember(null);
          }}
        />

      )}

    </div>
  );
}

export default Members;