import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setRounds,
  setCurrentRound,
  addRound,
  updateRound,
  setLoading,
  setError,
} from "../features/interviewRound/interviewRoundSlice";
import { interviewRoundApi } from "../features/interviewRound/interviewRoundApi";

//Fetch rounds
export const fetchRoundsForApplication = createAsyncThunk(
  "interviewRound/fetchForApplication",
  async (applicationId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response =
        await interviewRoundApi.getRoundsForApplication(applicationId);
      dispatch(setRounds(response.data.rounds));
      return response.data.rounds;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch rounds";
      dispatch(setError(message));
      throw error;
    }
  },
);
//Candidate rounds
export const fetchMyRounds = createAsyncThunk(
  "interviewRound/fetchMy",
  async (params: any, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await interviewRoundApi.getMyRounds(params);
      dispatch(setRounds(response.data.rounds));
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch rounds";
      dispatch(setError(message));
      throw error;
    }
  },
);
//Creating round for interview
export const createInterviewRound = createAsyncThunk(
  "interviewRound/create",
  async (roundData: any, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await interviewRoundApi.createRound(roundData);
      dispatch(addRound(response.data.round));
      return response.data.round;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create round";
      dispatch(setError(message));
      throw error;
    }
  },
);
//Updating status
export const updateRoundStatus = createAsyncThunk(
  "interviewRound/updateStatus",
  async (
    { roundId, status }: { roundId: string; status: string },
    { dispatch },
  ) => {
    try {
      dispatch(setLoading(true));
      const response = await interviewRoundApi.updateRoundStatus(
        roundId,
        status,
      );
      dispatch(updateRound(response.data.round));
      return response.data.round;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update status";
      dispatch(setError(message));
      throw error;
    }
  },
);
//Rescheduling interview round
export const rescheduleInterviewRound = createAsyncThunk(
  "interviewRound/reschedule",
  async (
    { roundId, newDate }: { roundId: string; newDate: string },
    { dispatch },
  ) => {
    try {
      dispatch(setLoading(true));
      const response = await interviewRoundApi.rescheduleRound(
        roundId,
        newDate,
      );
      dispatch(updateRound(response.data.round));
      return response.data.round;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to reschedule round";
      dispatch(setError(message));
      throw error;
    }
  },
);
//Cancel interview round
export const cancelInterviewRound = createAsyncThunk(
  "interviewRound/cancel",
  async (
    { roundId, reason }: { roundId: string; reason?: string },
    { dispatch },
  ) => {
    try {
      dispatch(setLoading(true));
      const response = await interviewRoundApi.cancelRound(roundId, reason);
      dispatch(updateRound(response.data.round));
      return response.data.round;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to cancel round";
      dispatch(setError(message));
      throw error;
    }
  },
);
//Single round
export const fetchRoundById = createAsyncThunk(
  "interviewRound/fetchById",
  async (roundId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await interviewRoundApi.getRoundById(roundId);
      dispatch(setCurrentRound(response.data.round));
      return response.data.round;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch round";
      dispatch(setError(message));
      throw error;
    }
  },
);
