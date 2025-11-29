import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/api";

export interface DashboardStats {
  totalCandidates: number;
  totalEmployers: number;
  totalJobs: number;
  totalApplications: number;
  totalInterviews: number;
  activeCandidates: number;
  activeJobs: number;
  pendingApplications: number;
}

export interface TopPerformingJob {
  id: string;
  title: string;
  company: string;
  applications: number;
  status: string;
}

export interface AdminAnalyticsData {
  stats: DashboardStats;
  topJobs: TopPerformingJob[];
}

export const fetchAdminAnalytics = createAsyncThunk<AdminAnalyticsData>(
  "adminAnalytics/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/admin/analytics/dashboard");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin analytics",
      );
    }
  },
);
