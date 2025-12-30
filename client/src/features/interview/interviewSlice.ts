import { createSlice } from "@reduxjs/toolkit";
import { type InterviewState } from "../../types/interview/interview.types";
import {
  fetchCandidateInterviews,
  fetchEmployerInterviews,
  updateInterviewStatus,
} from "../../thunks/interview.thunks";

const initialState: InterviewState = {
  interviews: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};
// Interview slice
const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    clearInterviews: (state) => {
      state.interviews = [];
      state.pagination = initialState.pagination;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Candidate Interviews
      .addCase(fetchCandidateInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload.interviews;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCandidateInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Employer Interviews
      .addCase(fetchEmployerInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload.interviews;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEmployerInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Interview Status
      .addCase(updateInterviewStatus.fulfilled, (state, action) => {
        const index = state.interviews.findIndex(
          (i) => i.id === action.payload.id,
        );
        if (index !== -1) {
          state.interviews[index] = {
            ...state.interviews[index],
            ...action.payload,
          };
        }
      });
  },
});

export const { clearInterviews } = interviewSlice.actions;
export default interviewSlice.reducer;
