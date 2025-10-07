import { createSlice } from "@reduxjs/toolkit";
import type { IEmployer } from "../../types/employer/employer.types";
import { fetchEmployerProfile } from "../../thunks/employer.thunk";

interface EmployerState {
  profile: IEmployer | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmployerState = {
  profile: null,
  loading: false,
  error: null,
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
        state.error = action.error.message || "Failed to fetch employer profile";
      });
  },
});

export default employerSlice.reducer;