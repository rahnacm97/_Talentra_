import { createSlice } from "@reduxjs/toolkit";
import type { IEmployer, Interview } from "../../types/employer/employer.types";
import {
  fetchEmployerProfile,
  updateEmployerProfile,
} from "../../thunks/employer.thunk";

interface EmployerState {
  profile: IEmployer | null;
  loading: boolean;
  error: string | null;
  interviews: Interview[];
  notifications: [];
}

const initialState: EmployerState = {
  interviews: [],
  profile: null,
  loading: false,
  error: null,
  notifications: [],
};

const employerSlice = createSlice({
  name: "employer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchEmployerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch employer profile";
      })
      .addCase(updateEmployerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateEmployerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to update employer profile";
      });
  },
});

export default employerSlice.reducer;
