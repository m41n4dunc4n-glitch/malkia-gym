import { useEffect, useMemo, useState } from "react";
import MemberModal from "../../../components/admin/MemberModal";

import {
  getMembers,
  updateMemberStatus,
  changeRole,
} from "../../../services/admin";

function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    const { data } = await getMembers();
    setMembers(data || []);
  }

  async function handleSuspend(member) {
    const newStatus =
      member.status === "Active"
        ? "Suspended"
        : "Active";

    const { error } =
      await updateMemberStatus(member.id, newStatus);

    if (!error) loadMembers();
  }

  async function handleRole(member) {
    const newRole =
      member.role === "admin"
        ? "member"
        : "admin";

    const { error } =
      await changeRole(member.id, newRole);

    if (!error) loadMembers();
  }

  const filteredMembers = useMemo(() => {
    const query = search.toLowerCase();

    return members.filter(
      (member) =>
        member.full_name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query)
    );
  }, [members, search]);

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-3xl font-bold lg:text-4xl">
            Member Management
          </h1>

          <p className="mt-2 text-gray-500">
            Manage members, roles and memberships.
          </p>

        </div>

        <input
          placeholder="Search member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 lg:w-80"
        />

      </div>

      {/* Table */}

      <div className="overflow-x-auto rounded-3xl bg-white shadow">

        <table className="min-w-275 w-full">

          <thead className="bg-black text-white">

            <tr>

              <th className="p-4 text-left">Member</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Gender</th>
              <th className="p-4 text-left">Membership</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Joined</th>
              <th className="p-4 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredMembers.map((member) => (

              <tr
                key={member.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-600 text-lg font-bold text-white">

                      {member.full_name
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>

                    <div className="min-w-0">

                      <h3 className="font-bold wrap-break-word">
                        {member.full_name}
                      </h3>

                      <p className="text-sm text-gray-500 break-all">
                        {member.email}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="p-4 whitespace-nowrap">
                  {member.phone || "-"}
                </td>

                <td className="p-4 whitespace-nowrap">
                  {member.gender || "-"}
                </td>

                <td className="p-4 whitespace-nowrap">
                  {member.membership_plans?.name || "None"}
                </td>

                <td className="p-4">

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      member.role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {member.role}
                  </span>

                </td>

                <td className="p-4">

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      member.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {member.status}
                  </span>

                </td>

                <td className="p-4 whitespace-nowrap">
                  {new Date(member.created_at).toLocaleDateString()}
                </td>

                <td className="p-4">

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() => setSelectedMember(member)}
                      className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white transition hover:bg-green-700"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleRole(member)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700"
                    >
                      {member.role === "admin"
                        ? "Member"
                        : "Admin"}
                    </button>

                    <button
                      onClick={() => handleSuspend(member)}
                      className={`rounded-lg px-3 py-2 text-sm text-white transition ${
                        member.status === "Active"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {member.status === "Active"
                        ? "Suspend"
                        : "Activate"}
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {selectedMember && (
        <MemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onUpdated={loadMembers}
        />
      )}

    </div>
  );
}

export default Members;