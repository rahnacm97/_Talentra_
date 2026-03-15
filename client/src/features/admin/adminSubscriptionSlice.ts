import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminSubscriptions } from "../../thunks/adminSubscription.thunk";
import type { AdminSubscriptionState } from "../../types/admin/admin.subscription.types";

const initialState: AdminSubscriptionState = {
  subscriptions: [],
  total: 0,
  totalRevenue: 0,
  loading: false,
  error: null,
};

const adminSubscriptionSlice = createSlice({
  name: "adminSubscriptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload.subscriptions;
        state.total = action.payload.total;
        state.totalRevenue = action.payload.totalRevenue;
      })
      .addCase(fetchAdminSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch subscriptions";
      });
  },
});

export default adminSubscriptionSlice.reducer;
