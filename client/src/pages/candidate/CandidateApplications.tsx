import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchMyApplications } from "../../thunks/candidate.thunks";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import Pagination from "../../components/common/Pagination";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import type { Status } from "../../types/application/application.types";

const statusConfig: Record<
  Status,
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
    label: "Hired",
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

  // Debounced search (still useful for UX)
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

  // Show skeleton only on first load
  if (appsLoading && applications.length === 0) {
    return <ApplicationsSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Applications
          </h1>
          <p className="text-gray-600">
            Track and manage your job applications
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatusCard
            label="Total"
            count={pagination.total}
            borderColor="border-blue-600"
          />
          <StatusCard label="Pending" count={0} config={statusConfig.pending} />
          <StatusCard
            label="Reviewed"
            count={0}
            config={statusConfig.reviewed}
          />
          <StatusCard
            label="Shortlisted"
            count={0}
            config={statusConfig.shortlisted}
          />
          <StatusCard
            label="Rejected"
            count={0}
            config={statusConfig.rejected}
          />
        </div>

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

        {/* Pagination */}
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

const StatusCard = ({ label, count, config, borderColor }: any) => (
  <div
    className={`bg-white rounded-lg shadow p-4 border-l-4 ${borderColor || config?.bg.replace("bg-", "border-")}`}
  >
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="text-2xl font-bold text-gray-900">{count}</p>
    {config && <config.Icon className={`w-8 h-8 ${config.icon} mt-2`} />}
  </div>
);

const EmptyState = ({ navigate }: any) => (
  <div className="bg-white rounded-lg shadow-lg p-12 text-center">
    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No applications yet
    </h3>
    <p className="text-gray-600 mb-6">
      Start applying to jobs to see them here.
    </p>
    <button
      onClick={() => navigate(FRONTEND_ROUTES.JOBVIEW)}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center gap-2"
    >
      <Briefcase className="w-5 h-5" />
      Browse Jobs
    </button>
  </div>
);

const ApplicationCard = ({
  app,
  isOpen,
  onToggle,
  onViewDetails,
  formatDate,
  statusConfig,
}: any) => {
  const cfg = statusConfig[app.status];
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            {app.profileImage ? (
              <img
                src={app.profileImage}
                alt={app.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {app.name[0]}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                {app.jobTitle}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{app.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{app.location}</span>
                </div>
                {app.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{app.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{app.jobType}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                <Calendar className="w-4 h-4" />
                Applied on {formatDate(app.appliedAt)}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${cfg.bg} ${cfg.text} font-medium text-sm`}
            >
              <cfg.Icon className={`w-4 h-4 ${cfg.icon}`} />
              <span>{cfg.label}</span>
            </div>
            <button
              onClick={onToggle}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              {isOpen ? "Less" : "More"} Details
              {isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Job Description
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {app.description}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Requirements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {app.requirements.map((r: string, i: number) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onViewDetails}
                  className="mx-auto block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg cursor-pointer"
                >
                  View Application Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function useDebounce<T>(value: T, delay: number): [T] {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return [debounced];
}

// Skeleton
const ApplicationsSkeleton = () => (
  <div className="bg-gray-50 min-h-screen py-12">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-lg p-6 animate-pulse"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CandidateApplications;
