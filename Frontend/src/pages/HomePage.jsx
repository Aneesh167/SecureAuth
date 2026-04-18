import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-[85vh] px-6 py-16 text-[#F4F1EE]">
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-4xl text-center"
      >
        <h1 className="text-5xl font-bold">Authentication System</h1>

        <p className="mt-5 text-lg text-[#CFCAC6]">
          A secure authentication system with OTP verification, JWT login
          sessions and protected profile routes.
        </p>

        {/* CTA BUTTONS */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/register"
            className="rounded-2xl px-6 py-3 font-semibold
            bg-[#5A5856] hover:bg-[#2C2B2A]
            transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </motion.div>

      {/* ABOUT PROJECT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mx-auto mt-16 max-w-4xl rounded-3xl
        border border-white/20 bg-white/5
        backdrop-blur-3xl p-8"
      >
        <h2 className="text-2xl font-semibold">About This Project</h2>

        <p className="mt-4 text-[#CFCAC6] leading-relaxed">
          This project demonstrates a complete authentication flow including OTP
          verification, JWT-based login system, refresh token handling,
          protected routes and session management using MongoDB.
        </p>
      </motion.div>

      {/* FEATURES SECTION */}
      <div className="mx-auto mt-16 max-w-5xl grid md:grid-cols-3 gap-6">
        {[
          "Email OTP Verification",
          "JWT Authentication",
          "Protected Profile Route",
          "Session Management",
          "Secure Password Hashing",
          "Refresh Token System",
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="rounded-2xl border border-white/20
            bg-white/5 backdrop-blur-2xl
            p-6 text-center"
          >
            {feature}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
