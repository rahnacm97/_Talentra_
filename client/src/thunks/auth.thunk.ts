import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { API_ROUTES } from "../shared/constants/constants";
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
} from "../types/auth/Auth";
import type { ApiError } from "../types/common/common.type";

//Signup
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
        profileImage: response.data.user.profileImage,
        ...(response.data.user.role === "Employer" && {
          hasActiveSubscription: response.data.user.hasActiveSubscription,
          trialEndsAt: response.data.user.trialEndsAt,
          currentPlan: response.data.user.currentPlan,
        }),
      },
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(error.response?.data?.message || "Signup failed");
  }
});
//Login
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
        profileImage: response.data.user.profileImage,
        ...(response.data.user.role === "Employer" && {
          verified: response.data.user.verified ?? false,
          hasActiveSubscription: response.data.user.hasActiveSubscription,
          trialEndsAt: response.data.user.trialEndsAt,
          currentPlan: response.data.user.currentPlan,
        }),
      },
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});
//Admin login
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
        profileImage: response.data.user.profileImage,
      },
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.message || "Admin login failed",
    );
  }
});
//Otp sending
export const sendOtp = createAsyncThunk<
  void,
  { email: string; purpose: "signup" | "forgot-password" },
  { rejectValue: string }
>("auth/sendOtp", async (otpData, { rejectWithValue }) => {
  try {
    await api.post(API_ROUTES.AUTH.SEND_OTP, otpData);
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.message || "Failed to send OTP",
    );
  }
});
//Otp verification
export const verifyOtp = createAsyncThunk<
  void,
  { email: string; otp: string; purpose: "signup" | "forgot-password" },
  { rejectValue: string }
>("auth/verifyOtp", async ({ email, otp, purpose }, { rejectWithValue }) => {
  try {
    await api.post(API_ROUTES.AUTH.VERIFY_OTP, { email, otp, purpose });
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.message || "Failed to verify OTP",
    );
  }
});

export const serverLogout = createAsyncThunk<
  void,
  { role?: "Candidate" | "Employer" | "Admin" | "Guest" },
  { rejectValue: string }
>("auth/serverLogout", async ({ role }, { rejectWithValue }) => {
  try {
    const logoutRoute =
      role === "Admin" ? API_ROUTES.ADMIN.ADMINLOGOUT : API_ROUTES.AUTH.LOGOUT;

    await api.post(logoutRoute, {}, { withCredentials: true });
    return;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

export const refreshToken = createAsyncThunk<
  { accessToken: string; user: User },
  void,
  { rejectValue: string }
>("auth/refreshToken", async (_, { rejectWithValue }) => {
  try {
    const response = await api.post(API_ROUTES.AUTH.REFRESH);
    const { accessToken, user } = response.data;
    return {
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        blocked: user.blocked || false,
        emailVerified: user.emailVerified || false,
        profileImage: user.profileImage,
        ...(user.role === "Employer" && {
          verified: user.verified ?? false,
          hasActiveSubscription: user.hasActiveSubscription,
          trialEndsAt: user.trialEndsAt,
          currentPlan: user.currentPlan,
        }),
      },
    };
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.message || "Token refresh failed",
    );
  }
});
