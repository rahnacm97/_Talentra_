import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Notification,
  NotificationState,
} from "../../types/notification/notification.types";
import {
  fetchNotifications,
  fetchNotificationStats,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../thunks/notification.thunk";

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
      state.total += 1;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
        state.page = action.payload.pagination.page;
        state.limit = action.payload.pagination.limit;
        state.total = action.payload.pagination.total;
        state.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch stats
      .addCase(fetchNotificationStats.fulfilled, (state, action) => {
        state.unreadCount = action.payload.unread;
        state.total = action.payload.total;
      })
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n.id === action.payload.id,
        );
        if (notification && !notification.isRead) {
          notification.isRead = true;
          notification.readAt = action.payload.readAt;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.isRead = true;
        });
        state.unreadCount = 0;
      })
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (n) => n.id === action.meta.arg,
        );
        if (index !== -1) {
          const wasUnread = !state.notifications[index].isRead;
          state.notifications.splice(index, 1);
          state.total -= 1;
          if (wasUnread) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      });
  },
});

export const { addNotification, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
