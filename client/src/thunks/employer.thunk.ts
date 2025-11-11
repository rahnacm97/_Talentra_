import { createAsyncThunk } from "@reduxjs/toolkit";
import { getEmployerProfileApi } from "../features/employer/employerApi";
import { toast } from "react-toastify";

export const fetchEmployerProfile = createAsyncThunk(
  "employer/fetchProfile",
  async (employerId: string, { rejectWithValue }) => {
    try {
      const response = await getEmployerProfileApi(employerId);
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
