import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  Bell,
  Briefcase,
  MessageSquare,
  CheckCircle,
  Search,
  Check,
  Calendar,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../../thunks/employer.thunk";
import type {
  Notification,
  EmployerState,
} from "../../types/employer/employer.types";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import { useNavigate } from "react-router-dom";

const EmployerNotifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications, loading, error } = useAppSelector(
    (state) => state.employer as EmployerState,
  );
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (auth.user?._id) {
      dispatch(fetchNotifications(auth.user._id))
        .unwrap()
        .catch((err: any) => {
          if (
            err?.message?.includes("blocked") ||
            err?.status === 403 ||
            err?.message === "You have been blocked by admin"
          ) {
            navigate(FRONTEND_ROUTES.LOGIN);
          }
          toast.error(err?.message || "Failed to fetch notifications");
        });
    }
  }, [auth.user, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    // Filter notifications based on active tab and search query
    let filtered = notifications;
    if (activeTab !== "all") {
      filtered = notifications.filter(
        (notification: Notification) => notification.type === activeTab,
      );
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (notification: Notification) =>
          notification.message
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (notification.candidateName &&
            notification.candidateName
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (notification.jobTitle &&
            notification.jobTitle
              .toLowerCase()
              .includes(searchQuery.toLowerCase())),
      );
    }
    setFilteredNotifications(filtered);
  }, [notifications, activeTab, searchQuery]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!auth.user?._id) {
      toast.error("User not authenticated");
      return;
    }
    try {
      await dispatch(
        markNotificationAsRead({ notificationId, employerId: auth.user._id }),
      ).unwrap();
      setSuccessMessage("Notification marked as read!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      toast.error(err?.message || "Failed to mark notification as read");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const tabs = [
    { id: "all", label: "All Notifications", icon: Bell },
    { id: "Applications", label: "Applications", icon: Briefcase },
    { id: "Interviews", label: "Interviews", icon: Calendar },
    { id: "Messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Notifications
          </h1>
          <p className="text-gray-600">View and manage your notifications</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Top Bar Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <nav className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="text-center text-gray-600">
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center text-gray-600">
              No notifications found for the selected filter
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification: Notification) => (
                <div
                  key={notification.id}
                  className={`border border-gray-200 rounded-lg p-4 transition-colors ${
                    notification.isRead
                      ? "bg-gray-50"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          {notification.type === "Applications" && (
                            <Briefcase className="w-5 h-5 text-indigo-600" />
                          )}
                          {notification.type === "Interviews" && (
                            <Calendar className="w-5 h-5 text-indigo-600" />
                          )}
                          {notification.type === "Messages" && (
                            <MessageSquare className="w-5 h-5 text-indigo-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {notification.candidateName || notification.type}
                          </h3>
                          <p className="text-gray-600">
                            {notification.message}
                          </p>
                          {notification.jobTitle && (
                            <div className="flex items-center space-x-2 text-gray-600 mt-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{notification.jobTitle}</span>
                            </div>
                          )}
                          <div className="mt-2 text-gray-500 text-sm">
                            <span>
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Mark as Read</span>
                        </button>
                      )}
                      {notification.isRead && (
                        <button className="flex items-center space-x-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-not-allowed">
                          <CheckCircle className="w-4 h-4" />
                          <span>Read</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerNotifications;
