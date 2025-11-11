import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPublicJobs, getJobById } from "../features/job/jobApi";
import type { ExperienceLevel } from "../shared/validations/JobFormValidation";

export const fetchJobsForCandidate = createAsyncThunk(
  "candidateJobs/fetch",
  async ({
    page,
    limit,
    search,
    location,
    type,
    experience,
  }: {
    page: number;
    limit: number;
    search?: string;
    location?: string;
    type?: string;
    experience?: ExperienceLevel;
  }) => {
    const response = await getPublicJobs({
      page,
      limit,
      search,
      location,
      type,
      experience,
    });
    return response.data;
  },
);

export const fetchJobById = createAsyncThunk(
  "candidateJobs/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getJobById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load job",
      );
    }
  },
);
