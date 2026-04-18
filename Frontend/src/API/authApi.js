import { api } from "./axios";

export const register = async (data) => {
  const res = await api.post("/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/login", data);
  return res.data;
};
export const refreshToken = async () => {
  const res = await api.post("/refresh-token");
  return res.data;
};
export const LogoutUser = async () => {
  const res = await api.post("/logout");
  return res.data;
};
export const LogoutAllUser = async () => {
  const res = await api.post("/logout-all");
  return res.data;
};
export const sendOtp = async (data) => {
  const res = await api.post("/otp", data);
  return res.data;
};
export const verifyotp = async (data) => {
  const res = await api.post("/verify", data);
  return res.data;
};
export const getProfile = async () => {
  const res = await api.get("/profile");
  return res.data;
};
