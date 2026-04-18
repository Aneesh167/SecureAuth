import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { getProfile, refreshToken } from "../API/authApi.js";
import { useContext } from "react";
import { setAccessToken as setAxiosToken } from "../API/axios";
import { setLogoutHandler } from "../API/axios";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (user, token) => {
    setUser(user);
    setAccessToken(token);
    setAxiosToken(token);
  };
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setAxiosToken(null);
  };
  useEffect(() => {
    setLogoutHandler(logout);
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const data = await refreshToken();
        setAccessToken(data.accessToken);
        setAxiosToken(data.accessToken);
        const profile = await getProfile();
        setUser(profile.user);
      } catch (error) {
        console.log("not logged in");
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        setUser,
        setAccessToken,
        login,
        logout,
        setLoading,
        user,
        accessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
