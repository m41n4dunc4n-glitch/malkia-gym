import { useEffect, useState } from "react";
import { getProfile } from "../../services/profile";
import { useAuth } from "../../hooks/useAuth";

function TrainerHeader() {
  const { user } = useAuth();

  const [name, setName] = useState("Trainer");

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;

      const { data } = await getProfile(user.id);

      if (data?.full_name) {
        setName(data.full_name);
      }
    }

    loadProfile();
  }, [user]);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="pl-14 lg:pl-0">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-pink-600">
            Trainer Portal
          </p>

          <h2 className="text-xl font-bold text-gray-900">
            Welcome, {name}
          </h2>
        </div>

        <div className="hidden rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700 sm:block">
          🏋️ Trainer
        </div>
      </div>
    </header>
  );
}

export default TrainerHeader;