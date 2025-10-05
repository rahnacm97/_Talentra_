import api from "../../api/api";
import type { SignupRequest, LoginRequest, AuthResponse } from "../../types/auth/Auth";

export const signupApi = async (data: SignupRequest): Promise<AuthResponse> => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => { 
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const sendOtpApi = async (email: string, purpose: "signup" | "forgot-password") => {
  if (purpose === "forgot-password") {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  }
  const response = await api.post("/auth/send-otp", { email, purpose });
  return response.data;
};


export const verifyOtpApi = async(email: string, otp: string, purpose: "signup" | "forgot-password") => {
  const response = await api.post("/auth/verify-otp", {email, otp, purpose});
  return response.data;
}

export const resetPasswordApi = async (data: { email: string, newPassword: string }) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};
