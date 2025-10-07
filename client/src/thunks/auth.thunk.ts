import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  SignupRequest,
  LoginRequest,
} from "../types/auth/Auth";
import { signupApi, loginApi, sendOtpApi, verifyOtpApi, logoutApi } from "../features/auth/authApi";

// Signup thunk
export const signup = createAsyncThunk(
  "auth/signup",
  async (data: SignupRequest, { rejectWithValue }) => {
    try {
      return await signupApi(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  },
);

// Login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      return await loginApi(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

// Send OTP thunk
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (
    {
      email,
      purpose,
    }: { email: string; purpose: "signup" | "forgot-password" },
    { rejectWithValue },
  ) => {
    try {
      return await sendOtpApi(email, purpose);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP",
      );
    }
  },
);

// Verify OTP thunk
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    {
      email,
      otp,
      purpose,
    }: {
      email: string;
      otp: string;
      purpose: "signup" | "forgot-password";
    },
    { rejectWithValue },
  ) => {
    try {
      return await verifyOtpApi(email, otp, purpose);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify OTP",
      );
    }
  },
);

//Logout Thunk
export const serverLogout = createAsyncThunk(
  "auth/serverLogout",
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      return await logoutApi(refreshToken);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);