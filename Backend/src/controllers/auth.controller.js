import {
  accessTokenCreate,
  refreshAccessToken,
  tokenHash,
  verifyToken,
} from "../config/token.js";
import { sessionModel } from "../models/session.model.js";
import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateOTP, getOTPHTML } from "../utils/utils.js";
import { sendEmail } from "../services/email.service.js";
import { otpModel } from "../models/otp.model.js";

const refreshCookieOptions = {
  httpOnly: false,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerUser = async (req, res) => {
  try {
    await sessionModel.deleteMany({
      revoked: true,
      updatedAt: {
        $lt: new Date(Date.now() - 100000),
      },
    });
    let { username, email, password } = req.body;
    username = username?.trim();
    email = email?.trim().toLowerCase();
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }
    const userExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (userExist) {
      return res.status(409).json({ message: "user already exist" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const otpDoc = await otpModel.findOne({
      email,
      verified: true,
    });

    if (!otpDoc) {
      return res.status(400).json({
        message: "Email not verified via OTP",
      });
    }
    const user = await userModel.create({
      username,
      email,
      password: passwordHash,
    });
    const refreshToken = refreshAccessToken(user.id);
    const refreshTokenHash = tokenHash(refreshToken);
    const session = await sessionModel.create({
      user: user.id,
      refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    const accessToken = accessTokenCreate(user._id, session._id);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    await sessionModel.deleteMany({
      revoked: true,
      updatedAt: {
        $lt: new Date(Date.now() - 100000),
      },
    });
    let { email, password } = req.body;
    email = email?.trim().toLowerCase();
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const refreshToken = refreshAccessToken(user.id);
    const refreshTokenHash = tokenHash(refreshToken);
    const session = await sessionModel.create({
      user: user.id,
      refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    const accessToken = accessTokenCreate(user._id, session._id);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const userProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log("PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = verifyToken(refreshToken);
    const userId = decoded.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }
    const refreshTokenHash = tokenHash(refreshToken);
    const session = await sessionModel.findOne({
      refreshTokenHash,
      revoked: false,
    });
    if (!session) {
      return res.status(400).json({ message: "Invalid session" });
    }
    const accessToken = accessTokenCreate(decoded.id, session._id);
    const newRefreshToken = refreshAccessToken(decoded.id);
    const newRefreshTokenHash = tokenHash(newRefreshToken);
    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const refreshTokenHash = tokenHash(refreshToken);
    const session = await sessionModel.findOne({
      refreshTokenHash,
      revoked: false,
    });
    if (!session) {
      return res.status(400).json({ message: "Invalid session" });
    }
    session.revoked = true;
    await session.save();
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logout successfull" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const logoutAllUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodded = verifyToken(refreshToken);
    const session = await sessionModel.updateMany(
      {
        user: decodded.id,
        revoked: false,
      },
      {
        revoked: true,
      },
    );
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ message: "Logout from all devices successfull" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const sendOtp = async (req, res) => {
  try {
    let { email } = req.body;

    email = email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = generateOTP();
    const html = getOTPHTML(otp);

    const otpHash = await bcrypt.hash(otp, 10);

    await otpModel.deleteMany({ email });

    await otpModel.create({
      email,
      otpHash,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendEmail(
      email,
      "Your OTP Verification Code",
      `Your verification code is ${otp}`,
      html,
    );

    res.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "OTP sending failed",
      error: error.message,
    });
  }
};
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpDoc = await otpModel.findOne({ email });

    if (!otpDoc) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (otpDoc.expiresAt < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const isMatch = await bcrypt.compare(otp, otpDoc.otpHash);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    otpDoc.verified = true;

    await otpDoc.save();

    res.json({
      message: "OTP verified",
    });
  } catch (error) {
    res.status(500).json({
      message: "Verification failed",
    });
  }
};
