import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

import logo from "../../assets/logos/logo-white.png";

import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaDumbbell,
  FaCreditCard,
  FaChartBar,
  FaCog,
  FaMoneyBillWave,
  FaImages,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  const links = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/admin",
      end: true,
    },
    {
      name: "Members",
      icon: <FaUsers />,
      path: "/admin/members",
    },
    {
      name: "Bookings",
      icon: <FaCalendarAlt />,
      path: "/admin/bookings",
    },
    {
      name: "Payments",
      icon: <FaMoneyBillWave />,
      path: "/admin/payments",
    },
    {
      name: "Trainers",
      icon: <FaDumbbell />,
      path: "/admin/trainers",
    },
    {
      name: "Gallery",
      icon: <FaImages />,
      path: "/admin/gallery",
    },
    {
      name: "Membership Plans",
      icon: <FaCreditCard />,
      path: "/admin/plans",
    },
    {
      name: "Reports",
      icon: <FaChartBar />,
      path: "/admin/reports",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/admin/settings",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-black text-white shadow-2xl transition-transform duration-300

        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }

        lg:translate-x-0`}
      >

        {/* Header */}

        <div className="border-b border-zinc-800 p-6">

          <div className="mb-4 flex items-center justify-end lg:hidden">

            <button
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes className="text-2xl" />
            </button>

          </div>

          <img
            src={logo}
            alt="Malkia Fitness"
            className="mx-auto h-20"
          />

          <h2 className="mt-5 text-center text-xl font-bold">
            Malkia Fitness
          </h2>

          <p className="text-center text-pink-500">
            Admin Portal
          </p>

        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-4 py-5">

          <div className="space-y-2">

            {links.map((link) => (

              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-5 py-3.5 transition

                  ${
                    isActive
                      ? "bg-pink-600 text-white"
                      : "text-gray-300 hover:bg-zinc-800 hover:text-white"
                  }`
                }
              >

                <span className="text-xl">
                  {link.icon}
                </span>

                {link.name}

              </NavLink>

            ))}

          </div>

        </nav>

        {/* Logout */}

        <div className="border-t border-zinc-800 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-5 py-4 font-semibold transition hover:bg-red-700"
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </aside>
    </>
  );
}

export default AdminSidebar;