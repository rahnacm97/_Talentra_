import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  SignupRequest,
  LoginRequest,
  AuthState,
} from "../../types/auth/Auth";
import { signupApi, loginApi } from "./authApi";
import { sendOtpApi, verifyOtpApi } from "./authApi";

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  loading: false,
  error: null,
  forgotPasswordEmail: null,
};

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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("user"); 
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    setForgotPasswordEmail: (state, action: { payload: string }) => {
      state.forgotPasswordEmail = action.payload;
    },
    loginSuccess: (state, action: { payload: { user: any; accessToken: string; refreshToken: string } }) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("user", JSON.stringify(action.payload.user)); 
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("user", JSON.stringify(action.payload.user)); 
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendOtp.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(sendOtp.fulfilled, (state) => { 
        state.loading = false; 
      })
      .addCase(sendOtp.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload as string; 
      })
  },
});

export const { logout, setForgotPasswordEmail, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
