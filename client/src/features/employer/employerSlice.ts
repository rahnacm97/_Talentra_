import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEmployerProfileApi } from "./employerApi";
import type { IEmployer } from "../../types/employer/employer.types";
import { toast } from "react-toastify";

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

export const fetchEmployerProfile = createAsyncThunk(
  "employer/fetchProfile",
  async (employerId: string, { rejectWithValue }) => {
    try {
      const response = await getEmployerProfileApi(employerId);
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