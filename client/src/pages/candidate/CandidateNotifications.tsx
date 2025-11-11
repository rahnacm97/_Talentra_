import React, { useState } from "react";
//import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  Bell,
  CheckCircle,
  Mail,
  Briefcase,
  Calendar,
  MessageSquare,
  TrendingUp,
  Heart,
  AlertCircle,
  Trash2,
  Check,
  Eye,
  Filter,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
//import { FRONTEND_ROUTES } from "../../shared/constants";

interface Notification {
  id: string;
  type:
    | "application"
    | "interview"
    | "message"
    | "job_match"
    | "saved_job"
    | "status_update"
    | "reminder";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    jobTitle?: string;
    company?: string;
    status?: string;
  };
}

const CandidateNotifications: React.FC = () => {
  //const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //const auth = useAppSelector((state) => state.auth);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "status_update",
      title: "Application Status Updated",
      message:
        "Your application for Senior Frontend Developer at Tech Corp has been shortlisted!",
      timestamp: "2025-10-25T10:30:00",
      read: false,
      metadata: {
        jobTitle: "Senior Frontend Developer",
        company: "Tech Corp",
        status: "shortlisted",
      },
    },
    {
      id: "2",
      type: "interview",
      title: "Interview Scheduled",
      message:
        "You have an interview scheduled for Full Stack Engineer position at StartupXYZ on Nov 5, 2025 at 2:00 PM.",
      timestamp: "2025-10-24T15:20:00",
      read: false,
      metadata: {
        jobTitle: "Full Stack Engineer",
        company: "StartupXYZ",
      },
    },
    {
      id: "3",
      type: "message",
      title: "New Message",
      message:
        "You received a message from the hiring manager at Digital Agency regarding your application.",
      timestamp: "2025-10-24T09:15:00",
      read: true,
      metadata: {
        company: "Digital Agency",
      },
    },
    {
      id: "4",
      type: "job_match",
      title: "New Job Match",
      message:
        "We found 3 new jobs matching your profile and preferences. Check them out!",
      timestamp: "2025-10-23T18:45:00",
      read: true,
    },
    {
      id: "5",
      type: "application",
      title: "Application Received",
      message:
        "Your application for React Developer at Creative Studios has been successfully submitted.",
      timestamp: "2025-10-23T14:30:00",
      read: true,
      metadata: {
        jobTitle: "React Developer",
        company: "Creative Studios",
      },
    },
    {
      id: "6",
      type: "reminder",
      title: "Application Deadline Reminder",
      message:
        "The application deadline for UI/UX Developer at Design Co is in 3 days.",
      timestamp: "2025-10-22T08:00:00",
      read: true,
      metadata: {
        jobTitle: "UI/UX Developer",
        company: "Design Co",
      },
    },
    {
      id: "7",
      type: "status_update",
      title: "Application Viewed",
      message:
        "Your application for Software Engineer at Enterprise Solutions has been viewed by the employer.",
      timestamp: "2025-10-21T16:20:00",
      read: true,
      metadata: {
        jobTitle: "Software Engineer",
        company: "Enterprise Solutions",
      },
    },
    {
      id: "8",
      type: "saved_job",
      title: "Saved Job Update",
      message:
        "The salary range for Backend Developer at Tech Startup has been updated.",
      timestamp: "2025-10-20T11:30:00",
      read: true,
      metadata: {
        jobTitle: "Backend Developer",
        company: "Tech Startup",
      },
    },
  ]);

  const [filterType, setFilterType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const notificationConfig = {
    application: {
      icon: Briefcase,
      color: "bg-blue-100 text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    interview: {
      icon: Calendar,
      color: "bg-purple-100 text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    message: {
      icon: MessageSquare,
      color: "bg-green-100 text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    job_match: {
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    saved_job: {
      icon: Heart,
      color: "bg-red-100 text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    status_update: {
      icon: CheckCircle,
      color: "bg-indigo-100 text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
    reminder: {
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filterType === "all") return true;
    if (filterType === "unread") return !notif.read;
    return notif.type === filterType;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

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

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all notifications? This action cannot be undone.",
      )
    ) {
      setNotifications([]);
    }
  };

  // const handleNotificationClick = (notification: Notification) => {
  //   handleMarkAsRead(notification.id);
  //   if (notification.actionUrl) {
  //     navigate(notification.actionUrl);
  //   }
  // };

  const getTypeCount = (type: string) => {
    if (type === "all") return notifications.length;
    if (type === "unread") return unreadCount;
    return notifications.filter((n) => n.type === type).length;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell className="w-8 h-8 text-blue-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Notifications
                </h1>
                <p className="text-gray-600">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                    : "You're all caught up!"}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark All Read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.length}
                </p>
              </div>
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Unread</p>
                <p className="text-2xl font-bold text-gray-900">
                  {unreadCount}
                </p>
              </div>
              <Mail className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Interviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getTypeCount("interview")}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Messages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getTypeCount("message")}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                Filter Notifications
              </span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform ${
                showFilters ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: "All" },
                  { key: "unread", label: "Unread" },
                  { key: "application", label: "Applications" },
                  { key: "interview", label: "Interviews" },
                  { key: "message", label: "Messages" },
                  { key: "job_match", label: "Job Matches" },
                  { key: "status_update", label: "Status Updates" },
                  { key: "reminder", label: "Reminders" },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterType(filter.key)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      filterType === filter.key
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {filter.label} ({getTypeCount(filter.key)})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const config = notificationConfig[notification.type];
              const Icon = config.icon;

              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 overflow-hidden ${
                    !notification.read ? "border-l-4 border-blue-600" : ""
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-lg ${config.color} flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.message}
                        </p>
                        {notification.metadata && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {notification.metadata.jobTitle && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                {notification.metadata.jobTitle}
                              </span>
                            )}
                            {notification.metadata.company && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                {notification.metadata.company}
                              </span>
                            )}
                            {notification.metadata.status && (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium capitalize">
                                {notification.metadata.status}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Mark as read"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Notifications
              </h3>
              <p className="text-gray-600 mb-6">
                {filterType !== "all"
                  ? "No notifications match your selected filter"
                  : "You don't have any notifications yet"}
              </p>
              {filterType !== "all" && (
                <button
                  onClick={() => setFilterType("all")}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All Notifications
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateNotifications;
