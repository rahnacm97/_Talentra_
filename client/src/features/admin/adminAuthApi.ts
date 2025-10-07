import axios from "axios";
import type { AdminLoginRequest, AdminAuthResponse } from "../../types/admin/admin.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginAdmin = async (data: AdminLoginRequest): Promise<AdminAuthResponse> => {
  const response = await axios.post<AdminAuthResponse>(
    `${API_BASE_URL}/admin/login`,
    data,
    { withCredentials: true }
  );
  return response.data;
};

export const adminLogoutApi = async (refreshToken: string) => {
  const response = await axios.post(`${API_BASE_URL}/admin/logout`, { refreshToken });
  return response.data;
};
