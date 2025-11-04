import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCandidateProfileApi,
  updateCandidateProfileApi,
  applyJobApi,
} from "../features/candidate/candidateApi";
import type { ProfileData } from "../types/candidate/candidate.types";
import { toast } from "react-toastify";

export const fetchCandidateProfile = createAsyncThunk(
  "candidate/fetchProfile",
  async (candidateId: string, { rejectWithValue }) => {
    try {
      const response = await getCandidateProfileApi(candidateId);
      return response;
    } catch (error: any) {
      if (error.response?.status === 403) {
      } else {
        toast.error("Failed to load profile");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateCandidateProfile = createAsyncThunk(
  "candidate/updateProfile",
  async (
    data: ProfileData & {
      candidateId: string;
      resumeFile?: File;
      profileImageFile?: File;
    },
    { rejectWithValue },
  ) => {
    try {
      let payload: ProfileData | FormData = data;
      if (data.resumeFile || data.profileImageFile) {
        const formData = new FormData();
        if (data.resumeFile) {
          formData.append("resume", data.resumeFile);
        }
        if (data.profileImageFile) {
          formData.append("profileImage", data.profileImageFile);
        }

        Object.entries(data).forEach(([key, value]) => {
          if (
            key !== "candidateId" &&
            key !== "resumeFile" &&
            key !== "profileImageFile" &&
            value !== null &&
            value !== undefined
          ) {
            formData.append(
              key,
              Array.isArray(value) ? JSON.stringify(value) : value,
            );
          }
        });
        payload = formData;
      }
      const response = await updateCandidateProfileApi(
        data.candidateId,
        payload,
      );
      toast.success("Profile updated successfully");
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const applyJob = createAsyncThunk(
  "candidate/applyJob",
  async (
    {
      candidateId,
      jobId,
      formData,
    }: { candidateId: string; jobId: string; formData: FormData },
    { rejectWithValue },
  ) => {
    try {
      const response = await applyJobApi(candidateId, jobId, formData);
      toast.success("Application submitted!");
      return response;
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Failed to submit application";
      toast.error(msg);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
