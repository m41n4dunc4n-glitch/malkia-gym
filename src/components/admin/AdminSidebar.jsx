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
  FaImages,
  FaSignOutAlt,
  FaTimes,
  FaCommentDots,
  FaHistory,
  FaReceipt,
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
      icon: <FaCreditCard />,
      path: "/admin/payments",
    },
    {
      name: "Payment History",
      icon: <FaReceipt />,
      path: "/admin/payment-history",
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
      name: "Feedback",
      icon: <FaCommentDots />,
      path: "/admin/feedback",
    },
    {
      name: "Booking History",
      icon: <FaHistory />,
      path: "/admin/history",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/admin/settings",
    },
  ];

  return (
    <>
      {/* ================================
          MOBILE OVERLAY
      ================================= */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ================================
          SIDEBAR
      ================================= */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-black text-white shadow-2xl transition-transform duration-300 ease-in-out ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
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
              onClick={() => setSidebarOpen(false)}
              aria-label="Close admin navigation"
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
            Admin Portal
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
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-4 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20"
                      : "text-gray-300 hover:bg-zinc-800 hover:text-white"
                  }`
                }
              >
                {/* Icon */}

                <span
                  className={`flex w-5 items-center justify-center text-lg transition-transform duration-200 group-hover:scale-110`}
                >
                  {link.icon}
                </span>

                {/* Label */}

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
    </>
  );
}

export default AdminSidebar;