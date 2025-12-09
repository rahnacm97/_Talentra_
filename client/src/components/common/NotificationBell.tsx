import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  fetchNotifications,
  fetchNotificationStats,
  markAsRead,
} from "../../thunks/notification.thunk";
import { Link } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";

const NotificationBell: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector(
    (state) => state.notifications,
  );
  const user = useAppSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notification stats on mount
  useEffect(() => {
    dispatch(fetchNotificationStats());
  }, [dispatch]);

  // Fetch recent notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications({ page: 1, limit: 5 }));
    }
  }, [isOpen, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      dispatch(markAsRead(id));
    }
    setIsOpen(false);
  };

  const getNotificationsRoute = () => {
    if (user?.role === "Admin") return FRONTEND_ROUTES.ADMINNOTIFICATIONS;
    if (user?.role === "Employer") return FRONTEND_ROUTES.EMPLOYERNOTIFICATIONS;
    return FRONTEND_ROUTES.CANDIDATENOTIFICATIONS;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full min-w-[20px]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-xs text-gray-500">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  onClick={() =>
                    handleNotificationClick(
                      notification.id,
                      notification.isRead,
                    )
                  }
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <Link
                to={getNotificationsRoute()}
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
