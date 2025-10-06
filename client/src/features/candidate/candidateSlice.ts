import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCandidateProfileApi } from "./candidateApi";
import type { ICandidate } from "../../types/candidate/candidate.types";
import { toast } from "react-toastify";

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

// Async thunk to fetch candidate profile
// export const fetchCandidateProfile = createAsyncThunk(
//   "candidate/fetchProfile",
//   async (candidateId: string) => {
//     return await getCandidateProfileApi(candidateId);
//   }
// );

export const fetchCandidateProfile = createAsyncThunk(
  "candidate/fetchProfile",
  async (candidateId: string, { rejectWithValue }) => {
    try {
      const response = await getCandidateProfileApi(candidateId);
      return response;
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error("You have been blocked by admin");
      } else {
        toast.error("Failed to load profile");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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
