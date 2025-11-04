import React, { useState } from "react";
import { Link } from "react-router-dom";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import Table from "../../components/admin/Table";
import Pagination from "../../components/admin/Pagination";
import Modal from "../../components/admin/Modal";
import SearchInput from "../../components/admin/SearchInput";
import { CountCard } from "../../components/admin/CountCard";

const AdminNotifications: React.FC = () => {
  const mockNotifications = [
    {
      _id: "1",
      title: "New Job Posted",
      message: "Tech Corp posted a new job: Software Engineer",
      createdAt: "2025-10-24T10:00:00Z",
      isRead: false,
      type: "Job",
    },
    {
      _id: "2",
      title: "Candidate Application",
      message: "John Doe applied to Product Manager at Innovate Inc",
      createdAt: "2025-10-23T15:30:00Z",
      isRead: true,
      type: "Application",
    },
    {
      _id: "3",
      title: "Employer Verification",
      message: "Data Solutions requested verification",
      createdAt: "2025-10-22T09:15:00Z",
      isRead: false,
      type: "Verification",
    },
    {
      _id: "4",
      title: "Job Closed",
      message: "Creative Labs closed the UX Designer position",
      createdAt: "2025-10-21T12:45:00Z",
      isRead: true,
      type: "Job",
    },
    {
      _id: "5",
      title: "New Employer Registered",
      message: "Cloud Systems joined the platform",
      createdAt: "2025-10-20T08:20:00Z",
      isRead: false,
      type: "Registration",
    },
    {
      _id: "6",
      title: "Candidate Profile Updated",
      message: "Jane Smith updated their profile",
      createdAt: "2025-10-19T14:10:00Z",
      isRead: true,
      type: "Profile",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);
  const [selectedNotificationTitle, setSelectedNotificationTitle] =
    useState("");
  const [actionType, setActionType] = useState<
    "read" | "unread" | "delete" | null
  >(null);

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const total = filteredNotifications.length;
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount = notifications.filter((n) => n.isRead).length;
  //   const jobNotificationsCount = notifications.filter(
  //     (n) => n.type === "Job",
  //   ).length;

  const openModal = (
    id: string,
    title: string,
    action: "read" | "unread" | "delete",
  ) => {
    setSelectedNotificationId(id);
    setSelectedNotificationTitle(title);
    setActionType(action);
    setShowModal(true);
  };

  const handleAction = () => {
    if (selectedNotificationId && actionType) {
      if (actionType === "delete") {
        setNotifications((prev) =>
          prev.filter(
            (notification) => notification._id !== selectedNotificationId,
          ),
        );
      } else {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === selectedNotificationId
              ? { ...notification, isRead: actionType === "read" }
              : notification,
          ),
        );
      }
      setShowModal(false);
      setSelectedNotificationId(null);
      setSelectedNotificationTitle("");
      setActionType(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedNotificationId(null);
    setSelectedNotificationTitle("");
    setActionType(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <CountCard
          label="Total Notifications"
          count={total}
          icon={NotificationsNoneIcon}
          iconBg="bg-blue-100"
          iconColor="#2563eb"
        />
        <CountCard
          label="Read Notifications"
          count={readCount}
          icon={MarkEmailReadIcon}
          iconBg="bg-green-100"
          iconColor="#10b981"
        />
        <CountCard
          label="Unread Notifications"
          count={unreadCount}
          icon={MarkEmailUnreadIcon}
          iconBg="bg-orange-100"
          iconColor="#f59e0b"
        />
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <SearchInput
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
            <FilterListIcon sx={{ fontSize: 18, marginRight: 1 }} />
            Filter
          </button>
          <Link
            to="/admin-notification/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <AddIcon sx={{ fontSize: 18, marginRight: 1 }} />
            Add Notification
          </Link>
        </div>
      </div>

      {/* Notifications Table */}
      <Table
        data={paginatedNotifications}
        columns={[
          {
            key: "title",
            label: "Title",
            render: (value: string, notification: any) => (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <NotificationsNoneIcon
                    sx={{ fontSize: 20, color: "#2563eb" }}
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{value}</div>
                  <div className="text-xs text-gray-500">
                    ID: {notification._id}
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: "message",
            label: "Message",
            render: (value: string) => (
              <div className="text-gray-700 truncate max-w-xs">{value}</div>
            ),
          },
          {
            key: "type",
            label: "Type",
            render: (value: string) => (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {value || "N/A"}
              </span>
            ),
          },
          {
            key: "createdAt",
            label: "Date",
            render: (value: string) => (
              <span className="text-gray-900">{formatDate(value)}</span>
            ),
          },
          {
            key: "isRead",
            label: "Status",
            render: (value: boolean) => (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  value
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {value ? "Read" : "Unread"}
              </span>
            ),
          },
        ]}
        renderActions={(notification: any) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                openModal(
                  notification._id,
                  notification.title,
                  notification.isRead ? "unread" : "read",
                )
              }
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                notification.isRead
                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {notification.isRead ? (
                <MarkEmailUnreadIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
              ) : (
                <MarkEmailReadIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
              )}
              {notification.isRead ? "Mark Unread" : "Mark Read"}
            </button>
            <button
              onClick={() =>
                openModal(notification._id, notification.title, "delete")
              }
              className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200"
            >
              <DeleteIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
              Delete
            </button>
          </div>
        )}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={setCurrentPage}
        totalItems={total}
        itemsPerPage={itemsPerPage}
      />

      {/* Action Modal */}
      <Modal
        isOpen={showModal}
        onApprove={handleAction}
        onCancel={handleCancel}
        actionType={actionType ? "block" : "unblock"}
        name={selectedNotificationTitle}
      />
    </div>
  );
};

export default AdminNotifications;
