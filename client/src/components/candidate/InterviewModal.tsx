import React from "react";
import { Calendar, CheckCircle, Building2, X } from "lucide-react";

interface InterviewDetailsModalProps {
  interview: {
    jobTitle: string;
    employerName: string;
    interviewDate: string;
    status: "Scheduled" | "Completed" | "Canceled";
  };
  onClose: () => void;
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

const InterviewDetailsModal: React.FC<InterviewDetailsModalProps> = ({
  interview,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {interview.jobTitle}
              </h2>
              <p className="text-xl text-gray-600 mt-3 flex items-center gap-3">
                <Building2 className="w-6 h-6" />
                {interview.employerName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-full transition"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Interview Date & Time */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
              <div className="flex items-center gap-5">
                <div className="bg-indigo-100 p-4 rounded-xl">
                  <Calendar className="w-10 h-10 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-indigo-700 uppercase tracking-wider">
                    Scheduled Interview
                  </p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {formatDateTime(interview.interviewDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-5">
              <div className="bg-green-100 p-4 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold text-green-700">
                  {interview.status}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-4">
                Good luck with your interview! Be on time and stay confident
              </p>
              <button
                onClick={onClose}
                className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition text-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailsModal;
