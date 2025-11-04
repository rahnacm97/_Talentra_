import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import type { AdminJob } from "../../types/admin/admin.jobs.types";
import { fetchAdminJobs } from "../../thunks/admin.thunk";
import Table from "../../components/admin/Table";
import Pagination from "../../components/admin/Pagination";
import Modal from "../../components/admin/Modal";
import SearchInput from "../../components/admin/SearchInput";
import { CountCard } from "../../components/admin/CountCard";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import WorkIcon from "@mui/icons-material/Work";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useDebounce } from "../../hooks/UseDebounce";

const AdminJobs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, total, page, limit, loading, error } = useAppSelector(
    (state) => state.adminJobs,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 450);
  const [statusFilter, setStatusFilter] = useState<"active" | "closed" | "all">(
    "all",
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null);
  const [localPage, setLocalPage] = useState(page);

  useEffect(() => {
    dispatch(
      fetchAdminJobs({
        page: localPage,
        limit,
        search: debouncedSearch || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
    );
  }, [dispatch, localPage, limit, debouncedSearch, statusFilter]);

  useEffect(() => {
    if (localPage !== 1) setLocalPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    setLocalPage(page);
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  const activeJobsCount = jobs.filter((j) => j.status === "active").length;
  const closedJobsCount = jobs.filter((j) => j.status === "closed").length;
  const fullTimeCount = jobs.filter((j) => j.jobType === "Full-time").length;

  const openModal = (job: AdminJob) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleToggleStatus = () => {
    if (selectedJob) {
      setShowModal(false);
      setSelectedJob(null);
    }
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
        <CountCard
          label="Total Jobs"
          count={total}
          icon={WorkIcon}
          iconBg="bg-blue-100"
          iconColor="#2563eb"
        />
        <CountCard
          label="Active Jobs"
          count={activeJobsCount}
          icon={ToggleOnIcon}
          iconBg="bg-green-100"
          iconColor="#10b981"
        />
        <CountCard
          label="Closed Jobs"
          count={closedJobsCount}
          icon={ToggleOffIcon}
          iconBg="bg-red-100"
          iconColor="#ef4444"
        />
        <CountCard
          label="Full-time Jobs"
          count={fullTimeCount}
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
        {debouncedSearch !== searchTerm && (
          <p className="absolute -bottom-5 left-0 text-xs text-gray-500 animate-pulse">
            Searching…
          </p>
        )}
        {/* <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "active" | "closed" | "all")
          }
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select> */}
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
            key: "employer.companyName",
            label: "Company",
            render: (_: any, job: AdminJob) => (
              <div className="flex items-center">
                <img
                  src={job.employer.logo || "/default-logo.png"}
                  alt={job.employer.companyName}
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                />
                {job.employer.companyName}
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
              onClick={() => openModal(job)}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                job.status === "active"
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {job.status === "active" ? "Close" : "Activate"}
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

      <Modal
        isOpen={showModal}
        onApprove={handleToggleStatus}
        onCancel={() => setShowModal(false)}
        actionType={selectedJob?.status === "active" ? "block" : "unblock"}
        name={selectedJob?.title || ""}
      />
    </div>
  );
};

export default AdminJobs;
