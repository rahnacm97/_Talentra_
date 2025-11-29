import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPublicJobs,
  getJobById,
  getSavedJobs,
  saveJob as saveJobApi,
  unsaveJob as unsaveJobApi,
} from "../features/job/jobApi";
import type { ExperienceLevel } from "../shared/validations/JobFormValidation";
import type { ApiError } from "../types/common/common.type";
import type { RootState } from "../app/store";

// Fetch public jobs with pagination, search, filters
export const fetchJobsForCandidate = createAsyncThunk(
  "candidateJobs/fetch",
  async ({
    page,
    limit,
    search,
    location,
    type,
    experience,
    skills,
  }: {
    page: number;
    limit: number;
    search?: string;
    location?: string;
    type?: string;
    experience?: ExperienceLevel;
    skills?: string[];
  }) => {
    const response = await getPublicJobs({
      page,
      limit,
      search,
      location,
      type,
      experience,
      skills,
    });
    return response.data;
  },
);

// Fetch a single job by ID
export const fetchJobById = createAsyncThunk(
  "candidateJobs/fetchById",
  async (id: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const candidateId = state.auth.user?._id;
    try {
      const response = await getJobById(id, candidateId);
      return response.data;
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message || "Failed to load job",
      );
    }
  },
);

// Save a job
export const saveJob = createAsyncThunk(
  "jobs/saveJob",
  async (jobId: string, { rejectWithValue }) => {
    try {
      await saveJobApi(jobId);
      return { jobId };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to save job",
      );
    }
  },
);

// Unsave a job
export const unsaveJob = createAsyncThunk(
  "jobs/unsaveJob",
  async (jobId: string, { rejectWithValue }) => {
    try {
      await unsaveJobApi(jobId);
      return { jobId };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to unsave job",
      );
    }
  },
);

// Fetch saved jobs with pagination, search, and type filter
export const fetchSavedJobs = createAsyncThunk(
  "jobs/fetchSavedJobs",
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await getSavedJobs(params);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load saved jobs",
      );
    }
  },
);
