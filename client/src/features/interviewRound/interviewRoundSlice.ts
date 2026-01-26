import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  InterviewRound,
  InterviewRoundState,
} from "../../types/interview/interview.types";

const initialState: InterviewRoundState = {
  rounds: [],
  currentRound: null,
  loading: false,
  error: null,
};

const interviewRoundSlice = createSlice({
  name: "interviewRound",
  initialState,
  reducers: {
    //creating round
    setRounds: (state, action: PayloadAction<InterviewRound[]>) => {
      state.rounds = action.payload;
      state.loading = false;
      state.error = null;
    },
    //Current round
    setCurrentRound: (state, action: PayloadAction<InterviewRound | null>) => {
      state.currentRound = action.payload;
      state.loading = false;
      state.error = null;
    },
    //Adding new round
    addRound: (state, action: PayloadAction<InterviewRound>) => {
      state.rounds.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    //Updating status
    updateRound: (state, action: PayloadAction<InterviewRound>) => {
      const index = state.rounds.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.rounds[index] = action.payload;
      }
      if (state.currentRound?.id === action.payload.id) {
        state.currentRound = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    //cancel
    removeRound: (state, action: PayloadAction<string>) => {
      state.rounds = state.rounds.filter((r) => r.id !== action.payload);
      if (state.currentRound?.id === action.payload) {
        state.currentRound = null;
      }
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setRounds,
  setCurrentRound,
  addRound,
  updateRound,
  removeRound,
  setLoading,
  setError,
  clearError,
} = interviewRoundSlice.actions;

export default interviewRoundSlice.reducer;
