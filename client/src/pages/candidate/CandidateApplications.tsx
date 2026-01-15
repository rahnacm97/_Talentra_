import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchMyApplications } from "../../thunks/candidate.thunks";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
  Clock,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import Pagination from "../../components/common/pagination/Pagination";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import {
  useDebounce,
  ApplicationsSkeleton,
  EmptyState,
  ApplicationCard,
} from "../../components/candidate/ApplicationsComponents";
import type {
  Status,
  AppStatus,
} from "../../types/application/application.types";
import PageHeader from "../../components/common/auth/PageHeader";

const statusConfig: Record<
  AppStatus,
  { label: string; Icon: any; bg: string; text: string; icon: string }
> = {
  pending: {
    label: "Pending Review",
    Icon: Clock,
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    icon: "text-yellow-600",
  },
  reviewed: {
    label: "Reviewed",
    Icon: Eye,
    bg: "bg-blue-100",
    text: "text-blue-800",
    icon: "text-blue-600",
  },
  shortlisted: {
    label: "Shortlisted",
    Icon: CheckCircle,
    bg: "bg-purple-100",
    text: "text-purple-800",
    icon: "text-purple-600",
  },
  interview: {
    label: "Interview Scheduled",
    Icon: Calendar,
    bg: "bg-indigo-100",
    text: "text-indigo-800",
    icon: "text-indigo-600",
  },
  rejected: {
    label: "Rejected",
    Icon: XCircle,
    bg: "bg-red-100",
    text: "text-red-800",
    icon: "text-red-600",
  },
  hired: {
    label: "Hired!",
    Icon: CheckCircle,
    bg: "bg-green-100",
    text: "text-green-800",
    icon: "text-green-600",
  },
};

const CandidateApplications: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { applications, appsLoading, pagination } = useAppSelector(
    (s) => s.candidate,
  );
  const candidateId = useAppSelector((s) => s.auth.user?._id);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const [debouncedSearch] = useDebounce(search, 400);

  const PAGE_SIZE = 5;

  const loadApplications = useCallback(() => {
    if (!candidateId) return;

    dispatch(
      fetchMyApplications({
        status: statusFilter === "all" ? undefined : statusFilter,
        search: debouncedSearch || undefined,
        page,
        limit: PAGE_SIZE,
      }),
    );
  }, [dispatch, candidateId, statusFilter, debouncedSearch, page]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, debouncedSearch]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const toggleExpand = (id: string) =>
    setExpanded((prev) => (prev === id ? null : id));

  if (appsLoading && applications.length === 0) {
    return <ApplicationsSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <PageHeader
          title="My Applications"
          description="Track and manage your job applications"
        />

        {/* Search + Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search job title or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg flex items-center gap-2 transition"
            >
              <Filter className="w-5 h-5" />
              Filters
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {(search || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setShowFilters(false);
                }}
                className=" text-red-700 px-6 py-3 rounded-lg flex items-center gap-2 transition font-medium"
              >
                <CloseIcon className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Filter by Status:
              </p>
              <div className="flex flex-wrap gap-2">
                {["all", ...Object.keys(statusConfig)].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      statusFilter === s
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {s === "all" ? "All" : statusConfig[s as Status].label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {applications.length === 0 ? (
            <EmptyState navigate={navigate} />
          ) : (
            applications.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                isOpen={expanded === app.id}
                onToggle={() => toggleExpand(app.id)}
                onViewDetails={() =>
                  navigate(
                    FRONTEND_ROUTES.APPLICATIONDETAILS.replace(":id", app.id),
                  )
                }
                formatDate={formatDate}
                statusConfig={statusConfig}
              />
            ))
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="mt-10">
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateApplications;
