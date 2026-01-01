import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchJobsForCandidate } from "../../thunks/job.thunk";
import { toggleSkill, clearSkills } from "../../features/job/jobSlice";
import { formatExperience } from "../../utils/formatters";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Filter,
  Building2,
  Users,
  X,
} from "lucide-react";
import Pagination from "../../components/common/pagination/Pagination";
import { Link } from "react-router-dom";
import Header from "../common/Header";
import { FRONTEND_ROUTES } from "../../shared/constants/constants";
import type { JobResponse } from "../../types/job/job.types";
import type { ExperienceLevel } from "../../shared/validations/JobFormValidation";

const JobView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, total, loading } = useAppSelector(
    (state) => state.candidateJobs,
  );
  const { availableSkills, selectedSkills } = useAppSelector(
    (s) => s.candidateJobs,
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState<
    "all" | "Full-time" | "Part-time" | "Contract" | "Internship"
  >("all");
  const [experience, setExperience] = useState<
    "all" | "0" | "1-2" | "3-5" | "6-8" | "9-12" | "13+"
  >("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const limit = 5;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, location, jobType, experience]);

  useEffect(() => {
    dispatch(
      fetchJobsForCandidate({
        page,
        limit,
        search: debouncedSearch || undefined,
        location: location || undefined,
        type: jobType === "all" ? undefined : jobType,
        experience: experience === "all" ? undefined : experience,
        skills: selectedSkills.length ? selectedSkills : undefined,
      }),
    );
  }, [
    dispatch,
    page,
    debouncedSearch,
    location,
    jobType,
    experience,
    selectedSkills,
  ]);

  const totalPages = Math.ceil(total / limit);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("all");
    setExperience("all");
    dispatch(clearSkills());
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
            Find Your Dream Job
          </h2>
          <p className="text-gray-600 text-center mb-8">
            {total} jobs available
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                <SearchIcon className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Job title, company"
                  className="w-full bg-transparent outline-none text-gray-700"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="City or location"
                  className="w-full bg-transparent outline-none text-gray-700"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                {location && (
                  <button
                    onClick={() => setLocation("")}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all cursor-pointer">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Job Type</h4>
                <div className="space-y-2">
                  {[
                    "all",
                    "Full-time",
                    "Part-time",
                    "Contract",
                    "Internship",
                  ].map((type) => {
                    return (
                      <label
                        key={type}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="jobType"
                          checked={jobType === type}
                          onChange={() => setJobType(type as any)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-3 text-gray-700">
                          {type === "all" ? "All Types" : type}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Experience Level
                </h4>
                <div className="space-y-2">
                  {["all", "0", "1-2", "3-5", "6-8", "9-12", "13+"].map(
                    (exp) => (
                      <label
                        key={exp}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="experience"
                          checked={experience === exp}
                          onChange={() => setExperience(exp as ExperienceLevel)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-3 text-gray-700">
                          {exp === "all"
                            ? "All Levels"
                            : formatExperience(exp as ExperienceLevel)}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Skills</h4>
                  {selectedSkills.length > 0 && (
                    <button
                      onClick={() => dispatch(clearSkills())}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableSkills.map((skill) => (
                    <label
                      key={skill}
                      className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => dispatch(toggleSkill(skill))}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm text-gray-700 capitalize">
                        {skill}
                      </span>
                    </label>
                  ))}
                </div>

                {selectedSkills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                        <button
                          onClick={() => dispatch(toggleSkill(skill))}
                          className="hover:text-indigo-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{jobs.length}</span> of{" "}
                <span className="font-semibold">{total}</span> jobs
              </p>
            </div>

            <div className="space-y-4">
              {jobs.map((job: JobResponse) => {
                const company = job.employer;

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.companyName}
                            className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                            {company.companyName.charAt(0)}
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Link
                                to={FRONTEND_ROUTES.JOBDETAILS.replace(
                                  ":id",
                                  job.id,
                                )}
                                className="text-xl font-bold text-gray-900 hover:text-indigo-600"
                              >
                                {job.title}
                              </Link>
                              <p className="text-gray-600 flex items-center mt-1">
                                <Building2 className="w-4 h-4 mr-1" />
                                {company.companyName}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              {job.type}
                            </span>
                            {job.salary && (
                              <span className="flex items-center text-green-600 font-medium">
                                <IndianRupee className="w-4 h-4 mr-1" />
                                {job.salary}
                              </span>
                            )}
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatExperience(job.experience)}
                            </span>
                            <span
                              className={`flex items-center text-sm font-medium ${job.status === "active" ? "text-green-700" : job.status === "closed" ? "text-red-700" : "text-gray-600"}`}
                            >
                              {job.status === "active" ? (
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              ) : job.status === "closed" ? (
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              ) : (
                                <Briefcase className="w-4 h-4 mr-1" />
                              )}
                              {job.status.charAt(0).toUpperCase() +
                                job.status.slice(1)}
                            </span>
                          </div>

                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {job.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Link
                                to={FRONTEND_ROUTES.JOBDETAILS.replace(
                                  ":id",
                                  job.id,
                                )}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition"
                              >
                                View Details
                              </Link>
                            </div>

                            <div className="text-xs text-gray-500 flex items-center gap-4">
                              <span className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {job.applicants} applicants
                              </span>
                              <span>
                                Posted{" "}
                                {new Date(job.postedDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {jobs.length === 0 && !loading && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobView;
