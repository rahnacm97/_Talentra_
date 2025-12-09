import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchNotificationsApi,
  getNotificationStatsApi,
  markAsReadApi,
  markAllAsReadApi,
  deleteNotificationApi,
} from "../features/notification/notificationApi";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (
    params: { page?: number; limit?: number; isRead?: boolean } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await fetchNotificationsApi(params);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notifications",
      );
    }
  },
);

export const fetchNotificationStats = createAsyncThunk(
  "notifications/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getNotificationStatsApi();
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notification stats",
      );
    }
  },
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await markAsReadApi(id);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark notification as read",
      );
    }
  },
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await markAllAsReadApi();
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark all as read",
      );
    }
  },
);

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteNotificationApi(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete notification",
      );
    }
  },
);
