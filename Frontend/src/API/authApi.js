import { api } from "./axios";

export const register = async (data) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

export const refreshToken = async () => {
  const res = await api.post("/api/auth/refresh-token", {});
  return res.data;
};

export const LogoutUser = async () => {
  const res = await api.post("/api/auth/logout");
  return res.data;
};
export const LogoutAllUser = async () => {
  const res = await api.post("/api/auth/logout-all");
  return res.data;
};
export const sendOtp = async (data) => {
  const res = await api.post("/api/auth/otp", data);
  return res.data;
};
export const verifyotp = async (data) => {
  const res = await api.post("/api/auth/verify", data);
  return res.data;
};
export const getProfile = async () => {
  const res = await api.get("/api/auth/profile");
  return res.data;
};
