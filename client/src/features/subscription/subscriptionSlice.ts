import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  createOrder,
  verifyPayment,
  fetchSubscriptionHistory,
} from "../../thunks/subscription.thunk";
import type {
  SubscriptionHistoryItemDTO,
  CreateOrderResponseDTO,
} from "../../types/subscription.types";

interface SubscriptionState {
  history: SubscriptionHistoryItemDTO[];
  loading: boolean;
  error: string | null;
  currentOrder: CreateOrderResponseDTO | null;
}

const initialState: SubscriptionState = {
  history: [],
  loading: false,
  error: null,
  currentOrder: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<CreateOrderResponseDTO>) => {
          state.loading = false;
          state.currentOrder = action.payload;
        },
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create order";
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.currentOrder = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Payment verification failed";
      })
      // Fetch History
      .addCase(fetchSubscriptionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload.subscriptions;
      })
      .addCase(fetchSubscriptionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch history";
      });
  },
});

export const { clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
