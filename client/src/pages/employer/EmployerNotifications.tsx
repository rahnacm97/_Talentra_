import React, { useState } from "react";
import {
  Bell,
  Briefcase,
  MessageSquare,
  Calendar,
  Search,
  CheckCircle,
  Check,
} from "lucide-react";

interface Notification {
  id: string;
  type: "Applications" | "Interviews" | "Messages";
  candidateName?: string;
  jobTitle?: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const EmployerNotifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "Applications",
      candidateName: "Rahul Sharma",
      jobTitle: "Senior Frontend Developer",
      message: "Applied for your job posting",
      timestamp: "2025-11-25T10:30:00Z",
      isRead: false,
    },
    {
      id: "2",
      type: "Interviews",
      candidateName: "Priya Singh",
      jobTitle: "UI/UX Designer",
      message: "Interview scheduled for tomorrow at 3:00 PM",
      timestamp: "2025-11-24T14:15:00Z",
      isRead: false,
    },
    {
      id: "3",
      type: "Messages",
      candidateName: "Amit Kumar",
      jobTitle: "Backend Engineer",
      message: "Sent you a new message regarding the role",
      timestamp: "2025-11-24T09:45:00Z",
      isRead: true,
    },
    {
      id: "4",
      type: "Applications",
      candidateName: "Neha Verma",
      jobTitle: "Product Manager",
      message: "Applied for your job posting",
      timestamp: "2025-11-23T16:20:00Z",
      isRead: true,
    },
    {
      id: "5",
      type: "Interviews",
      candidateName: "Vikram Patel",
      jobTitle: "DevOps Engineer",
      message: "Accepted interview invitation",
      timestamp: "2025-11-22T11:10:00Z",
      isRead: false,
    },
  ];

  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [successMessage, setSuccessMessage] = useState("");

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesTab = activeTab === "all" || notification.type === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notification.candidateName &&
        notification.candidateName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (notification.jobTitle &&
        notification.jobTitle
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
    );
    setSuccessMessage("Notification marked as read!");
    setTimeout(() => setSuccessMessage(""), 3000);
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

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-gray-600">
            Stay updated with applications, interviews, and messages
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <nav className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count =
                tab.id === "all"
                  ? notifications.length
                  : notifications.filter((n) => n.type === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all relative ${
                    activeTab === tab.id
                      ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No notifications found</p>
              <p className="text-sm mt-2">
                {searchQuery
                  ? "Try adjusting your search"
                  : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-5 transition-all ${
                    notification.isRead
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-indigo-200 shadow-sm hover:shadow-md border-2"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div
                        className={`p-3 rounded-lg ${
                          notification.type === "Applications"
                            ? "bg-blue-100"
                            : notification.type === "Interviews"
                              ? "bg-purple-100"
                              : "bg-green-100"
                        }`}
                      >
                        {notification.type === "Applications" && (
                          <Briefcase className="w-6 h-6 text-blue-600" />
                        )}
                        {notification.type === "Interviews" && (
                          <Calendar className="w-6 h-6 text-purple-600" />
                        )}
                        {notification.type === "Messages" && (
                          <MessageSquare className="w-6 h-6 text-green-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {notification.candidateName || "System"}
                          </h3>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-700 mt-1">
                          {notification.message}
                        </p>

                        {notification.jobTitle && (
                          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                            <Briefcase className="w-4 h-4" />
                            <span>{notification.jobTitle}</span>
                          </div>
                        )}

                        <p className="text-xs text-gray-500 mt-3">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>

                    <div className="ml-4">
                      {!notification.isRead ? (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Mark as Read</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                          <Check className="w-4 h-4" />
                          <span>Read</span>
                        </div>
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
