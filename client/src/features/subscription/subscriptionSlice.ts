import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCurrentSubscription,
  createSubscription,
  cancelSubscription,
} from "../../thunks/subscription.thunk";

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    data: null as any,
    loading: false,
    creating: false,
    cancelling: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCurrentSubscription.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createSubscription.pending, (state) => {
        state.creating = true;
      })
      .addCase(createSubscription.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createSubscription.rejected, (state) => {
        state.creating = false;
      })
      .addCase(cancelSubscription.pending, (state) => {
        state.cancelling = true;
      })
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.cancelling = false;
        if (state.data) state.data.cancelAtPeriodEnd = true;
      })
      .addCase(cancelSubscription.rejected, (state) => {
        state.cancelling = false;
      });
  },
});

export default subscriptionSlice.reducer;
