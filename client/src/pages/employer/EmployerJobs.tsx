import React, { useState } from "react";
import {
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  Search,
  Filter,
  Building2,
  X,
  Save,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: "active" | "closed" | "draft";
  applicants: number;
  postedDate: string;
  deadline: string;
}

const EmployerJobs: React.FC = () => {
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "1",
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $150k",
      description:
        "We are looking for an experienced frontend developer to join our team.",
      requirements: [
        "5+ years of React experience",
        "TypeScript proficiency",
        "Strong CSS skills",
      ],
      responsibilities: [
        "Build responsive web applications",
        "Collaborate with designers",
        "Code reviews",
      ],
      status: "active",
      applicants: 24,
      postedDate: "2025-10-15",
      deadline: "2025-11-15",
    },
    {
      id: "2",
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time",
      salary: "$130k - $160k",
      description: "Lead product strategy and execution for our core products.",
      requirements: [
        "3+ years PM experience",
        "Data-driven mindset",
        "Excellent communication",
      ],
      responsibilities: [
        "Define product roadmap",
        "Analyze metrics",
        "Stakeholder management",
      ],
      status: "active",
      applicants: 18,
      postedDate: "2025-10-20",
      deadline: "2025-11-20",
    },
    {
      id: "3",
      title: "Marketing Specialist",
      department: "Marketing",
      location: "San Francisco, CA",
      type: "Contract",
      salary: "$80k - $100k",
      description: "Drive marketing campaigns and brand awareness.",
      requirements: [
        "SEO/SEM experience",
        "Content creation",
        "Analytics tools",
      ],
      responsibilities: [
        "Plan campaigns",
        "Create content",
        "Track performance",
      ],
      status: "closed",
      applicants: 42,
      postedDate: "2025-09-10",
      deadline: "2025-10-10",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "closed" | "draft"
  >("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: [""],
    responsibilities: [""],
    deadline: "",
  });

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handlePostJob = () => {
    const job: Job = {
      id: Date.now().toString(),
      title: newJob.title || "",
      department: newJob.department || "",
      location: newJob.location || "",
      type: newJob.type || "Full-time",
      salary: newJob.salary || "",
      description: newJob.description || "",
      requirements: newJob.requirements?.filter((r) => r.trim()) || [],
      responsibilities: newJob.responsibilities?.filter((r) => r.trim()) || [],
      status: "active",
      applicants: 0,
      postedDate: new Date().toISOString().split("T")[0],
      deadline: newJob.deadline || "",
    };

    setJobs([job, ...jobs]);
    setShowPostJobModal(false);
    resetNewJob();
  };

  const handleUpdateJob = () => {
    if (!editingJob) return;

    setJobs(jobs.map((job) => (job.id === editingJob.id ? editingJob : job)));
    setEditingJob(null);
    setSelectedJob(null);
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      setJobs(jobs.filter((job) => job.id !== id));
      setSelectedJob(null);
    }
  };

  const resetNewJob = () => {
    setNewJob({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      salary: "",
      description: "",
      requirements: [""],
      responsibilities: [""],
      deadline: "",
    });
  };

  const addArrayField = (
    field: "requirements" | "responsibilities",
    isEditing: boolean = false,
  ) => {
    if (isEditing && editingJob) {
      setEditingJob({
        ...editingJob,
        [field]: [...editingJob[field], ""],
      });
    } else {
      setNewJob({
        ...newJob,
        [field]: [...(newJob[field] || [""]), ""],
      });
    }
  };

  const updateArrayField = (
    field: "requirements" | "responsibilities",
    index: number,
    value: string,
    isEditing: boolean = false,
  ) => {
    if (isEditing && editingJob) {
      const updated = [...editingJob[field]];
      updated[index] = value;
      setEditingJob({ ...editingJob, [field]: updated });
    } else {
      const updated = [...(newJob[field] || [""])];
      updated[index] = value;
      setNewJob({ ...newJob, [field]: updated });
    }
  };

  const removeArrayField = (
    field: "requirements" | "responsibilities",
    index: number,
    isEditing: boolean = false,
  ) => {
    if (isEditing && editingJob) {
      setEditingJob({
        ...editingJob,
        [field]: editingJob[field].filter((_, i) => i !== index),
      });
    } else {
      setNewJob({
        ...newJob,
        [field]: (newJob[field] || [""]).filter((_, i) => i !== index),
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
              <p className="text-gray-600 mt-1">
                Post new positions and manage existing job listings
              </p>
            </div>
            <button
              onClick={() => setShowPostJobModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Post New Job</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Jobs
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">
                    {jobs.length}
                  </h3>
                </div>
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Active Jobs
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">
                    {jobs.filter((j) => j.status === "active").length}
                  </h3>
                </div>
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Applicants
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">
                    {jobs.reduce((sum, job) => sum + job.applicants, 0)}
                  </h3>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Closed Jobs
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">
                    {jobs.filter((j) => j.status === "closed").length}
                  </h3>
                </div>
                <Briefcase className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by title or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
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
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}
                    >
                      {job.status}
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
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span className="text-gray-700">
                        <span className="font-semibold">{job.applicants}</span>{" "}
                        applicants
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
                    onClick={() => setSelectedJob(job)}
                    className="text-indigo-600 hover:text-indigo-800 p-2 bg-indigo-50 rounded-lg transition-colors duration-200"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingJob(job)}
                    className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-red-600 hover:text-red-800 p-2 bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Post Job Modal */}
        {showPostJobModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Post New Job
                </h2>
                <button
                  onClick={() => {
                    setShowPostJobModal(false);
                    resetNewJob();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={newJob.title}
                      onChange={(e) =>
                        setNewJob({ ...newJob, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. Senior Frontend Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      value={newJob.department}
                      onChange={(e) =>
                        setNewJob({ ...newJob, department: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. Engineering"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={newJob.location}
                      onChange={(e) =>
                        setNewJob({ ...newJob, location: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. Remote, New York, NY"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type *
                    </label>
                    <select
                      value={newJob.type}
                      onChange={(e) =>
                        setNewJob({ ...newJob, type: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range *
                    </label>
                    <input
                      type="text"
                      value={newJob.salary}
                      onChange={(e) =>
                        setNewJob({ ...newJob, salary: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. $120k - $150k"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Deadline *
                    </label>
                    <input
                      type="date"
                      value={newJob.deadline}
                      onChange={(e) =>
                        setNewJob({ ...newJob, deadline: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    value={newJob.description}
                    onChange={(e) =>
                      setNewJob({ ...newJob, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Describe the role and what you're looking for..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  {(newJob.requirements || [""]).map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="text"
                        value={req}
                        onChange={(e) =>
                          updateArrayField(
                            "requirements",
                            index,
                            e.target.value,
                          )
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. 5+ years of React experience"
                      />
                      {(newJob.requirements || [""]).length > 1 && (
                        <button
                          onClick={() =>
                            removeArrayField("requirements", index)
                          }
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayField("requirements")}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Requirement</span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsibilities
                  </label>
                  {(newJob.responsibilities || [""]).map((resp, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) =>
                          updateArrayField(
                            "responsibilities",
                            index,
                            e.target.value,
                          )
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. Build responsive web applications"
                      />
                      {(newJob.responsibilities || [""]).length > 1 && (
                        <button
                          onClick={() =>
                            removeArrayField("responsibilities", index)
                          }
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayField("responsibilities")}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Responsibility</span>
                  </button>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowPostJobModal(false);
                      resetNewJob();
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePostJob}
                    disabled={
                      !newJob.title || !newJob.department || !newJob.location
                    }
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Post Job</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Job Modal */}
        {selectedJob && !editingJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedJob.title}
                  </h2>
                  <p className="text-gray-600 mt-1">{selectedJob.department}</p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{selectedJob.type}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{selectedJob.salary}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedJob.status)}`}
                    >
                      {selectedJob.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Requirements
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Responsibilities
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {selectedJob.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Posted Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(selectedJob.postedDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Application Deadline
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(selectedJob.deadline)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Applicants</p>
                    <p className="font-semibold text-gray-900">
                      {selectedJob.applicants}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setEditingJob(selectedJob);
                      setSelectedJob(null);
                    }}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Edit3 className="w-5 h-5" />
                    <span>Edit Job</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Job Modal */}
        {editingJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Job</h2>
                <button
                  onClick={() => setEditingJob(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={editingJob.title}
                      onChange={(e) =>
                        setEditingJob({ ...editingJob, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      value={editingJob.department}
                      onChange={(e) =>
                        setEditingJob({
                          ...editingJob,
                          department: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={editingJob.location}
                      onChange={(e) =>
                        setEditingJob({
                          ...editingJob,
                          location: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type *
                    </label>
                    <select
                      value={editingJob.type}
                      onChange={(e) =>
                        setEditingJob({ ...editingJob, type: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range *
                    </label>
                    <input
                      type="text"
                      value={editingJob.salary}
                      onChange={(e) =>
                        setEditingJob({ ...editingJob, salary: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Deadline *
                    </label>
                    <input
                      type="date"
                      value={editingJob.deadline}
                      onChange={(e) =>
                        setEditingJob({
                          ...editingJob,
                          deadline: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editingJob.status}
                      onChange={(e) =>
                        setEditingJob({
                          ...editingJob,
                          status: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    value={editingJob.description}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  {editingJob.requirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="text"
                        value={req}
                        onChange={(e) =>
                          updateArrayField(
                            "requirements",
                            index,
                            e.target.value,
                            true,
                          )
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {editingJob.requirements.length > 1 && (
                        <button
                          onClick={() =>
                            removeArrayField("requirements", index, true)
                          }
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayField("requirements", true)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Requirement</span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsibilities
                  </label>
                  {editingJob.responsibilities.map((resp, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) =>
                          updateArrayField(
                            "responsibilities",
                            index,
                            e.target.value,
                            true,
                          )
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {editingJob.responsibilities.length > 1 && (
                        <button
                          onClick={() =>
                            removeArrayField("responsibilities", index, true)
                          }
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayField("responsibilities", true)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Responsibility</span>
                  </button>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setEditingJob(null)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateJob}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerJobs;
