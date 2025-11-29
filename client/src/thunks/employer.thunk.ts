import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEmployerProfileApi,
  updateEmployerProfileApi,
  fetchEmployerJobsApi,
  postJobApi,
  updateJobApi,
  closeJobApi,
  fetchEmployerApplicationsApi,
  fetchNotificationsApi,
  markNotificationAsReadApi,
} from "../features/employer/employerApi";
import type { ApiError } from "../types/common/common.type";
import { toast } from "react-toastify";

export const fetchEmployerProfile = createAsyncThunk(
  "employer/fetchProfile",
  async (employerId: string, { rejectWithValue }) => {
    try {
      const response = await getEmployerProfileApi(employerId);
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

export const updateEmployerProfile = createAsyncThunk(
  "employer/updateProfile",
  async (
    { employerId, data }: { employerId: string; data: FormData },
    { rejectWithValue },
  ) => {
    try {
      return await updateEmployerProfileApi(employerId, data);
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error.response?.data?.message || "Failed to update profile");
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchEmployerJobs = createAsyncThunk(
  "employer/fetchJobs",
  async (
    {
      employerId,
      page = 1,
      limit = 3,
      search = "",
      status = "all",
    }: {
      employerId: string;
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      return await fetchEmployerJobsApi(employerId, {
        page,
        limit,
        search,
        status,
      });
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs",
      );
    }
  },
);

export const postJob = createAsyncThunk(
  "employer/postJob",
  async (
    { employerId, job }: { employerId: string; job: any },
    { rejectWithValue },
  ) => {
    try {
      return await postJobApi(employerId, job);
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message || "Failed to post job",
      );
    }
  },
);

export const updateJob = createAsyncThunk(
  "employer/updateJob",
  async (
    { employerId, jobId, job }: { employerId: string; jobId: string; job: any },
    { rejectWithValue },
  ) => {
    try {
      return await updateJobApi(employerId, jobId, job);
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message || "Failed to update job",
      );
    }
  },
);

export const closeJob = createAsyncThunk(
  "employer/closeJob",
  async (
    { employerId, jobId }: { employerId: string; jobId: string },
    { rejectWithValue },
  ) => {
    try {
      return await closeJobApi(employerId, jobId);
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message || "Failed to close job",
      );
    }
  },
);

export const fetchEmployerApplications = createAsyncThunk(
  "employer/fetchApplications",
  async (
    {
      employerId,
      page = 1,
      limit = 10,
      search = "",
      status = "all",
      jobTitle = "all",
    }: {
      employerId: string;
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      jobTitle?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      return await fetchEmployerApplicationsApi(employerId, {
        page,
        limit,
        search: search || undefined,
        status: status === "all" ? undefined : status,
        jobTitle: jobTitle === "all" ? undefined : jobTitle,
      });
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch applications",
      );
    }
  },
);

export const fetchNotifications = createAsyncThunk(
  "employer/fetchNotifications",
  async (employerId: string, { rejectWithValue }) => {
    try {
      return await fetchNotificationsApi(employerId);
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications",
      );
    }
  },
);

export const markNotificationAsRead = createAsyncThunk(
  "employer/markNotificationAsRead",
  async (
    {
      notificationId,
      employerId,
    }: { notificationId: string; employerId: string },
    { rejectWithValue },
  ) => {
    try {
      return await markNotificationAsReadApi(notificationId, employerId);
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark notification as read",
      );
    }
  },
);
