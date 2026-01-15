import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminJobs } from "../../thunks/admin.thunk";
import type { AdminJob } from "../../types/admin/admin.jobs.types";

interface AdminJobsState {
  jobs: AdminJob[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdminJobsState = {
  jobs: [],
  total: 0,
  page: 1,
  limit: 5,
  loading: false,
  error: null,
};
//Admin Job slice
const adminJobsSlice = createSlice({
  name: "adminJobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Fetch all jobs
      .addCase(fetchAdminJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchAdminJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load jobs";
      });
  },
});

export default adminJobsSlice.reducer;
