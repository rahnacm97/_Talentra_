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
<<<<<<< Updated upstream
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
=======
  XCircle,
  X,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchCandidateInterviews } from "../../thunks/interview.thunks";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/auth/PageHeader";
import Pagination from "../../components/common/pagination/Pagination";
>>>>>>> Stashed changes

const CandidateInterviews: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { interviews, loading, pagination } = useAppSelector(
    (s) => s.interview,
  );

  const [activeTab, setActiveTab] = useState<
    "all" | "scheduled" | "completed" | "cancelled"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
    { value: "all", label: "All", icon: Calendar },
    { value: "scheduled", label: "Scheduled", icon: Clock },
    { value: "completed", label: "Completed", icon: CheckCircle },
    { value: "cancelled", label: "Cancelled", icon: XCircle },
  ];

  if (loading && interviews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading your interviews...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <PageHeader
            title="My Interviews"
            description="Manage your upcoming and past interview schedules"
          />
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-gray-200 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value as any);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab.value
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105"
                    : "text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.value && (
                  <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                    {pagination.total}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="relative group max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title or company..."
              className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder-gray-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          {interviews.length === 0 ? (
            <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200 shadow-inner">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery || activeTab !== "all"
                  ? "No matches found"
                  : "No interviews scheduled yet"}
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {searchQuery
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "Keep applying — your next opportunity is just around the corner!"}
              </p>
            </div>
          ) : (
            interviews.map((interview) => (
              <div
                key={interview.id}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-indigo-200 transition-all duration-300"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                            interview.status === "completed"
                              ? "bg-green-500"
                              : interview.status === "cancelled"
                                ? "bg-red-500"
                                : "bg-blue-500 animate-pulse"
                          }`}
                        >
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {interview.job.title}
                        </h3>
                        <div className="flex items-center gap-2 font-semibold">
                          <User className="w-4 h-4" />
                          <span>
                            {interview.employer.companyName ||
                              interview.employer.name}
                          </span>
                        </div>
                      </div>
                    </div>

<<<<<<< Updated upstream
                    <div className="mt-4 sm:mt-0">
                      <button
                        onClick={() => setSelectedInterview(interview)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-md cursor-pointer"
                      >
                        <Eye className="w-5 h-5" />
                        View Details
                      </button>
=======
                    <div className="flex flex-wrap items-center gap-8">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                          Current Status
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border flex items-center gap-2 ${
                              interview.status === "hired"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : interview.status === "rejected"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : interview.status === "completed"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : interview.status === "cancelled"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-indigo-50 text-indigo-700 border-indigo-200"
                            }`}
                          >
                            {interview.status === "hired" && (
                              <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            {interview.status === "rejected" && (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {interview.status === "completed" && (
                              <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            {interview.status === "cancelled" && (
                              <AlertCircle className="w-3.5 h-3.5" />
                            )}
                            {(interview.status === "scheduled" ||
                              interview.status === "rescheduled") && (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                            {interview.status === "hired" ||
                            interview.status === "rejected"
                              ? "completed"
                              : interview.status}
                          </span>
                        </div>
                      </div>

                      {interview.interviewDate && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                            Date & Time
                          </span>
                          <div className="flex items-center gap-3 text-gray-700 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 font-bold">
                            <Clock className="w-4 h-4 text-indigo-600" />
                            <span>
                              {new Date(interview.interviewDate).toLocaleString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 w-full lg:w-auto">
                        <button
                          onClick={() =>
                            navigate(
                              FRONTEND_ROUTES.CANDIDATEINTERVIEWDETAIL.replace(
                                ":id",
                                interview.id,
                              ),
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>

                        {(interview.status === "scheduled" ||
                          interview.status === "rescheduled") &&
                          (() => {
                            const interviewTime = interview.interviewDate
                              ? new Date(interview.interviewDate).getTime()
                              : 0;
                            const windowStart = interviewTime - 15 * 60 * 1000;
                            const canJoin = Date.now() >= windowStart;

                            if (!canJoin) {
                              return (
                                <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl">
                                  <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider text-center leading-tight">
                                    Available 15m <br /> Before Start
                                  </p>
                                </div>
                              );
                            }
                          })()}
                      </div>
>>>>>>> Stashed changes
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              showPageNumbers={true}
              className="mt-8"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateInterviews;
