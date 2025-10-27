import React, { useState } from "react";
//import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  Heart,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  Trash2,
  ExternalLink,
  TrendingUp,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../shared/constants";

interface SavedJob {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary: string;
  jobType: string;
  experience: string;
  postedDate: string;
  savedDate: string;
  deadline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  applicants: number;
  remote: boolean;
}

const CandidateSavedJobs: React.FC = () => {
  //const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //const auth = useAppSelector((state) => state.auth);

  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([
    {
      id: "1",
      jobTitle: "Senior Frontend Developer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      jobType: "Full-time",
      experience: "5+ years",
      postedDate: "2025-10-20",
      savedDate: "2025-10-22",
      deadline: "2025-11-20",
      description:
        "We are looking for an experienced frontend developer to join our team and help build cutting-edge web applications using React and TypeScript.",
      requirements: [
        "React",
        "TypeScript",
        "5+ years experience",
        "CSS/Tailwind",
        "Git",
      ],
      benefits: ["Health Insurance", "401k", "Remote Work", "Flexible Hours"],
      applicants: 45,
      remote: true,
    },
    {
      id: "2",
      jobTitle: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$100k - $130k",
      jobType: "Full-time",
      experience: "3-5 years",
      postedDate: "2025-10-18",
      savedDate: "2025-10-20",
      deadline: "2025-11-15",
      description:
        "Join our growing team as a full stack engineer. Work on both frontend and backend systems, building scalable solutions for our customers.",
      requirements: ["Node.js", "React", "MongoDB", "REST APIs", "Docker"],
      benefits: ["Stock Options", "Health Insurance", "Learning Budget"],
      applicants: 32,
      remote: true,
    },
    {
      id: "3",
      jobTitle: "UI/UX Developer",
      company: "Creative Studios",
      location: "Los Angeles, CA",
      salary: "$95k - $120k",
      jobType: "Full-time",
      experience: "3+ years",
      postedDate: "2025-10-15",
      savedDate: "2025-10-18",
      deadline: "2025-11-10",
      description:
        "Join our creative team to design and develop beautiful user interfaces. Strong design sense and coding skills required.",
      requirements: ["Figma", "React", "CSS", "Animation", "Design Systems"],
      benefits: ["Creative Freedom", "Health Insurance", "Gym Membership"],
      applicants: 28,
      remote: false,
    },
    {
      id: "4",
      jobTitle: "React Native Developer",
      company: "Mobile First Inc",
      location: "Austin, TX",
      salary: "$110k - $140k",
      jobType: "Full-time",
      experience: "4+ years",
      postedDate: "2025-10-12",
      savedDate: "2025-10-15",
      deadline: "2025-11-05",
      description:
        "Build amazing mobile applications with React Native. Work on products used by millions of users worldwide.",
      requirements: [
        "React Native",
        "JavaScript",
        "iOS/Android",
        "Redux",
        "API Integration",
      ],
      benefits: ["Competitive Salary", "Stock Options", "Conference Budget"],
      applicants: 38,
      remote: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("savedDate");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = savedJobs
    .filter((job) => {
      const matchesSearch =
        job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        jobTypeFilter === "all" || job.jobType === jobTypeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "savedDate") {
        return (
          new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
        );
      } else if (sortBy === "deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const toggleExpand = (id: string) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  const handleRemoveJob = (jobId: string) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
  };

  const handleApply = (jobId: string) => {
    console.log("Applying to job:", jobId);
    navigate(FRONTEND_ROUTES.HOME);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
          </div>
          <p className="text-gray-600">
            Keep track of jobs you're interested in and apply when ready
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Saved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedJobs.length}
                </p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Remote Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedJobs.filter((j) => j.remote).length}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Full-time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedJobs.filter((j) => j.jobType === "Full-time").length}
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    savedJobs.filter((j) => getDaysRemaining(j.deadline) <= 7)
                      .length
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search saved jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="savedDate">Sort by: Recently Saved</option>
              <option value="deadline">Sort by: Deadline</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {showFilters && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Filter by Job Type:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "all",
                  "Full-time",
                  "Part-time",
                  "Contract",
                  "Internship",
                ].map((type) => (
                  <button
                    key={type}
                    onClick={() => setJobTypeFilter(type)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      jobTypeFilter === type
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type === "all" ? "All Jobs" : type} (
                    {type === "all"
                      ? savedJobs.length
                      : savedJobs.filter((j) => j.jobType === type).length}
                    )
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
              const isExpanded = expandedJob === job.id;
              const daysRemaining = getDaysRemaining(job.deadline);
              const isExpiringSoon = daysRemaining <= 7;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                          {job.company.substring(0, 2).toUpperCase()}
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {job.jobTitle}
                            </h3>
                            <p className="text-lg text-gray-700 font-medium mb-2">
                              {job.company}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveJob(job.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Remove from saved"
                          >
                            <Heart className="w-6 h-6 fill-red-500" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 flex-shrink-0" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4 flex-shrink-0" />
                            <span>{job.jobType}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4 flex-shrink-0" />
                            <span>{job.experience}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 flex-shrink-0" />
                            <span>{job.applicants} applicants</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.remote && (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                              Remote
                            </span>
                          )}
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                            {job.jobType}
                          </span>
                        </div>

                        {/* Dates */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>Saved {formatDate(job.savedDate)}</span>
                          </div>
                          <div
                            className={`flex items-center space-x-1 ${
                              isExpiringSoon
                                ? "text-red-600 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            <Clock className="w-4 h-4" />
                            <span>
                              {daysRemaining > 0
                                ? `${daysRemaining} days left to apply`
                                : "Deadline passed"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 md:items-end">
                        <button
                          onClick={() => handleApply(job.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 whitespace-nowrap"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Apply Now</span>
                        </button>
                        <button
                          onClick={() => toggleExpand(job.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1"
                        >
                          <span>{isExpanded ? "Less" : "More"} Details</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Job Description
                            </h4>
                            <p className="text-gray-600 leading-relaxed">
                              {job.description}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Requirements
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {job.requirements.map((req, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium"
                                >
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Benefits
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {job.benefits.map((benefit, index) => (
                                <span
                                  key={index}
                                  className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium"
                                >
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                              onClick={() => handleApply(job.id)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                              <ExternalLink className="w-5 h-5" />
                              <span>Apply to This Job</span>
                            </button>
                            <button
                              onClick={() => handleRemoveJob(job.id)}
                              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                              <Trash2 className="w-5 h-5" />
                              <span>Remove from Saved</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Saved Jobs Found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || jobTypeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start saving jobs you're interested in to keep track of them"}
              </p>
              <button
                onClick={() => navigate(FRONTEND_ROUTES.CANDIDATESAVEDJOBS)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <Briefcase className="w-5 h-5" />
                <span>Browse Jobs</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateSavedJobs;
