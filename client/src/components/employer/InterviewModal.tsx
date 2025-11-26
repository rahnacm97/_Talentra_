import React from "react";
import { Calendar, X, Briefcase, User } from "lucide-react";
import { formatFullName } from "../../utils/formatters";
import type { Interview } from "../../types/interview/interview.types";

interface InterviewDetailsModalProps {
  interview: Interview;
  onClose: () => void;
}

const formatDateTime = (dateIso: string) => {
  return new Date(dateIso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const EmployerInterviewDetailsModal: React.FC<InterviewDetailsModalProps> = ({
  interview,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-200 border-1 rounded-full overflow-hidden flex-shrink-0">
                {interview.candidate.profileImage ? (
                  <img
                    src={interview.candidate.profileImage}
                    alt={interview.candidate.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400 m-auto mt-5" />
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {formatFullName(interview.candidate.fullName)}
                </h2>
                <p className="text-xl text-gray-600 mt-2 flex items-center gap-2">
                  <Briefcase className="w-6 h-6" />
                  {interview.job.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-full transition"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Interview Date */}
          {interview.interviewDate && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
              <div className="flex items-center gap-6">
                <div className="bg-indigo-100 p-5 rounded-2xl">
                  <Calendar className="w-12 h-10 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                    Scheduled Interview
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-2">
                    {formatDateTime(interview.interviewDate)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-6">
              Prepare well and give the candidate a great interview experience
            </p>
            <button
              onClick={onClose}
              className="px-10 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition text-lg shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerInterviewDetailsModal;
