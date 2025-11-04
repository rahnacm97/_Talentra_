import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Filter,
  Search,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchInterviews,
  updateInterviewStatus,
} from "../../thunks/employer.thunk";
import type {
  Interview,
  EmployerState,
} from "../../types/employer/employer.types";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import { useNavigate } from "react-router-dom";

const EmployerInterview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { interviews, loading, error } = useAppSelector(
    (state) => state.employer as EmployerState,
  );
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (auth.user?._id) {
      dispatch(fetchInterviews(auth.user._id))
        .unwrap()
        .catch((err: any) => {
          if (
            err?.message?.includes("blocked") ||
            err?.status === 403 ||
            err?.message === "You have been blocked by admin"
          ) {
            navigate(FRONTEND_ROUTES.LOGIN);
          }
          toast.error(err?.message || "Failed to fetch interviews");
        });
    }
  }, [auth.user, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    // Filter interviews based on active tab and search query
    let filtered = interviews;
    if (activeTab !== "all") {
      filtered = interviews.filter(
        (interview: Interview) => interview.status === activeTab,
      );
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (interview: Interview) =>
          interview.candidateName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          interview.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    setFilteredInterviews(filtered);
  }, [interviews, activeTab, searchQuery]);

  const handleStatusUpdate = async (interviewId: string, status: string) => {
    if (!auth.user?._id) {
      toast.error("User not authenticated");
      return;
    }
    try {
      await dispatch(
        updateInterviewStatus({
          interviewId,
          status,
          employerId: auth.user._id,
        }),
      ).unwrap();
      setSuccessMessage(`Interview ${status.toLowerCase()} successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      toast.error(
        err?.message || `Failed to ${status.toLowerCase()} interview`,
      );
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
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
    { id: "all", label: "All Interviews", icon: Calendar },
    { id: "Scheduled", label: "Scheduled", icon: Clock },
    { id: "Completed", label: "Completed", icon: CheckCircle },
    { id: "Canceled", label: "Canceled", icon: XCircle },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interviews</h1>
          <p className="text-gray-600">
            Manage your scheduled interviews with candidates
          </p>
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
          {/* Search and Filter */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by candidate or job title"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          {/* Interviews List */}
          {loading ? (
            <div className="text-center text-gray-600">
              Loading interviews...
            </div>
          ) : filteredInterviews.length === 0 ? (
            <div className="text-center text-gray-600">
              No interviews found for the selected filter
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInterviews.map((interview: Interview) => (
                <div
                  key={interview.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {interview.candidateName}
                          </h3>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Briefcase className="w-4 h-4" />
                            <span>{interview.jobTitle}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-gray-500 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDateTime(interview.date, interview.time)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span className="capitalize">{interview.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {interview.status === "Scheduled" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(interview.id, "Reschedule")
                            }
                            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Reschedule</span>
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(interview.id, "Canceled")
                            }
                            className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </>
                      )}
                      {interview.status === "Completed" && (
                        <button className="flex items-center space-x-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-not-allowed">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
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

export default EmployerInterview;
