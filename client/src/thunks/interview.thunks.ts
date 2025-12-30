import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCandidateInterviews,
  getEmployerInterviews,
  updateInterviewStatusApi,
} from "../features/interview/interviewApi";
import type { InterviewQueryParams } from "../types/interview/interview.types";

// Fetch candidate interviews
export const fetchCandidateInterviews = createAsyncThunk(
  "interview/fetchCandidateInterviews",
  async (params: InterviewQueryParams, { rejectWithValue }) => {
    try {
      const response = await getCandidateInterviews(params);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to fetch your interviews";
      return rejectWithValue(message);
    }
  },
);

// Fetch employer interviews
export const fetchEmployerInterviews = createAsyncThunk(
  "interview/fetchEmployerInterviews",
  async (params: InterviewQueryParams, { rejectWithValue }) => {
    try {
      const response = await getEmployerInterviews(params);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to fetch scheduled interviews";
      return rejectWithValue(message);
    }
  },
);

// Update interview status
export const updateInterviewStatus = createAsyncThunk(
  "interview/updateInterviewStatus",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateInterviewStatusApi(id, status);
      return response.data.interview;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to update interview status";
      return rejectWithValue(message);
    }
  },
);
