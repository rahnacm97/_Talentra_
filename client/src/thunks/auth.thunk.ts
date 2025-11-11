import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { API_ROUTES } from "../shared/constants";
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
} from "../types/auth/Auth";

export const signup = createAsyncThunk<
  AuthResponse,
  SignupRequest,
  { rejectValue: string }
>("auth/signup", async (signupData, { rejectWithValue }) => {
  try {
    const response = await api.post(API_ROUTES.AUTH.SIGNUP, signupData);
    return {
      user: {
        _id: response.data.user._id,
        email: response.data.user.email,
        name: response.data.user.name,
        role: response.data.user.role,
        blocked: response.data.user.blocked || false,
        emailVerified: response.data.user.emailVerified || false,
      },
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Signup failed");
  }
});

export const login = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (loginData, { rejectWithValue }) => {
  try {
    const response = await api.post(API_ROUTES.AUTH.LOGIN, loginData);
    return {
      user: {
        _id: response.data.user._id,
        email: response.data.user.email,
        name: response.data.user.name,
        role: response.data.user.role,
        blocked: response.data.user.blocked || false,
        emailVerified: response.data.user.emailVerified || false,
      },
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const adminLogin = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/adminLogin", async (loginData, { rejectWithValue }) => {
  try {
    const response = await api.post(API_ROUTES.ADMIN.ADMINLOGIN, loginData);
    return {
      user: {
        _id: response.data.user._id,
        email: response.data.user.email,
        name: response.data.user.name,
        role: response.data.user.role,
        blocked: response.data.user.blocked || false,
        emailVerified: response.data.user.emailVerified || true,
      },
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Admin login failed",
    );
  }
});

export const sendOtp = createAsyncThunk<
  void,
  { email: string; purpose: "signup" | "forgot-password" },
  { rejectValue: string }
>("auth/sendOtp", async (otpData, { rejectWithValue }) => {
  try {
    await api.post(API_ROUTES.AUTH.SEND_OTP, otpData);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to send OTP",
    );
  }
});

export const verifyOtp = createAsyncThunk<
  void,
  { email: string; otp: string; purpose: "signup" | "forgot-password" },
  { rejectValue: string }
>("auth/verifyOtp", async ({ email, otp, purpose }, { rejectWithValue }) => {
  try {
    await api.post(API_ROUTES.AUTH.VERIFY_OTP, { email, otp, purpose });
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to verify OTP",
    );
  }
});

export const serverLogout = createAsyncThunk<
  void,
  { role?: "Candidate" | "Employer" | "Admin" },
  { rejectValue: string }
>("auth/serverLogout", async ({ role }, { rejectWithValue }) => {
  try {
    const logoutRoute =
      role === "Admin" ? API_ROUTES.ADMIN.ADMINLOGOUT : API_ROUTES.AUTH.LOGOUT;

    await api.post(logoutRoute, {}, { withCredentials: true });
    return;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

export const refreshToken = createAsyncThunk<
  { accessToken: string },
  { refreshToken: string },
  { rejectValue: string }
>("auth/refreshToken", async ({ refreshToken }, { rejectWithValue }) => {
  try {
    const response = await api.post(API_ROUTES.AUTH.REFRESH, { refreshToken });
    return { accessToken: response.data.accessToken };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Token refresh failed",
    );
  }
});
