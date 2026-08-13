import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useState } from "react";

import logo from "../../assets/logos/logo-white.png";

import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaTimes,
    FaSignOutAlt,
} from "react-icons/fa";

function TrainerSidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  const links = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/trainer",
      end: true,
    },
    {
      name: "My Profile",
      icon: <FaUser />,
      path: "/trainer/profile",
    },
    {
      name: "My Bookings",
      icon: <FaCalendarAlt />,
      path: "/trainer/bookings",
    },
  ];

  return (
    <>
      {/* ================================
          MOBILE OVERLAY
      ================================= */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ================================
          SIDEBAR
      ================================= */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-black text-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* ================================
            HEADER
        ================================= */}

        <div className="border-b border-zinc-800 px-6 pb-6 pt-5">

          {/* Mobile Close */}

          <div className="mb-3 flex items-center justify-end lg:hidden">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close trainer navigation"
              className="rounded-lg p-2 text-gray-400 transition hover:bg-zinc-800 hover:text-white"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Logo */}

          <div className="flex justify-center">
            <img
              src={logo}
              alt="Malkia Fitness"
              className="h-20 w-auto object-contain"
            />
          </div>

          {/* Brand */}

          <h2 className="mt-4 text-center text-xl font-bold">
            Malkia Fitness
          </h2>

          <p className="mt-1 text-center text-sm font-medium text-pink-500">
            Trainer Portal
          </p>
        </div>

        {/* ================================
            NAVIGATION
        ================================= */}

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-1.5">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-4 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20"
                      : "text-gray-300 hover:bg-zinc-800 hover:text-white"
                  }`
                }
              >
                <span className="flex w-5 items-center justify-center text-lg transition-transform duration-200 group-hover:scale-110">
                  {link.icon}
                </span>

                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* ================================
            LOGOUT
        ================================= */}

        <div className="border-t border-zinc-800 p-4">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-5 py-3.5 font-semibold text-white transition-all duration-200 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20"
                  >
                    <FaSignOutAlt />
        
                    <span>Logout</span>
                  </button>
                </div>
      </aside>

      {/* ================================
          MOBILE MENU BUTTON
      ================================= */}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed left-4 top-4 z-40 rounded-xl bg-black px-4 py-3 text-white shadow-lg lg:hidden"
          aria-label="Open trainer navigation"
        >
          ☰
        </button>
      )}
    </>
  );
}

export default TrainerSidebar;