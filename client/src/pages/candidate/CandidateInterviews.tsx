import React, { useEffect, useState, useCallback } from "react";
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  CheckCircle,
  Eye,
  XCircle,
  Search,
} from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchCandidateInterviews } from "../../thunks/interview.thunks";
import InterviewDetailsModal from "../../components/candidate/InterviewModal";
import type { Interview } from "../../types/interview/interview.types";
import Pagination from "../../components/common/Pagination";

const formatDateTime = (dateIso: string) => {
  const date = new Date(dateIso);
  return (
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    " at " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
};

const CandidateInterviews: React.FC = () => {
  const dispatch = useAppDispatch();
  const { interviews, loading, pagination } = useAppSelector(
    (s) => s.interview,
  );

  const [activeTab, setActiveTab] = useState<
    "all" | "scheduled" | "completed" | "cancelled"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(
      fetchCandidateInterviews({
        page: currentPage,
        limit: 5,
        search: debouncedSearch || undefined,
        status: activeTab === "all" ? undefined : activeTab,
      }),
    );
  }, [dispatch, currentPage, debouncedSearch, activeTab]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const tabs = [
    { value: "all", label: "All Interviews", icon: Calendar },
    { value: "scheduled", label: "Scheduled", icon: Clock },
    { value: "completed", label: "Completed", icon: CheckCircle },
    { value: "cancelled", label: "Cancelled", icon: XCircle },
  ];

  if (loading && interviews.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-64"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow h-40"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interviews</h1>
          <p className="text-gray-600">
            Manage your upcoming and past interview schedules
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <nav className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => {
              return (
                <button
                  key={tab.value}
                  onClick={() => {
                    setActiveTab(tab.value as any);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab.value
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {activeTab === tab.value && (
                    <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {pagination.total}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title or company..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Interviews List */}
        <div className="space-y-6">
          {interviews.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow">
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 font-medium">
                {searchQuery || activeTab !== "all"
                  ? "No interviews match your search"
                  : "No interviews scheduled yet"}
              </p>
              <p className="text-gray-500 mt-2">
                Keep applying — your next opportunity is waiting!
              </p>
            </div>
          ) : (
            <>
              {interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="bg-indigo-100 p-4 rounded-xl">
                          <Briefcase className="w-7 h-7 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {interview.job.title}
                          </h3>

                          <p className="text-gray-600 flex items-center gap-2 mt-1 text-lg">
                            <User className="w-5 h-5" />
                            {interview.employer.name}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-8 text-base">
                        {interview.interviewDate && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <Calendar className="w-6 h-6 text-indigo-600" />
                            <span className="font-semibold">
                              {formatDateTime(interview.interviewDate)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <span className="font-semibold text-green-700 capitalize">
                            {interview.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0">
                      <button
                        onClick={() => setSelectedInterview(interview)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-md cursor-pointer"
                      >
                        <Eye className="w-5 h-5" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  showPageNumbers={true}
                  className="mt-8"
                />
              )}
            </>
          )}
        </div>

        {selectedInterview && (
          <InterviewDetailsModal
            interview={selectedInterview as any}
            onClose={() => setSelectedInterview(null)}
          />
        )}
      </div>
    </div>
  );
};

export default CandidateInterviews;
