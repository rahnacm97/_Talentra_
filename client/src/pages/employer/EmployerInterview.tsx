import React, { useEffect, useState, useMemo } from "react";
import { Calendar, User, Briefcase, Search, Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchEmployerApplications } from "../../thunks/employer.thunk";
import { formatFullName } from "../../utils/formatters";
import EmployerInterviewDetailsModal from "../../components/employer/InterviewModal";

interface Interview {
  id: string;
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  interviewDate: string;
  candidate: { profileImage?: string };
}

const EmployerInterview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { applications, appLoading } = useAppSelector((s) => s.employer);
  const { user } = useAppSelector((s) => s.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null,
  );

  useEffect(() => {
    if (user?._id) {
      dispatch(
        fetchEmployerApplications({
          employerId: user._id,
          status: "interview",
          limit: 100,
        }),
      );
    }
  }, [dispatch, user]);

  const interviews = useMemo(() => {
    return applications
      .filter((app) => app.status === "interview" && app.interviewDate)
      .map((app) => ({
        id: app.id,
        applicationId: app.id,
        candidateName: app.fullName,
        jobTitle: app.jobTitle,
        interviewDate: app.interviewDate!,
        candidate: app.candidate || {},
      }));
  }, [applications]);

  const filteredInterviews = interviews.filter(
    (i) =>
      i.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (appLoading) {
    return (
      <div className="py-20 text-center text-gray-600">
        Loading interviews...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Scheduled Interviews
          </h1>
          <p className="text-gray-600">
            View and manage your upcoming candidate interviews
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate or job title..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredInterviews.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl shadow-lg">
              <Calendar className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700">
                No interviews scheduled
              </h3>
              <p className="text-gray-500 mt-2">
                Interviews will appear here once scheduled
              </p>
            </div>
          ) : (
            filteredInterviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedInterview(interview)}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gray-200 border-1 rounded-full overflow-hidden flex-shrink-0">
                    {interview.candidate.profileImage ? (
                      <img
                        src={interview.candidate.profileImage}
                        alt={interview.candidateName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400 m-auto mt-4" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {formatFullName(interview.candidateName)}
                    </h3>
                    <p className="text-lg text-gray-600 mt-1 flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      {interview.jobTitle}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <span className="font-medium">
                        {new Date(interview.interviewDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInterview(interview);
                    }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium"
                  >
                    <Eye className="w-5 h-5" />
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reusable Modal */}
        {selectedInterview && (
          <EmployerInterviewDetailsModal
            interview={selectedInterview}
            onClose={() => setSelectedInterview(null)}
          />
        )}
      </div>
    </div>
  );
};

export default EmployerInterview;
