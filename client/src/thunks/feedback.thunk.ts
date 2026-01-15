import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  submitFeedbackApi,
  fetchPublicFeedbackApi,
  fetchFeaturedFeedbackApi,
  fetchAdminFeedbackApi,
  updateFeedbackApi,
  deleteFeedbackApi,
} from "../features/feedback/feedbackApi";
import type {
  Feedback,
  FeedbackCreateRequest,
  FeedbackUpdateRequest,
} from "../types/feedback/feedback.types";
//Feedback submit
export const submitFeedback = createAsyncThunk(
  "feedback/submit",
  async (data: FeedbackCreateRequest, { rejectWithValue }) => {
    try {
      return await submitFeedbackApi(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit feedback",
      );
    }
  },
);
//Fetch ublic feedback
export const fetchPublicFeedback = createAsyncThunk(
  "feedback/fetchPublic",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPublicFeedbackApi();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch feedback",
      );
    }
  },
);
//Fetch featured feedback
export const fetchFeaturedFeedback = createAsyncThunk(
  "feedback/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchFeaturedFeedbackApi();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured feedback",
      );
    }
  },
);
//fetch all feedbacks
export const fetchAdminFeedback = createAsyncThunk<
  { data: Feedback[]; total: number },
  { page: number; limit: number; search?: string },
  { rejectValue: string }
>(
  "feedback/fetchAdmin",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      return await fetchAdminFeedbackApi(page, limit, search);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch feedback",
      );
    }
  },
);
//Update feedback
export const updateFeedback = createAsyncThunk(
  "feedback/update",
  async (
    { id, data }: { id: string; data: FeedbackUpdateRequest },
    { rejectWithValue },
  ) => {
    try {
      return await updateFeedbackApi(id, data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update feedback",
      );
    }
  },
);
//Delete feedback
export const deleteFeedback = createAsyncThunk(
  "feedback/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteFeedbackApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete feedback",
      );
    }
  },
);
