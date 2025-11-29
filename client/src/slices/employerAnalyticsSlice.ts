import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchEmployerAnalytics,
  type EmployerAnalyticsData,
} from "../thunks/employer.analytics.thunk";

interface EmployerAnalyticsState {
  data: EmployerAnalyticsData | null;
  loading: boolean;
  error: string | null;
  timeRange: string;
}

const initialState: EmployerAnalyticsState = {
  data: null,
  loading: false,
  error: null,
  timeRange: "30days",
};

const employerAnalyticsSlice = createSlice({
  name: "employerAnalytics",
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<string>) => {
      state.timeRange = action.payload;
    },
    clearAnalytics: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployerAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEmployerAnalytics.fulfilled,
        (state, action: PayloadAction<EmployerAnalyticsData>) => {
          state.loading = false;
          state.data = action.payload;
        },
      )
      .addCase(fetchEmployerAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTimeRange, clearAnalytics } = employerAnalyticsSlice.actions;
export default employerAnalyticsSlice.reducer;
