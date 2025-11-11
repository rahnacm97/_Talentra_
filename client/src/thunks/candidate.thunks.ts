import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCandidateProfileApi } from "../features/candidate/candidateApi";
import { toast } from "react-toastify";

export const fetchCandidateProfile = createAsyncThunk(
  "candidate/fetchProfile",
  async (candidateId: string, { rejectWithValue }) => {
    try {
      const response = await getCandidateProfileApi(candidateId);
      return response;
    } catch (error: any) {
      if (error.response?.status === 403) {
        //toast.error("You have been blocked by admin");
      } else {
        toast.error("Failed to load profile");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
