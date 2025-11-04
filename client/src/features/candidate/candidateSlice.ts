import { createSlice } from "@reduxjs/toolkit";
import type { ICandidate } from "../../types/candidate/candidate.types";
import {
  fetchCandidateProfile,
  updateCandidateProfile,
  applyJob,
} from "../../thunks/candidate.thunks";

interface CandidateState {
  profile: ICandidate | null;
  loading: boolean;
  error: string | null;
}

const initialState: CandidateState = {
  profile: null,
  loading: false,
  error: null,
};

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch candidate profile";
      })
      .addCase(updateCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload instanceof Error
            ? action.payload.message
            : String(action.payload);
      })
      .addCase(applyJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyJob.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default candidateSlice.reducer;
