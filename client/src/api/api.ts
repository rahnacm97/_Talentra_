import axios from "axios";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken"); 
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    console.log("message", message);
    if (message === "You have been blocked by admin") {
      toast.error("You have been blocked by admin");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminAccessToken"); 
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    console.log("message", message);
    if (message === "You have been blocked by admin") {
      toast.error("You have been blocked by admin");
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("admin");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;


