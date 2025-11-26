import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchJobsForCandidate,
  fetchJobById,
  fetchSavedJobs,
  saveJob,
  unsaveJob,
} from "../../thunks/job.thunk";
import { applyJob } from "../../thunks/candidate.thunks";
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
  skills: string[];
}

interface CandidateJobState {
  jobs: JobResponse[];
  total: number;
  page: number;
  limit: number;
  loadingJobId: string | null;
  loading: boolean;
  error: string | null;
  availableSkills: string[];
  selectedSkills: string[];
  savedJobs: JobResponse[];
  savedJobsLoading: boolean;
}

const initialState: CandidateJobState = {
  jobs: [],
  total: 0,
  page: 1,
  limit: 5,
  loadingJobId: null,
  loading: false,
  error: null,
  availableSkills: [],
  selectedSkills: [],
  savedJobs: [],
  savedJobsLoading: false,
};

const candidateJobSlice = createSlice({
  name: "candidateJobs",
  initialState,
  reducers: {
    setSelectedSkills: (state, action: PayloadAction<string[]>) => {
      state.selectedSkills = action.payload;
    },
    toggleSkill: (state, action: PayloadAction<string>) => {
      const skill = action.payload;
      state.selectedSkills = state.selectedSkills.includes(skill)
        ? state.selectedSkills.filter((s) => s !== skill)
        : [...state.selectedSkills, skill];
    },
    clearSkills: (state) => {
      state.selectedSkills = [];
    },
  },
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
            availableSkills: string[];
          }>,
        ) => {
          state.loading = false;
          state.jobs = action.payload.jobs;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
          state.availableSkills = action.payload.availableSkills;
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
        const fetchedJob = action.payload.data;
        const idx = state.jobs.findIndex((j) => j.id === fetchedJob.id);
        if (idx !== -1) {
          state.jobs[idx] = { ...state.jobs[idx], ...fetchedJob };
        } else {
          state.jobs.push(fetchedJob);
        }
      })
      .addCase(fetchJobById.rejected, (state) => {
        state.loadingJobId = null;
      })
      .addCase(applyJob.fulfilled, (state, action) => {
        const { jobId, alreadyApplied } = action.payload;
        const job = state.jobs.find((j) => j.id === jobId);
        if (job) {
          job.hasApplied = true;
          if (!alreadyApplied) job.applicants += 1;
        } else {
          state.jobs.push({
            id: jobId,
            title: "Loading...",
            department: "",
            location: "",
            type: "",
            salary: "",
            description: "",
            requirements: [],
            responsibilities: [],
            status: "active",
            applicants: alreadyApplied ? 0 : 1,
            postedDate: new Date().toISOString(),
            deadline: "",
            experience: "0",
            hasApplied: true,
            skills: [],
            employer: {
              id: "",
              name: "Loading...",
              logo: "",
              companyName: "Loading...",
            },
          } as JobResponse);
        }
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to apply";
      })
      .addCase(fetchSavedJobs.pending, (state) => {
        state.savedJobsLoading = true;
        state.error = null;
      })
      .addCase(
        fetchSavedJobs.fulfilled,
        (
          state,
          action: PayloadAction<{
            jobs: JobResponse[];
            total: number;
            page: number;
            limit: number;
          }>,
        ) => {
          state.savedJobsLoading = false;
          state.savedJobs = action.payload.jobs;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        },
      )
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.savedJobsLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        const { jobId } = action.payload;
        const job = state.jobs.find((j) => j.id === jobId);
        if (job && !state.savedJobs.some((j) => j.id === jobId)) {
          state.savedJobs.push(job);
        }
      })
      .addCase(unsaveJob.fulfilled, (state, action) => {
        const { jobId } = action.payload;
        state.savedJobs = state.savedJobs.filter((j) => j.id !== jobId);
      });
  },
});

export const { setSelectedSkills, toggleSkill, clearSkills } =
  candidateJobSlice.actions;
export default candidateJobSlice.reducer;
