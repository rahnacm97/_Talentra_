import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
import { API_ROUTES } from "../shared/constants/constants";

export const fetchAdminSubscriptions = createAsyncThunk(
  "admin/fetchSubscriptions",
  async (
    options: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      search?: string;
      status?: string;
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get(API_ROUTES.ADMIN.ADMIN_SUBSCRIPTIONS, {
        params: options,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscriptions",
      );
    }
  },
);
