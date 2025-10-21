import { api } from "../../api/api";
import type {
  SignupRequest,
  LoginRequest,
  AuthResponse,
} from "../../types/auth/Auth";
import { API_ROUTES } from "../../shared/constants";

export const signupApi = async (data: SignupRequest): Promise<AuthResponse> => {
  const response = await api.post(API_ROUTES.AUTH.SIGNUP, data);
  return response.data;
};

export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post(API_ROUTES.AUTH.LOGIN, data);
  return response.data;
};

export const sendOtpApi = async (
  email: string,
  purpose: "signup" | "forgot-password",
) => {
  if (purpose === "forgot-password") {
    const response = await api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  }
  const response = await api.post(API_ROUTES.AUTH.SEND_OTP, { email, purpose });
  return response.data;
};

export const verifyOtpApi = async (
  email: string,
  otp: string,
  purpose: "signup" | "forgot-password",
) => {
  const response = await api.post(API_ROUTES.AUTH.VERIFY_OTP, {
    email,
    otp,
    purpose,
  });
  return response.data;
};

export const resetPasswordApi = async (data: {
  email: string;
  newPassword: string;
}) => {
  const response = await api.post(API_ROUTES.AUTH.RESET_PASSWORD, data);
  return response.data;
};

export const logoutApi = async (refreshToken: string) => {
  const response = await api.post(API_ROUTES.AUTH.LOGOUT, { refreshToken });
  return response.data;
};
