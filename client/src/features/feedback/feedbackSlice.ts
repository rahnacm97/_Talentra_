import { createSlice } from "@reduxjs/toolkit";
import {
  submitFeedback,
  fetchPublicFeedback,
  fetchFeaturedFeedback,
  fetchAdminFeedback,
  updateFeedback,
  deleteFeedback,
} from "../../thunks/feedback.thunk";
import type {
  Feedback,
  FeedbackState,
} from "../../types/feedback/feedback.types";

const initialState: FeedbackState = {
  feedbacks: [],
  featuredFeedbacks: [],
  publicFeedbacks: [],
  loading: false,
  actionLoading: false,
  error: null,
  total: 0,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    clearFeedbackError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch public feedback
      .addCase(fetchPublicFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPublicFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.publicFeedbacks = action.payload;
      })
      .addCase(fetchPublicFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch featured feedback
      .addCase(fetchFeaturedFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredFeedbacks = action.payload;
      })
      .addCase(fetchFeaturedFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch admin feedback
      .addCase(fetchAdminFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchAdminFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Submit feedback
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.publicFeedbacks.unshift(action.payload);
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update feedback
      .addCase(updateFeedback.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateFeedback.fulfilled, (state, action) => {
        const feedback = action.payload;
        const index = state.feedbacks.findIndex(
          (f: Feedback) => f.id === feedback.id,
        );
        if (index !== -1) {
          state.feedbacks[index] = feedback;
        }
        state.actionLoading = false;
      })
      .addCase(updateFeedback.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      // Delete feedback
      .addCase(deleteFeedback.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.feedbacks = state.feedbacks.filter(
          (f: Feedback) => f.id !== action.payload,
        );
        state.actionLoading = false;
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFeedbackError } = feedbackSlice.actions;
export default feedbackSlice.reducer;
