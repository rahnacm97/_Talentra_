import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  AdminLoginRequest,
  AdminAuthResponse,
} from "../../types/admin/admin.types";
import { loginAdmin } from "./adminAuthApi";

interface AdminAuthState {
  admin: AdminAuthResponse["admin"] | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminAuthState = {
  admin: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const adminLogin = createAsyncThunk(
  "admin/login",
  async (data: AdminLoginRequest, { rejectWithValue }) => {
    try {
      return await loginAdmin(data);
    } catch (error: any) {
      const message = error.response?.data?.message || "Admin login failed";
      return rejectWithValue(message);
    }
  },
);

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminLogout: (state) => {
      state.admin = null;
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");
    },
    adminLoginSuccess(state, action: PayloadAction<{ admin: any; accessToken: string; refreshToken: string }>) {
    state.admin = action.payload.admin;
    state.accessToken = action.payload.accessToken;
    state.refreshToken = action.payload.refreshToken;
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("admin", JSON.stringify(action.payload.admin));
        localStorage.setItem("adminAccessToken", action.payload.accessToken);
        localStorage.setItem("adminRefreshToken", action.payload.refreshToken);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { adminLogout, adminLoginSuccess } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
