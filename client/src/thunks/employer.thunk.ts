import { createAsyncThunk } from "@reduxjs/toolkit";
import { getEmployerProfileApi } from "../features/employer/employerApi";
import { toast } from "react-toastify";
import api from "../api/api";
import type { Interview } from "../types/employer/employer.types";
import axios from "axios";
import { API_ROUTES } from "../shared/constants";
const API_URL = "http://your-api-base-url/api";

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

export const updateEmployerProfile = createAsyncThunk(
  "employer/updateProfile",
  async (
    { employerId, data }: { employerId: string; data: FormData },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(
        API_ROUTES.EMPLOYER.PROFILE(employerId),
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchInterviews = createAsyncThunk(
  "employer/fetchInterviews",
  async (employerId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/employer/${employerId}/interviews`);
      return response.data as Interview[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch interviews",
      );
    }
  },
);

export const updateInterviewStatus = createAsyncThunk(
  "employer/updateInterviewStatus",
  async (
    {
      interviewId,
      status,
      employerId,
    }: { interviewId: string; status: string; employerId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(
        `/employer/${employerId}/interviews/${interviewId}`,
        { status },
      );
      return response.data as Interview;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update interview status",
      );
    }
  },
);

// Fetch notifications for an employer
export const fetchNotifications = createAsyncThunk(
  "employer/fetchNotifications",
  async (employerId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/notifications/${employerId}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications",
      );
    }
  },
);

// Mark a notification as read
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
      const response = await axios.patch(
        `${API_URL}/notifications/${notificationId}/read`,
        { employerId },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark notification as read",
      );
    }
  },
);
