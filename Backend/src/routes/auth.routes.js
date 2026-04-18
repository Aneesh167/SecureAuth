import { Router } from "express";
import {
  loginUser,
  logoutAllUser,
  logoutUser,
  refreshToken,
  registerUser,
  sendOtp,
  userProfile,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middeleware.js";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, userProfile);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);
router.post("/logout-all", logoutAllUser);
router.post("/otp", sendOtp);
router.post("/verify", verifyOtp);

export default router;
