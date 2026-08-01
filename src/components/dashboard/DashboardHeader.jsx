import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { getProfile } from "../../services/profile";

function DashboardHeader({
  setSidebarOpen,
}) {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      const { data } = await getProfile(user.id);

      setProfile(data);
    }

    loadProfile();
  }, [user]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-5 shadow-sm sm:px-6 lg:px-8">

      <div className="flex items-center gap-4">

        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg border p-3 lg:hidden"
        >
          <FaBars />
        </button>

        <div>

          <h2 className="text-2xl sm:text-3xl font-bold">
            Member Dashboard
          </h2>

          <p className="text-sm sm:text-base text-gray-500">
            Welcome back,
            {" "}
            {profile?.full_name || "Member"}
          </p>

        </div>

      </div>

      <div className="hidden sm:block text-right">

        <p className="font-semibold">
          {profile?.email}
        </p>

        <p className="capitalize text-sm text-gray-500">
          {profile?.role}
        </p>

      </div>

    </header>
  );
}

export default DashboardHeader;