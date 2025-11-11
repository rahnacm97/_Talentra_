import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Search,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";

interface CandidateInterview {
  id: string;
  jobTitle: string;
  employerName: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Canceled" | "Reschedule";
}

// Static interview data
const staticInterviews: CandidateInterview[] = [
  {
    id: "1",
    jobTitle: "Frontend Developer",
    employerName: "TechCorp",
    date: "2025-11-01",
    time: "10:00",
    status: "Scheduled",
  },
  {
    id: "2",
    jobTitle: "Backend Engineer",
    employerName: "DataSolutions",
    date: "2025-10-28",
    time: "14:30",
    status: "Completed",
  },
  {
    id: "3",
    jobTitle: "Full Stack Developer",
    employerName: "InnovateTech",
    date: "2025-11-05",
    time: "09:00",
    status: "Scheduled",
  },
  {
    id: "4",
    jobTitle: "UI/UX Designer",
    employerName: "CreativeLabs",
    date: "2025-10-20",
    time: "11:00",
    status: "Canceled",
  },
];

const CandidateInterviews: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInterviews, setFilteredInterviews] =
    useState<CandidateInterview[]>(staticInterviews);
  const [interviews, setInterviews] =
    useState<CandidateInterview[]>(staticInterviews);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = interviews;
    if (activeTab !== "all") {
      filtered = interviews.filter(
        (interview: CandidateInterview) => interview.status === activeTab,
      );
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (interview: CandidateInterview) =>
          interview.employerName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          interview.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    setFilteredInterviews(filtered);
  }, [interviews, activeTab, searchQuery]);

  const handleStatusUpdate = (interviewId: string, status: string) => {
    try {
      setInterviews((prev) =>
        prev.map((interview) =>
          interview.id === interviewId
            ? { ...interview, status: status as CandidateInterview["status"] }
            : interview,
        ),
      );
      setSuccessMessage(`Interview ${status.toLowerCase()} successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.log(err);
      toast.error("Failed to update interview status");
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const tabs = [
    { id: "all", label: "All Interviews", icon: Calendar },
    { id: "Scheduled", label: "Scheduled", icon: Clock },
    { id: "Completed", label: "Completed", icon: CheckCircle },
    { id: "Canceled", label: "Canceled", icon: XCircle },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interviews</h1>
          <p className="text-gray-600">
            Manage your scheduled interviews with employers
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Top Bar Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <nav className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by employer or job title"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Interviews List */}
          {loading ? (
            <div className="text-center text-gray-600">
              Loading interviews...
            </div>
          ) : filteredInterviews.length === 0 ? (
            <div className="text-center text-gray-600">
              No interviews found for the selected filter
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInterviews.map((interview: CandidateInterview) => (
                <div
                  key={interview.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <Briefcase className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {interview.jobTitle}
                          </h3>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{interview.employerName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-gray-500 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDateTime(interview.date, interview.time)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span className="capitalize">{interview.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {interview.status === "Scheduled" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(interview.id, "Reschedule")
                            }
                            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Reschedule</span>
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(interview.id, "Canceled")
                            }
                            className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </>
                      )}
                      {interview.status === "Completed" && (
                        <button className="flex items-center space-x-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-not-allowed">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </button>
                      )}
                      {interview.status === "Canceled" && (
                        <button className="flex items-center space-x-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-not-allowed">
                          <XCircle className="w-4 h-4" />
                          <span>Canceled</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateInterviews;
