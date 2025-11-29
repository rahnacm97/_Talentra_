import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCandidateProfileApi,
  updateCandidateProfileApi,
  applyJobApi,
  getMyApplications,
  getApplicationByIdApi,
} from "../features/candidate/candidateApi";
import type { ApiError } from "../types/common/common.type";
import type { ProfileData } from "../types/candidate/candidate.types";
import { toast } from "react-toastify";

export const fetchCandidateProfile = createAsyncThunk(
  "candidate/fetchProfile",
  async (candidateId: string, { rejectWithValue }) => {
    try {
      const response = await getCandidateProfileApi(candidateId);
      return response;
    } catch (err: unknown) {
      const error = err as ApiError;
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
    } catch (err: unknown) {
      const error = err as ApiError;
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
      await applyJobApi(candidateId, jobId, formData);
      toast.success("Application submitted!");
      return { jobId, alreadyApplied: false };
    } catch (err: unknown) {
      const error = err as ApiError;
      const status = error.response?.status;
      const message = error.response?.data?.message || "Failed to apply";

      if (status === 409 && message.includes("Already applied")) {
        toast.info("You have already applied to this job.");
        return { jobId, alreadyApplied: true };
      }

      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const fetchMyApplications = createAsyncThunk(
  "candidate/applications",
  async (
    filters: {
      status?: string;
      search?: string;
      page?: number;
      limit?: number;
    } = {},
    { rejectWithValue },
  ) => {
    try {
      return await getMyApplications(filters);
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(error.response?.data?.message || "Failed to load");
    }
  },
);

export const fetchApplicationById = createAsyncThunk(
  "candidate/fetchApplicationById",
  async (applicationId: string, { rejectWithValue }) => {
    try {
      return await getApplicationByIdApi(applicationId);
    } catch (err: any) {
      toast.error("Failed to load application details");
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);
