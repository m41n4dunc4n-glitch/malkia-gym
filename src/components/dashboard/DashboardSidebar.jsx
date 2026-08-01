import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

import logo from "../../assets/logos/logo-white.png";

import {
  FaHome,
  FaUser,
  FaDumbbell,
  FaCalendarAlt,
  FaCreditCard,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

function DashboardSidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login", {
      replace: true,
    });
  }

  const links = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/member",
      end: true,
    },
    {
      name: "My Profile",
      icon: <FaUser />,
      path: "/member/profile",
    },
    {
      name: "Membership",
      icon: <FaDumbbell />,
      path: "/member/membership",
    },
    {
      name: "Bookings",
      icon: <FaCalendarAlt />,
      path: "/member/bookings",
    },
    {
      name: "Payments",
      icon: <FaCreditCard />,
      path: "/member/payments",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/member/settings",
    },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-72 flex-col bg-black text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 p-6 lg:block">

          <div className="w-full">

            <img
              src={logo}
              alt="Malkia Fitness"
              className="mx-auto h-20 w-auto"
            />

            <h2 className="mt-4 text-center text-xl font-bold">
              Malkia Fitness
            </h2>

            <p className="text-center text-pink-500">
              Member Portal
            </p>

          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl lg:hidden"
          >
            <FaTimes />
          </button>

        </div>

        <nav className="flex-1 space-y-2 p-4">

          {links.map((link) => (

            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-5 py-4 transition ${
                  isActive
                    ? "bg-pink-600"
                    : "hover:bg-zinc-800"
                }`
              }
            >
              <span className="text-xl">
                {link.icon}
              </span>

              {link.name}

            </NavLink>

          ))}

        </nav>

        <div className="border-t border-zinc-800 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 py-4 font-semibold transition hover:bg-red-700"
          >
            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </aside>
    </>
  );
}

export default DashboardSidebar;