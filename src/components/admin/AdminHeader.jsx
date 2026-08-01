import { FaBars } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

function AdminHeader({ setSidebarOpen }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-10 lg:py-6">

      <div className="flex items-center gap-4">

        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
        >
          <FaBars className="text-2xl" />
        </button>

        <div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Administrator
          </h1>

          <p className="text-sm text-gray-500 break-all sm:text-base">
            Welcome, {user?.email}
          </p>

        </div>

      </div>

    </header>
  );
}

export default AdminHeader;