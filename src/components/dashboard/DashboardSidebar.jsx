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
  FaCommentDots,
  FaHistory,
  FaReceipt,
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
      name: "Booking History",
      icon: <FaHistory />,
      path: "/member/history",
    },
    {
      name: "Payments",
      icon: <FaCreditCard />,
      path: "/member/payments",
    },
    {
      name: "Payment History",
      icon: <FaReceipt />,
      path: "/member/payment-history",
    },
    {
      name: "Feedback",
      icon: <FaCommentDots />,
      path: "/member/feedback",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/member/settings",
    },
  ];

  return (
    <>
      {/* =========================
          MOBILE OVERLAY
      ========================== */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* =========================
          SIDEBAR
      ========================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-black text-white shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* =========================
            HEADER / LOGO
        ========================== */}

        <div className="shrink-0 border-b border-zinc-800 p-6">

          <div className="relative">

            {/* Mobile Close Button */}

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-0 top-0 rounded-lg p-2 text-xl text-gray-400 transition hover:bg-zinc-800 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <FaTimes />
            </button>

            {/* Logo */}

            <img
              src={logo}
              alt="Malkia Fitness"
              className="mx-auto h-20 w-auto object-contain"
            />

            {/* Brand */}

            <h2 className="mt-4 text-center text-xl font-bold">
              Malkia Fitness
            </h2>

            <p className="mt-1 text-center text-sm font-medium text-pink-500">
              Member Portal
            </p>

          </div>

        </div>

        {/* =========================
            NAVIGATION
        ========================== */}

        <nav className="min-h-0 flex-1 overflow-y-auto p-4">

          <div className="space-y-2">

            {links.map((link) => (

              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-5 py-4 font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20"
                      : "text-gray-300 hover:bg-zinc-800 hover:text-white"
                  }`
                }
              >

                <span className="flex w-6 shrink-0 justify-center text-lg">
                  {link.icon}
                </span>

                <span>
                  {link.name}
                </span>

              </NavLink>

            ))}

          </div>

        </nav>

        {/* =========================
            LOGOUT
        ========================== */}

        <div className="shrink-0 border-t border-zinc-800 bg-black p-4">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 py-4 font-semibold text-white transition-all duration-200 hover:bg-red-700 active:scale-[0.98]"
          >

            <FaSignOutAlt />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>
    </>
  );
}

export default DashboardSidebar;