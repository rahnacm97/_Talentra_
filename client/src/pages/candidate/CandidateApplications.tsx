import React, { useState } from "react";
//import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  FileText,
  Briefcase,
  Calendar,
  MapPin,
  Clock,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Building2,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../shared/constants";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  jobType: string;
  description: string;
  requirements: string[];
}

const CandidateApplications: React.FC = () => {
  //const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //const auth = useAppSelector((state) => state.auth);

  const [applications] = useState<Application[]>([
    {
      id: "1",
      jobTitle: "Senior Frontend Developer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      appliedDate: "2025-10-20",
      status: "reviewed",
      jobType: "Full-time",
      description: "We are looking for an experienced frontend developer...",
      requirements: ["React", "TypeScript", "5+ years experience"],
    },
    {
      id: "2",
      jobTitle: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$100k - $130k",
      appliedDate: "2025-10-18",
      status: "shortlisted",
      jobType: "Full-time",
      description: "Join our growing team as a full stack engineer...",
      requirements: ["Node.js", "React", "MongoDB"],
    },
    {
      id: "3",
      jobTitle: "React Developer",
      company: "Digital Agency",
      location: "New York, NY",
      salary: "$90k - $110k",
      appliedDate: "2025-10-15",
      status: "pending",
      jobType: "Contract",
      description: "Looking for a skilled React developer for our projects...",
      requirements: ["React", "Redux", "CSS"],
    },
    {
      id: "4",
      jobTitle: "Software Engineer",
      company: "Enterprise Solutions",
      location: "Austin, TX",
      salary: "$110k - $140k",
      appliedDate: "2025-10-10",
      status: "rejected",
      jobType: "Full-time",
      description: "We need a talented software engineer...",
      requirements: ["Java", "Spring Boot", "Microservices"],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedApplication, setExpandedApplication] = useState<string | null>(
    null,
  );
  const [showFilters, setShowFilters] = useState(false);

  const statusConfig = {
    pending: {
      label: "Pending",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      iconColor: "text-yellow-600",
    },
    reviewed: {
      label: "Reviewed",
      icon: Eye,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      iconColor: "text-blue-600",
    },
    shortlisted: {
      label: "Shortlisted",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 border-green-200",
      iconColor: "text-green-600",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      color: "bg-red-100 text-red-800 border-red-200",
      iconColor: "text-red-600",
    },
    accepted: {
      label: "Accepted",
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      iconColor: "text-purple-600",
    },
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusCount = (status: string) => {
    if (status === "all") return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  const toggleExpand = (id: string) => {
    setExpandedApplication(expandedApplication === id ? null : id);
  };

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getStatusCount("pending")}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getStatusCount("shortlisted")}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Reviewed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getStatusCount("reviewed")}
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Filter by Status:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "all",
                  "pending",
                  "reviewed",
                  "shortlisted",
                  "rejected",
                  "accepted",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      statusFilter === status
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status === "all"
                      ? "All"
                      : statusConfig[status as keyof typeof statusConfig]
                          .label}{" "}
                    ({getStatusCount(status)})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => {
              const StatusIcon = statusConfig[app.status].icon;
              const isExpanded = expandedApplication === app.id;

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <Briefcase className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {app.jobTitle}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-3">
                              <div className="flex items-center space-x-1">
                                <Building2 className="w-4 h-4" />
                                <span className="font-medium">
                                  {app.company}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{app.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{app.salary}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{app.jobType}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Applied on {formatDate(app.appliedDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-3">
                        <div
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border font-medium text-sm ${statusConfig[app.status].color}`}
                        >
                          <StatusIcon
                            className={`w-4 h-4 ${statusConfig[app.status].iconColor}`}
                          />
                          <span>{statusConfig[app.status].label}</span>
                        </div>
                        <button
                          onClick={() => toggleExpand(app.id)}
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

                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="space-y-4">
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
                              {app.requirements.map((req, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium"
                                >
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-3 pt-4">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200">
                              View Job Details
                            </button>
                            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors duration-200">
                              Withdraw Application
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
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Applications Found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't applied to any jobs yet"}
              </p>
              <button
                onClick={() => navigate(FRONTEND_ROUTES.CANDIDATEJOBS)}
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

export default CandidateApplications;
