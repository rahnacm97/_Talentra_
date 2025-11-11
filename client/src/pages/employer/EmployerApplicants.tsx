import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  FileText,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  GraduationCap,
} from "lucide-react";

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  appliedFor: string;
  appliedDate: string;
  status:
    | "pending"
    | "reviewed"
    | "shortlisted"
    | "interview"
    | "rejected"
    | "hired";
  experience: string;
  education: string;
  skills: string[];
  resumeUrl: string;
  coverLetter: string;
  rating?: number;
  notes?: string;
}

const EmployerApplicants: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      appliedFor: "Senior Frontend Developer",
      appliedDate: "2025-10-20",
      status: "shortlisted",
      experience: "5 years",
      education: "BS Computer Science",
      skills: ["React", "TypeScript", "Node.js", "CSS"],
      resumeUrl: "resume_john_doe.pdf",
      coverLetter:
        "I am excited to apply for the Senior Frontend Developer position. With 5 years of experience building scalable web applications, I have developed a strong foundation in React and TypeScript. I'm passionate about creating intuitive user experiences and writing clean, maintainable code.",
      rating: 4,
      notes: "Strong React skills, good communication",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 234-5678",
      location: "San Francisco, CA",
      appliedFor: "Product Manager",
      appliedDate: "2025-10-18",
      status: "interview",
      experience: "7 years",
      education: "MBA, BS Engineering",
      skills: ["Product Strategy", "Agile", "Data Analysis", "Leadership"],
      resumeUrl: "resume_jane_smith.pdf",
      coverLetter:
        "With 7 years of product management experience at leading tech companies, I have successfully launched multiple products that have generated significant revenue. I excel at translating customer needs into actionable product roadmaps and working cross-functionally to deliver results.",
      rating: 5,
      notes: "Excellent PM background, schedule interview ASAP",
    },
    {
      id: "3",
      name: "Michael Johnson",
      email: "m.johnson@example.com",
      phone: "+1 (555) 345-6789",
      location: "Austin, TX",
      appliedFor: "Senior Frontend Developer",
      appliedDate: "2025-10-22",
      status: "pending",
      experience: "4 years",
      education: "BS Information Technology",
      skills: ["JavaScript", "React", "Vue.js", "HTML/CSS"],
      resumeUrl: "resume_michael_johnson.pdf",
      coverLetter:
        "I have been following your company for a while and am impressed by your innovative approach to solving complex problems. My experience with modern JavaScript frameworks and passion for front-end development make me a great fit for this role.",
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      phone: "+1 (555) 456-7890",
      location: "Remote",
      appliedFor: "Marketing Specialist",
      appliedDate: "2025-10-15",
      status: "reviewed",
      experience: "3 years",
      education: "BA Marketing",
      skills: ["SEO", "Content Marketing", "Social Media", "Analytics"],
      resumeUrl: "resume_sarah_williams.pdf",
      coverLetter:
        "As a marketing professional with 3 years of experience, I have helped companies increase their online visibility and drive customer engagement through strategic content marketing and SEO optimization. I'm data-driven and results-oriented.",
      rating: 3,
    },
    {
      id: "5",
      name: "David Brown",
      email: "david.brown@example.com",
      phone: "+1 (555) 567-8901",
      location: "Seattle, WA",
      appliedFor: "Senior Frontend Developer",
      appliedDate: "2025-10-10",
      status: "rejected",
      experience: "2 years",
      education: "BS Computer Science",
      skills: ["HTML", "CSS", "JavaScript", "jQuery"],
      resumeUrl: "resume_david_brown.pdf",
      coverLetter:
        "I am a junior developer looking to grow my skills and take on more challenging projects. I'm a fast learner and eager to contribute to your team's success.",
      notes: "Not enough experience for senior position",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterJob, setFilterJob] = useState<string>("all");
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );
  const [expandedApplicant, setExpandedApplicant] = useState<string | null>(
    null,
  );
  const [editingNotes, setEditingNotes] = useState<string>("");

  const jobTitles = Array.from(new Set(applicants.map((a) => a.appliedFor)));

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.appliedFor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || applicant.status === filterStatus;
    const matchesJob =
      filterJob === "all" || applicant.appliedFor === filterJob;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-purple-100 text-purple-800";
      case "interview":
        return "bg-indigo-100 text-indigo-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "reviewed":
        return <Eye className="w-4 h-4" />;
      case "shortlisted":
        return <Star className="w-4 h-4" />;
      case "interview":
        return <Calendar className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "hired":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const updateApplicantStatus = (
    id: string,
    newStatus: Applicant["status"],
  ) => {
    setApplicants(
      applicants.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app,
      ),
    );
    if (selectedApplicant?.id === id) {
      setSelectedApplicant({ ...selectedApplicant, status: newStatus });
    }
  };

  const updateApplicantRating = (id: string, rating: number) => {
    setApplicants(
      applicants.map((app) => (app.id === id ? { ...app, rating } : app)),
    );
    if (selectedApplicant?.id === id) {
      setSelectedApplicant({ ...selectedApplicant, rating });
    }
  };

  const updateApplicantNotes = (id: string, notes: string) => {
    setApplicants(
      applicants.map((app) => (app.id === id ? { ...app, notes } : app)),
    );
    if (selectedApplicant?.id === id) {
      setSelectedApplicant({ ...selectedApplicant, notes });
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

  const getStatusCounts = () => {
    return {
      total: applicants.length,
      pending: applicants.filter((a) => a.status === "pending").length,
      reviewed: applicants.filter((a) => a.status === "reviewed").length,
      shortlisted: applicants.filter((a) => a.status === "shortlisted").length,
      interview: applicants.filter((a) => a.status === "interview").length,
      rejected: applicants.filter((a) => a.status === "rejected").length,
      hired: applicants.filter((a) => a.status === "hired").length,
    };
  };

  const stats = getStatusCounts();

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Applicants</h1>
          <p className="text-gray-600">Review and manage job applications</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-600">
            <p className="text-gray-500 text-xs font-medium mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-600">
            <p className="text-gray-500 text-xs font-medium mb-1">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
            <p className="text-gray-500 text-xs font-medium mb-1">Reviewed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.reviewed}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-600">
            <p className="text-gray-500 text-xs font-medium mb-1">
              Shortlisted
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.shortlisted}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-600">
            <p className="text-gray-500 text-xs font-medium mb-1">Interview</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.interview}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-600">
            <p className="text-gray-500 text-xs font-medium mb-1">Rejected</p>
            <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-600">
            <p className="text-gray-500 text-xs font-medium mb-1">Hired</p>
            <p className="text-2xl font-bold text-gray-900">{stats.hired}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
              <select
                value={filterJob}
                onChange={(e) => setFilterJob(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Jobs</option>
                {jobTitles.map((job) => (
                  <option key={job} value={job}>
                    {job}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredApplicants.map((applicant) => (
            <div
              key={applicant.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {applicant.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(applicant.status)}`}
                      >
                        {getStatusIcon(applicant.status)}
                        <span className="capitalize">{applicant.status}</span>
                      </span>
                      {applicant.rating && (
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < applicant.rating! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <p className="text-indigo-600 font-medium mb-3">
                      {applicant.appliedFor}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{applicant.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{applicant.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{applicant.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Applied {formatDate(applicant.appliedDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{applicant.experience} experience</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <GraduationCap className="w-4 h-4" />
                        <span>{applicant.education}</span>
                      </div>
                    </div>

                    {expandedApplicant === applicant.id && (
                      <div className="mt-4 pt-4 border-t space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {applicant.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Cover Letter
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {applicant.coverLetter}
                          </p>
                        </div>

                        {applicant.notes && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Internal Notes
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed bg-yellow-50 p-3 rounded-lg">
                              {applicant.notes}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              updateApplicantStatus(applicant.id, "reviewed")
                            }
                            disabled={applicant.status === "reviewed"}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Mark as Reviewed
                          </button>
                          <button
                            onClick={() =>
                              updateApplicantStatus(applicant.id, "shortlisted")
                            }
                            disabled={applicant.status === "shortlisted"}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() =>
                              updateApplicantStatus(applicant.id, "interview")
                            }
                            disabled={applicant.status === "interview"}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Schedule Interview
                          </button>
                          <button
                            onClick={() =>
                              updateApplicantStatus(applicant.id, "hired")
                            }
                            disabled={applicant.status === "hired"}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Hire
                          </button>
                          <button
                            onClick={() =>
                              updateApplicantStatus(applicant.id, "rejected")
                            }
                            disabled={applicant.status === "rejected"}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => setSelectedApplicant(applicant)}
                      className="text-indigo-600 hover:text-indigo-800 p-2 bg-indigo-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded-lg transition-colors"
                      title="Download Resume"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800 p-2 bg-green-50 rounded-lg transition-colors"
                      title="Send Message"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setExpandedApplicant(
                          expandedApplicant === applicant.id
                            ? null
                            : applicant.id,
                        )
                      }
                      className="text-gray-600 hover:text-gray-800 p-2 bg-gray-50 rounded-lg transition-colors"
                      title={
                        expandedApplicant === applicant.id
                          ? "Collapse"
                          : "Expand"
                      }
                    >
                      {expandedApplicant === applicant.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredApplicants.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No applicants found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {selectedApplicant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedApplicant.name}
                  </h2>
                  <p className="text-indigo-600 font-medium mt-1">
                    {selectedApplicant.appliedFor}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 ${getStatusColor(selectedApplicant.status)}`}
                  >
                    {getStatusIcon(selectedApplicant.status)}
                    <span className="capitalize">
                      {selectedApplicant.status}
                    </span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      Rating:
                    </span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            updateApplicantRating(selectedApplicant.id, star)
                          }
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 cursor-pointer transition-colors ${
                              star <= (selectedApplicant.rating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 hover:text-yellow-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Mail className="w-5 h-5" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium">{selectedApplicant.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Phone className="w-5 h-5" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-medium">{selectedApplicant.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium">
                          {selectedApplicant.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <div>
                        <p className="text-xs text-gray-500">Applied Date</p>
                        <p className="font-medium">
                          {formatDate(selectedApplicant.appliedDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Background
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Briefcase className="w-5 h-5 text-indigo-600" />
                        <p className="font-semibold text-gray-900">
                          Experience
                        </p>
                      </div>
                      <p className="text-gray-600">
                        {selectedApplicant.experience}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <GraduationCap className="w-5 h-5 text-indigo-600" />
                        <p className="font-semibold text-gray-900">Education</p>
                      </div>
                      <p className="text-gray-600">
                        {selectedApplicant.education}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Cover Letter
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 leading-relaxed">
                      {selectedApplicant.coverLetter}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Resume
                  </h3>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-indigo-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedApplicant.resumeUrl}
                        </p>
                        <p className="text-sm text-gray-600">PDF Document</p>
                      </div>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Internal Notes
                  </h3>
                  <textarea
                    value={
                      editingNotes !== ""
                        ? editingNotes
                        : selectedApplicant.notes || ""
                    }
                    onChange={(e) => setEditingNotes(e.target.value)}
                    onBlur={() => {
                      if (editingNotes !== "") {
                        updateApplicantNotes(
                          selectedApplicant.id,
                          editingNotes,
                        );
                        setEditingNotes("");
                      }
                    }}
                    placeholder="Add notes about this applicant..."
                    className="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Update Status
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        updateApplicantStatus(selectedApplicant.id, "pending")
                      }
                      disabled={selectedApplicant.status === "pending"}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <Clock className="w-4 h-4 inline mr-1" />
                      Pending
                    </button>
                    <button
                      onClick={() =>
                        updateApplicantStatus(selectedApplicant.id, "reviewed")
                      }
                      disabled={selectedApplicant.status === "reviewed"}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <Eye className="w-4 h-4 inline mr-1" />
                      Reviewed
                    </button>
                    <button
                      onClick={() =>
                        updateApplicantStatus(
                          selectedApplicant.id,
                          "shortlisted",
                        )
                      }
                      disabled={selectedApplicant.status === "shortlisted"}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <Star className="w-4 h-4 inline mr-1" />
                      Shortlist
                    </button>
                    <button
                      onClick={() =>
                        updateApplicantStatus(selectedApplicant.id, "interview")
                      }
                      disabled={selectedApplicant.status === "interview"}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Interview
                    </button>
                    <button
                      onClick={() =>
                        updateApplicantStatus(selectedApplicant.id, "hired")
                      }
                      disabled={selectedApplicant.status === "hired"}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Hire
                    </button>
                    <button
                      onClick={() =>
                        updateApplicantStatus(selectedApplicant.id, "rejected")
                      }
                      disabled={selectedApplicant.status === "rejected"}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4 inline mr-1" />
                      Reject
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setSelectedApplicant(null)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Message</span>
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

export default EmployerApplicants;
