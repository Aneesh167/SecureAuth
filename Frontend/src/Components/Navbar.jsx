import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/ContextApi";
import { LogoutUser } from "../API/authApi";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // logout handler
  const handleLogout = async () => {
    try {
      await LogoutUser();
      logout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // prevent navbar flicker during session restore
  if (loading) return null;

  return (
    <header className="border-b border-white/10 backdrop-blur-lg">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-[#F4F1EE]"
        >
          SecureAuth
        </Link>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#F4F1EE] text-xl"
        >
          ☰
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">

          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-[#5A5856] text-[#F4F1EE]"
                  : "text-[#CFCAC6] hover:text-[#F4F1EE]"
              }`
            }
          >
            Home
          </NavLink>


          {/* Profile + Logout when logged in */}
          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-[#5A5856] text-[#F4F1EE]"
                      : "border border-[#5A5856] text-[#F4F1EE] hover:bg-[#5A585620]"
                  }`
                }
              >
                Profile
              </NavLink>

              <button
                onClick={handleLogout}
                className="rounded-xl px-5 py-2 text-sm font-semibold
                bg-[#5A5856] text-[#F4F1EE]
                hover:bg-[#2C2B2A]
                transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-[#5A5856] text-[#F4F1EE]"
                    : "border border-[#5A5856] text-[#F4F1EE] hover:bg-[#5A585620]"
                }`
              }
            >
              Login
            </NavLink>
          )}
        </nav>
      </motion.div>


      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden flex flex-col gap-3 px-4 pb-4"
        >

          {/* Home */}
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-[#F4F1EE]"
          >
            Home
          </NavLink>


          {user ? (
            <>
              {/* Profile */}
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="text-[#F4F1EE]"
              >
                Profile
              </NavLink>

              {/* Logout */}
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-left text-[#F4F1EE]"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-[#F4F1EE]"
            >
              Login
            </NavLink>
          )}

        </motion.div>
      )}
    </header>
  );
};

export default Navbar;