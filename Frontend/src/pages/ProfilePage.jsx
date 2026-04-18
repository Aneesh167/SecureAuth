import { Link, useNavigate } from "react-router-dom";
import { LogoutAllUser, LogoutUser } from "../API/authApi";
import { useAuth } from "../context/ContextApi";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await LogoutUser();
      logout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await LogoutAllUser();
      logout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-3xl
        border border-white/30
        bg-white/5 backdrop-blur-3xl
        p-10 shadow-2xl"
      >
        {/* Heading */}
        <h2 className="text-3xl font-semibold text-[#F4F1EE]">Profile</h2>

        <p className="mt-2 text-[#CFCAC6]">
          Your account information is shown below.
        </p>

        {/* USER INFO CARD */}
        <div
          className="mt-8 space-y-5 rounded-2xl
        border border-white/10
        bg-white/5 p-6"
        >
          {/* Username */}
          <div>
            <p className="text-sm text-[#CFCAC6]">Username</p>

            <p className="text-lg font-semibold text-[#F4F1EE]">
              {user?.username || "Not available"}
            </p>
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-[#CFCAC6]">Email</p>

            <p className="text-lg font-semibold text-[#F4F1EE]">
              {user?.email || "Not available"}
            </p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-col gap-3">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full rounded-2xl px-6 py-3
            text-base font-semibold
            bg-[#5A5856]
            text-[#F4F1EE]
            hover:bg-[#2C2B2A]
            hover:shadow-[0_0_10px_rgba(244,241,238,0.25)]
            transition-all duration-300"
          >
            Logout
          </button>

          {/* Logout all devices */}
          <button
            onClick={handleLogoutAll}
            className="w-full rounded-2xl px-6 py-3
            text-base font-semibold
            border border-white/30
            text-[#F4F1EE]
            hover:bg-white/10
            transition-all duration-300"
          >
            Logout from all devices
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
