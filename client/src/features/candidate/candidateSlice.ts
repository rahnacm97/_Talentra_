import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCandidateProfile,
  updateCandidateProfile,
  applyJob,
  fetchMyApplications,
  fetchApplicationById,
} from "../../thunks/candidate.thunks";
import type { CandidateState } from "../../types/application/application.types";

const initialState: CandidateState = {
  profile: null,
  loading: false,
  error: null,
  applications: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  appsLoading: false,
  currentApplication: null,
  currentAppLoading: false,
};

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch candidate profile";
      })
      .addCase(updateCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload instanceof Error
            ? action.payload.message
            : String(action.payload);
      })
      .addCase(applyJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyJob.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyApplications.pending, (s) => {
        s.appsLoading = true;
      })
      .addCase(fetchMyApplications.fulfilled, (s, a) => {
        s.appsLoading = false;
        s.applications = a.payload.data;
        s.pagination = a.payload.pagination ?? s.pagination;
      })
      .addCase(fetchMyApplications.rejected, (s) => {
        s.appsLoading = false;
      })
      .addCase(fetchApplicationById.pending, (state) => {
        state.currentAppLoading = true;
        state.currentApplication = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.currentAppLoading = false;
        state.currentApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state) => {
        state.currentAppLoading = false;
        state.currentApplication = null;
      });
  },
});

export default candidateSlice.reducer;
