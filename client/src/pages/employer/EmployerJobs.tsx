import React, { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
  Plus,
  Briefcase,
  MapPin,
  IndianRupee,
  Clock,
  Users,
  Calendar,
  Eye,
  Edit3,
  Filter,
  Building2,
} from "lucide-react";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  fetchEmployerJobs,
  postJob,
  updateJob,
  closeJob,
} from "../../thunks/employer.thunk";
import { toast } from "react-toastify";
import JobViewModal from "../../components/employer/JobViewModal";
import JobFormModal from "../../components/employer/JobFormModal";
import type { JobFormValues } from "../../shared/validations/JobFormValidation";
import type { Job } from "../../types/job/job.types";
import { getStatusColor } from "../../utils/StatusColor";
import PageHeader from "../../components/common/PageHeader";
import { StatCard } from "../../components/employer/StatCard";

const EmployerJobs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 5;

  const [showCloseModal, setShowCloseModal] = useState<Job | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "closed" | "draft"
  >("all");

  
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus]);

  useEffect(() => {
    if (!user?._id) return;

    setLoading(true);
    dispatch(
      fetchEmployerJobs({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: filterStatus === "all" ? undefined : filterStatus,
      }),
    )
      .unwrap()
      .then((data) => {
        setJobs(data.jobs);
        setTotal(data.total);
        setLoading(false);
      })
      .catch((err) => {
        console.log("error in employer jobs", err);
        setLoading(false);
      });
  }, [dispatch, user, page, debouncedSearch, filterStatus]);

  const handleCloseJob = async (job: Job) => {
    if (!user?._id) return;
    try {
      const closed = await dispatch(closeJob({ jobId: job.id })).unwrap();
      setJobs((prev) => prev.map((j) => (j.id === closed.id ? closed : j)));
      toast.success("Job closed successfully");
      setShowCloseModal(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to close job");
    }
  };

  const openViewModal = (job: Job) => setViewingJob(job);
  const closeViewModal = () => setViewingJob(null);

  const openPostModal = () => {
    setEditingJob(null);
    setShowModal(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingJob(null);
  };

  const handlePost = async (values: JobFormValues) => {
    if (!user?._id) return;
    const jobData = { ...values, status: "active" as const };
    try {
      const posted = await dispatch(postJob({ job: jobData })).unwrap();
      setJobs([posted, ...jobs]);
      toast.success("Job posted successfully!");
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to post job");
    }
  };

  const handleEdit = async (values: JobFormValues) => {
    if (!editingJob || !user?._id) return;
    try {
      const updated = await dispatch(
        updateJob({
          jobId: editingJob.id,
          job: { ...values, status: editingJob.status },
        }),
      ).unwrap();
      setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
      toast.success("Job updated successfully!");
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to update job");
    }
  };

  const formatExperience = (exp: string): string => {
    switch (exp) {
      case "0":
        return "Fresher";
      case "1-2":
        return "1-2 years";
      case "3-5":
        return "3-5 years";
      case "6-8":
        return "6-8 years";
      case "9-12":
        return "9-12 years";
      case "13+":
        return "13+ years";
      default:
        return exp;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalPages = Math.ceil(total / limit);

  const clearSearch = () => {
    setSearchInput("");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl h-32 p-6 shadow-md"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader
          title="Manage Jobs"
          description="Post new positions and manage existing job listings"
          action={
            <button
              onClick={openPostModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Post New Job</span>
            </button>
          }
        />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            label="Total Jobs"
            value={total}
            icon={Briefcase}
            iconBg="bg-blue-100"
            iconColor="#2563eb"
            borderColor="border-blue-600"
          />
          <StatCard
            label="Active Jobs"
            value={jobs.filter((j) => j.status === "active").length}
            icon={Briefcase}
            iconBg="bg-green-100"
            iconColor="#10b981"
            borderColor="border-green-600"
          />
          <StatCard
            label="Total Applicants"
            value={jobs.reduce((sum, j) => sum + j.applicants, 0)}
            icon={Users}
            iconBg="bg-purple-100"
            iconColor="#7c3aed"
            borderColor="border-purple-600"
          />
          <StatCard
            label="Closed Jobs"
            value={jobs.filter((j) => j.status === "closed").length}
            icon={Briefcase}
            iconBg="bg-orange-100"
            iconColor="#f97316"
            borderColor="border-orange-600"
          />
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs by title or department..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "all" | "active" | "closed")
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        job.status,
                      )}`}
                    >
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-3">
                    <div className="flex items-center space-x-1">
                      <Building2 className="w-4 h-4" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <IndianRupee className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{formatExperience(job.experience)}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span className="text-gray-700">
                        <strong>{job.applicants}</strong> applicants
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-500">
                        Posted {formatDate(job.postedDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-red-500" />
                      <span className="text-gray-500">
                        Deadline {formatDate(job.deadline)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => openViewModal(job)}
                    className="text-indigo-600 hover:text-indigo-800 p-2 bg-indigo-50 rounded-lg"
                    title="View job"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openEditModal(job)}
                    className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded-lg"
                    title="Edit job"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  {job.status === "active" && (
                    <button
                      onClick={() => setShowCloseModal(job)}
                      className="text-orange-600 hover:text-orange-800 p-2 bg-orange-50 rounded-lg"
                      title="Close job"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600">
                {debouncedSearch || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't posted any jobs yet. Click 'Post New Job' to get started!"}
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Modals */}
      {showCloseModal && (
        <ConfirmModal
          title="Close Job"
          message={`Are you sure you want to close "${showCloseModal.title}"? This will stop accepting new applicants.`}
          confirmLabel="Close Job"
          cancelLabel="Cancel"
          onConfirm={() => handleCloseJob(showCloseModal)}
          onCancel={() => setShowCloseModal(null)}
        />
      )}

      {showModal && (
        <JobFormModal
          mode={editingJob ? "edit" : "post"}
          initialValues={
            editingJob
              ? {
                  title: editingJob.title,
                  department: editingJob.department,
                  location: editingJob.location,
                  type: editingJob.type as
                    | "Full-time"
                    | "Part-time"
                    | "Contract"
                    | "Internship",
                  salary: editingJob.salary,
                  description: editingJob.description,
                  requirements: editingJob.requirements,
                  responsibilities: editingJob.responsibilities,
                  deadline: editingJob.deadline,
                  experience: editingJob.experience,
                }
              : undefined
          }
          onSubmit={editingJob ? handleEdit : handlePost}
          onClose={closeModal}
        />
      )}

      {viewingJob && <JobViewModal job={viewingJob} onClose={closeViewModal} />}
    </div>
  );
};

export default EmployerJobs;
