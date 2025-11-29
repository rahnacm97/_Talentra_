import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/api";

export interface PublicStats {
  activeJobs: number;
  totalCompanies: number;
  successRate: number;
  totalCandidates: number;
}

export const fetchHomepageStats = createAsyncThunk<PublicStats>(
  "homepage/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/public/stats");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch homepage statistics",
      );
    }
  },
);
