import React, { useEffect, useState, useCallback } from "react";
import {
  Calendar,
  User,
  Briefcase,
  Search,
  Eye,
  X,
  Video,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useVideoCall } from "../../contexts/VideoCallContext";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchEmployerInterviews } from "../../thunks/interview.thunks";
import { formatFullName } from "../../utils/formatters";
import EmployerInterviewDetailsModal from "../../components/employer/InterviewModal";
import type { Interview } from "../../types/interview/interview.types";
import Pagination from "../../components/common/pagination/Pagination";

const EmployerInterview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { interviews, loading, pagination, error } = useAppSelector(
    (s) => s.interview,
  );
  const { startCall } = useVideoCall();

  const [activeTab, setActiveTab] = useState<"all" | "scheduled" | "completed">(
    "all",
  );
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
      fetchEmployerInterviews({
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
  ];

  if (loading && interviews.length === 0) {
    return (
      <div className="py-20 text-center text-gray-600 text-lg">
        Loading your interviews...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-600 text-lg font-medium">{error}</p>
        <button
          onClick={() =>
            dispatch(fetchEmployerInterviews({ page: 1, limit: 5 }))
          }
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Retry
        </button>
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
            View and manage your candidate interviews
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <nav className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => (
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
            ))}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate or job title..."
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition hover:scale-110"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Interviews List */}
        <div className="space-y-6">
          {interviews.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl shadow-lg">
              <Calendar className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700">
                No interviews found
              </h3>
              <p className="text-gray-500 mt-2">
                {searchQuery
                  ? "No interviews match your search"
                  : "Interviews will appear here once scheduled"}
              </p>
            </div>
          ) : (
            <>
              {interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedInterview(interview)}
                >
                  <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 border-2 border-dashed border-gray-300">
                      {interview.candidate.profileImage ? (
                        <img
                          src={interview.candidate.profileImage}
                          alt={formatFullName(interview.candidate.fullName)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-gray-400 mx-auto mt-3" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {formatFullName(interview.candidate.fullName)}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            interview.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : interview.status === "scheduled"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {interview.status}
                        </span>
                      </div>
                      <p className="text-lg text-gray-600 mt-1 flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        {interview.job.title}
                      </p>
                      {interview.interviewDate && (
                        <div className="mt-3 flex items-center gap-3 text-gray-700">
                          <Calendar className="w-5 h-5 text-indigo-600" />
                          <span className="font-medium">
                            {new Date(
                              interview.interviewDate,
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInterview(interview);
                        }}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-sm whitespace-nowrap"
                      >
                        <Eye className="w-5 h-5" />
                        View Details
                      </button>
                      {interview.status === "scheduled" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startCall(
                              interview.id,
                              (interview.candidate as any)._id ||
                                (interview.candidate as any).id,
                              {
                                name:
                                  interview.employer.companyName ||
                                  interview.employer.name,
                                image: interview.employer.logo,
                              },
                              {
                                jobTitle: interview.job.title,
                                interviewDate:
                                  interview.interviewDate ||
                                  new Date().toISOString(),
                              },
                            );
                          }}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium shadow-sm whitespace-nowrap"
                        >
                          <Video className="w-5 h-5" />
                          Start Call
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {selectedInterview && (
          <EmployerInterviewDetailsModal
            interview={selectedInterview}
            onClose={() => setSelectedInterview(null)}
          />
        )}
      </div>
    </div>
  );
};

export default EmployerInterview;
