import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import type { RootState } from "../../app/store";
import {
  fetchAdminFeedback,
  updateFeedback,
  deleteFeedback,
} from "../../thunks/feedback.thunk";
import { toast } from "react-toastify";
import { Star, Check, X, Trash2, Award, User, Eye } from "lucide-react";
import type { Feedback } from "../../types/feedback/feedback.types";
import Table from "../../components/admin/Table";
import Pagination from "../../components/admin/Pagination";
import { StatCard } from "../../components/admin/Statcard";
import StarIcon from "@mui/icons-material/Star";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Modal from "../../components/admin/Modal";
import SearchInput from "../../components/admin/SearchInput";
import FeedbackViewModal from "../../components/admin/FeedbackViewModal";

const AdminFeedback: React.FC = () => {
  const dispatch = useAppDispatch();
  const { feedbacks, loading, total } = useAppSelector(
    (state: RootState) => state.feedback,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(
    null,
  );
  const [selectedUserName, setSelectedUserName] = useState("");
  const [viewFeedback, setViewFeedback] = useState<Feedback | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(
      fetchAdminFeedback({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, currentPage, debouncedSearch]);

  const handleStatusChange = async (
    id: string,
    status: "approved" | "rejected",
  ) => {
    const result = await dispatch(updateFeedback({ id, data: { status } }));
    if (updateFeedback.fulfilled.match(result)) {
      toast.success(`Feedback ${status} successfully`);
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    const result = await dispatch(
      updateFeedback({ id, data: { isFeatured: !isFeatured } }),
    );
    if (updateFeedback.fulfilled.match(result)) {
      toast.success(isFeatured ? "Removed from featured" : "Added to featured");
    } else {
      toast.error(result.payload as string);
    }
  };

  const confirmDelete = (id: string, name: string) => {
    setSelectedFeedbackId(id);
    setSelectedUserName(name);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedFeedbackId) return;
    const result = await dispatch(deleteFeedback(selectedFeedbackId));
    if (deleteFeedback.fulfilled.match(result)) {
      toast.success("Feedback deleted successfully");
    } else {
      toast.error(result.payload as string);
    }
    setShowModal(false);
    setSelectedFeedbackId(null);
    setSelectedUserName("");
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedFeedbackId(null);
    setSelectedUserName("");
  };

  const handleShowView = (feedback: Feedback) => {
    setViewFeedback(feedback);
    setShowViewModal(true);
  };

  const handleCloseView = () => {
    setShowViewModal(false);
    setViewFeedback(null);
  };

  const approvedCount = feedbacks.filter((f) => f.status === "approved").length;
  const pendingCount = feedbacks.filter((f) => f.status === "pending").length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Feedback Management
        </h1>
        <p className="text-gray-600">
          Manage and update user testimonials and reviews on the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Feedback"
          value={total}
          icon={RateReviewIcon}
          iconBg="bg-blue-100"
          iconColor="#2563eb"
        />
        <StatCard
          title="Approved"
          value={approvedCount}
          icon={CheckCircleIcon}
          iconBg="bg-green-100"
          iconColor="#10b981"
        />
        <StatCard
          title="Pending"
          value={pendingCount}
          icon={StarIcon}
          iconBg="bg-amber-100"
          iconColor="#f59e0b"
        />
        <StatCard
          title="Featured"
          value={feedbacks.filter((f) => f.isFeatured).length}
          icon={Award as any}
          iconBg="bg-purple-100"
          iconColor="#7c3aed"
        />
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <SearchInput
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
          placeholder="Search feedback by user name, type or comment..."
        />
      </div>

      {loading && feedbacks.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <Table
            data={feedbacks}
            columns={[
              {
                key: "userName",
                label: "User",
                render: (_: any, item: Feedback) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                      <User className="text-indigo-500 w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 leading-tight">
                        {typeof item.userId === "object"
                          ? item.userId.name
                          : item.userName}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {item.userType}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: "comment",
                label: "Feedback",
                render: (value: string) => (
                  <div className="max-w-xs truncate text-gray-600 text-sm italic">
                    "{value}"
                  </div>
                ),
              },
              {
                key: "rating",
                label: "Rating",
                render: (value: number) => (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{value}</span>
                  </div>
                ),
              },
              {
                key: "status",
                label: "Status",
                render: (value: string) => (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      value === "approved"
                        ? "bg-green-100 text-green-800"
                        : value === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </span>
                ),
              },
              {
                key: "featured",
                label: "Featured",
                render: (_: any, item: Feedback) => (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium  ${
                      item.isFeatured
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.isFeatured ? "Featured" : "Unfeatured"}
                  </span>
                ),
              },
            ]}
            renderActions={(item: Feedback) => (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleShowView(item)}
                  className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                  title="View Detail"
                >
                  <Eye size={16} />
                </button>
                {item.status !== "approved" && (
                  <button
                    onClick={() => handleStatusChange(item.id, "approved")}
                    className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                    title="Approve"
                  >
                    <Check size={16} />
                  </button>
                )}
                {item.status !== "rejected" && (
                  <button
                    onClick={() => handleStatusChange(item.id, "rejected")}
                    className="p-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                    title="Reject"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleToggleFeatured(item.id, item.isFeatured)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    item.isFeatured
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  }`}
                  title={item.isFeatured ? "Unfeature" : "Feature"}
                >
                  <Award size={16} />
                </button>
                <button
                  onClick={() =>
                    confirmDelete(
                      item.id,
                      typeof item.userId === "object"
                        ? item.userId.name
                        : item.userName,
                    )
                  }
                  className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(total / itemsPerPage)}
            paginate={setCurrentPage}
            totalItems={total}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}

      <Modal
        isOpen={showModal}
        onApprove={handleDelete}
        onCancel={handleCancel}
        actionType="delete"
        name={selectedUserName}
      />

      {showViewModal && viewFeedback && (
        <FeedbackViewModal
          feedback={viewFeedback}
          isOpen={showViewModal}
          onClose={handleCloseView}
        />
      )}
    </div>
  );
};

export default AdminFeedback;
