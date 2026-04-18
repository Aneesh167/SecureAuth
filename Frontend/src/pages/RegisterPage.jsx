import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { register, sendOtp, verifyotp } from "../API/authApi.js";
import { useAuth } from "../context/ContextApi.jsx";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [otpGenerated, setOtpGenerated] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const { login, loading, setLoading } = useAuth();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = {
      username: formData.get("username"),
      email,
      password: formData.get("password"),
    };
    if (emailRegex.test(data.email)) {
      console.log("Valid email ✅");
    } else {
      console.log("Invalid email ❌");
    }
    try {
      setStatus("");
      setLoading(true);
      const res = await register(data);
      login(res.user, res.accessToken);

      setStatus(res.message || "Registration successful.");

      navigate("/profile");
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          error.message ||
          "Registration failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  const generateOTP = async () => {
    if (!email) {
      setStatus("Enter email first");
      return;
    }

    try {
      setStatus("");

      const res = await sendOtp({ email });

      setStatus(res.message || "OTP sent successfully.");

      setOtpGenerated(true);
    } catch (error) {
      setStatus(
        error.response?.data?.message || error.message || "Can't send OTP",
      );
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      setStatus("Enter OTP first");
      return;
    }

    try {
      setStatus("");

      const res = await verifyotp({ email, otp });

      setStatus(res.message || "OTP verified successfully.");

      setOtpVerified(true);
      setOtpGenerated(false);
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          error.message ||
          "OTP verification failed",
      );
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-3xl border border-white/30 bg-white/5 backdrop-blur-3xl p-10 shadow-2xl"
      >
        <h2 className="text-3xl font-semibold text-[#F4F1EE]">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Username */}
          <label className="block">
            <span className="text-sm text-[#CFCAC6]">Username</span>

            <input
              type="text"
              name="username"
              required
              placeholder="john_doe"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#F4F1EE] placeholder-[#CFCAC6] focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </label>

          {/* Email + OTP */}
          <div className="flex gap-3">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#F4F1EE] placeholder-[#CFCAC6] focus:outline-none focus:ring-2 focus:ring-white/20"
            />

            <button
              type="button"
              onClick={generateOTP}
              disabled={!email || otpVerified}
              className={`min-w-32.5 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300
                ${
                  email && !otpVerified
                    ? "bg-[#5A5856] text-[#F4F1EE]hover:bg-[#2C2B2A]hover:shadow-[0_0_10px_rgba(244,241,238,0.25)]"
                    : "bg-[#5A585680] text-[#F4F1EE80] cursor-not-allowed"
                }`}
            >
              Get OTP
            </button>
          </div>

          {/* OTP Verification */}
          {otpGenerated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#F4F1EE]"
              />

              <button
                type="button"
                onClick={verifyOTP}
                className="min-w-32.5 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold
              bg-[#5A5856] text-[#F4F1EE]
              hover:bg-[#2C2B2A]
                transition-all duration-300"
              >
                Verify
              </button>
            </motion.div>
          )}

          {/* Password */}
          <label className="block">
            <span className="text-sm text-[#CFCAC6]">Password</span>

            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#F4F1EE]"
            />
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={!otpVerified}
            className={`w-full rounded-2xl px-6 py-3 text-base font-semibold transition-all duration-300
${
  otpVerified
    ? "bg-[#5A5856] text-[#F4F1EE] hover:bg-[#2C2B2A] hover:shadow-[0_0_10px_rgba(244,241,238,0.25)]"
    : "bg-[#5A585680] text-[#F4F1EE80] cursor-not-allowed"
}`}
          >
            {loading ? "Registering" : "Register"}
          </button>

          {/* Status */}
          {status && (
            <p className="text-center text-sm text-red-400">{status}</p>
          )}
        </form>

        <p className="mt-6 text-sm text-[#CFCAC6]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#F4F1EE]">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
