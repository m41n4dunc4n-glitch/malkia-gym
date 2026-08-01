import { useEffect, useState } from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import QuickActions from "../../components/dashboard/QuickActions";

import { useAuth } from "../../hooks/useAuth";
import { getProfile } from "../../services/profile";

function Member() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      const { data } = await getProfile(user.id);

      setProfile(data);

      setLoading(false);
    }

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-pink-600 border-t-transparent"></div>

          <p className="mt-5 text-lg font-medium text-gray-600">
            Loading Dashboard...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Welcome */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Welcome Back 👋
          </h1>

          <h2 className="mt-2 text-2xl font-bold text-pink-600 sm:text-3xl wrap-break-word">
            {profile?.full_name}
          </h2>

          <p className="mt-3 text-gray-500">
            Here's a quick overview of your account.
          </p>

        </div>

      </div>

      {/* Dashboard Cards */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

        <DashboardCard
          title="Membership"
          value={
            profile?.membership_id
              ? "Active"
              : "No Membership"
          }
        />

        <DashboardCard
          title="Role"
          value={profile?.role || "Member"}
        />

        <DashboardCard
          title="Email"
          value={profile?.email}
        />

      </div>

      {/* Quick Actions */}

      <QuickActions />

    </div>
  );
}

export default Member;