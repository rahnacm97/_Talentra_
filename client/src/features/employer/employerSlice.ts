import { createSlice } from "@reduxjs/toolkit";
import type { IEmployer, Interview } from "../../types/employer/employer.types";
import {
  fetchEmployerProfile,
  updateEmployerProfile,
  fetchEmployerApplications,
} from "../../thunks/employer.thunk";
import type { EmployerApplicationsPaginatedDto } from "../../types/application/application.types";

interface EmployerState {
  profile: IEmployer | null;
  loading: boolean;
  error: string | null;
  interviews: Interview[];
  notifications: [];
  applications: EmployerApplicationsPaginatedDto[];
  appPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  appLoading: boolean;
}

const initialState: EmployerState = {
  interviews: [],
  profile: null,
  loading: false,
  error: null,
  notifications: [],
  applications: [],
  appPagination: {
    page: 0,
    limit: 0,
    total: 0,
    totalPages: 0,
  },
  appLoading: false,
};

const employerSlice = createSlice({
  name: "employer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
        state.error =
          action.error.message || "Failed to fetch employer profile";
      })
      .addCase(updateEmployerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateEmployerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to update employer profile";
      })
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
      });
  },
});

export default employerSlice.reducer;
