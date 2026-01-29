import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMyOffersApi } from "../features/offer/offerApi";
import type { ApiError } from "../types/common/common.type";

export const fetchMyOffers = createAsyncThunk(
  "offer/fetchMyOffers",
  async (
    params: {
      search?: string;
      page?: number;
      limit?: number;
      jobType?: string;
      sortBy?: string;
      order?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchMyOffersApi(params);
      return response.data;
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch offers",
      );
    }
  },
);
