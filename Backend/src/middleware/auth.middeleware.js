import { verifyToken } from "../config/token.js";

export const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token",
      });
    }

    const decoded = verifyToken(token);

    if (!decoded?.id) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};