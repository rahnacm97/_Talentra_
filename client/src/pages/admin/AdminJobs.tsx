import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import type { AdminJob } from "../../types/admin/admin.jobs.types";
import { fetchAdminJobs } from "../../thunks/admin.thunk";
import Table from "../../components/admin/Table";
import Pagination from "../../components/admin/Pagination";
import SearchInput from "../../components/admin/SearchInput";
import { StatCard } from "../../components/admin/Statcard";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import WorkIcon from "@mui/icons-material/Work";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useDebounce } from "../../hooks/UseDebounce";
import { JobDetailsModal } from "../../components/admin/JobDetailModal";

const AdminJobs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, total, page, limit, loading, error } = useAppSelector(
    (state) => state.adminJobs,
  );

  const [searchTerm, setSearchTerm] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("search") || "";
  });
  const debouncedSearch = useDebounce(searchTerm, 450);
  const [statusFilter, setStatusFilter] = useState<
    "active" | "closed" | "draft" | "all"
  >("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [localPage, setLocalPage] = useState(page);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJobForDetails, setSelectedJobForDetails] =
    useState<AdminJob | null>(null);

  useEffect(() => {
    dispatch(
      fetchAdminJobs({
        page: localPage,
        limit: 5,
        search: debouncedSearch || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        type: typeFilter === "all" ? undefined : typeFilter,
      }),
    );
  }, [dispatch, limit, debouncedSearch, statusFilter, typeFilter, localPage]);

  useEffect(() => {
    setLocalPage(1);
  }, [debouncedSearch, statusFilter, typeFilter]);

  useEffect(() => {
    setLocalPage(page);
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  const activeJobsCount = jobs.filter((j) => j.status === "active").length;
  const closedJobsCount = jobs.filter((j) => j.status === "closed").length;
  const fullTimeCount = jobs.filter((j) => j.type === "Full-time").length;

  const openDetailsModal = (job: AdminJob) => {
    setSelectedJobForDetails(job);
    setShowDetailsModal(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setLocalPage(1);
  };

  if (loading) return <div className="p-6">Loading jobs...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Jobs Management
        </h1>
        <p className="text-gray-600">
          Manage and monitor all registered Jobs on this platform.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Jobs"
          value={total}
          icon={WorkIcon}
          iconBg="bg-blue-100"
          iconColor="#2563eb"
        />
        <StatCard
          title="Active Jobs"
          value={activeJobsCount}
          icon={ToggleOnIcon}
          iconBg="bg-green-100"
          iconColor="#10b981"
        />
        <StatCard
          title="Closed Jobs"
          value={closedJobsCount}
          icon={ToggleOffIcon}
          iconBg="bg-red-100"
          iconColor="#ef4444"
        />
        <StatCard
          title="Full-time Jobs"
          value={fullTimeCount}
          icon={ScheduleIcon}
          iconBg="bg-orange-100"
          iconColor="#f59e0b"
        />
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <SearchInput
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
          placeholder="Search jobs by name, company..."
        />

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto mt-4 sm:mt-0">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "active" | "closed" | "draft" | "all",
              )
            }
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
          {(searchTerm || statusFilter !== "all" || typeFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center"
            >
              <FilterListOffIcon sx={{ fontSize: 18, marginRight: 0.5 }} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <Table
        data={jobs}
        columns={[
          {
            key: "title",
            label: "Job Title",
            render: (value: string, job: AdminJob) => (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <WorkIcon sx={{ fontSize: 20, color: "#2563eb" }} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{value}</div>
                  <div className="text-xs text-gray-500">ID: {job._id}</div>
                </div>
              </div>
            ),
          },
          {
            key: "employer.name",
            label: "Company",
            render: (_: any, job: AdminJob) => (
              <div className="flex items-center">
                <img
                  src={job.employer.profileImage || "/default-logo.png"}
                  alt={job.employer.name}
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                />
                {job.employer.name}
              </div>
            ),
          },
          {
            key: "type",
            label: "Type",
            render: (value: string) => (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {value}
              </span>
            ),
          },
          {
            key: "applicants",
            label: "Applications",
            render: (value: number) => (
              <span className="font-medium text-gray-900">{value}</span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (value: "active" | "closed" | "draft") => (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  value === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </span>
            ),
          },
        ]}
        renderActions={(job: AdminJob) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openDetailsModal(job)}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
            >
              View Details
            </button>
          </div>
        )}
      />

      <Pagination
        currentPage={localPage}
        totalPages={totalPages}
        paginate={(newPage: number) => setLocalPage(newPage)}
        totalItems={total}
        itemsPerPage={limit}
      />

      <JobDetailsModal
        job={selectedJobForDetails}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedJobForDetails(null);
        }}
      />
    </div>
  );
};

export default AdminJobs;
