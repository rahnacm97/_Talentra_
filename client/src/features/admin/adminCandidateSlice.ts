import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCandidates,
  toggleBlockCandidate,
  fetchCandidateById,
} from "../../thunks/admin.thunk";
import type { Candidate } from "../../types/admin/admin.candidate.types";
import { toast } from "react-toastify";

interface CandidateState {
  candidates: Candidate[];
  total: number;
  selectedCandidate: Candidate | null;
  loading: boolean;
  error: string | null;
}

const initialState: CandidateState = {
  candidates: [],
  total: 0,
  loading: false,
  error: null,
  selectedCandidate: null,
};

const adminCandidateSlice = createSlice({
  name: "adminCandidates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching candidates";
      })
      .addCase(toggleBlockCandidate.fulfilled, (state, action) => {
        const updated = action.payload.candidate;
        state.candidates = state.candidates.map((c) =>
          c.id === updated.id ? updated : c,
        );
        toast.success(
          `${updated.name} has been ${updated.blocked ? "blocked" : "unblocked"}`,
        );
      })
      .addCase(fetchCandidateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCandidate = action.payload;
      })
      .addCase(fetchCandidateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch candidate";
      });
  },
});

export default adminCandidateSlice.reducer;
