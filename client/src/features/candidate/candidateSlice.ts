import { createSlice } from "@reduxjs/toolkit";
import type { ICandidate } from "../../types/candidate/candidate.types";
import { fetchCandidateProfile } from "../../thunks/candidate.thunks";


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
        state.error = action.error.message || "Failed to fetch candidate profile";
      });
  },
});

export default candidateSlice.reducer;
