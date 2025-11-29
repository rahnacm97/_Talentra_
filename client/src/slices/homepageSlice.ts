import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchHomepageStats, type PublicStats } from "../thunks/homepage.thunk";

interface HomepageState {
  stats: PublicStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: HomepageState = {
  stats: null,
  loading: false,
  error: null,
};

const homepageSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    clearStats: (state) => {
      state.stats = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomepageStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchHomepageStats.fulfilled,
        (state, action: PayloadAction<PublicStats>) => {
          state.loading = false;
          state.stats = action.payload;
        },
      )
      .addCase(fetchHomepageStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStats } = homepageSlice.actions;
export default homepageSlice.reducer;
