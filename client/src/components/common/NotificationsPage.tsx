import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../thunks/notification.thunk";
import PageHeader from "./PageHeader";
import { Bell, Trash2, CheckCheck } from "lucide-react";
import type { Notification } from "../../types/notification/notification.types";

const NotificationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications, loading, unreadCount, page, totalPages } =
    useAppSelector((state) => state.notifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    dispatch(
      fetchNotifications({
        page: 1,
        limit: 20,
        ...(filter === "unread" && { isRead: false }),
      }),
    );
  }, [dispatch, filter]);

  const handleMarkAsRead = (id: string, isRead: boolean) => {
    if (!isRead) {
      dispatch(markAsRead(id));
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDelete = (id: string) => {
    dispatch(deleteNotification(id));
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      dispatch(
        fetchNotifications({
          page: page + 1,
          limit: 20,
          ...(filter === "unread" && { isRead: false }),
        }),
      );
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <PageHeader
          title="Notifications"
          description="Track and manage your Notifications"
        />

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-gray-500">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                    : "All caught up!"}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "unread"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {loading && notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-500">
              {filter === "unread"
                ? "You have no unread notifications"
                : "You'll see notifications here when you receive them"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification: Notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md ${
                  !notification.isRead ? "border-l-4 border-blue-600" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.isRead && (
                          <button
                            onClick={() =>
                              handleMarkAsRead(
                                notification.id,
                                notification.isRead,
                              )
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Load More */}
            {page < totalPages && (
              <div className="text-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
