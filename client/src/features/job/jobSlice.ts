import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchJobsForCandidate, fetchJobById } from "../../thunks/job.thunk";
import type { EmployerInfoDto } from "../../types/job/job.types";

export interface JobResponse {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: string;
  applicants: number;
  postedDate: string;
  deadline: string;
  experience: "0" | "1-2" | "3-5" | "6-8" | "9-12" | "13+";
  employer: EmployerInfoDto;
  hasApplied: boolean;
}

interface CandidateJobState {
  jobs: JobResponse[];
  total: number;
  page: number;
  limit: number;
  loadingJobId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CandidateJobState = {
  jobs: [],
  total: 0,
  page: 1,
  limit: 5,
  loading: false,
  loadingJobId: null,
  error: null,
};

const candidateJobSlice = createSlice({
  name: "candidateJobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobsForCandidate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchJobsForCandidate.fulfilled,
        (
          state,
          action: PayloadAction<{
            jobs: JobResponse[];
            total: number;
            page: number;
            limit: number;
          }>,
        ) => {
          state.loading = false;
          state.jobs = action.payload.jobs;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        },
      )
      .addCase(fetchJobsForCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load jobs";
      })
      .addCase(fetchJobById.pending, (state, action) => {
        state.loadingJobId = action.meta.arg;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loadingJobId = null;
        const job = action.payload;
        const existing = state.jobs.find((j) => j.id === job.id);
        if (existing) {
          Object.assign(existing, job);
        } else {
          state.jobs.push(job);
        }
      })
      .addCase(fetchJobById.rejected, (state) => {
        state.loadingJobId = null;
      });
  },
});

export default candidateJobSlice.reducer;
