import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  signup,
  login,
  sendOtp,
  adminLogin,
  serverLogout,
  refreshToken,
} from "../../thunks/auth.thunk";
import type { AuthState, AuthResponse } from "../../types/auth/Auth";
import Cookies from "js-cookie";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  forgotPasswordEmail: null,
  isInitialized: false,
  blocked: false,
};
//Authentication slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = "User blocked or session expired";
      state.isInitialized = true;
    },
    setForgotPasswordEmail: (state, action: PayloadAction<string>) => {
      state.forgotPasswordEmail = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setBlocked: (state, action: PayloadAction<boolean>) => {
      state.blocked = action.payload;
      if (action.payload) {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      }
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: any;
        accessToken: string;
        refreshToken?: string | null;
      }>,
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken || null;
      if (refreshToken && refreshToken !== "http-only") {
        Cookies.set("refreshToken", refreshToken, {
          expires: 7,
          sameSite: "Lax",
        });
      }
    },
    updateSubscriptionStatus: (
      state,
      action: PayloadAction<{
        hasActiveSubscription: boolean;
        currentPlan?: "free" | "professional" | "enterprise";
      }>,
    ) => {
      if (state.user) {
        state.user.hasActiveSubscription = action.payload.hasActiveSubscription;
        if (action.payload.currentPlan) {
          state.user.currentPlan = action.payload.currentPlan;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signup.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = null;
        },
      )
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.blocked = false;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = null;
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Admin login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.blocked = false;
      })
      .addCase(
        adminLogin.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = null;
        },
      )
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Otp send
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
      //Logout
      .addCase(serverLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(serverLogout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(serverLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        refreshToken.fulfilled,
        (
          state,
          action: PayloadAction<{ accessToken: string; user: any }>,
        ) => {
          state.accessToken = action.payload.accessToken;
          state.user = action.payload.user;
          state.loading = false;
          state.error = null;
        },
      )
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        Cookies.remove("refreshToken");
      });
  },
});

export const {
  logout,
  setForgotPasswordEmail,
  loginSuccess,
  setInitialized,
  setBlocked,
  updateSubscriptionStatus,
} = authSlice.actions;
export default authSlice.reducer;
