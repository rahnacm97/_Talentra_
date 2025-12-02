import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createSubscriptionOrder,
  verifySubscriptionPayment,
  getSubscriptionHistory,
} from "../features/subscription/subscriptionApi";
import type {
  CreateOrderRequestDTO,
  CreateOrderResponseDTO,
  VerifyPaymentRequestDTO,
  VerifyPaymentResponseDTO,
  SubscriptionHistoryResponseDTO,
} from "../types/subscription.types";
//Subscription creation
export const createOrder = createAsyncThunk<
  CreateOrderResponseDTO,
  CreateOrderRequestDTO,
  { rejectValue: string }
>("subscription/createOrder", async (data, { rejectWithValue }) => {
  try {
    const response = await createSubscriptionOrder(
      data.amount,
      data.currency || "INR",
    );
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create order",
    );
  }
});
//Payment verification
export const verifyPayment = createAsyncThunk<
  VerifyPaymentResponseDTO,
  VerifyPaymentRequestDTO,
  { rejectValue: string }
>("subscription/verifyPayment", async (data, { rejectWithValue }) => {
  try {
    const response = await verifySubscriptionPayment(
      data.paymentDetails,
      data.planDetails,
    );
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Payment verification failed",
    );
  }
});
//Fetching subscription history
export const fetchSubscriptionHistory = createAsyncThunk<
  SubscriptionHistoryResponseDTO,
  void,
  { rejectValue: string }
>("subscription/fetchHistory", async (_, { rejectWithValue }) => {
  try {
    const response = await getSubscriptionHistory();
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch history",
    );
  }
});
