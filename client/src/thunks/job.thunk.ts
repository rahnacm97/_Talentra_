import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPublicJobs,
  getJobById,
  getSavedJobs,
} from "../features/job/jobApi";
import type { ExperienceLevel } from "../shared/validations/JobFormValidation";
import type { ApiError } from "../types/common/common.type";
import type { RootState } from "../app/store";

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

export const saveJob = createAsyncThunk(
  "jobs/saveJob",
  async (jobId: string, { rejectWithValue }) => {
    try {
      await saveJob(jobId);
      return { jobId };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to save job",
      );
    }
  },
);

export const unsaveJob = createAsyncThunk(
  "jobs/unsaveJob",
  async (jobId: string, { rejectWithValue }) => {
    try {
      await unsaveJob(jobId);
      return { jobId };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to unsave job",
      );
    }
  },
);

export const fetchSavedJobs = createAsyncThunk(
  "jobs/fetchSavedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSavedJobs();
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load saved jobs",
      );
    }
  },
);
