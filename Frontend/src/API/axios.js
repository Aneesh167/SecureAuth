import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// token memory storage
let accessToken = null;
let logoutHandler = null;

// function to update token from context
export const setAccessToken = (token) => {
  accessToken = token;
};
export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};
// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        accessToken = res.data.accessToken;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (err) {
        console.log("Session expired");
      }
    }

    return Promise.reject(error);
  },
);
