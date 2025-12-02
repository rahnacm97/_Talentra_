import axios from "axios";
import { toast } from "react-toastify";
import { store } from "../app/store";
import { logout, setBlocked } from "../features/auth/authSlice";
import { FRONTEND_ROUTES } from "../shared/constants/constants";
import { useNavigationStore } from "../utils/navigate";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const accessToken = state.auth.accessToken;

  if (config.url?.includes("/auth/refresh-token")) return config;

  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const resp = error.response;
    const navigate = useNavigationStore.getState().navigate;

    // Check for subscription required error
    const isSubscriptionRequired =
      resp?.status === 403 && resp?.data?.code === "SUBSCRIPTION_REQUIRED";

    if (isSubscriptionRequired) {
      toast.error(
        resp?.data?.message || "Subscription required to access this feature.",
      );
      if (navigate) {
        navigate(FRONTEND_ROUTES.EMPLOYERRBILLING);
      } else {
        window.location.href = FRONTEND_ROUTES.EMPLOYERRBILLING;
      }
      return Promise.reject(error);
    }

    const isBlocked =
      resp?.status === 403 &&
      (resp?.data?.blocked === true ||
        resp?.data?.message?.toLowerCase().includes("block"));

    if (isBlocked) {
      store.dispatch(setBlocked(true));
      toast.error(
        resp?.data?.message || "Your account has been blocked by admin.",
      );
      return Promise.reject(error);
    }
    if (
      resp?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token") &&
      !originalRequest.url?.includes("/auth/logout") &&
      !originalRequest.url?.includes("/admin/logout") &&
      !originalRequest.url?.includes("/admin/login") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          },
        );
        const { accessToken, user } = refreshResponse.data;
        store.dispatch({
          type: "auth/loginSuccess",
          payload: {
            user: store.getState().auth.user || user,
            accessToken,
            refreshToken: null,
          },
        });
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/",
            );
        });
        if (navigate) navigate(FRONTEND_ROUTES.LOGIN, { replace: true });
        else window.location.href = FRONTEND_ROUTES.LOGIN;
        return Promise.reject(refreshError);
      }
    }

    if (!originalRequest.url?.includes("/auth/login")) {
      const msg = resp?.data?.message || "An error occurred";
      toast.error(msg);
    }

    return Promise.reject(error);
  },
);

export default api;
