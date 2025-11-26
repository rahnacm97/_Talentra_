import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchSavedJobs, unsaveJob } from "../../thunks/job.thunk";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import {
  Heart,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  TrendingUp,
  Users,
} from "lucide-react";
import Pagination from "../../components/candidate/CandidatePagination";
import { useDebounce } from "../../components/candidate/SavedJobs";
import { SavedJobsSkeleton } from "../../components/candidate/SavedJobs";
import { EmptyState } from "../../components/candidate/SavedJobs";

const CandidateSavedJobs: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { savedJobs, savedJobsLoading } = useAppSelector(
    (state) => state.candidateJobs,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState<"all" | string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;
  const [debouncedSearch] = useDebounce(searchQuery, 400);

  const loadSavedJobs = useCallback(() => {
    dispatch(fetchSavedJobs({}));
  }, [dispatch]);

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, jobTypeFilter]);

  const filteredJobs = savedJobs
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.employer.companyName
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        job.location.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesType = jobTypeFilter === "all" || job.type === jobTypeFilter;

      return matchesSearch && matchesType;
    })
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalPages = Math.ceil(
    savedJobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.employer.companyName
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        job.location.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesType = jobTypeFilter === "all" || job.type === jobTypeFilter;
      return matchesSearch && matchesType;
    }).length / PAGE_SIZE,
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getDaysRemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const handleRemove = (jobId: string) => {
    dispatch(unsaveJob(jobId));
  };

  if (savedJobsLoading && savedJobs.length === 0) {
    return <SavedJobsSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
          <p className="text-gray-600">
            Keep track of jobs you're interested in and apply when ready
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by job title, company, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
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

            {jobTypeFilter !== "all" && (
              <button
                onClick={() => {
                  setJobTypeFilter("all");
                  setShowFilters(false);
                  setPage(1);
                }}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-3 rounded-lg flex items-center gap-2 transition font-medium"
              >
                <X className="w-5 h-5" />
                Clear Filters
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Job Type:
              </p>
              <div className="flex flex-wrap gap-2">
                {["all", "Full-time", "Part-time", "Contract"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setJobTypeFilter(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      jobTypeFilter === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type === "all" ? "All Types" : type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredJobs.length === 0 ? (
          <EmptyState navigate={navigate} />
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => {
              const daysLeft = getDaysRemaining(job.deadline);
              const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0">
                          {job.employer.logo ? (
                            <img
                              src={job.employer.logo}
                              alt={job.employer.companyName}
                              className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                              {job.employer.companyName[0]}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3
                            onClick={() =>
                              navigate(
                                FRONTEND_ROUTES.JOBDETAILS.replace(
                                  ":id",
                                  job.id,
                                ),
                              )
                            }
                            className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition"
                          >
                            {job.title}
                          </h3>
                          <p className="text-gray-700 font-medium mt-1">
                            {job.employer.companyName}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{job.type}</span>
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{job.salary}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>{job.experience}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Posted {formatDate(job.postedDate)}</span>
                            </div>
                            <div
                              className={`flex items-center gap-1 ${
                                isExpiringSoon ? "text-red-600 font-medium" : ""
                              }`}
                            >
                              <Clock className="w-4 h-4" />
                              <span>
                                {daysLeft > 0
                                  ? `${daysLeft} days left`
                                  : "Deadline passed"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{job.applicants} applicants</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <button
                          onClick={() => handleRemove(job.id)}
                          className="text-red-600 hover:bg-red-50 p-3 rounded-lg transition"
                          title="Remove from saved"
                        >
                          <Heart className="w-6 h-6 fill-current" />
                        </button>

                        <button
                          onClick={() => toggleExpand(job.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                        >
                          {expandedId === job.id ? "Less" : "More"} Details
                          {expandedId === job.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {expandedId === job.id && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="space-y-5">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Requirements
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {job.requirements.map((req, i) => (
                                <span
                                  key={i}
                                  className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium"
                                >
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <button
                              onClick={() =>
                                navigate(
                                  FRONTEND_ROUTES.JOBDETAILS.replace(
                                    ":id",
                                    job.id,
                                  ),
                                )
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition"
                            >
                              View Full Details & Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateSavedJobs;
