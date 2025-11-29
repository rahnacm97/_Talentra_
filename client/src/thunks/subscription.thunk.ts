import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createSubscriptionApi,
  getCurrentSubscriptionApi,
  cancelSubscriptionApi,
} from "../features/subscription/subscriptionApi";
import { toast } from "react-toastify";

export const createSubscription = createAsyncThunk(
  "subscription/create",
  async (planType: "monthly" | "yearly", { rejectWithValue }) => {
    try {
      return await createSubscriptionApi(planType);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create subscription");
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchCurrentSubscription = createAsyncThunk(
  "subscription/current",
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentSubscriptionApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const cancelSubscription = createAsyncThunk(
  "subscription/cancel",
  async (_, { rejectWithValue }) => {
    try {
      const res = await cancelSubscriptionApi();
      toast.success("Subscription cancelled successfully");
      return res;
    } catch (err: any) {
      toast.error("Failed to cancel subscription");
      return rejectWithValue(err.response?.data);
    }
  },
);
