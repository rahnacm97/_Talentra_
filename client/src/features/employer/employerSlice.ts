import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IEmployer } from "../../types/employer/employer.types";

import {
  fetchEmployerProfile,
  updateEmployerProfile,
  fetchEmployerApplications,
  fetchEmployerAnalytics,
} from "../../thunks/employer.thunk";
import { type EmployerState } from "../../types/employer/employer.types";

const initialState: EmployerState = {
  profile: null,
  loading: false,
  error: null,

  applications: [],
  appPagination: { page: 0, limit: 0, total: 0, totalPages: 0 },
  appLoading: false,

  analytics: {
    data: null,
    loading: false,
    error: null,
    timeRange: "30d",
  },

  interviews: [],
  notifications: [],
};

const employerSlice = createSlice({
  name: "employer",
  initialState,
  reducers: {
    setAnalyticsTimeRange: (state, action: PayloadAction<string>) => {
      state.analytics.timeRange = action.payload;
    },
    clearAnalytics: (state) => {
      state.analytics.data = null;
      state.analytics.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Profile fetching
      .addCase(fetchEmployerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchEmployerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch profile";
      })
      //Update profile
      .addCase(updateEmployerProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmployerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload } as IEmployer;
      })
      .addCase(updateEmployerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update profile";
      })
      //Fetch applications
      .addCase(fetchEmployerApplications.pending, (state) => {
        state.appLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployerApplications.fulfilled, (state, action) => {
        state.appLoading = false;
        state.applications = action.payload.applications;
        state.appPagination = action.payload.pagination;
      })
      .addCase(fetchEmployerApplications.rejected, (state, action) => {
        state.appLoading = false;
        state.error = action.payload as string;
      })
      //Fetch analytics
      .addCase(fetchEmployerAnalytics.pending, (state) => {
        state.analytics.loading = true;
        state.analytics.error = null;
      })
      .addCase(fetchEmployerAnalytics.fulfilled, (state, action) => {
        state.analytics.loading = false;
        state.analytics.data = action.payload;
      })
      .addCase(fetchEmployerAnalytics.rejected, (state, action) => {
        state.analytics.loading = false;
        state.analytics.error = action.payload as string;
      });
  },
});

export const { setAnalyticsTimeRange, clearAnalytics } = employerSlice.actions;

export default employerSlice.reducer;
