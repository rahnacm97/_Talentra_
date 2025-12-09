import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchAdminAnalytics } from "../../thunks/admin.thunk";
import type {
  AdminAnalyticsData,
  AdminAnalyticsState,
} from "../../types/admin/admin.types";

const initialState: AdminAnalyticsState = {
  data: null,
  loading: false,
  error: null,
};

const adminAnalyticsSlice = createSlice({
  name: "adminAnalytics",
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminAnalytics.fulfilled,
        (state, action: PayloadAction<AdminAnalyticsData>) => {
          state.loading = false;
          state.data = action.payload;
        },
      )
      .addCase(fetchAdminAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAnalytics } = adminAnalyticsSlice.actions;
export default adminAnalyticsSlice.reducer;
