import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/api";

export interface EmployerStats {
  totalApplications: number;
  totalViews: number;
  activeJobs: number;
  avgTimeToHire: number;
  totalHired: number;
  conversionRate: number;
  offerAcceptanceRate: number;
  activePipeline: number;
}

export interface ApplicationOverTime {
  date: string;
  applications: number;
  views: number;
}

export interface ApplicationByStatus {
  name: string;
  value: number;
  color: string;
}

export interface JobPerformance {
  job: string;
  jobId: string;
  applications: number;
  views: number;
  conversionRate: number;
}

export interface HiringFunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface TimeToHire {
  position: string;
  days: number;
}

export interface EmployerAnalyticsData {
  stats: EmployerStats;
  applicationsOverTime: ApplicationOverTime[];
  applicationsByStatus: ApplicationByStatus[];
  jobPostingPerformance: JobPerformance[];
  hiringFunnel: HiringFunnelStage[];
  timeToHire: TimeToHire[];
}

export const fetchEmployerAnalytics = createAsyncThunk<
  EmployerAnalyticsData,
  string
>("employerAnalytics/fetch", async (timeRange, { rejectWithValue }) => {
  try {
    const response = await API.get("/employer/analytics", {
      params: { timeRange },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch employer analytics",
    );
  }
});
