import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { updateApplicationStatusApi } from "../../features/employer/employerApi";
import { fetchEmployerApplications } from "../../thunks/employer.thunk";
import type { EmployerApplicationResponseDto } from "../../types/application/application.types";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Download } from "@mui/icons-material";
import {
  Filter,
  Eye,
  Mail,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Clock,
  Star,
  Calendar,
  XCircle,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

import Pagination from "../../components/common/pagination/Pagination";
import PageHeader from "../../components/common/auth/PageHeader";

import { ApplicantDetailsModal } from "../../components/employer/ApplicantDetailModal";
import { toast } from "react-toastify";
import { formatFullName } from "../../utils/formatters";
import { handleFileDownload } from "../../utils/fileUtils";

const EmployerApplicants: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { applications, appPagination, appLoading } = useSelector(
    (state: RootState) => state.employer,
  );
  const authUser = useSelector((state: RootState) => state.auth.user);
  const employerId = authUser?._id as string;

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterJob, setFilterJob] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] =
    useState<EmployerApplicationResponseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const jobTitles = Array.from(new Set(applications.map((a) => a.jobTitle)));

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!employerId) return;

    dispatch(
      fetchEmployerApplications({
        page: currentPage,
        limit: 5,
        search: debouncedSearch || undefined,
        status: filterStatus === "all" ? undefined : filterStatus,
        jobTitle: filterJob === "all" ? undefined : filterJob,
      }),
    );
  }, [
    dispatch,
    employerId,
    currentPage,
    debouncedSearch,
    filterStatus,
    filterJob,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterJob]);

  const openModal = (app: EmployerApplicationResponseDto) => {
    setSelectedApplicant(app);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  const handleStatusUpdate = async (newStatus: string, data?: any) => {
    if (!selectedApplicant || !employerId) return;

    const payload: any = {
      status: newStatus,
      ...data,
    };

    try {
      await updateApplicationStatusApi(selectedApplicant.id, payload);

      dispatch(
        fetchEmployerApplications({
          page: currentPage,
          limit: 5,
          search: searchTerm || undefined,
          status: filterStatus === "all" ? undefined : filterStatus,
          jobTitle: filterJob === "all" ? undefined : filterJob,
        }),
      );

      toast.success(`Application status updated to ${newStatus}!`);
      closeModal();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
      throw err;
    }
  };

  if (!employerId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Please log in as an employer.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader
          title="Applications"
          description="Review and manage your job applications efficiently"
        />

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, email, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-gray-900 placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-10 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none appearance-none bg-white text-gray-900 font-medium cursor-pointer hover:border-gray-300"
              >
                <option value="all">All Status</option>
                {[
                  "pending",
                  "reviewed",
                  "shortlisted",
                  "interview",
                  "rejected",
                  "hired",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={filterJob}
                onChange={(e) => setFilterJob(e.target.value)}
                className="pl-10 pr-10 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none appearance-none bg-white text-gray-900 font-medium cursor-pointer hover:border-gray-300"
              >
                <option value="all">All Jobs</option>
                {jobTitles.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {(searchTerm || filterStatus !== "all" || filterJob !== "all") && (
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterJob("all");
                }}
                className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium bg-red-50 hover:bg-red-100 cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {appLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600 mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">
              Loading applications...
            </p>
          </div>
        )}

        {!appLoading && applications.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium">
              No applications found
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Try adjusting your filters
            </p>
          </div>
        )}

        {!appLoading &&
          applications.map((app) => (
            <div
              key={app.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md mb-6 overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {formatFullName(app.fullName)}
                    </h3>
                    <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                      <Briefcase className="w-4 h-4" />
                      <span>{app.candidate.title || "Software Engineer"}</span>
                    </div>
                    {app.email && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                        <Mail className="w-4 h-4" />
                        <span>{app.email}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${getStatusColor(app.status)}`}
                    >
                      {getStatusIcon(app.status)}
                      {app.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => openModal(app)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>

                  <button
                    onClick={() =>
                      setExpanded(expanded === app.id ? null : app.id)
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200 cursor-pointer"
                  >
                    {expanded === app.id ? (
                      <>
                        {" "}
                        <ChevronUp className="w-4 h-4" /> Hide Quick View{" "}
                      </>
                    ) : (
                      <>
                        {" "}
                        <ChevronDown className="w-4 h-4" /> Quick View{" "}
                      </>
                    )}
                  </button>
                </div>

                {expanded === app.id && (
                  <div className="mt-6 pt-6 border-t-2 border-gray-100 space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <MessageSquare className="w-5 h-5 text-gray-600 mt-0.5" />
                        <strong className="text-gray-900 font-semibold">
                          Cover Letter:
                        </strong>
                      </div>
                      <p className="text-gray-700 leading-relaxed ml-7">
                        {app.coverLetter || (
                          <span className="text-gray-400 italic">
                            No cover letter provided
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Download className="w-5 h-5 text-indigo-600" />
                        <strong className="text-gray-900 font-semibold">
                          Resume:
                        </strong>
                      </div>
                      <button
                        onClick={() => {
                          const fileName = `Resume_${app.fullName.replace(/\s+/g, "_")}`;
                          handleFileDownload(app.resume, fileName);
                        }}
                        className="inline-flex items-center gap-2 ml-7 px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-200 shadow-sm cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Download Resume
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

        {appPagination.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={appPagination.totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {selectedApplicant && (
          <ApplicantDetailsModal
            applicant={selectedApplicant}
            isOpen={isModalOpen}
            onClose={closeModal}
            onStatusChange={handleStatusUpdate}
          />
        )}
      </div>
    </div>
  );
};

const getStatusColor = (s: string) => {
  const map: Record<string, string> = {
    pending:
      "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200",
    reviewed:
      "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200",
    shortlisted:
      "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200",
    interview:
      "bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 border border-indigo-200",
    rejected:
      "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200",
    hired:
      "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
  };
  return map[s] || "bg-gray-100 text-gray-800 border border-gray-200";
};

const getStatusIcon = (s: string) => {
  const map: Record<string, React.ReactNode> = {
    pending: <Clock className="w-4 h-4" />,
    reviewed: <Eye className="w-4 h-4" />,
    shortlisted: <Star className="w-4 h-4" />,
    interview: <Calendar className="w-4 h-4" />,
    rejected: <XCircle className="w-4 h-4" />,
    hired: <CheckCircle className="w-4 h-4" />,
  };
  return map[s] || <Clock className="w-4 h-4" />;
};

export default EmployerApplicants;
