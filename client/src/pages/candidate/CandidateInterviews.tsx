import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  User,
  Briefcase,
  CheckCircle,
  Eye,
  XCircle,
  Search,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchMyApplications } from "../../thunks/candidate.thunks";
import InterviewDetailsModal from "../../components/candidate/InterviewModal";

interface CandidateInterview {
  id: string;
  applicationId: string;
  jobTitle: string;
  employerName: string;
  location: string;
  interviewDate: string;
  status: "Scheduled" | "Completed" | "Canceled";
}

const formatDateTime = (dateIso: string) => {
  const date = new Date(dateIso);
  return (
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    " at " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
};

const CandidateInterviews: React.FC = () => {
  const dispatch = useAppDispatch();
  const { applications, appsLoading } = useAppSelector((s) => s.candidate);

  const [activeTab, setActiveTab] = useState<
    "all" | "Scheduled" | "Completed" | "Canceled"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterview, setSelectedInterview] =
    useState<CandidateInterview | null>(null);

  const interviews = useMemo(() => {
    return applications
      .filter((app) => app.status === "interview" && app.interviewDate)
      .map((app) => ({
        id: app.id,
        applicationId: app.id,
        jobTitle: app.jobTitle,
        employerName: app.name,
        location: app.location || "Not specified",
        interviewDate: app.interviewDate!,
        status: "Scheduled" as const,
      }));
  }, [applications]);

  const filteredInterviews = useMemo(() => {
    let filtered = [...interviews];

    if (activeTab !== "all") {
      filtered = filtered.filter((i) => i.status === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.jobTitle.toLowerCase().includes(q) ||
          i.employerName.toLowerCase().includes(q),
      );
    }

    return filtered;
  }, [interviews, activeTab, searchQuery]);

  useEffect(() => {
    dispatch(fetchMyApplications({ limit: 100 }));
  }, [dispatch]);

  const tabs = [
    { value: "all", label: "All Interviews", icon: Calendar },
    { value: "Scheduled", label: "Scheduled", icon: Clock },
    { value: "Completed", label: "Completed", icon: CheckCircle },
    { value: "Canceled", label: "Canceled", icon: XCircle },
  ];

  if (appsLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-64"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow h-40"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interviews</h1>
          <p className="text-gray-600">
            Manage your upcoming and past interview schedules
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <nav className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => {
              const count =
                tab.value === "all"
                  ? interviews.length
                  : interviews.filter((i) => i.status === tab.value).length;

              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value as any)}
                  className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab.value
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title or company..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        {/* Interviews List - Same as before */}
        <div className="space-y-6">
          {filteredInterviews.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow">
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 font-medium">
                {searchQuery || activeTab !== "all"
                  ? "No interviews match your search"
                  : "No interviews scheduled yet"}
              </p>
              <p className="text-gray-500 mt-2">
                Keep applying — your next opportunity is waiting!
              </p>
            </div>
          ) : (
            filteredInterviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-100 p-4 rounded-xl">
                        <Briefcase className="w-7 h-7 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {interview.jobTitle}
                        </h3>

                        <p className="text-gray-600 flex items-center gap-2 mt-1 text-lg">
                          <User className="w-5 h-5" />
                          {interview.employerName}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-8 text-base">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar className="w-6 h-6 text-indigo-600" />
                        <span className="font-semibold">
                          {formatDateTime(interview.interviewDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <span className="font-semibold text-green-700">
                          {interview.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={() => setSelectedInterview(interview)}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-md cursor-pointer"
                    >
                      <Eye className="w-5 h-5" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {selectedInterview && (
          <InterviewDetailsModal
            interview={selectedInterview}
            onClose={() => setSelectedInterview(null)}
          />
        )}
      </div>
    </div>
  );
};

export default CandidateInterviews;
