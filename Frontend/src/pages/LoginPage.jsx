import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser } from "../API/authApi";
import { useAuth } from "../context/ContextApi";

const LoginPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const { login, loading, setLoading } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      setLoading(true);

      const res = await loginUser(data);

      login(res.user, res.accessToken);

      navigate("/profile");
    } catch (error) {
      setStatus(
        error.response?.data?.message || error.message || "Login failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-3xl border border-white/30 
        bg-white/5 backdrop-blur-3xl p-10 shadow-2xl"
      >
        <h2 className="text-3xl font-semibold text-[#F4F1EE]">Welcome Back</h2>

        <p className="mt-2 text-[#CFCAC6]">
          Login using your registered email and password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email */}
          <label className="block">
            <span className="text-sm text-[#CFCAC6]">Email</span>

            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-white/10 
              bg-white/5 px-4 py-3 text-[#F4F1EE] 
              placeholder-[#CFCAC6]
              focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </label>

          {/* Password */}
          <label className="block">
            <span className="text-sm text-[#CFCAC6]">Password</span>

            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-white/10 
              bg-white/5 px-4 py-3 text-[#F4F1EE]"
            />
          </label>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl px-6 py-3 text-base font-semibold
          bg-[#5A5856]
          text-[#F4F1EE]
          hover:bg-[#2C2B2A]
          transition-all duration-300"
          >
            {loading ? "Logging..." : "Login"}
          </button>
        </form>

        {/* Error */}
        {status && (
          <p className="mt-6 text-center text-sm text-red-400">{status}</p>
        )}

        {/* Register Link */}
        <p className="mt-6 text-sm text-[#CFCAC6]">
          Need an account?{" "}
          <Link to="/register" className="font-semibold text-[#F4F1EE]">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
