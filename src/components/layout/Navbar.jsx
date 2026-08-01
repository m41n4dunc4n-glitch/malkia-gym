import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

import logo from "../../assets/logos/logo-white.png";

function Navbar() {
  const [open, setOpen] = useState(false);

  const location = useLocation();

  const links = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Membership",
      path: "/membership",
    },
    {
      name: "Trainers",
      path: "/trainers",
    },
    {
      name: "Gallery",
      path: "/gallery",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  useEffect(() => {
    // Close the mobile menu when the route changes and scroll to top
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // only run when the pathname changes
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 h-20 w-full border-b border-zinc-800 bg-black/95 backdrop-blur-md">

        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">

          <NavLink to="/">
            <img
              src={logo}
              alt="Malkia Fitness"
              className="h-10 w-auto sm:h-12 lg:h-14"
            />
          </NavLink>

          {/* Desktop Navigation */}

          <div className="hidden items-center gap-8 lg:flex">

            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-pink-500"
                    : "text-white transition hover:text-pink-500"
                }
              >
                {link.name}
              </NavLink>
            ))}

            <NavLink
              to="/login"
              className="rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700"
            >
              Login
            </NavLink>

          </div>

          {/* Mobile Button */}

          <button
            onClick={() => setOpen(true)}
            className="text-2xl text-white lg:hidden"
          >
            <FaBars />
          </button>

        </div>

      </nav>

      {/* Overlay */}

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 transition-all duration-300 lg:hidden ${
          open
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* Mobile Drawer */}

      <div
        className={`fixed right-0 top-0 z-50 h-screen w-72 bg-black shadow-2xl transition-transform duration-300 lg:hidden ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        <div className="flex items-center justify-between border-b border-zinc-800 p-6">

          <img
            src={logo}
            alt="Malkia Fitness"
            className="h-12 w-auto"
          />

          <button
            onClick={() => setOpen(false)}
            className="text-2xl text-white"
          >
            <FaTimes />
          </button>

        </div>

        <div className="flex flex-col p-6">

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `mb-2 rounded-xl px-5 py-4 text-lg transition ${
                  isActive
                    ? "bg-pink-600 font-semibold text-white"
                    : "text-white hover:bg-zinc-900"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <NavLink
            to="/login"
            className="mt-6 rounded-xl bg-pink-600 py-4 text-center font-semibold text-white transition hover:bg-pink-700"
          >
            Login
          </NavLink>

        </div>

      </div>
    </>
  );
}

export default Navbar;